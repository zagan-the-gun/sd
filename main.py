from fastapi import FastAPI, Form, BackgroundTasks, File, UploadFile, status, Response
from pydantic import BaseModel
from typing import Union

from fastapi.responses import FileResponse

import re
import subprocess
import random, string
import requests
import shutil
import os



app = FastAPI()

UPLOAD_DIR = "./files"

@app.post("/img_test/")
async def img_test(prompt: str = Form(), seed: int = Form()):
    print('DEAD BEEF')
    print(f'prompt: {prompt}, seed: {seed}')
    return FileResponse('/home/ishizuka/stable-diffusion/outputs/img2img-samples/filename-grid.png')


@app.post("/test/")
async def test(prompt: str = Form(), seed: int = Form()):
    return {"prompt": prompt, "seed": seed }


def heavy_task(user_name, prompt, options):
    print('heavyなtask開始')
    filename = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
    print(filename)

    subprocess.run(f'/home/ishizuka/txt2img.sh {filename} "{prompt}" "{options}"', shell=True)
    img = {'file': open(f"/home/ishizuka/stable-diffusion/outputs/txt2img-samples/{filename}-grid.png", 'rb')}
    param = {
        'token':os.environ.get('SLACK_TOKEN'),
        'channels':os.environ.get('SLACK_CHANNEL'),
        'filename': user_name + filename + '.png',
        #'filename': 'IATer75irH0JUhjz-grid-0004.png',
        'initial_comment': f'{user_name}\n{prompt}',
        'title': user_name + '-' + filename + '.png'
        #'title': 'IATer75irH0JUhjz-grid-0004.png'
        }
    requests.post(url="https://slack.com/api/files.upload",params=param, files=img)

    subprocess.run(f"rm /home/ishizuka/stable-diffusion/outputs/txt2img-samples/{filename}-grid.png", shell=True)
    subprocess.run(f"rm /home/ishizuka/stable-diffusion/outputs/txt2img-samples/samples/{filename}*.png", shell=True)
    print('heavyなtask終了')

@app.post("/")
async def txt2img_old(background_task:BackgroundTasks, user_name: str = Form(), text: str = Form()):
#async def heavytask_run(user_name: str, text: str, background_task:BackgroundTasks):
    print(text)
    #filename = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
    #prompt = re.sub('^ ', '', re.sub('^sd', '', text))
    search = re.search(r'"(.*)" (.*)', text)
    prompt = search.group(1)
    options = search.group(2)
    print(f'prompt: {prompt}')
    print(f'options: {options}')
    background_task.add_task(heavy_task, user_name = str(user_name), prompt = str(prompt), options = str(options))

    return {"text": f"{user_name} wait a minute :-]\nprompt: {prompt}\noptions: {options}"}
    #return {"text": "wait a minute :-]"}




@app.get("/img/{file_name}")
async def get_img(file_name, response: Response):
    print(file_name)
    is_file = os.path.isfile(f"/home/ishizuka/stable-diffusion/outputs/txt2img-samples/{file_name}.png")
    if is_file:
        return FileResponse(f"/home/ishizuka/stable-diffusion/outputs/txt2img-samples/{file_name}.png")
    else:
        response.status_code = status.HTTP_202_ACCEPTED
        return

def txt2img_task(t2i, filename):
    print('txt2img_task開始')

    subprocess.run(f'/home/ishizuka/txt2img_v2.sh {filename} "{t2i.prompt}" {t2i.seed} {t2i.n_iter} {t2i.scale} {t2i.ddim_steps}', shell=True)
    img = {'file': open(f"/home/ishizuka/stable-diffusion/outputs/txt2img-samples/{filename}-grid.png", 'rb')}

    print('txt2img_task終了')

class T2I(BaseModel):
    prompt: Union[str, None] = "Daimyo's procession of 20cm in length that only I can see."
    seed: Union[int, None] = 42
    scale: Union[float, None] = 0.7
    ddim_steps: Union[int, None] = 50
    n_iter: Union[int, None] = 1

@app.post("/txt2img/")
async def txt2img(background_task:BackgroundTasks, t2i: T2I):
    filename = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    background_task.add_task(txt2img_task, t2i = t2i, filename = str(filename))
    return {'filename': filename}






def img2img_task(img_name, prompt, options):
    print('img2img開始')
    filename = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
    print(filename)
    print(img_name)

    # AI起動
    #subprocess.run(f'/home/ishizuka/img2img.sh /home/ishizuka/sd/files/{img_name} "{prompt}" "{options}"', shell=True)
    print(f'/home/ishizuka/img2img.sh /home/ishizuka/sd/files/{img_name} "{prompt}" "{options} --file_name {filename}"')
    subprocess.run(f'/home/ishizuka/img2img.sh /home/ishizuka/sd/files/{img_name} "{prompt}" "{options} --file_name {filename}"', shell=True)

    img = {'file': open(f"/home/ishizuka/stable-diffusion/outputs/img2img-samples/{filename}-grid.png", 'rb')}
    param = {
        'token':os.environ.get('SLACK_TOKEN'),
        'channels':os.environ.get('SLACK_CHANNEL'),
        'filename': filename + '.png',
        #'filename': 'IATer75irH0JUhjz-grid-0004.png',
        'initial_comment': f'{prompt}',
        'title': '-' + filename + '.png'
        #'title': 'IATer75irH0JUhjz-grid-0004.png'
        }
    requests.post(url="https://slack.com/api/files.upload",params=param, files=img)

    #subprocess.run(f"rm /home/ishizuka/stable-diffusion/outputs/txt2img-samples/{filename}-grid.png", shell=True)
    #subprocess.run(f"rm /home/ishizuka/stable-diffusion/outputs/txt2img-samples/samples/{filename}*.png", shell=True)
    print('img2img終了')
    print(f"/home/ishizuka/stable-diffusion/outputs/img2img-samples/{filename}-grid.png")
    return f"/home/ishizuka/stable-diffusion/outputs/img2img-samples/{filename}-grid.png"


@app.post("/img2img/")
#async def img2img(background_task:BackgroundTasks, user_name: str = Form(), text: str = Form(), file: bytes = File(...)):
async def img2img(background_task:BackgroundTasks, prompt: str = Form(), options: str = Form(), file: UploadFile = File(...)):
    #python scripts/img2img.py --init-img ../sd/files/start.png --prompt "a portrait of a cute girl,Girl with brown long hair and wearing a school uniform" --strength 0.6 --ckpt ../sd-v1-4.ckpt
    #--strength 0.5
    #--init-img
    # ユーザ名と引数を取得
    #search = re.search(r'"(.*)" (.*)', text)
    #prompt = search.group(1)
    #options = search.group(2)
    #print(f'prompt: {prompt}')
    #print(f'options: {options}')
    if file:
        img_name = file.filename
        fileobj = file.file
        upload_dir = open(os.path.join(UPLOAD_DIR, img_name),'wb+')
        shutil.copyfileobj(fileobj, upload_dir)
        upload_dir.close()
        #filepath = background_task.add_task(img2img_task, img_name = str(img_name), prompt = str(prompt), options = str(options))
        filepath = img2img_task(img_name = str(img_name), prompt = str(prompt), options = str(options))
    #background_task.add_task(heavy_task, user_name = str(user_name), prompt = str(prompt), options = str(options))

    #return {"Error": "アップロードファイルが見つかりません。"}

    #return {"text": f"{user_name} wait a minute :-]\nprompt: {prompt}\noptions: {options}"}
    #return {"text": "wait a minute :-]"}
    return FileResponse(filepath)



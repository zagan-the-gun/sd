import React, {useState, useEffect} from 'react'

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Box,
  Center,
  Text,
  Stack,
} from '@chakra-ui/react'

import { Field, Form, Formik } from 'formik';
//import { useForm } from 'react-hook-form'



export default function Top() {
  const [prompt, setPrompt] = React.useState(0);
  const [seed, setSeed] = React.useState(0);

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${prompt} times`;
  });

//  const onSubmit = (e) =>
//    console.log('DEAD BEEF')

    /*
    <div>
      <h1>AI Dalí</h1>

      <Box>	
      <form onSubmit={onSubmit}>
        <FormControl>
          <FormLabel>Prompt</FormLabel>
          <Input type='text' placeholder='呪文(英語)'/>
          <FormLabel>Seed</FormLabel>
          <NumberInput max={2147483647} min={0}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <Button
          mt={4}
          colorScheme='teal'
          type='submit'
        >
          Submit
        </Button>
      </form>
      </Box>	

    </div>
    */

//          <Field name='name' validate={validateName}>
  function validateName(value) {
    let error
    if (!value) {
      error = 'Name is required'
    } else if (value.toLowerCase() !== 'naruto') {
      error = "Jeez! You're not a fan 😱"
    }
    return error
  }

  return (

  <Center>
    <Box maxW='auto' borderWidth='1px' borderRadius='lg' overflow='hidden' m={[2, 3]} p={[2, 3]} w='512px'>
    <Stack>
    <Text
      fontSize='6xl'
      as='i'
      bgGradient="linear(to-l, #7928CA, #FF0080)"
      bgClip="text"
      fontWeight="extrabold"
    >
      AI Dalí
    </Text>
    </Stack>
    <Formik
      initialValues={{ prompt: "Daimyo's procession of 20cm in length that only I can see.", seed: 42, scale: 0.7, ddim_steps: 50, n_iter: 1 }}

      onSubmit={(values, actions) => {
        console.log(JSON.stringify(values, null, 2))
        setTimeout(() => {
          //alert(JSON.stringify(values, null, 2))
          //actions.setSubmitting(false)

          fetch("https://sd.tokyo-tsushin.com/txt2img/", {method: 'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify(values, null, 2)})
          .then(res => res.json())
          .then(json => {
            console.log("json");
            console.log(json);
            console.log(json.filename);
            window.location.href = '/front/txt2img/' + json.filename + '-grid';
          });

        }, 1000)
      }}

    >

      {(props) => (
          <Form>

            <Field name="prompt" type="text" >
              {({ field, form }) => (
              <FormControl>
                <FormLabel>prompt</FormLabel>
                <Input {...field} placeholder='prompt' />
              </FormControl>
              )}
            </Field>

            <Field name="seed" type="number" >
              {({ field, form }) => (
              <FormControl>
                <FormLabel>seed</FormLabel>
                <Input {...field} placeholder='seed' />
              </FormControl>
              )}
            </Field>

            <Field name="scale" type="number" >
              {({ field, form }) => (
              <FormControl>
                <FormLabel>scale</FormLabel>
                <Input {...field} placeholder='scale' />
              </FormControl>
              )}
            </Field>

            <Field name="ddim_steps" type="number" >
              {({ field, form }) => (
              <FormControl>
                <FormLabel>ddim_steps</FormLabel>
                <Input {...field} placeholder='ddim_steps' />
              </FormControl>
              )}
            </Field>

            <Button
              mt={4}
              colorScheme='teal'
              type='submit'
            >
              Create
            </Button>
          </Form>
      )}
    </Formik>
    </Box>
  </Center>

  );
}


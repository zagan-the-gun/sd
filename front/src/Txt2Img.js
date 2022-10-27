import React, {useState, useEffect} from 'react'

import {
  useParams,
} from 'react-router-dom';

import {
  Image,
  Box,
  Spinner,
  HStack,
  Button,
  Center,
  Stack,
  Text,
} from '@chakra-ui/react'

import {
  SpinnerIcon,
} from '@chakra-ui/icons'

import {
FaFacebook,
FaTwitter,
} from 'react-icons/fa';



export default function Txt2Img() {
  const [imgUrl, setImgUrl] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const params = useParams();
  console.log(params.fileName);

  useEffect(() => {
    //適当にポーリング処理
    let timer = setInterval(() => {
      console.log('DEAD BEEF useEffect');
      fetch('https://sd.tokyo-tsushin.com/img/' + params.fileName)
        .then((res) => {
          if (res.status == 200) {
            console.log('DEAD BEEF GET!');
            setImgUrl('https://sd.tokyo-tsushin.com/img/' + params.fileName);
            setLoading(false);
            clearInterval(timer);
	  } else {
            console.log('DEAD BEEF Loading...');
	  }
	});
    }, 5000);
    return () => {
      clearInterval(timer);
    };

    }, []);

      //<Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
  return (
          <Center>
    <Box maxW='auto' borderWidth='1px' borderRadius='lg' overflow='hidden' m={[2, 3]} p={[2, 3]} w='512px'>
      { loading && (
        <>
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
<Box minH='512px' display='flex' justifyContent='center' alignItems='center'>
          <Spinner
            maxW='auto'
            maxH='auto'
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
</Box>
          <HStack mt={[2, 3]}>
          <Button colorScheme='facebook' leftIcon={<FaFacebook />}>
            Facebook
          </Button>
          <Button colorScheme='twitter' leftIcon={<FaTwitter />}>
            Twitter
          </Button>
          </HStack>
        </>
      )}

      { loading || (
        <>
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
          <Image src={imgUrl} />
          <HStack mt={[2, 3]}>
          <Button colorScheme='facebook' leftIcon={<FaFacebook />}>
            Facebook
          </Button>
          <Button colorScheme='twitter' leftIcon={<FaTwitter />}>
            Twitter
          </Button>
          </HStack>
        </>
      )}

    </Box>
          </Center>
  );
}


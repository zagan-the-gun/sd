import './App.css'
import React from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Top from './Top'
import Txt2Img from './Txt2Img'

import { ChakraProvider } from '@chakra-ui/react'


function App() {
  return (
    <div className="App">
      <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/front/top" element={<Top />} />
          <Route path="/front/txt2img/" element={<Txt2Img />} />
          <Route path="/front/txt2img/:fileName" element={<Txt2Img />} />
        </Routes>
      </BrowserRouter>
      </ChakraProvider>
    </div>
  );
}

export default App


import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import theme from './theme';

import Container from './components/Container';
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Container />
    </ChakraProvider>
  );
}

export default App;

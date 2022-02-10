import "@fontsource/spartan";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";

import Container from "./components/Container";
function App() {
  return (
    <ChakraProvider>
      <Container />
    </ChakraProvider>
  );
}

export default App;

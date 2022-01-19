import React from "react";
import Sketch from "react-p5";
import { setup, draw } from "./sketch";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <Sketch setup={setup} draw={draw} />
      </ChakraProvider>
    </div>
  );
}

export default App;

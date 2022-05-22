import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/spartan";
import Container from "./components/container";
export default function Home() {
  return (
    <ChakraProvider>
      <Container />
    </ChakraProvider>
  );
}

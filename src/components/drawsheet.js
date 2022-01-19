import { Box, Button, useColorModeValue, Flex } from '@chakra-ui/react';
import Sketch from 'react-p5';
import { RepeatIcon } from '@chakra-ui/icons';
import { setup, draw, startDrawing } from './../sketch';
export default function DrawSheet() {
  return (
    <Box
      w="min"
      h="min"
      boxShadow="base"
      p={3}
      rounded="md"
      bg={useColorModeValue('white', 'gray.700')}
    >
      <Sketch setup={setup} draw={draw} />

      <Flex justifyContent="end">
        <Button colorScheme="purple" variant="outline" mt={3}>
          <RepeatIcon variant="outline" onClick={startDrawing} />
        </Button>
      </Flex>
      <Flex
        h="100%"
        justifyContent="top"
        w="100%"
        flexDirection="column"
        mt={3}
      >
        <Button colorScheme="purple">Mint</Button>
      </Flex>
    </Box>
  );
}

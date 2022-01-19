import { Box, Button, useColorModeValue } from '@chakra-ui/react';
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
      bg={useColorModeValue('white', 'gray.800')}
    >
      <Sketch setup={setup} draw={draw} />

      <Button colorScheme="teal" variant="outline" mt={3}>
        <RepeatIcon variant="outline" onClick={startDrawing} />
      </Button>
    </Box>
  );
}

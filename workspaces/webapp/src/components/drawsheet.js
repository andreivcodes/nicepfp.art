import { Box, Button, useColorModeValue, Flex } from '@chakra-ui/react';
import Sketch from 'react-p5';
import { RepeatIcon } from '@chakra-ui/icons';
import { setup, draw, startDrawing } from '../sketch';
import MintButton from './MintButton';
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
        <Button
          colorScheme="purple"
          variant="outline"
          mt={3}
          fontFamily="Spartan"
          fontSize="sm"
          onClick={startDrawing}
        >
          <RepeatIcon variant="outline" /> {'\xa0 Redraw'}
        </Button>
      </Flex>
      <Flex
        h="100%"
        justifyContent="top"
        w="100%"
        flexDirection="column"
        mt={3}
      >
        <MintButton />
      </Flex>
    </Box>
  );
}

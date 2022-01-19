import {
  ChakraProvider,
  Text,
  Flex,
  Grid,
  GridItem,
  Button,
  SimpleGrid,
  Box,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './../ColorModeSwitcher';

import DrawSheet from './drawsheet';
import Card1 from './Card1';
import Card2 from './Card2';
import Card3 from './Card3';
import Card4 from './Card4';
import Card5 from './Card5';
import Card6 from './Card6';

export default function Container() {
  return (
    <Flex
      flexDirection={'column'}
      alignItems="center"
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Flex alignSelf="end" m={5}>
        <ColorModeSwitcher justifySelf="flex-end" />
      </Flex>

      <Flex maxW="70%" minH="100vh" flexDirection="column">
        <SimpleGrid
          columns={{ lg: 1, xl: 2 }}
          spacing={10}
          alignItems="stretch"
          justifyItems="center"
        >
          <Box>
            <DrawSheet />
          </Box>

          <Flex justifyContent="center" flexDirection="column">
            <Text fontSize="5xl" fontWeight="thin" textAlign="right">
              Welcome to nicepfp.art
            </Text>
            <Text fontSize="md" fontWeight="light" textAlign="right">
              I needed a nice profile picture for my Twitter, so I made this
            </Text>
            <Text fontSize="md" fontWeight="normal" textAlign="right">
              The perfect machine learning NFT pfp.
            </Text>
          </Flex>
        </SimpleGrid>
        <Center>
          <SimpleGrid
            columns={{ lg: 1, xl: 3 }}
            spacing={10}
            mt={10}
            maxW="90%"
          >
            <Card1 />
            <Card2 />
            <Card3 />
            <Card4 />
            <Card5 />
            <Card6 />
          </SimpleGrid>
        </Center>
      </Flex>

      <Text fontSize="md" fontWeight="normal" textAlign="right" mt={3}>
        with ❤️ by andrei
      </Text>
      <Text fontSize="sm" fontWeight="light" textAlign="right" mb={3}>
        0x636106e4Bd34195F4678af160762cc5157bEA7e8
      </Text>
    </Flex>
  );
}

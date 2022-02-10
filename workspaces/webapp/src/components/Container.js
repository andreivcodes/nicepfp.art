import {
  Text,
  Flex,
  SimpleGrid,
  Box,
  Center,
  useColorModeValue,
  Code,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

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
            <Text
              fontSize="5xl"
              fontWeight="thin"
              textAlign="right"
              fontFamily="Spartan"
            >
              Welcome to{' '}
              <Code fontSize="5xl" colorScheme="purple" fontFamily="Spartan">
                nicepfp.art
              </Code>
            </Text>
            <Text
              fontSize="md"
              fontWeight="light"
              textAlign="right"
              fontFamily="Spartan"
            >
              I needed a nice profile picture for my Twitter, so I made this.
            </Text>
            <Text
              fontSize="md"
              fontWeight="normal"
              textAlign="right"
              fontFamily="Spartan"
            >
              The perfect ml nft pfp.
            </Text>
            <Text
              fontSize="md"
              fontWeight="light"
              textAlign="right"
              fontFamily="Spartan"
            >
              You know... machine learning non fungible token profile picture.
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

      <Text
        fontSize="md"
        fontWeight="normal"
        textAlign="right"
        mt={3}
        fontFamily="Spartan"
      >
        with ❤️ by{' '}
        <Code fontSize="md" colorScheme="purple" fontFamily="Spartan">
          andrei
        </Code>
      </Text>
      <Text
        fontSize="sm"
        fontWeight="light"
        textAlign="right"
        mb={3}
        fontFamily="Spartan"
      >
        0x636106e4Bd34195F4678af160762cc5157bEA7e8
      </Text>
    </Flex>
  );
}

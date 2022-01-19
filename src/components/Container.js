import {
  ChakraProvider,
  Text,
  Flex,
  Grid,
  GridItem,
  Button,
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
      <Grid
        maxW="70%"
        minH="100vh"
        gap={5}
        p={5}
        templateRows="repeat(3, auto)"
        templateColumns="repeat(5, auto)"
      >
        <GridItem row={1} col={1}></GridItem>
        <GridItem row={1} col={2}></GridItem>
        <GridItem row={1} col={3}></GridItem>
        <GridItem row={1} col={4}></GridItem>
        <GridItem row={1} col={5}>
          <Flex alignItems="end" flexDirection="column">
            <ColorModeSwitcher justifySelf="flex-end" />
          </Flex>
        </GridItem>

        <GridItem row={2} colSpan={2}>
          <DrawSheet />
        </GridItem>

        <GridItem row={2} colSpan={3}>
          <Flex
            h="100%"
            justifyContent="center"
            alignItems="end"
            flexDirection="column"
          >
            <Text fontSize="5xl" fontWeight="thin">
              Welcome to nicepfp.art
            </Text>
            <Text fontSize="md" fontWeight="light">
              I needed a nice profile picture for my Twitter, so I made this
            </Text>
          </Flex>
        </GridItem>

        <GridItem row={3} colSpan={2}>
          <Flex h="100%" justifyContent="top" w="100%" flexDirection="column">
            <Button colorScheme="teal" variant="outline">
              Mint
            </Button>
          </Flex>
        </GridItem>

        <GridItem row={3} col={3}></GridItem>
        <GridItem row={3} col={4}></GridItem>
        <GridItem row={3} col={5}></GridItem>
      </Grid>

      <Grid
        maxW="70%"
        gap={5}
        p={5}
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(3, 1fr)"
      >
        <GridItem>
          <Card1 />
        </GridItem>

        <GridItem>
          <Card2 />
        </GridItem>

        <GridItem>
          <Card3 />
        </GridItem>

        <GridItem>
          <Card4 />
        </GridItem>

        <GridItem>
          <Card5 />
        </GridItem>

        <GridItem>
          <Card6 />
        </GridItem>
      </Grid>
    </Flex>
  );
}

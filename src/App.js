import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import {
  ChakraProvider,
  Text,
  Flex,
  Grid,
  GridItem,
  Box,
  Button,
  Stat,
  StatLabel,
  StatHelpText,
  Divider,
  Link,
} from '@chakra-ui/react';
import { ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { setup, draw, startDrawing } from './sketch';
import React from 'react';
import Sketch from 'react-p5';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Flex flexDirection={'column'} alignItems="center" bg="#F7FAFC">
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
            <Box
              w="min"
              h="min"
              boxShadow="base"
              p={3}
              rounded="md"
              bg="#FFFFFF"
            >
              <Sketch setup={setup} draw={draw} />

              <Button colorScheme="teal" variant="outline" mt={3}>
                <RepeatIcon
                  colorScheme="teal"
                  variant="outline"
                  onClick={startDrawing}
                />
              </Button>
            </Box>
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
            <Box
              w="100%"
              h="40"
              boxShadow="base"
              p={3}
              rounded="md"
              bg="#FFFFFF"
            >
              <Stat>
                <StatLabel m={2}>What is this thing?</StatLabel>
                <Divider />
                <StatHelpText m={3}>
                  This website uses machine learning to generate a unique
                  profile picture doodle.
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              w="100%"
              h="40"
              boxShadow="base"
              p={3}
              rounded="md"
              bg="#FFFFFF"
            >
              <Stat>
                <StatLabel m={2}>Why does it exist?</StatLabel>
                <Divider />
                <StatHelpText m={3}>
                  Because I like playing with web3, NFTs are cool and I needed a
                  profile pic.
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              w="100%"
              h="40"
              boxShadow="base"
              p={3}
              rounded="md"
              bg="#FFFFFF"
            >
              <Stat>
                <StatLabel m={2}>How much does it cost?</StatLabel>
                <Divider />
                <StatHelpText m={3}>
                  Minting is free but you have to pay the gas fees.
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              w="100%"
              h="40"
              boxShadow="base"
              p={3}
              rounded="md"
              bg="#FFFFFF"
            >
              <Stat>
                <StatLabel m={2}>How is it generated?</StatLabel>
                <Divider />
                <StatHelpText m={3}>
                  The doodles are generated by a recurrent neural network model
                  trained on millions of doodles collected from the{' '}
                  <Link href="https://quickdraw.withgoogle.com/" isExternal>
                    Quick, Draw! game <ExternalLinkIcon mx="2px" />
                  </Link>
                  .
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              w="100%"
              h="40"
              boxShadow="base"
              p={3}
              rounded="md"
              bg="#FFFFFF"
            >
              <Stat>
                <StatLabel m={2}>Where can I find the source code?</StatLabel>
                <Divider />
                <StatHelpText m={3}>
                  The code is available on my
                  <Link
                    href="https://github.com/andreivdev/nicepfp.art"
                    isExternal
                  >
                    Github page
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                  .
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              w="100%"
              h="40"
              boxShadow="base"
              p={3}
              rounded="md"
              bg="#FFFFFF"
            >
              <Stat>
                <StatLabel m={2}>Thanks to</StatLabel>
                <Divider />
                <StatHelpText m={3}>
                  <Link href="https://reactjs.org/" isExternal>
                    react
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                  {', '}
                  <Link href="https://p5js.org/" isExternal>
                    p5
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                  {', '}
                  <Link href="https://ml5js.org/" isExternal>
                    ml5
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                  {', '}
                  <Link href="https://quickdraw.withgoogle.com/" isExternal>
                    Quick, draw
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                  {', '}
                  <Link href="https://chakra-ui.com/" isExternal>
                    Chakra-UI
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                  {', '}
                </StatHelpText>
              </Stat>
            </Box>
          </GridItem>
        </Grid>
      </Flex>
    </ChakraProvider>
  );
}

export default App;

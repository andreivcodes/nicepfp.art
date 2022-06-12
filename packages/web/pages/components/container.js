import {
  Text,
  Flex,
  SimpleGrid,
  Center,
  useColorModeValue,
  Code,
  Divider,
  Skeleton,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";

import { ColorModeSwitcher } from "./colorModeSwitcher";
import Card1 from "./card1";
import Card2 from "./card2";
import Card3 from "./card3";
import Card4 from "./card4";
import Card5 from "./card5";
import Card6 from "./card6";
const LatestMints = dynamic(() => import("./latestMints"), {
  ssr: false,
  loading: () => <Skeleton h="50px" w="100%"></Skeleton>,
});
const DrawSheet = dynamic(() => import("./drawSheet"), {
  ssr: false,
  loading: () => <Skeleton h="500px" w="500px"></Skeleton>,
});

export default function Container() {
  return (
    <Flex
      flexDirection={"column"}
      alignItems="center"
      bg={useColorModeValue("gray.50", "gray.800")}
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
          <DrawSheet />

          <Flex justifyContent="center" flexDirection="column">
            <Text
              fontSize="5xl"
              fontWeight="thin"
              textAlign="right"
              fontFamily="Spartan"
            >
              Welcome to{" "}
              <Code fontSize="5xl" colorScheme="purple" fontFamily="Spartan">
                nicepfp.art
              </Code>
            </Text>
            <Text
              fontSize="md"
              fontWeight="light"
              textAlign="right"
              fontFamily="Spartan"
              mt="1rem"
            >
              I needed a nice profile picture for my Twitter, so I made this.
            </Text>
            <Text
              fontSize="md"
              fontWeight="normal"
              textAlign="right"
              fontFamily="Spartan"
            >
              Simple. Free. Unlimited. Forever.
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
        <Divider my="1rem" h="1" />
        <LatestMints />
      </Flex>

      <Text
        fontSize="md"
        fontWeight="normal"
        textAlign="right"
        my={3}
        fontFamily="Spartan"
      >
        with 💖 by{" "}
        <Code fontSize="md" colorScheme="purple" fontFamily="Spartan">
          andreiv.eth
        </Code>
      </Text>
    </Flex>
  );
}

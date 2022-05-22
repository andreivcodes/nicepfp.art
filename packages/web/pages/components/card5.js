import {
  Box,
  Stat,
  StatLabel,
  StatHelpText,
  Divider,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function Card5() {
  return (
    <Box
      w="100%"
      h="56"
      boxShadow="base"
      p={3}
      rounded="md"
      bg={useColorModeValue("white", "gray.700")}
    >
      <Stat>
        <StatLabel m={2} fontFamily="Spartan" fontWeight="bold">
          Where can I find the source code?
        </StatLabel>
        <Divider />
        <StatHelpText m={3} fontFamily="Spartan">
          The code is available on my{" "}
          <Link href="https://github.com/andreivdev/nicepfp.art" isExternal>
            Github page
            <ExternalLinkIcon mx="2px" />
          </Link>
          . The contract is available{" "}
          <Link
            href="https://polygonscan.com/address/0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34#code"
            isExternal
          >
            here
            <ExternalLinkIcon mx="2px" />
          </Link>
          .
        </StatHelpText>
      </Stat>
    </Box>
  );
}

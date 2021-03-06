import {
  Box,
  Stat,
  StatLabel,
  StatHelpText,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Card3() {
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
          How much does it cost?
        </StatLabel>
        <Divider />
        <StatHelpText m={3} fontFamily="Spartan">
          Minting is and will always remain free. The only thing you are paying
          is the gas fee.
        </StatHelpText>
      </Stat>
    </Box>
  );
}

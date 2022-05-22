import {
  Box,
  Stat,
  StatLabel,
  StatHelpText,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Card1() {
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
          What is this thing?
        </StatLabel>
        <Divider />
        <StatHelpText m={3} fontFamily="Spartan">
          This website uses machine learning to generate a unique doodle. It can
          be minted as NFT and be used as a profile picture.
        </StatHelpText>
      </Stat>
    </Box>
  );
}

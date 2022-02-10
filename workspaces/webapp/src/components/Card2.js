import {
  Box,
  Stat,
  StatLabel,
  StatHelpText,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Card2() {
  return (
    <Box
      w="100%"
      h="56"
      boxShadow="base"
      p={3}
      rounded="md"
      bg={useColorModeValue('white', 'gray.700')}
    >
      <Stat>
        <StatLabel m={2} fontFamily="Spartan" fontWeight="bold">
          Why does it exist?
        </StatLabel>
        <Divider />
        <StatHelpText m={3} fontFamily="Spartan">
          Because I like playing with web3, NFTs are cool and I needed a profile
          pic.
        </StatHelpText>
      </Stat>
    </Box>
  );
}

import {
  Box,
  Stat,
  StatLabel,
  StatHelpText,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Card3() {
  return (
    <Box
      w="100%"
      h="40"
      boxShadow="base"
      p={3}
      rounded="md"
      bg={useColorModeValue('white', 'gray.700')}
    >
      <Stat>
        <StatLabel m={2}>How much does it cost?</StatLabel>
        <Divider />
        <StatHelpText m={3}>
          Minting is free but you have to pay the gas fees. I get 10% royalties
          on secondary market sales.
        </StatHelpText>
      </Stat>
    </Box>
  );
}

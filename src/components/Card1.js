import {
  Box,
  Stat,
  StatLabel,
  StatHelpText,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Card1() {
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
        <StatLabel m={2}>What is this thing?</StatLabel>
        <Divider />
        <StatHelpText m={3}>
          This website uses machine learning to generate a unique profile
          picture doodle.
        </StatHelpText>
      </Stat>
    </Box>
  );
}

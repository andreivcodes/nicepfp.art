import {
  Box,
  Stat,
  StatLabel,
  StatHelpText,
  Divider,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export default function Card6() {
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
          Thanks to
        </StatLabel>
        <Divider />
        <StatHelpText m={3} fontFamily="Spartan">
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
          <Link href="https://github.com/Developer-DAO/web3-ui" isExternal>
            web3-ui
            <ExternalLinkIcon mx="2px" />
          </Link>
          {', '}
          <Link href="https://docs.ethers.io/v5/" isExternal>
            ethers
            <ExternalLinkIcon mx="2px" />
          </Link>
          {' and '}
          <Link href="https://hardhat.org/" isExternal>
            hardhat
            <ExternalLinkIcon mx="2px" />
          </Link>
        </StatHelpText>
      </Stat>
    </Box>
  );
}

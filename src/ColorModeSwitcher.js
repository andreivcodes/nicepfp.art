import React from 'react';
import { useColorMode, Button } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export const ColorModeSwitcher = props => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button onClick={toggleColorMode} maxW="3rem">
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};

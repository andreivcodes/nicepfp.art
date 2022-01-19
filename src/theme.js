import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  useSystemColorMode: true,
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
  },
});

export default theme;

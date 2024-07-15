import { extendTheme } from '@chakra-ui/react';

import foundations from './foundations';
import styles from './styles';

/**
 * Color mode config
 */
const config = {
  useSystemColorMode: false,
  initialColorMode: 'light'
};

const theme = extendTheme({
  ...foundations,
  styles,
  config
});

export default theme;

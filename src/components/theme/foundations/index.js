// theme.js
import breakpoints from './breakpoints';
import colors from './colors';
import components from './components';
import sizes from './sizes';
import space from './space';
import transitions from './transitions';
import typography from './typography';

const theme = {
  breakpoints,
  space,
  components,
  ...typography,
  transitions,
  header: {
    height: 66
  },
  sidebar: {
    collapsedWidth: 105,
    width: 250
  },
  sizes,
  colors
};

export default theme;

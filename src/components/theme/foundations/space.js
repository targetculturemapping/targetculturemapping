const scale = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '32px',
  xl: '64px'
};
const array = [0, scale.xs, scale.sm, scale.md, scale.lg, scale.xl];
export default {
  ...array,
  ...scale
};

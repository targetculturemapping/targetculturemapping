const easings = {
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
  easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)'
};

const transitions = {
  base: `all 0.4s ${easings.easeOutCubic}`,
  fast: `all 0.2s ${easings.easeOutCubic}`,
  slow: `all 0.8s ${easings.easeOutCubic}`
};

export default {
  easings,
  ...transitions
};

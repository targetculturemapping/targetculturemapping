const analyticsColors = {
  low: '#d7d6d6',
  medium: '#cce8ff',
  high: '#67b9ff',
  threshold: '#346eaa',
  raspberryRed: '#BC204B',
  orange: '#F2A900',
  primrose: '#BA9CC5',
  gold: '#D7A179',
  critic: '#d7d5d5',
  passive: '#98d0ff',
  promoter: '#346eab',
  achievement: '#AB324D',
  customerCentric: '#E6AD34',
  greaterGood: '#9DCA58',
  innovation: '#326EC9',
  oneTeam: '#8B66A1',
  peopleFirst: '#B67743',
  lowPercentageRed: '#AD304D',
  lowPercentageBorderRed: '#EE9CB3',
  borderGray: '#BFBFBF',
  brightYellow: '#FFFF00',
  brightOrange: '#FF8B28',
  brightRed: '#8B0000',
  brightBlue: '#0000FF',
  brightPurple: '#800080',
  brightGreen: '#006400'
};

export const analyticsColors360 = {
  low: '#7692A1',
  medium: '#2B96FA',
  high: '#266EA9',
  raterDataPoint: '#F2A900',
  backGroundFillRange: 'gray.300',
  progressPrimary: '#3182CE',
  progressSecondary: '#EDF2F7',
  circumplexBar: '#0072CE'
};

export const demographicColors = ['#F2A900', '#bb1f4b', '#d7a07a', '#0072ce', '#47bc78', '#ba9cc5', '#E633E0'];

export function getColorFromPoint(point): string {
  if (point >= 85) {
    return analyticsColors.threshold;
  }

  if (point >= 75) {
    return analyticsColors.high;
  }

  if (point >= 65) {
    return analyticsColors.medium;
  }

  return analyticsColors.low;
}

export function getPointBorderColorFromPoint(point) {
  if (point >= 65) {
    return analyticsColors.borderGray;
  }

  return analyticsColors.lowPercentageBorderRed;
}

export default analyticsColors;

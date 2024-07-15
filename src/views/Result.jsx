import { Box, useMediaQuery, useBreakpointValue } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';

const FlatTopBar = props => {
  // eslint-disable-next-line react/prop-types
  const { fill, x, y, width, height } = props;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} />
    </g>
  );
};

// eslint-disable-next-line react/prop-types
const Result = ({ data }) => {
  const isMobile = useMediaQuery(['(max-width: 800px)'])[0];
  const chartHeight = useBreakpointValue({ base: 300, md: 400 });
  const chartPadding = useBreakpointValue({ base: '20px', md: '50px' });
  const barSize = useBreakpointValue({ base: 90, md: 150 });

  const renderCustomizedLabel = props => {
    // eslint-disable-next-line react/prop-types
    const { x, y, width, value } = props;
    return (
      <text x={x + width / 2} y={y + 30} fill="white" textAnchor="middle" dy={-6}>
        {`${value}%`}
      </text>
    );
  };

  return (
    <Box flex={1} marginBottom="50px" px={chartPadding}>
      <Box backgroundColor="white" borderTopRadius="2xl" overflowX="auto" padding={chartPadding}>
        <ResponsiveContainer height={chartHeight} width={isMobile ? 700 : '100%'}>
          <BarChart data={data} barSize={barSize}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} tick={{ fontSize: isMobile ? 12 : 14 }} />
            <YAxis domain={[0, 50]} tick={{ fontSize: isMobile ? 12 : 14 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#bc204b" shape={<FlatTopBar />}>
              <LabelList dataKey="value" content={renderCustomizedLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Result;

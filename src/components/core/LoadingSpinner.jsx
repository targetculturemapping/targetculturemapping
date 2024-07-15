import React from 'react';

import { Box, Spinner } from '@chakra-ui/react';

const LoadingSpinner = () => {
  return (
    <Box height="100%" position="absolute" width="100%" zIndex={3}>
      <Box left="50%" position="absolute" top="50%" transform="translateY(-50%)">
        <Spinner height="100px" width="100px" />
      </Box>
    </Box>
  );
};

export default LoadingSpinner;

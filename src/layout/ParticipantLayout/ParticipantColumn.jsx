/* eslint-disable react/prop-types */
import { Box } from '@chakra-ui/react';

export default function ParticipantColumn({ children, ...rest }) {
  return (
    <Box pos="relative" {...rest}>
      {children}
    </Box>
  );
}

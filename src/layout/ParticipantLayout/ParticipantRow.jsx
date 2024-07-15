/* eslint-disable react/prop-types */
import { Box } from '@chakra-ui/react';

export default function ParticipantRow({ children, ...rest }) {
  return (
    <Box className="section-row" width="100%" {...rest}>
      {children}
    </Box>
  );
}

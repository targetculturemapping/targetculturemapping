/* eslint-disable react/prop-types */
import { Box } from '@chakra-ui/react';

export default function SectionColumn({ children, ...rest }) {
  return (
    <Box
      pos="relative"
      py={{
        base: 'sm',
        sm: 'md',
        md: 'lg',
        lg: 'xl'
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

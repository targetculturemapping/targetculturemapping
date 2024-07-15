/* eslint-disable react/prop-types */
import { Box } from '@chakra-ui/react';

export default function SectionRow({ children, ...rest }) {
  return (
    <Box
      className="section-row"
      px={{
        base: 'md',
        sm: 'md',
        md: 'lg',
        lg: 'xl'
      }}
      width="100%"
      {...rest}
    >
      {children}
    </Box>
  );
}

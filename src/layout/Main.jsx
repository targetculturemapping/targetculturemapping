/* eslint-disable react/prop-types */
import { Box } from '@chakra-ui/react';

const MainContainer = ({ children, paddingTop, ...rest }) => {
  const navHeight = 66;

  const sidebarWidth = 105;
  return (
    <Box ml={`${sidebarWidth}px`} pt={paddingTop || `${navHeight}px`} {...rest}>
      {children}
    </Box>
  );
};

export default function Main({ children, paddingTop }) {
  return <MainContainer paddingTop={paddingTop}>{children}</MainContainer>;
}

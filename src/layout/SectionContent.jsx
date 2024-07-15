/* eslint-disable react/prop-types */
import { chakra, Box } from '@chakra-ui/react';

const SectionContentContainer = chakra(Box, {
  baseStyle: {
    width: '100%',
    margin: 20,
    marginTop: 5,
    padding: 20,
    position: 'relative'
  }
});
export default function SectionContent({ children, ...rest }) {
  return <SectionContentContainer {...rest}>{children}</SectionContentContainer>;
}

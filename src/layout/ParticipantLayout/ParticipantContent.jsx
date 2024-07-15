/* eslint-disable react/prop-types */
import { chakra, Box } from '@chakra-ui/react';

const SectionContentContainer = chakra(Box, {
  baseStyle: {
    width: '100%',
    position: 'relative'
  }
});
export default function ParticipantContent({ children, ...rest }) {
  return <SectionContentContainer {...rest}>{children}</SectionContentContainer>;
}

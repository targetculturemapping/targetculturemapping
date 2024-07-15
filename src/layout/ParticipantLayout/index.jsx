import { Flex, Box, useMediaQuery } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';
import ParticipantSection from './ParticipantSection';

// eslint-disable-next-line react/prop-types
const ParticipantLayout = ({ children }) => {
  const isMobile = useMediaQuery(['(max-width: 800px)'])[0];
  return (
    <Flex backgroundColor="#FAFBFC" flexDir="column" h="100vh" justifyContent="space-between">
      <Header />
      <Box flex={1} mt={20} px={isMobile ? '0%' : '10%'}>
        <Box backgroundColor="white" borderTopRadius="2xl" height="100%" overflowX="hidden">
          <Box sx={{ width: '100%' }}>
            <ParticipantSection sx={{ width: '100%' }}>{children}</ParticipantSection>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Flex>
  );
};

export default ParticipantLayout;

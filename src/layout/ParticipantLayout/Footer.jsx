import { Flex, Img, Text } from '@chakra-ui/react';

import FooterLogo from 'assets/images/FooterLogo.png';

const Footer = () => {
  return (
    <Flex alignItems="center" justifyContent="center" m="40px 0">
      <Img height="32px" src={FooterLogo} width="20px" />
      <Text display="flex" fontSize="14px" fontWeight={400} ml={3} textColor="gray.500">
        Powered 💡️{' '}
        <Text textColor="raspberryRed.500" ml={1}>
          by Walking the talk
        </Text>
      </Text>
    </Flex>
  );
};

export default Footer;

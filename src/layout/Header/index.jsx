// Header.js
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { chakra, Box, Icon, Text, Flex } from '@chakra-ui/react';
import { IoChevronForward } from 'react-icons/io5';
// import LanguageSelector from 'components/Languages/LanguageSelector';

const HeaderContainer = chakra(Box, {
  baseStyle: {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: '5',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid',
    borderBottomColor: 'blackAlpha.200',
    px: 10,
    py: 6
  }
});

function Header({ breadcrumbs, languages, onLanguageChange, defaultLanguage }) {
  // Ensure sidebar and header properties are defined in theme
  const sidebarWidth = 105;
  const navHeight = 66;

  return (
    <HeaderContainer
      backgroundColor="white"
      boxShadow="md"
      height={`${navHeight}px`}
      transition="all .25s ease"
      width={`calc(100% - ${sidebarWidth}px)`}
    >
      <Flex flexDirection="row" width="100%">
        <Flex flexBasis="10%">
          {breadcrumbs?.length > 0 && (
            <Flex flexDirection="column" ml={4}>
              <Flex>
                {breadcrumbs?.slice(0, breadcrumbs.length - 1)?.map((breadcrumb, index) => (
                  <Text key={index} alignItems="center" display="flex" fontSize="xs" textColor="gray.500">
                    {breadcrumb} <Icon as={IoChevronForward} mx={1} />
                  </Text>
                ))}
              </Flex>
              <Text fontSize="18px">{breadcrumbs[breadcrumbs.length - 1]}</Text>
            </Flex>
          )}
        </Flex>
        {
          // {languages && <LanguageSelector defaultLanguage={defaultLanguage} languages={languages} onLanguageChange={onLanguageChange} />}
        }
      </Flex>
    </HeaderContainer>
  );
}

export default Header;

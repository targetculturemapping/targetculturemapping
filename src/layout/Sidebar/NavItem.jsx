/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
import React, { useEffect } from 'react';
import { Box, Icon, Text, IconButton, Collapse, Tooltip } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { IoChevronDown } from 'react-icons/io5';

const NavItem = ({ icon, title, path, iconColor = '', onClick, isSidebarOpen, isActive }) => {
  const NavContent = (
    <Tooltip isDisabled={isSidebarOpen} label={title} placement="right">
      <Box
        _hover={{
          backgroundColor: `#0072ce0F`,
          color: 'gray.700'
        }}
        alignItems="center"
        backgroundColor={isActive ? `#0072ce0F` : ''}
        color={isActive ? 'gray.700' : 'gray.500'}
        display="flex"
        onClick={onClick}
        pl={10}
        py={3.5}
        width={isSidebarOpen ? '280px' : '110px'}
      >
        <Icon as={icon} boxSize={6} color={iconColor} />

        {isSidebarOpen && (
          <Text fontWeight="medium" ml={3} size="sm">
            {title}
          </Text>
        )}
      </Box>
    </Tooltip>
  );

  return (
    <Box cursor="pointer" position="relative" py={1}>
      {onClick ? NavContent : <Link to={path}>{NavContent}</Link>}
      {isActive && (
        <Box backgroundColor="#0072ce" borderRadius="4px 0 0 4px" height="full" position="absolute" right={0} top={0} width={1} />
      )}
    </Box>
  );
};

const CollapsibleNavItem = ({ icon, title, links, isSidebarOpen, isActive }) => {
  useEffect(() => {
    if (!isSidebarOpen && isOpen) onToggle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarOpen, onToggle, isOpen]);

  return (
    <Box position="relative" py={1}>
      <Box
        _hover={{
          backgroundColor: `#0072ce0F`,
          color: 'gray.700'
        }}
        alignItems="center"
        backgroundColor={isActive ? `#0072ce0F` : ''}
        cursor="pointer"
        display="flex"
        justifyContent="space-between"
        onClick={onToggle}
        pl={10}
        pr={6}
        py={3.5}
        w="full"
      >
        <Box alignItems="center" color={isActive ? 'gray.700' : 'gray.500'} display="flex">
          <Icon as={icon} boxSize={6} />
          {isSidebarOpen && (
            <Text fontWeight="medium" ml={3} size="sm">
              {title}ss
            </Text>
          )}
        </Box>
        {isSidebarOpen && (
          <IconButton
            _active={{ backgroundColor: 'transparent' }}
            _hover={{ backgroundColor: 'transparent' }}
            aria-label="expand-button"
            as={IoChevronDown}
            backgroundColor="transparent"
            boxSize={5}
            color="gray.700"
            transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
          />
        )}
      </Box>
      {isActive && (
        <Box backgroundColor="#0072ce" borderRadius="4px 0 0 4px" height="3.75rem" position="absolute" right={0} top={0} width={1} />
      )}
      {isSidebarOpen && (
        <Collapse animateOpacity in={isOpen}>
          <Box borderLeft="1px solid" borderLeftColor="blackAlpha.200" display="flex" flexDirection="column" ml={12} mt={3} pr={3}>
            {links.map(link => {
              const isLinkActive = (pathname + search).includes(link.path) && link.showIsActive;
              return (
                <Link key={link.title} to={link.path}>
                  <Box
                    _hover={{
                      backgroundColor: `#0072ce0F`
                    }}
                    backgroundColor={isLinkActive ? `#0072ce0F` : ''}
                    color="gray.500"
                    fontSize="14px"
                    fontWeight="medium"
                    ml={3}
                    my={1}
                    px={2}
                    py={2.5}
                    rounded="md"
                  >
                    {link.title}
                  </Box>
                </Link>
              );
            })}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};
export { NavItem, CollapsibleNavItem };

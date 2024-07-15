import React, { useRef, useEffect, useState } from 'react';
import { Avatar, Box, Stack, Flex, Text, Divider, IconButton, Image } from '@chakra-ui/react';
import {
  IoChevronForward,
  IoStorefrontOutline,
  IoConstructOutline,
  IoPulseOutline,
  IoApertureOutline,
  IoBarChartOutline,
  IoHomeOutline,
  IoSettingsOutline,
  IoPeopleOutline
} from 'react-icons/io5';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import MiniLogo from 'assets/images/mini-sidebar-logo.png';
import Logo from 'assets/images/main.png';
import { NavItem } from './NavItem';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useSidebarOpen } from './index';

export const Sidebar = () => {
  const { isOpen, onToggle, onClose } = useSidebarOpen();
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const { workshopCode } = useParams();
  const [activeTab, setActiveTab] = useState('');
  const [userRole, setUserRole] = useState();

  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const handleNavigate = passedLink => {
    navigate(`/${passedLink}`);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef, onClose]);

  const checkActive = () => {
    const pathName = window.location.pathname.toLowerCase();
    let tempActiveTab = '';

    if (pathName.includes('workshop')) {
      if (pathName.includes('exercises')) {
        tempActiveTab = 'exercises';
      } else if (pathName.includes('monitor-submissions')) {
        tempActiveTab = 'monitor';
      } else if (pathName.includes('final-results')) {
        tempActiveTab = 'final';
      } else if (pathName.includes('setup')) {
        tempActiveTab = 'setup';
      } else {
        tempActiveTab = '';
      }
    } else if (pathName.includes('facilitators')) {
      tempActiveTab = 'facilitators';
    } else if (pathName.includes('settings')) {
      tempActiveTab = 'settings';
    } else if (pathName.includes('workshops')) {
      tempActiveTab = '';
    }
    setActiveTab(tempActiveTab);
  };

  useEffect(() => {
    checkActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  async function getUserRole() {
    try {
      const userRef = doc(db, 'Facilitators', user.uid);
      const userDocSnap = await getDoc(userRef);
      if (userDocSnap.exists()) {
        setUserRole(userDocSnap.data().facilitatorType);
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // This observer gets called whenever the user's sign-in state changes.
    getUserRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex
      ref={sidebarRef}
      bg="white"
      borderBottomLeftRadius={16}
      borderRightColor="blackAlpha.200"
      borderRightWidth={1}
      bottom={0}
      flexDirection="column"
      h="full"
      justifyContent="space-between"
      left={0}
      position="fixed"
      transition="all .25s ease"
      width={isOpen ? 275 : 105}
      zIndex="10"
    >
      <Box>
        <Box h="80px" mt={10}>
          {isOpen ? (
            <Box borderRadius="md" h="80px" ml={8} w="170px">
              <Image alt="logo" src={Logo} style={{ height: '80px' }} />
              <Text fontSize="14px" fontWeight="600" paddingLeft="10px" marginTop="5px">
                Target Culture Mapping
              </Text>
            </Box>
          ) : (
            <Box borderRadius="md" h={10} mx="auto" w={6}>
              <Image alt="logo" src={MiniLogo} style={{ width: '100%', height: '100%' }} />
            </Box>
          )}
        </Box>
        {workshopCode && (
          <Stack mt={12}>
            <Flex alignItems="center" justifyContent="left" onClick={() => handleNavigate('workshops')}>
              <NavItem
                icon={IoStorefrontOutline}
                path="/workshops"
                title="All Workshops"
                isSidebarOpen={isOpen}
                isActive={activeTab === 'workshops'}
              />
            </Flex>
            <Flex alignItems="center" justifyContent="left" onClick={() => handleNavigate(`Workshop/${workshopCode}`)}>
              <NavItem
                icon={IoConstructOutline}
                path={`/Workshop/${workshopCode}`}
                title="Setup Workshop"
                isSidebarOpen={isOpen}
                isActive={activeTab === ''}
              />
            </Flex>
            <Flex alignItems="center" justifyContent="left" onClick={() => handleNavigate(`Workshop/${workshopCode}/exercises`)}>
              <NavItem
                icon={IoApertureOutline}
                path={`/Workshop/${workshopCode}/exercises`}
                title="Exercises"
                isSidebarOpen={isOpen}
                isActive={activeTab === 'exercises'}
              />
            </Flex>
            <Flex alignItems="center" justifyContent="left" onClick={() => handleNavigate(`Workshop/${workshopCode}/monitor-submissions`)}>
              <NavItem
                icon={IoPulseOutline}
                path={`/Workshop/${workshopCode}/monitor-submissions`}
                title="Monitor Submissions"
                isSidebarOpen={isOpen}
                isActive={activeTab === 'monitor'}
              />
            </Flex>
            <Flex alignItems="center" justifyContent="left" onClick={() => handleNavigate(`Workshop/${workshopCode}/final-results`)}>
              <NavItem
                icon={IoBarChartOutline}
                path={`/Workshop/${workshopCode}/final-results`}
                title="Final Results"
                isSidebarOpen={isOpen}
                isActive={activeTab === 'final'}
              />
            </Flex>
          </Stack>
        )}
        {!workshopCode && (
          <Stack mt={12}>
            <Flex
              alignItems="center"
              justifyContent="left"
              onClick={() => {
                handleNavigate('facilitators');
              }}
            >
              {userRole === 'admin' && (
                <NavItem
                  icon={IoPeopleOutline}
                  path="/facilitators"
                  title="Facilitators"
                  isSidebarOpen={isOpen}
                  isActive={activeTab === 'facilitators'}
                />
              )}
            </Flex>

            <Flex
              alignItems="center"
              justifyContent="left"
              onClick={() => {
                handleNavigate('workshops');
              }}
            >
              <NavItem icon={IoHomeOutline} path="/workshops" title="Workshops" isSidebarOpen={isOpen} isActive={activeTab === ''} />
            </Flex>
            <Flex
              alignItems="center"
              justifyContent="left"
              onClick={() => {
                handleNavigate('settings');
              }}
            >
              <NavItem
                icon={IoSettingsOutline}
                path="/settings"
                title="Settings"
                isSidebarOpen={isOpen}
                isActive={activeTab === 'settings'}
              />
            </Flex>
          </Stack>
        )}
      </Box>
      <Box h={56} pt={6}>
        <Flex alignItems="center" justifyContent="left" ml={8}>
          {userRole === 'admin' ? <Avatar h={10} name="A" w={10} /> : <Avatar h={10} name="F" w={10} />}
          {isOpen && (
            <>
              {userRole === 'admin' ? (
                <Text fontWeight="600" ml={3} size="md" textColor="gray.500">
                  Admin
                </Text>
              ) : (
                <Text fontWeight="600" ml={3} size="md" textColor="gray.500">
                  Facilitator
                </Text>
              )}
            </>
          )}
        </Flex>
        <Box pb={2} position="relative" pt={6} px={10}>
          <Divider />
          <IconButton
            aria-label="extend-sidebar"
            backgroundColor="white"
            borderColor="blackAlpha.200"
            borderRadius="full"
            borderWidth={1}
            height={10}
            icon={<IoChevronForward />}
            onClick={onToggle}
            position="absolute"
            right={-3}
            top={0}
            transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
            width={10}
          />
        </Box>
        <NavItem
          icon={RiLogoutCircleRLine}
          iconColor="#bc204bcc"
          onClick={() => {
            handleNavigate('sign-out');
          }}
          path="/admin/settings"
          title="Sign out"
          isSidebarOpen={isOpen}
        />
      </Box>
    </Flex>
  );
};

import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SidebarOpenContext } from '../Sidebar';
import { useTheme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';
import { useDisclosure } from '@chakra-ui/react';
import Header from '../Header/index';
import languages from 'components/Languages/LanguagesList';

import { openDrawer } from 'store/reducers/menu';
import Section from '../Section';
import { Sidebar } from '../index';

const MainLayout = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();

  const { drawerOpen } = useSelector(state => state.menu);

  const [open, setOpen] = useState(drawerOpen);

  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  const sidebarDisclosure = useDisclosure();
  const breadcrumbs = null;
  const defaultLanguage = 'en_us';
  const onLanguageChange = false;
  const onParticipantTypeChange = null;
  const onEditingChange = false;
  const showTypeChange = false;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <SidebarOpenContext.Provider value={sidebarDisclosure}>
        <Header
          breadcrumbs={breadcrumbs}
          defaultLanguage={defaultLanguage}
          languages={languages}
          onEditingChange={onEditingChange}
          onLanguageChange={onLanguageChange}
          onParticipantTypeChange={onParticipantTypeChange}
          showTypeChange={showTypeChange}
        />
        <Sidebar />
        <Box sx={{ width: '100%' }}>
          <Section component="main" sx={{ width: '100%' }}>
            <Outlet />
          </Section>
        </Box>
      </SidebarOpenContext.Provider>
    </Box>
  );
};

export default MainLayout;

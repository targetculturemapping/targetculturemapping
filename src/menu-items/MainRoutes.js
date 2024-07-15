import { HomeOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';
import { RiLogoutCircleRLine } from 'react-icons/ri';

const icons = {
  HomeOutlined,
  TeamOutlined,
  SettingOutlined,
  RiLogoutCircleRLine
};

const MainRoutes = {
  id: 'group-dashboard',
  title: 'Admin',
  type: 'group',
  children: [
    {
      id: 'facilitators',
      title: 'Facilitators',
      type: 'item',
      url: '/facilitators',
      icon: icons.TeamOutlined,
      breadcrumbs: false
    },
    {
      id: 'workshops',
      title: 'Workshops',
      type: 'item',
      url: '/workshops',
      icon: icons.HomeOutlined,
      breadcrumbs: false
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/settings',
      icon: icons.SettingOutlined,
      breadcrumbs: false
    },
    {
      id: 'sign-out',
      title: 'Sign Out',
      type: 'item',
      url: '/sign-out',
      icon: icons.RiLogoutCircleRLine,
      breadcrumbs: false
    }
  ]
};

export default MainRoutes;

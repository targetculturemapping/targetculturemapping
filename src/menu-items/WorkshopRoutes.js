import { HomeOutlined, ToolOutlined, BookOutlined, BarChartOutlined, EyeOutlined } from '@ant-design/icons';
import { RiLogoutCircleRLine } from 'react-icons/ri';

const icons = {
  HomeOutlined,
  RiLogoutCircleRLine,
  ToolOutlined,
  BookOutlined,
  EyeOutlined,
  BarChartOutlined
};

const WorkshopRoutes = {
  id: 'group-dashboard',
  title: 'Admin',
  type: 'group',
  children: [
    {
      id: 'allWorkshops',
      title: 'All Workshops',
      type: 'item',
      url: '/workshops',
      icon: icons.HomeOutlined,
      breadcrumbs: false
    },
    {
      id: 'setupWorkshop',
      title: 'Setup Workshop',
      type: 'item',
      url: '/Workshop/:workshopCode',
      icon: icons.ToolOutlined,
      breadcrumbs: false
    },
    {
      id: 'exercises',
      title: 'Exercises',
      type: 'item',
      url: '/Workshop/:workshopCode/exercises',
      icon: icons.BookOutlined,
      breadcrumbs: false
    },
    {
      id: 'monitorSubmissions',
      title: 'Monitor Submissions',
      type: 'item',
      url: '/Workshop/:workshopCode/monitor-submissions',
      icon: icons.EyeOutlined,
      breadcrumbs: false
    },
    {
      id: 'finalResults',
      title: 'Final Results',
      type: 'item',
      url: '/Workshop/:workshopCode/final-results',
      icon: icons.BarChartOutlined,
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

export default WorkshopRoutes;

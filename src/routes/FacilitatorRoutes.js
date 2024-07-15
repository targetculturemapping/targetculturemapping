import { lazy } from 'react';

import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout/index';

const Construction = Loadable(lazy(() => import('views/Construction')));
const Workshops = Loadable(lazy(() => import('views/Workshops')));
const SignOut = Loadable(lazy(() => import('pages/authentication/SignOut')));
const WorkshopDetails = Loadable(lazy(() => import('views/WorkshopDetails')));
const Exercises = Loadable(lazy(() => import('views/Exercises')));
const Exercise = Loadable(lazy(() => import('views/Exercise')));
const MonitorSubmissions = Loadable(lazy(() => import('views/MonitorSubmissions')));
const FinalResults = Loadable(lazy(() => import('views/FinalResults')));
const Settings = Loadable(lazy(() => import('views/ResetPasswird')));

const FacilitatorRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'workshops',
      element: <Workshops />
    },
    {
      path: '/',
      element: <Workshops />,
      default: true
    },
    {
      path: `workshop/:workshopCode`,
      element: <WorkshopDetails />
    },
    {
      path: `/workshop/:workshopCode/final-results`,
      element: <FinalResults />
    },
    {
      path: `/workshop/:workshopCode/monitor-submissions`,
      element: <MonitorSubmissions />
    },
    {
      path: `/workshop/:workshopCode/exercises`,
      element: <Exercises />
    },
    {
      path: `/workshop/:workshopCode/exercises/business-imperative-prioritization`,
      element: <Exercises />
    },
    {
      path: `/workshop/:workshopCode/exercises/:exercise`,
      element: <Exercise />
    },
    {
      path: 'settings',
      element: <Settings />
    },
    {
      path: 'sign-out',
      element: <SignOut />
    },
    {
      path: 'home',
      element: <Construction />
    }
  ]
};

export default FacilitatorRoutes;

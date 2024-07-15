import { lazy } from 'react';
import Loadable from 'components/Loadable';

const FacilitatorSignIn = Loadable(lazy(() => import('views/FacilitatorSignIn')));
const ParticipantSignIn = Loadable(lazy(() => import('views/ParticipantSignIn')));
const ParticipantView = Loadable(lazy(() => import('views/ParticipantView')));
const ForgotPassword = Loadable(lazy(() => import('views/ForgotPassword')));
const NotFound = Loadable(lazy(() => import('views/NotFound')));

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <ParticipantSignIn />,
      default: true
    },
    {
      path: 'participant',
      element: <ParticipantSignIn />
    },
    {
      path: 'facilitator',
      element: <FacilitatorSignIn />
    },
    {
      path: 'login',
      element: <FacilitatorSignIn />
    },
    {
      path: `participant/:workshopCode`,
      element: <ParticipantSignIn />
    },
    {
      path: `participant/:workshopCode/:participantName`,
      element: <ParticipantView />
    },
    {
      path: 'forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]
};

export default LoginRoutes;

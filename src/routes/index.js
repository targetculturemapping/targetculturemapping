/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

export default function ThemeRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = getAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    // This observer gets called whenever the user's sign-in state changes.
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, dispatch]); // Ensure effect only re-runs if auth object changes

  // Conditionally render routes based on authentication status
  if (isAuthenticated) {
    return useRoutes([MainRoutes]);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRoutes([LoginRoutes]);
  }
}

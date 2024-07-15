import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useToast } from '@chakra-ui/react';

const SignOut = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const toast = useToast();

  useEffect(() => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch(error => {
        toast({
          title: 'Error',
          description: 'An error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, auth]);

  return null;
};

export default SignOut;

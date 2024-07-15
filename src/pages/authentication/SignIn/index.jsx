import React, { useState } from 'react';

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  Text,
  Link,
  SimpleGrid,
  Stack,
  Image
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Logo from 'assets/images/logo.png';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import LoginImage from './OIP.jpg';

export default function SignIn() {
  const {
    register,
    formState: { errors }
  } = useForm();

  const auth = getAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // const [checked, setChecked] = React.useState(false);
  // const [showPassword, setShowPassword] = React.useState(false);

  // const handleClickShowPassword = () => {
  //  setShowPassword(!showPassword);
  // };

  const navigateToHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <SimpleGrid
      backgroundColor="white"
      columns={{ sm: 1, md: 2 }} // This will create 2 columns on medium screens and above, and 1 column on smaller screens
      height="90vh"
      width="90vw"
      margin="50px"
      gap={6} // Adjust spacing between grid items
    >
      <Box display={{ sm: 'none', md: 'initial' }} height="full" margin="auto" width="full">
        <Image
          alt="intro image"
          src={LoginImage}
          style={{
            width: '80%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '20px'
          }}
        />
      </Box>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        marginTop="10%"
        p={{
          base: 'md',
          sm: 'md',
          md: 'lg',
          lg: 'xl'
        }}
      >
        <Stack gap="2.5rem" width="90%">
          <Box h="8rem" w="16rem">
            <Image alt="logo image" src={Logo} style={{ width: '100%', height: '100%' }} />
          </Box>
          <Box mb="2">
            <Heading fontWeight={700} fontSize="15px" marginBottom={0}>
              Participant Sign In{' '}
            </Heading>
          </Box>
          <Box>
            <form
              onSubmit={async (values, { setErrors, setStatus }) => {
                try {
                  await signInWithEmailAndPassword(auth, values.email, values.password);
                  setStatus({ success: true });
                  setSubmitting(true);
                  navigateToHome();
                } catch (err) {
                  setStatus({ success: false });
                  if (err.message === 'Firebase: Error (auth/user-not-found).') {
                    setErrors({ submit: 'User not found' });
                  } else if (err.message === 'Firebase: Error (auth/invalid-credential).') {
                    setErrors({ submit: 'Incorrect username or password' });
                  } else {
                    setErrors({ submit: err.message });
                  }
                  setSubmitting(false);
                }
              }}
            >
              <Stack gap={3}>
                <FormControl isInvalid={!!errors.email}>
                  <Input
                    {...register('email', {
                      required: 'This field is required'
                    })}
                    fontSize="md"
                    id="email"
                    placeholder="Workshop Code"
                    size="lg"
                    type="email"
                  />
                  {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <InputGroup>
                    <Input
                      {...register('password', {
                        required: 'This field is required'
                      })}
                      fontSize="md"
                      id="password"
                      placeholder="Name"
                      size="lg"
                      type="text"
                    />
                  </InputGroup>
                  {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                </FormControl>

                <Box alignItems="center" display="flex">
                  <Text margin="10px"> Not a participant?</Text>

                  <Link style={{ color: '#4399e1', fontWeight: '600' }} href="/facilitator">
                    Sign in as a facilitator
                  </Link>
                </Box>
              </Stack>

              <Button
                color="white"
                backgroundColor="blue"
                fontSize="md"
                borderRadius="25px"
                isLoading={submitting}
                width={90}
                mt="3rem"
                size="lg"
                type="submit"
                variant="solid"
              >
                Join
              </Button>
            </form>
          </Box>
        </Stack>
      </Box>
    </SimpleGrid>
  );
}

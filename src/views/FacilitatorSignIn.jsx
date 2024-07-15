import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import {
  Box,
  FormControl,
  FormErrorMessage,
  Heading,
  Icon,
  Input,
  InputGroup,
  Text,
  InputRightElement,
  Link,
  SimpleGrid,
  Stack,
  Button,
  Image
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { IoEye, IoClose } from 'react-icons/io5';

import { useNavigate } from 'react-router-dom';

import Logo from 'assets/images/logo.png';

import LoginImage from 'assets/images/facilitator.jpg';

export default function FacilitatorSignIn() {
  const {
    register,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const toggleShowPassword = () => setShow(!show);
  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const nav = '/';
      navigate(nav, { replace: true });
      // Handle successful login here, possibly redirecting the user
    } catch (error) {
      setError(error.message); // Display error message to the user
      setLoading(false);
    }
  };

  return (
    <SimpleGrid backgroundColor="white" columns={{ sm: 1, md: 2 }} height="100vh">
      <Box display={{ sm: 'none', md: 'initial' }} height="80%" margin="auto" width="80%">
        <Image
          alt="intro image"
          src={LoginImage}
          style={{
            width: '100%',
            height: '100%',
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
        <Stack gap="2.5rem" width="60%">
          <Box h="8rem" w="16rem">
            <Image alt="logo image" src={Logo} style={{ width: '100%', height: '100%', marginTop: '50px' }} />
          </Box>
          <Box mb="2">
            <Heading fontWeight={700} fontSize="28px" marginTop="50px">
              Facilitator Sign In{' '}
            </Heading>
          </Box>
          <Box>
            <form onSubmit={handleSubmit}>
              <Stack gap={3}>
                <FormControl isInvalid={!!errors.email}>
                  <Input
                    {...register('email', {
                      required: 'This field is required'
                    })}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    id="email"
                    color="gray.700"
                    fontSize="16px"
                    fontWeight="400"
                    padding="10px"
                    borderRadius="5px"
                    borderWidth="2px"
                    width="100%"
                    variant="outline"
                    placeholder="Email"
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
                      placeholder="Password"
                      colorScheme="#0072ce"
                      padding="10px"
                      width="100%"
                      size="lg"
                      borderRadius="5px"
                      borderWidth="2px"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      type={show ? 'text' : 'password'}
                    />
                    <InputRightElement height="full" paddingRight="10px">
                      {show ? (
                        <Icon as={IoClose} boxSize={6} color="gray.500" onClick={toggleShowPassword} />
                      ) : (
                        <Icon as={IoEye} color="gray.300" boxSize={6} onClick={toggleShowPassword} />
                      )}
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                </FormControl>
                {error && <Text color="red.500">{error}</Text>}
                <Box alignItems="center" display="flex" justifyContent="space-between" width="100%">
                  <Box display="flex" alignItems="center">
                    <Text margin="10px"> Not a facilitator?</Text>
                    <Link color="#0072ce" fontWeight={600} href="/participant">
                      Sign in as a participant
                    </Link>
                  </Box>
                  <Link color="#0072ce" fontWeight={600} href="/forgot-password">
                    Forgot password?
                  </Link>
                </Box>
              </Stack>

              <Button
                color="white"
                backgroundColor="#0072ce"
                fontSize="md"
                borderRadius="10px"
                isLoading={loading}
                width={'full'}
                mt="3rem"
                size="lg"
                padding="10px"
                type="submit"
                variant="solid"
                fontWeight={700}
              >
                Log In
              </Button>
            </form>
          </Box>
        </Stack>
      </Box>
    </SimpleGrid>
  );
}

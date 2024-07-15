import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, useToast, Heading, SimpleGrid, Image, Link } from '@chakra-ui/react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

import Logo from 'assets/images/logo.png';

import LoginImage from 'assets/images/facilitator.jpg';

export default function ForgotPassword() {
  const auth = getAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Success!',
        description: 'Password reset email sent.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Password reset email not sent',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      console.error(error);
    } finally {
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
              Forgot Password{' '}
            </Heading>
          </Box>
          <Box>
            <form onSubmit={handleResetPassword}>
              <Stack gap={3}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    color="gray.700"
                    fontSize="16px"
                    fontWeight="400"
                    borderRadius="5px"
                    borderWidth="2px"
                    width="100%"
                    value={email}
                    padding="5px"
                    paddingLeft="10px"
                    placeholder="Enter your email"
                    onChange={handleEmailChange}
                    mt="10px"
                  />
                </FormControl>
                <Box alignItems="center" display="flex" justifyContent="space-between" width="100%">
                  <Link color="#0072ce" fontWeight={600} href="/login">
                    Back to sign in
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
                Send Password Reset Email
              </Button>
            </form>
          </Box>
        </Stack>
      </Box>
    </SimpleGrid>
  );
}

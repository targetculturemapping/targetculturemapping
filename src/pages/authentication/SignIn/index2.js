import React from 'react';

import { Box, FormControl, Heading, Input, InputGroup, Text, Link, SimpleGrid, Stack, Image } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import Logo from 'assets/images/logo.png';
import { Button } from '@chakra-ui/react';

import LoginImage from './OIP.jpg';

export default function SignIn2() {
  const {
    register,
    formState: { errors }
  } = useForm();
  // const toggleShowPassword = () => setShow(!show);

  return (
    <SimpleGrid backgroundColor="white" columns={{ sm: 1, md: 2 }} height="100vh">
      <Box display={{ sm: 'none', md: 'initial' }} height="80%" margin="auto" width="80%">
        <Image alt="intro image" src={LoginImage} width={500} height={500} objectFit="cover" borderRadius="20px" />
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
            <Heading fontWeight={700} size="lg">
              Participant Sign In{' '}
            </Heading>
          </Box>
          <Box>
            <form>
              <Stack gap={3}>
                <FormControl isInvalid={!!errors.email}>
                  <Input fontSize="md" id="email" placeholder="Workshop Code" size="lg" type="email" />
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
                </FormControl>
                <Box alignItems="center" display="flex">
                  <Text margin="10px"> Not a participant?</Text>
                  <Link color="electricBlue.500" fontWeight={600} href="/auth/forgot-password">
                    Sign in as a facilitator
                  </Link>
                </Box>
              </Stack>
              <Button
                colorScheme="electricBlue"
                fontSize="md"
                isLoading={false}
                minWidth={200}
                mt="3rem"
                size="lg"
                type="submit"
                variant="solid"
                width="full"
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

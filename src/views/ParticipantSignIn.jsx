import React, { useState, useEffect } from 'react';
import { Box, FormControl, Heading, Input, InputGroup, Text, Link, SimpleGrid, Stack, Button, Image, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, setDoc, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import 'components/css/introImage.css';
import Logo from 'assets/images/logo.png';
import LoginImage from 'assets/images/LoginImage.jpeg';

export default function ParticipantSignIn() {
  const toast = useToast();
  const db = getFirestore();
  const {
    register,
    formState: { errors }
  } = useForm();
  const { workshopCode } = useParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async event => {
    event.preventDefault();
    setLoading(true);
    if (firstName.trim() === '' || lastName.trim() === '') {
      toast({
        title: 'Error',
        description: 'Must enter first name and last name',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      setLoading(false);
      return;
    }
    try {
      const workshopRef = doc(db, 'Workshops', code);
      const workshopDocSnap = await getDoc(workshopRef);

      if (!workshopDocSnap.exists()) {
        toast({
          title: 'Error',
          description: 'Workshop does not exist',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        setLoading(false);
        return;
      }

      if (workshopDocSnap.data().status === 'Closed') {
        toast({
          title: 'Error',
          description: 'Workshop is closed',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        setLoading(false);
        return;
      }

      const participantNames = [];
      const querySnapshot = await getDocs(collection(db, 'Workshops', code, 'Participants'));
      querySnapshot.forEach(doc => {
        participantNames.push(`${doc.data().firstName}-${doc.data().lastName}`);
      });

      const participantFullName = `${firstName}-${lastName}`;

      if (participantNames.includes(participantFullName)) {
        toast({
          title: 'Found Participant!',
          description: 'Resuming workshop',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      } else {
        await setDoc(doc(db, 'Workshops', code, 'Participants', `${participantFullName}`), {
          firstName,
          lastName
        });
      }

      const nav = `/participant/${code}/${participantFullName}`;
      navigate(nav, { replace: true });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workshopCode) {
      setCode(workshopCode);
    }
  }, [workshopCode]);

  return (
    <SimpleGrid backgroundColor="white" columns={{ sm: 1, md: 2 }} height="100vh">
      <Box display={{ sm: 'none', md: 'none', lg: 'initial' }} height="80%" margin="auto">
        <Image alt="intro image" src={LoginImage} className="responsive-image" />
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
            <Image alt="logo image" src={Logo} style={{ width: '100%', height: '100%' }} />
          </Box>
          <Box mb="2">
            <Heading fontWeight={700} fontSize="28px" marginTop="50px">
              Participant Join In
            </Heading>
          </Box>
          <Box>
            <form onSubmit={handleJoin}>
              <Stack gap={3}>
                <FormControl isInvalid={!!errors.firstName}>
                  <Input
                    {...register('firstName', {
                      required: 'This field is required'
                    })}
                    fontSize="md"
                    id="firstName"
                    width="100%"
                    padding="10px"
                    borderRadius="5px"
                    borderWidth="2px"
                    placeholder="First Name"
                    onChange={e => setFirstName(e.target.value)}
                    size="lg"
                  />
                  {errors.firstName && <Text color="red.500">{errors.firstName.message}</Text>}
                </FormControl>
                <FormControl isInvalid={!!errors.lastName}>
                  <Input
                    {...register('lastName', {
                      required: 'This field is required'
                    })}
                    fontSize="md"
                    id="lastName"
                    onChange={e => setLastName(e.target.value)}
                    width="100%"
                    padding="10px"
                    borderRadius="5px"
                    borderWidth="2px"
                    placeholder="Last Name"
                    size="lg"
                  />
                  {errors.lastName && <Text color="red.500">{errors.lastName.message}</Text>}
                </FormControl>
                <FormControl isInvalid={!!errors.code}>
                  <InputGroup>
                    <Input
                      {...register('code', {
                        required: 'This field is required'
                      })}
                      fontSize="md"
                      id="code"
                      placeholder="Workshop Code"
                      onChange={e => setCode(e.target.value)}
                      padding="10px"
                      borderRadius="5px"
                      borderWidth="2px"
                      width="100%"
                      size="lg"
                      value={code}
                    />
                  </InputGroup>
                  {errors.code && <Text color="red.500">{errors.code.message}</Text>}
                </FormControl>
                <Box alignItems="center" display="flex" justifyContent="space-between" width="100%">
                  <Box display="flex" alignItems="center">
                    <Text margin="10px"> Not a participant?</Text>
                    <Link color="#0072ce" fontWeight={600} href="/facilitator">
                      Sign in as a facilitator
                    </Link>
                  </Box>
                </Box>
              </Stack>
              <Button
                color="white"
                backgroundColor="#0072ce"
                fontSize="md"
                borderRadius="10px"
                isLoading={loading}
                width={'full'}
                padding="10px"
                mt="3rem"
                size="lg"
                type="submit"
                variant="solid"
                fontWeight={700}
              >
                Join Workshop
              </Button>
            </form>
          </Box>
        </Stack>
      </Box>
    </SimpleGrid>
  );
}

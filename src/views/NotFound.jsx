import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, Text, Button, Center, VStack, Box } from '@chakra-ui/react';
import LoadingSpinner from '../components/core/LoadingSpinner';

const NotFound = () => {
  const navigate = useNavigate();
  const [defaultLoading, setDefaultLoading] = useState(true);

  useEffect(() => {
    // Redirect to a specific route, e.g., home page, after a delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 6000); // 6 seconds delay

    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    // Redirect to a specific route, e.g., home page, after a delay
    const timer = setTimeout(() => {
      setDefaultLoading(false);
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, [navigate]);

  if (defaultLoading) {
    return (
      <Box display="flex" justifyContent="center">
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Center h="100vh" bg="gray.100">
      <VStack spacing={6}>
        <Heading as="h1" size="xl">
          <strong>404 - Page Not Found</strong>
        </Heading>
        <Text fontSize="lg">The page you are looking for does not exist.</Text>
        <Text fontSize="md">You will be redirected to the home page shortly.</Text>
        <Button colorScheme="teal" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </VStack>
    </Center>
  );
};

export default NotFound;

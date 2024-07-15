import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, Text, useToast, Container } from '@chakra-ui/react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';

const ChangePassword = () => {
  const auth = getAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleCurrentPasswordChange = e => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = e => {
    setNewPassword(e.target.value);
  };

  const reauthenticate = async currentPassword => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  };

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      await reauthenticate(currentPassword);
      await updatePassword(auth.currentUser, newPassword);
      toast({
        title: 'Success!',
        description: 'Password has successfully changed.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred',
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
    <Box m={12}>
      <Box alignItems="baseline" display="flex" justifyContent="space-between">
        <Text color="gray.700" fontSize="20px" fontWeight="400">
          Settings
        </Text>
      </Box>
      <Container py={10}>
        <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
          <Stack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="left">
              Change Password
            </Text>
            <FormControl id="currentPassword">
              <FormLabel>Current Password</FormLabel>
              <Input
                type="password"
                color="gray.700"
                fontSize="16px"
                fontWeight="400"
                borderRadius="5px"
                borderWidth="2px"
                width="100%"
                value={currentPassword}
                padding="5px"
                paddingLeft="10px"
                placeholder="Enter your current password"
                onChange={handleCurrentPasswordChange}
                mt="10px"
              />
            </FormControl>
            <FormControl id="newPassword">
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                color="gray.700"
                fontSize="16px"
                fontWeight="400"
                borderRadius="5px"
                borderWidth="2px"
                width="100%"
                value={newPassword}
                padding="5px"
                paddingLeft="10px"
                placeholder="Enter your new password"
                onChange={handleNewPasswordChange}
                mt="10px"
              />
            </FormControl>
            <Box justifyContent="center" alignItems="center" mx="auto">
              {' '}
              <Button
                backgroundColor="#0072ce"
                borderRadius="lg"
                fontSize="16px"
                fontWeight="600"
                paddingBottom="7px"
                paddingTop="7px"
                textColor="white"
                type="submit"
                px="20px"
                isLoading={loading}
                onClick={handleChangePassword}
                justifyContent="center"
                alignItems="center"
              >
                Change Password
              </Button>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default ChangePassword;

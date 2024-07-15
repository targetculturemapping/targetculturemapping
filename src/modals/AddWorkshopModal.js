/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Img,
  Button,
  Modal,
  ModalOverlay,
  ModalFooter,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  Stack,
  Input,
  Box,
  IconButton,
  FormLabel,
  Text,
  useToast
} from '@chakra-ui/react';
import { Radio, RadioGroup, Typography, FormControl as MUIFormControl, FormControlLabel } from '@mui/material';
import noImage from 'assets/images/avatar-1.jpg';
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { getAuth } from 'firebase/auth';

function AddWorkshopModal({ isOpen, onClose, onRefresh }) {
  const toast = useToast();
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const user = auth.currentUser;
  const userEmail = user.email;
  const [workshopType, setWorkshopType] = useState('realClient');
  const [workshopName, setWorkshopName] = useState('');
  const [workshopImage, setWorkshopImage] = useState(noImage);
  const [addLoading, setAddLoading] = useState(false);

  const handleTypeChange = event => {
    setWorkshopType(event.target.value);
  };

  const handleNameChange = event => {
    setWorkshopName(event.target.value);
  };

  function generateUniqueCode() {
    const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }
  function isValidName(name) {
    return name.length >= 3;
  }

  const handleSubmit = async event => {
    setAddLoading(true);
    event.preventDefault();
    const currentDate = new Date();
    const createdAt = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    try {
      if (isValidName(workshopName)) {
        let newWorkshopCode = generateUniqueCode();
        const workshopCodesRef = doc(db, 'WorkshopCodes', 'Codes');
        const workshopCodesDocSnap = await getDoc(workshopCodesRef);
        if (workshopCodesDocSnap.exists()) {
          const allWorkshopCodes = workshopCodesDocSnap.data().codes;
          while (allWorkshopCodes.includes(newWorkshopCode)) {
            newWorkshopCode = generateUniqueCode();
          }
          allWorkshopCodes.push(newWorkshopCode);
          await setDoc(workshopCodesRef, { codes: allWorkshopCodes });
        }

        const workshopData = {
          workshopType,
          workshopName,
          workshopImage,
          facilitators: [userEmail],
          createdAt,
          workshopCode: newWorkshopCode,
          businessPrioritisationEnabled: 'Enabled',
          status: 'Open',
          currentExercise: -2,
          roundStarted: false,
          businessRound: 1
        };

        await setDoc(doc(db, 'Workshops', newWorkshopCode), workshopData);
        onRefresh();
        toast({
          title: 'Success!',
          description: 'Workshop added successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        setWorkshopImage(noImage);
        setWorkshopName('');
        setWorkshopType('realClient');
        onClose();
      } else {
        toast({
          title: 'Error',
          description: 'Must enter a valid workshop name',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (e) {
      console.error('Error adding workshop: ', e);
      toast({
        title: 'Error',
        description: 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
    setAddLoading(false);
  };

  const saveImage = async event => {
    setAddLoading(true);
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `clientLogos/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      setWorkshopImage(downloadUrl);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      console.error(error);
    }
    setAddLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay
        backdropFilter="blur(30px)"
        background="radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(205, 0, 73, 0.4) 0%, rgba(255, 255, 255, 0) 100%)"
        transform="rotate(-180deg)"
      />
      <ModalContent
        justifyContent="center"
        alignItems="center"
        padding="35px"
        margin="auto"
        borderRadius="24px"
        background="#FFFFFF"
        boxShadow="0px 2px 20px rgba(0, 0, 0, 0.06)"
        maxW="436px"
        px="40px"
      >
        <ModalHeader textAlign="center">
          <Stack>
            <Text color="gray.700" fontSize="30px" fontWeight="700">
              Create a new workshop
            </Text>
            <Text color="gray.500" fontSize="16px" fontWeight="400">
              Please enter workshop details below
            </Text>
          </Stack>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody pb={6}>
            <Stack spacing={3}>
              <FormControl display="flex" justifyContent="center" w="full">
                <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center">
                  <Box display="flex" justifyContent="center" width="80%">
                    <Img alt="workshop image" borderRadius="12px" height="200px" objectFit="cover" src={workshopImage} width="200px" />
                  </Box>
                  <Box>
                    <Button as="label" htmlFor="logoInput" borderRadius="10px" background="gray.200" padding="8px">
                      <Box display="flex" flexDirection="row">
                        <Box display="flex" size="50px">
                          <IconButton fontSize="22px" mr={2} as={IoCloudUploadOutline} />
                        </Box>
                        <Box display="flex">
                          <b>Change Image</b>
                        </Box>
                      </Box>

                      <input id="logoInput" type="file" accept="image/*" onChange={saveImage} style={{ display: 'none' }} />
                    </Button>
                  </Box>
                </Box>
              </FormControl>
              <FormControl>
                <FormLabel color="gray.500" fontSize="14px" fontWeight="500">
                  Enter Workshop Name
                </FormLabel>
                <Input
                  color="gray.700"
                  fontSize="16px"
                  fontWeight="400"
                  borderRadius="5px"
                  borderWidth="2px"
                  width="100%"
                  value={workshopName}
                  padding="5px"
                  paddingLeft="10px"
                  placeholder="Workshop name"
                  onChange={handleNameChange}
                  mt="10px"
                />
              </FormControl>
              <MUIFormControl>
                <FormLabel color="gray.500" fontSize="14px" fontWeight="500">
                  Select Workshop Type
                </FormLabel>
                <RadioGroup value={workshopType} onChange={handleTypeChange} mt={2}>
                  <Stack direction="column">
                    <FormControlLabel
                      value="realClient"
                      control={<Radio />}
                      label={
                        <Typography fontSize="16px" fontWeight="400">
                          <b>A real client workshop.</b> This type of workshop is permanent and cannot be deleted.
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="training"
                      control={<Radio />}
                      label={
                        <Typography fontSize="16px" fontWeight="400">
                          <b>A training workshop.</b> This type of workshop is good for testing and learning. Will be removed after 30 days.
                        </Typography>
                      }
                    />
                  </Stack>
                </RadioGroup>
              </MUIFormControl>
            </Stack>
          </ModalBody>
          <ModalFooter display="flex" w="full">
            <Button
              border={`1px solid #0072ce`}
              borderRadius="lg"
              fontSize="16px"
              fontWeight="600"
              mr={4}
              onClick={onClose}
              paddingBottom="7px"
              paddingTop="7px"
              textColor="#0072ce"
              width="50%"
            >
              Cancel
            </Button>
            <Button
              isLoading={addLoading}
              backgroundColor="#0072ce"
              borderRadius="lg"
              fontSize="16px"
              fontWeight="600"
              paddingBottom="7px"
              paddingTop="7px"
              textColor="white"
              type="submit"
              width="50%"
            >
              Add
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default AddWorkshopModal;

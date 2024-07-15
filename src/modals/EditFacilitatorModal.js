/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Img,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  FormControl,
  Stack,
  Input,
  Box,
  FormLabel,
  Text,
  IconButton,
  useToast
} from '@chakra-ui/react';
import noImage from 'assets/images/avatar-1.jpg';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { Radio, RadioGroup, Typography, FormControl as MUIFormControl, FormControlLabel } from '@mui/material';

const db = getFirestore();
const storage = getStorage();

function EditFacilitatorModal({ isOpen, onClose, onRefresh, facilitator }) {
  const [facilitatorType, setFacilitatorType] = useState('facilitator');
  const [facilitatorEmail, setFacilitatorEmail] = useState('');
  const [facilitatorName, setFacilitatorName] = useState('');
  const toast = useToast();
  const [facilitatorImage, setFacilitatorImage] = useState(noImage);
  const [editLoading, setEditLoading] = useState(false);

  const handleTypeChange = value => {
    setFacilitatorType(value);
  };
  const handleNameChange = event => {
    setFacilitatorName(event.target.value);
  };

  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  function isValidName(name) {
    const namePattern = /^[^\s]{1,}[ ][^\s]{1,}/;
    return name.length >= 3 && namePattern.test(name);
  }

  const handleSubmit = async event => {
    setEditLoading(true);
    event.preventDefault();
    try {
      const facilitatorData = {
        facilitatorEmail,
        facilitatorName,
        facilitatorImage,
        createdAt: facilitator?.createdAt
      };
      if (isValidEmail(facilitatorEmail) && isValidName(facilitatorName)) {
        const docRef = doc(db, 'Facilitators', facilitator?.id);
        await updateDoc(docRef, facilitatorData);
        onRefresh();
        toast({
          title: 'Success!',
          description: 'Facilitator updated successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        setFacilitatorImage(noImage);
        setFacilitatorName('');
        setFacilitatorEmail('');
        setFacilitatorType('facilitator');
        onClose();
      } else {
        toast({
          title: 'Error',
          description: 'Must enter correct facilitator name and email',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (e) {
      console.error('Error updating facilitator: ', e);
      toast({
        title: 'Error',
        description: 'Error updating facilitator',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
    setEditLoading(false);
  };

  const saveImage = async event => {
    setEditLoading(true);
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `facilitatorLogos/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      setFacilitatorImage(downloadUrl);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error uploading image',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      console.error(error);
    }
    setEditLoading(false);
  };

  const updateData = () => {
    setFacilitatorImage(facilitator?.facilitatorImage);
    setFacilitatorEmail(facilitator?.facilitatorEmail);
    setFacilitatorName(facilitator?.facilitatorName);
    setFacilitatorType(facilitator?.facilitatorType);
  };

  useEffect(() => {
    updateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilitator]);

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
        <IconButton aria-label="close" icon={<CloseIcon />} onClick={onClose} position="absolute" right={8} top={8} />
        <ModalHeader textAlign="center">
          <Stack>
            <Text color="gray.700" fontSize="30px" fontWeight="700">
              Edit Facilitator
            </Text>
            <Text color="gray.500" fontSize="16px" fontWeight="400">
              Edit facilitator details below
            </Text>
          </Stack>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody pb={6}>
            <Stack spacing={3}>
              <FormControl display="flex" justifyContent="center" w="full">
                <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center">
                  <Box display="flex" justifyContent="center" width="80%">
                    <Img
                      alt="facilitator image"
                      borderRadius="12px"
                      height="200px"
                      objectFit="cover"
                      src={facilitatorImage}
                      width="200px"
                    />
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
                  Enter Facilitator Name
                </FormLabel>
                <Input
                  color="gray.700"
                  fontSize="16px"
                  fontWeight="400"
                  borderRadius="5px"
                  borderWidth="2px"
                  width="100%"
                  value={facilitatorName}
                  padding="5px"
                  paddingLeft="10px"
                  placeholder="Facilitator name"
                  onChange={handleNameChange}
                  mt="10px"
                />
              </FormControl>
              <FormControl>
                <FormLabel color="gray.500" fontSize="14px" fontWeight="500">
                  Enter Facilitator Email
                </FormLabel>
                <Input
                  color="gray.700"
                  fontSize="16px"
                  fontWeight="400"
                  borderRadius="5px"
                  borderWidth="2px"
                  width="100%"
                  value={facilitatorEmail}
                  padding="5px"
                  paddingLeft="10px"
                  placeholder="Facilitator email"
                  isDisabled={true}
                  mt="10px"
                />
              </FormControl>
              <MUIFormControl>
                <RadioGroup value={facilitatorType} onChange={handleTypeChange} mt={2}>
                  <Stack direction="column">
                    <FormControlLabel
                      value="admin"
                      control={<Radio />}
                      label={
                        <Typography fontSize="16px" fontWeight="400">
                          <b>Admin.</b> Access to all workshops
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="facilitator"
                      control={<Radio />}
                      label={
                        <Typography fontSize="16px" fontWeight="400">
                          <b>Facilitator.</b> Access to only the workshops created or added to
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
              isLoading={editLoading}
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
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default EditFacilitatorModal;

import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Input, Icon, Menu, MenuList, MenuItem, MenuButton } from '@chakra-ui/react';
import { IoAddOutline, IoTrashSharp } from 'react-icons/io5';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { getDocs, getFirestore, collection } from 'firebase/firestore';

// eslint-disable-next-line react/prop-types
const FacilitatorsComponent = ({ facilitators, isEditing, handleFacilitatorUpdate }) => {
  const db = getFirestore();

  const [newFacilitators, setNewFacilitators] = useState([]);
  const [facilitatorEmails, setFacilitatorEmails] = useState([]);

  const handleFacilitatorChange = (event, index) => {
    const { value } = event.target;
    const updatedFacilitators = newFacilitators.map((facilitator, idx) => (idx === index ? value : facilitator));
    setNewFacilitators(updatedFacilitators);
    handleFacilitatorUpdate(updatedFacilitators);
  };

  const fetchFacilitators = async () => {
    const querySnapshot = await getDocs(collection(db, 'Facilitators'));
    const allDocsData = querySnapshot.docs?.map(doc => ({ id: doc.id, ...doc.data() }));
    const tempFacilitatorEmails = allDocsData.map(doc => doc.facilitatorEmail).filter(Boolean);
    setFacilitatorEmails(tempFacilitatorEmails);
  };

  const handleDeleteFacilitator = index => {
    const emailToDelete = newFacilitators[index];
    const updatedFacilitators = newFacilitators.filter((_, idx) => idx !== index);
    setNewFacilitators(updatedFacilitators);
    handleFacilitatorUpdate(updatedFacilitators);
    setFacilitatorEmails([...facilitatorEmails, emailToDelete]);
  };

  const addFacilitator = email => {
    const updatedFacilitators = [...newFacilitators, email];
    setNewFacilitators(updatedFacilitators);
    handleFacilitatorUpdate(updatedFacilitators);
    setFacilitatorEmails(facilitatorEmails.filter(e => e !== email));
  };

  useEffect(() => {
    fetchFacilitators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setNewFacilitators(facilitators);
  }, [facilitators]);

  // Filter the dropdown list to exclude already added facilitators
  const availableFacilitators = facilitatorEmails.filter(email => !newFacilitators.includes(email));

  if (isEditing) {
    return (
      <Box display="flex" flex={1} flexDirection="column">
        {newFacilitators.map((facilitator, index) => (
          <Box key={index} display="flex" flexDirection="column" marginLeft="25px">
            <Box alignItems="center" display="flex" flexDirection="row">
              <Icon as={ChevronRightIcon} height="16px" marginLeft="15px" />
              <Input
                placeholder="Enter facilitator email"
                width={350}
                color="gray.700"
                fontSize="16px"
                fontWeight="400"
                margin="5px"
                padding="10px"
                borderRadius="5px"
                disabled={true}
                borderWidth="2px"
                value={facilitator}
                onChange={event => handleFacilitatorChange(event, index)}
              />
              <Icon
                as={IoTrashSharp}
                cursor="pointer"
                onClick={() => handleDeleteFacilitator(index)}
                fontSize="20px"
                marginLeft="15px"
                color="#FF0000"
              />
            </Box>
          </Box>
        ))}
        <Box alignItems="center" display="flex" flexDirection="row" marginLeft="25px">
          <Menu>
            <MenuButton
              backgroundColor="#0072ce"
              borderRadius="8px"
              color="white"
              display="flex"
              fontSize="18px"
              fontWeight="600"
              gap="11px"
              as={Button}
              justifyContent="center"
              padding="5px 20px"
              leftIcon={<IoAddOutline />}
              mt={25}
            >
              Add Facilitator
            </MenuButton>
            <MenuList zIndex="10">
              {availableFacilitators.map(email => (
                <MenuItem
                  minH="48px"
                  backgroundColor="#FFFFFF"
                  borderRadius="8px"
                  fontSize="16px"
                  px="10px"
                  borderWidth="1px"
                  key={email}
                  onClick={() => addFacilitator(email)}
                >
                  {email}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </Box>
    );
  }

  if (!newFacilitators || newFacilitators.length === 0) {
    return (
      <Box display="flex" flex={1} flexDirection="column">
        <Box display="flex" flexDirection="column" marginLeft="25px">
          <Box alignItems="center" display="flex" flexDirection="row">
            <Text fontSize="18px" marginLeft="10px" color="#FF0000">
              <b>No facilitators added yet</b>
            </Text>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" flex={1} flexDirection="column">
      {newFacilitators.map((facilitator, index) => (
        <Box key={index} display="flex" flexDirection="column" marginLeft="25px">
          <Box alignItems="center" display="flex" flexDirection="row">
            <Icon as={ChevronRightIcon} marginLeft="15px" />
            <Text fontSize="18px" marginLeft="10px">
              {facilitator}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default FacilitatorsComponent;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { CopyIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Flex, Icon, LinkBox, LinkOverlay, Text, Stack, useToast } from '@chakra-ui/react';
import Switch from '@mui/material/Switch';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { IoPencilOutline, IoCloseSharp } from 'react-icons/io5';
import { RiLoginCircleLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import ExerciseComponent from 'components/core/ExerciseComponent';
import FacilitatorsComponent from '../components/core/FacilitatorsComponent';
import LoadingSpinner from 'components/core/LoadingSpinner';

export default function WorkshopDetails() {
  const db = getFirestore();
  const navigate = useNavigate();
  const { workshopCode } = useParams();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [workshopData, setWorkshopData] = useState();
  const [bgColor, setBgColor] = useState('#e1f2d0');
  const [textColor, setTextColor] = useState('#56843d');
  const [mainLoading, setMainLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchData = async () => {
    setMainLoading(true);
    const workshopRef = doc(db, 'Workshops', workshopCode);
    const workshopDocSnap = await getDoc(workshopRef);
    if (workshopDocSnap.exists()) {
      setWorkshopData(workshopDocSnap.data());
    } else {
      toast({
        title: 'Error',
        description: 'Please refresh the page',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
    setMainLoading(false);
  };

  const navigateToExercise = () => {
    navigate(`/Workshop/${workshopCode}/exercises`);
  };

  const handleEditWorkshop = async () => {
    if (isEditing) {
      setSaveLoading(true);
      try {
        const workshopRef = doc(db, 'Workshops', workshopCode);
        await setDoc(workshopRef, workshopData, { merge: true });
        setIsEditing(false);
        toast({
          title: 'Success!',
          description: 'Workshop Updated',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      } catch (e) {
        toast({
          title: 'Error',
          description: 'An error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        console.error(e);
      }
    } else {
      setIsEditing(true);
    }
    setSaveLoading(false);
  };

  const handleBusinessPrioritisationEnabledChange = () => {
    setWorkshopData(prevData => ({
      ...prevData,
      businessPrioritisationEnabled: prevData.businessPrioritisationEnabled === 'Enabled' ? 'Disabled' : 'Enabled'
    }));
  };

  const handleStatusChange = () => {
    setWorkshopData(prevData => ({
      ...prevData,
      status: prevData.status === 'Open' ? 'Closed' : 'Open'
    }));
  };

  const handleUpdateExercises = newExercises => {
    setWorkshopData(prevData => ({
      ...prevData,
      exercises: newExercises
    }));
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(`https://target-culture-management.vercel.app/participant/${workshopCode}`)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(error => console.error('Error copying to clipboard:', error));
  };
  const handleFacilitatorUpdate = updatedData => {
    setWorkshopData(prevData => ({ ...prevData, facilitators: updatedData }));
  };

  useEffect(() => {
    setBgColor(workshopData?.status === 'Open' ? '#e1f2d0' : '#fde2cd');
    setTextColor(workshopData?.status === 'Open' ? '#56843d' : '#de751 56843d');
  }, [workshopData?.status]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshopCode]);

  const handleCancelEditing = () => {
    setIsEditing(false);
    fetchData();
  };

  if (mainLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={12}>
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box flex={1} marginBottom="50px" mt="20px" px="10%">
      <Box backgroundColor="white" borderTopRadius="2xl" height="100%" overflowX="hidden">
        <Flex flex={1} flexDirection="column">
          <Box display="flex" justifyContent="flex-start">
            <Text color="#bc204b" fontSize="34px" fontWeight="600" paddingLeft="30" paddingTop="30">
              {' '}
              {workshopData?.workshopName}
            </Text>
          </Box>
          <Box display="flex" justifyContent="flex-end" marginRight="25">
            {isEditing && (
              <Button
                backgroundColor="#FF0000"
                borderRadius="8px"
                color="white"
                display="flex"
                fontSize="18px"
                fontWeight="600"
                gap="11px"
                mr={15}
                justifyContent="center"
                padding="5px 20px"
                onClick={handleCancelEditing}
                isLoading={saveLoading}
                width="200px"
                height="40px"
              >
                <Icon aria-label="edit" as={IoCloseSharp} color="white" />
                <Text>Cancel</Text>
              </Button>
            )}
            <Button
              backgroundColor="#0072ce"
              borderRadius="8px"
              color="white"
              display="flex"
              fontSize="18px"
              fontWeight="600"
              gap="11px"
              justifyContent="center"
              padding="5px 20px"
              onClick={handleEditWorkshop}
              isLoading={saveLoading}
              width="200px"
              height="40px"
            >
              <Icon aria-label="edit" as={IoPencilOutline} color="white" />
              <Text>{isEditing ? 'Save changes' : 'Edit Workshop'}</Text>
            </Button>
          </Box>
        </Flex>
        <Flex alignItems="flex-start" flex={1} flexDirection="row">
          <Box display="flex" flex={2} flexDirection="column" justifyContent="space-between" marginRight="25">
            <Text fontSize="24px" marginBottom="5px" marginLeft="25" marginTop="25">
              Facilitators
            </Text>
            <Divider
              width="90%"
              marginBottom="25"
              marginLeft="25"
              marginRight="25px"
              border="10px"
              orientation="horizontal"
              color="gray.300"
              sx={{ border: '0.5px solid' }}
            />
            <Flex alignItems="flex-start" flex={1} flexDirection="row">
              <Box display="flex" flex={2} flexDirection="column" justifyContent="space-between" marginRight="25">
                <FacilitatorsComponent
                  facilitators={workshopData?.facilitators}
                  isEditing={isEditing}
                  handleFacilitatorUpdate={handleFacilitatorUpdate}
                />
              </Box>
            </Flex>

            <Flex flex={1} flexDirection="row" justifyContent="space-between" alignItems="center">
              <Text fontSize="24px" marginBottom="5px" marginLeft="25px" marginTop="25px">
                Business Imperatives
              </Text>
              {isEditing && (
                <Stack direction="column" align="center" marginRight="25px" marginTop="25px">
                  <Text fontWeight="600">Business Imperative Prioritisation</Text>
                  <Stack direction="row" align="center">
                    <Text>Disabled</Text>
                    <Switch
                      checked={workshopData?.businessPrioritisationEnabled === 'Enabled'}
                      onChange={handleBusinessPrioritisationEnabledChange}
                      size="lg"
                    />
                    <Text>Enabled</Text>
                  </Stack>
                </Stack>
              )}
            </Flex>

            <Divider
              width="90%"
              marginBottom="25"
              marginLeft="25"
              marginRight="25px"
              border="10px"
              orientation="horizontal"
              color="gray.300"
              sx={{ border: '0.5px solid' }}
            />
            <ExerciseComponent
              exercises={workshopData?.exercises ? workshopData?.exercises : []}
              isEditing={isEditing}
              handleUpdateExercises={handleUpdateExercises}
            />
            {!isEditing && (
              <Box mt={20}>
                <Button
                  backgroundColor="#0072ce"
                  borderRadius="8px"
                  color="white"
                  display="flex"
                  fontSize="18px"
                  fontWeight="600"
                  marginLeft="30px"
                  gap="11px"
                  justifyContent="center"
                  padding="5px 20px"
                  onClick={navigateToExercise}
                >
                  <Text>{'Start voting exercises'}</Text>
                  <Icon aria-label="edit" as={RiLoginCircleLine} color="white" />
                </Button>
              </Box>
            )}
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="space-between" mt={25} mr="25px" width="400px">
            <Box display="flex" flexDirection="column" justifyContent="space-between" mr="25px" width="100%">
              {isEditing && (
                <Stack direction="column" align="center" mr="25px" mt="25px" width="100%">
                  <Text fontWeight="600">Workshop Status</Text>
                  <Stack direction="row" align="center">
                    <Text>Closed</Text>
                    <Switch checked={workshopData?.status === 'Open'} onChange={handleStatusChange} size="lg" />
                    <Text>Open</Text>
                  </Stack>
                </Stack>
              )}

              <Box backgroundColor={bgColor} mb="25px" p="15px" pr="40px" width="100%">
                <Text textColor={textColor}>Workshop Code</Text>
                <Text fontSize="34px" fontWeight="700" textColor={textColor}>
                  {workshopCode}
                </Text>
                <Flex align="center" textColor={textColor}>
                  <Text>The workshop is </Text>
                  <Text fontWeight="700" ml="5px">
                    {workshopData?.status}
                  </Text>
                </Flex>
              </Box>
            </Box>
            <QRCodeCanvas size={400} value={`https://target-culture-management.vercel.app/participant/${workshopCode}`} />
            <Box backgroundColor="#f5f5f5" mt={5} borderRadius="5px" mb="15px" p="10px" width="100%">
              <Flex flexDirection="column" alignItems="start" justifyContent="space-between">
                <Text fontWeight="600" mb="10px">
                  Participant login link:
                </Text>
                <LinkBox borderRadius="5px" borderWidth="1px" overflow="hidden">
                  <Flex alignItems="center" bg="white" borderColor="gray.200" borderRadius="md" borderWidth="1px" boxShadow="sm" p={2}>
                    <Box flex="1" mr={2} textAlign="center">
                      <LinkOverlay
                        color="blue"
                        href={`https://target-culture-management.vercel.app/participant/${workshopCode}`}
                        isExternal
                      >
                        {`https://target-culture-management.vercel.app/participant/${workshopCode}`}
                      </LinkOverlay>
                    </Box>
                    <Button leftIcon={<CopyIcon />} size="sm" variant="ghost" onClick={handleCopyClick}>
                      {copySuccess ? 'Copied!' : 'Copy'}
                    </Button>
                  </Flex>
                </LinkBox>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

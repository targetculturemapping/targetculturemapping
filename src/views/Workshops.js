import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Box,
  Button,
  Text,
  Img,
  Icon,
  useToast,
  Tooltip
} from '@chakra-ui/react';
import { IoTrash, IoPencil, IoAdd } from 'react-icons/io5';
import AddNewWorkshopModal from 'modals/AddWorkshopModal';
import { collection, getDocs, getDoc, doc, deleteDoc, getFirestore } from 'firebase/firestore';
import EditWorkshopModal from 'modals/EditWorkshopModal';
import { getAuth } from 'firebase/auth';
import ActionModal from '../modals/ActionModal';
import LoadingSpinner from 'components/core/LoadingSpinner';

const Workshops = () => {
  const db = getFirestore();
  const navigate = useNavigate();
  const auth = getAuth();
  const toast = useToast();
  const currentUser = auth.currentUser;
  const [newWorkshopOpen, setNewWorkshopOpen] = useState(false);
  const [editWorkshopOpen, setEditWorkshopOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState();
  const [userRole, setUserRole] = useState('facilitator');
  const [trainings, setTrainings] = useState([]);
  const [clients, setClients] = useState([]);
  const [isDeleteWorkshopOpen, setIsDeleteWorkshopOpen] = useState(false);
  const [deleteWorkshopLoading, setDeleteWorkshopLoading] = useState(false);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState();
  const [selectedWorkshopName, setSelectedWorkshopName] = useState();
  const [mainLoading, setMainLoading] = useState(false);
  async function getUserRole() {
    const user = auth.currentUser;
    try {
      const userRef = doc(db, 'Facilitators', user.uid);
      const userDocSnap = await getDoc(userRef);
      if (userDocSnap.exists()) {
        setUserRole(userDocSnap.data().facilitatorType);
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // This observer gets called whenever the user's sign-in state changes.
    getUserRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function fetchDocs() {
    setMainLoading(true);
    const querySnapshot = await getDocs(collection(db, 'Workshops'));
    const staticClients = [];
    const staticTrainings = [];
    const allDocsData = querySnapshot.docs?.map(doc => ({ id: doc.id, ...doc.data() }));

    // Parse the createdAt field and sort by date (newest first)
    const sortedDocs = allDocsData.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA; // Newest first
    });
    sortedDocs.forEach(doc => {
      if (userRole === 'facilitator') {
        if (doc.facilitators?.includes(currentUser.email)) {
          if (doc?.workshopType === 'realClient') {
            staticClients.push(doc);
          } else {
            staticTrainings.push(doc);
          }
        }
      } else {
        if (doc?.workshopType === 'realClient') {
          staticClients.push(doc);
        } else {
          staticTrainings.push(doc);
        }
      }
    });

    setClients(staticClients);
    setTrainings(staticTrainings);
    setMainLoading(false);
  }

  useEffect(() => {
    fetchDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  const openNewWorkshopModal = () => {
    setNewWorkshopOpen(true);
  };

  const closeNewWorkshopModal = () => {
    setNewWorkshopOpen(false);
  };

  const refreshDocs = async () => {
    fetchDocs();
  };

  const handleDelete = async (id, name) => {
    setSelectedWorkshopId(id);
    setSelectedWorkshopName(name);
    setIsDeleteWorkshopOpen(true);
  };

  const deleteWorkshop = async id => {
    setDeleteWorkshopLoading(true);
    try {
      await deleteDoc(doc(db, 'Workshops', id));
      setIsDeleteWorkshopOpen(false);
      toast({
        title: 'Success!',
        description: 'Workshop Deleted',
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      fetchDocs();
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
    setDeleteWorkshopLoading(false);
  };

  const openEditWorkshopModal = workshop => {
    setSelectedWorkshop(workshop);
    setEditWorkshopOpen(true);
  };

  const closeEditWorkshopModal = () => {
    setEditWorkshopOpen(false);
  };

  const handleRoute = workshopCode => {
    navigate(`/Workshop/${workshopCode}`);
  };
  if (mainLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={12} height="100%">
        <LoadingSpinner size="xl" />
      </Box>
    );
  }
  return (
    <>
      <Box m={12}>
        <Box alignItems="baseline" display="flex" justifyContent="space-between">
          <Text color="gray.700" fontSize="20px" fontWeight="400">
            Workshops
          </Text>
          <Button
            backgroundColor="#0072ce"
            borderRadius="8px"
            color="white"
            display="flex"
            fontSize="18px"
            fontWeight="600"
            gap="11px"
            justifyContent="center"
            onClick={openNewWorkshopModal}
            padding="8px 20px"
          >
            <Icon aria-label="edit" as={IoAdd} color="white" />
            <Text>New Workshop</Text>
          </Button>
        </Box>
        {clients.length > 0 && (
          <TableContainer borderBottomLeftRadius="16px" borderBottomRightRadius="16px" paddingTop="25px">
            <Table size="sm" variant="simple" width="100%">
              <Thead>
                <Tr>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="start" paddingLeft="30px">
                    CLIENT WORKSHOPS
                  </Th>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="center">
                    WORKSHOP CODE
                  </Th>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="center">
                    DATE CREATED
                  </Th>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="end" paddingRight="30px">
                    ACTIONS
                  </Th>
                </Tr>
              </Thead>
              <Tbody background="white">
                {clients?.map(client => (
                  <Tr key={client?.id}>
                    <Td
                      alignItems="center"
                      cursor="pointer"
                      display="flex"
                      fontSize="16px"
                      fontWeight="400"
                      gap="24px"
                      paddingBottom="20px"
                      paddingLeft="30px"
                      paddingTop="20px"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      width="60%"
                      onClick={() => handleRoute(client?.workshopCode)}
                    >
                      <Img
                        alt="client image"
                        borderRadius="12px"
                        height="54px"
                        objectFit="cover"
                        src={client?.workshopImage}
                        width="54px"
                        onClick={() => handleRoute(client?.workshopCode)}
                      />
                      {client?.workshopName}
                    </Td>
                    <Td
                      color="gray.700"
                      cursor="pointer"
                      fontSize="16px"
                      onClick={() => handleRoute(client?.workshopCode)}
                      fontWeight="400"
                      textAlign="center"
                      width="15%"
                    >
                      {client?.workshopCode}
                    </Td>
                    <Td
                      color="gray.700"
                      cursor="pointer"
                      fontSize="16px"
                      onClick={() => handleRoute(client?.workshopCode)}
                      fontWeight="400"
                      textAlign="center"
                      width="15%"
                    >
                      {client?.createdAt}
                    </Td>
                    <Td textAlign="end" whiteSpace="nowrap" paddingRight="20px" width="10%">
                      <Tooltip label="Edit" placement="top">
                        <IconButton
                          aria-label="edit"
                          color="gray.500"
                          colorScheme="transperent"
                          data-id={client?.id}
                          paddingRight="15px"
                          fontSize="20px"
                          icon={<IoPencil />}
                          onClick={() => {
                            openEditWorkshopModal(client);
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Delete" placement="top">
                        <IconButton
                          aria-label="delete"
                          color="gray.500"
                          colorScheme="transperent"
                          data-id={client?.id}
                          data-name={client?.workshopName}
                          paddingRight="10px"
                          fontSize="20px"
                          onClick={() => {
                            handleDelete(client?.id, client?.workshopName);
                          }}
                          icon={<IoTrash />}
                        />
                      </Tooltip>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
        {trainings.length > 0 && (
          <TableContainer borderBottomLeftRadius="16px" marginTop="20px" borderBottomRightRadius="16px" paddingTop="25px">
            <Table size="sm" variant="simple" width="100%">
              <Thead>
                <Tr>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="start" paddingLeft="30px">
                    TRAINING WORKSHOPS
                  </Th>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="center">
                    WORKSHOP CODE
                  </Th>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="center">
                    DATE CREATED
                  </Th>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="end" paddingRight="30px">
                    ACTIONS
                  </Th>
                </Tr>
              </Thead>
              <Tbody background="white">
                {trainings?.map(training => (
                  <Tr key={training?.id}>
                    <Td
                      alignItems="center"
                      cursor="pointer"
                      display="flex"
                      fontSize="16px"
                      fontWeight="400"
                      gap="24px"
                      paddingBottom="20px"
                      paddingTop="20px"
                      paddingLeft="30px"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      onClick={() => handleRoute(training?.workshopCode)}
                      width="60%"
                    >
                      <Img
                        alt="client image"
                        borderRadius="12px"
                        height="54px"
                        objectFit="cover"
                        src={training?.workshopImage}
                        width="54px"
                      />
                      {training?.workshopName}
                    </Td>
                    <Td
                      color="gray.700"
                      cursor="pointer"
                      fontSize="16px"
                      fontWeight="400"
                      textAlign="center"
                      width="15%"
                      onClick={() => handleRoute(training?.workshopCode)}
                    >
                      {training?.workshopCode}
                    </Td>
                    <Td
                      color="gray.700"
                      cursor="pointer"
                      fontSize="16px"
                      fontWeight="400"
                      textAlign="center"
                      width="15%"
                      onClick={() => handleRoute(training?.workshopCode)}
                    >
                      {training?.createdAt}
                    </Td>
                    <Td textAlign="end" whiteSpace="nowrap" paddingRight="20px" width="10%">
                      <Tooltip label="Edit" placement="top">
                        <IconButton
                          aria-label="edit"
                          color="gray.500"
                          colorScheme="transperent"
                          data-id={training?.id}
                          fontSize="20px"
                          paddingRight="15px"
                          icon={<IoPencil />}
                          onClick={() => {
                            openEditWorkshopModal(training);
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Delete" placement="top">
                        <IconButton
                          aria-label="delete"
                          color="gray.500"
                          colorScheme="transperent"
                          onClick={() => {
                            handleDelete(training.id, training.workshopName);
                          }}
                          data-id={training?.id}
                          data-name={training?.workshopName}
                          paddingRight="10px"
                          fontSize="20px"
                          icon={<IoTrash />}
                        />
                      </Tooltip>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
        {trainings.length === 0 && clients.length === 0 && (
          <Text marginTop={5}>{"No workshops found, click the \"New Workshop\" button to add a workshop or ask a facilitator to add you to a workshop."}</Text>
        )}
      </Box>
      <ActionModal
        isOpen={isDeleteWorkshopOpen}
        loading={deleteWorkshopLoading}
        onClick={() => deleteWorkshop(selectedWorkshopId)}
        onClose={() => setIsDeleteWorkshopOpen(false)}
        text={`Are you sure you want to delete workshop '${selectedWorkshopName}' ?`}
      />
      <AddNewWorkshopModal isOpen={newWorkshopOpen} onClose={closeNewWorkshopModal} onRefresh={refreshDocs} />
      <EditWorkshopModal workshop={selectedWorkshop} isOpen={editWorkshopOpen} onClose={closeEditWorkshopModal} onRefresh={refreshDocs} />
    </>
  );
};

export default Workshops;

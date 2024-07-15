import {
  Box,
  Button,
  Icon,
  IconButton,
  Img,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Tooltip
} from '@chakra-ui/react';
import noImage from 'assets/images/avatar-1.jpg';
import { collection, deleteDoc, doc, getDocs, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { IoAdd, IoPencil, IoTrash } from 'react-icons/io5';
import AddFacilitatorModal from '../modals/AddFacilitatorModal';
import EditFacilitatorModal from '../modals/EditFacilitatorModal';
import ActionModal from '../modals/ActionModal';
import LoadingSpinner from 'components/core/LoadingSpinner';

const Facilitators = () => {
  const db = getFirestore();
  const toast = useToast();
  const [newFacilitatorOpen, setNewFacilitatorOpen] = useState(false);
  const [editFacilitatorOpen, setEditFacilitatorOpen] = useState(false);
  const [selectedFacilitator, setSelectedFacilitator] = useState();
  const [facilitators, setFacilitators] = useState([]);
  const [mainLoading, setMainLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [isDeleteFacilitatorOpen, setIsDeleteFacilitatorOpen] = useState(false);
  const [deleteFacilitatorLoading, setDeleteFacilitatorLoading] = useState(false);
  const [selectedFacilitatorId, setSelectedFacilitatorId] = useState();
  const [selectedFacilitatorName, setSelectedFacilitatorName] = useState();

  async function fetchDocs() {
    setMainLoading(true);
    const querySnapshot = await getDocs(collection(db, 'Facilitators'));
    const staticFacilitators = [];
    const staticAdmins = [];
    const allDocsData = querySnapshot.docs?.map(doc => ({ id: doc.id, ...doc.data() }));
    allDocsData.forEach(doc => {
      if (doc?.facilitatorType === 'admin') {
        staticAdmins.push(doc);
      } else {
        staticFacilitators.push(doc);
      }
    });
    setAdmins(staticAdmins);
    setFacilitators(staticFacilitators);
    setMainLoading(false);
  }

  useEffect(() => {
    fetchDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openFacilitatorModal = () => {
    setNewFacilitatorOpen(true);
  };

  const closeFacilitatorModal = () => {
    setNewFacilitatorOpen(false);
  };

  const refreshDocs = async () => {
    fetchDocs();
  };
  const handleDelete = async (id, name) => {
    setSelectedFacilitatorId(id);
    setSelectedFacilitatorName(name);
    setIsDeleteFacilitatorOpen(true);
  };

  const deleteFacilitator = async id => {
    setDeleteFacilitatorLoading(true);
    try {
      await deleteDoc(doc(db, 'Facilitators', id));
      setIsDeleteFacilitatorOpen(false);
      toast({
        title: 'Success!',
        description: 'Facilitator Deleted',
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
    setDeleteFacilitatorLoading(false);
  };
  const openEditFacilitorModal = facilitator => {
    setSelectedFacilitator(facilitator);
    setEditFacilitatorOpen(true);
  };

  const closeEditFacilitatorModal = () => {
    setEditFacilitatorOpen(false);
  };

  if (mainLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={12}>
        <LoadingSpinner />
      </Box>
    );
  }
  return (
    <>
      <Box m={12}>
        <Box alignItems="baseline" display="flex" justifyContent="space-between">
          <Text color="gray.700" fontSize="20px" fontWeight="400">
            Facilitators
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
            padding="8px 20px"
            onClick={openFacilitatorModal}
          >
            <Icon aria-label="edit" as={IoAdd} color="white" />
            <Text>New Facilitator</Text>
          </Button>
        </Box>
        {admins && (
          <TableContainer borderBottomLeftRadius="16px" borderBottomRightRadius="16px" paddingTop="25px">
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="start" paddingLeft="30px">
                    {' '}
                    ADMINS
                  </Th>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="center">
                    EMAIL
                  </Th>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="end" paddingRight="30px">
                    ACTIONS
                  </Th>
                </Tr>
              </Thead>
              <Tbody background="white">
                {admins?.map(admin => (
                  <Tr key={admin?.id}>
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
                      width="40%"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      <Img alt="client image" borderRadius="12px" height="54px" objectFit="cover" src={noImage} width="54px" />
                      {admin?.facilitatorName}
                    </Td>

                    <Td color="gray.700" cursor="pointer" fontSize="16px" fontWeight="400" textAlign="center" width="40%">
                      {admin?.facilitatorEmail}
                    </Td>
                    <Td textAlign="end" whiteSpace="nowrap" width="1%" paddingRight="30px">
                      <Tooltip label="Edit" placement="top">
                        <IconButton
                          aria-label="edit"
                          color="gray.500"
                          colorScheme="transperent"
                          data-id={admin?.id}
                          size="lg"
                          fontSize="20px"
                          paddingRight="15px"
                          icon={<IoPencil />}
                          onClick={() => {
                            openEditFacilitorModal(admin);
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Delete" placement="top">
                        <IconButton
                          aria-label="delete"
                          color="gray.500"
                          colorScheme="transperent"
                          data-id={admin?.id}
                          data-name={admin?.facilitatorName}
                          size="lg"
                          fontSize="20px"
                          paddingRight="10px"
                          icon={<IoTrash />}
                          onClick={() => {
                            handleDelete(admin.id, admin.facilitatorName);
                          }}
                        />
                      </Tooltip>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
        {facilitators && (
          <TableContainer borderBottomLeftRadius="16px" borderBottomRightRadius="16px" paddingTop="25px" marginTop="20px">
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="start" paddingLeft="30px">
                    {' '}
                    FACILITATORS
                  </Th>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="center">
                    EMAIL
                  </Th>
                  <Th color="gray.700" fontSize="14px" fontWeight="700" paddingBottom="25px" textAlign="end" paddingRight="30px">
                    ACTIONS
                  </Th>
                </Tr>
              </Thead>
              <Tbody background="white">
                {facilitators?.map(facilitator => (
                  <Tr key={facilitator?.id}>
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
                      width="40%"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      <Img
                        alt="client image"
                        borderRadius="12px"
                        height="54px"
                        objectFit="cover"
                        src={facilitator?.facilitatorImage}
                        width="54px"
                      />
                      {facilitator?.facilitatorName}
                    </Td>

                    <Td color="gray.700" cursor="pointer" fontSize="16px" fontWeight="400" textAlign="center" width="40%">
                      {facilitator?.facilitatorEmail}
                    </Td>
                    <Td textAlign="end" whiteSpace="nowrap" width="1%" paddingRight="30px">
                      <Tooltip label="Edit" placement="top">
                        <IconButton
                          aria-label="edit"
                          color="gray.500"
                          colorScheme="transperent"
                          data-id={facilitator?.id}
                          icon={<IoPencil />}
                          fontSize="20px"
                          paddingRight="15px"
                          onClick={() => {
                            openEditFacilitorModal(facilitator);
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Delete" placement="top">
                        <IconButton
                          aria-label="delete"
                          color="gray.500"
                          colorScheme="transperent"
                          data-id={facilitator?.id}
                          data-name={facilitator?.facilitatorName}
                          paddingRight="10px"
                          fontSize="20px"
                          icon={<IoTrash />}
                          onClick={() => {
                            handleDelete(facilitator?.id, facilitator?.facilitatorName);
                          }}
                        />
                      </Tooltip>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
      <ActionModal
        isOpen={isDeleteFacilitatorOpen}
        loading={deleteFacilitatorLoading}
        onClick={() => deleteFacilitator(selectedFacilitatorId)}
        onClose={() => setIsDeleteFacilitatorOpen(false)}
        text={`Are you sure you want to delete facilitator '${selectedFacilitatorName}' ?`}
      />
      <AddFacilitatorModal isOpen={newFacilitatorOpen} onClose={closeFacilitatorModal} onRefresh={refreshDocs} />
      <EditFacilitatorModal
        facilitator={selectedFacilitator}
        isOpen={editFacilitatorOpen}
        onClose={closeEditFacilitatorModal}
        onRefresh={refreshDocs}
      />
    </>
  );
};

export default Facilitators;

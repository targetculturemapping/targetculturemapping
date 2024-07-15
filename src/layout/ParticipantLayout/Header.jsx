import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Img, useMediaQuery } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import noImage from 'assets/images/noImage.png';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
// eslint-disable-next-line react/prop-types
const Header = () => {
  const db = getFirestore();
  const { workshopCode } = useParams();
  const isMobile = useMediaQuery(['(max-width: 800px)'])[0];
  const [workshopData, setWorkshopData] = useState();

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshopCode]);

  return (
    <Flex
      alignItems="center"
      bg="white"
      borderBottom="1px solid rgba(0, 0, 0, 0.08)"
      height="70px"
      justifyContent="space-between"
      px={isMobile ? '10px' : '40px'}
      py={isMobile ? '12px' : 0}
      w="100%"
    >
      <Box flex={1}>
        {workshopData?.workshopImage ? (
          <Img alt="client image" borderRadius="12px" height="45px" objectFit="cover" src={workshopData?.workshopImage} width="45px" />
        ) : (
          <Img alt="no image" borderRadius="12px" height="45px" my={12} objectFit="cover" src={noImage} width="45px" />
        )}
      </Box>
      <Text
        flex={1}
        fontSize={isMobile ? '12px' : '20px'}
        textAlign="center"
        textColor="gray.500"
        position="absolute"
        left="50%"
        transform="translateX(-50%)"
      >
        {workshopData?.workshopName}
      </Text>{' '}
      <Text flex={1} fontSize={isMobile ? '12px' : '16px'} textAlign="center" textColor="gray.500" left="90%" position="absolute">
        Workshop code: {workshopCode}
      </Text>
    </Flex>
  );
};

export default Header;

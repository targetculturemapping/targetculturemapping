import React, { useState, useEffect } from 'react';
import { Box, Icon, Text, Flex, Link } from '@chakra-ui/react';
import { IoArrowBack } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import Result from './Result';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import calculateScores from 'components/core/calculateScores';

export default function MonitorSubmissions() {
  const { workshopCode } = useParams();
  const db = getFirestore();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'Workshops', workshopCode, 'Submissions'),
      querySnapshot => {
        const docs = [];
        querySnapshot.forEach(doc => {
          docs.push(doc.data());
        });
        setDocuments(docs);
      },
      error => {
        console.error('Error fetching documents:', error);
      }
    );

    return () => unsubscribe();
  }, [db, workshopCode]);

  const replaceHyphensWithSpaces = str => str.replace(/-/g, ' ');

  return (
    <Box flex={1} marginBottom="50px" mt="80px" px="10%">
      <Box backgroundColor="white" borderTopRadius="2xl" overflowX="hidden" padding="50px" paddingBottom="500px">
        <Flex flex={1} flexDirection="column">
          <Box alignItems="center" display="flex" justifyContent="flex-start">
            <Link color="#0072ce" fontWeight={400} href={`/Workshop/${workshopCode}/exercises`}>
              <Box alignItems="center" display="flex" justifyContent="flex-start">
                {' '}
                <Icon as={IoArrowBack} color="blue.500" mr={3} />
                <Text color="blue.500" ml={-2.5}>
                  Back to all exercises
                </Text>
              </Box>
            </Link>
          </Box>
          <Box display="flex" justifyContent="flex-end" mr="25" mt="-35px">
            <Text mr={2}>Workshop Code:</Text>
            <Text fontWeight="700">{workshopCode}</Text>
          </Box>
        </Flex>
        <Text color="#bc204b" fontSize="34px" fontWeight="600" mb={6} mt="25px">
          Monitor Submissions
        </Text>
        {documents.length > 0 ? (
          documents?.map((doc, index) => (
            <React.Fragment key={index}>
              <Box backgroundColor="#0072ce" padding="15px" mt="25px" width="100%">
                <Text fontSize="16px" fontWeight="600" color="#FFFFFF">
                  {`${replaceHyphensWithSpaces(doc.participantName)}\u00A0\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0\u00A0${
                    doc.exerciseName
                  }\u00A0\u00A0\u00A0\u00A0-\u00A0\u00A0\u00A0\u00A0 Round ${doc.round}`}
                </Text>
              </Box>

              {doc.optionValues ? (
                <Result data={calculateScores(doc)} />
              ) : (
                <Text color="red">Option values are missing for this participant.</Text>
              )}
            </React.Fragment>
          ))
        ) : (
          <Text>No submissions available</Text>
        )}
      </Box>
    </Box>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Box, Icon, Text, Flex, Link, useToast, MenuButton, Menu, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { IoArrowBack, IoSend } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import Result from './Result';
import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import LoadingSpinner from 'components/core/LoadingSpinner';
import calculateScores from '../components/core/calculateScores';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
export default function FinalResults() {
  const { workshopCode } = useParams();
  const db = getFirestore();
  const toast = useToast();
  const [documents, setDocuments] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [targetChartData, setTargetChartData] = useState();
  const [businessChartData, setBusinessChartData] = useState();
  const [mainLoading, setMainLoading] = useState(false);
  const [businessEnabled, setBusinessEnabled] = useState();
  const [downloadLoading, setDownloadLoading] = useState(false);

  const fetchWorkshopData = async () => {
    setMainLoading(true);
    const workshopRef = doc(db, 'Workshops', workshopCode);
    const workshopDocSnap = await getDoc(workshopRef);
    if (workshopDocSnap.exists()) {
      setAllExercises(workshopDocSnap.data()?.exercises);
      setBusinessEnabled(workshopDocSnap.data()?.businessPrioritisationEnabled);
    }
    setMainLoading(false);
  };

  const calculateTargetCulture = docs => {
    if (!businessChartData || !docs.length) return;

    // Flatten the normalizedAggregated arrays
    const flattenedData = docs.flatMap(doc => doc?.normalizedAggregated || []);

    // Aggregate the data by summing the matching values
    const aggregatedData = flattenedData.reduce((acc, curr) => {
      const businessObj = businessChartData?.normalizedAggregated.find(b => b.name === curr.name);
      if (businessObj) {
        const existing = acc.find(item => item.name === curr.name);
        if (existing) {
          existing.value += curr.value * businessObj.value;
        } else {
          acc.push({
            name: curr.name,
            value: curr.value * businessObj.value
          });
        }
      } else {
        const existing = acc.find(item => item.name === curr.name);
        if (existing) {
          existing.value += curr.value;
        } else {
          acc.push({
            name: curr.name,
            value: curr.value
          });
        }
      }
      return acc;
    }, []);

    // Calculate the total sum of all values
    const totalSum = aggregatedData.reduce((sum, item) => sum + item.value, 0);

    // Normalize the values to be percentages of the total
    const normalizedData = aggregatedData.map(item => ({
      name: item.name,
      value: ((item.value / totalSum) * 100).toFixed(2)
    }));
    setTargetChartData(normalizedData);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Workshops', workshopCode, 'RoundResults'));
        const docs = [];
        let businessAggregated;
        docs.length = allExercises.length;

        querySnapshot.forEach(doc => {
          const data = doc.data();
          if (data.exerciseTitle === 'Business Imperative Prioritisation') {
            if (businessAggregated) {
              if (businessAggregated.round < data.currentRound) {
                businessAggregated = {
                  normalizedAggregated: data.normalizedAggregated,
                  round: data.currentRound
                };
              }
            } else {
              businessAggregated = {
                normalizedAggregated: data.normalizedAggregated,
                round: data.currentRound
              };
            }
          } else {
            if (docs[data.exerciseType]) {
              if (docs[data.exerciseType].round < data.currentRound) {
                docs[data.exerciseType] = {
                  normalizedAggregated: data.normalizedAggregated,
                  round: data.currentRound
                };
              }
            } else {
              docs[data.exerciseType] = {
                normalizedAggregated: data.normalizedAggregated,
                round: data.currentRound
              };
            }
          }
        });

        setDocuments(docs);
        setBusinessChartData(businessAggregated);
        calculateTargetCulture(docs);
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
    };

    fetchDocuments();
  }, [db, workshopCode]);

  useEffect(() => {
    fetchWorkshopData();
  }, [db, workshopCode]);

  const downloadData = async () => {
    setDownloadLoading(true);

    const docs = [];
    const querySnapshot = await getDocs(collection(db, 'Workshops', workshopCode, 'Submissions'));
    querySnapshot.forEach(doc => {
      docs.push(doc.data());
    });

    const filteredDocs = docs.filter(doc => doc.exerciseName !== 'Business Imperative Prioritisation');

    if (filteredDocs.length === 0) {
      setAggregatedScores([]);
      setDownloadLoading(false);
      return;
    }

    const allScores = filteredDocs.map(doc => {
      const scores = calculateScores(doc);
      const scoreObj = {};
      scores.forEach(score => {
        scoreObj[score.name] = score.value;
      });
      return {
        participantName: doc.participantName.replace(/-/g, ' '),
        round: doc.round,
        ...scoreObj
      };
    });

    const csv = Papa.unparse(allScores, {
      header: true,
      columns: ['Participant Name', 'Round', 'Achievement', 'People First', 'One-Team', 'Innovation', 'Customer-Centric', 'Greater-Good']
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Archetype_Data.csv');

    setDownloadLoading(false);
  };

  const downloadBusinessData = async () => {
    setDownloadLoading(true);

    const docs = [];
    const querySnapshot = await getDocs(collection(db, 'Workshops', workshopCode, 'Submissions'));
    querySnapshot.forEach(doc => {
      docs.push(doc.data());
    });

    const businessDocs = docs.filter(doc => doc.exerciseName === 'Business Imperative Prioritisation');

    if (businessDocs.length === 0) {
      setDownloadLoading(false);
      return;
    }

    // Extract all unique fields from businessDocs excluding 'exerciseName', 'participantName', and 'optionValues'
    const allFields = new Set(['Participant Name', 'Round', 'Archetypes']);
    const formattedData = businessDocs.map(doc => {
      const scores = calculateScores(doc);

      const data = {
        'Participant Name': doc.participantName.replace(/-/g, ' '),
        Round: doc.round,
        Archetypes: doc.archetypes
      };

      Object.keys(doc).forEach(key => {
        if (key !== 'exerciseName' && key !== 'participantName' && key !== 'optionValues' && key !== 'round' && key !== 'archetypes') {
          data[key] = doc[key] || '';
          allFields.add(key);
        }
      });

      scores.forEach(score => {
        data[score.name] = score.value;
        allFields.add(score.name);
      });

      return data;
    });

    const headers = Array.from(allFields);

    // Generate CSV
    const csv = Papa.unparse(formattedData, {
      header: true,
      columns: headers
    });

    // Save the CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Business_Data.csv');

    setDownloadLoading(false);
  };

  if (mainLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={12}>
        <LoadingSpinner />
      </Box>
    );
  }
  return (
    <Box flex={1} marginBottom="50px" mt="80px" px="10%">
      <Box backgroundColor="white" borderTopRadius="2xl" overflowX="hidden" padding="50px" paddingBottom="500px">
        <Flex flex={1} flexDirection="column">
          <Link color="#0072ce" fontWeight={400} href={`/Workshop/${workshopCode}/exercises`}>
            <Box alignItems="center" display="flex" justifyContent="flex-start">
              {' '}
              <Icon as={IoArrowBack} color="blue.500" mr={3} />
              <Text color="blue.500" ml={-2.5}>
                Back to all exercises
              </Text>
            </Box>
          </Link>

          <Box>
            <Box display="flex" justifyContent="flex-end" mr="25px" mt="-35px">
              <Text>Workshop Code:</Text>
              <Text fontWeight="700" ml="5px">
                {workshopCode}
              </Text>
            </Box>
            <Box display="flex" justifyContent="flex-end" mr="25px" mt="10px">
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
                  leftIcon={<IoSend />}
                >
                  Export
                </MenuButton>
                <MenuList zIndex="10">
                  {businessChartData && (
                    <MenuItem
                      minH="48px"
                      backgroundColor="#FFFFFF"
                      borderRadius="8px"
                      fontSize="16px"
                      px="10px"
                      borderWidth="1px"
                      onClick={downloadBusinessData}
                      loading={downloadLoading}
                    >
                      Business Imperative Prioritisation
                    </MenuItem>
                  )}
                  <MenuItem
                    minH="48px"
                    backgroundColor="#FFFFFF"
                    borderRadius="8px"
                    fontSize="16px"
                    px="10px"
                    borderWidth="1px"
                    onClick={downloadData}
                    loading={downloadLoading}
                  >
                    Archetype Prioritisations
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Box>
        </Flex>
        <Text color="#bc204b" fontSize="34px" fontWeight="600" mb={6}>
          Final Results
        </Text>
        <Box width="100%" backgroundColor="#0072ce" marginBottom="30px">
          <Text color="#FFF" padding="10px" fontWeight="600" fontSize="16px">
            {' '}
            Target Culture
          </Text>
        </Box>

        {targetChartData ? <Result data={targetChartData} /> : <Text mb={'25px'}>Missing required submissions</Text>}
        {allExercises.length > 1 && businessEnabled === 'Enabled' && (
          <>
            <Box width="100%" backgroundColor="#0072ce" marginBottom="30px">
              <Text color="#FFF" padding="10px" fontWeight="600" fontSize="16px">
                Business Imperative Prioritisation
              </Text>
            </Box>
            {businessChartData ? <Result data={businessChartData.normalizedAggregated} /> : <Text mb={'25px'}>No Submissions Present</Text>}
          </>
        )}
        {allExercises?.map((exercise, index) => (
          <>
            <Box width="100%" backgroundColor="#0072ce" marginBottom="30px">
              <Text color="#FFF" padding="10px" fontWeight="600" fontSize="16px">
                {' '}
                {exercise.name}
              </Text>
            </Box>
            {documents[index] ? <Result data={documents[index]?.normalizedAggregated} /> : <Text mb={'25px'}>No Submissions Present</Text>}
          </>
        ))}
      </Box>
    </Box>
  );
}

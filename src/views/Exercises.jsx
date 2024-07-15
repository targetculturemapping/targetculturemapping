/* eslint-disable eqeqeq */
import { useEffect, useState } from 'react';
import { Box, Text, Link, Divider, Flex, VStack, Checkbox, Icon } from '@chakra-ui/react';
import { doc, getDoc, getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { IoArrowBack, IoStarOutline } from 'react-icons/io5';
import LoadingSpinner from 'components/core/LoadingSpinner';

export default function Exercises() {
  const db = getFirestore();
  const { workshopCode } = useParams();
  const [workshopData, setWorkshopData] = useState();
  const [allExercises, setAllExercises] = useState([]);
  const [businessComplete, setBusinessComplete] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [mainLoading, setMainLoading] = useState(false);
  const [currentExercise, setCurrentExercise] = useState();
  const [roundStarted, setRoundStarted] = useState(false);

  const fetchData = async () => {
    setMainLoading(true);
    const workshopRef = doc(db, 'Workshops', workshopCode);
    const workshopDocSnap = await getDoc(workshopRef);
    if (workshopDocSnap.exists()) {
      setWorkshopData(workshopDocSnap.data());
      setAllExercises(workshopDocSnap.data()?.exercises);
      setBusinessComplete(workshopDocSnap.data()?.businessCompleted);
      setCurrentExercise(workshopDocSnap.data()?.currentExercise);
      setRoundStarted(workshopDocSnap.data()?.roundStarted);
    }
    setMainLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'Workshops', workshopCode, 'Participants'),
      querySnapshot => {
        setParticipantCount(querySnapshot.size);
      },
      error => {
        console.error('Error fetching participant count:', error);
      }
    );

    return () => unsubscribe();
  }, [db, workshopCode]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshopCode]);

  if (mainLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={12}>
        <LoadingSpinner />
      </Box>
    );
  }
  return (
    <Box flex={1} marginBottom="50px" mt="80px" px="10%">
      <Box backgroundColor="white" borderTopRadius="2xl" paddingBottom="500px" overflowX="hidden" padding="50px">
        <Flex flex={1} flexDirection="column" mb={3}>
          <Box alignItems="center" display="flex" justifyContent="flex-start">
            <Link color="#0072ce" fontWeight={400} href={`/Workshop/${workshopCode}`}>
              <Box alignItems="center" display="flex" justifyContent="flex-start">
                <Icon as={IoArrowBack} color="blue.500" mr={3} />
                <Text color="blue.500" ml={-2.5}>
                  Back to workshop details
                </Text>
              </Box>
            </Link>
          </Box>
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <Flex flexDirection="column" alignItems="center">
              <Flex flexDirection="row" alignItems="center">
                <Text mr={2}>Workshop Code:</Text>
                <Text fontWeight="700">{workshopCode}</Text>
              </Flex>
              <Box>Participants Joined: {participantCount}</Box>
            </Flex>
          </Box>
        </Flex>

        <Text color="#bc204b" fontSize="34px" fontWeight="600" mb={6}>
          Exercises
        </Text>
        <VStack align="start" divider={<Divider borderColor="gray.200" />} spacing={4}>
          <Flex align="center" w="100%">
            {businessComplete && allExercises?.length > 1 && <Checkbox mr={4} size="medium" isChecked={businessComplete} />}
            {workshopData?.businessPrioritisationEnabled === 'Enabled' && allExercises?.length > 1 && (
              <Link color="blue.500" fontSize="18px" fontWeight="600" href={`exercises/business-imperative-prioritisation`}>
                Business Imperative Prioritisation
              </Link>
            )}
            {workshopData?.businessPrioritisationEnabled === 'Enabled' &&
              currentExercise == -1 &&
              allExercises?.length > 1 &&
              roundStarted && (
                <>
                  <Icon as={IoStarOutline} color="blue.500" ml={3} />
                </>
              )}
          </Flex>
          <VStack align="start" divider={<Divider borderColor="gray.200" />} spacing={4}>
            {allExercises && allExercises.length > 0 ? (
              allExercises?.map((exercise, index) => {
                return (
                  <Flex key={index} align="center" w="100%">
                    {exercise.completed && <Checkbox colorScheme="blue" mr={4} size="medium" isChecked={exercise.completed} />}
                    <Link color="blue.500" fontSize="18px" fontWeight="600" href={`exercises/${index}`}>
                      {exercise.name}
                    </Link>
                    {roundStarted && currentExercise == index && (
                      <>
                        <Icon as={IoStarOutline} color="blue.500" ml={3} />
                      </>
                    )}
                  </Flex>
                );
              })
            ) : (
              <Text>No exercises found.</Text>
            )}
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}

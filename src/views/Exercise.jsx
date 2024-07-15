import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, getFirestore, updateDoc, collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { Box, Icon, Text, Divider, Flex, Button, useToast } from '@chakra-ui/react';
import { IoArrowBack, IoCloseCircleOutline } from 'react-icons/io5';
import { FaVoteYea } from 'react-icons/fa';
import calculateScores from 'components/core/calculateScores';
import Result from './Result';
import LoadingSpinner from 'components/core/LoadingSpinner';

export default function Exercise() {
  const navigate = useNavigate();
  const db = getFirestore();
  const { workshopCode, exercise } = useParams();
  const toast = useToast();
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [exerciseType, setExerciseType] = useState();
  const [allExercises, setAllExercises] = useState([]);
  const [isRoundStarted, setIsRoundStarted] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [currentRound, setCurrentRound] = useState();
  const [aggregatedScores, setAggregatedScores] = useState([]);
  const [mainLoading, setMainLoading] = useState(false);
  const [roundLoading, setRoundLoading] = useState(false);
  const [differentWorkshopActive, setDifferentWorkshopActive] = useState(false);

  const fetchData = async () => {
    setMainLoading(true);
    const workshopRef = doc(db, 'Workshops', workshopCode);
    const workshopDocSnap = await getDoc(workshopRef);
    if (workshopDocSnap.exists()) {
      if (exercise === 'business-imperative-prioritisation') {
        setExerciseTitle('Business Imperative Prioritisation');
        setExerciseType(-1);
        setCurrentRound(workshopDocSnap.data().businessRound);
      } else {
        setExerciseTitle(workshopDocSnap.data().exercises[exercise]?.name);
        setCurrentRound(workshopDocSnap.data().exercises[exercise]?.round);
        setExerciseType(exercise);
      }
      if (
        workshopDocSnap.data().currentExercise === exercise ||
        (workshopDocSnap.data().currentExercise === -1 && exercise === 'business-imperative-prioritisation')
      ) {
        setIsRoundStarted(workshopDocSnap.data()?.roundStarted);
      } else if (
        workshopDocSnap.data().currentExercise !== exercise ||
        (workshopDocSnap.data().currentExercise === -1 && exercise !== 'business-imperative-prioritisation')
      ) {
        if (workshopDocSnap.data()?.roundStarted) {
          setDifferentWorkshopActive(true);
        }
      }
      setAllExercises(workshopDocSnap.data().exercises);
    }
    setMainLoading(false);
  };

  const [documents, setDocuments] = useState([]);
  const [totalParticipantCompletedCounter, setTotalParticipantCompletedCounter] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'Workshops', workshopCode, 'Submissions'),
      querySnapshot => {
        const docs = querySnapshot.docs?.map(doc => doc.data());
        setDocuments(docs);
      },
      error => {
        console.error('Error fetching documents:', error);
      }
    );

    return () => unsubscribe();
  }, [db, workshopCode]);

  useEffect(() => {
    if (documents.length > 0) {
      fixCharts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents]);

  const fixCharts = () => {
    const participantCompletedCounter = documents.filter(doc => doc.exerciseName === exerciseTitle && doc.round === currentRound).length;

    setTotalParticipantCompletedCounter(participantCompletedCounter);
  };

  const roundStarted = async () => {
    setRoundLoading(true);
    const workshopRef = doc(db, 'Workshops', workshopCode);
    let currentExercise = {};
    const newRound = isRoundStarted ? currentRound + 1 : currentRound;
    setCurrentRound(newRound);
    if (exercise === 'business-imperative-prioritisation') {
      if (isRoundStarted) {
        currentExercise = {
          currentExercise: exerciseType,
          roundStarted: !isRoundStarted,
          businessRound: newRound,
          businessCompleted: true
        };
      } else {
        currentExercise = { currentExercise: exerciseType, roundStarted: !isRoundStarted, businessRound: newRound };
      }
    } else {
      const newExercises = allExercises;
      newExercises[exercise].round = newRound;
      currentExercise = { currentExercise: exerciseType, roundStarted: !isRoundStarted, exercises: newExercises };
      if (isRoundStarted) {
        newExercises[exercise].completed = true;
      }
    }

    try {
      await updateDoc(workshopRef, currentExercise, { merge: true });
      setIsRoundStarted(!isRoundStarted);
      toast({
        title: 'Success!',
        description: `Round ${isRoundStarted ? 'ended' : 'started'}`,
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
    }

    setRoundLoading(false);
    setTotalParticipantCompletedCounter(0);
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

  const calculateAllScores = async () => {
    const docs = [];
    const querySnapshot = await getDocs(collection(db, 'Workshops', workshopCode, 'Submissions'));
    querySnapshot.forEach(doc => {
      docs.push(doc.data());
    });
    const firstFilteredDocs = docs.filter(doc => doc.round === currentRound - 1);
    const filteredDocs = firstFilteredDocs.filter(doc => doc.exerciseName === exerciseTitle);

    if (filteredDocs.length === 0) {
      setAggregatedScores([]);
      return;
    }

    const allScores = filteredDocs?.map(doc => calculateScores(doc));

    // Initialize aggregated scores with zeros
    const initialScores = allScores[0]?.map(score => ({ name: score.name, value: 0 }));

    const aggregated = allScores.reduce((acc, scores) => {
      scores.forEach((score, index) => {
        acc[index].value += score.value;
      });
      return acc;
    }, initialScores);

    // Normalize the aggregated scores to sum to 100
    const totalValue = aggregated.reduce((acc, score) => acc + score.value, 0);
    const normalizedAggregated = aggregated?.map(score => ({
      name: score.name,
      value: Math.round((score.value / totalValue) * 100 * 100) / 100 // Round to two decimal places
    }));

    await addDoc(collection(db, 'Workshops', workshopCode, 'RoundResults'), {
      currentRound,
      exerciseTitle,
      normalizedAggregated,
      exerciseType
    });

    setAggregatedScores(normalizedAggregated);
  };

  useEffect(() => {
    fetchData();
    if (!isRoundStarted) {
      calculateAllScores();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshopCode, isRoundStarted]);

  const goBack = () => {
    navigate(-1);
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
      <Box backgroundColor="white" borderTopRadius="2xl" paddingBottom="500px" overflowX="hidden" padding="50px">
        <Flex flex={1} flexDirection="column">
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Button onClick={goBack}>
              <Icon as={IoArrowBack} color="#0072ce" mr={3} />
              <Text ml={-2.5} color="#0072ce">
                Back to all exercises
              </Text>
            </Button>
          </Box>
          <Box display="flex" justifyContent="flex-end" mr="25" mt="-35px">
            <Text mr={2}> Workshop Code: </Text>
            <Text fontWeight="700">{workshopCode}</Text>
          </Box>
          <Box align="end" mr="25">
            Participants Joined: {participantCount}
          </Box>
        </Flex>
        <Text color="#bc204b" fontSize="34px" fontWeight="600" mb={6} mt="25px">
          {exerciseTitle} - Round: {currentRound}
        </Text>
        <Divider mt="-32px" borderColor="gray.200" mb="20px" />
        {!isRoundStarted && (
          <Box paddingBottom="500px">
            {differentWorkshopActive ? (
              <Text marginTop="80px"> Cannot start exercise, different exercise active</Text>
            ) : (
              <Button color="#0072ce" mt={10} onClick={roundStarted}>
                <Text> Start a new round of voting</Text>
                <Icon h={8} w={8} as={FaVoteYea} ml="3" />
              </Button>
            )}
            {currentRound > 1 && (
              <>
                <Box mt="30px" align="center">
                  <Text color="#bc204b" fontSize="24px" fontWeight="600">
                    Round Results
                  </Text>
                </Box>
                {aggregatedScores.length > 0 && <Result data={aggregatedScores} />}
                {!aggregatedScores.length > 0 && (
                  <Text textAlign="center" fontSize="2xl" fontWeight="bold" mt={6} mb={2}>
                    No submissions in previous round
                  </Text>
                )}
              </>
            )}
          </Box>
        )}
        {isRoundStarted && (
          <Box bg="#0072ce" borderRadius="md" mt="50px" p={60} textAlign="center">
            <Text color="#FFFFFF" fontSize="2xl" fontWeight="bold" mb={2}>
              Voting is underway
            </Text>
            <Text color="#FFFFFF" fontSize="xl" fontWeight="bold" mb={4}>
              {`${totalParticipantCompletedCounter} / ${participantCount} Completed`}
            </Text>
            <Button
              color="#FFFFFF"
              fontSize="16px"
              borderRadius="10px"
              padding="10px"
              radius="90"
              bg="red"
              height="40px"
              leftIcon={<IoCloseCircleOutline />}
              onClick={roundStarted}
              isLoading={roundLoading}
            >
              <Box>
                <Text color="white">Close this round of voting</Text>
              </Box>
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

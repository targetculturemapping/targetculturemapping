import React, { useState, useEffect } from 'react';

import { ArrowBackIcon, ArrowDownIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Text, Divider, Flex, Button, useToast, useMediaQuery } from '@chakra-ui/react';
import { getFirestore, collection, doc, onSnapshot, addDoc, getDocs } from 'firebase/firestore';
import Result from './Result';
import { useParams } from 'react-router-dom';
import calculateScores from 'components/core/calculateScores';
import LoadingSpinner from 'components/core/LoadingSpinner';
import ParticipantLayout from '../layout/ParticipantLayout/index';
import OptionRow from '../components/core/OptionRow';
import TrainingOptionRow from '../components/core/TrainingOptionRow';

const RoundedBar = props => {
  // eslint-disable-next-line react/prop-types
  const { fill, x, y, width, height, radius = 90 } = props;

  const path = `
    M ${x} ${y + radius}
    Q ${x} ${y} ${x + radius} ${y}
    L ${x + width - radius} ${y}
    Q ${x + width} ${y} ${x + width} ${y + radius}
    L ${x + width} ${y + height}
    L ${x} ${y + height}
    Z
  `;

  return <path d={path} fill={fill} />;
};
export default function ParticipantView() {
  const toast = useToast();
  const db = getFirestore();
  const { workshopCode, participantName } = useParams();
  const isMobile = useMediaQuery(['(max-width: 1200px)'])[0];

  const [currentPage, setCurrentPage] = useState('training');
  const [fullName, setFullName] = useState('');
  const [businessExercises, setBusinessExercises] = useState([[]]);
  const [documentData, setDocumentData] = useState();
  const [currentExerciseName, setCurrentExerciseName] = useState();
  const [currentRound, setCurrentRound] = useState();
  const [roundStarted, setRoundStarted] = useState(false);
  const [optionValues, setOptionValues] = useState([]);
  const [roundResults, setRoundResults] = useState({});
  const [mainLoading, setMainLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [optionValueUpdateNeeded, setOptionValueUpdateNeeded] = useState(false);
  const handleOptionChange = (key, value) => {
    setOptionValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStartVoting = () => {
    setCurrentPage('waiting');
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    const submitter = participantName;
    if (currentPage === 'voting') {
      if (Object.keys(optionValues)?.length === 15) {
        setRoundResults({
          exerciseName: currentExerciseName,
          round: currentRound,
          participantName: submitter,
          optionValues
        });
        await addDoc(collection(db, 'Workshops', workshopCode, 'Submissions'), {
          exerciseName: currentExerciseName,
          round: currentRound,
          participantName: submitter,
          optionValues
        });
        await addDoc(collection(db, 'Workshops', workshopCode, 'Participants', `${submitter}`, 'Submissions'), {
          exerciseName: currentExerciseName,
          round: currentRound,
          participantName: submitter,
          optionValues
        });
        setCurrentPage('submitted');
      } else {
        toast({
          title: 'Error',
          description: 'Must answer all questions before submitting',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } else {
      if (Object.keys(optionValues)?.length === businessExercises?.length) {
        const flattenedBusinessExercises = businessExercises?.map(pair => pair.join('-'));
        setRoundResults({
          exerciseName: 'Business Imperative Prioritisation',
          round: currentRound,
          participantName: submitter,
          optionValues,
          archetypes: flattenedBusinessExercises
        });
        await addDoc(collection(db, 'Workshops', workshopCode, 'Submissions'), {
          exerciseName: 'Business Imperative Prioritisation',
          round: currentRound,
          participantName: submitter,
          optionValues,
          archetypes: flattenedBusinessExercises
        });
        setCurrentPage('submitted');
      } else {
        toast({
          title: 'Error',
          description: 'Must answer all questions before submitting',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    }
    setSubmitLoading(false);
  };
  function generateUniquePairs(array) {
    let pairs = [];
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        pairs.push([array[i], array[j]]);
      }
    }
    setBusinessExercises(pairs);
  }

  const fixOptionValues = async bus => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Workshops', workshopCode, 'Participants', `${participantName}`, 'Submissions'));
      const allDocsData = querySnapshot.docs?.map(doc => ({ id: doc.id, ...doc.data() }));

      const updateValues = (doc, isBusiness) => {
        const round = isBusiness
          ? Number(documentData?.businessRound)
          : Number(documentData?.exercises[documentData?.currentExercise].round);

        if (isBusiness) {
          if (round-1 === doc.round) {
            setOptionValues(doc.optionValues);
            setOptionValueUpdateNeeded(!optionValueUpdateNeeded);
          } else if (round === doc.round) {
            setRoundResults(doc);
            setCurrentPage('submitted');
          }
        } else {
          if (doc.exerciseName === documentData?.exercises[documentData?.currentExercise].name) {
            if (round-1 === doc.round) {
              setOptionValues(doc.optionValues);
              setOptionValueUpdateNeeded(!optionValueUpdateNeeded);
            } else if (round === doc.round) {
              setRoundResults(doc);
              setCurrentPage('submitted');
            }
          }
        }
      };

      allDocsData.forEach(doc => updateValues(doc, bus));
    } catch (error) {
      console.error(error);
    }
  };

  const fixStatus = () => {
    if (documentData?.roundStarted !== roundStarted) {
      if (documentData?.roundStarted) {
        setRoundStarted(true);
        if (documentData?.currentExercise >= 0) {
          setOptionValues([]);
          fixOptionValues(false);
          setCurrentExerciseName(documentData?.exercises[documentData?.currentExercise].name);
          setCurrentPage('voting');
          setCurrentRound(documentData?.exercises[documentData?.currentExercise].round);
        } else {
          const rawExercises = documentData?.exercises?.map(exercise => {
            return exercise?.name;
          });
          generateUniquePairs(rawExercises);
          setOptionValues([]);
          fixOptionValues(true);
          setCurrentPage('business');
          setCurrentRound(documentData?.businessRound);
        }
      } else {
        setRoundStarted(false);
        setCurrentPage('waiting');
      }
    }
    if (documentData?.currentExercise === -2) {
      setCurrentPage('training');
    }
  };

  useEffect(() => {
    let unsubscribe;
    const fetchData = () => {
      setMainLoading(true);
      unsubscribe = onSnapshot(doc(collection(db, 'Workshops'), workshopCode), doc => {
        if (doc.exists()) {
          setDocumentData(doc.data());
          fixStatus();
          setMainLoading(false);
        } else {
          toast({
            title: 'Error',
            description: 'Please refresh the page',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        }
      });
    };

    fetchData();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (unsubscribe) unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshopCode, db]);

  useEffect(() => {
    fixStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentData, roundStarted]);

  useEffect(() => {
    setFullName(participantName.replace(/-/g, ' '));
  }, [participantName]);

  if (mainLoading) {
    return (
      <ParticipantLayout>
        <Box display="flex" justifyContent="center">
          <LoadingSpinner />
        </Box>
      </ParticipantLayout>
    );
  }
  return (
    <>
      <ParticipantLayout>
        {!isMobile && currentPage === 'training' && (
          <Box flex={1} marginBottom="20px" px="10%">
            <Box backgroundColor="white" borderTopRadius="2xl" overflowX="hidden" padding="50px" paddingBottom="500px">
              <Box maxW="2000px" mx="auto" p={8}>
                <Text color="#bc204b" fontSize="34px" fontWeight="600" mb={6} mt="25px">
                  You successfully signed in to this workshop
                </Text>
                <Text fontSize="24px" fontWeight="700">
                  Voting on Alternatives
                </Text>
                <Text mb={4}>
                  Youll indicate your preference for two alternatives using rows of buttons. Select buttons further to the left and right to
                  indicate increasing preference for an alternative.
                </Text>
                <Divider />
                <Box mb="20px" mt="25px" display="flex" flexDirection="row" w="100%">
                  <Flex ml="150px" flex={1} flexDirection="row" justifyContent="flex-start">
                    <ArrowBackIcon fontSize="22px" /> <Text>Preference for the first alternative</Text>
                  </Flex>
                  <Flex mr="150px" flex={1} flexDirection="row" justifyContent="flex-end">
                    <Text>Preference for the second alternative</Text> <ArrowForwardIcon fontSize="22px" />
                  </Flex>
                </Box>
                <Flex flex={1} flexDirection="column" alignItems="center" spacing={4}>
                  <TrainingOptionRow />
                  <ArrowDownIcon fontSize="22px" />
                  <Text>Equal preference for the alternatives</Text>
                </Flex>
                <Text mt="40px">Please wait for the facilitator to provide further instructions before you start voting.</Text>
                <Button
                  backgroundColor="#0072ce"
                  borderRadius="8px"
                  color="white"
                  display="flex"
                  fontSize="18px"
                  fontWeight="600"
                  gap="11px"
                  justifyContent="center"
                  mt={6}
                  padding="5px 30px"
                  onClick={handleStartVoting}
                >
                  <Text>Start voting {'     '}</Text> <ArrowForwardIcon ml="10px" fontSize="22px" />
                </Button>
              </Box>
            </Box>
          </Box>
        )}
        {isMobile && currentPage === 'training' && (
          <Box flex={1} marginBottom="20px" px="5%">
            <Box backgroundColor="white" borderTopRadius="2xl" overflowX="hidden" padding="30px" paddingBottom="300px">
              <Box maxW="1000px" mx="auto" p={4}>
                <Text color="#bc204b" fontSize="28px" fontWeight="600" mb={4} mt="20px">
                  You successfully signed in to this workshop
                </Text>
                <Text fontSize="20px" fontWeight="700">
                  Voting on Alternatives
                </Text>
                <Text mb={3}>
                  {
                    "You'll indicate your preference for two alternatives using rows of buttons. Select buttons further to the left and right to indicate increasing preference for an alternative."
                  }
                </Text>
                <Divider />
                <Box mb="15px" mt="20px" display="flex" flexDirection="column" w="100%">
                  <Flex mb="10px" flex={1} flexDirection="row" justifyContent="space-between">
                    <ArrowBackIcon fontSize="20px" /> <Text>Preference for the first alternative</Text>
                    <Text>Preference for the second alternative</Text> <ArrowForwardIcon fontSize="20px" />
                  </Flex>
                </Box>
                <Flex flex={1} flexDirection="column" alignItems="center" spacing={3}>
                  <TrainingOptionRow />
                  <ArrowDownIcon fontSize="20px" />
                  <Text>Equal preference for the alternatives</Text>
                </Flex>
                <Text mt="30px">Please wait for the facilitator to provide further instructions before you start voting.</Text>
                <Button
                  backgroundColor="#0072ce"
                  borderRadius="8px"
                  color="white"
                  display="flex"
                  fontSize="18px"
                  fontWeight="600"
                  gap="11px"
                  justifyContent="center"
                  mt={6}
                  padding="5px 30px"
                  onClick={handleStartVoting}
                >
                  <Text>Start voting {'     '}</Text> <ArrowForwardIcon ml="8px" fontSize="20px" />
                </Button>
              </Box>
            </Box>
          </Box>
        )}
        {currentPage === 'voting' && (
          <Box flex={1} marginBottom="20px" px="10%">
            <Box backgroundColor="white" borderTopRadius="2xl" overflowX="hidden" padding="10px">
              <Box maxW="2000px" mx="auto" p={8}>
                <Text color="#bc204b" fontSize="34px" fontWeight="600" mb={6} mt="25px">
                  Compare the importance of the Archetypes for {currentExerciseName} - Round: {currentRound}
                </Text>
                <Text mb={4}>
                  Your answers from the last voting round are selected below. Make any changes you wish and submit when you are finished.
                </Text>
                <OptionRow
                  leftLabel="Achievement"
                  leftDescription="People focus on outcomes, follow defined processes, and keep their word."
                  rightDescription="People are valued, encouraged, and supported."
                  rightLabel="People-First"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={0}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="Achievement"
                  leftDescription="People focus on outcomes, follow defined processes, and keep their word."
                  rightDescription="People place the good of the whole above that of the individual."
                  rightLabel="One-Team"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={1}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="Achievement"
                  leftDescription="People focus on outcomes, follow defined processes, and keep their word."
                  rightDescription="People strive to invent, to improve, to operate at the highest standrds."
                  rightLabel="Innovation"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={2}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="Achievement"
                  leftDescription="People focus on outcomes, follow defined processes, and keep their word."
                  rightDescription="People put the customer at the centre of everything they do."
                  rightLabel="Customer-Centric"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={3}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="Achievement"
                  leftDescription="People focus on outcomes, follow defined processes, and keep their word."
                  rightDescription="People place the good of the whole above that of the individual."
                  rightLabel="Greater-Good"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={4}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="People-First"
                  leftDescription="People focus on outcomes, follow defined processes, and keep their word."
                  rightDescription="People strive to invent, to improve, to operate at the highest standards."
                  rightLabel="One-Team"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={5}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="People-First"
                  leftDescription="People focus on outcomes, follow defined processes, and keep their word."
                  rightDescription="People put the customer at the centre of everything they do."
                  rightLabel="Innovation"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={6}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="People-First"
                  leftDescription="People focus on outcomes, follow defined processes, and keep their word."
                  rightDescription="People take responsibility for the contribution to society beyond the immediate stakeholders."
                  rightLabel="Customer-Centric"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={7}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="People-First"
                  leftDescription="People are valued, encouraged, and supported."
                  rightDescription="People place the good of the whole above that of the individual."
                  rightLabel="Greater-Good"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={8}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="One-Team"
                  leftDescription="People are valued, encouraged, and supported."
                  rightDescription="People strive to invent, to improve, to operate at the highest standards."
                  rightLabel="Innovation"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={9}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="One-Team"
                  leftDescription="People are valued, encouraged, and supported."
                  rightDescription="People put the customer at the centre of everything they do."
                  rightLabel="Customer-Centric"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={10}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="One-Team"
                  leftDescription="People are valued, encouraged, and supported."
                  rightDescription="People take responsibility for the contribution to society beyond the immediate stakeholders."
                  rightLabel="Greater-Good"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={11}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="Innovation"
                  leftDescription="People place the good of the whole above that of the individual."
                  rightDescription="People strive to invent, to improve, to operate at the highest standards."
                  rightLabel="Customer-Centric"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={12}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="Innovation"
                  leftDescription="People place the good of the whole above that of the individual."
                  rightDescription="People put the customer at the centre of everything they do."
                  rightLabel="Greater-Good"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={13}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <OptionRow
                  leftLabel="Customer-Centric"
                  leftDescription="People place the good of the whole above that of the individual."
                  rightDescription="People take responsibility for the contribution to society beyond the immediate stakeholders."
                  rightLabel="Greater-Good"
                  onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                  keys={14}
                  values={optionValues}
                  updateNeeded={optionValueUpdateNeeded}
                />
                <Button
                  backgroundColor="#0072ce"
                  borderRadius="8px"
                  color="white"
                  display="flex"
                  fontSize="18px"
                  fontWeight="600"
                  gap="11px"
                  justifyContent="center"
                  onClick={handleSubmit}
                  padding="5px 30px"
                  loading={submitLoading}
                  mt={6}
                >
                  Submit
                </Button>
              </Box>
              <RoundedBar />
            </Box>
          </Box>
        )}
        {currentPage === 'submitted' && (
          <Box flex={1} marginBottom="20px" mt="10px" px="10%">
            <Box backgroundColor="white" borderTopRadius="2xl" overflowX="hidden" padding="10px">
              <Box maxW="600px" mx="auto" textAlign="center" border="1px solid" borderColor="gray.200" borderRadius="md" p="4" mt="8">
                <Text color="#bc204b" fontSize="34px" fontWeight="600" mb={6} mt="25px">
                  Thank you for submitting your response!
                </Text>
                <Text mb="4">We appreciate your input.</Text>
                <Text>Please wait for the host to continue to the next exercise.</Text>
              </Box>
            </Box>
            <Box width="100%" backgroundColor="white">
              <Result data={roundResults ? calculateScores(roundResults) : {}} />
            </Box>
          </Box>
        )}
        {currentPage === 'waiting' && (
          <Box flex={1} marginBottom="20px" mt="10px" px="10%">
            <Box backgroundColor="white" borderTopRadius="2xl" overflowX="hidden" padding="10px">
              <Box maxW="600px" mx="auto" textAlign="center" border="1px solid" borderColor="gray.200" borderRadius="md" p="4" mt="8">
                <Text color="#bc204b" fontSize="34px" fontWeight="600" mb={6} mt="25px">
                  Thank you for joining {fullName}!
                </Text>
                <Text mb="4">We appreciate your input.</Text>
                <Text>Please wait for the host to continue to the next exercise.</Text>
              </Box>
            </Box>
          </Box>
        )}
        {currentPage === 'business' && (
          <Box flex={1} marginBottom="20px" mt="10px" px="10%">
            <Box backgroundColor="white" borderTopRadius="2xl" overflowX="hidden" padding="10px">
              <Box maxW="2000px" mx="auto" p={8}>
                <Text color="#bc204b" fontSize="34px" fontWeight="600" mb={6} mt="25px">
                  Compare the importance of the Archetypes for Business Imperative Prioritisation - Round: {currentRound}
                </Text>
                <Text mb={4}>
                  Your answers from the last voting round are selected below. Make any changes you wish and submit when you are finished.
                </Text>
                {businessExercises?.map((innerExercises, index) => (
                  <OptionRow
                    key={index}
                    leftLabel={innerExercises[0]}
                    leftDescription=""
                    rightDescription=""
                    rightLabel={innerExercises[1]}
                    keys={index}
                    onChange={(key, value) => handleOptionChange(key, value, setOptionValues)}
                    values={optionValues}
                    updateNeeded={optionValueUpdateNeeded}
                  />
                ))}
                <Button
                  backgroundColor="#0072ce"
                  borderRadius="8px"
                  color="white"
                  display="flex"
                  fontSize="18px"
                  fontWeight="600"
                  gap="11px"
                  justifyContent="center"
                  onClick={handleSubmit}
                  padding="5px 30px"
                  mt={6}
                  loading={submitLoading}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </ParticipantLayout>
    </>
  );
}

import { useEffect, useState } from 'react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Button, Icon, Input, Text } from '@chakra-ui/react';
import { IoAddOutline, IoTrashSharp } from 'react-icons/io5';

// eslint-disable-next-line react/prop-types
const ExerciseComponent = ({ exercises, isEditing, handleUpdateExercises }) => {
  const [newExercises, setNewExercises] = useState(exercises);

  const addExercise = () => {
    const updatedExercises = [
      ...newExercises,
      {
        round: 1,
        completed: false,
        name: '',
        id: newExercises.length
      }
    ];
    setNewExercises(updatedExercises);
    // Update the parent component
    handleUpdateExercises(updatedExercises);
  };

  const handleExerciseChange = (event, index) => {
    const { value } = event.target;
    const updatedExercises = newExercises.map((exercise, idx) => (idx === index ? { ...exercise, name: value } : exercise));
    setNewExercises(updatedExercises);
    // Update the parent component
    handleUpdateExercises(updatedExercises);
  };

  const handleDeleteExercise = index => {
    const updatedExercises = newExercises.filter((_, idx) => idx !== index);
    setNewExercises(updatedExercises);
    handleUpdateExercises(updatedExercises);
  };

  useEffect(() => {
    setNewExercises(exercises);
  }, [exercises]);

  if (isEditing) {
    if (!newExercises || newExercises.length === 0) {
      return (
        <Box display="flex" flex={1} flexDirection="column">
          <Box display="flex" flexDirection="column" marginLeft="25px">
            <Box alignItems="center" display="flex" flexDirection="row">
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
                onClick={addExercise}
              >
                <Icon aria-label="edit" as={IoAddOutline} color="white" />
                <Text>Add business imperative</Text>
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }

    return (
      <Box display="flex" flex={1} flexDirection="column">
        {newExercises.map((exercise, index) => (
          <Box key={exercise.id} display="flex" flexDirection="column" marginLeft="25px">
            <Box alignItems="center" display="flex" flexDirection="row">
              <Icon as={ChevronRightIcon} height="16px" marginLeft="15px" />
              <Input
                placeholder="Enter business imperative"
                width={350}
                color="gray.700"
                fontSize="16px"
                fontWeight="400"
                margin="5px"
                padding="10px"
                borderRadius="5px"
                borderWidth="2px"
                value={exercise.name}
                onChange={event => handleExerciseChange(event, index)}
              />
              <Icon
                as={IoTrashSharp}
                cursor="pointer"
                onClick={() => handleDeleteExercise(index)}
                fontSize="20px"
                marginLeft="15px"
                color="#FF0000"
              />
            </Box>
          </Box>
        ))}
        <Box alignItems="center" display="flex" flexDirection="row">
          <Button
            backgroundColor="#0072ce"
            borderRadius="8px"
            color="white"
            display="flex"
            fontSize="18px"
            mt={10}
            fontWeight="600"
            gap="11px"
            justifyContent="center"
            padding="5px 20px"
            onClick={addExercise}
            marginLeft="30px"
          >
            <Icon aria-label="edit" as={IoAddOutline} color="white" />
            <Text>Add Business Imperative</Text>
          </Button>
        </Box>
      </Box>
    );
  }

  if (!newExercises || newExercises.length === 0) {
    return (
      <Box display="flex" flex={1} flexDirection="column">
        <Box display="flex" flexDirection="column" marginLeft="25px">
          <Box alignItems="center" display="flex" flexDirection="row">
            <Text fontSize="18px" marginLeft="10px" color="#FF0000">
              <b>No exercises added yet</b>
            </Text>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" flex={1} flexDirection="column">
      {newExercises.map(exercise => (
        <Box key={exercise.id} display="flex" flexDirection="column" marginLeft="25px">
          <Box alignItems="center" display="flex" flexDirection="row">
            <Icon as={ChevronRightIcon} marginLeft="15px" />
            <Text fontSize="18px" marginLeft="10px">
              {exercise.name}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ExerciseComponent;

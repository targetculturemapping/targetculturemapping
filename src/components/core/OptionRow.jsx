import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Button, Icon, HStack, VStack, useMediaQuery, Tooltip, ButtonGroup } from '@chakra-ui/react';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineBrightness1, MdInfoOutline } from 'react-icons/md';

// eslint-disable-next-line react/prop-types
const OptionRow = ({ leftDescription, leftLabel, rightLabel, rightDescription, onChange, keys, values, updateNeeded }) => {
  const buttonWidth = 'calc(100% / 7)';
  const isMobile = useMediaQuery(['(max-width: 1200px)'])[0];
  const [selected, setSelected] = useState();
  const handleChange = value => {
    setSelected(value);
    onChange(keys, value);
  };

  const [leftTooltipOpen, setLeftTooltipOpen] = useState(false);
  const [rightTooltipOpen, setRightTooltipOpen] = useState(false);

  const handleLeftLabelClick = () => {
    setLeftTooltipOpen(!leftTooltipOpen);
  };

  const handleRightLabelClick = () => {
    setRightTooltipOpen(!rightTooltipOpen);
  };

  const setOptionValue = () => {
    if (values) {
      if (Object.prototype.hasOwnProperty.call(values, keys)) {
        setSelected(values[keys]);
      }
    }
  };

  useEffect(() => {
    setOptionValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateNeeded]);

  return (
    <>
      {isMobile && (
        <Box>
          <HStack alignItems="center" spacing={4} w="100%">
            <VStack alignItems="start" flex="1" p={4} w="70%">
              <Tooltip label={leftDescription} hasArrow shouldWrapChildren open={leftTooltipOpen} onClose={() => setLeftTooltipOpen(false)}>
                <Flex flexDirection="row" alignItems="center">
                  <Text fontWeight="bold" onClick={handleLeftLabelClick} mr={1}>
                    {leftLabel}
                  </Text>
                  <MdInfoOutline />
                </Flex>
              </Tooltip>
            </VStack>
            <VStack alignItems="end" flex="1" p={4} w="70%">
              <Tooltip
                label={rightDescription}
                hasArrow
                shouldWrapChildren
                open={rightTooltipOpen}
                onClose={() => setRightTooltipOpen(false)}
              >
                <Flex alignItems="center" flexDirection="row">
                  {' '}
                  <Text fontWeight="bold" onClick={handleRightLabelClick} mr={1}>
                    {rightLabel}{' '}
                  </Text>
                  <MdInfoOutline />
                </Flex>
              </Tooltip>
            </VStack>
          </HStack>
          <HStack>
            <HStack alignItems="center" width="100%">
              <ButtonGroup size="lg" isAttached variant="outline" width="100%">
                <Button
                  width={buttonWidth}
                  height="35px"
                  variant={selected === 1 ? 'solid' : 'outline'}
                  color={selected === 1 ? 'white' : 'black'}
                  backgroundColor={selected === 1 ? '#0072ce' : 'white'}
                  onClick={() => handleChange(1)}
                  borderRadius="md"
                  borderWidth="1px"
                >
                  <Icon style={{ width: '30px', height: '30px', mx: '10px' }} as={MdOutlineKeyboardArrowLeft} /> {/* large */}
                </Button>
                <Button
                  width={buttonWidth}
                  height="35px"
                  variant={selected === 2 ? 'solid' : 'outline'}
                  color={selected === 2 ? 'white' : 'black'}
                  backgroundColor={selected === 2 ? '#0072ce' : 'white'}
                  onClick={() => handleChange(2)}
                  borderRadius="md"
                  borderWidth="1px"
                >
                  <Icon style={{ width: '23px', height: '23px' }} as={MdOutlineKeyboardArrowLeft} /> {/* medium */}
                </Button>
                <Button
                  width={buttonWidth}
                  height="35px"
                  variant={selected === 3 ? 'solid' : 'outline'}
                  color={selected === 3 ? 'white' : 'black'}
                  backgroundColor={selected === 3 ? '#0072ce' : 'white'}
                  onClick={() => handleChange(3)}
                  borderRadius="md"
                  borderWidth="1px"
                >
                  <Icon style={{ width: '15px', height: '15px' }} as={MdOutlineKeyboardArrowLeft} /> {/* small */}
                </Button>
                <Button
                  width={buttonWidth}
                  height="35px"
                  variant={selected === 4 ? 'solid' : 'outline'}
                  color={selected === 4 ? 'white' : 'black'}
                  backgroundColor={selected === 4 ? '#0072ce' : 'white'}
                  onClick={() => handleChange(4)}
                  borderRadius="md"
                  borderWidth="1px"
                >
                  <Icon style={{ width: '15px', height: '15px' }} as={MdOutlineBrightness1} /> {/* medium */}
                </Button>
                <Button
                  width={buttonWidth}
                  height="35px"
                  variant={selected === 5 ? 'solid' : 'outline'}
                  color={selected === 5 ? 'white' : 'black'}
                  backgroundColor={selected === 5 ? '#0072ce' : 'white'}
                  onClick={() => handleChange(5)}
                  borderRadius="md"
                  borderWidth="1px"
                >
                  <Icon style={{ width: '15px', height: '15px' }} as={MdOutlineKeyboardArrowRight} /> {/* small */}
                </Button>
                <Button
                  width={buttonWidth}
                  height="35px"
                  variant={selected === 6 ? 'solid' : 'outline'}
                  color={selected === 6 ? 'white' : 'black'}
                  backgroundColor={selected === 6 ? '#0072ce' : 'white'}
                  onClick={() => handleChange(6)}
                  borderRadius="md"
                  borderWidth="1px"
                >
                  <Icon style={{ width: '23px', height: '23px' }} as={MdOutlineKeyboardArrowRight} /> {/* medium */}
                </Button>
                <Button
                  width={buttonWidth}
                  height="35px"
                  variant={selected === 7 ? 'solid' : 'outline'}
                  color={selected === 7 ? 'white' : 'black'}
                  backgroundColor={selected === 7 ? '#0072ce' : 'white'}
                  onClick={() => handleChange(7)}
                  borderRadius="md"
                  borderWidth="1px"
                >
                  <Icon style={{ width: '30px', height: '30px' }} as={MdOutlineKeyboardArrowRight} /> {/* large */}
                </Button>
              </ButtonGroup>
            </HStack>
          </HStack>
        </Box>
      )}
      {!isMobile && (
        <HStack alignItems="center" spacing={4} w="100%">
          <VStack alignItems="start" borderRadius="md" borderWidth="1px" flex="1" p={4} w="70%">
            <Text fontWeight="bold">{leftLabel}</Text>
            <Text fontSize="sm">{leftDescription}</Text>
          </VStack>
          <HStack alignItems="center" width="455px">
            <ButtonGroup size="lg" isAttached variant="outline">
              <Button
                style={{ width: '65px', height: '35px' }}
                variant={selected === 1 ? 'solid' : 'outline'}
                color={selected === 1 ? 'white' : 'black'}
                backgroundColor={selected === 1 ? '#0072ce' : 'white'}
                onClick={() => handleChange(1)}
                borderRadius="md"
                borderWidth="1px"
              >
                <Icon style={{ width: '30px', height: '30px', mx: '10px' }} as={MdOutlineKeyboardArrowLeft} /> {/* large */}
              </Button>
              <Button
                style={{ width: '65px', height: '35px' }}
                variant={selected === 2 ? 'solid' : 'outline'}
                color={selected === 2 ? 'white' : 'black'}
                backgroundColor={selected === 2 ? '#0072ce' : 'white'}
                onClick={() => handleChange(2)}
                borderRadius="md"
                borderWidth="1px"
              >
                <Icon style={{ width: '23px', height: '23px' }} as={MdOutlineKeyboardArrowLeft} /> {/* medium */}
              </Button>
              <Button
                style={{ width: '65px', height: '35px' }}
                variant={selected === 3 ? 'solid' : 'outline'}
                color={selected === 3 ? 'white' : 'black'}
                backgroundColor={selected === 3 ? '#0072ce' : 'white'}
                onClick={() => handleChange(3)}
                borderRadius="md"
                borderWidth="1px"
              >
                <Icon style={{ width: '15px', height: '15px' }} as={MdOutlineKeyboardArrowLeft} /> {/* small */}
              </Button>
              <Button
                style={{ width: '65px', height: '35px' }}
                variant={selected === 4 ? 'solid' : 'outline'}
                color={selected === 4 ? 'white' : 'black'}
                backgroundColor={selected === 4 ? '#0072ce' : 'white'}
                onClick={() => handleChange(4)}
                borderRadius="md"
                borderWidth="1px"
              >
                <Icon style={{ width: '15px', height: '15px' }} as={MdOutlineBrightness1} /> {/* medium */}
              </Button>
              <Button
                style={{ width: '65px', height: '35px' }}
                variant={selected === 5 ? 'solid' : 'outline'}
                color={selected === 5 ? 'white' : 'black'}
                backgroundColor={selected === 5 ? '#0072ce' : 'white'}
                onClick={() => handleChange(5)}
                borderRadius="md"
                borderWidth="1px"
              >
                <Icon style={{ width: '15px', height: '15px' }} as={MdOutlineKeyboardArrowRight} /> {/* small */}
              </Button>
              <Button
                style={{ width: '65px', height: '35px' }}
                variant={selected === 6 ? 'solid' : 'outline'}
                color={selected === 6 ? 'white' : 'black'}
                backgroundColor={selected === 6 ? '#0072ce' : 'white'}
                onClick={() => handleChange(6)}
                borderRadius="md"
                borderWidth="1px"
              >
                <Icon style={{ width: '23px', height: '23px' }} as={MdOutlineKeyboardArrowRight} /> {/* medium */}
              </Button>
              <Button
                style={{ width: '65px', height: '35px' }}
                variant={selected === 7 ? 'solid' : 'outline'}
                color={selected === 7 ? 'white' : 'black'}
                backgroundColor={selected === 7 ? '#0072ce' : 'white'}
                onClick={() => handleChange(7)}
                borderRadius="md"
                borderWidth="1px"
              >
                <Icon style={{ width: '30px', height: '30px' }} as={MdOutlineKeyboardArrowRight} /> {/* large */}
              </Button>
            </ButtonGroup>
          </HStack>
          <VStack alignItems="start" borderRadius="md" borderWidth="1px" flex="1" p={4} w="70%">
            <Text fontWeight="bold">{rightLabel}</Text>
            <Text fontSize="sm">{rightDescription}</Text>
          </VStack>
        </HStack>
      )}
    </>
  );
};
export default OptionRow;

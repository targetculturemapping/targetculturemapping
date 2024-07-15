/* eslint-disable react/prop-types */
import React, { useRef } from 'react';

import { Modal, ModalOverlay, ModalContent, ModalFooter, ModalBody, Button, Text, Image, Flex } from '@chakra-ui/react';

import GenericModalImage from 'assets/images/genericModal.png';

const ActionModal = ({ onClose, isOpen, text, onClick, loading }) => {
  const initialRef = useRef();
  const finalRef = useRef();

  return (
    <Modal finalFocusRef={finalRef} initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay
        backdropFilter="blur(30px)"
        background="radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(205, 0, 73, 0.4) 0%, rgba(255, 255, 255, 0) 100%)"
        transform="rotate(-180deg)"
      />
      <ModalContent
        justifyContent="center"
        alignItems="center"
        padding="35px"
        margin="auto"
        borderRadius="24px"
        background="#FFFFFF"
        boxShadow="0px 2px 20px rgba(0, 0, 0, 0.06)"
        maxW="436px"
        px="40px"
      >
        <ModalBody pb={6}>
          <Flex alignItems="center" flexDirection="column" gap="8px" justifyContent="center">
            <Image alt="modal image" height="200px" src={GenericModalImage} width="200px" />

            <Text color="gray.700" fontSize="24px" fontWeight="400">
              Are you sure?
            </Text>
            <Text color="gray.500" fontSize="16px" fontStyle="normal" fontWeight="400">
              {text}
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter display="flex" w="full">
          <Button
            border={`1px solid #0072ce`}
            borderRadius="lg"
            fontSize="16px"
            fontWeight="600"
            mr={4}
            onClick={onClose}
            paddingBottom="7px"
            paddingTop="7px"
            textColor="#0072ce"
            width="50%"
          >
            Back
          </Button>
          <Button
            isLoading={loading}
            onClick={onClick}
            backgroundColor="#0072ce"
            borderRadius="lg"
            fontSize="16px"
            fontWeight="600"
            paddingBottom="7px"
            paddingTop="7px"
            textColor="white"
            type="submit"
            width="50%"
          >
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ActionModal;

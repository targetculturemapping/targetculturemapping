import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    paddingX: 0,
    _focus: {
      borderWidth: '2px'
    }
  }
});

const inputTheme = defineMultiStyleConfig({
  baseStyle
});

const components = {
  Input: inputTheme
};

export default components;

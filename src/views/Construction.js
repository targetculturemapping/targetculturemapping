import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { BuildOutlined } from '@ant-design/icons';

const UnderConstructionPage = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Box sx={{ mb: 4 }}>
        <BuildOutlined sx={{ fontSize: 60 }} color="action" />
      </Box>
      <Typography variant="h4" gutterBottom>
        Under Construction
      </Typography>
      <Typography variant="subtitle1">
        We are working hard to improve our website and we will ready to launch after
        <br />
        some more cups of coffee.
      </Typography>
    </Container>
  );
};

export default UnderConstructionPage;

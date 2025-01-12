import React from 'react';
import { Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <Box sx={{ padding: 2, textAlign: 'center', backgroundColor: '#ccc' }}>
      <Typography variant="h3" gutterBottom>Electric Vehicle Population Dashboard</Typography>
    </Box>
  );
};

export default Header;

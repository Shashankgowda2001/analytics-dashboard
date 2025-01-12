import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Grid } from '@mui/material';

const EVTypeBreakdown = ({ data }) => {
  const typeCounts = data.reduce((acc, item) => {
    acc[item['Electric Vehicle Type']] = (acc[item['Electric Vehicle Type']] || 0) + 1;
    return acc;
  }, {});

  const types = Object.keys(typeCounts);
  const counts = Object.values(typeCounts);

  const chartData = {
    labels: types,
    datasets: [{
      data: counts,
      backgroundColor: types.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
    }],
  };

  return (
    <Grid item>
      <Pie data={chartData} />
    </Grid>
  );
};

export default EVTypeBreakdown;

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Grid } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const VehicleDistributionByMake = ({ data }) => {
  const makeCounts = data.reduce((acc, item) => {
    acc[item.Make] = (acc[item.Make] || 0) + 1;
    return acc;
  }, {});

  const makes = Object.keys(makeCounts);
  const counts = Object.values(makeCounts);

  const chartData = {
    labels: makes,
    datasets: [{
      data: counts,
      backgroundColor: makes.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`), // Random color for each slice
    }],
  };

  return (
    <Grid item>
      <Pie data={chartData} />
    </Grid>
  );
};

export default VehicleDistributionByMake;

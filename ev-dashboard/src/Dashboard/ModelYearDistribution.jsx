import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Grid } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ModelYearDistribution = ({ data }) => {
  const yearCounts = data.reduce((acc, item) => {
    acc[item['Model Year']] = (acc[item['Model Year']] || 0) + 1;
    return acc;
  }, {});

  const years = Object.keys(yearCounts);
  const counts = Object.values(yearCounts);

  const chartData = {
    labels: years,
    datasets: [{
      label: 'Model Year Distribution',
      data: counts,
      backgroundColor: '#42A5F5',
    }],
  };

  return (
    <Grid item>
      <Bar data={chartData} />
    </Grid>
  );
};

export default ModelYearDistribution;

import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Grid } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ElectricRangeVsMSRP = ({ data }) => {
    const electricRange = data.map(item => parseFloat(item['Electric Range']));
    const msrp = data.map(item => parseFloat(item['Base MSRP']));

    const chartData = {
      labels: 'Electric Range vs MSRP',
      datasets: [{
        label: 'Electric Range vs MSRP',
        data: electricRange.map((range, index) => ({ x: range, y: msrp[index] })),
        backgroundColor: '#42A5F5',
      }],
    };

    return (
      <Grid item>
        <Scatter data={chartData} />
      </Grid>
    );
};

export default ElectricRangeVsMSRP;

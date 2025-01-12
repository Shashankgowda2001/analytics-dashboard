import React, { useState, useEffect } from 'react';
import { Grid, Box, Card, CardContent, Typography,  Select, MenuItem, FormControl, InputLabel, TextField, Button } from '@mui/material';
import Papa from 'papaparse';
import VehicleDistributionByMake from './VehicleDistributionByMake';
import ElectricRangeVsMSRP from './ElectricRangeVsMSRP';
import EVTypeBreakdown from './EVTypeBreakdown';
import ModelYearDistribution from './ModelYearDistribution';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [makes, setmakes] = useState([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [avgElectricRange, setAvgElectricRange] = useState(0);
    const [avgMsrp, setAvgMsrp] = useState(0);
    const [makersCount, setMakersCount] = useState(0);
    const [modelsCount, setModelsCount] = useState(0);
    const [cityCount, setCityCount] = useState(0);
    const [mostUsedMake, setMostUsedMake] = useState('');
    const [mostUsedModel, setMostUsedModel] = useState('');
    const [percentBEV, setPercentBEV] = useState(0);
    const [percentPHEV, setPercentPHEV] = useState(0);

    useEffect(() => {
        Papa.parse('/Electric_Vehicle_Population_Data.csv', {
            header: true,
            skipEmptyLines: true,
            delimiter: ',',
            download: true,
            complete: (result) => {
                setData(result.data);
                setFilteredData(result.data);
                setmakes([...new Set(result.data.map(item => item.Make))])

                const makeFrequency = result.data.reduce((acc, item) => {acc[item.Make] = (acc[item.Make] || 0) + 1;
                    return acc;
                }, {}); 
                const usedMake = Object.entries(makeFrequency).sort((a, b) => b[1] - a[1])[0][0];
                setMostUsedMake(usedMake);

                const modelFrequency = result.data.reduce((acc, item) => {acc[item.Model] = (acc[item.Model] || 0) + 1;
                    return acc;
                }, {});
                const usedModel = Object.entries(modelFrequency).sort((a, b) => b[1] - a[1])[0][0];
                setMostUsedModel(usedModel);

                const bevCount = result.data.filter(item => item['Electric Vehicle Type'] === 'Battery Electric Vehicle (BEV)').length;
                const bevPercentage = ((bevCount / result.data.length) * 100).toFixed(2);
                setPercentBEV(bevPercentage)

                const phevCount = result.data.filter(item => item['Electric Vehicle Type'] == 'Plug-in Hybrid Electric Vehicle (PHEV)').length;
                const phevPercentage = ((phevCount / result.data.length) * 100).toFixed(2);
                setPercentPHEV(phevPercentage)
            },
            error: (error) => {
                console.error('Error loading CSV:', error);
            }
        });      
    }, []);

    useEffect(() => {
        const electricRangeValues = filteredData.map(item => Number(item['Electric Range'])).filter(val => !isNaN(val));
        const averageElectricRange = electricRangeValues.reduce((acc, val) => acc + val, 0) / electricRangeValues.length || 0;
        setAvgElectricRange(averageElectricRange);

        const averageMSRP = filteredData.reduce((acc, item) => acc + parseFloat(item['Base MSRP'] || 0),0) / filteredData.length;
        setAvgMsrp(averageMSRP);

        const makeCountValue = new Set(filteredData.map(item => item.Make));
        const modelCountValue = new Set(filteredData.map(item => item.Model));
        setMakersCount(makeCountValue.size);
        setModelsCount(modelCountValue.size);

        const city = new Set(filteredData.map(item => item.City));
        setCityCount(city.size);    
    }, [filteredData])

    const handleFilter = () => {
        let filteredValues = [...data];

        if (selectedMake) {
            filteredValues = filteredValues.filter(item => item.Make === selectedMake);
        }
        if (startYear) {
            filteredValues = filteredValues.filter(item => parseInt(item['Model Year']) >= parseInt(startYear));
        }
        if (endYear) {
            filteredValues = filteredValues.filter(item => parseInt(item['Model Year']) <= parseInt(endYear));
        }

        setFilteredData(filteredValues);
    };

    return (
        <Box sx={{ padding: 1 }}>
            <Grid container spacing={4}>
                <Grid item container xs={12} spacing={2}>
                    <Grid item xs={6} sm={4}>
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel>Make</InputLabel>
                            <Select value={selectedMake} onChange={e => setSelectedMake(e.target.value)}>
                                <MenuItem value="">All Makes</MenuItem>
                                {makes.map((make, index) => (
                                    <MenuItem key={index} value={make}>{make}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>              
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <TextField label="Start Year"
                            variant="outlined"
                            type="number"
                            value={startYear}
                            onChange={e => setStartYear(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <TextField
                            label="End Year"
                            variant="outlined"
                            type="number"
                            value={endYear}
                            onChange={e => setEndYear(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} container justifyContent="center" spacing={2}>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleFilter}>Apply Filters</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={() => setFilteredData(data)}>Clear Filters</Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Insights</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={4} md={3}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total Vehicles:</Typography>
                                    <Typography variant="h5" color="primary">{filteredData.length}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={4} md={3}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Average Electric Range:</Typography>
                                    <Typography variant="h5" color="primary">{avgElectricRange.toFixed(2)}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={4} md={3}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Average MSRP:</Typography>
                                    <Typography variant="h5" color="primary">{avgMsrp.toFixed(2)}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={4} md={3}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    No. of Makers:
                                  </Typography>
                                  <Typography variant="h5" color="primary">
                                    {makersCount}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={4} md={3}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>No. of Models:</Typography>
                                    <Typography variant="h5" color="primary">{modelsCount}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={4} md={3}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>No. of Cities:</Typography>
                                    <Typography variant="h5" color="primary">{cityCount}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Vehicle Distribution By Make</Typography>
                            <VehicleDistributionByMake data={filteredData} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={8}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Model Year Distribution</Typography>
                            <ModelYearDistribution data={filteredData} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Electric Range vs MSRP</Typography>
                            <ElectricRangeVsMSRP data={filteredData} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">EV Type Breakdown</Typography>
                            <EVTypeBreakdown data={filteredData} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Key Metrics</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={6}>
                                            <Typography variant="h6" 
                                                sx={{ fontWeight: 'bold', whiteSpace: 'normal', wordWrap: 'break-word' }}
                                            >
                                                Most used Maker:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="h5" color="primary">{mostUsedMake}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={6}>
                                            <Typography variant="h6" 
                                                sx={{ fontWeight: 'bold', whiteSpace: 'normal', wordWrap: 'break-word' }}
                                            >
                                                Most used Model:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="h5" color="primary">{mostUsedModel}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={6}>
                                            <Typography variant="h6" 
                                                sx={{ fontWeight: 'bold', whiteSpace: 'normal', wordWrap: 'break-word' }}
                                            >
                                                Percentage of BEV Vehicle:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="h5" color="primary">{percentBEV}%</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={6}>
                                            <Typography variant="h6" 
                                                sx={{ fontWeight: 'bold', whiteSpace: 'normal', wordWrap: 'break-word' }}
                                            >
                                                Percentage of PHEV Vehicle:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="h5" color="primary">{percentPHEV}%</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;

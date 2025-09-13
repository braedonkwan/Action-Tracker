import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import Actionsbar from '../components/Actionsbar';
import LogAction from '../components/LogAction';
import LogManager from '../components/LogManager';

const ActionPage = () => (
    <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
                <Actionsbar />
            </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Log Actions
                    </Typography>
                    <LogAction />
                </Paper>
                <Paper sx={{ p: 2 }}>
                    <LogManager />
                </Paper>
            </Box>
        </Grid>
    </Grid>
);

export default ActionPage;

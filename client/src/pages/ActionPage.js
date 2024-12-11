import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import Actionsbar from '../components/Actionsbar';
import LogAction from '../components/LogAction';

const ActionPage = () => (
    <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
                <Actionsbar />
            </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Log Your Actions
                </Typography>
                <LogAction />
            </Paper>
        </Grid>
    </Grid>
);

export default ActionPage;

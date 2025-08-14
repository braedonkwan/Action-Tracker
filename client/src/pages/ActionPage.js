import React from 'react';
import { Grid, Paper, Typography, Divider } from '@mui/material';
import Actionsbar from '../components/Actionsbar';
import LogAction from '../components/LogAction';
import LogList from '../components/LogList';

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
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                    Logged Actions
                </Typography>
                <LogList />
            </Paper>
        </Grid>
    </Grid>
);

export default ActionPage;

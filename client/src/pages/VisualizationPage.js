import React, { useContext, useState, useMemo } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { DataContext } from '../context/DataContext';
import Filters from '../components/Filter';
import SummaryCard from '../components/SummaryCard';
import BarGraph from '../components/BarGraph';
import { format, parseISO } from 'date-fns';

const VisualizationPage = () => {
    const { actions, logs } = useContext(DataContext);
    const [actionFilters, setActionFilters] = useState([]);

    const filteredLogs = useMemo(() => {
        const actionIds = actions.map(a => a.id);
        const finalActionIds = actionFilters.length > 0 ? actionFilters : actionIds;
        return logs.filter(log => finalActionIds.includes(log.actionId));
    }, [actions, logs, actionFilters]);

    const graphData = useMemo(() => {
        const dateMap = {};
        filteredLogs.forEach(log => {
            const d = format(parseISO(log.timestamp), 'yyyy-MM-dd');
            dateMap[d] = (dateMap[d] || 0) + 1;
        });
        return Object.entries(dateMap).map(([date, count]) => ({ date, count }));
    }, [filteredLogs]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Filters
                    actionFilters={actionFilters}
                    setActionFilters={setActionFilters}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <SummaryCard filteredLogs={filteredLogs} />
            </Grid>
            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Actions per Day</Typography>
                    <BarGraph data={graphData} />
                </Paper>
            </Grid>
        </Grid>
    );
};

export default VisualizationPage;

import React, { useContext, useState, useMemo } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { DataContext } from '../context/DataContext';
import Filters from '../components/Filter';
import SummaryCard from '../components/SummaryCard';
import BarGraph from '../components/BarGraph';
import { format, parseISO, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

const VisualizationPage = () => {
    const { actions, logs } = useContext(DataContext);
    const [actionFilters, setActionFilters] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const filteredLogs = useMemo(() => {
        const allActionIds = actions.map(a => a.id);
        const finalActionIds = actionFilters.length > 0 ? actionFilters : allActionIds;

        const applyDate = (ts) => {
            const d = parseISO(ts);
            if (startDate) {
                const s = startOfDay(new Date(startDate));
                if (isBefore(d, s)) return false;
            }
            if (endDate) {
                const e = endOfDay(new Date(endDate));
                if (isAfter(d, e)) return false;
            }
            return true;
        };

        return logs.filter(log => finalActionIds.includes(log.actionId) && applyDate(log.timestamp));
    }, [actions, logs, actionFilters, startDate, endDate]);

    const graphData = useMemo(() => {
        const dateMap = {};
        filteredLogs.forEach(log => {
            const d = format(parseISO(log.timestamp), 'yyyy-MM-dd');
            dateMap[d] = (dateMap[d] || 0) + 1;
        });
        return Object.entries(dateMap)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [filteredLogs]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Filters
                    actionFilters={actionFilters}
                    setActionFilters={setActionFilters}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
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

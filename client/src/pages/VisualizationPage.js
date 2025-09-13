import React, { useContext, useState, useMemo, useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { DataContext } from '../context/DataContext';
import Filters from '../components/Filter';
import SummaryCard from '../components/SummaryCard';
import BarGraph from '../components/BarGraph';
import { format, parseISO, isAfter, isBefore, startOfDay, endOfDay, parse } from 'date-fns';
import { getLocalData, setLocalData } from '../utils/indexedDBUtil';

const VisualizationPage = () => {
    const { actions, logs } = useContext(DataContext);
    const [actionFilters, setActionFilters] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    
    // Load saved filter context on mount
    useEffect(() => {
        (async () => {
            const saved = await getLocalData('visualizeFilters');
            if (saved && typeof saved === 'object') {
                if (Array.isArray(saved.actionFilters)) {
                    setActionFilters(saved.actionFilters.map((v) => Number(v)).filter((v) => !Number.isNaN(v)));
                }
                if (saved.startDate === null || typeof saved.startDate === 'string') setStartDate(saved.startDate ?? null);
                if (saved.endDate === null || typeof saved.endDate === 'string') setEndDate(saved.endDate ?? null);
            }
        })();
    }, []);

    // Persist filters when they change
    useEffect(() => {
        setLocalData('visualizeFilters', { actionFilters, startDate, endDate });
    }, [actionFilters, startDate, endDate]);

    // Ensure saved action filters remain valid with current actions
    useEffect(() => {
        setActionFilters((prev) => prev.filter((id) => actions.some((a) => a.id === id)));
    }, [actions]);

    const filteredLogs = useMemo(() => {
        const allActionIds = actions.map(a => a.id);
        const finalActionIds = actionFilters.length > 0 ? actionFilters : allActionIds;

        const applyDate = (ts) => {
            const d = parseISO(ts);
            if (startDate) {
                // Parse date input as local date to avoid UTC offset issues
                const s = startOfDay(parse(startDate, 'yyyy-MM-dd', new Date()));
                if (isBefore(d, s)) return false;
            }
            if (endDate) {
                // End date is exclusive: compare to start of the day
                const e = startOfDay(parse(endDate, 'yyyy-MM-dd', new Date()));
                if (!isBefore(d, e)) return false; // require d < e
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
            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Actions per Day</Typography>
                    <BarGraph data={graphData} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <SummaryCard filteredLogs={filteredLogs} />
            </Grid>
        </Grid>
    );
};

export default VisualizationPage;

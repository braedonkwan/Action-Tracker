import React, { useMemo, useContext, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, parseISO, parse } from 'date-fns';
import { DataContext } from '../context/DataContext';

const LogManager = () => {
  const { logs, setLogs, actions } = useContext(DataContext);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all'); // '01'..'12' or 'all'

  const yearOptions = useMemo(() => {
    const set = new Set(logs.map((l) => format(parseISO(l.timestamp), 'yyyy')));
    return Array.from(set).sort().reverse();
  }, [logs]);

  const monthOptions = useMemo(() => {
    if (selectedYear === 'all') return [];
    const set = new Set(
      logs
        .filter((l) => format(parseISO(l.timestamp), 'yyyy') === selectedYear)
        .map((l) => format(parseISO(l.timestamp), 'MM'))
    );
    return Array.from(set).sort().reverse();
  }, [logs, selectedYear]);

  const logsByMonthDayCategory = useMemo(() => {
    const data = {};
    logs.forEach((log) => {
      const date = parseISO(log.timestamp);
      const yearKey = format(date, 'yyyy');
      const monthKey = format(date, 'MM');
      if (selectedYear !== 'all' && yearKey !== selectedYear) return;
      if (selectedMonth !== 'all' && monthKey !== selectedMonth) return;
      const monthLabel = format(date, 'MMMM yyyy');
      const dayKey = format(date, 'yyyy-MM-dd');
      const action = actions.find((a) => a.id === log.actionId);
      const category = action?.category || 'Uncategorized';
      if (!data[monthLabel]) data[monthLabel] = {};
      if (!data[monthLabel][dayKey]) data[monthLabel][dayKey] = {};
      if (!data[monthLabel][dayKey][category]) data[monthLabel][dayKey][category] = [];
      data[monthLabel][dayKey][category].push({ ...log });
    });
    return data;
  }, [logs, actions, selectedYear, selectedMonth]);

  const handleDeleteLog = (log) => {
    if (log.id != null) {
      setLogs(logs.filter((l) => l.id !== log.id));
    } else {
      // fallback for legacy logs without id
      setLogs(
        logs.filter(
          (l) => !(l.actionId === log.actionId && l.timestamp === log.timestamp)
        )
      );
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Manage Logs</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="year-filter-label">Year</InputLabel>
            <Select
              labelId="year-filter-label"
              value={selectedYear}
              label="Year"
              onChange={(e) => { setSelectedYear(e.target.value); setSelectedMonth('all'); }}
            >
              <MenuItem value="all">All</MenuItem>
              {yearOptions.map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }} disabled={selectedYear === 'all'}>
            <InputLabel id="month-filter-label">Month</InputLabel>
            <Select
              labelId="month-filter-label"
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {monthOptions.map((m) => (
                <MenuItem key={m} value={m}>{format(parse(`${selectedYear}-${m}-01`, 'yyyy-MM-dd', new Date()), 'MMMM')}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {Object.entries(logsByMonthDayCategory).length === 0 && (
        <Typography color="text.secondary">No logs to display.</Typography>
      )}

      {Object.entries(logsByMonthDayCategory)
        .sort(([ma], [mb]) => parse(mb, 'MMMM yyyy', new Date()) - parse(ma, 'MMMM yyyy', new Date()))
        .map(([monthLabel, days]) => (
        <Accordion key={monthLabel} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>{monthLabel}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Object.keys(days)
              .sort((a, b) => b.localeCompare(a))
              .map((dayKey) => (
                <Box key={dayKey} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {format(parse(dayKey, 'yyyy-MM-dd', new Date()), 'EEEE, MMM d, yyyy')}
                  </Typography>
                  <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                    {Object.entries(days[dayKey]).map(([category, entries]) => (
                      <Box key={category}>
                        <ListSubheader disableSticky>{category}</ListSubheader>
                        {entries
                          .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
                          .map((entry) => {
                            const action = actions.find((a) => a.id === entry.actionId);
                            const actionName = action?.name || 'Deleted action';
                            return (
                              <ListItem
                                key={`${entry.id ?? entry.timestamp}-${entry.actionId}`}
                                secondaryAction={
                                  <IconButton edge="end" color="error" onClick={() => handleDeleteLog(entry)}>
                                    <DeleteIcon />
                                  </IconButton>
                                }
                              >
                                <ListItemText
                                  primary={actionName}
                                  secondary={format(parseISO(entry.timestamp), 'p')}
                                />
                              </ListItem>
                            );
                          })}
                        <Divider />
                      </Box>
                    ))}
                  </List>
                </Box>
              ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default LogManager;


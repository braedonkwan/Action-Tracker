import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    ListSubheader,
    List,
    ListItem,
    ListItemText,
    IconButton
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

const LogAction = () => {
    const { actions, logs, setLogs } = useContext(DataContext);
    const [selectedAction, setSelectedAction] = useState(null);

    const handleLog = () => {
        if (selectedAction !== null) {
            setLogs([
                ...logs,
                { actionId: selectedAction, timestamp: new Date().toISOString(), id: Date.now() }
            ]);
            setSelectedAction(null);
        }
    };

    const handleDelete = (id) => {
        setLogs(logs.filter((l) => (l.id ?? l.timestamp) !== id));
    };

    const groupedActions = actions.reduce((acc, action) => {
        if (!acc[action.category]) acc[action.category] = [];
        acc[action.category].push(action);
        return acc;
    }, {});
    const categories = Object.keys(groupedActions).sort();

    const sortedLogs = [...logs].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="action-select-label">Select Action</InputLabel>
                    <Select
                        labelId="action-select-label"
                        value={selectedAction ?? ''}
                        label="Select Action"
                        onChange={(e) => setSelectedAction(Number(e.target.value))}
                    >
                        {categories.map((cat) => [
                            <ListSubheader key={`${cat}-header`}>{cat}</ListSubheader>,
                            ...groupedActions[cat]
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((a) => (
                                    <MenuItem key={a.id} value={a.id}>
                                        {a.name}
                                    </MenuItem>
                                ))
                        ])}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleLog}>
                    Log Action
                </Button>
            </Box>
            <List>
                {sortedLogs.map((log) => {
                    const action = actions.find((a) => a.id === log.actionId);
                    const logKey = log.id ?? log.timestamp;
                    return (
                        <ListItem key={logKey} secondaryAction={
                            <IconButton edge="end" onClick={() => handleDelete(logKey)}>
                                <Delete />
                            </IconButton>
                        }>
                            <ListItemText
                                primary={action ? action.name : 'Unknown Action'}
                                secondary={format(parseISO(log.timestamp), 'PPpp')}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};

export default LogAction;

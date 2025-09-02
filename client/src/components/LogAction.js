import React, { useContext, useState, useMemo } from 'react';
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

const LogAction = () => {
    const { actions, logs, setLogs } = useContext(DataContext);
    const [selectedAction, setSelectedAction] = useState(null);

    const handleLog = () => {
        if (selectedAction !== null) {
            setLogs([...logs, { actionId: selectedAction, timestamp: new Date().toISOString() }]);
            setSelectedAction(null);
        }
    };

    const groupedActions = useMemo(() => {
        const groups = {};
        actions.forEach((a) => {
            if (!groups[a.category]) groups[a.category] = [];
            groups[a.category].push(a);
        });
        Object.values(groups).forEach((arr) => arr.sort((a, b) => a.name.localeCompare(b.name)));
        return groups;
    }, [actions]);

    const handleDeleteLog = (timestamp) => {
        setLogs(logs.filter((l) => l.timestamp !== timestamp));
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="action-select-label">Select Action</InputLabel>
                    <Select
                        labelId="action-select-label"
                        value={selectedAction ?? ''}
                        label="Select Action"
                        onChange={(e) => setSelectedAction(Number(e.target.value))}
                    >
                        {Object.entries(groupedActions).map(([category, acts]) => [
                            <ListSubheader key={`${category}-header`}>{category}</ListSubheader>,
                            ...acts.map((a) => (
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
                {logs
                    .slice()
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((log) => {
                        const action = actions.find((a) => a.id === log.actionId);
                        return (
                            <ListItem
                                key={log.timestamp}
                                secondaryAction={
                                    <IconButton edge="end" onClick={() => handleDeleteLog(log.timestamp)}>
                                        <Delete />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={action ? action.name : 'Unknown Action'}
                                    secondary={new Date(log.timestamp).toLocaleString()}
                                />
                            </ListItem>
                        );
                    })}
            </List>
        </Box>
    );
};

export default LogAction;

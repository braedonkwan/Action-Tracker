import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import { Box, FormControl, InputLabel, Select, MenuItem, Button, ListSubheader } from '@mui/material';

const LogAction = () => {
    const { actions, logs, setLogs } = useContext(DataContext);
    const [selectedAction, setSelectedAction] = useState(null);

    const handleLog = () => {
        if (selectedAction !== null) {
            setLogs([...logs, { actionId: selectedAction, timestamp: new Date().toISOString() }]);
            setSelectedAction(null);
        }
    };

    const goodActions = actions
        .filter((a) => a.category === 'Good')
        .sort((a, b) => a.name.localeCompare(b.name));
    const badActions = actions
        .filter((a) => a.category === 'Bad')
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="action-select-label">Select Action</InputLabel>
                <Select
                    labelId="action-select-label"
                    value={selectedAction ?? ''}
                    label="Select Action"
                    onChange={(e) => setSelectedAction(Number(e.target.value))}
                >
                    {goodActions.length > 0 && [
                        <ListSubheader key="good-header">Good</ListSubheader>,
                        ...goodActions.map((a) => (
                            <MenuItem key={a.id} value={a.id}>
                                {a.name}
                            </MenuItem>
                        ))
                    ]}
                    {badActions.length > 0 && [
                        <ListSubheader key="bad-header">Bad</ListSubheader>,
                        ...badActions.map((a) => (
                            <MenuItem key={a.id} value={a.id}>
                                {a.name}
                            </MenuItem>
                        ))
                    ]}
                </Select>
            </FormControl>
            <Button variant="contained" onClick={handleLog}>
                Log Action
            </Button>
        </Box>
    );
};

export default LogAction;

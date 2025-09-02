import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import { Box, FormControl, InputLabel, Select, MenuItem, Button, ListSubheader } from '@mui/material';

const LogAction = () => {
    const { actions, logs, setLogs, categories } = useContext(DataContext);
    const [selectedAction, setSelectedAction] = useState(null);

    const handleLog = () => {
        if (selectedAction !== null) {
            setLogs([...logs, { id: Date.now(), actionId: selectedAction, timestamp: new Date().toISOString() }]);
            setSelectedAction(null);
        }
    };

    const grouped = useMemo(() => {
        const map = {};
        (categories.length ? categories : Array.from(new Set(actions.map(a => a.category)))).forEach(c => { map[c] = []; });
        actions.forEach(a => {
            const c = a.category || 'Uncategorized';
            if (!map[c]) map[c] = [];
            map[c].push(a);
        });
        Object.values(map).forEach(arr => arr.sort((a, b) => a.name.localeCompare(b.name)));
        return map;
    }, [actions, categories]);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl sx={{ minWidth: 220 }}>
                <InputLabel id="action-select-label">Select Action</InputLabel>
                <Select
                    labelId="action-select-label"
                    value={selectedAction ?? ''}
                    label="Select Action"
                    onChange={(e) => setSelectedAction(Number(e.target.value))}
                >
                    {Object.entries(grouped).map(([cat, arr]) => (
                        arr.length > 0 ? (
                            [
                                <ListSubheader key={`header-${cat}`}>{cat}</ListSubheader>,
                                ...arr.map(a => (
                                    <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                                ))
                            ]
                        ) : null
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" onClick={handleLog}>
                Log Action
            </Button>
        </Box>
    );
};

export default LogAction;

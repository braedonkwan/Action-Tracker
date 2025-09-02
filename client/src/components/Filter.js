import React, { useContext, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    ListSubheader,
    TextField
} from '@mui/material';

const Filter = ({
    actionFilters,
    setActionFilters,
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) => {
    const { actions } = useContext(DataContext);

    const groupedActions = useMemo(() => {
        const cats = Array.from(new Set(actions.map(a => a.category || 'Uncategorized')));
        return cats.map((category) => ({
            category,
            actions: actions.filter((a) => (a.category || 'Uncategorized') === category)
        }));
    }, [actions]);

    const handleActionChange = (event) => {
        const value = event.target.value;
        setActionFilters(Array.isArray(value) ? value : []);
    };

    const renderActionsValue = (selected) =>
        selected
            .map((id) => actions.find((a) => a.id === id))
            .filter(Boolean)
            .map((a) => a.name)
            .join(', ');

    const actionMenuItems = [];
    groupedActions.forEach(({ category, actions: catActions }) => {
        actionMenuItems.push(
            <ListSubheader key={`header-${category}`} sx={{ pointerEvents: 'none' }}>
                {category}
            </ListSubheader>
        );
        catActions.forEach((a) => {
            actionMenuItems.push(
                <MenuItem key={a.id} value={a.id}>
                    <Checkbox checked={actionFilters.includes(a.id)} />
                    <ListItemText primary={a.name} />
                </MenuItem>
            );
        });
    });

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
            <FormControl sx={{ minWidth: 240 }}>
                <InputLabel id="action-filter-label">Actions</InputLabel>
                <Select
                    labelId="action-filter-label"
                    multiple
                    value={actionFilters}
                    onChange={handleActionChange}
                    renderValue={renderActionsValue}
                    label="Actions"
                >
                    {actionMenuItems}
                </Select>
            </FormControl>

            <TextField
                label="Start date"
                type="date"
                value={startDate || ''}
                onChange={(e) => setStartDate(e.target.value || null)}
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                label="End date"
                type="date"
                value={endDate || ''}
                onChange={(e) => setEndDate(e.target.value || null)}
                InputLabelProps={{ shrink: true }}
            />
        </Box>
    );
};

export default Filter;

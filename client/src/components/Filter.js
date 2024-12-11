import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    ListSubheader
} from '@mui/material';

const Filter = ({ actionFilters, setActionFilters }) => {
    const { actions } = useContext(DataContext);
    const categories = ['Good', 'Bad'];

    const groupedActions = categories.map((category) => ({
        category,
        actions: actions.filter((a) => a.category === category)
    }));

    const handleChange = (event) => {
        const value = event.target.value;
        setActionFilters(Array.isArray(value) ? value : []);
    };

    const renderValue = (selected) =>
        selected
            .map((id) => actions.find((a) => a.id === id))
            .filter(Boolean)
            .map((a) => a.name)
            .join(', ');

    const menuItems = [];
    groupedActions.forEach(({ category, actions: catActions }) => {
        menuItems.push(
            <ListSubheader key={`header-${category}`} sx={{ pointerEvents: 'none' }}>
                {category}
            </ListSubheader>
        );
        catActions.forEach((a) => {
            menuItems.push(
                <MenuItem key={a.id} value={a.id}>
                    <Checkbox checked={actionFilters.includes(a.id)} />
                    <ListItemText primary={a.name} />
                </MenuItem>
            );
        });
    });

    return (
        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="combined-filter-label">Filters</InputLabel>
                <Select
                    labelId="combined-filter-label"
                    multiple
                    value={actionFilters}
                    onChange={handleChange}
                    renderValue={renderValue}
                    label="Filters"
                >
                    {menuItems}
                </Select>
            </FormControl>
        </Box>
    );
};

export default Filter;

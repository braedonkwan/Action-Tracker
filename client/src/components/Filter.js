import React, { useContext, useMemo, useState } from 'react';
import { DataContext } from '../context/DataContext';
import {
    Box,
    Button,
    Checkbox,
    ListItemText,
    TextField,
    Popover,
    List,
    ListItemButton,
    ListItemIcon,
    Collapse,
    Divider,
    Tooltip,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';

const Filter = ({
    actionFilters,
    setActionFilters,
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) => {
    const { actions } = useContext(DataContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    const [search, setSearch] = useState('');

    const groupedActions = useMemo(() => {
        const cats = Array.from(new Set(actions.map(a => a.category || 'Uncategorized')));
        const s = search.trim().toLowerCase();
        return cats
            .map((category) => {
                const all = actions.filter((a) => (a.category || 'Uncategorized') === category);
                const filtered = s ? all.filter(a => a.name.toLowerCase().includes(s)) : all;
                return { category, actions: filtered, total: all.length };
            })
            .filter(group => group.actions.length > 0 || !s); // hide empty groups when searching
    }, [actions, search]);

    const selectedCount = actionFilters.length;
    const summaryLabel = selectedCount === 0 ? 'Filter Actions' : `Filter Actions (${selectedCount})`;

    const toggleCategory = (category) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(category)) next.delete(category);
            else next.add(category);
            return next;
        });
    };

    const toggleAction = (id) => {
        setActionFilters((prev) => {
            const set = new Set(prev);
            if (set.has(id)) set.delete(id);
            else set.add(id);
            return Array.from(set);
        });
    };

    const openPopover = (event) => setAnchorEl(event.currentTarget);
    const closePopover = () => setAnchorEl(null);
    const popoverOpen = Boolean(anchorEl);

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
            <Box>
                <Tooltip title="Filter Actions">
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={openPopover}
                        sx={{ minWidth: 180 }}
                    >
                        {summaryLabel}
                    </Button>
                </Tooltip>
                <Popover
                    open={popoverOpen}
                    anchorEl={anchorEl}
                    onClose={closePopover}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    slotProps={{ paper: { sx: { maxHeight: 420, width: 340 } } }}
                >
                    <Box sx={{ p: 1.5, pb: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, gap: 1 }}>
                        <Typography variant="subtitle2">Actions Filter</Typography>
                        <Box>
                            <Button size="small" sx={{ mr: 1 }} onClick={() => setActionFilters(actions.map(a => a.id))}>Select all</Button>
                            <Button size="small" onClick={() => setActionFilters([])}>Clear</Button>
                        </Box>
                    </Box>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Search actions"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <List dense disablePadding>
                        {groupedActions.map(({ category, actions: catActions, total }) => (
                            <React.Fragment key={category}>
                                <ListItemButton onClick={() => toggleCategory(category)}>
                                    <ListItemText primary={category} />
                                    {expandedCategories.has(category) ? (
                                        <ExpandLessIcon fontSize="small" />
                                    ) : (
                                        <ExpandMoreIcon fontSize="small" />
                                    )}
                                </ListItemButton>
                                <Collapse in={expandedCategories.has(category)} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding dense>
                                        {catActions.map((a) => (
                                            <ListItemButton key={a.id} sx={{ pl: 4 }} onClick={() => toggleAction(a.id)}>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <Checkbox edge="start" tabIndex={-1} disableRipple checked={actionFilters.includes(a.id)} />
                                                </ListItemIcon>
                                                <ListItemText primary={a.name} />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>
                            </React.Fragment>
                        ))}
                    </List>
                </Popover>
            </Box>

            <TextField
                label="Start date"
                type="date"
                value={startDate || ''}
                onChange={(e) => setStartDate(e.target.value || null)}
                size="small"
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                label="End date"
                type="date"
                value={endDate || ''}
                onChange={(e) => setEndDate(e.target.value || null)}
                size="small"
                InputLabelProps={{ shrink: true }}
            />
        </Box>
    );
};

export default Filter;

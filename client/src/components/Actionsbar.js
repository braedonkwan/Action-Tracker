import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '../context/DataContext';
import ActionForm from './ActionForm';
import { List, ListItem, ListItemText, IconButton, Divider, Typography, Box, Tooltip, ListItemButton, Collapse } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Actionsbar = () => {
    const { actions, setActions, logs, setLogs, categories, setCategories } = useContext(DataContext);
    const [editAction, setEditAction] = useState(null);
    const [expanded, setExpanded] = useState(new Set());

    const handleSave = (action) => {
        if (editAction) {
            setActions(actions.map((a) => (a.id === action.id ? action : a)));
            setEditAction(null);
        } else {
            setActions([...actions, action]);
        }
        if (action.category && !categories.includes(action.category)) {
            setCategories([...categories, action.category]);
        }
    };

    const handleEdit = (action) => {
        setEditAction(action);
    };

    const handleDelete = (id) => {
        // remove the action
        setActions(actions.filter((a) => a.id !== id));
        // cascade delete logs tied to this action
        setLogs(logs.filter((l) => l.actionId !== id));
        if (editAction && editAction.id === id) setEditAction(null);
    };

    const grouped = useMemo(() => {
        const map = {};
        (categories.length ? categories : Array.from(new Set(actions.map(a => a.category || 'Uncategorized')))).forEach(c => { map[c || 'Uncategorized'] = []; });
        actions.forEach(a => {
            const c = a.category || 'Uncategorized';
            if (!map[c]) map[c] = [];
            map[c].push(a);
        });
        Object.keys(map).forEach(k => map[k].sort((a, b) => a.name.localeCompare(b.name)));
        return map;
    }, [actions, categories]);

    const toggleCat = (cat) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(cat)) next.delete(cat); else next.add(cat);
            return next;
        });
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Edit Actions</Typography>
            <ActionForm onSave={handleSave} editAction={editAction} onCancel={() => setEditAction(null)} />
            <Divider sx={{ my: 2 }} />
            <List dense>
                {Object.entries(grouped).filter(([, arr]) => arr.length > 0).map(([cat, arr]) => (
                    <React.Fragment key={cat}>
                        <ListItemButton onClick={() => toggleCat(cat)}>
                            <ListItemText primary={cat} />
                            {expanded.has(cat) ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                        </ListItemButton>
                        <Collapse in={expanded.has(cat)} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding dense>
                                {arr.map((action) => (
                                    <ListItem
                                        key={action.id}
                                        secondaryAction={
                                            <Box>
                                                <Tooltip title="Edit">
                                                    <IconButton edge="end" onClick={() => handleEdit(action)}>
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete action and its logs">
                                                    <IconButton edge="end" color="error" onClick={() => handleDelete(action.id)}>
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        }
                                        sx={{ pl: 3 }}
                                    >
                                        <ListItemText primary={action.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};

export default Actionsbar;

import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import ActionForm from './ActionForm';
import { List, ListItem, ListItemText, IconButton, Divider, Typography, Box, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Actionsbar = () => {
    const { actions, setActions, logs, setLogs, categories, setCategories } = useContext(DataContext);
    const [editAction, setEditAction] = useState(null);

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

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Manage Actions</Typography>
            <ActionForm onSave={handleSave} editAction={editAction} onCancel={() => setEditAction(null)} />
            <Divider sx={{ my: 2 }} />
            <List>
                {actions.map((action) => (
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
                    >
                        <ListItemText primary={action.name} secondary={`Category: ${action.category}`} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Actionsbar;

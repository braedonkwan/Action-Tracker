import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import ActionForm from './ActionForm';
import { List, ListItem, ListItemText, IconButton, Divider, Typography, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Actionsbar = () => {
    const { actions, setActions } = useContext(DataContext);
    const [editAction, setEditAction] = useState(null);

    const handleSave = (action) => {
        if (editAction) {
            setActions(actions.map((a) => (a.id === action.id ? action : a)));
            setEditAction(null);
        } else {
            setActions([...actions, action]);
        }
    };

    const handleEdit = (action) => {
        setEditAction(action);
    };

    const handleDelete = (id) => {
        setActions(actions.filter((a) => a.id !== id));
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
                                <IconButton edge="end" onClick={() => handleEdit(action)}>
                                    <Edit />
                                </IconButton>
                                <IconButton edge="end" onClick={() => handleDelete(action.id)}>
                                    <Delete />
                                </IconButton>
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

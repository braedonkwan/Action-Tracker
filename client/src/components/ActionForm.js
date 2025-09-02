import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';

const ActionForm = ({ onSave, editAction, onCancel }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        if (editAction) {
            setName(editAction.name);
            setCategory(editAction.category);
        }
    }, [editAction]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, category: category || 'Uncategorized', id: editAction ? editAction.id : Date.now() });
        setName('');
        setCategory('');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
            <TextField
                label="Action Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <TextField
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                    {editAction ? 'Update Action' : 'Add Action'}
                </Button>
                {editAction && (
                    <Button variant="text" color="secondary" onClick={onCancel} sx={{ ml: 2 }}>
                        Cancel
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default ActionForm;

import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box, Grid } from '@mui/material';
import { DataContext } from '../context/DataContext';

const ActionForm = ({ onSave, editAction, onCancel }) => {
    const { categories, setCategories } = useContext(DataContext);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        if (editAction) {
            setName(editAction.name);
            setCategory(editAction.category || '');
        } else {
            // do not default to any category
            setCategory('');
        }
    }, [editAction]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedCategory = (category || '').toString().trim();
        if (!trimmedName || !trimmedCategory) return;

        onSave({ name: trimmedName, category: trimmedCategory, id: editAction ? editAction.id : Date.now() });

        // ensure category exists for filtering elsewhere
        if (!categories.includes(trimmedCategory)) {
            setCategories([...categories, trimmedCategory]);
        }
        setName('');
        setCategory('');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
            <Grid container spacing={1.5} alignItems="center">
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Action Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        fullWidth
                        required
                        size="small"
                        autoComplete="off"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        variant="outlined"
                        fullWidth
                        required
                        size="small"
                        autoComplete="off"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button type="submit" size="small" variant="contained" color="primary">
                            {editAction ? 'Update Action' : 'Add Action'}
                        </Button>
                        {editAction && (
                            <Button size="small" variant="text" color="secondary" onClick={onCancel}>
                                Cancel
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ActionForm;

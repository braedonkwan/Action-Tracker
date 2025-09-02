import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
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
            <TextField
                label="Action Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <Autocomplete
                freeSolo
                options={categories}
                value={category}
                onChange={(_e, newValue) => setCategory(newValue || '')}
                inputValue={category}
                onInputChange={(_e, newInput) => setCategory(newInput)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Category"
                        variant="outlined"
                        fullWidth
                        required
                    />
                )}
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

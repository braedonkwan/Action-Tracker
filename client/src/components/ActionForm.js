import React, { useState, useEffect } from 'react';
import { TextField, Button, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';

const ActionForm = ({ onSave, editAction, onCancel }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Good');

    useEffect(() => {
        if (editAction) {
            setName(editAction.name);
            setCategory(editAction.category);
        }
    }, [editAction]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, category, id: editAction ? editAction.id : Date.now() });
        setName('');
        setCategory('Good');
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
            <RadioGroup row value={category} onChange={(e) => setCategory(e.target.value)}>
                <FormControlLabel value="Good" control={<Radio />} label="Good" />
                <FormControlLabel value="Bad" control={<Radio />} label="Bad" />
            </RadioGroup>
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

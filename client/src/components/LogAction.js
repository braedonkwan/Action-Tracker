import React, { useContext, useState, useMemo, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import {
    Box,
    Button,
    Popover,
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Collapse,
    Tooltip,
    TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const LogAction = () => {
    const { actions, logs, setLogs, categories } = useContext(DataContext);
    const [selectedAction, setSelectedAction] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [expanded, setExpanded] = useState(new Set());
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
        if (selectedAction != null) {
            const now = new Date();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            setSelectedTime(`${hh}:${mm}`);
        } else {
            setSelectedTime('');
        }
    }, [selectedAction]);

    const handleLog = () => {
        if (selectedAction !== null) {
            const now = new Date();
            const [hh, mm] = String(selectedTime || '').split(':').map((v) => parseInt(v || '0', 10));
            const ts = new Date(now);
            ts.setHours(Number.isFinite(hh) ? hh : now.getHours(), Number.isFinite(mm) ? mm : now.getMinutes(), 0, 0);
            setLogs([...logs, { id: Date.now(), actionId: selectedAction, timestamp: ts.toISOString() }]);
            setSelectedAction(null);
            
        }
    };

    const grouped = useMemo(() => {
        const map = {};
        (categories.length ? categories : Array.from(new Set(actions.map(a => a.category || 'Uncategorized')))).forEach(c => { map[c || 'Uncategorized'] = []; });
        actions.forEach(a => {
            const c = a.category || 'Uncategorized';
            if (!map[c]) map[c] = [];
            map[c].push(a);
        });
        Object.values(map).forEach(arr => arr.sort((a, b) => a.name.localeCompare(b.name)));
        return map;
    }, [actions, categories]);

    const openPopover = (e) => setAnchorEl(e.currentTarget);
    const closePopover = () => setAnchorEl(null);
    const popoverOpen = Boolean(anchorEl);
    const toggleCat = (cat) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(cat)) next.delete(cat); else next.add(cat);
            return next;
        });
    };
    const currentLabel = useMemo(() => {
        if (selectedAction == null) return 'Select Action';
        const found = actions.find(a => a.id === selectedAction);
        return found ? found.name : 'Select Action';
    }, [selectedAction, actions]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 1.5, sm: 2 },
            width: '100%'
        }}>
            <Tooltip title="Select Action">
                <Button
                    variant="outlined"
                    size="small"
                    onClick={openPopover}
                    sx={{
                        width: { xs: '100%', sm: 'auto' },
                        minWidth: { sm: 220 }
                    }}
                >
                    {currentLabel}
                </Button>
            </Tooltip>
            <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={closePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{
                    paper: {
                        sx: {
                            maxHeight: 420,
                            width: { xs: '90vw', sm: 320 },
                            maxWidth: '90vw'
                        }
                    }
                }}
            >
                <List dense disablePadding>
                    {Object.entries(grouped).map(([cat, arr]) => (
                        arr.length > 0 ? (
                            <React.Fragment key={cat}>
                                <ListItemButton onClick={() => toggleCat(cat)}>
                                    <ListItemText primary={cat} />
                                    {expanded.has(cat) ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                </ListItemButton>
                                <Collapse in={expanded.has(cat)} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding dense>
                                        {arr.map(a => (
                                            <ListItemButton key={a.id} sx={{ pl: 4 }} onClick={() => { setSelectedAction(a.id); closePopover(); }} selected={selectedAction === a.id}>
                                                <ListItemIcon sx={{ minWidth: 28 }}>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        width: 10,
                                                        height: 10,
                                                        marginRight: 2,
                                                        borderRadius: '50%',
                                                        border: '2px solid',
                                                        borderColor: selectedAction === a.id ? '#1976d2' : 'rgba(0,0,0,0.54)',
                                                        backgroundColor: selectedAction === a.id ? '#1976d2' : 'transparent'
                                                    }} />
                                                </ListItemIcon>
                                                <ListItemText primary={a.name} />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>
                            </React.Fragment>
                        ) : null
                    ))}
                </List>
            </Popover>
            <TextField
                type={selectedAction == null ? 'text' : 'time'}
                size="small"
                label="Time"
                value={selectedAction == null ? '' : selectedTime}
                onChange={(e) => { setSelectedTime(e.target.value); }}
                inputProps={{ step: 60 }}
                disabled={selectedAction == null}
                InputLabelProps={{ shrink: selectedAction != null }}
                sx={{
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { sm: 130 }
                }}
            />
            <Button
                variant="contained"
                size="small"
                onClick={handleLog}
                disabled={selectedAction == null}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
                Log Action
            </Button>
        </Box>
    );
};

export default LogAction;

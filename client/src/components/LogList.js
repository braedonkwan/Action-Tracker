import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import { List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

const LogList = () => {
  const { logs, setLogs, actions } = useContext(DataContext);
  const [editingLog, setEditingLog] = useState(null);
  const [editTime, setEditTime] = useState('');

  const handleEdit = (log) => {
    setEditingLog(log);
    setEditTime(format(parseISO(log.timestamp), "yyyy-MM-dd'T'HH:mm"));
  };

  const handleSave = () => {
    setLogs(
      logs.map((l) =>
        l.id === editingLog.id
          ? { ...l, timestamp: new Date(editTime).toISOString() }
          : l
      )
    );
    setEditingLog(null);
  };

  const handleDelete = (id) => {
    setLogs(logs.filter((l) => l.id !== id));
  };

  return (
    <Box>
      <List>
        {logs.map((log) => {
          const action = actions.find((a) => a.id === log.actionId);
          return (
            <ListItem
              key={log.id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" onClick={() => handleEdit(log)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(log.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={action ? action.name : 'Unknown Action'}
                secondary={format(parseISO(log.timestamp), 'Pp')}
              />
            </ListItem>
          );
        })}
      </List>

      <Dialog open={Boolean(editingLog)} onClose={() => setEditingLog(null)}>
        <DialogTitle>Edit Log Time</DialogTitle>
        <DialogContent>
          <TextField
            type="datetime-local"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingLog(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LogList;

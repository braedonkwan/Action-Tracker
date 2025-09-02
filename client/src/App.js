import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, CssBaseline } from '@mui/material';
import ActionPage from './pages/ActionPage';
import VisualizationPage from './pages/VisualizationPage';
import { DataContext } from './context/DataContext';
import { getLocalData, setLocalData } from './utils/indexedDBUtil';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' }
  }
});

function App() {
  const [actions, setActions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const storedActions = await getLocalData('actions');
      const storedLogs = await getLocalData('logs');
      setActions(storedActions || []);
      setLogs(storedLogs || []);
      setIsDataLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (isDataLoaded) setLocalData('actions', actions);
  }, [actions, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) setLocalData('logs', logs);
  }, [logs, isDataLoaded]);

  const value = useMemo(() => ({ actions, setActions, logs, setLogs }), [actions, logs]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" color="primary" enableColorOnDark>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Action Tracker
            </Typography>
            <Button color="inherit" component={Link} to="/">Actions</Button>
            <Button color="inherit" component={Link} to="/visualize">Visualize</Button>
          </Toolbar>
        </AppBar>
        <Box p={2}>
          <DataContext.Provider value={value}>
            <Routes>
              <Route path="/" element={<ActionPage />} />
              <Route path="/visualize" element={<VisualizationPage />} />
            </Routes>
          </DataContext.Provider>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

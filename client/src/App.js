import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import ActionPage from './pages/ActionPage';
import VisualizationPage from './pages/VisualizationPage';
import { DataContext } from './context/DataContext';
import { getLocalData, setLocalData } from './utils/indexedDBUtil';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
    background: { default: '#f7f9fc', paper: '#ffffff' }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiAppBar: { styleOverrides: { root: { borderRadius: 0 } } }
  }
});

function App() {
  const [actions, setActions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const storedActions = await getLocalData('actions');
      const storedLogs = await getLocalData('logs');
      const storedCategories = await getLocalData('categories');

      setActions(storedActions || []);
      setLogs(storedLogs || []);

      let initialCategories = storedCategories;
      if (!initialCategories || initialCategories.length === 0) {
        const derived = Array.from(new Set((storedActions || []).map(a => a.category).filter(Boolean)));
        initialCategories = derived; // do not seed defaults
      }
      setCategories(initialCategories);

      setIsDataLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (isDataLoaded) setLocalData('actions', actions);
  }, [actions, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) setLocalData('logs', logs);
  }, [logs, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) setLocalData('categories', categories);
  }, [categories, isDataLoaded]);

  // Prune categories that have no associated actions
  useEffect(() => {
    if (!isDataLoaded) return;
    const setFromActions = Array.from(new Set(actions.map(a => a.category).filter(Boolean)));
    const equal = setFromActions.length === categories.length && setFromActions.every(c => categories.includes(c));
    if (!equal) {
      setCategories(setFromActions);
    }
  }, [actions, categories, isDataLoaded]);

  const value = useMemo(() => ({ actions, setActions, logs, setLogs, categories, setCategories }), [actions, logs, categories]);

  // Derive basename from PUBLIC_URL so Links don't jump to domain root
  const basename = (() => {
    const pub = process.env.PUBLIC_URL;
    if (!pub) return undefined;
    try {
      const url = new URL(pub, window.location.origin);
      // Ensure no trailing slash for react-router basename
      return url.pathname.replace(/\/$/, '');
    } catch {
      // Fallback: attempt to treat as path
      return pub.replace(/https?:\/\/[^/]+/, '').replace(/\/$/, '');
    }
  })();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename={basename}>
        <AppBar position="static">
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

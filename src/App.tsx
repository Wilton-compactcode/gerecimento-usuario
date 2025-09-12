import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import UserList from './pages/UserList';
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CustomThemeProvider, useTheme } from './contexts/ThemeContext';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    background: { default: '#fff', paper: '#fff' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    background: { default: '#121212', paper: '#121212' },
  },
});

function AppContent() {
  const { themeMode, setThemeMode } = useTheme();
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login setThemeMode={setThemeMode} themeMode={themeMode} />} />
          <Route path="/users" element={<UserList setThemeMode={setThemeMode} themeMode={themeMode} />} />
          <Route path="/create-user" element={<CreateUser setThemeMode={setThemeMode} themeMode={themeMode} />} />
          <Route path="/edit-user/:id" element={<EditUser setThemeMode={setThemeMode} themeMode={themeMode} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;
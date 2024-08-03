import { useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { themeSettings } from './theme';
import Layout from './pages/layout';
import Dashboard from './pages/dashboard';
import { useSelector } from 'react-redux';
import NotFound from './pages/notfound';
import Category from './pages/category';
import About from './pages/about';
import Cities from './pages/cities';

export const App = () => {
  const [mode, setMode] = useState('light');
  const darkMode = useSelector((state) => state.theme.darkMode);

  useMemo(() => {
    if (darkMode) {
      setMode('dark');
    } else {
      setMode('light');
    }
  }, [darkMode]);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/cidades" replace />} />
            <Route path="/cidades" element={<Cities />} />
            <Route path="/cidade" element={<Dashboard />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/categoria/:categoryUrl" element={<Category />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

function Root() {
  const [theme, setTheme] = useState(() => localStorage.getItem('stockflow-theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('stockflow-theme', theme);
  }, [theme]);

  return <App theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><Root /></React.StrictMode>);

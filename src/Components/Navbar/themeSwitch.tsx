import React from 'react';

import { Moon, Sun } from '../../assets/assets';
import { useUiContext } from '../../Types/uiContext';

import './themeSwitch.css';

const ThemeSwitch: React.FC = () => {
  const { darkMode, setDarkMode } = useUiContext();
  const handleSwitchTheme = () => {
    setDarkMode(!darkMode);
  };
  return (
    <div className={`theme-switch ${darkMode ? 'theme-switch-dark-mode' : ''}`} onClick={handleSwitchTheme}>
      <Moon />
      <Sun />
    </div>
  );
};

export default ThemeSwitch;

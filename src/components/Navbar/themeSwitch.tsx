import React from 'react';
import { useAppearance } from 'src/providers/AppearanceProvider';

import { Moon, Sun } from '../../assets/assets';

import './themeSwitch.css';

const ThemeSwitch: React.FC = () => {
  const { darkMode, setDarkMode } = useAppearance();
  const handleSwitchTheme = () => {
    setDarkMode(!darkMode);
  };
  return (
    <div
      className={`theme-switch ${darkMode ? 'theme-switch-dark-mode' : ''}`}
      onClick={handleSwitchTheme}
    >
      <Moon />
      <Sun />
    </div>
  );
};

export default ThemeSwitch;

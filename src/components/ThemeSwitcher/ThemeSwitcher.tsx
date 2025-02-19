import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeSwitcher.scss';

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-switcher">
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        Dark Mode
      </label>
    </div>
  );
};

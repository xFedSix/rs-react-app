import React, { useState, useEffect } from 'react';
import { THEME_KEY, getInitialTheme } from './ThemeTypes';
import { ThemeContext, Theme } from './theme-context';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [colorTheme, setColorTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, colorTheme);
  }, [colorTheme]);
  const toggleTheme = () => {
    setColorTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme: colorTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const THEME_KEY = 'theme';

export const getInitialTheme = (): 'light' | 'dark' => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  return savedTheme === 'dark' ? 'dark' : 'light';
};

export const THEME_KEY = 'theme';

export const getInitialTheme = (): 'light' | 'dark' => {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme === 'dark' ? 'dark' : 'light';
  } catch (error) {
    return 'light';
  }
};

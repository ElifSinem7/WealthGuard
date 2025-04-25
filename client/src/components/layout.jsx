import React, { useEffect } from 'react';
import { useTheme } from '../pages/theme';
import { useLanguage } from '../pages/language';

const Layout = ({ children }) => {
  const { theme, colorScheme, textSize } = useTheme();
  const { language } = useLanguage();

  useEffect(() => {
    const body = document.body;
  
    const themeClass = `theme-${theme}-${colorScheme}`;
    body.classList.remove(
      'theme-light-blue', 'theme-light-purple',
      'theme-dark-blue', 'theme-dark-purple'
    );
    body.classList.add(themeClass);
  
    body.classList.remove('font-small', 'font-medium', 'font-large');
    body.classList.add(
      textSize === 1 ? 'font-small' :
      textSize === 2 ? 'font-medium' : 'font-large'
    );
  }, [theme, colorScheme, textSize]);

  const style = {
    backgroundColor: 'var(--theme-bg)',
    color: 'var(--theme-text)',
    fontSize: textSize === 1 ? '0.85rem' : textSize === 3 ? '1.15rem' : '1rem',
    minHeight: '100vh',
  };

  return (
    <div className="app-wrapper" style={style}>
      {children}
    </div>
  );
};

export default Layout;

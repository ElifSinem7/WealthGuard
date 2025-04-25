import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const themeColors = {
  light: {
    blue: {
      accent: '#3B82F6',
      accentLight: '#EFF6FF',
      bg: '#F9FAFB',
      card: '#FFFFFF',
      sidebar: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB'
    },
    purple: {
      accent: '#8B5CF6',
      accentLight: '#EDE9FE',
      bg: '#F9FAFB',
      card: '#FFFFFF',
      sidebar: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB'
    }
  },
  dark: {
    blue: {
      accent: '#60A5FA',
      accentLight: '#1E3A8A',
      bg: '#111827',
      card: '#1F2937',
      sidebar: '#0F172A',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      border: '#374151'
    },
    purple: {
      accent: '#A78BFA',
      accentLight: '#4C1D95',
      bg: '#111827',
      card: '#1F2937',
      sidebar: '#0F172A',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      border: '#374151'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('wealthguard-theme');
    return savedTheme || 'light';
  });

  const [colorScheme, setColorScheme] = useState(() => {
    const savedColorScheme = localStorage.getItem('wealthguard-colorScheme');
    return savedColorScheme || 'blue';
  });

  const [textSize, setTextSize] = useState(() => {
    const savedTextSize = localStorage.getItem('wealthguard-textSize');
    return savedTextSize ? parseInt(savedTextSize) : 2;
  });

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('wealthguard-theme', newTheme);
  };

  const changeColorScheme = (newColorScheme) => {
    setColorScheme(newColorScheme);
    localStorage.setItem('wealthguard-colorScheme', newColorScheme);
  };

  const changeTextSize = (newSize) => {
    setTextSize(newSize);
    localStorage.setItem('wealthguard-textSize', newSize.toString());
  };

  useEffect(() => {
    const applyThemeColors = () => {
      const root = document.documentElement;
      const currentTheme = themeColors[theme][colorScheme];

      root.style.setProperty('--theme-accent', currentTheme.accent);
      root.style.setProperty('--theme-accent-light', currentTheme.accentLight);
      root.style.setProperty('--theme-bg', currentTheme.bg);
      root.style.setProperty('--theme-card', currentTheme.card);
      root.style.setProperty('--theme-sidebar', currentTheme.sidebar);
      root.style.setProperty('--theme-text', currentTheme.text);
      root.style.setProperty('--theme-text-secondary', currentTheme.textSecondary);
      root.style.setProperty('--theme-border', currentTheme.border);
    };

    const createGlobalStyles = () => {
      if (!document.getElementById('theme-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'theme-styles';
        styleEl.innerHTML = `
          body,
          .bg-theme-bg,
          .bg-card,
          .bg-sidebar,
          .text-theme,
          .text-theme-secondary,
          .border-theme {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
          }
          .theme-accent-light { background-color: var(--theme-accent-light); }
          .accent-bg { background-color: var(--theme-accent); }
          .bg-theme-bg { background-color: var(--theme-bg); }
          .bg-card { background-color: var(--theme-card); }
          .bg-sidebar { background-color: var(--theme-sidebar); }
          .text-theme-accent { color: var(--theme-accent); }
          .text-theme { color: var(--theme-text); }
          .text-theme-secondary { color: var(--theme-text-secondary); }
          .border-theme-accent { border-color: var(--theme-accent); }
          .border-theme { border-color: var(--theme-border); }
          .text-size-small { font-size: 0.85rem; }
          .text-size-medium { font-size: 1rem; }
          .text-size-large { font-size: 1.15rem; }
        `;
        document.head.appendChild(styleEl);
      }
    };

    const applyAllThemeSettings = () => {
      applyThemeColors();
      createGlobalStyles();
    };

    const timeoutId = setTimeout(applyAllThemeSettings, 10);
    return () => clearTimeout(timeoutId);
  }, [theme, colorScheme, textSize]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      changeTheme, 
      colorScheme, 
      changeColorScheme,
      textSize,
      changeTextSize
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
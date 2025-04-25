import { useEffect } from 'react';
import { useTheme } from '../pages/theme';
import { useLanguage } from '../pages/language';

const useThemeAndLanguageInit = () => {
  const { theme, changeTheme, colorScheme, changeColorScheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  

  useEffect(() => {
    const savedTheme = localStorage.getItem('wealthguard-theme');
    const savedColorScheme = localStorage.getItem('wealthguard-colorScheme');
    
    if (savedTheme && savedTheme !== theme) {
      changeTheme(savedTheme);
    }
    
    if (savedColorScheme && savedColorScheme !== colorScheme) {
      changeColorScheme(savedColorScheme);
    }
    

    applyThemeColors(savedTheme || theme, savedColorScheme || colorScheme);
  }, []);
  

  useEffect(() => {
    const savedLanguage = localStorage.getItem('wealthguard-language');
    if (savedLanguage && savedLanguage !== language) {
      changeLanguage(savedLanguage);
    }
  }, []);
  

  useEffect(() => {
    const savedTextSize = localStorage.getItem('wealthguard-textSize');
    if (savedTextSize) {
      const parsedSize = parseInt(savedTextSize);
      
      document.documentElement.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
      
      const sizeClass = parsedSize === 1 ? 'text-size-small' : parsedSize === 2 ? 'text-size-medium' : 'text-size-large';
      document.documentElement.classList.add(sizeClass);
    }
  }, []);
};

const applyThemeColors = (theme, colorScheme) => {
  const themeColors = {
    light: {
      blue: {
        accent: '#3B82F6', // blue
        accentLight: '#EFF6FF',
        bg: '#F9FAFB',
        card: '#FFFFFF',
        sidebar: '#FFFFFF',
        text: '#1F2937',
        textSecondary: '#6B7280',
        border: '#E5E7EB'
      },
      purple: {
        accent: '#8B5CF6', // purple
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
        accent: '#60A5FA', // blue
        accentLight: '#1E3A8A',
        bg: '#111827',
        card: '#1F2937',
        sidebar: '#0F172A',
        text: '#F9FAFB',
        textSecondary: '#D1D5DB',
        border: '#374151'
      },
      purple: {
        accent: '#A78BFA', // purple
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
  
  document.documentElement.className = document.documentElement.className
    .replace(/theme-\w+/g, '')
    .replace(/color-\w+/g, '')
    .trim() + ` theme-${theme} color-${colorScheme}`;
  
  if (!document.getElementById('theme-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'theme-styles';
    styleEl.innerHTML = `
      /* Add transitions to prevent flickering */
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
      
      /* Text size classes */
      .text-size-small {
        font-size: 0.85rem;
      }
      .text-size-medium {
        font-size: 1rem;
      }
      .text-size-large {
        font-size: 1.15rem;
      }
    `;
    document.head.appendChild(styleEl);
  }
};

export default useThemeAndLanguageInit;
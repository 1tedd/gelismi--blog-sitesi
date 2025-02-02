import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    const transition = () => {
      root.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    if (isDark) {
      transition();
    } else {
      transition();
    }
  }, [isDark]);

  const toggleTheme = (position: { x: number; y: number }) => {
    const root = document.documentElement;
    const w = Math.max(position.x, window.innerWidth - position.x);
    const h = Math.max(position.y, window.innerHeight - position.y);
    const maxRadius = Math.sqrt(w * w + h * h);

    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    ripple.style.left = `${position.x}px`;
    ripple.style.top = `${position.y}px`;
    ripple.style.backgroundColor = isDark ? '#ffffff' : '#1a1a1a';
    
    document.body.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.transform = `scale(${maxRadius})`;
    });

    setTimeout(() => {
      setIsDark(!isDark);
      ripple.remove();
    }, 1000);
  };

  return { isDark, toggleTheme };
}
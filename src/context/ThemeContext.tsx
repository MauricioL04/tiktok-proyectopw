// src/context/ThemeContext.tsx
import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react'; // <-- Se importa como un tipo
type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Creamos el contexto con un valor por defecto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Creamos el "Proveedor" que envolverá nuestra aplicación
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark'); // 'dark' es el tema inicial

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Este efecto aplica el tema al elemento raíz del HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Creamos un "hook" personalizado para usar el contexto fácilmente
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
'use client';

import { ThemeOptions } from '@mui/material/styles';
import { createTheme } from "@mui/material/styles";

import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});


export const themeOptions: ThemeOptions = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#ed6c02',
    },
    error: {
      main: '#dc2626',
    },
    info: {
      main: '#4f46e5',
    },
    success: {
      main: '#22c55e'
    }
  },
  typography: {
    fontFamily: 'var(--font-inter)',
    h1: {
      fontSize: '2.9rem',
    },
    fontSize: 16,
    h2: {
      fontSize: '2.4rem',
    },
    h3: {
      fontSize: '1.8rem',
    },
    h4: {
      fontSize: '1.5rem',
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600
    },
    h6: {
      fontSize: '0.9rem',
    },
    subtitle1: {
      fontSize: '0.9rem',
    },
    subtitle2: {
      fontSize: '0.8rem',
    },
    body1: {
      fontSize: '0.9rem',
    },
    body2: {
      fontSize: '0.8rem',
    },
    button: {
      fontSize: '0.9rem',
    },
    caption: {
      fontSize: '0.8rem',
    },
    overline: {
      fontSize: '0.7rem',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 0px 0px',
          border: '2px solid #e5e7eb',
          borderRadius: '0.75rem',
        },
      },
    }
  }
});
'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import EmotionRegistry from './registry';

/**
 * Professional Enterprise Theme
 * Inspired by Stripe/Vercel/Atlassian - clean, subtle, production-ready
 * 
 * Theme Refinements:
 * - Typography: Improved scale with better line-heights for readability
 * - Spacing: Consistent 8px base unit throughout
 * - Colors: Subtle off-white background for reduced eye strain
 * - Shadows: Refined for depth without heaviness
 * - Borders: Consistent radius for modern, cohesive feel
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      // Subtle off-white reduces eye strain vs pure white, creates depth
      default: '#f7f9fc',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
    // Softer divider for less visual noise
    divider: 'rgba(0, 0, 0, 0.06)',
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
    ].join(','),
    // H1: Large page titles - increased line-height for breathing room
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    },
    // H2: Section headers - balanced weight and spacing
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
    },
    // H3: Subsection headers
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
    },
    // H4: Page titles - most common heading, optimized for readability
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.45,
      letterSpacing: '-0.01em',
    },
    // H5: Card titles and smaller headers
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    // H6: Small headers, table headers
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    // Body1: Primary body text - increased line-height for better readability
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.7, // Increased from default 1.5 for better readability
    },
    // Body2: Secondary text, captions in components
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6, // Increased for better readability
    },
    // Button: No text transform, professional weight
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    // Caption: Small helper text
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: 'rgba(0, 0, 0, 0.6)',
    },
    // Overline: Labels, tags
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
  },
  // Consistent border radius - 8px base for modern, cohesive feel
  shape: {
    borderRadius: 8,
  },
  // Refined shadows - subtle depth without heaviness
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.04)',
    '0px 2px 4px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.04)',
    '0px 3px 6px rgba(0, 0, 0, 0.06), 0px 2px 4px rgba(0, 0, 0, 0.04)',
    '0px 4px 8px rgba(0, 0, 0, 0.06), 0px 2px 4px rgba(0, 0, 0, 0.04)',
    '0px 6px 12px rgba(0, 0, 0, 0.07), 0px 3px 6px rgba(0, 0, 0, 0.05)',
    '0px 8px 16px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.05)',
    '0px 12px 24px rgba(0, 0, 0, 0.09), 0px 6px 12px rgba(0, 0, 0, 0.06)',
    '0px 16px 32px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.06)',
    '0px 20px 40px rgba(0, 0, 0, 0.11), 0px 10px 20px rgba(0, 0, 0, 0.07)',
    '0px 24px 48px rgba(0, 0, 0, 0.12), 0px 12px 24px rgba(0, 0, 0, 0.08)',
    '0px 28px 56px rgba(0, 0, 0, 0.13), 0px 14px 28px rgba(0, 0, 0, 0.09)',
    '0px 32px 64px rgba(0, 0, 0, 0.14), 0px 16px 32px rgba(0, 0, 0, 0.1)',
    '0px 36px 72px rgba(0, 0, 0, 0.15), 0px 18px 36px rgba(0, 0, 0, 0.11)',
    '0px 40px 80px rgba(0, 0, 0, 0.16), 0px 20px 40px rgba(0, 0, 0, 0.12)',
    '0px 44px 88px rgba(0, 0, 0, 0.17), 0px 22px 44px rgba(0, 0, 0, 0.13)',
    '0px 48px 96px rgba(0, 0, 0, 0.18), 0px 24px 48px rgba(0, 0, 0, 0.14)',
    '0px 52px 104px rgba(0, 0, 0, 0.19), 0px 26px 52px rgba(0, 0, 0, 0.15)',
    '0px 56px 112px rgba(0, 0, 0, 0.2), 0px 28px 56px rgba(0, 0, 0, 0.16)',
    '0px 60px 120px rgba(0, 0, 0, 0.21), 0px 30px 60px rgba(0, 0, 0, 0.17)',
    '0px 64px 128px rgba(0, 0, 0, 0.22), 0px 32px 64px rgba(0, 0, 0, 0.18)',
    '0px 68px 136px rgba(0, 0, 0, 0.23), 0px 34px 68px rgba(0, 0, 0, 0.19)',
    '0px 72px 144px rgba(0, 0, 0, 0.24), 0px 36px 72px rgba(0, 0, 0, 0.2)',
    '0px 76px 152px rgba(0, 0, 0, 0.25), 0px 38px 76px rgba(0, 0, 0, 0.21)',
  ] as any,
  spacing: 8, // Base spacing unit - consistent 8px grid
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Consistent with theme shape
          padding: '8px 16px',
          fontSize: '0.875rem',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 1px 2px rgba(0, 0, 0, 0.04)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Slightly larger for cards (1.5x base)
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 1px 2px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.07), 0px 3px 6px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // Consistent with theme
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)', // Softer divider
          padding: '16px',
        },
        head: {
          fontWeight: 600, // Professional weight for headers
          fontSize: '0.875rem',
          color: 'rgba(0, 0, 0, 0.87)',
          backgroundColor: 'rgba(0, 0, 0, 0.02)', // Subtle header background
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6, // Slightly smaller for chips (0.75x base)
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Consistent base radius
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.06)', // Softer, less intrusive
        },
      },
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <EmotionRegistry>
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </SessionProvider>
    </EmotionRegistry>
  );
}

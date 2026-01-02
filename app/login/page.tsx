'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated (using useEffect to avoid render-time navigation)
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      // Use NextAuth for authentication
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.ok) {
        // Store token in Zustand state (as required)
        // NextAuth session will be available via useSession hook
        // But we also store in Zustand for easy access
        const response = await fetch('https://dummyjson.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const userData = await response.json();
          setAuth(userData, userData.token);
          router.push('/dashboard');
        } else {
          setError('Login failed');
          setLoading(false);
        }
      } else {
        setError(result?.error || 'Invalid credentials');
        setLoading(false);
      }
    },
    [username, password, setAuth, router]
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 3,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 1,
              }}
            >
              Admin Login
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sign in to access the admin dashboard
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              autoFocus
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 2,
                fontWeight: 600,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          {/* Footer */}
          <Typography
            variant="caption"
            display="block"
            align="center"
            sx={{
              mt: 3,
              color: 'text.secondary',
            }}
          >
            Use any valid DummyJSON credentials
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

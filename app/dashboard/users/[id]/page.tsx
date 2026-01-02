'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useUsersStore, User } from '@/store/usersStore';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const getUserById = useUsersStore((state) => state.getUserById);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!params.id) return;

      setLoading(true);
      setError(null);
      const userId = parseInt(params.id as string);
      const userData = await getUserById(userId);

      if (userData) {
        setUser(userData);
      } else {
        setError('User not found');
      }
      setLoading(false);
    };

    fetchUser();
  }, [params.id, getUserById]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard/users')}
          sx={{ mb: 3 }}
        >
          Back to Users
        </Button>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error || 'User not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Back Navigation */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/dashboard/users')}
        sx={{
          mb: 4,
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateX(-2px)',
          },
        }}
      >
        Back to Users
      </Button>

      <Paper sx={{ p: 5, borderRadius: 2 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 5 }}>
          <Avatar
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            sx={{ width: 120, height: 120, border: '3px solid', borderColor: 'divider' }}
          />
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              {user.firstName} {user.lastName}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 1.5,
                fontWeight: 500,
              }}
            >
              @{user.username}
            </Typography>
            <Chip
              label={user.gender}
              color={user.gender === 'male' ? 'primary' : 'secondary'}
              sx={{
                fontWeight: 500,
                height: 28,
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Information Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {/* Contact Information */}
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 2.5,
                  fontSize: '1.125rem',
                }}
              >
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.email}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Phone
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.phone}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Birth Date
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.birthDate}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Age
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.age} years
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Address */}
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 2.5,
                  fontSize: '1.125rem',
                }}
              >
                Address
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.7 }}>
                {user.address.address}
                <br />
                {user.address.city}, {user.address.state} {user.address.postalCode}
              </Typography>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 2.5,
                  fontSize: '1.125rem',
                }}
              >
                Company Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Company
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.company?.name || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Department
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.company?.department || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Title
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.company?.title || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Physical Attributes */}
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 2.5,
                  fontSize: '1.125rem',
                }}
              >
                Physical Attributes
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Height
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.height} cm
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Weight
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.weight} kg
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Eye Color
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.eyeColor}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Hair
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.hair.color} ({user.hair.type})
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 2.5,
                  fontSize: '1.125rem',
                }}
              >
                Additional Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    University
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.university}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Blood Group
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.bloodGroup}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Domain
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.domain}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}>
                    IP Address
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
                    {user.ip}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    </Box>
  );
}

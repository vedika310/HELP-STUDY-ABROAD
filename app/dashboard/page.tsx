'use client';

import { Box, Typography, Card, CardContent, CardActionArea } from '@mui/material';
import { People as PeopleIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 5 }}>
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
          Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: '600px',
            mb: 0.5,
          }}
        >
          Welcome to the admin dashboard. Manage users and products from here.
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
          }}
        >
          Select a section below to get started
        </Typography>
      </Box>

      {/* Action Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' },
          gap: 3,
        }}
      >
        {/* Users Card */}
        <Card
          component={Link}
          href="/dashboard/users"
          sx={{
            textDecoration: 'none',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          <CardActionArea sx={{ flex: 1, p: 0 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2.5,
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 30, color: 'primary.contrastText' }} />
                </Box>
                <Box sx={{ flex: 1, pt: 0.5 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    Users
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    View and manage user accounts, search and filter users, and access detailed user information.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

        {/* Products Card */}
        <Card
          component={Link}
          href="/dashboard/products"
          sx={{
            textDecoration: 'none',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          <CardActionArea sx={{ flex: 1, p: 0 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2.5,
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: 30, color: 'primary.contrastText' }} />
                </Box>
                <Box sx={{ flex: 1, pt: 0.5 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    Products
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    Browse and manage product catalog, filter by category, and view detailed product information.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Box>
  );
}

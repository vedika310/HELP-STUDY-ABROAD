'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

const drawerWidth = 256;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, path: '/dashboard/users' },
    { text: 'Products', icon: <ShoppingCartIcon />, path: '/dashboard/products' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Toolbar
          sx={{
            px: 3,
            minHeight: '72px !important',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '1.125rem',
            }}
          >
            Help Study Abroad
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                transition: 'background-color 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Avatar
                src={user?.image}
                alt={`${user?.firstName} ${user?.lastName}`}
                sx={{
                  width: 36,
                  height: 36,
                  border: '2px solid',
                  borderColor: 'divider',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  display: { xs: 'none', md: 'block' },
                }}
              >
                {user?.firstName} {user?.lastName}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={handleLogout}
              startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderColor: 'divider',
                color: 'text.secondary',
                px: 2,
                py: 0.75,
                fontWeight: 500,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  backgroundColor: 'transparent',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            },
          }}
          open
        >
          <Toolbar
            sx={{
              minHeight: '72px !important',
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.125rem' }}>
              Admin
            </Typography>
          </Toolbar>
          <Box sx={{ overflow: 'auto', py: 1.5 }}>
            <List sx={{ px: 1.5 }}>
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.75 }}>
                    <ListItemButton
                      component={Link}
                      href={item.path}
                      selected={isActive}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        px: 2.5,
                        minHeight: 48,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                          '& .MuiListItemIcon-root': {
                            color: 'primary.contrastText',
                          },
                        },
                        '&:hover': {
                          backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                          transform: 'translateX(2px)',
                        },
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 44,
                          color: isActive ? 'primary.contrastText' : 'text.secondary',
                          transition: 'color 0.2s ease-in-out',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: isActive ? 600 : 500,
                          fontSize: '0.9375rem',
                          letterSpacing: '-0.01em',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}

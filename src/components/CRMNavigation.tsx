'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Dashboard,
  People,
  Analytics,
  Home,
  Menu,
  Close
} from '@mui/icons-material';

export default function CRMNavigation() {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isCRM = pathname?.startsWith('/leads') || pathname?.startsWith('/analytics') || pathname?.startsWith('/customers');

  if (!isCRM) {
    return null;
  }

  const navigationItems = [
    { href: '/', label: 'Home', icon: <Home sx={{ color: 'inherit' }} /> },
    { href: '/leads', label: 'Leads', icon: <People sx={{ color: 'inherit' }} /> },
    { href: '/customers', label: 'Customers', icon: <People sx={{ color: 'inherit' }} /> },
    { href: '/analytics', label: 'Analytics', icon: <Analytics sx={{ color: 'inherit' }} /> },
  ];

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  // Mobile Drawer Content
  const drawerContent = (
    <Box sx={{ width: 280, p: 2, bgcolor: 'white', color: '#1f2937' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Dashboard sx={{ color: '#3b82f6' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
            AberCLM
          </Typography>
        </Box>
        <IconButton onClick={toggleDrawer(false)} sx={{ color: '#1f2937' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Navigation Links */}
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.href}
            component={Link}
            href={item.href}
            onClick={toggleDrawer(false)}
            sx={{
              borderRadius: 1,
              mb: 1,
              backgroundColor: pathname === item.href ? '#dbeafe' : 'transparent',
              color: pathname === item.href ? '#1d4ed8' : '#1f2937',
              '&:hover': {
                backgroundColor: '#f3f4f6',
                color: '#1f2937'
              },
              textDecoration: 'none'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {item.icon}
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: pathname === item.href ? 600 : 400,
                    color: 'inherit'
                  }
                }}
              />
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Add Lead Button */}
      <Button
        variant="contained"
        fullWidth
        component={Link}
        href="/leads"
        sx={{
          mt: 2,
          textTransform: 'none',
          backgroundColor: '#3b82f6',
          color: 'white',
          '&:hover': {
            backgroundColor: '#2563eb',
          }
        }}
      >
        Add Lead
      </Button>
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: '#1f2937',
        borderBottom: 1,
        borderColor: '#e5e7eb',
        boxShadow: 'none'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{
          px: { xs: 1, sm: 2, md: 0 },
          py: 1,
          color: '#1f2937'
        }}>
          {/* Logo/Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Dashboard sx={{ color: '#3b82f6' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#1f2937',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              AberCLM
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#1f2937',
                display: { xs: 'block', sm: 'none' }
              }}
            >
              AberCLM
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <Box sx={{ display: 'flex', gap: 1, mx: 2 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    startIcon={item.icon}
                    sx={{
                      textTransform: 'none',
                      color: pathname === item.href ? '#1d4ed8' : '#1f2937',
                      fontWeight: pathname === item.href ? 600 : 400,
                      '&:hover': {
                        backgroundColor: '#f3f4f6',
                        color: '#1f2937'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              {/* Desktop Actions */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  component={Link}
                  href="/leads"
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                    }
                  }}
                >
                  Add Lead
                </Button>
              </Box>
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={toggleDrawer(true)}
              sx={{
                color: '#1f2937'
              }}
            >
              <Menu />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'white',
            color: '#1f2937'
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}

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
    { href: '/', label: 'Home', icon: <Home /> },
    { href: '/leads', label: 'Leads', icon: <People /> },
    { href: '/customers', label: 'Customers', icon: <People /> },
    { href: '/analytics', label: 'Analytics', icon: <Analytics /> },
  ];

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  // Mobile Drawer Content
  const drawerContent = (
    <Box sx={{ width: 280, p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Dashboard sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            AberCLM
          </Typography>
        </Box>
        <IconButton onClick={toggleDrawer(false)}>
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
              backgroundColor: pathname === item.href ? 'primary.light' : 'transparent',
              color: pathname === item.href ? 'primary.main' : 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {item.icon}
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: pathname === item.href ? 600 : 400,
                  }
                }}
              />
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Add Lead Button */}
      <Button
        variant="outlined"
        fullWidth
        component={Link}
        href="/leads"
        sx={{
          mt: 2,
          textTransform: 'none',
          borderColor: 'primary.main',
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.main',
            color: 'white'
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
      color="default"
      elevation={1}
      sx={{
        backgroundColor: 'white',
        borderBottom: 1,
        borderColor: 'grey.200'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 1, sm: 2, md: 0 }, py: 1 }}>
          {/* Logo/Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Dashboard color="primary" />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              AberCLM
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
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
                      color: pathname === item.href ? 'primary.main' : 'text.secondary',
                      fontWeight: pathname === item.href ? 600 : 400,
                      '&:hover': {
                        backgroundColor: 'action.hover'
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
                  variant="outlined"
                  component={Link}
                  href="/leads"
                  sx={{
                    textTransform: 'none',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white'
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
                color: 'text.primary'
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
            backgroundColor: 'background.paper',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}

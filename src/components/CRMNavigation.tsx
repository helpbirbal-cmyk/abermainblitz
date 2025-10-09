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
  useTheme,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Dashboard,
  People,
  Analytics,
  Home,
  Menu,
  Close,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { useTheme as useNextTheme } from 'next-themes';

export default function CRMNavigation() {
  const pathname = usePathname();
  const muiTheme = useTheme();
  const { theme, setTheme } = useNextTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Mobile Drawer Content
  const drawerContent = (
    <Box sx={{ width: 280, p: 2, height: '100%', bgcolor: 'background.paper' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Dashboard sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            AberCXO
          </Typography>
        </Box>
        <IconButton onClick={toggleDrawer(false)} sx={{ color: 'text.primary' }}>
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
              backgroundColor: pathname === item.href ? 'primary.main' : 'transparent',
              color: pathname === item.href ? 'primary.contrastText' : 'text.primary',
              '&:hover': {
                backgroundColor: pathname === item.href ? 'primary.dark' : 'action.hover',
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

      {/* Theme Toggle in Mobile */}
      <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={theme === 'dark'}
              onChange={toggleTheme}
              icon={<Brightness7 />}
              checkedIcon={<Brightness4 />}
            />
          }
          label={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          sx={{ color: 'text.primary' }}
        />
      </Box>

      {/* Add Lead Button */}
      <Button
        variant="contained"
        fullWidth
        component={Link}
        href="/leads"
        sx={{
          mt: 2,
          textTransform: 'none',
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark'
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
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
        boxShadow: 'none'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 1, sm: 2, md: 0 }, py: 1 }}>
          {/* Logo/Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Dashboard sx={{ color: 'primary.main' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              AberCXO CRM
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                display: { xs: 'block', sm: 'none' }
              }}
            >
              AberCXO
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
                      color: pathname === item.href ? 'primary.contrastText' : 'text.primary',
                      backgroundColor: pathname === item.href ? 'primary.main' : 'transparent',
                      fontWeight: pathname === item.href ? 600 : 400,
                      '&:hover': {
                        backgroundColor: pathname === item.href ? 'primary.dark' : 'action.hover',
                        color: pathname === item.href ? 'primary.contrastText' : 'text.primary'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              {/* Desktop Actions */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {/* Theme Toggle */}
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>

                <Button
                  variant="contained"
                  component={Link}
                  href="/leads"
                  sx={{
                    textTransform: 'none',
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark'
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {/* Theme Toggle for Mobile */}
              <IconButton
                onClick={toggleTheme}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>

              <IconButton
                onClick={toggleDrawer(true)}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <Menu />
              </IconButton>
            </Box>
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
            color: 'text.primary',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}

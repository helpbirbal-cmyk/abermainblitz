'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard,
  People,
  Analytics,
  Home,
  AccountCircle,
  Logout,
  Menu as MenuIcon
} from '@mui/icons-material';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

interface User {
  email: string;
}

export default function CRMNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({ email: user.email! });
      }
    };
    getUser();
  }, []);

  const isCRM = pathname?.startsWith('/leads') || pathname?.startsWith('/analytics') || pathname?.startsWith('/customers');

  if (!isCRM) {
    return null;
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    handleClose();
    setMobileDrawerOpen(false);
    router.push('/');
    router.refresh();
  };

  const toggleDrawer = (open: boolean) => () => {
    setMobileDrawerOpen(open);
  };

  const navigationItems = [
    { href: '/leads', icon: <People />, label: 'Leads' },
    { href: '/customers', icon: <People />, label: 'Customers' },
    { href: '/analytics', icon: <Analytics />, label: 'Analytics' },
  ];

  // Mobile drawer content
  const drawerContent = (
    <Box sx={{ width: 280 }} role="presentation" onClick={toggleDrawer(false)}>
      {/* Brand Section */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Dashboard color="primary" />
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          AberCRM
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Items */}
      <List sx={{ py: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={pathname.startsWith(item.href)}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.dark',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon sx={{
                color: pathname.startsWith(item.href) ? 'primary.main' : 'inherit',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* User Section */}
      {user ? (
        <List sx={{ py: 1 }}>
          <ListItem disablePadding>
            <ListItemButton disabled sx={{ mx: 1, borderRadius: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText
                primary={user.email}
                primaryTypographyProps={{
                  sx: {
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{ mx: 1, borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <Box sx={{ p: 2 }}>
          <Button
            component={Link}
            href="/auth/login"
            variant="outlined"
            fullWidth
            sx={{ textTransform: 'none' }}
          >
            Login
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo/Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Dashboard color="primary" />
            <Typography
              variant="h6"
              fontWeight="bold"
              color="text.primary"
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              AberCRM
            </Typography>
          </Box>

          {/* Desktop Navigation Links - Hidden on mobile */}
          {!isMobile && (
            <Box sx={{ ml: 4, display: 'flex', gap: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  startIcon={item.icon}
                  color={pathname.startsWith(item.href) ? 'primary' : 'inherit'}
                  sx={{
                    textTransform: 'none',
                    fontWeight: pathname.startsWith(item.href) ? 600 : 400
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* User Menu */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                {/* User email - hidden on mobile */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: { xs: 'none', md: 'block' } }}
                >
                  {user.email}
                </Typography>

                <IconButton
                  onClick={handleMenu}
                  size="small"
                  sx={{ ml: 1 }}
                  aria-haspopup="true"
                >
                  <Avatar sx={{
                    width: { xs: 28, md: 32 },
                    height: { xs: 28, md: 32 },
                    bgcolor: 'primary.main',
                    fontSize: { xs: '0.8rem', md: '1rem' }
                  }}>
                    {user.email?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem disabled>
                    <AccountCircle sx={{ mr: 1 }} />
                    {user.email}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                href="/auth/login"
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}

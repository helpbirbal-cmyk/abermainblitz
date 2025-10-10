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
  IconButton
} from '@mui/material';
import {
  Dashboard,
  People,
  Analytics,
  Home,
  AccountCircle,
  Logout
} from '@mui/icons-material';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

interface User {
  email: string;
}

export default function CRMNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
    router.push('/');
    router.refresh();
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 2, md: 0 } }}>
          {/* Logo/Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Dashboard color="primary" />
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              AberCRM
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ ml: 4, display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              href="/leads"
              startIcon={<People />}
              color={pathname.startsWith('/leads') ? 'primary' : 'inherit'}
              sx={{ textTransform: 'none' }}
            >
              Leads
            </Button>
            <Button
              component={Link}
              href="/customers"
              startIcon={<People />}
              color={pathname.startsWith('/customers') ? 'primary' : 'inherit'}
              sx={{ textTransform: 'none' }}
            >
              Customers
            </Button>
            <Button
              component={Link}
              href="/analytics"
              startIcon={<Analytics />}
              color={pathname.startsWith('/analytics') ? 'primary' : 'inherit'}
              sx={{ textTransform: 'none' }}
            >
              Analytics
            </Button>
          </Box>

          {/* User Menu */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <IconButton
                  onClick={handleMenu}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-haspopup="true"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {user.email?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
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
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

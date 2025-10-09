'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import {
  Dashboard,
  People,
  Analytics,
  Home
} from '@mui/icons-material';


export default function CRMNavigation() {
  const pathname = usePathname();
  const isCRM = pathname?.startsWith('/leads') || pathname?.startsWith('/analytics');

  if (!isCRM) {
    return null; // Don't show CRM nav on other pages
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: 1,
        borderBottom: 1,
        borderColor: 'grey.200'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 2, md: 0 } }}>
          {/* Logo/Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Dashboard sx={{ color: 'primary.main' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary'
              }}
            >
              LeadCRM
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ ml: 4, display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              href="/"
              startIcon={<Home />}
              sx={{
                textTransform: 'none',
                color: pathname === '/' ? 'primary.main' : 'text.secondary',
                fontWeight: pathname === '/' ? 600 : 400,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              href="/leads"
              startIcon={<People />}
              sx={{
                textTransform: 'none',
                color: pathname.startsWith('/leads') ? 'primary.main' : 'text.secondary',
                fontWeight: pathname.startsWith('/leads') ? 600 : 400,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              Leads
            </Button>
            <Button
              component={Link}
              href="/analytics"
              startIcon={<Analytics />}
              sx={{
                textTransform: 'none',
                color: pathname.startsWith('/analytics') ? 'primary.main' : 'text.secondary',
                fontWeight: pathname.startsWith('/analytics') ? 600 : 400,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              Analytics
            </Button>
            <Button
  component={Link}
  href="/customers"
  className={`normal-case ${pathname.startsWith('/customers') ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
  //startIcon={<PeopleIcon />}
>
  Customers
</Button>
          </Box>

          {/* Optional: User menu or actions */}
          <Box sx={{ ml: 'auto' }}>
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
        </Toolbar>
      </Container>
    </AppBar>
  );
}

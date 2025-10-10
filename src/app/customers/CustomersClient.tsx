'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Container,
  Paper,
  Avatar,
  Stack,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarTodayIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  status: string;
  customer_type: string;
  created_at?: string;
  contacts_count?: number;
}

interface CustomersClientProps {
  customers: Customer[];
}

export function CustomersClient({ customers }: CustomersClientProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');

  // Filter customers based on search and filters
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.projectType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesTimeline = timelineFilter === 'all' || customer.timeline === timelineFilter;

      return matchesSearch && matchesStatus && matchesTimeline;
    });
  }, [customers, searchTerm, statusFilter, timelineFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'default';
      case 'Contacted': return 'primary';
      case 'Qualified': return 'secondary';
      case 'Customer': return 'success';
      default: return 'default';
    }
  };

  const getTimelineColor = (timeline: string) => {
    switch (timeline?.toLowerCase()) {
      case 'urgent': return 'error';
      case 'soon': return 'warning';
      case 'flexible': return 'success';
      default: return 'default';
    }
  };

  const getProjectTypeColor = (projectType: string) => {
    switch (projectType?.toLowerCase()) {
      case 'web development': return 'primary';
      case 'mobile app': return 'secondary';
      case 'e-commerce': return 'success';
      case 'consulting': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          gutterBottom
          color="text.primary"
        >
          AberCRM Customers
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Total {customers.length} customers • Showing {filteredCustomers.length}
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Card
        sx={{
          mb: 4,
          p: 3,
          backgroundColor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search by name, email, company, project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.background.default,
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Timeline</InputLabel>
              <Select
                value={timelineFilter}
                label="Timeline"
                onChange={(e) => setTimelineFilter(e.target.value)}
              >
                <MenuItem value="all">All Timelines</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
                <MenuItem value="soon">Soon</MenuItem>
                <MenuItem value="flexible">Flexible</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Add Customer Button */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: 'none',
            borderRadius: 2
          }}
        >
          Add New Customer
        </Button>
      </Box>

      {/* Customers Grid */}
      <Grid container spacing={3}>
        {filteredCustomers.map((customer) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={customer.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                backgroundColor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-4px)',
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header with Avatar and Name */}
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40,
                        fontWeight: 'bold'
                      }}
                    >
                      {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="600" color="text.primary">
                        {customer.name || 'No Name'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.company || 'No Company'}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack spacing={0.5} alignItems="flex-end">
                    <Chip
                      label={customer.status || 'New'}
                      color={getStatusColor(customer.status)}
                      size="small"
                    />
                    <Chip
                      label={customer.timeline || 'No timeline'}
                      color={getTimelineColor(customer.timeline)}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Box>

                {/* Contact Info */}
                <Stack spacing={1.5} mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ flex: 1 }}
                    >
                      {customer.email}
                    </Typography>
                  </Box>

                  {customer.projectType && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {customer.projectType}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                {/* Project Details */}
                <Box mb={2}>
                  <Chip
                    label={customer.projectType || 'No project type'}
                    color={getProjectTypeColor(customer.projectType)}
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />

                  {customer.source && (
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        Source: {customer.source}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Message Preview */}
                {customer.message && (
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'action.hover',
                      mb: 2,
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Box display="flex" alignItems="flex-start" gap={1}>
                      <DescriptionIcon fontSize="small" color="action" sx={{ mt: 0.25 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {customer.message}
                      </Typography>
                    </Box>
                  </Paper>
                )}

                {/* Footer with Date and Action */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  pt={2}
                  sx={{
                    borderTop: 1,
                    borderColor: 'divider',
                    mt: 'auto'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'No date'}
                    </Typography>
                  </Box>
                  <Button
      variant="outlined"
      size="small"
      startIcon={<VisibilityIcon />}
      href={`/customers/${customer.id}`}  // This should now work
      sx={{
        textTransform: 'none',
        borderColor: 'primary.main',
        color: 'primary.main',
        '&:hover': {
          backgroundColor: 'primary.main',
          color: 'primary.contrastText'
        }
      }}
    >
      View Details
    </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <Paper
          sx={{
            p: 12,
            textAlign: 'center',
            backgroundColor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No customers found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || statusFilter !== 'all' || timelineFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Customers will appear here.'}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

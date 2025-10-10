'use client';

import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Container,
  Paper,
  Avatar,
  Stack,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Email as EmailIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarTodayIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Group as GroupIcon,
  Work as WorkIcon
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
  created_at: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  created_at: string;
}

interface CustomerDetailClientProps {
  customer: Customer;
  contacts: Contact[];
}

export function CustomerDetailClient({ customer, contacts }: CustomerDetailClientProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'prospect': return 'warning';
      case 'lead': return 'info';
      default: return 'default';
    }
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'enterprise': return 'primary';
      case 'sme': return 'secondary';
      case 'startup': return 'success';
      case 'individual': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Back Button */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/customers')}
          sx={{ mb: 3 }}
        >
          Back to All Customers
        </Button>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
              {customer.name?.charAt(0)?.toUpperCase() || 'C'}
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {customer.name || 'No Name'}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {customer.company || 'No Company'}
              </Typography>
            </Box>
          </Box>
          <Stack spacing={1} alignItems="flex-end">
            <Chip
              label={customer.status || 'Active'}
              color={getStatusColor(customer.status)}
              sx={{
                fontSize: '0.875rem',
                '& .MuiChip-label': {
                  fontWeight: 600
                }
              }}
            />
            <Chip
              label={customer.customer_type || 'SME'}
              color={getCustomerTypeColor(customer.customer_type)}
              variant="outlined"
              sx={{
                fontSize: '0.875rem',
                '& .MuiChip-label': {
                  fontWeight: 600
                }
              }}
            />
          </Stack>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Customer Information */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Contact Information Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                Customer Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {customer.email || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <PhoneIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {customer.phone || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <BusinessIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Company</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {customer.company || 'Not specified'}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <WorkIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Industry</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {customer.industry || 'Not specified'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Contacts Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupIcon />
                Contacts ({contacts.length})
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {contacts.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No contacts added yet.
                </Typography>
              ) : (
                <List>
                  {contacts.map((contact) => (
                    <ListItem key={contact.id} divider>
                      <ListItemIcon>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}>
                          {contact.name?.charAt(0)?.toUpperCase() || 'C'}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="h6" component="span">
                              {contact.name}
                            </Typography>
                            {contact.position && (
                              <Chip
                                label={contact.position}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Stack spacing={0.5} sx={{ mt: 1 }}>
                            {contact.email && (
                              <Box display="flex" alignItems="center" gap={1}>
                                <EmailIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {contact.email}
                                </Typography>
                              </Box>
                            )}
                            {contact.phone && (
                              <Box display="flex" alignItems="center" gap={1}>
                                <PhoneIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {contact.phone}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Meta Information & Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Timeline Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon />
                Timeline
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {new Date(customer.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Customer Details Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon />
                Customer Details
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Customer Type
                  </Typography>
                  <Chip
                    label={customer.customer_type || 'Not specified'}
                    color={getCustomerTypeColor(customer.customer_type)}
                    size="small"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Industry
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {customer.industry || 'Not specified'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={customer.status || 'Active'}
                    color={getStatusColor(customer.status)}
                    size="small"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<EmailIcon />}
                  onClick={() => customer.email && window.open(`mailto:${customer.email}`, '_blank')}
                  disabled={!customer.email}
                >
                  Send Email
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PhoneIcon />}
                  onClick={() => customer.phone && window.open(`tel:${customer.phone}`, '_blank')}
                  disabled={!customer.phone}
                >
                  Call Customer
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CalendarTodayIcon />}
                >
                  Schedule Meeting
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<GroupIcon />}
                >
                  Add Contact
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

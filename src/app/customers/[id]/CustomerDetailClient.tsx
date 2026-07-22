// src/app/customers/[id]/CustomerDetailClient.tsx - FIXED VERSION
'use client';

import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Container,
  Avatar,
  Stack,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
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
  Work as WorkIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

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

interface LeadHistory {
  id: string;
  name: string;
  email: string;
  company: string;
  pipeline_stage: string;
  created_at: string;
  converted_at: string;
  source: string;
  lead_type: string;
}

interface CustomerDetailClientProps {
  customer: Customer;
  contacts: Contact[];
}

export function CustomerDetailClient({ customer, contacts }: CustomerDetailClientProps) {
  const router = useRouter();
  const [leadHistory, setLeadHistory] = useState<LeadHistory | null>(null);
  const [loadingLeadHistory, setLoadingLeadHistory] = useState(false);

  // Check if this customer was converted from a lead
  useEffect(() => {
    const checkLeadConversion = async () => {
      if (!customer?.id) return;

      setLoadingLeadHistory(true);
      try {
        const supabase = createClient();

        // Check both lead tables for this customer
        const [assessmentLeads, calculatorLeads] = await Promise.all([
          supabase
            .from('lead_assessment_reports')
            .select('*')
            .eq('customer_id', customer.id)
            .not('converted_at', 'is', null)
            .single(),
          supabase
            .from('lead_reports')
            .select('*')
            .eq('customer_id', customer.id)
            .not('converted_at', 'is', null)
            .single()
        ]);

        const leadData = assessmentLeads.data || calculatorLeads.data;

        if (leadData) {
          setLeadHistory({
            id: leadData.id,
            name: leadData.name,
            email: leadData.email,
            company: leadData.company,
            pipeline_stage: leadData.pipeline_stage,
            created_at: leadData.created_at,
            converted_at: leadData.converted_at,
            source: leadData.source,
            lead_type: leadData.lead_type
          });
        }
      } catch (error) {
        console.error('Error loading lead history:', error);
      } finally {
        setLoadingLeadHistory(false);
      }
    };

    checkLeadConversion();
  }, [customer.id]);

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

  const handleEditCustomer = () => {
    router.push(`/customers/${customer.id}/edit`);
  };

  const handleEditContact = (contactId: string) => {
    router.push(`/customers/${customer.id}/contacts/${contactId}/edit`);
  };

  const handleAddContact = () => {
    router.push(`/customers/${customer.id}/contacts/new`);
  };

  // Get display name - prioritize company name
  const getDisplayName = () => {
    return customer.company || customer.name || 'Unnamed Customer';
  };

  // Get subtitle - show contact name if company is primary
  const getSubtitle = () => {
    if (customer.company && customer.name) {
      return `Primary Contact: ${customer.name}`;
    }
    if (customer.company) {
      return 'No primary contact specified';
    }
    return ''; // If no company, we're using name as primary
  };

  // Get avatar initial - use company first letter if available
  const getAvatarInitial = () => {
    if (customer.company) {
      return customer.company.charAt(0).toUpperCase();
    }
    return customer.name?.charAt(0)?.toUpperCase() || 'C';
  };

  // Calculate days to convert if we have lead history
  const getDaysToConvert = () => {
    if (!leadHistory?.created_at || !leadHistory?.converted_at) return null;

    const created = new Date(leadHistory.created_at);
    const converted = new Date(leadHistory.converted_at);
    const days = Math.round((converted.getTime() - created.getTime()) / (1000 * 3600 * 24));
    return days;
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
              {getAvatarInitial()}
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {getDisplayName()}
              </Typography>
              {getSubtitle() && (
                <Typography variant="h6" color="text.secondary">
                  {getSubtitle()}
                </Typography>
              )}
            </Box>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
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
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditCustomer}
              sx={{ ml: 2 }}
            >
              Edit Customer
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Use Box instead of Grid to avoid version conflicts */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 4
      }}>
        {/* Left Column - Customer Information */}
        <Box>
          {/* Contact Information Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon />
                  Company Information
                </Typography>
                <Button
                  startIcon={<EditIcon />}
                  onClick={handleEditCustomer}
                  size="small"
                >
                  Edit
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                {/* Show company name prominently if it's not already the main title */}
                {!customer.company && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <BusinessIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Company</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {customer.company || 'Not specified'}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Show contact name prominently if company is the main title */}
                {customer.company && customer.name && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <PersonIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Primary Contact</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {customer.name}
                      </Typography>
                    </Box>
                  </Box>
                )}

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

          {/* Lead Conversion History Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} gutterBottom>
                <TrendingUpIcon />
                Lead Conversion History
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {loadingLeadHistory ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : leadHistory ? (
                <Stack spacing={2}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Original Lead
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {leadHistory.name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Source
                      </Typography>
                      <Chip
                        label={leadHistory.source || 'Unknown'}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Lead Created
                      </Typography>
                      <Typography variant="body1">
                        {new Date(leadHistory.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Converted On
                      </Typography>
                      <Typography variant="body1">
                        {new Date(leadHistory.converted_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  {getDaysToConvert() && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Time to Convert
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {getDaysToConvert()} days
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Stage: ${leadHistory.pipeline_stage}`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`Type: ${leadHistory.lead_type}`}
                      color="secondary"
                      variant="outlined"
                    />
                    <Chip
                      label="Converted to Customer"
                      color="success"
                    />
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={<HistoryIcon />}
                    onClick={() => router.push(`/leads?highlight=${leadHistory.id}`)}
                    sx={{ mt: 1 }}
                  >
                    View Lead Details
                  </Button>
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <TimelineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    No lead conversion history
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This customer was created directly, not from a lead.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Contacts Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupIcon />
                  Contacts ({contacts.length})
                </Typography>
                <Button
                  startIcon={<GroupIcon />}
                  onClick={handleAddContact}
                  variant="contained"
                  size="small"
                >
                  Add Contact
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {contacts.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary" gutterBottom>
                    No contacts added yet.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<GroupIcon />}
                    onClick={handleAddContact}
                    sx={{ mt: 1 }}
                  >
                    Add First Contact
                  </Button>
                </Box>
              ) : (
                <List>
                  {contacts.map((contact) => (
                    <ListItem
                      key={contact.id}
                      divider
                      secondaryAction={
                        <Button
                          startIcon={<EditIcon />}
                          onClick={() => handleEditContact(contact.id)}
                          size="small"
                        >
                          Edit
                        </Button>
                      }
                    >
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
        </Box>

        {/* Right Column - Meta Information & Actions */}
        <Box>
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
                {leadHistory?.converted_at && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Converted from Lead
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(leadHistory.converted_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
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
                  startIcon={<EditIcon />}
                  onClick={handleEditCustomer}
                >
                  Edit Customer
                </Button>
                <Button
                  variant="outlined"
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
                  onClick={handleAddContact}
                >
                  Add Contact
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}

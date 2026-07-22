// src/app/customers/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  MenuItem,
  Divider,
  Alert,
  Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  status: string;
  customer_type: string;
  notes: string;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'lead', label: 'Lead' }
];

const customerTypeOptions = [
  { value: 'business', label: 'Business' },
  { value: 'individual', label: 'Individual' }
];

const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'other', label: 'Other' }
];

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer>({
    id: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    status: 'active',
    customer_type: 'business',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/customers/${customerId}`);
        if (response.ok) {
          const customerData = await response.json();
          setCustomer(customerData);
        } else {
          setError('Failed to fetch customer data');
        }
      } catch (err) {
        setError('Error fetching customer data');
        console.error('Error fetching customer:', err);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const handleChange = (field: keyof Customer) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });

      if (response.ok) {
        router.push(`/customers/${customerId}`);
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update customer');
      }
    } catch (err) {
      setError('Error updating customer');
      console.error('Error updating customer:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/customers/${customerId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(`/customers/${customerId}`)}
          sx={{ mb: 3 }}
        >
          Back to Customer
        </Button>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Edit Customer
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Update customer information
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Basic Information */}
              <Box>
                <Typography variant="h5" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      required
                      label="Customer Name"
                      value={customer.name}
                      onChange={handleChange('name')}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Company"
                      value={customer.company}
                      onChange={handleChange('company')}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Contact Information */}
              <Box>
                <Typography variant="h5" gutterBottom>
                  Contact Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Email"
                      type="email"
                      value={customer.email}
                      onChange={handleChange('email')}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Phone"
                      value={customer.phone}
                      onChange={handleChange('phone')}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Website"
                      value={customer.website}
                      onChange={handleChange('website')}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Address Information */}
              <Box>
                <Typography variant="h5" gutterBottom>
                  Address Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Address"
                      value={customer.address}
                      onChange={handleChange('address')}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="City"
                      value={customer.city}
                      onChange={handleChange('city')}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="State/Province"
                      value={customer.state}
                      onChange={handleChange('state')}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Country"
                      value={customer.country}
                      onChange={handleChange('country')}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Postal Code"
                      value={customer.postal_code}
                      onChange={handleChange('postal_code')}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Customer Details */}
              <Box>
                <Typography variant="h5" gutterBottom>
                  Customer Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      select
                      label="Status"
                      value={customer.status}
                      onChange={handleChange('status')}
                      fullWidth
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      select
                      label="Customer Type"
                      value={customer.customer_type}
                      onChange={handleChange('customer_type')}
                      fullWidth
                    >
                      {customerTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      select
                      label="Industry"
                      value={customer.industry}
                      onChange={handleChange('industry')}
                      fullWidth
                    >
                      {industryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Notes"
                      value={customer.notes}
                      onChange={handleChange('notes')}
                      multiline
                      rows={4}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

// src/app/customers/[id]/contacts/new/page.tsx
'use client';

import { useState } from 'react';
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
  Divider,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface Contact {
  name: string;
  email: string;
  phone: string;
  position: string;
}
export const dynamic = 'force-dynamic';
export default function NewContactPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const [contact, setContact] = useState<Contact>({
    name: '',
    email: '',
    phone: '',
    position: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof Contact) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setContact(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/customers/${customerId}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        router.push(`/customers/${customerId}`);
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create contact');
      }
    } catch (err) {
      setError('Error creating contact');
      console.error('Error creating contact:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/customers/${customerId}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
          Add New Contact
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Create a new contact for this customer
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
              {/* Contact Information */}
              <Box>
                <Typography variant="h5" gutterBottom>
                  Contact Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={3}>
                  <TextField
                    required
                    label="Full Name"
                    value={contact.name}
                    onChange={handleChange('name')}
                    placeholder="Enter contact's full name"
                    fullWidth
                  />
                  <TextField
                    label="Position"
                    value={contact.position}
                    onChange={handleChange('position')}
                    placeholder="Enter job title or position"
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={contact.email}
                    onChange={handleChange('email')}
                    placeholder="Enter email address"
                    fullWidth
                  />
                  <TextField
                    label="Phone"
                    value={contact.phone}
                    onChange={handleChange('phone')}
                    placeholder="Enter phone number"
                    fullWidth
                  />
                </Stack>
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
                  startIcon={<AddIcon />}
                  disabled={saving}
                >
                  {saving ? 'Creating...' : 'Create Contact'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

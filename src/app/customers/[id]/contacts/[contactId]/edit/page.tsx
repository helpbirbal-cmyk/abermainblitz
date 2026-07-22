// src/app/customers/[id]/contacts/[contactId]/edit/page.tsx
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
  Divider,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
}

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  const contactId = params.contactId as string;

  const [contact, setContact] = useState<Contact>({
    id: '',
    name: '',
    email: '',
    phone: '',
    position: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch contact data
    const fetchContact = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const response = await fetch(`/api/customers/${customerId}/contacts/${contactId}`);
        if (response.ok) {
          const contactData = await response.json();
          setContact(contactData);
        } else {
          setError('Failed to fetch contact data');
        }
      } catch (err) {
        setError('Error fetching contact data');
        console.error('Error fetching contact:', err);
      } finally {
        setLoading(false);
      }
    };

    if (customerId && contactId) {
      fetchContact();
    }
  }, [customerId, contactId]);

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
      const response = await fetch(`/api/customers/${customerId}/contacts/${contactId}`, {
        method: 'PUT',
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
        setError(errorData.message || 'Failed to update contact');
      }
    } catch (err) {
      setError('Error updating contact');
      console.error('Error updating contact:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/customers/${customerId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

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
          Edit Contact
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Update contact information
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
                    fullWidth
                  />
                  <TextField
                    label="Position"
                    value={contact.position}
                    onChange={handleChange('position')}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={contact.email}
                    onChange={handleChange('email')}
                    fullWidth
                  />
                  <TextField
                    label="Phone"
                    value={contact.phone}
                    onChange={handleChange('phone')}
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

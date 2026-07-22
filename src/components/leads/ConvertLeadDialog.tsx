'use client';

import { useState,useEffect } from 'react'; // Make sure useState is imported
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Box,
  Typography
} from '@mui/material';
import type { LeadData } from '@/types';

interface ConvertLeadDialogProps {
  open: boolean;
  onClose: () => void;
  lead: LeadData | null;
  isBulk?: boolean;
  onConvert: (data: {
    name: string;
    company: string;
    customerType: string;
    industry: string;
  }) => Promise<void>;
}

export const ConvertLeadDialog = ({
  open,
  onClose,
  lead,
  isBulk = false,
  onConvert
}: ConvertLeadDialogProps) => {
  // Add error state
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    company: lead?.company || '',
    customerType: 'sme',
    industry: ''
  });

  // Reset form when dialog opens with new lead
 useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        company: lead.company || '',
        customerType: 'sme',
        industry: ''
      });
    }
  }, [lead]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await onConvert(formData);
      onClose();
    } catch (err) {
      console.error('Error converting lead:', err);
      setError('Failed to convert lead. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isBulk ? 'Convert Multiple Leads to Customers' : 'Convert Lead to Customer'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {isBulk ? (
            <Alert severity="info">
              You are about to convert multiple leads to customers.
              They will share the same customer type and industry settings.
            </Alert>
          ) : (
            <Alert severity="info">
              Converting <strong>{lead?.name}</strong> from {lead?.company || 'No company'} to a customer.
            </Alert>
          )}

          {!isBulk && (
            <>
              <TextField
                label="Customer Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />

              <TextField
                label="Company"
                fullWidth
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                required
              />
            </>
          )}

          <FormControl fullWidth>
            <InputLabel>Customer Type</InputLabel>
            <Select
              value={formData.customerType}
              label="Customer Type"
              onChange={(e) => setFormData(prev => ({ ...prev, customerType: e.target.value }))}
              required
            >
              <MenuItem value="enterprise">Enterprise</MenuItem>
              <MenuItem value="sme">SME</MenuItem>
              <MenuItem value="startup">Startup</MenuItem>
              <MenuItem value="individual">Individual</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Industry</InputLabel>
            <Select
              value={formData.industry}
              label="Industry"
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              required
            >
              <MenuItem value="technology">Technology</MenuItem>
              <MenuItem value="healthcare">Healthcare</MenuItem>
              <MenuItem value="finance">Finance</MenuItem>
              <MenuItem value="retail">Retail</MenuItem>
              <MenuItem value="manufacturing">Manufacturing</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          {!isBulk && lead && (
            <Box sx={{
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 1
            }}>
              <Typography variant="subtitle2" gutterBottom>
                Lead Information
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="caption">
                    {lead.email || 'Not provided'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="caption">
                    {lead.phone || 'Not provided'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Lead Score
                  </Typography>
                  <Typography variant="caption">
                    {lead.lead_score}/100
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            submitting ||
            (!isBulk && (!formData.name || !formData.company)) ||
            !formData.customerType ||
            !formData.industry
          }
        >
          {submitting
            ? 'Converting...'
            : isBulk
              ? 'Convert All Selected'
              : 'Convert to Customer'
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

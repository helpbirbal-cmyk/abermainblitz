// src/components/leads/InteractionDialog.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Chip,
  Box,
  Typography
} from '@mui/material';
import type { LeadData } from '@/types';

interface InteractionDialogProps {
  open: boolean;
  onClose: () => void;
  lead: LeadData | null;
  onSubmit: (type: string, notes: string) => Promise<void>;
}

export const InteractionDialog = ({
  open,
  onClose,
  lead,
  onSubmit
}: InteractionDialogProps) => {
  const [type, setType] = useState<'call' | 'email' | 'meeting' | 'note'>('note');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!notes.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(type, notes);
      setType('note');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Error logging interaction:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Log Interaction - {lead?.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Interaction Type</InputLabel>
            <Select
              value={type}
              label="Interaction Type"
              onChange={(e) => setType(e.target.value as any)}
            >
              <MenuItem value="call">Phone Call</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="meeting">Meeting</MenuItem>
              <MenuItem value="note">Note</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Notes"
            multiline
            rows={4}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes from Interaction..."
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={`Email: ${lead?.email || 'No email'}`} variant="outlined" size="small" />
            <Chip label={`Phone: ${lead?.phone || 'No phone'}`} variant="outlined" size="small" />
            <Chip label={`Company: ${lead?.company || 'No company'}`} variant="outlined" size="small" />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!notes.trim() || submitting}
        >
          {submitting ? 'Logging...' : 'Log Interaction'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { createClient } from '@/lib/supabase/client';

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  onCustomerAdded: () => void;
}

export const AddCustomerDialog = ({
  open,
  onClose,
  organizationId,
  onCustomerAdded,
}: AddCustomerDialogProps) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const supabase = createClient();


  const handleAdd = async () => {
    if (!name.trim()) return;
    await supabase.from('customers').insert({
      name,
      company,
      email,
      organization_id: organizationId,
    });
    onCustomerAdded();
    onClose();
    setName('');
    setCompany('');
    setEmail('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Customer</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="dense"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Company"
          fullWidth
          margin="dense"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

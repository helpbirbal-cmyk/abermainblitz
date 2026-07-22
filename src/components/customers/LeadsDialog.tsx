// src/components/customers/LeadsDialog.tsx
'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import type { LeadData } from '@/types';

interface LeadsDialogProps {
  open: boolean;
  onClose: () => void;
  leads: LeadData[];
  onAddLead: () => void; // ✅ handler passed from CustomerCard
}

export const LeadsDialog = ({ open, onClose, leads, onAddLead }: LeadsDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Leads</DialogTitle>
      <DialogContent>
        <List>
          {leads.map((lead) => (
            <ListItem key={lead.id}>
              <ListItemText primary={lead.name} secondary={lead.status} />
            </ListItem>
          ))}
          {leads.length === 0 && (
            <ListItem>
              <ListItemText primary="No leads yet" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={() => {
            onAddLead();   // ✅ call handler
            onClose();     // ✅ close dialog after insert
          }}
        >
          + New Lead
        </Button>
      </DialogActions>
    </Dialog>
  );
};

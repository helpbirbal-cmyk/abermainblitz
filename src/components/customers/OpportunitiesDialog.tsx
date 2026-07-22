// src/components/customers/OpportunitiesDialog.tsx
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
import type { Opportunity } from '@/types';   // ✅ correct type from your schema

interface OpportunitiesDialogProps {
  open: boolean;
  onClose: () => void;
  opportunities: Opportunity[];
  onAddOpportunity: () => void; // ✅ handler passed from CustomerCard
}

export const OpportunitiesDialog = ({
  open,
  onClose,
  opportunities,
  onAddOpportunity,
}: OpportunitiesDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Opportunities</DialogTitle>
      <DialogContent>
        <List>
          {opportunities.map((opp) => (
            <ListItem key={opp.id}>
              <ListItemText primary={opp.name} secondary={opp.stage} />
            </ListItem>
          ))}
          {opportunities.length === 0 && (
            <ListItem>
              <ListItemText primary="No opportunities yet" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={() => {
            onAddOpportunity(); // ✅ call handler
            onClose();          // ✅ close dialog after insert
          }}
        >
          + New Opportunity
        </Button>
      </DialogActions>
    </Dialog>
  );
};

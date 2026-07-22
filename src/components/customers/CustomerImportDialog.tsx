'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Papa from 'papaparse';
import type { Customer } from '@/types';

interface CustomerImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (customers: Customer[]) => void;
  organizationId: string;
}

export const CustomerImportDialog = ({ open, onClose, onImport }: CustomerImportDialogProps) => {
  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        onImport(results.data as Customer[]);
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Import Customers</DialogTitle>
      <DialogContent>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

'use client';

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
} from '@mui/material';
import type { OrganizationMember } from '@/types';

interface CustomerFiltersDialogProps {
  open: boolean;
  onClose: () => void;
  filters: any;
  onFiltersChange: (f: any) => void;
  orgMembers: OrganizationMember[];
}

// Helper: derive a friendly display name from the member record
function getMemberDisplayName(m: OrganizationMember): string {
  // Some schemas return users as an array; others as a single object
  const users: any = (m as any).users;
  if (Array.isArray(users) && users.length > 0) {
    const u = users[0];
    return u?.user_metadata?.full_name ?? u?.email ?? m.user_id;
  }
  const u = users as { email?: string; user_metadata?: { full_name?: string } } | undefined;
  return u?.user_metadata?.full_name ?? u?.email ?? m.user_id;
}

export const CustomerFiltersDialog = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  orgMembers,
}: CustomerFiltersDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Customer Filters</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* Search */}
          <TextField
            label="Search"
            fullWidth
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          />

          {/* Status */}
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Prospect">Prospect</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Churned">Churned</MenuItem>
            </Select>
          </FormControl>

          {/* Customer Type */}
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.customerType}
              label="Type"
              onChange={(e) => onFiltersChange({ ...filters, customerType: e.target.value })}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="SME">SME</MenuItem>
              <MenuItem value="Enterprise">Enterprise</MenuItem>
            </Select>
          </FormControl>

          {/* Industry */}
          <FormControl fullWidth>
            <InputLabel>Industry</InputLabel>
            <Select
              value={filters.industry}
              label="Industry"
              onChange={(e) => onFiltersChange({ ...filters, industry: e.target.value })}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Technology">Technology</MenuItem>
              <MenuItem value="Manufacturing">Manufacturing</MenuItem>
            </Select>
          </FormControl>

          {/* Assigned */}
          <FormControl fullWidth>
            <InputLabel>Assigned To</InputLabel>
            <Select
              value={filters.assignedTo}
              label="Assigned To"
              onChange={(e) => onFiltersChange({ ...filters, assignedTo: e.target.value })}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="unassigned">Unassigned</MenuItem>
              {orgMembers.map((m) => (
                <MenuItem key={m.user_id} value={m.user_id}>
                  {getMemberDisplayName(m)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={() => {
            localStorage.setItem('customer_filters', JSON.stringify(filters));
            onClose();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

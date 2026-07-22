'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Typography,
  Chip,
  Box
} from '@mui/material';
import type { FilterState } from '@/types';

interface FiltersDialogProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  teamMembers: Array<{ user_id: string; name?: string }>;
}

export const FiltersDialog = ({
  open,
  onClose,
  filters,
  onFiltersChange,
  teamMembers
}: FiltersDialogProps) => {
  const handleReset = () => {
    onFiltersChange({
      search: '',
      source: 'all',
      leadType: 'all',
      scoreMin: 0,
      scoreMax: 100,
      dateRange: 'all',
      assignedTo: 'all',
      startDate: null, // ✅ Add this
    endDate: null    // ✅ Add this
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter Leads</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Search"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            fullWidth
            placeholder="Search by name, email, or company..."
          />

          <FormControl fullWidth>
            <InputLabel>Lead Type</InputLabel>
            <Select
              value={filters.leadType}
              label="Lead Type"
              onChange={(e) => onFiltersChange({ ...filters, leadType: e.target.value })}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="assessment">Assessment</MenuItem>
              <MenuItem value="calculator">Calculator</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Source</InputLabel>
            <Select
              value={filters.source}
              label="Source"
              onChange={(e) => onFiltersChange({ ...filters, source: e.target.value })}
            >
              <MenuItem value="all">All Sources</MenuItem>
              <MenuItem value="manual">Manual</MenuItem>
              <MenuItem value="calculator">Calculator</MenuItem>
              <MenuItem value="website">Website</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom>Lead Score Range</Typography>
            <Slider
              value={[filters.scoreMin, filters.scoreMax]}
              onChange={(_, newValue: number | number[]) => {
                const [min, max] = newValue as number[];
                onFiltersChange({ ...filters, scoreMin: min, scoreMax: max });
              }}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Min: {filters.scoreMin}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Max: {filters.scoreMax}
              </Typography>
            </Box>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={filters.dateRange}
              label="Date Range"
              onChange={(e) => onFiltersChange({ ...filters, dateRange: e.target.value })}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Assigned To</InputLabel>
            <Select
              value={filters.assignedTo}
              label="Assigned To"
              onChange={(e) => onFiltersChange({ ...filters, assignedTo: e.target.value })}
            >
              <MenuItem value="all">All Team Members</MenuItem>
              <MenuItem value="unassigned">Unassigned</MenuItem>
              {teamMembers.map(member => (
                <MenuItem key={member.user_id} value={member.user_id}>
                  {member.name || member.user_id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="subtitle2" sx={{ width: '100%' }}>
              Active Filters:
            </Typography>
            {filters.search && (
              <Chip label={`Search: ${filters.search}`} onDelete={() => onFiltersChange({ ...filters, search: '' })} />
            )}
            {filters.leadType !== 'all' && (
              <Chip label={`Type: ${filters.leadType}`} onDelete={() => onFiltersChange({ ...filters, leadType: 'all' })} />
            )}
            {filters.source !== 'all' && (
              <Chip label={`Source: ${filters.source}`} onDelete={() => onFiltersChange({ ...filters, source: 'all' })} />
            )}
            {filters.dateRange !== 'all' && (
              <Chip label={`Date: ${filters.dateRange}`} onDelete={() => onFiltersChange({ ...filters, dateRange: 'all' })} />
            )}
            {filters.assignedTo !== 'all' && (
              <Chip label={`Assigned: ${filters.assignedTo === 'unassigned' ? 'Unassigned' : teamMembers.find(m => m.user_id === filters.assignedTo)?.name || filters.assignedTo}`} onDelete={() => onFiltersChange({ ...filters, assignedTo: 'all' })} />
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="error">
          Reset All
        </Button>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// src/components/customers/CustomerHeader.tsx
'use client';

import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Chip,
  Divider,
  Collapse,
} from '@mui/material';
import {
  ViewKanban as ViewKanbanIcon,
  ViewList as ViewListIcon,
  FilterList as FilterListIcon,
  ClearAll as ClearAllIcon,
  Save as SaveIcon,
  UploadFile as UploadFileIcon,
  AddCircle as AddCircleIcon,
  InsertChart as InsertChartIcon,
  TableChart as TableChartIcon,
  UnfoldLess as UnfoldLessIcon,
  UnfoldMore as UnfoldMoreIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import type { OrganizationMember } from '@/types';
import { CustomerFiltersDialog } from '@/components/customers/CustomerFiltersDialog';
import type { CustomerFilters } from '@/app/customers/defaultCustomerFilters';

interface CustomerHeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  filters: any;
  setFilters: (f: any) => void;
  //defaultFilters: any;
  customers: any[];
  selectedCustomers: Set<string>;
  orgMembers: OrganizationMember[];
  onAddCustomer: () => void;
  onExport: (format: 'csv' | 'xlsx') => void;
  onApplyPreset: (preset: any) => void;
  //savedPresets: { name: string; filters: any }[];
  setSavedPresets: (presets: { name: string; filters: any }[]) => void;
  onImportCSV: () => void;
  isCollapsed: boolean;
  toggleCollapse: (status: string) => void;
  collapseAllStatuses: () => void;
  expandAllStatuses: () => void;

  defaultFilters?: CustomerFilters;   // ✅ add this
  savedPresets?: any[];               // ✅ add this
}

export const CustomerHeader = ({
  activeTab,
  setActiveTab,
  filters,
  setFilters,
  defaultFilters,
  customers,
  selectedCustomers,
  orgMembers,
  onAddCustomer,
  onExport,
  onApplyPreset,
  savedPresets,
  setSavedPresets,
  onImportCSV,
  isCollapsed,
  toggleCollapse,
  collapseAllStatuses,
  expandAllStatuses,
}: CustomerHeaderProps) => {
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('customer_filter_presets');
    if (stored) setSavedPresets(JSON.parse(stored));
  }, []);

  return (
    <Box sx={{ mb: 2 }}>
      {/* Top Bar */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Typography variant="h5" fontWeight="bold">
            Customers
          </Typography>

          <Tooltip title="Kanban View">
            <IconButton
              size="small"
              onClick={() => setActiveTab(0)}
              sx={{
                backgroundColor: activeTab === 0 ? 'primary.main' : 'transparent',
                color: activeTab === 0 ? 'primary.contrastText' : 'text.secondary',
                border: '1px solid',
                borderColor: activeTab === 0 ? 'primary.main' : 'divider',
              }}
            >
              <ViewKanbanIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="List View">
            <IconButton
              size="small"
              onClick={() => setActiveTab(1)}
              sx={{
                backgroundColor: activeTab === 1 ? 'primary.main' : 'transparent',
                color: activeTab === 1 ? 'primary.contrastText' : 'text.secondary',
                border: '1px solid',
                borderColor: activeTab === 1 ? 'primary.main' : 'divider',
              }}
            >
              <ViewListIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Tooltip title="Filters">
            <IconButton size="small" onClick={() => setShowFiltersDialog(true)}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={isCollapsed ? 'Expand All' : 'Collapse All'}>
            <IconButton
              size="large"
              onClick={isCollapsed ? expandAllStatuses : collapseAllStatuses}
            >
              {isCollapsed ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Export CSV">
            <IconButton size="small" onClick={() => onExport('csv')}>
              <InsertChartIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Export XLSX">
            <IconButton size="small" onClick={() => onExport('xlsx')}>
              <TableChartIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Add Customer">
            <IconButton size="small" onClick={onAddCustomer}>
              <AddCircleIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Import CSV">
            <IconButton size="small" onClick={onImportCSV}>
              <UploadFileIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Filter Summary */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 1 }}>
        <Chip label={`Filtered: ${customers.length}`} size="small" color="info" />
        {selectedCustomers.size > 0 && (
          <Chip label={`Selected: ${selectedCustomers.size}`} size="small" color="primary" />
        )}
      </Box>

      {/* Filters Dialog */}
      <CustomerFiltersDialog
        open={showFiltersDialog}
        onClose={() => setShowFiltersDialog(false)}
        filters={filters}
        onFiltersChange={setFilters}
        orgMembers={orgMembers}
      />
    </Box>
  );
};

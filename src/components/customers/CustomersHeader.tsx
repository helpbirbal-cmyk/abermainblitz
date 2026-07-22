// src/components/customers/CustomersHeader.tsx
'use client';

import {
  Box,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  Badge,
} from '@mui/material';
import {
  ViewList as ViewListIcon,
  ViewKanban as ViewKanbanIcon,
  InsertChart as InsertChartIcon,
  TableChart as TableChartIcon,
  AddCircle as AddCircleIcon,
  UploadFile as UploadFileIcon,
} from '@mui/icons-material';
import { OrganizationSwitcher } from '@/components/common/OrganizationSwitcher';
import type { CustomerFilters } from '@/app/customers/defaultCustomerFilters';
interface CustomersHeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  onExport: (format: 'csv' | 'xlsx') => void;
  onAddCustomer: () => void;
  onImportCSV: () => void;

  defaultFilters?: CustomerFilters;   // ✅ add this
  savedPresets?: any[];               // ✅ add this
}

export const CustomersHeader = ({
  activeTab,
  setActiveTab,
  onExport,
  onAddCustomer,
  onImportCSV,
}: CustomersHeaderProps) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ mb: 2 }}
      >
        {/* Left side: title + org switcher + view toggle */}
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Typography variant="h5" fontWeight="bold">
            Customers
          </Typography>

          <OrganizationSwitcher />

          <Tooltip title="Kanban View" placement="top-start">
            <IconButton
              size="small"
              onClick={() => setActiveTab(0)}
              sx={{
                backgroundColor: activeTab === 0 ? 'primary.main' : 'transparent',
                color: activeTab === 0 ? 'primary.contrastText' : 'text.secondary',
                border: '1px solid',
                borderColor: activeTab === 0 ? 'primary.main' : 'divider',
                '&:hover': {
                  backgroundColor: activeTab === 0 ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <ViewKanbanIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="List View" placement="top-start">
            <IconButton
              size="small"
              onClick={() => setActiveTab(1)}
              sx={{
                backgroundColor: activeTab === 1 ? 'primary.main' : 'transparent',
                color: activeTab === 1 ? 'primary.contrastText' : 'text.secondary',
                border: '1px solid',
                borderColor: activeTab === 1 ? 'primary.main' : 'divider',
                '&:hover': {
                  backgroundColor: activeTab === 1 ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <ViewListIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Right side: actions */}
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Tooltip title="Export CSV" placement="top-start">
            <IconButton size="small" onClick={() => onExport('csv')}>
              <Badge badgeContent="CSV" color="info" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}>
                <InsertChartIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Export XLSX" placement="top-start">
            <IconButton size="small" onClick={() => onExport('xlsx')}>
              <Badge badgeContent="XLS" color="info" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}>
                <TableChartIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Add Customer" placement="top-start">
            <IconButton size="small" onClick={onAddCustomer}>
              <Badge badgeContent="Cust" color="info" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}>
                <AddCircleIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Import CSV" placement="top-start">
            <IconButton size="small" onClick={onImportCSV}>
              <Badge badgeContent="CSV" color="info" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}>
                <UploadFileIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
};

// src/components/customers/CustomerListView.tsx
'use client';

import { useState } from 'react';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Checkbox,
    IconButton,
    Chip,
    Typography,
    Tooltip,
    useTheme,
    alpha,
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    Assignment as AssignmentIcon,
    Business as BusinessIcon,
} from '@mui/icons-material';
import type { Customer, OrgMemberProfile } from '@/types';

type SortField = keyof Customer;
type SortDirection = 'asc' | 'desc';

type Props = {
    customers: Customer[];
    selectedCustomers: Set<string>;
    onCustomerSelect: (id: string) => void;
    onSelectAll: (list: Customer[]) => void;
    onInteractionClick: (customer: Customer) => void;
    onDetailsClick: (customer: Customer) => void;
    onAssignClick: (customer: Customer) => void;
    orgMembers: OrgMemberProfile[]; // ✅ correct
};

export const CustomerListView = ({
                                     customers,
                                     selectedCustomers,
                                     onCustomerSelect,
                                     onSelectAll,
                                     onInteractionClick,
                                     onDetailsClick,
                                     onAssignClick,
                                     orgMembers,
                                 }: Props) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Sorting logic
  const sortedCustomers = [...customers].sort((a, b) => {
    let aValue = a[sortField] ?? ''; // fallback to empty string
    let bValue = b[sortField] ?? '';

    if (sortField === 'created_at') {
      const aTime = new Date((aValue as string) || '').getTime();
      const bTime = new Date((bValue as string) || '').getTime();
      return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    // Ensure both are numbers or strings before comparing
    const compareResult =
      aValue < bValue ? -1 : aValue > bValue ? 1 : 0;

      console.log('ListView customers:', customers.length);

    return sortDirection === 'asc' ? compareResult : -compareResult;
  });


  // Pagination
  const paginatedCustomers = sortedCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onSelectAll(paginatedCustomers);
    } else {
      onSelectAll([]);
    }
  };

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedCustomers.size > 0 &&
                    selectedCustomers.size < paginatedCustomers.length
                  }
                  checked={
                    paginatedCustomers.length > 0 &&
                    selectedCustomers.size === paginatedCustomers.length
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
                  onClick={() => handleSort('name')}
                >
                  Customer
                </Box>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCustomers.map((customer) => (
              <TableRow
                key={customer.id}
                hover
                sx={{
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomers.has(customer.id)}
                    onChange={() => onCustomerSelect(customer.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="subtitle2">{customer.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {customer.company}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      {customer.email && (
                        <Tooltip title={customer.email}>
                          <EmailIcon fontSize="small" color="action" />
                        </Tooltip>
                      )}
                      {customer.phone && (
                        <Tooltip title={customer.phone}>
                          <PhoneIcon fontSize="small" color="action" />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={customer.status || 'Active'} size="small" />
                </TableCell>
                <TableCell>{customer.customer_type || 'SME'}</TableCell>
                <TableCell>{customer.industry || 'N/A'}</TableCell>
                <TableCell>
                  {customer.created_at
                    ? new Date(customer.created_at).toLocaleDateString()
                    : '—'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => onInteractionClick?.(customer)}>
                      <AssignmentIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDetailsClick?.(customer)}>
                      <BusinessIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={customers.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </Card>
  );
};

// src/components/customers/CustomerKanban.tsx
'use client';

import { useState, useEffect } from 'react';
import { Box, useTheme, IconButton } from '@mui/material';
import type { Customer, OrganizationMember } from '@/types';

import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  CheckCircle as CheckIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';

interface CustomerKanbanProps {
  customers: Customer[];
  //statuses: string[]; // e.g. ["Prospect", "Active", "Churned"]
  orgMembers: OrganizationMember[];
  selectedCustomers: Set<string>;
  onCustomerSelect: (customerId: string) => void;
  onSelectAll: (customers: Customer[]) => void;
  onInteractionClick?: (customer: Customer) => void;
  onDetailsClick?: (customer: Customer) => void;
  onAssignClick?: (customer: Customer, event: React.MouseEvent<HTMLButtonElement>) => void;
  onDropCustomer?: (customerId: string, newStatus: string) => void;
  collapsedStatuses: Set<string>;
  toggleCollapse: (status: string) => void;
    groupBy?: (c: Customer) => string;
    onAssign?: (customerId: string, userId: string) => Promise<void>;
 onRefreshCustomers?: () => Promise<void>;
}

export const CustomerKanban = ({
  customers,
  orgMembers,
  selectedCustomers,
  onCustomerSelect,
  onSelectAll,
  onInteractionClick,
  onDetailsClick,
  onAssignClick,
  onDropCustomer,
  collapsedStatuses,
  toggleCollapse,
}: CustomerKanbanProps) => {
  const theme = useTheme();
  const [draggedCustomer, setDraggedCustomer] = useState<Customer | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      setDraggedCustomer(null);
      setIsDragging(false);
    };
  }, []);

  const handleDragStart = (customer: Customer) => {
    setDraggedCustomer(customer);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setDraggedCustomer(null);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const customerId = e.dataTransfer.getData('customerId');
    if (customerId && onDropCustomer) {
      onDropCustomer(customerId, status);
    }
  };

  const customersByStatus = [
    { status: 'Customers', customers }
  ];



  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        overflowY: 'hidden',
        pb: 2,
        px: 1,
        minHeight: '100%',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {customersByStatus.map(({ status, customers: statusCustomers }) => (
        <Box
          key={status}
          sx={{
            flex: '0 0 300px',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            p: 1,
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, status)}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
              cursor: 'pointer',
            }}
            onClick={() => toggleCollapse(status)}
          >
            <strong>{status}</strong>
            <span>{statusCustomers.length}</span>
          </Box>

          {!collapsedStatuses.has(status) && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {statusCustomers.map((customer) => (
                <Box
                  key={customer.id}
                  draggable
                  onDragStart={() => handleDragStart(customer)}
                  onDragEnd={handleDragEnd}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1,
                    bgcolor: isDragging ? theme.palette.action.hover : 'background.default',
                  }}
                >
                  <Box sx={{ fontWeight: 'bold' }}>{customer.name}</Box>
                  <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                    {customer.company}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    {customer.email && <span>{customer.email}</span>}
                    {customer.phone && <span>{customer.phone}</span>}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <IconButton size="small" onClick={() => onInteractionClick?.(customer)}>
                      <AssignmentIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDetailsClick?.(customer)}>
                      <BusinessIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

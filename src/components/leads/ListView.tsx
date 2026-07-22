// src/components/leads/ListView.tsx
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
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
  Avatar,
  Typography,
  LinearProgress,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  CheckCircle as CheckIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import type { LeadData, TeamMember } from '@/types';

interface ListViewProps {
  leads: LeadData[];
  selectedLeads: Set<string>;
  onLeadSelect: (leadId: string) => void;
  onSelectAll: (leads: LeadData[]) => void;
  onInteractionClick?: (lead: LeadData) => void;
  onDetailsClick?: (lead: LeadData) => void;
  onConvertClick?: (lead: LeadData) => void;
  onAssignClick?: (lead: LeadData, event: React.MouseEvent<HTMLButtonElement>) => void;
  teamMembers: TeamMember[]; // ✅ Add this line
}

type SortField = keyof LeadData;
type SortDirection = 'asc' | 'desc';

export const ListView = ({
  leads,
  selectedLeads,
  onLeadSelect,
  onSelectAll,
  onInteractionClick,
  onDetailsClick,
  onConvertClick,
  onAssignClick
}: ListViewProps) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Sorting logic
  const sortedLeads = [...leads].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle dates
    if (sortField === 'created_at' || sortField === 'converted_at') {
      aValue = new Date(aValue || '').getTime();
      bValue = new Date(bValue || '').getTime();
    }

    // Handle numbers
    if (sortField === 'lead_score' || sortField === 'probability') {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    }

    // Handle strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    const compareResult = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortDirection === 'asc' ? compareResult : -compareResult;
  });

  // Pagination
  const paginatedLeads = sortedLeads.slice(
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
      onSelectAll(paginatedLeads);
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
                  indeterminate={selectedLeads.size > 0 && selectedLeads.size < paginatedLeads.length}
                  checked={paginatedLeads.length > 0 && selectedLeads.size === paginatedLeads.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSort('name')}
                >
                  Lead
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />
                  )}
                </Box>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLeads.map((lead) => (
              <TableRow
                key={lead.id}
                hover
                sx={{
                  backgroundColor: lead.converted_to_customer_id ?
                    alpha(theme.palette.success.main, 0.05) : undefined
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedLeads.has(lead.id)}
                    onChange={() => onLeadSelect(lead.id)}
                    disabled={!!lead.converted_to_customer_id}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="subtitle2">
                      {lead.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {lead.company}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      {lead.email && (
                        <Tooltip title={lead.email}>
                          <EmailIcon fontSize="small" color="action" />
                        </Tooltip>
                      )}
                      {lead.phone && (
                        <Tooltip title={lead.phone}>
                          <PhoneIcon fontSize="small" color="action" />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={lead.converted_to_customer_id ? 'Converted' : lead.status}
                    size="small"
                    color={lead.converted_to_customer_id ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  {lead.pipeline_stage}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 60 }}>
                      <LinearProgress
                        variant="determinate"
                        value={lead.lead_score}
                        color={
                          lead.lead_score > 70 ? 'success' :
                          lead.lead_score > 40 ? 'warning' : 'primary'
                        }
                      />
                    </Box>
                    <Typography variant="caption">
                      {lead.lead_score}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(lead.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => onInteractionClick?.(lead)}
                    >
                      <AssignmentIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDetailsClick?.(lead)}
                    >
                      <BusinessIcon fontSize="small" />
                    </IconButton>
                    {!lead.converted_to_customer_id && (
                      <IconButton
                        size="small"
                        onClick={() => onConvertClick?.(lead)}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={leads.length}
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

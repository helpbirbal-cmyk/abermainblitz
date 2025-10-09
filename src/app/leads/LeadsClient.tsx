// src/app/leads/LeadsClient.tsx
'use client';

import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import SourceIcon from '@mui/icons-material/Source';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  timeline: string;
  message: string;
  source: string;
  demoType: string;
  status: string;
  created_at?: string;
}

interface LeadsClientProps {
  leads: Lead[];
}

export function LeadsClient({ leads }: LeadsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');

  // Filter leads based on search and filters
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.projectType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesTimeline = timelineFilter === 'all' || lead.timeline === timelineFilter;

      return matchesSearch && matchesStatus && matchesTimeline;
    });
  }, [leads, searchTerm, statusFilter, timelineFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'default';
      case 'Contacted': return 'primary';
      case 'Qualified': return 'secondary';
      case 'Customer': return 'success';
      default: return 'default';
    }
  };

  const getTimelineColor = (timeline: string) => {
    switch (timeline?.toLowerCase()) {
      case 'urgent': return 'error';
      case 'soon': return 'warning';
      case 'flexible': return 'success';
      default: return 'default';
    }
  };

  const getProjectTypeColor = (projectType: string) => {
    switch (projectType?.toLowerCase()) {
      case 'web development': return 'primary';
      case 'mobile app': return 'secondary';
      case 'e-commerce': return 'success';
      case 'consulting': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Lead Management
        </Typography>
        
        <Typography variant="h6" color="text.secondary">
          Total {leads.length} leads • Showing {filteredLeads.length}
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search by name, email, company, project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Timeline</InputLabel>
              <Select
                value={timelineFilter}
                label="Timeline"
                onChange={(e) => setTimelineFilter(e.target.value)}
              >
                <MenuItem value="all">All Timelines</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
                <MenuItem value="soon">Soon</MenuItem>
                <MenuItem value="flexible">Flexible</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Leads Grid */}
      <Grid container spacing={3}>
        {filteredLeads.map((lead) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={lead.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header with Avatar and Name */}
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40
                      }}
                    >
                      {lead.name?.charAt(0)?.toUpperCase() || 'L'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="600">
                        {lead.name || 'No Name'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {lead.company || 'No Company'}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack spacing={0.5} alignItems="flex-end">
                    <Chip
                      label={lead.status || 'New'}
                      color={getStatusColor(lead.status)}
                      size="small"
                    />
                    <Chip
                      label={lead.timeline || 'No timeline'}
                      color={getTimelineColor(lead.timeline)}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Box>

                {/* Contact Info */}
                <Stack spacing={1.5} mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {lead.email}
                    </Typography>
                  </Box>

                  {lead.projectType && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {lead.projectType}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                {/* Project Details */}
                <Box mb={2}>
                  {lead.demoType && (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <VideoLabelIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {lead.demoType}
                      </Typography>
                    </Box>
                  )}
                  {lead.source && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <SourceIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Source: {lead.source}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Message Preview */}
                {lead.message && (
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'grey.50',
                      mb: 2,
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Box display="flex" alignItems="flex-start" gap={1}>
                      <DescriptionIcon fontSize="small" color="action" sx={{ mt: 0.25 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {lead.message}
                      </Typography>
                    </Box>
                  </Paper>
                )}

                {/* Footer with Date and Action */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  pt={2}
                  sx={{ borderTop: 1, borderColor: 'grey.200', mt: 'auto' }}
                >
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'No date'}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    href={`/leads/${lead.id}`}
                    sx={{ textTransform: 'none' }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredLeads.length === 0 && (
        <Paper sx={{ p: 12, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No leads found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || statusFilter !== 'all' || timelineFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Leads from your website will appear here.'}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

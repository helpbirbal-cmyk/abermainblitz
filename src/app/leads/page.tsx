'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// MUI v7 imports
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

// Icons
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import SourceIcon from '@mui/icons-material/Source';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
  created_at?: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase
          .from('lead_assessment_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLeads(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <Typography>Loading leads...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, bgcolor: 'error.light' }}>
          <Typography variant="h6" gutterBottom color="error">
            Error loading leads
          </Typography>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Lead Management
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Total {leads.length} leads
        </Typography>
      </Box>

      {/* Leads Grid */}
      <Grid container spacing={3}>
        {leads.map((lead) => (
          <Grid item xs={12} md={6} lg={4} key={lead.id}>
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
                  <Chip
                    label={lead.timeline || 'No timeline'}
                    color={getTimelineColor(lead.timeline)}
                    size="small"
                  />
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
      {leads.length === 0 && (
        <Paper sx={{ p: 12, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No leads found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Leads from your website will appear here.
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

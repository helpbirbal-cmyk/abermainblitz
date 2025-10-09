'use client';

import { useRouter } from 'next/navigation';

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

// Icons
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import SourceIcon from '@mui/icons-material/Source';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CategoryIcon from '@mui/icons-material/Category';

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
  created_at: string;
}

interface LeadDetailClientProps {
  lead: Lead;
}

export function LeadDetailClient({ lead }: LeadDetailClientProps) {
  const router = useRouter();

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Back Button */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/leads')}
          sx={{ mb: 3 }}
        >
          Back to All Leads
        </Button>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
              {lead.name?.charAt(0)?.toUpperCase() || 'L'}
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {lead.name || 'No Name'}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {lead.company || 'No Company'}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={lead.timeline || 'No timeline'}
            color={getTimelineColor(lead.timeline)}
            //size="large"
            sx={{ fontSize: '1rem', padding: '8px 16px' }}
          />
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Lead Information */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Contact Information Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                Contact Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {lead.email}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <BusinessIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Company</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {lead.company || 'Not specified'}
                    </Typography>
                  </Box>
                </Box>

                {lead.source && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <SourceIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Source</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {lead.source}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Project Details Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon />
                Project Details
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Project Type
                  </Typography>
                  <Chip
                    label={lead.projectType || 'Not specified'}
                    color={getProjectTypeColor(lead.projectType)}
                    variant="outlined"
                    size="medium"
                  />
                </Box>

                {lead.demoType && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <VideoLabelIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Demo Type</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {lead.demoType}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box display="flex" alignItems="center" gap={2}>
                  <ScheduleIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Timeline</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {lead.timeline || 'Not specified'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Message Card */}
          {lead.message && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon />
                  Message
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    bgcolor: 'grey.50',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6
                  }}
                >
                  <Typography variant="body1">
                    {lead.message}
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Meta Information & Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Timeline Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon />
                Timeline
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {new Date(lead.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label="New Lead"
                    color="primary"
                    variant="filled"
                    size="small"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<EmailIcon />}
                  onClick={() => window.open(`mailto:${lead.email}`, '_blank')}
                >
                  Send Email
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CalendarTodayIcon />}
                >
                  Schedule Meeting
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<DescriptionIcon />}
                >
                  Add Note
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Divider,
  LinearProgress,
  Box,
  Tabs,
  Tab,
  TextField,
  Card,
  CardHeader,
  CardContent,
  useTheme
} from '@mui/material';
import {
  Business as BusinessIcon,
  CheckCircle as CheckIcon,
  Link as LinkIcon,
  Timeline as TimelineIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import Grid from '@mui/material/Grid'; // use as <Grid size={{ xs: 12, sm: 6 }}>
import { StageChangeLog } from '@/components/leads/StageChangeLog';
import { ProfilerPanel } from '@/components/leads/ProfilerPanel';
import { LeadBriefPanel } from '@/components/leads/LeadBriefPanel';
import { fetchInteractionsWithCreator } from '@/lib/supabase/interactions';
import type { LeadData } from '@/types';
import { fetchBrief } from '@/lib/fetchBrief';
import type { Brief } from '@/types';

type Props = {
  open: boolean;
  onClose: () => void;
  lead: LeadData | null;
  onUpdateLead: (leadId: string, updates: Partial<LeadData>) => Promise<void>;
};

export function LeadDetailsDialog({ open, onClose, lead, onUpdateLead }: Props) {
  const theme = useTheme();
  const [tab, setTab] = useState(0); // 0=Details, 1=Profiler, 2=Brief
  const [localLead, setLocalLead] = useState<LeadData | null>(lead);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalLead(lead || null);
    if (lead) {
      fetchInteractionsWithCreator(lead.id).then(setInteractions).catch(() => setInteractions([]));
    } else {
      setInteractions([]);
    }
  }, [lead]);

  const loadBrief = async (force = false) => {
    if (!lead) return;
    setLoading(true);
    setError(null);
    try {
      const { brief, updated_at } = await fetchBrief(lead.id, force);
      setBrief(brief);
      setUpdatedAt(updated_at ?? null);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load brief');
      setBrief(null);
      setUpdatedAt(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && lead) {
      loadBrief();
    } else {
      setBrief(null);
      setUpdatedAt(null);
      setError(null);
      setLoading(false);
    }
  }, [open, lead?.id]);

  const scoreColor =
    (lead?.lead_score ?? 0) > 70 ? 'success' : (lead?.lead_score ?? 0) > 40 ? 'warning' : 'error';
  const formattedDate = (d?: string) => (d ? new Date(d).toLocaleString() : 'Unknown');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Lead details</Typography>
          {lead?.converted_to_customer_id ? (
            <Chip label="Converted" color="success" icon={<CheckIcon />} />
          ) : (
            <Chip label={lead?.status ?? 'Unknown'} color="primary" variant="outlined" />
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Tabs
          value={tab}
          onChange={(_, val) => setTab(val)}
          sx={{
            mb: 2,
            '& .MuiTab-root.Mui-selected': {
              color: theme.palette.primary.contrastText,
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          <Tab label="Details" sx={{ minHeight: 44, px: 2 }} />
          <Tab label="Profiler" sx={{ minHeight: 44, px: 2 }} />
          <Tab label="Brief" sx={{ minHeight: 44, px: 2 }} />
        </Tabs>

        {/* DETAILS TAB */}
        {tab === 0 && localLead && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Basic Info */}
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader avatar={<BusinessIcon />} title="Basic information" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Name"
                      fullWidth
                      size="small"
                      value={localLead?.name || ''}
                      onChange={(e) =>
                        setLocalLead((prev) => prev && { ...prev, name: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Company"
                      fullWidth
                      size="small"
                      value={localLead?.company || ''}
                      onChange={(e) =>
                        setLocalLead((prev) => prev && { ...prev, company: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Email"
                      fullWidth
                      size="small"
                      value={localLead?.email || ''}
                      onChange={(e) =>
                        setLocalLead((prev) => prev && { ...prev, email: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Phone"
                      fullWidth
                      size="small"
                      value={localLead?.phone || ''}
                      onChange={(e) =>
                        setLocalLead((prev) => prev && { ...prev, phone: e.target.value })
                      }
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (!localLead) return;
                      onUpdateLead(localLead.id, {
                        name: localLead.name,
                        email: localLead.email,
                        phone: localLead.phone,
                        company: localLead.company,
                      });
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Lead Quality */}
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader title="Lead quality" />
              <Divider />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={lead?.lead_score ?? 0}
                      color={scoreColor}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Chip
                    label={`Score: ${lead?.lead_score ?? 0}`}
                    color={scoreColor}
                    variant="outlined"
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Pipeline stage"
                  value={lead?.pipeline_stage ?? ''}
                  InputProps={{ readOnly: true }}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>

            {/* Source Info */}
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader avatar={<LinkIcon />} title="Source information" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Lead type"
                      value={lead?.lead_type ?? ''}
                      InputProps={{ readOnly: true }}
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Source"
                      value={lead?.source || 'N/A'}
                      InputProps={{ readOnly: true }}
                      size="small"
                    />
                  </Grid>
                  {lead?.page_url && (
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Landing page"
                        value={lead.page_url}
                        InputProps={{ readOnly: true }}
                        size="small"
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader avatar={<TimelineIcon />} title="Timeline" />
              <Divider />
              <CardContent>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Lead created: {formattedDate(lead?.created_at)}
                </Typography>

                {Array.isArray(lead?.stage_changes) && lead.stage_changes.length > 0 ? (
                  <StageChangeLog stageChanges={lead.stage_changes} />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No stage changes logged yet.
                  </Typography>
                )}

                {lead?.converted_to_customer_id && lead?.converted_at && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Converted: {formattedDate(lead.converted_at)}
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Interactions */}
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader avatar={<HistoryIcon />} title="Interactions history" />
              <Divider />
              <CardContent>
                {interactions.length > 0 ? (
                  interactions.map((i) => (
                    <Box key={i.id} sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {String(i.interaction_type || '').toUpperCase()} —{' '}
                        {formattedDate(i.created_at)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        by {i.creator_name || i.creator_email || 'Unknown'}
                      </Typography>
                      {i.description && (
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {i.description}
                        </Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No interactions logged yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        )}

        {/* PROFILER TAB */}
        {tab === 1 && lead && (
          <ProfilerPanel leadId={lead.id} />
        )}

        {/* BRIEF TAB */}
        {tab === 2 && (
          <Box>
            {loading && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress />
              </Box>
            )}
            <LeadBriefPanel
              brief={brief}
              updatedAt={updatedAt}
              error={error}
              loading={loading}
              onRetry={() => loadBrief(true)}
            />
            {error && (
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => loadBrief(true)}>
                  Retry brief
                </Button>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

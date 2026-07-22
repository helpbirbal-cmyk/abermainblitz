// src/components/leads/ProfilerPanel.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Button, Divider } from '@mui/material';
import { fetchBrief } from '@/lib/fetchBrief';
import type { Brief } from '@/types';

export function ProfilerPanel({ leadId }: { leadId: string }) {
  const [brief, setBrief] = useState<Brief | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const didFetch = useRef(false);

  const loadBrief = async (force = false) => {
    setLoading(true);
    setErr(null);
    try {
      const { brief, updated_at } = await fetchBrief(leadId, force);
      setBrief(brief);
      setUpdatedAt(updated_at ?? null);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load brief');
      setBrief(null);
      setUpdatedAt(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!didFetch.current) {
      loadBrief();
      didFetch.current = true;
    }
  }, [leadId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (err) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{err}</Typography>
        <Button onClick={() => loadBrief(true)} sx={{ mt: 1 }}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Contact information</Typography>
        <Button size="small" onClick={() => loadBrief(true)}>Regenerate brief</Button>
      </Box>

      <Typography>Email: {brief?.email || 'Not provided'}</Typography>
      <Typography>Phone: {brief?.phone || 'Not provided'}</Typography>
      {updatedAt && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Last updated: {new Date(updatedAt).toLocaleString()}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Lead snapshot</Typography>
      <Typography>{brief?.snapshot || 'No snapshot available'}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Firmographic & technographic</Typography>
      <Typography>{brief?.firmographics || 'No firmographic data'}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Persona & intent analysis</Typography>
      <Typography>{brief?.persona || 'No persona analysis'}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Sales advisor summary</Typography>
      <Typography>{brief?.summary || 'No brief available'}</Typography>
    </Box>
  );
}

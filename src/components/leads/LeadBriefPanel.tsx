'use client';

import {
  Box,
  Typography,
  Divider,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Collapse,
  Button
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import SummarizeIcon from '@mui/icons-material/Summarize';
import InsightsIcon from '@mui/icons-material/Insights';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import MemoryIcon from '@mui/icons-material/Memory';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import { useState } from 'react';
import type { Brief } from '@/types';

type Props = {
  brief: Brief | null;
  updatedAt: string | null;
  error: string | null;
  loading: boolean;
  onRetry: () => void;
};

export function LeadBriefPanel({ brief, updatedAt, error, loading, onRetry }: Props) {
  const [expandFirmo, setExpandFirmo] = useState(false);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading brief…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
        {onRetry && (
          <Button onClick={onRetry} sx={{ mt: 1 }}>
            Retry
          </Button>
        )}
      </Box>
    );
  }

  if (!brief) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>No brief available yet.</Typography>
        {onRetry && (
          <Button onClick={onRetry} sx={{ mt: 1 }}>
            Generate brief
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Contact info */}
      <Card sx={{ borderRadius: 2 }}>
        <CardHeader avatar={<EmailIcon color="primary" />} title="Contact" />
        <Divider />
        <CardContent>
          <Typography variant="body1" color="text.primary">
            {brief.email || 'No email available'}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {brief.domain || 'No domain available'}
          </Typography>
        </CardContent>
      </Card>

      {/* Snapshot */}
      <Card sx={{ borderRadius: 2 }}>
        <CardHeader avatar={<InsightsIcon color="primary" />} title="Lead snapshot" />
        <Divider />
        <CardContent>
          <Typography variant="body1" color="text.primary">
            {brief.snapshot || 'No snapshot available'}
          </Typography>
        </CardContent>
      </Card>

      {/* Firmographics */}
      <Card sx={{ borderRadius: 2 }}>
        <CardHeader
          avatar={<BusinessIcon color="primary" />}
          title="Firmographic & technographic"
          action={
            <IconButton onClick={() => setExpandFirmo(!expandFirmo)}>
              <ExpandMoreIcon />
            </IconButton>
          }
        />
        <Divider />
        <CardContent>
          <Collapse in={expandFirmo} collapsedSize={80}>
            <Typography variant="body1" color="text.primary">
              {brief.firmographics || 'No firmographic data'}
            </Typography>
            {brief.technographics && (
              <Typography variant="body1" color="text.primary" sx={{ mt: 1 }}>
                {brief.technographics}
              </Typography>
            )}
          </Collapse>
        </CardContent>
      </Card>

      {/* Technology stack */}
      <Card sx={{ borderRadius: 2 }}>
        <CardHeader avatar={<MemoryIcon color="primary" />} title="Technology stack" />
        <Divider />
        <CardContent>
          <Typography variant="body1" color="text.primary">
            {brief.technology_stack || 'No technology stack data'}
          </Typography>
        </CardContent>
      </Card>

      {/* Partnerships & suppliers */}
      <Card sx={{ borderRadius: 2 }}>
        <CardHeader
          avatar={<GroupWorkIcon color="primary" />}
          title="Partnerships & suppliers"
        />
        <Divider />
        <CardContent>
          <Typography variant="body1" color="text.primary">
            {brief.partnerships_suppliers || 'No partnerships/suppliers data'}
          </Typography>
        </CardContent>
      </Card>

      {/* Persona & intent */}
      <Card sx={{ borderRadius: 2 }}>
        <CardHeader avatar={<PersonIcon color="primary" />} title="Persona & intent analysis" />
        <Divider />
        <CardContent>
          <Typography variant="body1" color="text.primary">
            {brief.persona || 'No persona analysis'}
          </Typography>
          {brief.intent && (
            <Typography variant="body1" color="text.primary" sx={{ mt: 1 }}>
              {brief.intent}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Advisor summary */}
      <Card sx={{ borderRadius: 2 }}>
        <CardHeader avatar={<SummarizeIcon color="primary" />} title="Sales advisor summary" />
        <Divider />
        <CardContent>
          <Typography variant="body1" color="text.primary">
            {brief.advisor_summary || brief.summary || 'No summary available'}
          </Typography>
          {updatedAt && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1 }}
            >
              Last updated: {new Date(updatedAt).toLocaleString()}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

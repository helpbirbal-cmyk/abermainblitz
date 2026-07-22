'use client';

import { Box, Typography, Chip, Stack, Button } from '@mui/material';
import type { LeadData } from '@/types';

interface CustomerLeadsPanelProps {
  leads: LeadData[];
  onAddLead: () => void;
}

export const CustomerLeadsPanel = ({ leads, onAddLead }: CustomerLeadsPanelProps) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        Leads ({leads?.length || 0})
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
        {leads?.map((lead) => (
          <Chip key={lead.id} label={lead.name} size="small" />
        ))}
      </Stack>
      <Button size="small" sx={{ mt: 1 }} onClick={onAddLead}>
        + New Lead
      </Button>
    </Box>
  );
};

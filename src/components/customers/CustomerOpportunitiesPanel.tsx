'use client';

import { Box, Typography, Chip, Stack, Button } from '@mui/material';
import type { Opportunity } from '@/types';

interface CustomerOpportunitiesPanelProps {
  opportunities: Opportunity[];
  onAddOpportunity: () => void;
}

export const CustomerOpportunitiesPanel = ({
  opportunities,
  onAddOpportunity,
}: CustomerOpportunitiesPanelProps) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        Opportunities ({opportunities?.length || 0})
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
        {opportunities?.map((opp) => (
          <Chip key={opp.id} label={opp.name} size="small" color="primary" />
        ))}
      </Stack>
      <Button size="small" sx={{ mt: 1 }} onClick={onAddOpportunity}>
        + New Opportunity
      </Button>
    </Box>
  );
};

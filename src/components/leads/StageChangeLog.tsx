// src/components/leads/StageChangeLog.tsx
import { Box, Typography } from '@mui/material';

export const StageChangeLog = ({ stageChanges }: { stageChanges: any[] }) => {
  if (!stageChanges || stageChanges.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No stage changes logged yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {stageChanges.map((change, idx) => (
        <Box key={idx} sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={500}>
            Stage Change: {change.from || '—'} → {change.to}
            {change.changed_by_name && ` — by ${change.changed_by_name}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(change.changed_at).toLocaleString()}
          </Typography>
          {change.notes && (
            <Typography variant="caption" color="text.secondary">
              📝 {change.notes}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

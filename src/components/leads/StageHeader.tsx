import { Box, Typography } from '@mui/material';

export function StageHeader({ name, color }: { name: string; color: string }) {
  return (
    <Box sx={{ backgroundColor: color, p: 1.5, borderRadius: 1 }}>
      <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
        {name}
      </Typography>
    </Box>
  );
}

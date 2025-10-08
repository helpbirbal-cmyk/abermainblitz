// src/components/Calculators/components/IndustryInfo.tsx - Simpler Version
import React from 'react';
import {
  Box,
  Typography,
  useTheme
} from '@mui/material';
import { IndustryBenchmark } from '../types/ROITypes';

interface IndustryInfoProps {
  benchmark: IndustryBenchmark;
}

export const IndustryInfo: React.FC<IndustryInfoProps> = ({ benchmark }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        backgroundColor: isDarkMode ? 'grey.800' : 'grey.50',
        borderRadius: 1,
        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 'bold',
          color: isDarkMode ? 'grey.100' : 'grey.800',
          mb: 1
        }}
      >
        {benchmark.name} Benchmarks
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: isDarkMode ? 'grey.300' : 'grey.600',
          mb: 1,
          lineHeight: 1.4
        }}
      >
        {benchmark.description}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: isDarkMode ? 'grey.400' : 'grey.500'
          }}
        >
          {benchmark.typicalTesters[0]}-{benchmark.typicalTesters[1]} testers | {benchmark.typicalReleases[0]}-{benchmark.typicalReleases[1]} releases/month
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: isDarkMode ? 'grey.400' : 'grey.500'
          }}
        >
          Regulatory: {benchmark.regulatoryRequirements} | Complexity: {"★".repeat(benchmark.testingComplexity)}
        </Typography>
      </Box>
    </Box>
  );
};

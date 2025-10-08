// src/components/ROITool.tsx
'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import OTTCalculator from './OTTCalculator';
import PaymentCalculator from './PaymentCalculator';
import { ROICalculator } from '@/components/Calculators/ROICalculator';

type CalculatorType = 'ott' | 'payment' | 'agenticaitest';

interface ROIToolProps {
  openModal: (type: 'general' | 'bfsi' | 'ott' | 'payment') => void;
}

export default function ROITool({ openModal }: ROIToolProps) {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>('agenticaitest');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Get dark mode from MUI theme
  const isDarkMode = theme.palette.mode === 'dark';

  const handleCalculatorChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: CalculatorType,
  ) => {
    if (newType !== null) {
      setCalculatorType(newType);
    }
  };

  return (
    <Box
      id="calculator"
      component="section"
      sx={{
        py: 4,
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)', // Centers the full-width section
        backgroundColor: 'background.default',
        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: 2,
        overflow: 'hidden' // Prevents horizontal scroll
      }}
    >
      <Box
        sx={{
          width: '100%',
          px: { xs: 2, sm: 3, md: 4, lg: 6 }, // Responsive horizontal padding
          maxWidth: '100%',
          mx: 'auto'
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: isDarkMode ? 'black' : 'white',
            borderRadius: 2,
            boxShadow: 3,
            
            width: '100%',
            maxWidth: '100%'
          }}
        >
          {/* Calculator Header with Tabs */}
          <CalculatorIntro
            calculatorType={calculatorType}
            onCalculatorChange={handleCalculatorChange}
            isDarkMode={isDarkMode}
          />

          {/* Calculator Content */}
          <Box sx={{ mt: 3, width: '100%' }}>
            {calculatorType === 'ott' ? (
              <OTTCalculator onRequestDemo={() => openModal('ott')} />
            ) : calculatorType === 'payment' ? (
              <PaymentCalculator onRequestDemo={() => openModal('payment')} />
            ) : calculatorType === 'agenticaitest' ? (
              <ROICalculator onRequestDemo={() => openModal('general')} />
            ) : null}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

// Calculator Intro Tabs Component
interface CalculatorIntroProps {
  calculatorType: CalculatorType;
  onCalculatorChange: (event: React.MouseEvent<HTMLElement>, newType: CalculatorType) => void;
  isDarkMode: boolean;
}

function CalculatorIntro({ calculatorType, onCalculatorChange, isDarkMode }: CalculatorIntroProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        textAlign: 'center',
        mb: 4,
        backgroundColor: isDarkMode ? 'grey.900' : 'white',
        borderRadius: 2,
        p: 3,
        boxShadow: 1,
        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        width: '100%'
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
          fontWeight: 'bold',
          color: isDarkMode ? 'white' : 'black',
          mb: 3,
          background: isDarkMode
            ? 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)'
            : 'linear-gradient(135deg, #000000 0%, #475569 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Value Estimator
      </Typography>

      {/* Calculator Type Toggle Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <ToggleButtonGroup
          value={calculatorType}
          exclusive
          onChange={onCalculatorChange}
          aria-label="calculator type"
          sx={{
            backgroundColor: isDarkMode ? 'grey.800' : 'grey.100',
            borderRadius: 2,
            p: 0.5,
            gap: 0.5,
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
            '& .MuiToggleButton-root': {
              px: { xs: 2, sm: 3, md: 4 },
              py: 1.5,
              border: 'none',
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              color: isDarkMode ? 'grey.300' : 'grey.700',
              transition: 'all 0.2s ease-in-out',
              minWidth: { xs: '100px', sm: '120px', md: '140px' },
              '&:hover': {
                backgroundColor: isDarkMode ? 'grey.700' : 'grey.200',
                color: isDarkMode ? 'white' : 'black',
                transform: 'translateY(-1px)',
              },
              '&.Mui-selected': {
                background: isDarkMode
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                boxShadow: isDarkMode
                  ? '0 4px 14px 0 rgba(99, 102, 241, 0.3)'
                  : '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #5858e6 0%, #7c3aed 100%)'
                    : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: isDarkMode
                    ? '0 6px 20px 0 rgba(99, 102, 241, 0.4)'
                    : '0 6px 20px 0 rgba(59, 130, 246, 0.4)',
                }
              }
            }
          }}
        >
          <ToggleButton value="payment" aria-label="payments calculator">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="button" sx={{ fontWeight: 600 }}>
                Payments
              </Typography>
            </Box>
          </ToggleButton>

          <ToggleButton value="agenticaitest" aria-label="qa testing calculator">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="button" sx={{ fontWeight: 600 }}>
                QA Testing
              </Typography>
            </Box>
          </ToggleButton>

          <ToggleButton value="ott" aria-label="streaming calculator">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="button" sx={{ fontWeight: 600 }}>
                Streaming
              </Typography>
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}

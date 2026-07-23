// src/components/CostCalculators.tsx
'use client';

import { useState } from 'react';
import OTTCalculator from './OTTCalculator';
import PaymentCalculator from './PaymentCalculator';
import { ROICalculator} from '@/components/Calculators/ROICalculator'

import { Box, useTheme } from '@mui/material' // new add for bgcolor fix
import CalculatorIntro from './ui/CalculatorIntroTabs';
// import {useTheme as useNextTheme} from "next-themes";

type CalculatorType = 'ott' | 'payment' | 'agenticaitest';

interface CostCalculatorsProps {
  openModal: (type: 'general' | 'bfsi' | 'ott' | 'payment') => void;
}

export default function CostCalculators({ openModal }: CostCalculatorsProps) {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>('agenticaitest');

    // 1. Use MUI's theme hook
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'dark'

  return (
    //<section id="calculator" className="py-1 bg-white dark:bg-black shadow-md border-black dark:border-white ">
      <Box
          id="calculatorcost"
          component="section"
          sx={{
              py: 8,
              backgroundColor: isDarkMode ? 'black' : 'white',
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              overflow: 'hidden'
          }}
        >
        <Box
            sx={{
                width: '100%',
                px: { xs: 2, sm: 3, md: 4, lg: 6 },
                maxWidth: '100%',
                mx: 'auto'
            }}
            >
        <CalculatorIntro
          calculatorType={calculatorType}
          setCalculatorType={setCalculatorType}
        />

        {calculatorType === 'ott' ? (
      <OTTCalculator onRequestDemo={() => openModal('ott')} />
  ) : calculatorType === 'payment' ? (
      <PaymentCalculator onRequestDemo={() => openModal('payment')} />
  ) : calculatorType === 'agenticaitest' ? (
      <ROICalculator onRequestDemo={() => openModal('general')}  />
  ) : null}
      </Box>
    </Box>
  );
}

// src/components/CostCalculators.tsx
'use client';

import { useState } from 'react';
import OTTCalculator from './OTTCalculator';
import PaymentCalculator from './PaymentCalculator';
import { ROICalculator} from '@/components/Calculators/ROICalculator'


import CalculatorIntro from './ui/CalculatorIntroTabs';
import {useTheme as useNextTheme} from "next-themes";

type CalculatorType = 'ott' | 'payment' | 'agenticaitest';

interface CostCalculatorsProps {
  openModal: (type: 'general' | 'bfsi' | 'ott' | 'payment') => void;
}

export default function CostCalculators({ openModal }: CostCalculatorsProps) {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>('agenticaitest');

  return (
    //<section id="calculator" className="py-1 bg-white dark:bg-black shadow-md border-black dark:border-white ">
      <section
          id="calculator"
          className="py-8 w-screen -ml-[calc(50vw-50%)] overflow-hidden bg-white dark:bg-black text-black dark:text-white"
      >
          <div className="container mx-auto px-4 bg-white dark:bg-black">
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
      </div>
    </section>
  );
}

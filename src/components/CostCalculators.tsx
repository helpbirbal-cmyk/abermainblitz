// src/components/CostCalculators.tsx
'use client';

import { useState } from 'react';
import OTTCalculator from './OTTCalculator';
import PaymentCalculator from './PaymentCalculator';
import { ROICalculator} from '@/components/Calculators/ROICalculator'


import CalculatorIntro from './ui/CalculatorIntroTabs';

type CalculatorType = 'ott' | 'payment' | 'agenticaitest';

interface CostCalculatorsProps {
  openModal: (type: 'general' | 'bfsi' | 'ott' | 'payment') => void;
}

export default function CostCalculators({ openModal }: CostCalculatorsProps) {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>('agenticaitest');

  return (
    <section id="calculator" className="py-4 bg-white dark:bg-black shadow-md border-black dark:border-white ">
      <div className="container mx-auto p-2 bg-blue-100 dark:bg-gray-800 rounded-xl shadow-md   ">

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

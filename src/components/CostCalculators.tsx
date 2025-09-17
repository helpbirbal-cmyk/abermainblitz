// components/CostCalculators.tsx
'use client';

import { useState } from 'react';
import OTTCalculator from './OTTCalculator';
import PaymentCalculator from './PaymentCalculator';
import CalculatorIntro from './ui/CalculatorIntroTabs';

type CalculatorType = 'ott' | 'payment';

interface CostCalculatorsProps {
  openModal: (type: 'general' | 'bfsi' | 'ott' | 'payment') => void;
}

export default function CostCalculators({ openModal }: CostCalculatorsProps) {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>('payment');

  return (
    <section id="calculator" className="py-4 bg-white dark:bg-black shadow-md border-black dark:border-white ">
      <div className="container mx-auto p-2 bg-blue-100 dark:bg-gray-800 rounded-xl shadow-md   ">
        {/* Unified Calculator Introduction - REPLACES the duplicate buttons */}
        <CalculatorIntro
          calculatorType={calculatorType}
          setCalculatorType={setCalculatorType}
        />

        {calculatorType === 'ott' ? (
          <OTTCalculator onRequestDemo={() => openModal('ott')} />
        ) : (
          <PaymentCalculator onRequestDemo={() => openModal('payment')} />
        )}
      </div>
    </section>
  );
}

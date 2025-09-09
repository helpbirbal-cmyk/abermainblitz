// components/CostCalculators.tsx
'use client';

import { useState } from 'react';
import OTTCalculator from './OTTCalculator';
import PaymentCalculator from './PaymentCalculator';
import CalculatorIntro from './ui/CalculatorIntro';

type CalculatorType = 'ott' | 'payment';

interface CostCalculatorsProps {
  openModal: (type: 'general' | 'bfsi' | 'ott' | 'payment') => void;
}

export default function CostCalculators({ openModal }: CostCalculatorsProps) {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>('ott');

  return (
    <section id="calculator" className="py-16 bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="container mx-auto px-4">
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

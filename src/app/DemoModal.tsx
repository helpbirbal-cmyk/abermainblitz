'use client';

import { InlineWidget } from 'react-calendly';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorType: 'ott' | 'payment';
}

export default function DemoModal({ isOpen, onClose, calculatorType }: DemoModalProps) {
  // Replace these with your actual Calendly URLs
  const calendlyUrls = {
    ott: 'https://calendly.com/helpbirbal/15-minute-ott-demo-clone',
    payment: 'https://calendly.com/helpbirbal/30min'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Schedule Your Demo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <div className="h-[600px]">
          <InlineWidget
            url={calendlyUrls[calculatorType]}
            styles={{
              height: '100%',
              width: '100%',
            }}
          />
        </div>
      </div>
    </div>
  );
}
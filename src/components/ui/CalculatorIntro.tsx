// components/ui/CalculatorIntro.tsx
interface CalculatorIntroProps {
  calculatorType: 'ott' | 'payment';
  setCalculatorType: (type: 'ott' | 'payment') => void;
}

export default function CalculatorIntro({ calculatorType, setCalculatorType }: CalculatorIntroProps) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
      Value Estimator
      </h2>
      <p className="text-md text-gray-700 max-w-3xl mx-auto mb-6">
        Comprehensive financial modeling for OTT Streaming and Online Payment  optimization
      </p>

      {/* Calculator Type Cards - Compact Version */}
      <div className="flex justify-center gap-4 max-w-md mx-auto mb-6">





        <button
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
            calculatorType === 'payment'
              ? "bg-gradient-finance text-white shadow-md"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setCalculatorType('payment')}
        >
          <span className="text-lg">💳</span>
          <span className="font-medium text-sm">Online Payments</span>
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
            calculatorType === 'ott'
              ? "bg-gradient-media text-white shadow-md" : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setCalculatorType('ott')}
        >
          <span className="text-lg">🎬</span>
          <span className="font-medium text-sm">OTT Streaming</span>
        </button>

      </div>
    </div>
  );
}

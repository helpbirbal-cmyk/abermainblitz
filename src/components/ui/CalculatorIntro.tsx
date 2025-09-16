// components/ui/CalculatorIntro.tsx
interface CalculatorIntroProps {
  calculatorType: 'ott' | 'payment';
  setCalculatorType: (type: 'ott' | 'payment') => void;
}

export default function CalculatorIntro({ calculatorType, setCalculatorType }: CalculatorIntroProps) {
  return (
    <div className="text-center mb-8 bg-white dark:bg-black rounded-xl shadow-md  border-black dark:border-white">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
      Value Estimator
      </h2>
      <p className="text-md text-black dark:text-white max-w-3xl mx-auto mb-6">
        Comprehensive financial modeling for OTT Streaming and Online Payment  optimization
      </p>

      {/* Calculator Type Cards - Compact Version */}
      <div className="flex justify-center gap-4 max-w-md mx-auto mb-6">


        <button
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
            calculatorType === 'payment'
              ? "bg-gradient-finance text-white shadow-md"
              : "text-black  dark:text-white hover:bg-gradient-media dark:hover:bg-gradient-media h hover:text-white hover:dark:text-yellow-300"
          }`}
          onClick={() => setCalculatorType('payment')}
        >
          <span className="text-lg">💳</span>
          <span className="font-medium text-sm">Online Payments</span>
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
            calculatorType === 'ott'
              ? "bg-gradient-media text-white shadow-md"
              : "text-black dark:text-white hover:bg-gradient-media hover:text-black hover:dark:bg-gradient-media  hover:dark:text-white"
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

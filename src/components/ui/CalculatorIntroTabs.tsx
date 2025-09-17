// components/ui/CalculatorIntro.tsx
interface CalculatorIntroProps {
  calculatorType: 'ott' | 'payment';
  setCalculatorType: (type: 'ott' | 'payment') => void;
}

export default function CalculatorIntro({ calculatorType, setCalculatorType }: CalculatorIntroProps) {
  return (
    <div className="text-center mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md  border-black dark:border-white">
      <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4">
      Value Estimator
      </h2>
      <p className="text-md text-black dark:text-white max-w-3xl mx-auto mb-6">
        Comprehensive financial modeling for OTT Streaming and Online Payment  optimization
      </p>

      {/* Calculator Type Cards - Compact Version */}
      <div className="flex justify-center gap-0 mx-auto mb-6 rounded-lg border-4 border-white  bg-white w-fit">

        <button
          className={`flex items-center gap-2  px-3 py-3  rounded-sm transition-all ${
            calculatorType === 'payment'
              ? "bg-gradient-finance text-white shadow-md"
              : "text-black   hover:text-white hover:bg-gray-100 dark:hover:bg-white  hover:dark:text-black"
          }`}
          onClick={() => setCalculatorType('payment')}
        >
          <span className="text-lg">💳</span>
          <span className="font-medium text-sm">Online Payments</span>
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-3 rounded-sm transition-all ${
            calculatorType === 'ott'
              ? "bg-gradient-media text-white shadow-md"
              : "text-black  hover:text-white hover:bg-red-600 dark:hover:bg-white  hover:dark:text-black "
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

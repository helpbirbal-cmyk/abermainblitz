// components/ui/CalculatorIntro.tsx
interface CalculatorIntroProps {
  calculatorType: 'ott' | 'payment' | 'agenticaitest';
  setCalculatorType: (type: 'ott' | 'payment' | 'agenticaitest') => void;
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
        className={`flex items-center gap-2 px-3 py-3 rounded-sm transition-all ${
          calculatorType === 'agenticaitest'
            ? "bg-green-600 text-white shadow-md"
            : "text-black  hover:text-white hover:bg-red-600 dark:hover:bg-white  hover:dark:text-black "
        }`}
        onClick={() => setCalculatorType('agenticaitest')}
      >
        <span className="text-lg">
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M9 2a1 1 0 0 0-1 1H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2a1 1 0 0 0-1-1H9Zm1 2h4v2h1a1 1 0 1 1 0 2H9a1 1 0 0 1 0-2h1V4Zm5.707 8.707a1 1 0 0 0-1.414-1.414L11 14.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd"/>
          </svg>
        </span>
        <span className="font-medium text-sm">Automation</span>
      </button>


        <button
          className={`flex items-center gap-2  px-3 py-3  rounded-sm transition-all ${
            calculatorType === 'payment'
              ? "bg-gradient-finance text-white shadow-md"
              : "text-black   hover:text-white hover:bg-gray-100 dark:hover:bg-white  hover:dark:text-black"
          }`}
          onClick={() => setCalculatorType('payment')}
        >
          <span className="text-lg">
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z"/>
            </svg>
          </span>
          <span className="font-medium text-sm">Payments</span>
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-3 rounded-sm transition-all ${
            calculatorType === 'ott'
              ? "bg-gradient-media text-white shadow-md"
              : "text-black  hover:text-white hover:bg-red-600 dark:hover:bg-white  hover:dark:text-black "
          }`}
          onClick={() => setCalculatorType('ott')}
        >
          <span className="text-lg">
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"/>
            </svg>
          </span>

          <span className="font-medium text-sm">Streaming</span>
        </button>



      </div>
    </div>
  );
}

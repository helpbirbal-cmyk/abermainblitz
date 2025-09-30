// src/components/CTASection.tsx
interface CtaSectionProps {
  title: string;
  description: string;
  openModal: (type?: 'general' | 'bfsi' | 'ott' | 'payment') => void;
  // Remove buttonText and onButtonClick since they're not used
}

export default function CTASection({
  title,
  description,
  openModal
}: CtaSectionProps) {
  return (
    <section className="p-20 bg-white text-black dark:bg-gray-800 dark:text-white rounded-l border border-blue-400 w-full m-1">
      <div className="container mx-auto px-4 text-center">
        {/*
          FIX: Change text-6xl to apply only on medium screens and up (md:text-6xl).
          Use a smaller size for mobile by default (e.g., text-4xl or text-5xl).
        */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">{title}</h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto">{description}</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">

          <button onClick={() => openModal('ott')} className="transition delay-150 duration-300 ease-in-out ring-2 ring-red-500 bg-blue-700 text-white border-2 border-white px-8 py-3 !rounded-lg font-semibold transition-colors duration-300 hover:bg-white hover:text-black hover:border-black">
            Book Demo
          </button>

        </div>
      </div>

        <input type="range" min={0} max="100" defaultValue="40" className="range text-blue-300 [--range-bg:media] [--range-thumb:media] [--range-fill:0] w-full" />
        <input type="checkbox" defaultChecked className="toggle" />
        <input type="range" min="0" max="100" defaultValue="40" className="range text-blue-300 [--range-bg:orange] [--range-thumb:blue] [--range-fill:0] w-full" />
    </section>
  );
}

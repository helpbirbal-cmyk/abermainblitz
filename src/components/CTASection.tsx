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
    <section className="py-20 bg-white text-black dark:bg-black dark:text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-6xl font-bold mb-6">{title}</h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto">{description}</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button onClick={() => openModal('bfsi')} className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 hover:bg-white hover:text-black hover:border-black">
            Book BFSI Demo
          </button>
          <button onClick={() => openModal('ott')} className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 hover:bg-white hover:text-black hover:border-black">
            Book OTT Demo
          </button>
        </div>
      </div>
    </section>
  );
}

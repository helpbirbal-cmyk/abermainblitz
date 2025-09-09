// components/ui/CtaSection.tsx
interface CtaSectionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  openModal: (type?: 'general' | 'bfsi' | 'ott' | 'payment') => void;
}


export default function CtaSection({
  title,
  description,
  buttonText,
  onButtonClick,
  openModal
}: CtaSectionProps) {
  return (
    <section className="py-20 bg-gradient-hero text-white">
    <div className="container mx-auto px-4 text-center">
        <h2 className="text-6xl font-bold mb-6">Ready to Transform Your Customer Experience?</h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto">Partner with Aberdeen and leverage the power of MozarkAI to drive growth, reduce churn, and increase revenue.</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={() => openModal('bfsi')} className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 hover:bg-white hover:text-black hover:border-black">Book BFSI Demo</button>
            <button onClick={() => openModal('ott')}  className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 hover:bg-white hover:text-black hover:border-black">Book OTT Demo</button>
        </div>
    </div>
</section>
  );
}

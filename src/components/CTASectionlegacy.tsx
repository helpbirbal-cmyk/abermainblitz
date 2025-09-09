// components/ui/CtaSection.tsx
interface CtaSectionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

export default function CtaSection({
  title,
  description,
  buttonText,
  onButtonClick
}: CtaSectionProps) {
  return (
    <div className="mt-6 bg-gradient-hero text-white rounded-lg p-4 text-center">
      <h3 className="font-bold text-sm mb-2">
        {title}
      </h3>
      <p className="text-xs mb-3">
        {description}
      </p>
      <button
        onClick={onButtonClick}
        className="bg-white text-blue-800 font-bold py-2 px-4 rounded text-xs hover:bg-blue-50 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}

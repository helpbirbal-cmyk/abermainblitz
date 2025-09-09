// components/sections/ResultsSection.tsx (or wherever it is)
import ResultCard from './ui/ResultCard';

export default function ResultsSection() {
  const results = [
    {
      title: "ROI Increase",
      value: "45%",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      titleColor: "text-green-600"
    },
    {
      title: "Cost Reduction",
      value: "30%",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      titleColor: "text-blue-600"
    },
    // Add more result cards with all required props
  ];

  return (
    <section>
      <h2>Our Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, index) => (
          <ResultCard
            key={index}
            title={result.title}
            value={result.value}
            bgColor={result.bgColor}
            borderColor={result.borderColor}
            textColor={result.textColor}
            titleColor={result.titleColor}
          />
        ))}
      </div>
    </section>
  );
}

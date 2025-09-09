// components/ui/ResultCard.tsx
interface ResultCardProps {
  title: string;
  value: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  titleColor: string;
}

export default function ResultCard({
  title,
  value,
  bgColor,
  borderColor,
  textColor,
  titleColor
}: ResultCardProps) {
  return (
    <div className={`${bgColor} p-3 rounded-lg border ${borderColor}`}>
      <h3 className={`text-xs font-medium ${titleColor} mb-1`}>{title}</h3>
      <p className={`text-lg font-bold ${textColor}`}>{value}</p>
    </div>
  );
}

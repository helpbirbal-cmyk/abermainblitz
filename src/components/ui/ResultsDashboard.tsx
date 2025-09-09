// components/ui/ResultsDashboard.tsx
'use client';

interface ResultsDashboardProps {
  title: string;
  metrics: Array<{
    label: string;
    value: string | number;
    change?: number;
    isPositive?: boolean;
    description?: string;
  }>;
  timeframe?: 'monthly' | 'annual';
}

export default function ResultsDashboard({ title, metrics, timeframe = 'monthly' }: ResultsDashboardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-700">{metric.label}</h3>
              {metric.change && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  metric.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {metric.isPositive ? '+' : ''}{metric.change}%
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            {metric.description && (
              <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

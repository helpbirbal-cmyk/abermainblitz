import React from 'react';
import { IndustryBenchmark } from '../types/ROITypes';

interface IndustryInfoProps {
  benchmark: IndustryBenchmark;
}

export const IndustryInfo: React.FC<IndustryInfoProps> = ({ benchmark }) => (
  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-semibold text-blue-900">{benchmark.name} Benchmarks</h4>
        <p className="text-sm text-blue-700 mt-1">{benchmark.description}</p>
        <div className="text-xs text-blue-600 mt-2">
          <div> {benchmark.typicalTesters[0]}-{benchmark.typicalTesters[1]} testers | {benchmark.typicalReleases[0]}-{benchmark.typicalReleases[1]} Releases/month</div>
          <div>Regulatory: {benchmark.regulatoryRequirements} | Complexity: {"★".repeat(benchmark.testingComplexity)}</div>
        </div>
      </div>
    </div>
  </div>
);

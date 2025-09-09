// components/ui/ScenarioComparison.tsx
'use client';

import { useState } from 'react';

interface Scenario {
  id: string;
  name: string;
  inputs: any;
  results: any;
}

interface ScenarioComparisonProps {
  baseScenario: Scenario;
  compareScenarios: Scenario[];
  onScenarioSelect: (scenario: Scenario) => void;
}

export default function ScenarioComparison({
  baseScenario,
  compareScenarios,
  onScenarioSelect
}: ScenarioComparisonProps) {
  const [selectedScenario, setSelectedScenario] = useState(baseScenario.id);

  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    const scenario = compareScenarios.find(s => s.id === scenarioId) || baseScenario;
    onScenarioSelect(scenario);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compare Scenarios</h3>

      <div className="flex flex-wrap gap-2">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value={baseScenario.id}
            checked={selectedScenario === baseScenario.id}
            onChange={(e) => handleScenarioChange(e.target.value)}
            className="text-blue-600"
          />
          <span>{baseScenario.name}</span>
        </label>

        {compareScenarios.map((scenario) => (
          <label key={scenario.id} className="flex items-center space-x-2">
            <input
              type="radio"
              value={scenario.id}
              checked={selectedScenario === scenario.id}
              onChange={(e) => handleScenarioChange(e.target.value)}
              className="text-blue-600"
            />
            <span>{scenario.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

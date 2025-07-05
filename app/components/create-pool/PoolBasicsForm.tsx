'use client';

import { PoolConfiguration } from "@/app/create-pool/page";

interface PoolBasicsFormProps {
  config: Partial<PoolConfiguration>;
  updateConfig: (field: keyof PoolConfiguration, value: any) => void;
}

export default function PoolBasicsForm({ config, updateConfig }: PoolBasicsFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="poolName" className="block text-sm font-medium text-gray-400 font-mono mb-2">
          Pool Name
        </label>
        <input
          type="text"
          id="poolName"
          className="w-full bg-black border-2 border-green-400/50 rounded-lg p-3 text-green-300 font-mono focus:ring-green-400 focus:border-green-400"
          value={config.name || ''}
          onChange={(e) => updateConfig('name', e.target.value)}
          placeholder="e.g., My Awesome Pool"
        />
      </div>
      <div>
        <label htmlFor="backstopTakeRate" className="block text-sm font-medium text-gray-400 font-mono mb-2">
          Backstop Take Rate (%)
        </label>
        <input
          type="number"
          id="backstopTakeRate"
          className="w-full bg-black border-2 border-green-400/50 rounded-lg p-3 text-green-300 font-mono focus:ring-green-400 focus:border-green-400"
          value={config.backstopTakeRate || 0}
          onChange={(e) => updateConfig('backstopTakeRate', parseFloat(e.target.value))}
          placeholder="e.g., 0.5"
          step="0.01"
        />
        <p className="text-xs text-gray-500 mt-2 font-mono">The percentage of interest paid that is sent to the backstop. (e.g. 0.5 for 0.5%)</p>
      </div>
      <div>
        <label htmlFor="maxPositions" className="block text-sm font-medium text-gray-400 font-mono mb-2">
          Max Positions
        </label>
        <input
          type="number"
          id="maxPositions"
          className="w-full bg-black border-2 border-green-400/50 rounded-lg p-3 text-green-300 font-mono focus:ring-green-400 focus:border-green-400"
          value={config.maxPositions || 0}
          onChange={(e) => updateConfig('maxPositions', parseInt(e.target.value))}
          placeholder="e.g., 4"
        />
        <p className="text-xs text-gray-500 mt-2 font-mono">The maximum number of assets a user can have in this pool.</p>
      </div>
      <div>
        <label htmlFor="minCollateral" className="block text-sm font-medium text-gray-400 font-mono mb-2">
          Minimum Collateral (in stroops)
        </label>
        <input
          type="number"
          id="minCollateral"
          className="w-full bg-black border-2 border-green-400/50 rounded-lg p-3 text-green-300 font-mono focus:ring-green-400 focus:border-green-400"
          value={config.minCollateral || 0}
          onChange={(e) => updateConfig('minCollateral', parseInt(e.target.value))}
          placeholder="e.g., 10000000"
        />
        <p className="text-xs text-gray-500 mt-2 font-mono">The minimum collateral required to open a position, in stroops (1 XLM = 10,000,000 stroops).</p>
      </div>
    </div>
  );
} 
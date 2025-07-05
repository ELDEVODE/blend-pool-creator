'use client';

import { PoolConfiguration } from "@/app/create-pool/page";
import { Zap, Trash2 } from "lucide-react";

interface EmissionsFormProps {
  config: Partial<PoolConfiguration>;
  updateConfig: (field: keyof PoolConfiguration, value: any) => void;
}

export default function EmissionsForm({ config, updateConfig }: EmissionsFormProps) {
  const selectedAssets = config.selectedAssets || [];

  const handleEmissionChange = (assetId: string, type: 'supply' | 'borrow', value: string) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) return;

    const existingEmissions = config.emissions || [];
    const otherEmissions = existingEmissions.filter(e => e.assetId !== assetId);
    const currentEmission = existingEmissions.find(e => e.assetId === assetId) || { assetId, supplyEmission: 0, borrowEmission: 0 };

    const newEmission = {
      ...currentEmission,
      [type === 'supply' ? 'supplyEmission' : 'borrowEmission']: numericValue
    };

    updateConfig('emissions', [...otherEmissions, newEmission]);
  };

  if (selectedAssets.length === 0) {
    return (
      <div className="text-center text-gray-500 font-mono p-8 bg-black border-2 border-green-400/20 rounded-lg">
        Please select at least one asset in the 'Select Assets' step to configure emissions.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-400 font-mono">
        Configure the annual reward emissions for supplying and borrowing each asset. The values are in Blended (BLND) tokens per year.
      </p>
      {selectedAssets.map(asset => {
        const emission = config.emissions?.find(e => e.assetId === asset.id);
        return (
          <div key={asset.id} className="p-4 bg-gray-900/50 border border-green-400/30 rounded-lg">
            <h3 className="text-lg font-medium text-green-300 font-mono mb-4">{asset.symbol} ({asset.name})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`supply-${asset.id}`} className="block text-sm font-medium text-gray-400 font-mono mb-2">
                  Supply Emissions (BLND/year)
                </label>
                <input
                  type="number"
                  id={`supply-${asset.id}`}
                  className="w-full bg-black border-2 border-green-400/50 rounded-lg p-3 text-green-300 font-mono focus:ring-green-400 focus:border-green-400"
                  value={emission?.supplyEmission || ''}
                  onChange={(e) => handleEmissionChange(asset.id, 'supply', e.target.value)}
                  placeholder="e.g., 10000"
                />
              </div>
              <div>
                <label htmlFor={`borrow-${asset.id}`} className="block text-sm font-medium text-gray-400 font-mono mb-2">
                  Borrow Emissions (BLND/year)
                </label>
                <input
                  type="number"
                  id={`borrow-${asset.id}`}
                  className="w-full bg-black border-2 border-green-400/50 rounded-lg p-3 text-green-300 font-mono focus:ring-green-400 focus:border-green-400"
                  value={emission?.borrowEmission || ''}
                  onChange={(e) => handleEmissionChange(asset.id, 'borrow', e.target.value)}
                  placeholder="e.g., 20000"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 
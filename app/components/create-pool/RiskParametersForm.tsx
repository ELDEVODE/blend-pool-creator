'use client';

import { PoolConfiguration } from "@/app/create-pool/page";
import { SlidersHorizontal } from 'lucide-react';

type PresetKey = 'conservative' | 'balanced' | 'aggressive';
type Preset = PresetKey | 'custom';

const presets: Record<PresetKey, PoolConfiguration['riskParameters']['customParams']> = {
  conservative: {
    collateralFactor: 0.75, liquidationFactor: 0.8, util: 0.6, maxUtil: 0.9,
    rBase: 0.01, rOne: 0.04, rTwo: 0.2, rThree: 1, reactivity: 0.1
  },
  balanced: {
    collateralFactor: 0.85, liquidationFactor: 0.9, util: 0.7, maxUtil: 0.95,
    rBase: 0.02, rOne: 0.06, rTwo: 0.4, rThree: 1.5, reactivity: 0.5
  },
  aggressive: {
    collateralFactor: 0.9, liquidationFactor: 0.95, util: 0.8, maxUtil: 1,
    rBase: 0.03, rOne: 0.1, rTwo: 0.6, rThree: 2, reactivity: 0.8
  },
};

interface RiskParametersFormProps {
  config: Partial<PoolConfiguration>;
  updateConfig: (field: keyof PoolConfiguration, value: any) => void;
}

export default function RiskParametersForm({ config, updateConfig }: RiskParametersFormProps) {
  const currentPreset = config.riskParameters?.preset as Preset || 'balanced';
  const isCustom = currentPreset === 'custom';

  const handlePresetChange = (preset: Preset) => {
    if (preset !== 'custom') {
      updateConfig('riskParameters', { preset, customParams: presets[preset as PresetKey] });
    } else {
      // When switching to custom, retain the parameters from the last selected preset
      const lastPreset: PresetKey = (config.riskParameters?.preset as PresetKey) || 'balanced';
      updateConfig('riskParameters', { preset: 'custom', customParams: config.riskParameters?.customParams || presets[lastPreset] });
    }
  };
  
  const handleCustomParamChange = (param: string, value: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      updateConfig('riskParameters', {
        preset: 'custom',
        customParams: {
          ...(config.riskParameters?.customParams || {}),
          [param]: numericValue,
        }
      });
    }
  };

  const params = config.riskParameters?.customParams 
    || presets[(config.riskParameters?.preset as PresetKey) || 'balanced'] 
    || presets.balanced;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-green-300 font-mono mb-4">Risk Profile Preset</h3>
        <div className="flex space-x-2">
          {(['conservative', 'balanced', 'aggressive'] as PresetKey[]).map(p => (
            <button
              key={p}
              onClick={() => handlePresetChange(p)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 text-left capitalize ${
                currentPreset === p && !isCustom
                  ? 'bg-green-400/20 border-green-400 text-green-300 shadow-lg shadow-green-400/10'
                  : 'bg-black border-gray-700 hover:border-green-500/50 hover:bg-green-400/5'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      
      {isCustom || (
        <button 
          onClick={() => handlePresetChange('custom')}
          className="w-full p-3 text-center text-gray-400 font-mono border-2 border-dashed border-gray-700 rounded-lg hover:border-green-400/50 hover:text-green-400 transition-colors"
        >
          Switch to Custom Parameters
        </button>
      )}

      {isCustom && (
        <div className="space-y-4 pt-4 border-t-2 border-green-400/20">
            <h3 className="text-lg font-medium text-green-300 font-mono mb-4">Custom Risk Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(params || {}).map(([key, value]) => (
                <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-400 font-mono mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    <input
                        type="number"
                        id={key}
                        value={value as number}
                        onChange={(e) => handleCustomParamChange(key, e.target.value)}
                        className="w-full bg-black border-2 border-green-400/50 rounded-lg p-3 text-green-300 font-mono focus:ring-green-400 focus:border-green-400"
                        step="0.01"
                    />
                </div>
            ))}
            </div>
        </div>
      )}
    </div>
  );
} 
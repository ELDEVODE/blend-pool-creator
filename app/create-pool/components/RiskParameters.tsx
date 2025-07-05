'use client';

import { useState, useEffect } from 'react';
import { ReserveConfig, AssetInfo, RiskPreset } from '../types';

interface RiskParametersProps {
  data: ReserveConfig[];
  selectedAssets: AssetInfo[];
  onUpdate: (data: ReserveConfig[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

const riskPresets: RiskPreset[] = [
  {
    name: 'Conservative',
    description: 'Lower risk, lower yield parameters',
    c_factor: 8000000, // 80%
    l_factor: 9000000, // 90%
    util: 8000000, // 80%
    max_util: 9500000, // 95%
    r_base: 50000, // 0.5%
    r_one: 500000, // 5%
    r_two: 1000000, // 10%
    r_three: 10000000, // 100%
    reactivity: 500,
  },
  {
    name: 'Moderate',
    description: 'Balanced risk and yield parameters',
    c_factor: 9000000, // 90%
    l_factor: 9500000, // 95%
    util: 9000000, // 90%
    max_util: 9800000, // 98%
    r_base: 100000, // 1%
    r_one: 750000, // 7.5%
    r_two: 1500000, // 15%
    r_three: 15000000, // 150%
    reactivity: 750,
  },
  {
    name: 'Aggressive',
    description: 'Higher risk, higher yield parameters',
    c_factor: 9500000, // 95%
    l_factor: 9800000, // 98%
    util: 9500000, // 95%
    max_util: 9900000, // 99%
    r_base: 200000, // 2%
    r_one: 1000000, // 10%
    r_two: 2000000, // 20%
    r_three: 20000000, // 200%
    reactivity: 1000,
  },
];

export default function RiskParameters({ data, selectedAssets, onUpdate, onNext, onPrev }: RiskParametersProps) {
  const [reserveConfigs, setReserveConfigs] = useState<ReserveConfig[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('moderate');

  useEffect(() => {
    if (selectedAssets.length > 0 && reserveConfigs.length === 0) {
      // Initialize with moderate preset
      const preset = riskPresets.find(p => p.name.toLowerCase() === 'moderate')!;
      const configs = selectedAssets.map((asset, index) => ({
        index,
        decimals: asset.decimals,
        c_factor: preset.c_factor,
        l_factor: preset.l_factor,
        util: preset.util,
        max_util: preset.max_util,
        r_base: preset.r_base,
        r_one: preset.r_one,
        r_two: preset.r_two,
        r_three: preset.r_three,
        reactivity: preset.reactivity,
        supply_cap: '1000000000000000', // Large default
        enabled: true,
      }));
      setReserveConfigs(configs);
    }
  }, [selectedAssets, reserveConfigs.length]);

  useEffect(() => {
    onUpdate(reserveConfigs);
  }, [reserveConfigs]); // Remove onUpdate from dependencies to prevent infinite loops

  const applyPreset = (presetName: string) => {
    const preset = riskPresets.find(p => p.name.toLowerCase() === presetName.toLowerCase());
    if (!preset) return;

    setSelectedPreset(presetName.toLowerCase());
    setReserveConfigs(prev => prev.map(config => ({
      ...config,
      c_factor: preset.c_factor,
      l_factor: preset.l_factor,
      util: preset.util,
      max_util: preset.max_util,
      r_base: preset.r_base,
      r_one: preset.r_one,
      r_two: preset.r_two,
      r_three: preset.r_three,
      reactivity: preset.reactivity,
    })));
  };

  const updateReserveConfig = (index: number, field: keyof ReserveConfig, value: any) => {
    setReserveConfigs(prev => prev.map((config, i) => 
      i === index ? { ...config, [field]: value } : config
    ));
    setSelectedPreset('custom');
  };

  const formatPercentage = (value: number) => (value / 10000000 * 100).toFixed(2);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Risk Parameters</h2>
        <p className="text-gray-600">
          Configure lending and borrowing parameters for each asset. You can use presets or customize individual values.
        </p>
      </div>

      {/* Preset Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Profile Presets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riskPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.name)}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedPreset === preset.name.toLowerCase()
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <h4 className="font-medium text-gray-900">{preset.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{preset.description}</p>
              <div className="mt-2 text-xs text-gray-600">
                <div>Collateral Factor: {formatPercentage(preset.c_factor)}%</div>
                <div>Target Utilization: {formatPercentage(preset.util)}%</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Individual Asset Configuration */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Asset-Specific Parameters</h3>
        
        {selectedAssets.map((asset, index) => {
          const config = reserveConfigs[index];
          if (!config) return null;

          return (
            <div key={asset.symbol} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-4">{asset.symbol}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Collateral Factor
                  </label>
                  <input
                    type="number"
                    value={config.c_factor}
                    onChange={(e) => updateReserveConfig(index, 'c_factor', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatPercentage(config.c_factor)}% - Max borrowing power
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Liability Factor
                  </label>
                  <input
                    type="number"
                    value={config.l_factor}
                    onChange={(e) => updateReserveConfig(index, 'l_factor', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatPercentage(config.l_factor)}% - Liquidation threshold
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Utilization
                  </label>
                  <input
                    type="number"
                    value={config.util}
                    onChange={(e) => updateReserveConfig(index, 'util', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatPercentage(config.util)}% - Optimal utilization
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Rate
                  </label>
                  <input
                    type="number"
                    value={config.r_base}
                    onChange={(e) => updateReserveConfig(index, 'r_base', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatPercentage(config.r_base)}% - Minimum interest rate
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supply Cap
                  </label>
                  <input
                    type="text"
                    value={config.supply_cap}
                    onChange={(e) => updateReserveConfig(index, 'supply_cap', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum amount that can be supplied
                  </p>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => updateReserveConfig(index, 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enabled</span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Previous
        </button>
        
        <button
          onClick={onNext}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Next: Emissions
        </button>
      </div>
    </div>
  );
} 
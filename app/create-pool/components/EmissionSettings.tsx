'use client';

import { useState, useEffect } from 'react';
import { EmissionConfig, AssetInfo } from '../types';

interface EmissionSettingsProps {
  data: EmissionConfig[];
  selectedAssets: AssetInfo[];
  onUpdate: (data: EmissionConfig[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function EmissionSettings({ data, selectedAssets, onUpdate, onNext, onPrev }: EmissionSettingsProps) {
  const [emissions, setEmissions] = useState<EmissionConfig[]>([]);

  useEffect(() => {
    if (selectedAssets.length > 0 && emissions.length === 0) {
      // Initialize with equal distribution for suppliers
      const sharePerAsset = Math.floor(10000000 / selectedAssets.length);
      const configs: EmissionConfig[] = selectedAssets.map((_, index) => ({
        reserve_index: index,
        res_type: 1, // Suppliers
        share: sharePerAsset,
      }));
      setEmissions(configs);
    }
  }, [selectedAssets, emissions.length]);

  useEffect(() => {
    onUpdate(emissions);
  }, [emissions]); // Remove onUpdate from dependencies to prevent infinite loops

  const updateEmission = (index: number, field: keyof EmissionConfig, value: any) => {
    setEmissions(prev => prev.map((config, i) => 
      i === index ? { ...config, [field]: value } : config
    ));
  };

  const addEmissionConfig = () => {
    setEmissions(prev => [...prev, {
      reserve_index: 0,
      res_type: 1,
      share: 0,
    }]);
  };

  const removeEmissionConfig = (index: number) => {
    setEmissions(prev => prev.filter((_, i) => i !== index));
  };

  const getTotalShares = () => {
    return emissions.reduce((total, config) => total + config.share, 0);
  };

  const distributeEvenly = () => {
    const sharePerConfig = Math.floor(10000000 / emissions.length);
    const remainder = 10000000 - (sharePerConfig * emissions.length);
    
    setEmissions(prev => prev.map((config, index) => ({
      ...config,
      share: sharePerConfig + (index === 0 ? remainder : 0),
    })));
  };

  const totalShares = getTotalShares();
  const isValid = totalShares === 10000000; // Must equal 100%

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Emission Settings</h2>
        <p className="text-gray-600">
          Configure how reward emissions are distributed across assets and between suppliers/borrowers.
          Total shares must equal 100%.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-md font-medium text-gray-900">Quick Setup</h3>
            <p className="text-sm text-gray-600">Apply common emission patterns</p>
          </div>
          <button
            onClick={distributeEvenly}
            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
          >
            Distribute Evenly
          </button>
        </div>
        
        <div className="text-sm">
          <span className={`font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            Total: {(totalShares / 100000).toFixed(2)}%
          </span>
          {!isValid && (
            <span className="text-red-600 ml-2">
              (Must equal 100.00%)
            </span>
          )}
        </div>
      </div>

      {/* Emission Configurations */}
      <div className="space-y-4 mb-6">
        {emissions.map((config, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-md font-medium text-gray-900">
                Emission Config {index + 1}
              </h4>
              {emissions.length > 1 && (
                <button
                  onClick={() => removeEmissionConfig(index)}
                  className="text-red-600 text-sm hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reserve Asset
                </label>
                <select
                  value={config.reserve_index}
                  onChange={(e) => updateEmission(index, 'reserve_index', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {selectedAssets.map((asset, assetIndex) => (
                    <option key={asset.symbol} value={assetIndex}>
                      {asset.symbol}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emission Type
                </label>
                <select
                  value={config.res_type}
                  onChange={(e) => updateEmission(index, 'res_type', parseInt(e.target.value) as 0 | 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value={1}>Suppliers</option>
                  <option value={0}>Borrowers</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Who receives these emissions
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Share (%)
                </label>
                <input
                  type="number"
                  value={(config.share / 100000).toFixed(2)}
                  onChange={(e) => updateEmission(index, 'share', Math.round(parseFloat(e.target.value) * 100000))}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Percentage of total emissions
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Configuration Button */}
      <div className="mb-6">
        <button
          onClick={addEmissionConfig}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-700"
        >
          + Add Emission Configuration
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-md font-medium text-gray-900 mb-2">Emission Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-1">By Asset:</h4>
            {selectedAssets.map((asset, assetIndex) => {
              const assetEmissions = emissions.filter(e => e.reserve_index === assetIndex);
              const totalShare = assetEmissions.reduce((sum, e) => sum + e.share, 0);
              return (
                <div key={asset.symbol} className="flex justify-between">
                  <span>{asset.symbol}:</span>
                  <span>{(totalShare / 100000).toFixed(2)}%</span>
                </div>
              );
            })}
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">By Type:</h4>
            <div className="flex justify-between">
              <span>Suppliers:</span>
              <span>
                {(emissions.filter(e => e.res_type === 1).reduce((sum, e) => sum + e.share, 0) / 100000).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Borrowers:</span>
              <span>
                {(emissions.filter(e => e.res_type === 0).reduce((sum, e) => sum + e.share, 0) / 100000).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Warning */}
      {!isValid && (
        <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">
            ⚠️ Total emission shares must equal exactly 100.00%. 
            Current total: {(totalShares / 100000).toFixed(2)}%
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Previous
        </button>
        
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`px-4 py-2 rounded-md ${
            isValid
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Review & Deploy
        </button>
      </div>
    </div>
  );
} 
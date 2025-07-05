'use client';

import { useState, useEffect } from 'react';
import { PoolBasics, Network } from '../types';

interface PoolBasicsFormProps {
  data?: PoolBasics;
  onUpdate: (data: PoolBasics) => void;
  onNext: () => void;
}

export default function PoolBasicsForm({ data, onUpdate, onNext }: PoolBasicsFormProps) {
  const [formData, setFormData] = useState<PoolBasics>({
    name: data?.name || '',
    network: data?.network || 'testnet',
    backstopTakeRate: data?.backstopTakeRate || 0.5,
    maxPositions: data?.maxPositions || 4,
    minCollateral: data?.minCollateral || '0',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PoolBasics, string>>>({});

  useEffect(() => {
    onUpdate(formData);
  }, [formData]); // Remove onUpdate from dependencies to prevent infinite loops

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PoolBasics, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Pool name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Pool name must be at least 3 characters';
    }

    if (formData.backstopTakeRate < 0 || formData.backstopTakeRate > 1) {
      newErrors.backstopTakeRate = 'Backstop take rate must be between 0 and 1';
    }

    if (formData.maxPositions < 1 || formData.maxPositions > 10) {
      newErrors.maxPositions = 'Max positions must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const updateField = <K extends keyof PoolBasics>(field: K, value: PoolBasics[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 terminal-border backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-green-400 mb-2 font-mono uppercase tracking-wide">
          &gt; Pool Basics
        </h2>
        <div className="h-0.5 w-full bg-gradient-to-r from-green-500 to-transparent mb-3"></div>
        <p className="text-green-300/70 font-mono text-sm">
          Configure the fundamental settings for your pool.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="poolName" className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wide">
            Pool Name *
          </label>
          <input
            type="text"
            id="poolName"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-4 py-3 bg-black/80 border border-green-500/50 rounded-md text-green-300 font-mono focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 terminal-border placeholder-green-500/40"
            placeholder="e.g., My Stellar Pool"
          />
          {errors.name && <p className="mt-2 text-sm text-red-400 font-mono">ERROR: {errors.name}</p>}
        </div>

        <div>
          <label htmlFor="network" className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wide">
            Network *
          </label>
          <select
            id="network"
            value={formData.network}
            onChange={(e) => updateField('network', e.target.value as Network)}
            className="w-full px-4 py-3 bg-black/80 border border-green-500/50 rounded-md text-green-300 font-mono focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 terminal-border"
          >
            <option value="testnet" className="bg-black text-green-300">Testnet (Recommended for testing)</option>
            <option value="mainnet" className="bg-black text-green-300">Mainnet (Production)</option>
            <option value="futurenet" className="bg-black text-green-300">Futurenet (Development)</option>
            <option value="local" className="bg-black text-green-300">Local (Development)</option>
          </select>
        </div>

        <div>
          <label htmlFor="backstopTakeRate" className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wide">
            Backstop Take Rate
          </label>
          <div className="relative">
            <input
              type="number"
              id="backstopTakeRate"
              value={formData.backstopTakeRate}
              onChange={(e) => updateField('backstopTakeRate', parseFloat(e.target.value))}
              min="0"
              max="1"
              step="0.01"
              className="w-full px-4 py-3 bg-black/80 border border-green-500/50 rounded-md text-green-300 font-mono focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 terminal-border"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-green-500/70 text-sm font-mono">%</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-green-400/60 font-mono">
            &gt; Percentage of borrower interest sent to backstop depositors (0-100%)
          </p>
          {errors.backstopTakeRate && <p className="mt-2 text-sm text-red-400 font-mono">ERROR: {errors.backstopTakeRate}</p>}
        </div>

        <div>
          <label htmlFor="maxPositions" className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wide">
            Maximum Positions
          </label>
          <input
            type="number"
            id="maxPositions"
            value={formData.maxPositions}
            onChange={(e) => updateField('maxPositions', parseInt(e.target.value))}
            min="1"
            max="10"
            className="w-full px-4 py-3 bg-black/80 border border-green-500/50 rounded-md text-green-300 font-mono focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 terminal-border"
          />
          <p className="mt-2 text-sm text-green-400/60 font-mono">
            &gt; Maximum number of positions allowed in the pool (1-10). Lower values may improve liquidation efficiency.
          </p>
          {errors.maxPositions && <p className="mt-2 text-sm text-red-400 font-mono">ERROR: {errors.maxPositions}</p>}
        </div>

        <div>
          <label htmlFor="minCollateral" className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wide">
            Minimum Collateral
          </label>
          <input
            type="text"
            id="minCollateral"
            value={formData.minCollateral}
            onChange={(e) => updateField('minCollateral', e.target.value)}
            className="w-full px-4 py-3 bg-black/80 border border-green-500/50 rounded-md text-green-300 font-mono focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 terminal-border placeholder-green-500/40"
            placeholder="0"
          />
          <p className="mt-2 text-sm text-green-400/60 font-mono">
            &gt; Minimum collateral requirement (set to 0 for no minimum)
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-black border-2 border-green-500 text-green-400 px-6 py-3 rounded-md font-mono font-medium hover:bg-green-500/10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black terminal-glow transition-all duration-300 uppercase tracking-wider"
          >
            <span className="mr-2">&gt;</span>
            Next: Select Assets
          </button>
        </div>
      </form>
    </div>
  );
} 
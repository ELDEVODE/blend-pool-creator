'use client';

import { PoolConfiguration } from "@/app/create-pool/page";
import { Settings, TrendingUp, Users, Shield } from 'lucide-react';

interface PoolBasicsFormProps {
  config: Partial<PoolConfiguration>;
  updateConfig: (field: keyof PoolConfiguration, value: any) => void;
}

export default function PoolBasicsForm({ config, updateConfig }: PoolBasicsFormProps) {
  return (
    <div className="space-y-8">
      {/* Pool Name */}
      <div className="group">
        <label htmlFor="poolName" className="flex items-center text-lg font-bold text-green-400 font-mono mb-4">
          <Settings className="w-5 h-5 mr-2" />
          Pool Name
        </label>
        <div className="relative">
          <input
            type="text"
            id="poolName"
            className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-2 border-green-500/30 rounded-xl p-4 text-green-300 font-mono text-lg focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 placeholder-gray-500 backdrop-blur-sm"
            value={config.name || ''}
            onChange={(e) => updateConfig('name', e.target.value)}
            placeholder="Enter your pool name (e.g., DeFi Yield Pool)"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        <p className="text-sm text-gray-400 mt-3 font-mono flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          Choose a unique name that identifies your lending pool
        </p>
      </div>

      {/* Backstop Take Rate */}
      <div className="group">
        <label htmlFor="backstopTakeRate" className="flex items-center text-lg font-bold text-green-400 font-mono mb-4">
          <TrendingUp className="w-5 h-5 mr-2" />
          Backstop Take Rate (%)
        </label>
        <div className="relative">
          <input
            type="number"
            id="backstopTakeRate"
            className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-2 border-green-500/30 rounded-xl p-4 text-green-300 font-mono text-lg focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 placeholder-gray-500 backdrop-blur-sm"
            value={config.backstopTakeRate || 0}
            onChange={(e) => updateConfig('backstopTakeRate', parseFloat(e.target.value))}
            placeholder="0.10"
            step="0.01"
            min="0"
            max="1"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-mono text-sm">
            %
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg p-3 mt-3 backdrop-blur-sm">
          <p className="text-sm text-blue-300 font-mono">
            💡 <strong>Tip:</strong> The percentage of borrower interest sent to backstop depositors. 
            Recommended: 0.1-0.5% for balanced risk/reward.
          </p>
        </div>
      </div>

      {/* Max Positions */}
      <div className="group">
        <label htmlFor="maxPositions" className="flex items-center text-lg font-bold text-green-400 font-mono mb-4">
          <Users className="w-5 h-5 mr-2" />
          Maximum Positions
        </label>
        <div className="relative">
          <input
            type="number"
            id="maxPositions"
            className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-2 border-green-500/30 rounded-xl p-4 text-green-300 font-mono text-lg focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 placeholder-gray-500 backdrop-blur-sm"
            value={config.maxPositions || 0}
            onChange={(e) => updateConfig('maxPositions', parseInt(e.target.value))}
            placeholder="4"
            min="1"
            max="8"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-3 mt-3 backdrop-blur-sm">
          <p className="text-sm text-purple-300 font-mono">
            ⚡ <strong>Performance:</strong> The maximum number of different assets a user can have positions in. 
            Higher values may cause liquidation issues due to Soroban resource limits.
          </p>
        </div>
      </div>

      {/* Min Collateral */}
      <div className="group">
        <label htmlFor="minCollateral" className="flex items-center text-lg font-bold text-green-400 font-mono mb-4">
          <Shield className="w-5 h-5 mr-2" />
          Minimum Collateral (stroops)
        </label>
        <div className="relative">
          <input
            type="number"
            id="minCollateral"
            className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-2 border-green-500/30 rounded-xl p-4 text-green-300 font-mono text-lg focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 placeholder-gray-500 backdrop-blur-sm"
            value={config.minCollateral || 0}
            onChange={(e) => updateConfig('minCollateral', parseInt(e.target.value))}
            placeholder="10000000"
            min="0"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-xs text-gray-400 font-mono mb-1">CONVERSION REFERENCE</p>
            <p className="text-sm text-green-300 font-mono">
              1 XLM = 10,000,000 stroops
            </p>
          </div>
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-xs text-gray-400 font-mono mb-1">RECOMMENDED</p>
            <p className="text-sm text-green-300 font-mono">
              0 stroops (no minimum)
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-lg p-3 mt-3 backdrop-blur-sm">
          <p className="text-sm text-orange-300 font-mono">
            🛡️ <strong>Security:</strong> Minimum collateral required to open a position. 
            Set to 0 for maximum accessibility or higher for spam protection.
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-green-400 font-mono mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Configuration Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
          <div className="flex justify-between py-2 border-b border-green-500/20">
            <span className="text-gray-400">Pool Name:</span>
            <span className="text-green-300">{config.name || 'Not set'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-green-500/20">
            <span className="text-gray-400">Backstop Rate:</span>
            <span className="text-green-300">{config.backstopTakeRate || 0}%</span>
          </div>
          <div className="flex justify-between py-2 border-b border-green-500/20">
            <span className="text-gray-400">Max Positions:</span>
            <span className="text-green-300">{config.maxPositions || 'Not set'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-green-500/20">
            <span className="text-gray-400">Min Collateral:</span>
            <span className="text-green-300">{config.minCollateral || 0} stroops</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
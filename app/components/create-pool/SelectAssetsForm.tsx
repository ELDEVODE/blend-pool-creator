'use client';

import { useState } from 'react';
import { PoolConfiguration } from "@/app/create-pool/page";
import { Plus, X, Target, CheckCircle, Star, Coins, Search, TrendingUp } from 'lucide-react';

interface SelectAssetsFormProps {
  config: Partial<PoolConfiguration>;
  updateConfig: (field: keyof PoolConfiguration, value: any) => void;
}

// Popular testnet assets
const POPULAR_ASSETS = [
  { id: 'XLM', symbol: 'XLM', name: 'Stellar Lumens', address: 'native', decimals: 7, popular: true },
  { id: 'USDC', symbol: 'USDC', name: 'USD Coin', address: 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA', decimals: 6, popular: true },
  { id: 'BLND', symbol: 'BLND', name: 'Blend Token', address: 'CD25MNVTZDL4Y3XBCPCJXGXATV5WUHHOWMYFF4YBEGU5FCPGMYTVG5JY', decimals: 7, popular: true },
  { id: 'wETH', symbol: 'wETH', name: 'Wrapped Ethereum', address: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGCN4YU', decimals: 18, popular: true },
  { id: 'wBTC', symbol: 'wBTC', name: 'Wrapped Bitcoin', address: 'CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMKQBGXXLILMVUPCYZD', decimals: 8, popular: true },
];

export default function SelectAssetsForm({ config, updateConfig }: SelectAssetsFormProps) {
  const [customAsset, setCustomAsset] = useState({ symbol: '', name: '', address: '', decimals: 7 });
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  const selectedAssets = config.selectedAssets || [];
  const maxPositions = config.maxPositions || 4;

  const filteredAssets = POPULAR_ASSETS.filter(asset => 
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAsset = (asset: any) => {
    if (selectedAssets.some(a => a.id === asset.id)) {
      // Remove asset
      const updated = selectedAssets.filter(a => a.id !== asset.id);
      updateConfig('selectedAssets', updated);
    } else {
      // Add asset
      if (selectedAssets.length < maxPositions) {
        const updated = [...selectedAssets, asset];
        updateConfig('selectedAssets', updated);
      }
    }
  };

  const addCustomAsset = () => {
    if (customAsset.symbol && customAsset.name && customAsset.address) {
      const newAsset = {
        id: customAsset.symbol,
        symbol: customAsset.symbol,
        name: customAsset.name,
        address: customAsset.address,
        decimals: customAsset.decimals,
        popular: false
      };
      
      if (selectedAssets.length < maxPositions) {
        const updated = [...selectedAssets, newAsset];
        updateConfig('selectedAssets', updated);
        setCustomAsset({ symbol: '', name: '', address: '', decimals: 7 });
        setShowCustomForm(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Target className="w-8 h-8 text-green-400 mr-3" />
          <h2 className="text-2xl font-bold text-green-400 font-mono">Select Pool Assets</h2>
        </div>
        <p className="text-gray-400 font-mono">
          Choose up to {maxPositions} assets for your lending pool
        </p>
      </div>

      {/* Selection Counter */}
      <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Coins className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-400 font-mono font-bold">Selected Assets</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-400 font-mono">{selectedAssets.length}</span>
            <span className="text-gray-400 font-mono">/ {maxPositions}</span>
          </div>
        </div>
        <div className="mt-3 bg-gray-800/50 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${(selectedAssets.length / maxPositions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search assets..."
          className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-2 border-green-500/30 rounded-xl pl-12 pr-4 py-3 text-green-300 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 placeholder-gray-500 backdrop-blur-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Popular Assets */}
      <div>
        <h3 className="text-lg font-bold text-green-400 font-mono mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2" />
          Popular Testnet Assets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssets.map((asset) => {
            const isSelected = selectedAssets.some(a => a.id === asset.id);
            const canSelect = selectedAssets.length < maxPositions || isSelected;
            
            return (
              <div
                key={asset.id}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'border-green-400 bg-gradient-to-br from-green-900/40 to-emerald-900/40 shadow-xl shadow-green-400/20' 
                    : canSelect 
                      ? 'border-green-500/30 bg-gradient-to-br from-gray-900/80 to-gray-800/80 hover:border-green-400/50 hover:bg-gradient-to-br hover:from-green-900/20 hover:to-emerald-900/20' 
                      : 'border-gray-700 bg-gradient-to-br from-gray-900/50 to-gray-800/50 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => canSelect && toggleAsset(asset)}
              >
                {/* Background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        isSelected 
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-black' 
                          : 'bg-gradient-to-br from-gray-700 to-gray-600 text-gray-300'
                      }`}>
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-green-300 font-mono">{asset.symbol}</div>
                        <div className="text-sm text-gray-400 font-mono">{asset.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {asset.popular && (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      )}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'border-green-400 bg-green-400' 
                          : 'border-gray-600 bg-transparent'
                      }`}>
                        {isSelected && <CheckCircle className="w-4 h-4 text-black" />}
                      </div>
                    </div>
                  </div>
                  
                  {/* Asset details */}
                  <div className="mt-3 pt-3 border-t border-gray-700/50">
                    <div className="flex justify-between text-xs font-mono text-gray-400">
                      <span>Decimals: {asset.decimals}</span>
                      <span>Testnet</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Asset */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-600/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-green-400 font-mono flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Custom Asset
          </h3>
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="px-4 py-2 bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30 rounded-lg text-green-400 font-mono text-sm hover:from-green-400/30 hover:to-emerald-400/30 transition-all duration-300"
          >
            {showCustomForm ? 'Cancel' : 'Add Custom'}
          </button>
        </div>
        
        {showCustomForm && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 font-mono mb-2">Symbol</label>
                <input
                  type="text"
                  className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-2 border-green-500/30 rounded-lg p-3 text-green-300 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 placeholder-gray-500"
                  value={customAsset.symbol}
                  onChange={(e) => setCustomAsset({...customAsset, symbol: e.target.value})}
                  placeholder="e.g., MYTOKEN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 font-mono mb-2">Name</label>
                <input
                  type="text"
                  className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-2 border-green-500/30 rounded-lg p-3 text-green-300 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 placeholder-gray-500"
                  value={customAsset.name}
                  onChange={(e) => setCustomAsset({...customAsset, name: e.target.value})}
                  placeholder="e.g., My Token"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 font-mono mb-2">Contract Address</label>
              <input
                type="text"
                className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-2 border-green-500/30 rounded-lg p-3 text-green-300 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 placeholder-gray-500"
                value={customAsset.address}
                onChange={(e) => setCustomAsset({...customAsset, address: e.target.value})}
                placeholder="e.g., CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 font-mono mb-2">Decimals</label>
              <input
                type="number"
                className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-2 border-green-500/30 rounded-lg p-3 text-green-300 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 placeholder-gray-500"
                value={customAsset.decimals}
                onChange={(e) => setCustomAsset({...customAsset, decimals: parseInt(e.target.value)})}
                min="0"
                max="18"
              />
            </div>
            <button
              onClick={addCustomAsset}
              disabled={!customAsset.symbol || !customAsset.name || !customAsset.address || selectedAssets.length >= maxPositions}
              className="w-full py-3 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-green-400 text-black font-mono font-bold rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Custom Asset
            </button>
          </div>
        )}
      </div>

      {/* Selected Assets Summary */}
      {selectedAssets.length > 0 && (
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-green-400 font-mono mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Selected Assets ({selectedAssets.length}/{maxPositions})
          </h3>
          <div className="space-y-3">
            {selectedAssets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-green-300 font-mono">{asset.symbol}</div>
                    <div className="text-sm text-gray-400 font-mono">{asset.name}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleAsset(asset)}
                  className="p-1 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <TrendingUp className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="text-blue-300 font-mono font-bold mb-2">Asset Selection Tips</h4>
            <ul className="text-sm text-blue-200 font-mono space-y-1">
              <li>• Select diverse assets to create a balanced lending pool</li>
              <li>• Popular assets typically have higher liquidity and usage</li>
              <li>• Consider the risk profile of each asset</li>
              <li>• You can add custom assets if you have specific requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
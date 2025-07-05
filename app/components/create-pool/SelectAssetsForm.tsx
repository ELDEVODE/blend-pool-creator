'use client';

import { useState } from 'react';
import { PoolConfiguration } from "@/app/create-pool/page";
import { Plus, Trash2 } from 'lucide-react';
import testnetContracts from '@/lib/contracts/testnet.contracts.json';

// Use contract addresses from the JSON file
const popularAssets = [
  { id: 'xlm', symbol: 'XLM', name: 'Stellar Lumens', address: testnetContracts.ids.XLM, decimals: 7 },
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', address: testnetContracts.ids.USDC, decimals: 7 },
  { id: 'blnd', symbol: 'BLND', name: 'Blend', address: testnetContracts.ids.BLND, decimals: 7 },
  { id: 'weth', symbol: 'wETH', name: 'Wrapped Ether', address: testnetContracts.ids.wETH, decimals: 7 },
  { id: 'wbtc', symbol: 'wBTC', name: 'Wrapped BTC', address: testnetContracts.ids.wBTC, decimals: 7 },
];

interface SelectAssetsFormProps {
  config: Partial<PoolConfiguration>;
  updateConfig: (field: keyof PoolConfiguration, value: any) => void;
}

export default function SelectAssetsForm({ config, updateConfig }: SelectAssetsFormProps) {
  const [customAssetAddress, setCustomAssetAddress] = useState('');

  const selectedAssetIds = new Set(config.selectedAssets?.map(a => a.id));

  const handleToggleAsset = (asset: PoolConfiguration['selectedAssets'][0]) => {
    const currentAssets = config.selectedAssets || [];
    if (selectedAssetIds.has(asset.id)) {
      updateConfig('selectedAssets', currentAssets.filter(a => a.id !== asset.id));
    } else {
      updateConfig('selectedAssets', [...currentAssets, asset]);
    }
  };

  const handleAddCustomAsset = () => {
    if (customAssetAddress.length !== 56 || !customAssetAddress.startsWith('C')) {
      alert('Please enter a valid Stellar asset contract address (starts with C).');
      return;
    }
    const newAsset = {
      id: customAssetAddress,
      symbol: 'CUSTOM',
      name: 'Custom Asset',
      address: customAssetAddress,
      decimals: 7, // Placeholder - a real app would fetch this
    };
    handleToggleAsset(newAsset);
    setCustomAssetAddress('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-green-300 font-mono mb-4">Popular Assets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {popularAssets.map(asset => (
            <button
              key={asset.id}
              onClick={() => handleToggleAsset(asset)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedAssetIds.has(asset.id)
                  ? 'bg-green-400/20 border-green-400 text-green-300 shadow-lg shadow-green-400/10'
                  : 'bg-black border-gray-700 hover:border-green-500/50 hover:bg-green-400/5'
              }`}
            >
              <div className="font-bold text-lg font-mono">{asset.symbol}</div>
              <div className="text-sm text-gray-400">{asset.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-green-300 font-mono mb-4">Add Custom Asset</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-grow bg-black border-2 border-green-400/50 rounded-lg p-3 text-green-300 font-mono focus:ring-green-400 focus:border-green-400"
            value={customAssetAddress}
            onChange={(e) => setCustomAssetAddress(e.target.value)}
            placeholder="Asset Contract Address (e.g., CA...)"
          />
          <button
            onClick={handleAddCustomAsset}
            className="px-4 py-2 bg-green-400/20 border-2 border-green-400 text-green-400 rounded-lg flex items-center justify-center hover:bg-green-400/30 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-green-300 font-mono mb-4">Selected Assets</h3>
        <div className="space-y-3 p-4 bg-black border-2 border-green-400/20 rounded-lg">
          {(config.selectedAssets && config.selectedAssets.length > 0) ? (
            config.selectedAssets.map(asset => (
              <div key={asset.id} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-md">
                <div>
                  <span className="font-bold text-green-400 font-mono">{asset.symbol}</span>
                  <span className="text-sm text-gray-500 ml-3 font-mono">{asset.address}</span>
                </div>
                <button
                  onClick={() => handleToggleAsset(asset)}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center font-mono">No assets selected. Choose from popular assets or add a custom one.</p>
          )}
        </div>
      </div>
    </div>
  );
} 
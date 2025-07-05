'use client';

import { useState, useEffect } from 'react';
import { AssetInfo, Network } from '../types';

interface AssetSelectionProps {
  data: AssetInfo[];
  network?: Network;
  onUpdate: (data: AssetInfo[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

// Fetch available assets from API
const fetchAvailableAssets = async (network: Network): Promise<AssetInfo[]> => {
  try {
    const response = await fetch(`/api/get-assets?network=${network}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }
    const data = await response.json();
    return data.assets;
  } catch (error) {
    console.error('Error fetching assets:', error);
    // Fallback to hardcoded assets if API fails
    return [
      { symbol: 'XLM', contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC', decimals: 7, enabled: false },
      { symbol: 'USDC', contractId: 'CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU', decimals: 7, enabled: false },
      { symbol: 'wBTC', contractId: 'CAP5AMC2OHNVREO66DFIN6DHJMPOBAJ2KCDDIMFBR7WWJH5RZBFM3UEI', decimals: 7, enabled: false },
      { symbol: 'wETH', contractId: 'CAZAQB3D7KSLSNOSQKYD2V4JP5V2Y3B4RDJZRLBFCCIXDCTE3WHSY3UE', decimals: 8, enabled: false },
    ];
  }
};

export default function AssetSelection({ data, network = 'testnet', onUpdate, onNext, onPrev }: AssetSelectionProps) {
  const [availableAssets, setAvailableAssets] = useState<AssetInfo[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<AssetInfo[]>(data);

  useEffect(() => {
    const loadAssets = async () => {
      const assets = await fetchAvailableAssets(network);
      // Mark already selected assets as enabled
      const assetsWithSelection = assets.map((asset: AssetInfo) => ({
        ...asset,
        enabled: selectedAssets.some(selected => selected.symbol === asset.symbol)
      }));
      setAvailableAssets(assetsWithSelection);
    };
    
    loadAssets();
  }, [network, selectedAssets]);

  useEffect(() => {
    onUpdate(selectedAssets);
  }, [selectedAssets]); // Remove onUpdate from dependencies to prevent infinite loops

  const toggleAsset = (asset: AssetInfo) => {
    const isSelected = selectedAssets.some(selected => selected.symbol === asset.symbol);
    
    if (isSelected) {
      setSelectedAssets(prev => prev.filter(selected => selected.symbol !== asset.symbol));
    } else {
      setSelectedAssets(prev => [...prev, { ...asset, enabled: true }]);
    }
  };

  const canProceed = selectedAssets.length >= 2;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Assets</h2>
        <p className="text-gray-600">
          Choose the assets that will be available for lending and borrowing in your pool.
          You need at least 2 assets.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {availableAssets.map((asset) => {
          const isSelected = selectedAssets.some(selected => selected.symbol === asset.symbol);
          
          return (
            <div
              key={asset.symbol}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                isSelected 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => toggleAsset(asset)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                        <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z"/>
                      </svg>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">{asset.symbol}</h3>
                    <p className="text-sm text-gray-500">
                      Decimals: {asset.decimals} | Contract: {asset.contractId.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedAssets.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Selected Assets ({selectedAssets.length}):</h3>
          <div className="flex flex-wrap gap-2">
            {selectedAssets.map((asset) => (
              <span
                key={asset.symbol}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {asset.symbol}
              </span>
            ))}
          </div>
        </div>
      )}

      {!canProceed && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">
            Please select at least 2 assets to continue.
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Previous
        </button>
        
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            canProceed
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Risk Parameters
        </button>
      </div>
    </div>
  );
} 
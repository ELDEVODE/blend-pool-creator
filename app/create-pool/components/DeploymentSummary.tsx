'use client';

import { useState } from 'react';
import { PoolConfiguration, DeploymentStatus } from '../types';

interface DeploymentSummaryProps {
  poolConfig: PoolConfiguration;
  deploymentStatus: DeploymentStatus;
  onDeploy: (config: PoolConfiguration) => void;
  onPrev: () => void;
}

export default function DeploymentSummary({ poolConfig, deploymentStatus, onDeploy, onPrev }: DeploymentSummaryProps) {
  const [agreed, setAgreed] = useState(false);

  const handleDeploy = async () => {
    if (!agreed) return;
    onDeploy(poolConfig);
  };

  const formatPercentage = (value: number) => (value / 10000000 * 100).toFixed(2);

  const isDeploying = deploymentStatus.status === 'deploying';
  const isComplete = deploymentStatus.status === 'success';
  const hasError = deploymentStatus.status === 'error';

  if (isComplete) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pool Deployed Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your Blend pool has been deployed and is ready to use.
          </p>
          
          {deploymentStatus.poolAddress && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Pool Address:</p>
              <p className="text-sm text-gray-600 font-mono break-all">
                {deploymentStatus.poolAddress}
              </p>
            </div>
          )}

          {deploymentStatus.txHash && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Transaction Hash:</p>
              <p className="text-sm text-gray-600 font-mono break-all">
                {deploymentStatus.txHash}
              </p>
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create Another Pool
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Review & Deploy</h2>
        <p className="text-gray-600">
          Review your pool configuration before deployment. Make sure all settings are correct.
        </p>
      </div>

      {hasError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-md font-medium text-red-800 mb-1">Deployment Failed</h3>
          <p className="text-sm text-red-700">
            {deploymentStatus.message || 'An unknown error occurred during deployment.'}
          </p>
        </div>
      )}

      <div className="space-y-6 mb-8">
        {/* Pool Basics */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Pool Basics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <span className="ml-2 text-gray-600">{poolConfig.basics?.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Network:</span>
              <span className="ml-2 text-gray-600 capitalize">{poolConfig.basics?.network}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Backstop Take Rate:</span>
              <span className="ml-2 text-gray-600">{(poolConfig.basics?.backstopTakeRate * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Max Positions:</span>
              <span className="ml-2 text-gray-600">{poolConfig.basics?.maxPositions}</span>
            </div>
          </div>
        </div>

        {/* Selected Assets */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Assets ({poolConfig.selectedAssets?.length})</h3>
          <div className="flex flex-wrap gap-2">
            {poolConfig.selectedAssets?.map((asset) => (
              <span
                key={asset.symbol}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {asset.symbol}
              </span>
            ))}
          </div>
        </div>

        {/* Risk Parameters Summary */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Risk Parameters</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-700">Asset</th>
                  <th className="text-left py-2 font-medium text-gray-700">Collateral Factor</th>
                  <th className="text-left py-2 font-medium text-gray-700">Liability Factor</th>
                  <th className="text-left py-2 font-medium text-gray-700">Target Util</th>
                  <th className="text-left py-2 font-medium text-gray-700">Enabled</th>
                </tr>
              </thead>
              <tbody>
                {poolConfig.selectedAssets?.map((asset, index) => {
                  const config = poolConfig.reserveConfigs?.[index];
                  if (!config) return null;
                  
                  return (
                    <tr key={asset.symbol} className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">{asset.symbol}</td>
                      <td className="py-2 text-gray-600">{formatPercentage(config.c_factor)}%</td>
                      <td className="py-2 text-gray-600">{formatPercentage(config.l_factor)}%</td>
                      <td className="py-2 text-gray-600">{formatPercentage(config.util)}%</td>
                      <td className="py-2">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          config.enabled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {config.enabled ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Emissions Summary */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Emission Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">By Asset:</h4>
              {poolConfig.selectedAssets?.map((asset, assetIndex) => {
                const assetEmissions = poolConfig.emissions?.filter(e => e.reserve_index === assetIndex) || [];
                const totalShare = assetEmissions.reduce((sum, e) => sum + e.share, 0);
                return (
                  <div key={asset.symbol} className="flex justify-between text-sm">
                    <span className="text-gray-600">{asset.symbol}:</span>
                    <span className="text-gray-600">{(totalShare / 100000).toFixed(2)}%</span>
                  </div>
                );
              })}
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">By Type:</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Suppliers:</span>
                  <span className="text-gray-600">
                    {((poolConfig.emissions?.filter(e => e.res_type === 1).reduce((sum, e) => sum + e.share, 0) || 0) / 100000).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Borrowers:</span>
                  <span className="text-gray-600">
                    {((poolConfig.emissions?.filter(e => e.res_type === 0).reduce((sum, e) => sum + e.share, 0) || 0) / 100000).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-3 text-sm text-gray-700">
            I understand that deploying this pool will create a smart contract on the {poolConfig.basics?.network} network.
            I have reviewed all parameters and confirm they are correct. Pool deployment cannot be undone.
          </span>
        </label>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          disabled={isDeploying}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        
        <button
          onClick={handleDeploy}
          disabled={!agreed || isDeploying}
          className={`px-6 py-2 rounded-md font-medium ${
            agreed && !isDeploying
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isDeploying ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deploying...
            </div>
          ) : (
            'Deploy Pool'
          )}
        </button>
      </div>
    </div>
  );
} 
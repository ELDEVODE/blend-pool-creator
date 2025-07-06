'use client';

import { PoolConfiguration, WalletState } from "@/app/create-pool/page";
import { CheckCircle, AlertCircle, Loader2, Rocket, ExternalLink, Copy, Terminal, Zap, Shield, Target, Settings, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface DeployStepProps {
  config: Partial<PoolConfiguration>;
  wallet: WalletState;
  onDeploy: () => void;
  deploymentStatus: {
    status: 'idle' | 'deploying' | 'success' | 'error';
    message?: string;
    transactionHashes?: string[];
    poolAddress?: string;
    warnings?: string[];
  };
}

export default function DeployStep({ config, wallet, onDeploy, deploymentStatus }: DeployStepProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusIcon = () => {
    switch (deploymentStatus.status) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'deploying':
        return <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-400" />;
      default:
        return <Rocket className="w-8 h-8 text-green-400" />;
    }
  };

  const getStatusTitle = () => {
    switch (deploymentStatus.status) {
      case 'success':
        return 'POOL DEPLOYED SUCCESSFULLY!';
      case 'deploying':
        return 'DEPLOYING TO TESTNET...';
      case 'error':
        return 'DEPLOYMENT FAILED';
      default:
        return 'READY FOR DEPLOYMENT';
    }
  };

  const getStatusMessage = () => {
    switch (deploymentStatus.status) {
      case 'success':
        return 'Your lending pool has been successfully deployed to the Stellar testnet. Users can now interact with it.';
      case 'deploying':
        return deploymentStatus.message || 'Please wait while we deploy your pool to the testnet...';
      case 'error':
        return deploymentStatus.message || 'Something went wrong during deployment. Please try again.';
      default:
        return 'Review your configuration and deploy your lending pool to the Stellar testnet.';
    }
  };

  return (
    <div className="space-y-8">
      {/* Status Header */}
      <div className={`text-center p-8 rounded-2xl border-2 backdrop-blur-sm ${
        deploymentStatus.status === 'success' 
          ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-400/50' 
          : deploymentStatus.status === 'deploying'
            ? 'bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border-yellow-400/50'
            : deploymentStatus.status === 'error'
              ? 'bg-gradient-to-br from-red-900/40 to-pink-900/40 border-red-400/50'
              : 'bg-gradient-to-br from-gray-900/40 to-gray-800/40 border-green-400/30'
      }`}>
        <div className="flex items-center justify-center mb-4">
          {getStatusIcon()}
        </div>
        
        <h2 className={`text-3xl font-bold font-mono mb-3 ${
          deploymentStatus.status === 'success' 
            ? 'text-green-400' 
            : deploymentStatus.status === 'deploying'
              ? 'text-yellow-400'
              : deploymentStatus.status === 'error'
                ? 'text-red-400'
                : 'text-green-400'
        }`}>
          {getStatusTitle()}
        </h2>
        
        <p className="text-gray-300 font-mono text-lg max-w-2xl mx-auto">
          {getStatusMessage()}
        </p>
      </div>

      {/* Configuration Review */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-green-400 font-mono mb-6 flex items-center">
          <Terminal className="w-6 h-6 mr-3" />
          DEPLOYMENT CONFIGURATION
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pool Basics */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-green-400 mr-2" />
              <h4 className="text-lg font-bold text-green-400 font-mono">POOL BASICS</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 font-mono">Name:</span>
                <span className="text-green-300 font-mono font-bold">{config.name || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 font-mono">Network:</span>
                <span className="text-green-300 font-mono bg-green-400/20 px-2 py-1 rounded">TESTNET</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 font-mono">Backstop Rate:</span>
                <span className="text-green-300 font-mono">{config.backstopTakeRate}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 font-mono">Max Positions:</span>
                <span className="text-green-300 font-mono">{config.maxPositions}</span>
              </div>
            </div>
          </div>

          {/* Assets */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Target className="w-5 h-5 text-green-400 mr-2" />
              <h4 className="text-lg font-bold text-green-400 font-mono">ASSETS ({config.selectedAssets?.length || 0})</h4>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {config.selectedAssets?.map((asset, index) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">
                      {asset.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-green-300 font-mono font-bold text-sm">{asset.symbol}</div>
                      <div className="text-gray-400 font-mono text-xs">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-gray-400 font-mono text-xs">{asset.decimals} dec</div>
                </div>
              )) || (
                <div className="text-gray-500 text-center font-mono p-4">No assets selected</div>
              )}
            </div>
          </div>

          {/* Risk Parameters */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
              <h4 className="text-lg font-bold text-green-400 font-mono">RISK PARAMETERS</h4>
            </div>
            
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 font-mono">Preset:</span>
                <span className="text-green-300 font-mono font-bold uppercase">
                  {config.riskParameters?.preset || 'Not set'}
                </span>
              </div>
              {config.riskParameters?.preset === 'custom' && config.riskParameters.customParams && (
                <div className="text-xs text-gray-400 font-mono">
                  Custom parameters configured
                </div>
              )}
            </div>
          </div>

          {/* Wallet Status */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-green-400 mr-2" />
              <h4 className="text-lg font-bold text-green-400 font-mono">WALLET STATUS</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 font-mono">Connection:</span>
                <span className={`font-mono font-bold ${wallet.isConnected ? 'text-green-300' : 'text-red-300'}`}>
                  {wallet.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 font-mono">Secret Key:</span>
                <span className={`font-mono font-bold ${wallet.hasSecretKey ? 'text-green-300' : 'text-red-300'}`}>
                  {wallet.hasSecretKey ? 'PROVIDED' : 'MISSING'}
                </span>
              </div>
              {wallet.publicKey && (
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400 font-mono">Public Key:</span>
                  <span className="text-green-300 font-mono text-sm">
                    {wallet.publicKey.slice(0, 8)}...{wallet.publicKey.slice(-8)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Results */}
      {deploymentStatus.status === 'success' && (
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-green-400 font-mono mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 mr-3" />
            DEPLOYMENT RESULTS
          </h3>
          
          <div className="space-y-4">
            {/* Pool Address */}
            {deploymentStatus.poolAddress && (
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 font-mono font-bold">Pool Address:</span>
                  <button
                    onClick={() => copyToClipboard(deploymentStatus.poolAddress!, 'pool')}
                    className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="text-sm font-mono">
                      {copiedField === 'pool' ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                </div>
                <div className="text-green-300 font-mono text-sm break-all bg-gray-900/50 p-3 rounded-lg">
                  {deploymentStatus.poolAddress}
                </div>
              </div>
            )}

            {/* Transaction Hashes */}
            {deploymentStatus.transactionHashes && deploymentStatus.transactionHashes.length > 0 && (
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <h4 className="text-gray-400 font-mono font-bold mb-3">Transaction Hashes:</h4>
                <div className="space-y-2">
                  {deploymentStatus.transactionHashes.map((hash, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <div className="text-green-300 font-mono text-sm">
                        {hash.slice(0, 16)}...{hash.slice(-16)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyToClipboard(hash, `tx-${index}`)}
                          className="flex items-center space-x-1 text-green-400 hover:text-green-300 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span className="text-xs font-mono">
                            {copiedField === `tx-${index}` ? 'Copied!' : 'Copy'}
                          </span>
                        </button>
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="text-xs font-mono">View</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {deploymentStatus.warnings && deploymentStatus.warnings.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl">
                <h4 className="text-yellow-300 font-mono font-bold mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  WARNINGS
                </h4>
                <ul className="space-y-2">
                  {deploymentStatus.warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-200 font-mono text-sm">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Details */}
      {deploymentStatus.status === 'error' && (
        <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-red-400 font-mono mb-4 flex items-center">
            <AlertCircle className="w-6 h-6 mr-3" />
            ERROR DETAILS
          </h3>
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-red-300 font-mono text-sm">{deploymentStatus.message}</p>
          </div>
        </div>
      )}

      {/* Deploy Button */}
      {deploymentStatus.status === 'idle' && (
        <div className="text-center">
          <button
            onClick={onDeploy}
            disabled={!wallet.isConnected || !wallet.hasSecretKey || !config.name || !config.selectedAssets?.length}
            className="px-12 py-6 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-green-400 text-black font-mono font-bold text-xl rounded-2xl transition-all duration-300 hover:from-green-500 hover:to-emerald-600 hover:shadow-2xl hover:shadow-green-400/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-400 disabled:hover:to-emerald-500 disabled:hover:shadow-none group transform hover:scale-105"
          >
            <div className="flex items-center justify-center space-x-4">
              <Rocket className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
              <span>DEPLOY TO TESTNET</span>
              <Zap className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </button>
        </div>
      )}

      {/* Retry Button */}
      {deploymentStatus.status === 'error' && (
        <div className="text-center">
          <button
            onClick={onDeploy}
            disabled={!wallet.isConnected || !wallet.hasSecretKey || !config.name || !config.selectedAssets?.length}
            className="px-12 py-6 bg-gradient-to-r from-orange-400 to-red-500 border-2 border-orange-400 text-black font-mono font-bold text-xl rounded-2xl transition-all duration-300 hover:from-orange-500 hover:to-red-600 hover:shadow-2xl hover:shadow-orange-400/40 disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-105"
          >
            <div className="flex items-center justify-center space-x-4">
              <Rocket className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
              <span>RETRY DEPLOYMENT</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
} 
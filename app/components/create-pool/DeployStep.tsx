'use client';

import { PoolConfiguration, WalletState } from "@/app/create-pool/page";
import { CheckCircle, AlertCircle, Loader2, Rocket, Terminal, Copy } from "lucide-react";
import { useState } from "react";

type DeploymentStatus = {
  status: 'idle' | 'deploying' | 'success' | 'error';
  message?: string;
  transactionHashes?: string[];
  poolAddress?: string;
  warnings?: string[];
};

interface DeployStepProps {
  config: Partial<PoolConfiguration>;
  wallet: WalletState;
  onDeploy: () => void;
  deploymentStatus: DeploymentStatus;
}

export default function DeployStep({ config, wallet, onDeploy, deploymentStatus }: DeployStepProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };
  
  const SummaryItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="flex justify-between items-center py-2 border-b border-green-400/20">
      <span className="text-gray-400 font-mono">{label}:</span>
      <span className="text-green-300 font-mono text-right">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-green-300 font-mono">Review Configuration</h3>
      <div className="p-4 bg-black border-2 border-green-400/20 rounded-lg space-y-2">
        <SummaryItem label="Pool Name" value={config.name} />
        <SummaryItem label="Network" value={config.network} />
        <SummaryItem label="Backstop Rate" value={`${config.backstopTakeRate}%`} />
        <SummaryItem label="Max Positions" value={config.maxPositions} />
        <SummaryItem label="Assets" value={config.selectedAssets?.map(a => a.symbol).join(', ')} />
        <SummaryItem label="Risk Preset" value={config.riskParameters?.preset} />
      </div>

      <div className="pt-6 border-t-2 border-green-400/20">
        {!wallet.isConnected ? (
          <div className="text-center text-yellow-400 font-mono p-4 bg-yellow-900/50 border border-yellow-400/50 rounded-lg">
            Please connect your wallet to deploy.
          </div>
        ) : !wallet.hasSecretKey ? (
            <div className="text-center text-yellow-400 font-mono p-4 bg-yellow-900/50 border border-yellow-400/50 rounded-lg">
              Please provide your secret key in the wallet section to sign for deployment.
            </div>
        ) : (
          <button
            onClick={onDeploy}
            disabled={deploymentStatus.status === 'deploying'}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-green-400/20 border-2 border-green-400 text-green-300 font-mono font-bold uppercase rounded-lg transition-all duration-300 hover:bg-green-400/30 hover:shadow-lg hover:shadow-green-400/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deploymentStatus.status === 'deploying' ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Deploying...</span>
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6" />
                <span>Deploy Pool</span>
              </>
            )}
          </button>
        )}
      </div>

      {deploymentStatus.message && (
        <div className={`p-4 rounded-lg border flex items-start space-x-3 font-mono ${
          deploymentStatus.status === 'success' ? 'bg-green-900/50 border-green-400/50 text-green-300' :
          deploymentStatus.status === 'error' ? 'bg-red-900/50 border-red-400/50 text-red-300' :
          'bg-gray-900/50 border-gray-700'
        }`}>
          {deploymentStatus.status === 'success' && <CheckCircle className="w-5 h-5 mt-0.5" />}
          {deploymentStatus.status === 'error' && <AlertCircle className="w-5 h-5 mt-0.5" />}
          {deploymentStatus.status === 'deploying' && <Loader2 className="w-5 h-5 mt-0.5 animate-spin" />}
          <p>{deploymentStatus.message}</p>
        </div>
      )}

      {deploymentStatus.warnings && deploymentStatus.warnings.length > 0 && (
        <div className="p-4 rounded-lg border bg-yellow-900/50 border-yellow-400/50 text-yellow-300 space-y-2 font-mono">
            <h4 className="font-bold flex items-center"><AlertCircle className="w-5 h-5 mr-2"/>Warnings</h4>
            <ul className="list-disc list-inside pl-2">
                {deploymentStatus.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
            </ul>
        </div>
      )}

      {(deploymentStatus.poolAddress || deploymentStatus.transactionHashes) && (
        <div className="p-4 rounded-lg border bg-gray-900/50 border-gray-700 space-y-4 font-mono">
          <h4 className="font-bold flex items-center"><Terminal className="w-5 h-5 mr-2"/>Deployment Output</h4>
          {deploymentStatus.poolAddress && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Pool Address:</span>
              <div className="flex items-center space-x-2">
                <span className="text-green-400 font-semibold">{deploymentStatus.poolAddress}</span>
                <button onClick={() => handleCopy(deploymentStatus.poolAddress!, 'poolAddr')} className="text-gray-500 hover:text-green-400">
                  {copied === 'poolAddr' ? <CheckCircle className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                </button>
              </div>
            </div>
          )}
          {deploymentStatus.transactionHashes?.map((hash, i) => (
             <div key={hash} className="flex items-center justify-between">
                <span className="text-gray-400">Tx Hash #{i + 1}:</span>
                <div className="flex items-center space-x-2">
                    <a href={`https://soroban.stellar.expert/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-green-400 font-semibold hover:underline truncate max-w-[200px] md:max-w-xs">{hash}</a>
                    <button onClick={() => handleCopy(hash, `hash-${i}`)} className="text-gray-500 hover:text-green-400">
                      {copied === `hash-${i}` ? <CheckCircle className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                    </button>
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
} 
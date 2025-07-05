'use client';

import { useState, useCallback } from 'react';
import { ChevronRight, Wallet, Settings, Target, Zap, Rocket, CheckCircle, AlertCircle, Loader2, Terminal } from 'lucide-react';
import WalletConnect from '../components/WalletConnect';
import PoolBasicsForm from '../components/create-pool/PoolBasicsForm';
import SelectAssetsForm from '../components/create-pool/SelectAssetsForm';
import RiskParametersForm from '../components/create-pool/RiskParametersForm';
import EmissionsForm from '../components/create-pool/EmissionsForm';
import DeployStep from '../components/create-pool/DeployStep';

// Types
export type WizardStep = 'basics' | 'assets' | 'risk' | 'emissions' | 'deploy';
type DeploymentStatus = { 
  status: 'idle' | 'deploying' | 'success' | 'error'; 
  message?: string;
  transactionHashes?: string[];
  poolAddress?: string;
  warnings?: string[];
};

export type WalletState = {
  isConnected: boolean;
  publicKey: string | null;
  hasSecretKey: boolean;
};

export type PoolConfiguration = {
  name: string;
  network: string;
  backstopTakeRate: number;
  maxPositions: number;
  minCollateral: number;
  selectedAssets: Array<{
    id: string;
    symbol: string;
    name: string;
    address: string;
    decimals: number;
  }>;
  riskParameters: {
    preset: string;
    customParams?: {
      collateralFactor: number;
      liquidationFactor: number;
      util: number;
      maxUtil: number;
      rBase: number;
      rOne: number;
      rTwo: number;
      rThree: number;
      reactivity: number;
    };
  };
  emissions: Array<{
    assetId: string;
    supplyEmission: number;
    borrowEmission: number;
  }>;
};

const steps: { key: WizardStep; title: string; description: string; icon: React.ComponentType<any> }[] = [
  { key: 'basics', title: 'Pool Basics', description: 'Name and general settings', icon: Settings },
  { key: 'assets', title: 'Select Assets', description: 'Choose assets for your pool', icon: Target },
  { key: 'risk', title: 'Risk Parameters', description: 'Configure lending parameters', icon: AlertCircle },
  { key: 'emissions', title: 'Emissions', description: 'Set up reward distribution', icon: Zap },
  { key: 'deploy', title: 'Deploy', description: 'Review and deploy your pool', icon: Rocket },
];

// Progress Steps Component
const ProgressSteps = ({ steps, currentStep, onStepClick }: {
  steps: { key: WizardStep; title: string; description: string; icon: React.ComponentType<any> }[];
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
}) => {
  const currentIndex = steps.findIndex(step => step.key === currentStep);
  
  return (
    <div className="relative">
      {/* Progress bar background */}
      <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-800 rounded-full"></div>
      
      {/* Active progress bar */}
      <div 
        className="absolute top-6 left-6 h-0.5 bg-green-400 rounded-full transition-all duration-500 ease-out shadow-sm shadow-green-400/50"
        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
      ></div>
      
      <div className="flex justify-between relative z-10">
        {steps.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = index < currentIndex;
          const Icon = step.icon;
          
          return (
            <div
              key={step.key}
              className={`flex flex-col items-center cursor-pointer group transition-all duration-300 ${
                isActive ? 'scale-110' : 'hover:scale-105'
              }`}
              onClick={() => onStepClick(step.key)}
            >
              <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 font-mono ${
                isCompleted 
                  ? 'bg-green-400/20 border-green-400 text-green-400 shadow-lg shadow-green-400/25' 
                  : isActive 
                    ? 'bg-green-400/30 border-green-400 text-green-300 shadow-lg shadow-green-400/25 animate-pulse' 
                    : 'bg-black border-gray-700 text-gray-500 group-hover:text-green-400 group-hover:border-green-500/50'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="mt-3 text-center">
                <div className={`text-sm font-bold font-mono transition-colors duration-300 ${
                  isActive ? 'text-green-400' : isCompleted ? 'text-green-400' : 'text-gray-500'
                }`}>
                  {step.title.toUpperCase()}
                </div>
                <div className="text-xs text-gray-600 mt-1 max-w-20 leading-tight font-mono">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function CreatePoolPage() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('basics');
  const [poolConfig, setPoolConfig] = useState<Partial<PoolConfiguration>>({
    // Default values
    name: '',
    network: 'testnet',
    backstopTakeRate: 0.1, // 10%
    maxPositions: 4,
    minCollateral: 0,
    selectedAssets: [],
    riskParameters: { preset: 'balanced' },
    emissions: []
  });
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({ status: 'idle' });
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    publicKey: null,
    hasSecretKey: false
  });
  const [userSecretKey, setUserSecretKey] = useState<string | null>(null);

  const updatePoolConfig = useCallback((section: keyof PoolConfiguration, data: any) => {
    setPoolConfig(prev => ({ ...prev, [section]: data }));
  }, []);

  const handleWalletStateChange = useCallback((state: WalletState) => {
    setWalletState(state);
  }, []);

  const handleSecretKeyUpdate = useCallback((secretKey: string | null) => {
    setUserSecretKey(secretKey);
  }, []);

  const nextStep = () => {
    const stepIndex = steps.findIndex(step => step.key === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].key);
    }
  };

  const prevStep = () => {
    const stepIndex = steps.findIndex(step => step.key === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].key);
    }
  };

  const handleDeploy = useCallback(async () => {
    if (!walletState.isConnected || !walletState.hasSecretKey || !userSecretKey) {
      setDeploymentStatus({ 
        status: 'error', 
        message: 'Wallet not connected or secret key not provided' 
      });
      return;
    }

    setDeploymentStatus({ status: 'deploying', message: 'Deploying pool...' });
    
    try {
      const deploymentData = {
        ...poolConfig,
        userSecretKey
      };

      const response = await fetch('/api/deploy-pool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deploymentData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setDeploymentStatus({ 
          status: 'success', 
          message: 'Pool deployed successfully!',
          transactionHashes: result.transactionHashes,
          poolAddress: result.poolAddress,
          warnings: result.warnings
        });
      } else {
        setDeploymentStatus({ 
          status: 'error', 
          message: result.error || 'Deployment failed'
        });
      }
    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentStatus({ 
        status: 'error', 
        message: 'Failed to deploy pool. Please try again.'
      });
    }
  }, [walletState, userSecretKey, poolConfig]);

  const renderCurrentStep = () => {
    return (
      <div className="bg-black border-2 border-green-400/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center font-mono uppercase">
          <div className="w-8 h-8 bg-green-400/20 border border-green-400 rounded-lg flex items-center justify-center mr-3">
            <span className="text-green-400 font-bold text-sm">{steps.findIndex(s => s.key === currentStep) + 1}</span>
          </div>
          {steps.find(s => s.key === currentStep)?.title}
        </h2>

        <div className="mb-8">
          {currentStep === 'basics' && (
            <PoolBasicsForm config={poolConfig} updateConfig={updatePoolConfig} />
          )}
          {currentStep === 'assets' && (
            <SelectAssetsForm config={poolConfig} updateConfig={updatePoolConfig} />
          )}
          {currentStep === 'risk' && (
            <RiskParametersForm config={poolConfig} updateConfig={updatePoolConfig} />
          )}
          {currentStep === 'emissions' && (
            <EmissionsForm config={poolConfig} updateConfig={updatePoolConfig} />
          )}
          {currentStep === 'deploy' && (
            <DeployStep 
              config={poolConfig} 
              wallet={walletState} 
              onDeploy={handleDeploy}
              deploymentStatus={deploymentStatus}
            />
          )}
        </div>

        <div className="flex justify-between pt-8 border-t-2 border-green-400/20">
          <button
            onClick={prevStep}
            disabled={currentStep === 'basics'}
            className="flex items-center space-x-2 px-6 py-3 text-gray-500 hover:text-green-400 border border-gray-700 hover:border-green-400/50 rounded-lg transition-all duration-300 hover:bg-green-400/5 font-mono font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Previous</span>
          </button>
          
          {currentStep !== 'deploy' && (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-3 bg-green-400/20 border-2 border-green-400 text-green-400 font-mono font-bold uppercase rounded-lg transition-all duration-300 hover:bg-green-400/30 hover:shadow-lg hover:shadow-green-400/25 ml-auto"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Terminal scan lines effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.1) 2px, rgba(34, 197, 94, 0.1) 4px)`
      }}></div>
      
      {/* Background matrix-like effect */}
      <div className="fixed inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2322c55e' fill-opacity='0.3'%3E%3Ctext x='5' y='15' font-family='monospace' font-size='8'%3E0%3C/text%3E%3Ctext x='25' y='35' font-family='monospace' font-size='8'%3E1%3C/text%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Terminal Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-lg text-green-400 text-sm font-mono font-bold mb-6">
            <Terminal className="w-4 h-4" />
            <span>BLEND_PROTOCOL_V2.0</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-green-400 mb-6 leading-tight font-mono">
            CREATE_POOL
          </h1>
          
          <div className="text-green-300 font-mono mb-6">
            <div> Initializing pool creation wizard...</div>
            <div> Loading blockchain parameters...</div>
            <div> System ready. Deploy new lending pool with custom parameters.</div>
          </div>
          
          <div className="mt-8 h-px bg-green-400/30"></div>
        </div>

        {/* Wallet Connection */}
        <div className="mb-12">
          <WalletConnect
            onWalletStateChange={handleWalletStateChange}
            onSecretKeyUpdate={handleSecretKeyUpdate}
          />
        </div>

        {/* Terminal Progress Steps */}
        <div className="mb-12">
          <ProgressSteps 
            steps={steps} 
            currentStep={currentStep} 
            onStepClick={setCurrentStep}
          />
        </div>

        {/* Current Step Content */}
        <div className="mb-12">
          {renderCurrentStep()}
        </div>
        
        {/* Terminal Footer */}
        <div className="text-center text-gray-600 text-sm font-mono">
          <div> POWERED_BY: Blend Protocol</div>
          <div> STATUS: [SECURE] [DECENTRALIZED] [EFFICIENT]</div>
          <div> SYSTEM_VERSION: 2.0.1-alpha</div>
        </div>
      </div>
    </main>
  );
}
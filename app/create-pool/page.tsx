'use client';

import { useState, useCallback } from 'react';
import { ChevronRight, Wallet, Settings, Target, Zap, Rocket, CheckCircle, AlertCircle, Loader2, Terminal, Sparkles, TrendingUp, Activity, Shield, Network, Database } from 'lucide-react';
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
  { key: 'basics', title: 'Basics', description: 'Pool settings', icon: Settings },
  { key: 'assets', title: 'Assets', description: 'Token selection', icon: Target },
  { key: 'risk', title: 'Risk', description: 'Parameters', icon: TrendingUp },
  { key: 'emissions', title: 'Emissions', description: 'Rewards', icon: Zap },
  { key: 'deploy', title: 'Deploy', description: 'Launch pool', icon: Rocket },
];

// Enhanced Progress Steps Component
const ProgressSteps = ({ steps, currentStep, onStepClick }: {
  steps: { key: WizardStep; title: string; description: string; icon: React.ComponentType<any> }[];
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
}) => {
  const currentIndex = steps.findIndex(step => step.key === currentStep);
  const progressPercentage = (currentIndex / (steps.length - 1)) * 100;
  
  return (
    <>
      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes progressFlow {
          0% { 
            background-position: 0% 50%;
          }
          100% { 
            background-position: 100% 50%;
          }
        }
        
        @keyframes nodeGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
          }
          50% { 
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.8);
          }
        }
        
        @keyframes checkBounce {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .progress-line {
          background: linear-gradient(90deg, #22c55e 0%, #10b981 50%, #22c55e 100%);
          background-size: 200% 100%;
          animation: progressFlow 3s ease-in-out infinite;
        }
        
        .node-glow {
          animation: nodeGlow 2s ease-in-out infinite;
        }
        
        .check-bounce {
          animation: checkBounce 0.6s ease-out;
        }
      `}</style>
      
      <div className="relative mb-6">
        <div className="relative bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-green-500/20 rounded-xl p-8 shadow-xl shadow-green-500/10">
          {/* Progress Line Container */}
          <div className="relative flex items-center justify-between mb-8">
            {/* Background Line */}
            <div className="absolute inset-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-700/50 rounded-full mx-12"></div>
            
            {/* Active Progress Line */}
            <div 
              className="absolute top-1/2 left-12 transform -translate-y-1/2 h-1 rounded-full transition-all duration-1000 ease-out progress-line"
              style={{ 
                width: `calc(${progressPercentage}% * (100% - 6rem) / 100)`,
              }}
            ></div>
            
            {/* Progress Nodes */}
            {steps.map((step, index) => {
              const isActive = step.key === currentStep;
              const isCompleted = index < currentIndex;
              const canNavigate = index <= currentIndex;
              const Icon = step.icon;
              
              return (
                <div
                  key={step.key}
                  className="relative flex flex-col items-center z-10"
                  style={{ flex: '1', maxWidth: '120px' }}
                >
                  {/* Node Circle */}
                  <div
                    className={`relative cursor-pointer transition-all duration-500 ${
                      canNavigate ? 'hover:scale-110' : 'cursor-not-allowed'
                    }`}
                    onClick={() => canNavigate && onStepClick(step.key)}
                  >
                    {/* Outer Glow Ring for Active */}
                    {isActive && (
                      <div className="absolute inset-0 w-16 h-16 bg-green-400/20 rounded-full blur-lg node-glow"></div>
                    )}
                    
                    {/* Main Circle */}
                    <div className={`relative w-14 h-14 rounded-full border-3 flex items-center justify-center transition-all duration-500 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/40' 
                        : isActive 
                          ? 'bg-green-500/20 border-green-400 shadow-lg shadow-green-400/30 node-glow' 
                          : canNavigate
                            ? 'bg-gray-700/50 border-gray-500 hover:border-green-500/50 hover:bg-gray-600/50'
                            : 'bg-gray-800/50 border-gray-600 opacity-50'
                    }`}>
                      {/* Inner Content */}
                      <div className="relative z-10">
                        {isCompleted ? (
                          <CheckCircle className="w-7 h-7 text-white check-bounce" />
                        ) : (
                          <Icon className={`w-6 h-6 ${
                            isActive ? 'text-white' : 
                            canNavigate ? 'text-gray-300' : 'text-gray-500'
                          }`} />
                        )}
                      </div>
                      
                      {/* Step Number Badge */}
                      <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                        isCompleted || isActive
                          ? 'bg-green-400 border-white text-black shadow-md'
                          : 'bg-gray-600 border-gray-400 text-gray-200'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  
                  {/* Step Label */}
                  <div className="text-center mt-4 max-w-full">
                    <div className={`text-sm font-bold font-mono transition-all duration-500 ${
                      isActive ? 'text-green-300' : 
                      isCompleted ? 'text-green-400' : 
                      canNavigate ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {step.title.toUpperCase()}
                    </div>
                    <div className={`text-xs mt-1 font-mono transition-all duration-500 ${
                      isActive ? 'text-green-200' : 
                      isCompleted ? 'text-green-300' : 
                      canNavigate ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Status Information */}
          <div className="flex justify-between items-center">
            {/* Progress Percentage */}
            <div className="bg-gray-900/60 border border-green-400/30 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono text-sm font-bold">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
            </div>
            
            {/* Step Counter */}
            <div className="bg-gray-900/60 border border-green-400/30 rounded-full px-4 py-2 backdrop-blur-sm">
              <span className="text-green-400 font-mono text-sm font-bold">
                Step {currentIndex + 1} of {steps.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function CreatePoolPage() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('basics');
  const [poolConfig, setPoolConfig] = useState<Partial<PoolConfiguration>>({
    // Default values - TESTNET ONLY
    name: '',
    network: 'testnet', // Fixed to testnet only
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

  // Validation functions
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'basics':
        return !!(poolConfig.name && poolConfig.name.length >= 2);
      case 'assets':
        return !!(poolConfig.selectedAssets && poolConfig.selectedAssets.length > 0);
      case 'risk':
        return !!(poolConfig.riskParameters && poolConfig.riskParameters.preset);
      case 'emissions':
        // Emissions are optional, so this step is always valid
        return true;
      case 'deploy':
        return !!(
          poolConfig.name &&
          poolConfig.selectedAssets &&
          poolConfig.selectedAssets.length > 0 &&
          poolConfig.riskParameters &&
          walletState.isConnected &&
          walletState.hasSecretKey
        );
      default:
        return false;
    }
  };

  const getValidationMessage = (): string | null => {
    switch (currentStep) {
      case 'basics':
        if (!poolConfig.name) return 'Pool name is required';
        if (poolConfig.name.length < 2) return 'Pool name must be at least 2 characters';
        return null;
      case 'assets':
        if (!poolConfig.selectedAssets || poolConfig.selectedAssets.length === 0) {
          return 'Please select at least one asset for your pool';
        }
        if (poolConfig.selectedAssets.length > (poolConfig.maxPositions || 4)) {
          return `You can select at most ${poolConfig.maxPositions || 4} assets (current max positions setting)`;
        }
        return null;
      case 'risk':
        if (!poolConfig.riskParameters?.preset) return 'Please select a risk parameter preset';
        if (poolConfig.riskParameters.preset === 'custom' && poolConfig.riskParameters.customParams) {
          const params = poolConfig.riskParameters.customParams;
          if (params.util >= params.maxUtil) return 'Utilization threshold must be less than max utilization';
          if (params.collateralFactor > 1) return 'Collateral factor must be ≤ 1';
          if (params.liquidationFactor > 1) return 'Liquidation factor must be ≤ 1';
          if (params.reactivity > 1000) return 'Reactivity must be ≤ 1000';
        }
        return null;
      case 'deploy':
        if (!walletState.isConnected) return 'Please connect your wallet';
        if (!walletState.hasSecretKey) return 'Please provide your secret key for deployment';
        return null;
      default:
        return null;
    }
  };

  const handleWalletStateChange = useCallback((state: WalletState) => {
    setWalletState(state);
  }, []);

  const handleSecretKeyUpdate = useCallback((secretKey: string | null) => {
    setUserSecretKey(secretKey);
  }, []);

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return; // Don't proceed if current step is invalid
    }
    
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
    // Enforce testnet only
    if (poolConfig.network !== 'testnet') {
      setDeploymentStatus({ 
        status: 'error', 
        message: 'Only testnet deployments are supported' 
      });
      return;
    }

    if (!walletState.isConnected || !walletState.hasSecretKey || !userSecretKey) {
      setDeploymentStatus({ 
        status: 'error', 
        message: 'Wallet not connected or secret key not provided' 
      });
      return;
    }

    // Comprehensive validation
    if (!poolConfig.name || poolConfig.name.length < 2) {
      setDeploymentStatus({ 
        status: 'error', 
        message: 'Pool name must be at least 2 characters long' 
      });
      return;
    }

    if (!poolConfig.selectedAssets || poolConfig.selectedAssets.length === 0) {
      setDeploymentStatus({ 
        status: 'error', 
        message: 'Please select at least one asset for your pool' 
      });
      return;
    }

    if (poolConfig.selectedAssets.length > (poolConfig.maxPositions || 4)) {
      setDeploymentStatus({ 
        status: 'error', 
        message: `Too many assets selected. Maximum allowed: ${poolConfig.maxPositions || 4}` 
      });
      return;
    }

    if (!poolConfig.riskParameters || !poolConfig.riskParameters.preset) {
      setDeploymentStatus({ 
        status: 'error', 
        message: 'Please configure risk parameters for your pool' 
      });
      return;
    }

    setDeploymentStatus({ status: 'deploying', message: 'Validating configuration...' });
    
    try {
      const deploymentData = {
        ...poolConfig,
        userSecretKey,
        network: 'testnet' // Force testnet
      };

      setDeploymentStatus({ status: 'deploying', message: 'Submitting deployment request...' });

      const response = await fetch('/api/deploy-pool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deploymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle specific error types
        if (response.status === 400) {
          if (errorData.errors && Array.isArray(errorData.errors)) {
            throw new Error(`Validation failed: ${errorData.errors.join(', ')}`);
          } else {
            throw new Error(errorData.error || 'Invalid configuration');
          }
        } else if (response.status === 500) {
          throw new Error(`Deployment failed: ${errorData.details || errorData.error || 'Server error'}`);
        } else {
          throw new Error(errorData.error || `HTTP ${response.status}: Deployment failed`);
        }
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Deployment failed');
      }

      setDeploymentStatus({ 
        status: 'success', 
        message: 'Pool deployed successfully on testnet!',
        transactionHashes: result.transactionHashes || [],
        poolAddress: result.poolAddress,
        warnings: result.warnings || []
      });

    } catch (error) {
      console.error('Deployment error:', error);
      
      let errorMessage = 'Deployment failed';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error: Could not connect to deployment service';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setDeploymentStatus({ 
        status: 'error', 
        message: errorMessage
      });
    }
  }, [poolConfig, walletState, userSecretKey]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'basics':
        return (
          <PoolBasicsForm
            config={poolConfig}
            updateConfig={updatePoolConfig}
          />
        );
      case 'assets':
        return (
          <SelectAssetsForm
            config={poolConfig}
            updateConfig={updatePoolConfig}
          />
        );
      case 'risk':
        return (
          <RiskParametersForm
            config={poolConfig}
            updateConfig={updatePoolConfig}
          />
        );
      case 'emissions':
        return (
          <EmissionsForm
            config={poolConfig}
            updateConfig={updatePoolConfig}
          />
        );
      case 'deploy':
        return (
          <DeployStep
            config={poolConfig}
            wallet={walletState}
            onDeploy={handleDeploy}
            deploymentStatus={deploymentStatus}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Matrix-like background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2322c55e' fill-opacity='0.1'%3E%3Ctext x='10' y='20' font-family='monospace' font-size='12'%3E0%3C/text%3E%3Ctext x='40' y='50' font-family='monospace' font-size='12'%3E1%3C/text%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10 container mx-auto px-4 py-5">
        {/* Enhanced Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full text-green-400 text-xs font-mono font-bold mb-3 backdrop-blur-sm">
            <Terminal className="w-3 h-3" />
            <span>BLEND_PROTOCOL_V2.1</span>
            <Sparkles className="w-3 h-3 animate-pulse" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-mono bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent leading-tight">
            CREATE LENDING POOL
          </h1>
          
          <p className="text-sm text-gray-300 font-mono mb-3 max-w-lg mx-auto">
            Deploy your custom lending pool on 
            <span className="text-green-400 font-bold mx-1 px-2 py-0.5 bg-green-400/20 rounded border border-green-400/30">
              STELLAR TESTNET
            </span>
            with enterprise-grade security
          </p>
          
          <div className="mt-3 p-2 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg backdrop-blur-sm max-w-lg mx-auto">
            <div className="flex items-center justify-center">
              <Shield className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
              <span className="text-yellow-300 font-mono text-xs">
                🚀 Configured for <strong>TESTNET ONLY</strong> for safe testing
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {/* Left Sidebar - Enhanced */}
          <div className="lg:col-span-1 space-y-4">
            {/* Wallet Connection */}
            <WalletConnect 
              onWalletStateChange={handleWalletStateChange}
              onSecretKeyUpdate={handleSecretKeyUpdate}
            />

            {/* Enhanced Config Summary */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-600/50 rounded-lg p-3 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-green-400 font-mono mb-3 flex items-center">
                <Database className="w-3 h-3 mr-1" />
                CONFIG SUMMARY
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-green-300 truncate ml-2">{poolConfig.name || 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Assets:</span>
                  <span className="text-green-300">{poolConfig.selectedAssets?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Risk:</span>
                  <span className="text-green-300 truncate ml-2">{poolConfig.riskParameters?.preset || 'None'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-green-300 bg-green-400/20 px-1 rounded">TESTNET</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-600/50 rounded-lg p-3 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-green-400 font-mono mb-3 flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                SYSTEM STATUS
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">API:</span>
                  <span className="text-green-300 flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                    ONLINE
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-green-300 flex items-center">
                    <Network className="w-3 h-3 mr-1" />
                    TESTNET
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Version:</span>
                  <span className="text-green-300">v2.1.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - Enhanced */}
          <div className="lg:col-span-4 space-y-4">
            {/* Progress Steps */}
            <ProgressSteps 
              steps={steps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />

            {/* Form Content */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-green-500/30 rounded-lg shadow-xl shadow-green-500/10">
              {/* Step header */}
              <div className="p-4 border-b border-green-400/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-green-400/30">
                      <span className="text-black font-bold text-sm font-mono">{steps.findIndex(s => s.key === currentStep) + 1}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-green-400 font-mono uppercase tracking-wide">
                        {steps.find(s => s.key === currentStep)?.title}
                      </h2>
                      <p className="text-gray-400 font-mono text-sm">
                        {steps.find(s => s.key === currentStep)?.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Step Progress Indicator */}
                  <div className="bg-gray-800/50 border border-green-400/20 rounded-md px-3 py-1">
                    <span className="text-green-400 font-mono text-sm font-bold">
                      {steps.findIndex(s => s.key === currentStep) + 1}/{steps.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form content */}
              <div className="p-4">
                {renderCurrentStep()}
              </div>

              {/* Navigation */}
              <div className="border-t border-green-400/20 p-4">
                {/* Validation message */}
                {getValidationMessage() && (
                  <div className="mb-4">
                    <div className="p-3 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-500/40 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                        <span className="text-yellow-300 font-mono text-xs">
                          {getValidationMessage()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 'basics'}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-green-400 border border-gray-700 hover:border-green-400/50 rounded-lg transition-all duration-300 hover:bg-green-400/5 font-mono font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:border-gray-700 group"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180 group-hover:translate-x-[-2px] transition-transform duration-300" />
                    <span>PREV</span>
                  </button>
                  
                  {currentStep !== 'deploy' && (
                    <button
                      onClick={nextStep}
                      disabled={!validateCurrentStep()}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 border border-green-400 text-black font-mono font-bold text-sm rounded-lg transition-all duration-300 hover:from-green-500 hover:to-emerald-600 hover:shadow-lg hover:shadow-green-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-400 disabled:hover:to-emerald-500 disabled:hover:shadow-none group transform hover:scale-105"
                    >
                      <span>NEXT</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-6 text-gray-500 font-mono text-xs">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <div className="h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent flex-1"></div>
            <Sparkles className="w-3 h-3 text-green-400 animate-pulse" />
            <div className="h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent flex-1"></div>
          </div>
          <div>BLEND PROTOCOL • VERSION: 2.1.0-testnet • BUILD: stellar-soroban • STATUS: ACTIVE</div>
        </div>
      </div>
    </div>
  );
}
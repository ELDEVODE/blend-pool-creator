'use client';

import { useState } from 'react';
import { Wallet, Eye, EyeOff, CheckCircle, AlertCircle, Key, Shield, Terminal, Zap, Wifi, WifiOff } from 'lucide-react';

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  hasSecretKey: boolean;
}

interface WalletConnectProps {
  onWalletStateChange: (state: WalletState) => void;
  onSecretKeyUpdate: (secretKey: string | null) => void;
}

export default function WalletConnect({ onWalletStateChange, onSecretKeyUpdate }: WalletConnectProps) {
  const [publicKey, setPublicKey] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const validateKeys = () => {
    setError(null);
    
    if (!publicKey || !secretKey) {
      setError('Both keys required');
      return false;
    }

    if (!publicKey.startsWith('G') || publicKey.length !== 56) {
      setError('Invalid public key format');
      return false;
    }

    if (!secretKey.startsWith('S') || secretKey.length !== 56) {
      setError('Invalid secret key format');
      return false;
    }

    return true;
  };

  const handleConnect = async () => {
    if (!validateKeys()) return;

    setStatus('connecting');
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('connected');
      setIsConnected(true);
      setIsExpanded(false);
      
      const walletState = {
        isConnected: true,
        publicKey,
        hasSecretKey: true
      };
      
      onWalletStateChange(walletState);
      onSecretKeyUpdate(secretKey);
      
    } catch (err) {
      setError('Connection failed');
      setStatus('error');
    }
  };

  const handleDisconnect = () => {
    setStatus('idle');
    setIsConnected(false);
    setError(null);
    setIsExpanded(false);
    
    const walletState = {
      isConnected: false,
      publicKey: null,
      hasSecretKey: false
    };
    
    onWalletStateChange(walletState);
    onSecretKeyUpdate(null);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return <Wifi className="w-4 h-4" />;
      case 'connecting': return <Zap className="w-4 h-4 animate-pulse" />;
      case 'error': return <WifiOff className="w-4 h-4" />;
      default: return <Wallet className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'from-green-400 to-emerald-500';
      case 'connecting': return 'from-yellow-400 to-orange-500';
      case 'error': return 'from-red-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="relative">
      {/* Compact Status Header */}
      <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-green-500/30 rounded-lg p-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${getStatusColor()} flex items-center justify-center shadow-sm`}>
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="text-xs font-bold text-green-400 font-mono">WALLET</h3>
              <p className="text-xs text-gray-400 font-mono">
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`px-2 py-1 rounded text-xs font-bold font-mono ${
            status === 'connected' ? 'bg-green-400/20 text-green-400' :
            status === 'connecting' ? 'bg-yellow-400/20 text-yellow-400' :
            status === 'error' ? 'bg-red-400/20 text-red-400' :
            'bg-gray-400/20 text-gray-400'
          }`}>
            {status === 'connected' ? 'READY' : 
             status === 'connecting' ? 'CONN...' : 
             status === 'error' ? 'ERROR' : 'IDLE'}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex space-x-2">
          {!isConnected ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 py-2 bg-gradient-to-r from-green-400/20 to-emerald-500/20 border border-green-400/30 text-green-400 font-mono font-bold text-xs rounded-md transition-all duration-300 hover:from-green-400/30 hover:to-emerald-500/30 hover:scale-105"
            >
              {isExpanded ? 'CLOSE' : 'CONNECT'}
            </button>
          ) : (
            <>
              <div className="flex-1 py-2 bg-gradient-to-r from-green-400/20 to-emerald-500/20 border border-green-400/30 text-green-400 font-mono font-bold text-xs rounded-md text-center">
                ACTIVE
              </div>
              <button
                onClick={handleDisconnect}
                className="px-3 py-2 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/30 text-gray-400 font-mono font-bold text-xs rounded-md transition-all duration-300 hover:from-gray-600/30 hover:to-gray-700/30"
              >
                DISC
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded Connection Form */}
      {isExpanded && !isConnected && (
        <div className="mt-3 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-4">
            {/* Public Key */}
            <div>
              <label className="flex items-center text-xs font-bold text-green-400 font-mono mb-2">
                <Key className="w-3 h-3 mr-1" />
                Public Key
              </label>
              <input
                type="text"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                className="w-full bg-gray-900/50 border border-green-500/30 rounded-md p-2 text-green-300 font-mono text-xs focus:ring-1 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 placeholder-gray-500"
                placeholder="G..."
              />
            </div>

            {/* Secret Key */}
            <div>
              <label className="flex items-center text-xs font-bold text-green-400 font-mono mb-2">
                <Shield className="w-3 h-3 mr-1" />
                Secret Key
              </label>
              <div className="relative">
                <input
                  type={showSecretKey ? 'text' : 'password'}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full bg-gray-900/50 border border-green-500/30 rounded-md p-2 pr-8 text-green-300 font-mono text-xs focus:ring-1 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 placeholder-gray-500"
                  placeholder="S..."
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
                >
                  {showSecretKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-md p-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                  <span className="text-red-300 font-mono text-xs">{error}</span>
                </div>
              </div>
            )}

            {/* Security Note */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-md p-2">
              <div className="flex items-start space-x-2">
                <Shield className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-yellow-300 font-mono text-xs">
                  <div className="font-bold mb-1">Testnet Only</div>
                  <div className="text-xs">Keys used locally, not stored</div>
                </div>
              </div>
            </div>

            {/* Connect Button */}
            <button
              onClick={handleConnect}
              disabled={status === 'connecting' || !publicKey || !secretKey}
              className="w-full py-2 bg-gradient-to-r from-green-400 to-emerald-500 border border-green-400 text-black font-mono font-bold text-xs rounded-md transition-all duration-300 hover:from-green-500 hover:to-emerald-600 hover:shadow-md hover:shadow-green-400/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {status === 'connecting' ? 'CONNECTING...' : 'CONNECT WALLET'}
            </button>
          </div>
        </div>
      )}

      {/* Connected Status Detail */}
      {isConnected && (
        <div className="mt-3 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-3 shadow-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">Address:</span>
              <span className="text-green-300 font-mono text-xs">
                {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">Network:</span>
              <span className="text-green-300 font-mono text-xs bg-green-400/20 px-1 rounded">
                TESTNET
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">Status:</span>
              <span className="text-green-300 font-mono text-xs flex items-center">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                READY
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
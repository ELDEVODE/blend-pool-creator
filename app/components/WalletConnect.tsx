'use client';

import { useState, useEffect } from 'react';
import { Keypair } from '@stellar/stellar-sdk';
import { Wallet, Key, CheckCircle, AlertCircle, Loader2, LogOut, Eye, EyeOff } from 'lucide-react';
import { useAccount } from '../hooks/useWallet';
import { useIsMounted } from '../hooks/useIsMounted';

interface WalletConnectProps {
  onWalletStateChange: (state: {
    isConnected: boolean;
    publicKey: string | null;
    hasSecretKey: boolean;
  }) => void;
  onSecretKeyUpdate: (secretKey: string | null) => void;
}

export default function WalletConnect({ onWalletStateChange, onSecretKeyUpdate }: WalletConnectProps) {
  const isMounted = useIsMounted();
  const { account, error: accountError, loading, connect, disconnect } = useAccount();
  
  const [deploymentPublicKey, setDeploymentPublicKey] = useState('');
  const [deploymentSecretKey, setDeploymentSecretKey] = useState('');
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [hasValidCredentials, setHasValidCredentials] = useState(false);
  const [credentialError, setCredentialError] = useState<string | null>(null);

  // Load deployment keys from localStorage and validate them on mount
  useEffect(() => {
    const storedPublicKey = localStorage.getItem('deploymentPublicKey');
    const storedSecretKey = localStorage.getItem('deploymentSecretKey');
    if (storedPublicKey && storedSecretKey) {
      handleCredentialChange(storedPublicKey, storedSecretKey);
    }
  }, []);

  // Notify parent page of state changes
  useEffect(() => {
    onWalletStateChange({
      isConnected: !!account,
      publicKey: hasValidCredentials ? deploymentPublicKey : null,
      hasSecretKey: hasValidCredentials,
    });
  }, [account, hasValidCredentials, deploymentPublicKey, onWalletStateChange]);

  const handleCredentialChange = (pubKey: string, secKey: string) => {
    setDeploymentPublicKey(pubKey);
    setDeploymentSecretKey(secKey);

    if (pubKey.trim() === '' && secKey.trim() === '') {
      setHasValidCredentials(false);
      setCredentialError(null);
      if (onSecretKeyUpdate) onSecretKeyUpdate(null);
      localStorage.removeItem('deploymentPublicKey');
      localStorage.removeItem('deploymentSecretKey');
      return;
    }

    if (!pubKey.trim() || !secKey.trim()) {
      setHasValidCredentials(false);
      if (onSecretKeyUpdate) onSecretKeyUpdate(null);
      return;
    }

    try {
      const keypair = Keypair.fromSecret(secKey);
      if (keypair.publicKey() !== pubKey) {
        setCredentialError('Secret key does not match the provided public key.');
        setHasValidCredentials(false);
        if (onSecretKeyUpdate) onSecretKeyUpdate(null);
        localStorage.removeItem('deploymentPublicKey');
        localStorage.removeItem('deploymentSecretKey');
        return;
      }
      
      setHasValidCredentials(true);
      setCredentialError(null);
      if (onSecretKeyUpdate) onSecretKeyUpdate(secKey);
      localStorage.setItem('deploymentPublicKey', pubKey);
      localStorage.setItem('deploymentSecretKey', secKey);
    } catch (err) {
      setHasValidCredentials(false);
      if (onSecretKeyUpdate) onSecretKeyUpdate(null);
      setCredentialError('Invalid secret key format.');
      localStorage.removeItem('deploymentPublicKey');
      localStorage.removeItem('deploymentSecretKey');
    }
  };
  
  const handleDisconnect = () => {
    disconnect();
    handleCredentialChange('', '');
  };

  if (!isMounted || loading) {
    return (
      <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 text-center font-mono text-green-300">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
        Initializing Wallet Connection...
      </div>
    );
  }

  return (
    <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 space-y-4">
      {!account ? (
        <>
          <h3 className="text-xl font-bold text-green-400 font-mono flex items-center"><Wallet className="mr-3" />Connect Wallet</h3>
          <p className="text-gray-500 font-mono">Freighter wallet is required to sign and deploy transactions.</p>
          <button
            onClick={connect}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-400/20 border-2 border-green-400 text-green-400 font-mono font-bold uppercase rounded-lg transition-all duration-300 hover:bg-green-400/30 hover:shadow-lg hover:shadow-green-400/25"
          >
            Connect Freighter
          </button>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-green-400 font-mono flex items-center"><CheckCircle className="mr-3" />Wallet Connected</h3>
            <button onClick={handleDisconnect} className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors font-mono">
              <LogOut className="w-4 h-4"/>
              <span>Disconnect</span>
            </button>
          </div>
          <div className="p-3 bg-gray-900/50 border border-green-400/20 rounded-lg font-mono">
            <span className="text-gray-500">Public Key: </span>
            <span className="text-green-300">{account.publicKey}</span>
          </div>
          
          <div className="pt-4 border-t-2 border-green-400/10">
            <h4 className="text-lg font-bold text-green-400 font-mono flex items-center mb-2"><Key className="mr-3" />Deployment Credentials</h4>
            <p className="text-gray-500 font-mono text-sm mb-3">
              Provide the public and secret key of the account that will deploy the pool. This is stored in your browser's local storage.
            </p>
            <div className="space-y-3">
                <div>
                    <label className="text-sm font-mono text-gray-400 mb-1 block">Public Key</label>
                    <input
                        type='text'
                        value={deploymentPublicKey}
                        onChange={(e) => handleCredentialChange(e.target.value, deploymentSecretKey)}
                        placeholder="Enter public key (starts with G...)"
                        className="w-full bg-black border-2 border-green-400/50 rounded-lg p-3 text-green-300 font-mono focus:ring-green-400 focus:border-green-400"
                    />
                </div>
                <div>
                    <label className="text-sm font-mono text-gray-400 mb-1 block">Secret Key</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type={isKeyVisible ? 'text' : 'password'}
                            value={deploymentSecretKey}
                            onChange={(e) => handleCredentialChange(deploymentPublicKey, e.target.value)}
                            placeholder="Enter secret key (starts with S...)"
                            className="flex-grow bg-black border-2 border-green-400/50 rounded-lg p-3 text-green-300 font-mono focus:ring-green-400 focus:border-green-400"
                        />
                        <button onClick={() => setIsKeyVisible(!isKeyVisible)} className="p-3 border-2 border-green-400/50 rounded-lg text-green-300 hover:bg-green-400/10">
                            {isKeyVisible ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </>
      )}

      {(accountError || credentialError) && (
        <div className="p-3 bg-red-900/50 border border-red-400/50 rounded-lg text-red-300 font-mono flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{accountError || credentialError}</span>
        </div>
      )}
    </div>
  );
} 
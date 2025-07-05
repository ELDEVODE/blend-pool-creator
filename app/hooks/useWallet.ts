'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  isConnected, 
  requestAccess,
  signTransaction as freighterSignTransaction,
  getAddress,
  isAllowed
} from '@stellar/freighter-api';

// Type-safe check for Freighter API
declare global {
  interface Window {
    freighter?: any;
  }
}

export interface WalletInfo {
  publicKey: string;
  isConnected: boolean;
  walletType: string;
}

export function useIsMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

// Check if Freighter is available by testing its API
async function checkFreighterAvailable(): Promise<boolean> {
  try {
    // Try to call isAllowed - this will work if Freighter is installed
    await isAllowed();
    return true;
  } catch (error) {
    // If this fails, Freighter is likely not installed
    return false;
  }
}

export function useAccount() {
  const [account, setAccount] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [freighterAvailable, setFreighterAvailable] = useState<boolean | null>(null);
  const mounted = useIsMounted();

  // Check if Freighter is available
  const checkFreighterInstalled = useCallback(async () => {
    if (!mounted) return;
    
    try {
      const available = await checkFreighterAvailable();
      setFreighterAvailable(available);
      return available;
    } catch (error) {
      console.error('Error checking Freighter availability:', error);
      setFreighterAvailable(false);
      return false;
    }
  }, [mounted]);

  const checkConnection = useCallback(async () => {
    if (!mounted) return;
    
    try {
      setLoading(true);
      setError('');
      
      // First check if Freighter is available
      const available = await checkFreighterInstalled();
      if (!available) {
        setError('Freighter wallet not detected. Please install the Freighter browser extension.');
        setAccount(null);
        return;
      }

      const connected = await isConnected();
      
      if (connected) {
        const result = await getAddress();
        setAccount({
          publicKey: result.address,
          isConnected: true,
          walletType: 'freighter'
        });
      } else {
        setAccount(null);
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
      
      let errorMessage = 'Failed to check wallet connection';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      // Provide more specific error messages
      if (errorMessage.toLowerCase().includes('not allowed') || errorMessage.toLowerCase().includes('denied')) {
        errorMessage = 'Wallet access was denied. Please grant permission to connect.';
      } else if (errorMessage.toLowerCase().includes('timeout')) {
        errorMessage = 'Connection timed out. Please try again.';
      } else if (errorMessage.toLowerCase().includes('freighter')) {
        errorMessage = 'Freighter wallet not detected. Please install it from https://freighter.app/';
      }
      
      setError(errorMessage);
      setAccount(null);
    } finally {
      setLoading(false);
    }
  }, [mounted, checkFreighterInstalled]);

  const connect = useCallback(async () => {
    if (!mounted) return;
    
    try {
      setLoading(true);
      setError('');
      
      // First check if Freighter is available
      const available = await checkFreighterInstalled();
      if (!available) {
        setError('Freighter wallet not detected. Please install the Freighter browser extension.');
        return;
      }

      // Request access with timeout
      const accessPromise = requestAccess();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout - please check if Freighter is responding')), 30000)
      );
      
      await Promise.race([accessPromise, timeoutPromise]);
      await checkConnection();
    } catch (err) {
      console.error('Error connecting wallet:', err);
      
      let errorMessage = 'Failed to connect wallet';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      // Provide more specific error messages
      if (errorMessage.toLowerCase().includes('user declined') || errorMessage.toLowerCase().includes('denied')) {
        errorMessage = 'Wallet connection was declined. Please try again and approve the connection.';
      } else if (errorMessage.toLowerCase().includes('timeout')) {
        errorMessage = 'Connection timed out. Please check if Freighter is responding and try again.';
      } else if (errorMessage.toLowerCase().includes('freighter')) {
        errorMessage = 'Freighter wallet not detected. Please install it from https://freighter.app/';
      }
      
      setError(errorMessage);
      setAccount(null);
    } finally {
      setLoading(false);
    }
  }, [checkConnection, mounted, checkFreighterInstalled]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setError('');
  }, []);

  const signTransaction = useCallback(async (xdr: string, options?: { networkPassphrase?: string; address?: string }) => {
    if (!account?.isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      return await freighterSignTransaction(xdr, options);
    } catch (err) {
      console.error('Error signing transaction:', err);
      throw err;
    }
  }, [account]);

  // Check Freighter availability on mount
  useEffect(() => {
    if (mounted) {
      checkFreighterInstalled().then(() => {
        checkConnection();
      });
    }
  }, [mounted, checkFreighterInstalled, checkConnection]);

  return {
    account,
    loading,
    error,
    connect,
    disconnect,
    checkConnection,
    signTransaction,
    isFreighterInstalled: freighterAvailable ?? false
  };
} 
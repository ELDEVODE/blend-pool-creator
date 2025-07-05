'use client';

import { useAccount } from '../hooks/useWallet';

interface ConnectButtonProps {
  label?: string;
  className?: string;
}

export function ConnectButton({ label = "Connect Wallet", className = "" }: ConnectButtonProps) {
  const { connect, loading, error } = useAccount();

  return (
    <div className="space-y-3">
      <button
        onClick={connect}
        disabled={loading}
        className={`group inline-flex items-center px-6 py-3 border-2 border-green-500 text-green-400 font-mono font-medium rounded-md bg-black hover:bg-green-500/10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed terminal-glow transition-all duration-300 uppercase tracking-wider ${className}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="terminal-cursor">Connecting</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-3 group-hover:text-green-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="mr-2">&gt;</span>
            {label}
          </>
        )}
      </button>
      
      {error && (
        <div className="p-3 bg-red-950/50 border border-red-500/50 rounded-md text-sm text-red-400 font-mono terminal-border backdrop-blur-sm">
          <span className="text-red-300 mr-2">ERROR:</span>
          {error}
        </div>
      )}
      
      <div className="text-xs text-green-400/60 font-mono">
        &gt; No Freighter wallet? 
        <a 
          href="https://freighter.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-2 text-green-400 hover:text-green-300 underline transition-colors"
        >
          Install here
        </a>
      </div>
    </div>
  );
} 
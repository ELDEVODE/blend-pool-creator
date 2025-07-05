# Blend Pool Creator - Deployment Integration Guide

This document explains how to integrate the frontend pool creator with real wallet transactions and the existing deployment scripts.

## Current Status

✅ **Completed:**
- 5-step wizard UI for pool configuration
- Wallet connection interface (Freighter integration)
- Real asset fetching from contract JSON files
- Form validation and parameter presets
- Simulated deployment flow

🔧 **Next Steps for Production:**
- Replace simulated deployment with real transactions
- Add transaction signing through connected wallet
- Implement proper error handling for failed transactions
- Add transaction status monitoring

## Architecture Overview

```
Frontend (Next.js) → API Routes → Existing Scripts → Stellar Network
     ↓                  ↓              ↓
User Input     →  Validation  →  Deployment  →  Pool Created
Wallet Sign    →  TX Building →  Submission  →  Confirmation
```

## Wallet Integration

### Current Implementation

The `WalletConnect` component handles:
- Freighter wallet detection and connection
- Public key retrieval
- Connection status management
- Network-aware display

### Wallet Interface

```typescript
interface WalletInfo {
  publicKey: string;
  isConnected: boolean;
  walletType: string;
}
```

## API Integration Points

### 1. `/api/deploy-pool/route.ts`

**Current:** Simulated deployment with validation
**Next:** Replace with real deployment logic

```typescript
// Replace the simulated deployment section with:
import { setupPool, setupReserve } from '../../../src/utils/pool-setup';
import { AddressBook } from '../../../src/utils/address-book';
import envConfig from '../../../src/utils/env_config';

export async function POST(request: NextRequest) {
  try {
    const config: PoolConfiguration = await request.json();
    
    // 1. Set up network configuration
    const network = envConfig(config.basics.network);
    const addressBook = new AddressBook(network);
    
    // 2. Create admin keypair from connected wallet
    // Note: In production, transactions would be signed by the user's wallet
    const adminKeypair = Keypair.fromPublicKey(config.wallet.publicKey);
    
    // 3. Set up the pool
    const poolResult = await setupPool({
      name: config.basics.name,
      salt: Buffer.from(config.basics.name).toString('hex'),
      oracle: addressBook.getContractId('oracle'),
      backstopTakeRate: config.basics.backstopTakeRate,
      maxPositions: config.basics.maxPositions,
      admin: adminKeypair,
      addressBook,
    });
    
    // 4. Set up reserves for each asset
    for (const [index, asset] of config.selectedAssets.entries()) {
      if (asset.enabled) {
        const reserveConfig = config.reserveConfigs[index];
        await setupReserve({
          poolId: poolResult.poolAddress,
          assetId: asset.contractId,
          config: reserveConfig,
          admin: adminKeypair,
          addressBook,
        });
      }
    }
    
    // 5. Configure emissions
    if (config.emissions.length > 0) {
      // Implementation for emission configuration
    }
    
    return NextResponse.json({
      success: true,
      poolAddress: poolResult.poolAddress,
      txHash: poolResult.txHash,
      network: config.basics.network,
      message: 'Pool deployed successfully',
    });
    
  } catch (error) {
    // Error handling
  }
}
```

## Real Transaction Flow

### 1. Transaction Building
```typescript
// In the deployment API
const transaction = await buildPoolDeploymentTransaction({
  config,
  network,
  addressBook,
});

// Return unsigned transaction XDR to frontend
return NextResponse.json({
  success: true,
  transactionXDR: transaction.toXDR(),
  needsSignature: true,
});
```

### 2. Transaction Signing (Frontend)
```typescript
// In the deployment summary component
const signAndSubmitTransaction = async (transactionXDR: string) => {
  try {
    // Sign with connected wallet
    const signedXDR = await window.freighter.signTransaction(
      transactionXDR,
      {
        network: config.basics.network,
        accountToSign: wallet.publicKey,
      }
    );
    
    // Submit signed transaction
    const result = await fetch('/api/submit-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signedXDR,
        network: config.basics.network,
      }),
    });
    
    return await result.json();
  } catch (error) {
    console.error('Transaction signing failed:', error);
    throw error;
  }
};
```

### 3. Transaction Submission
```typescript
// New API route: /api/submit-transaction/route.ts
export async function POST(request: NextRequest) {
  try {
    const { signedXDR, network } = await request.json();
    
    const server = new Server(getNetworkUrl(network));
    const transaction = TransactionBuilder.fromXDR(signedXDR, Networks[network]);
    
    const result = await server.submitTransaction(transaction);
    
    return NextResponse.json({
      success: true,
      txHash: result.hash,
      poolAddress: extractPoolAddressFromResult(result),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
```

## Required Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "@stellar/stellar-sdk": "13.1.0",
    "@blend-capital/blend-sdk": "3.0.0-beta.8"
  }
}
```

## Environment Configuration

Create a `.env.local` file:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_RPC_URL=https://rpc-futurenet.stellar.org:443
STELLAR_ADMIN_SECRET=YOUR_ADMIN_SECRET_KEY
```

## Testing Checklist

- [ ] Wallet connection works in browser
- [ ] Network switching updates available assets
- [ ] Form validation prevents invalid configurations
- [ ] Transaction building succeeds with valid config
- [ ] Transaction signing works with Freighter
- [ ] Pool deployment creates working pool
- [ ] Error handling covers edge cases

## Security Considerations

1. **Private Key Management**: Never store private keys in frontend code
2. **Transaction Validation**: Always validate transactions before signing
3. **Network Verification**: Ensure transactions target correct network
4. **Error Handling**: Don't expose sensitive information in error messages

## Production Deployment

1. Replace simulation with real deployment logic
2. Add comprehensive error handling
3. Implement transaction status monitoring
4. Add support for additional wallets (Albedo, xBull, etc.)
5. Set up proper environment variables
6. Add transaction history and pool management features

## Existing Script Integration

The existing deployment scripts in `src/v2/user-scripts/deploy-pool.ts` can be adapted for the frontend by:

1. Extracting core deployment logic into reusable functions
2. Modifying to accept configuration objects instead of hardcoded values
3. Adding transaction building without automatic submission
4. Integrating with the address book and environment configuration

This approach maintains compatibility with existing scripts while enabling the user-friendly frontend interface. 
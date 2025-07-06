# Pool Deployment Frontend Integration

This frontend implementation provides a complete user interface for deploying Blend Protocol lending pools, **restricted to Stellar testnet only**.

## Features Implemented

### ✅ Complete Wizard Interface
- **Step 1: Pool Basics** - Configure pool name, backstop rate, max positions, min collateral
- **Step 2: Asset Selection** - Choose from popular testnet assets (XLM, USDC, BLND, wETH, wBTC) or add custom assets
- **Step 3: Risk Parameters** - Select from preset risk profiles (conservative, balanced, aggressive) or customize
- **Step 4: Emissions** - Configure supply and borrow emissions for each asset
- **Step 5: Deploy** - Review configuration and deploy to testnet

### ✅ Testnet-Only Restriction
- Hardcoded to testnet network only
- Uses testnet contract addresses from `frontend/lib/contracts/testnet.contracts.json`
- All validation enforces testnet restriction

### ✅ Comprehensive Validation
- Form validation at each step
- Real-time feedback for invalid configurations
- Prevents navigation to next step until current step is valid
- Backend validation before deployment

### ✅ Wallet Integration
- Freighter wallet connection
- Secure secret key handling (stored in browser localStorage)
- Keypair validation

### ✅ Deployment Service
- Complete implementation using Blend SDK v2
- Handles pool deployment, reserve setup, and emissions configuration
- Proper transaction building, simulation, and submission
- Error handling and status tracking

### ✅ Error Handling
- Comprehensive error messages
- Network error detection
- Validation error display
- Deployment status tracking

## Files Modified/Created

### Core Implementation
- `frontend/app/create-pool/page.tsx` - Main wizard interface (testnet-only)
- `frontend/app/services/deploymentService.ts` - Complete deployment logic
- `frontend/app/api/deploy-pool/route.ts` - API endpoint for deployments

### Components Used
- `frontend/app/components/create-pool/PoolBasicsForm.tsx`
- `frontend/app/components/create-pool/SelectAssetsForm.tsx`
- `frontend/app/components/create-pool/RiskParametersForm.tsx`
- `frontend/app/components/create-pool/EmissionsForm.tsx`
- `frontend/app/components/create-pool/DeployStep.tsx`
- `frontend/app/components/WalletConnect.tsx`

### Configuration
- `frontend/lib/contracts/testnet.contracts.json` - Testnet contract addresses

## Testing Instructions

### Prerequisites
1. Stellar testnet account with funds
2. Freighter wallet installed
3. Next.js development environment

### Test Steps

1. **Start the development server**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Navigate to pool creation**
   Go to `http://localhost:3000/create-pool`

3. **Connect wallet**
   - Connect Freighter wallet
   - Enter deployment account public and secret keys
   - Verify testnet restriction warning is displayed

4. **Complete the wizard**
   - **Basics**: Enter pool name, adjust settings
   - **Assets**: Select 2-3 assets (e.g., XLM, USDC, BLND)
   - **Risk**: Choose a preset or customize parameters
   - **Emissions**: Set emission rates (optional)
   - **Deploy**: Review and deploy

5. **Verify deployment**
   - Check transaction hashes on Stellar Expert
   - Verify pool address is valid
   - Confirm all reserves are set up

### Expected Behavior

- ✅ Only testnet deployments allowed
- ✅ Form validation prevents invalid configurations
- ✅ Clear error messages for any issues
- ✅ Real-time deployment status updates
- ✅ Transaction hashes and pool address provided on success

## Contract Requirements

The following contracts must be deployed on testnet:
- **PoolFactory V2**: For creating new pools
- **Oracle Mock**: For asset price feeds
- **Asset Contracts**: XLM, USDC, BLND, wETH, wBTC, etc.

Current testnet addresses are configured in `testnet.contracts.json`.

## Limitations

1. **Testnet Only**: Cannot deploy to mainnet or futurenet
2. **Manual Setup**: Requires manual entry of deployment keys
3. **Asset Validation**: Custom assets not automatically validated
4. **Queue Times**: Some reserve operations may require waiting for queue periods

## Security Notes

- Secret keys are stored in browser localStorage (development only)
- All transactions are signed client-side
- Network restricted to testnet only
- No mainnet deployment capabilities

## Troubleshooting

### Common Issues

1. **"Invalid secret key"**: Ensure secret key matches public key
2. **"Transaction failed"**: Check account has sufficient XLM for fees
3. **"Contract not found"**: Verify testnet contracts are deployed
4. **"Reserve not set"**: Some reserves may need queue time to expire

### Support

For issues with deployment, check:
1. Browser console for detailed error messages
2. Network tab for API call responses
3. Stellar Expert for transaction details
4. Testnet contract addresses in configuration

## Architecture

```
User Interface (React)
    ↓
Deployment Service (TypeScript)
    ↓
Blend SDK V2
    ↓
Stellar Soroban RPC
    ↓
Testnet Blockchain
```

The implementation follows the same patterns as the backend deployment scripts but provides a user-friendly web interface for non-technical users. 
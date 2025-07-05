import { 
  PoolContractV2, 
  PoolFactoryContractV2,
  ReserveConfigV2, 
  ReserveEmissionMetadata, 
  DeployV2Args,
  SetReserveArgs,
  I128MAX 
} from '@blend-capital/blend-sdk';
import { 
  Keypair, 
  rpc, 
  Transaction,
  TransactionBuilder,
  xdr,
  Operation
} from '@stellar/stellar-sdk';
import testnetContracts from '@/lib/contracts/testnet.contracts.json';
import mainnetContracts from '@/lib/contracts/mainnet.contracts.json';
import futurenetContracts from '@/lib/contracts/futurenet.contracts.json';

// Types from the frontend
interface PoolFormData {
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
}

interface NetworkConfig {
  rpcUrl: string;
  passphrase: string;
  friendbotUrl?: string;
}

// Network configurations
const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
  testnet: {
    rpcUrl: 'https://soroban-testnet.stellar.org',
    passphrase: 'Test SDF Network ; September 2015',
    friendbotUrl: 'https://friendbot.stellar.org'
  },
  mainnet: {
    rpcUrl: 'https://mainnet.stellar.validationcloud.io/v1/6bb8d0fff54e4a5c8ce4b6ad87e5f4b7',
    passphrase: 'Public Global Stellar Network ; September 2015'
  },
  futurenet: {
    rpcUrl: 'https://rpc-futurenet.stellar.org',
    passphrase: 'Test SDF Future Network ; October 2022',
    friendbotUrl: 'https://friendbot-futurenet.stellar.org'
  },
  local: {
    rpcUrl: 'http://localhost:8000/soroban/rpc',
    passphrase: 'Standalone Network ; February 2017',
    friendbotUrl: 'http://localhost:8000/friendbot'
  }
};

// Risk parameter presets
const RISK_PRESETS = {
  conservative: {
    c_factor: 900_0000,    // 90%
    l_factor: 900_0000,    // 90%
    util: 800_0000,        // 80%
    max_util: 900_0000,    // 90%
    r_base: 20000,         // 0.2%
    r_one: 300000,         // 3%
    r_two: 800000,         // 8%
    r_three: 1_0000000,    // 100%
    reactivity: 500
  },
  balanced: {
    c_factor: 950_0000,    // 95%
    l_factor: 950_0000,    // 95%
    util: 850_0000,        // 85%
    max_util: 950_0000,    // 95%
    r_base: 30000,         // 0.3%
    r_one: 400000,         // 4%
    r_two: 900000,         // 9%
    r_three: 1_0000000,    // 100%
    reactivity: 750
  },
  aggressive: {
    c_factor: 980_0000,    // 98%
    l_factor: 980_0000,    // 98%
    util: 900_0000,        // 90%
    max_util: 980_0000,    // 98%
    r_base: 50000,         // 0.5%
    r_one: 500000,         // 5%
    r_two: 1000000,        // 10%
    r_three: 1_0000000,    // 100%
    reactivity: 1000
  }
};

// Contract addresses for different networks
const CONTRACT_ADDRESSES: Record<string, Record<string, string>> = {
  testnet: {
    poolFactory: testnetContracts.ids.poolFactoryV2,
    oracle: testnetContracts.ids.oraclemock
  },
  mainnet: {
    poolFactory: mainnetContracts.ids.poolFactoryV2,
    oracle: testnetContracts.ids.oraclemock // Fallback to testnet oracle mock
  },
  futurenet: {
    poolFactory: futurenetContracts.ids.poolFactory,
    oracle: futurenetContracts.ids.oracle
  }
};

export class DeploymentService {
  private networkConfig: NetworkConfig;
  private rpcClient: rpc.Server;
  private network: string;

  constructor(network: string) {
    this.network = network;
    this.networkConfig = NETWORK_CONFIGS[network];
    if (!this.networkConfig) {
      throw new Error(`Unsupported network: ${network}`);
    }
    this.rpcClient = new rpc.Server(this.networkConfig.rpcUrl, { allowHttp: true });
  }

  /**
   * Generate random salt for pool deployment
   */
  private generateSalt(): Buffer {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Buffer.from(array);
  }

  /**
   * Transform web form data into deployment parameters
   */
  private transformFormData(formData: PoolFormData): {
    deployArgs: DeployV2Args;
    reserveConfigs: ReserveConfigV2[];
    emissionMetadata: ReserveEmissionMetadata[];
  } {
    const contractAddresses = CONTRACT_ADDRESSES[this.network];
    if (!contractAddresses) {
      throw new Error(`Contract addresses not configured for network: ${this.network}`);
    }

    // Transform pool deployment arguments
    const deployArgs: DeployV2Args = {
      admin: '', // Will be set by the calling function with actual admin public key
      name: formData.name,
      salt: this.generateSalt(),
      oracle: contractAddresses.oracle,
      backstop_take_rate: Math.round(formData.backstopTakeRate * 1e7),
      max_positions: formData.maxPositions,
      min_collateral: BigInt(formData.minCollateral)
    };

    // Transform reserve configurations
    const reserveConfigs: ReserveConfigV2[] = formData.selectedAssets.map((asset, index) => {
      const riskParams = formData.riskParameters.preset === 'custom' && formData.riskParameters.customParams
        ? {
            c_factor: Math.round(formData.riskParameters.customParams.collateralFactor * 1e7),
            l_factor: Math.round(formData.riskParameters.customParams.liquidationFactor * 1e7),
            util: Math.round(formData.riskParameters.customParams.util * 1e7),
            max_util: Math.round(formData.riskParameters.customParams.maxUtil * 1e7),
            r_base: Math.round(formData.riskParameters.customParams.rBase * 1e5),
            r_one: Math.round(formData.riskParameters.customParams.rOne * 1e5),
            r_two: Math.round(formData.riskParameters.customParams.rTwo * 1e5),
            r_three: Math.round(formData.riskParameters.customParams.rThree * 1e7),
            reactivity: formData.riskParameters.customParams.reactivity
          }
        : RISK_PRESETS[formData.riskParameters.preset as keyof typeof RISK_PRESETS];

      return {
        index: index,
        decimals: asset.decimals,
        ...riskParams,
        supply_cap: I128MAX,
        enabled: true
      };
    });

    // Transform emission metadata
    const emissionMetadata: ReserveEmissionMetadata[] = [];
    formData.emissions.forEach((emission, index) => {
      if (emission.supplyEmission > 0) {
        emissionMetadata.push({
          res_index: index,
          res_type: 1, // Supply emissions
          share: BigInt(Math.round(emission.supplyEmission * 1e7))
        });
      }
      if (emission.borrowEmission > 0) {
        emissionMetadata.push({
          res_index: index,
          res_type: 0, // Borrow emissions
          share: BigInt(Math.round(emission.borrowEmission * 1e7))
        });
      }
    });

    return {
      deployArgs,
      reserveConfigs,
      emissionMetadata
    };
  }

  /**
   * Submit and wait for transaction
   */
  private async submitTransaction(transaction: Transaction): Promise<string> {
    try {
      const result = await this.rpcClient.sendTransaction(transaction);
      
      if (result.status === 'PENDING') {
        // Wait for transaction to be included in a ledger
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds timeout
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          try {
            const txResult = await this.rpcClient.getTransaction(result.hash);
            if (txResult.status === 'SUCCESS') {
              return result.hash;
            } else if (txResult.status === 'FAILED') {
              throw new Error(`Transaction failed: ${JSON.stringify(txResult)}`);
            }
          } catch (error) {
            // Transaction might not be available yet, continue waiting
          }
          
          attempts++;
        }
        
        throw new Error('Transaction timeout: transaction was not confirmed within 30 seconds');
      } else if (result.status === 'ERROR') {
        throw new Error(`Transaction error: ${JSON.stringify(result)}`);
      }
      
      return result.hash;
    } catch (error) {
      console.error('Transaction submission error:', error);
      throw error;
    }
  }

  /**
   * Deploy a pool using the provided form data and user keypair
   */
  async deployPool(formData: PoolFormData, userKeypair: Keypair): Promise<{
    poolAddress: string;
    transactionHashes: string[];
  }> {
    try {
      const contractAddresses = CONTRACT_ADDRESSES[this.network];
      if (!contractAddresses) {
        throw new Error(`Contract addresses not configured for network: ${this.network}`);
      }

      // Get user account
      const userAccount = await this.rpcClient.getAccount(userKeypair.publicKey());
      const transactionHashes: string[] = [];

      // Transform form data
      const { deployArgs, reserveConfigs, emissionMetadata } = this.transformFormData(formData);
      deployArgs.admin = userKeypair.publicKey();

      console.log('Deploying pool:', deployArgs.name);

      // Step 1: Deploy the pool
      const poolFactory = new PoolFactoryContractV2(contractAddresses.poolFactory);
      const deployPoolOp = poolFactory.deployPool(deployArgs);

      // Build and submit pool deployment transaction
      const deployTxBuilder = new TransactionBuilder(userAccount, {
        fee: '10000',
        networkPassphrase: this.networkConfig.passphrase,
      });
      
      deployTxBuilder.addOperation(xdr.Operation.fromXDR(deployPoolOp, 'base64'));
      deployTxBuilder.setTimeout(30);
      
      const deployTx = deployTxBuilder.build();
      deployTx.sign(userKeypair);

      // Simulate first to get the pool address
      const simResult = await this.rpcClient.simulateTransaction(deployTx);
      if (rpc.Api.isSimulationError(simResult)) {
        throw new Error(`Pool deployment simulation failed: ${simResult.error}`);
      }

      // Get pool address from simulation result
      const poolAddress = PoolFactoryContractV2.parsers.deployPool(simResult.result!.retval.toXDR('base64'));
      if (!poolAddress) {
        throw new Error('Failed to get pool address from simulation');
      }

      // Submit the actual transaction
      const assembledDeployTx = rpc.assembleTransaction(deployTx, simResult).build();
      assembledDeployTx.sign(userKeypair);
      
      const deployTxHash = await this.submitTransaction(assembledDeployTx);
      transactionHashes.push(deployTxHash);

      console.log('Pool deployed successfully. Setting up reserves...');

      // Step 2: Set up each reserve
      const pool = new PoolContractV2(poolAddress);
      
      for (let i = 0; i < formData.selectedAssets.length; i++) {
        const asset = formData.selectedAssets[i];
        const reserveConfig = reserveConfigs[i];

        console.log(`Setting up reserve for ${asset.symbol} with address: ${asset.address}`);

        const setReserveArgs: SetReserveArgs = {
          asset: asset.address,
          metadata: reserveConfig
        };

        // Queue reserve
        const queueReserveOp = pool.queueSetReserve(setReserveArgs);
        
        const queueTxBuilder = new TransactionBuilder(userAccount, {
          fee: '10000',
          networkPassphrase: this.networkConfig.passphrase,
        });
        
                 queueTxBuilder.addOperation(xdr.Operation.fromXDR(queueReserveOp, 'base64'));
        queueTxBuilder.setTimeout(30);
        
        const queueTx = queueTxBuilder.build();
        queueTx.sign(userKeypair);

        const queueSimResult = await this.rpcClient.simulateTransaction(queueTx);
        if (rpc.Api.isSimulationError(queueSimResult)) {
          throw new Error(`Reserve queue simulation failed for ${asset.symbol}: ${queueSimResult.error}`);
        }

        const assembledQueueTx = rpc.assembleTransaction(queueTx, queueSimResult).build();
        assembledQueueTx.sign(userKeypair);
        
        const queueTxHash = await this.submitTransaction(assembledQueueTx);
        transactionHashes.push(queueTxHash);

        // Set reserve
        try {
          const setReserveOp = pool.setReserve(asset.address);
          
          const setTxBuilder = new TransactionBuilder(userAccount, {
            fee: '10000',
            networkPassphrase: this.networkConfig.passphrase,
          });
          
                     setTxBuilder.addOperation(xdr.Operation.fromXDR(setReserveOp, 'base64'));
          setTxBuilder.setTimeout(30);
          
          const setTx = setTxBuilder.build();
          setTx.sign(userKeypair);

          const setSimResult = await this.rpcClient.simulateTransaction(setTx);
          if (rpc.Api.isSimulationError(setSimResult)) {
            console.warn(`Reserve set simulation failed for ${asset.symbol}, may need to wait: ${setSimResult.error}`);
            continue;
          }

          const assembledSetTx = rpc.assembleTransaction(setTx, setSimResult).build();
          assembledSetTx.sign(userKeypair);
          
          const setTxHash = await this.submitTransaction(assembledSetTx);
          transactionHashes.push(setTxHash);
          
          console.log(`Successfully set ${asset.symbol} reserve`);
        } catch (error) {
          console.warn(`Could not set reserve for ${asset.symbol} immediately, may need to wait for queue time: ${error}`);
        }
      }

      // Step 3: Set emissions if any are configured
      if (emissionMetadata.length > 0) {
        console.log('Setting up emissions...');
        
        const emissionsOp = pool.setEmissionsConfig(emissionMetadata);
        
        const emissionsTxBuilder = new TransactionBuilder(userAccount, {
          fee: '10000',
          networkPassphrase: this.networkConfig.passphrase,
        });
        
                 emissionsTxBuilder.addOperation(xdr.Operation.fromXDR(emissionsOp, 'base64'));
        emissionsTxBuilder.setTimeout(30);
        
        const emissionsTx = emissionsTxBuilder.build();
        emissionsTx.sign(userKeypair);

        const emissionsSimResult = await this.rpcClient.simulateTransaction(emissionsTx);
        if (rpc.Api.isSimulationError(emissionsSimResult)) {
          throw new Error(`Emissions simulation failed: ${emissionsSimResult.error}`);
        }

        const assembledEmissionsTx = rpc.assembleTransaction(emissionsTx, emissionsSimResult).build();
        assembledEmissionsTx.sign(userKeypair);
        
        const emissionsTxHash = await this.submitTransaction(assembledEmissionsTx);
        transactionHashes.push(emissionsTxHash);
      }

      console.log('Pool deployment completed successfully!');

      return {
        poolAddress,
        transactionHashes
      };

    } catch (error) {
      console.error('Pool deployment failed:', error);
      throw new Error(`Pool deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate deployment configuration before actual deployment
   */
  async validateConfiguration(formData: PoolFormData): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate pool name
    if (!formData.name || formData.name.length < 2) {
      errors.push('Pool name must be at least 2 characters long');
    }

    // Validate assets
    if (formData.selectedAssets.length === 0) {
      errors.push('At least one asset must be selected');
    }

    if (formData.selectedAssets.length > formData.maxPositions) {
      errors.push(`Number of assets (${formData.selectedAssets.length}) cannot exceed max positions (${formData.maxPositions})`);
    }

    // Validate backstop take rate
    if (formData.backstopTakeRate < 0 || formData.backstopTakeRate > 1) {
      errors.push('Backstop take rate must be between 0 and 1');
    }

    // Validate risk parameters
    if (formData.riskParameters.preset === 'custom' && formData.riskParameters.customParams) {
      const params = formData.riskParameters.customParams;
      
      if (params.util >= params.maxUtil) {
        errors.push('Utilization threshold must be less than max utilization');
      }

      if (params.collateralFactor > 1 || params.liquidationFactor > 1) {
        errors.push('Collateral and liquidation factors must be ≤ 1');
      }

      if (params.reactivity > 1000) {
        errors.push('Reactivity must be ≤ 1000');
      }
    }

    // Validate emissions
    const totalSupplyEmissions = formData.emissions.reduce((sum, e) => sum + e.supplyEmission, 0);
    const totalBorrowEmissions = formData.emissions.reduce((sum, e) => sum + e.borrowEmission, 0);

    if (totalSupplyEmissions > 1) {
      warnings.push('Total supply emissions exceed 100%');
    }

    if (totalBorrowEmissions > 1) {
      warnings.push('Total borrow emissions exceed 100%');
    }

    // Check if contract addresses exist for the network
    const contractAddresses = CONTRACT_ADDRESSES[this.network];
    if (!contractAddresses) {
      errors.push(`Contract addresses not configured for network: ${this.network}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
} 
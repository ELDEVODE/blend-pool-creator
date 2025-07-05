export type Network = 'mainnet' | 'testnet' | 'futurenet' | 'local';

export interface PoolBasics {
  name: string;
  network: Network;
  backstopTakeRate: number;
  maxPositions: number;
  minCollateral: string;
}

export interface AssetInfo {
  symbol: string;
  contractId: string;
  decimals: number;
  enabled: boolean;
}

export interface ReserveConfig {
  index: number;
  decimals: number;
  c_factor: number;
  l_factor: number;
  util: number;
  max_util: number;
  r_base: number;
  r_one: number;
  r_two: number;
  r_three: number;
  reactivity: number;
  supply_cap: string;
  enabled: boolean;
}

export interface EmissionConfig {
  reserve_index: number;
  res_type: 0 | 1; // 0 for borrowers, 1 for suppliers
  share: number;
}

export interface PoolConfiguration {
  basics: PoolBasics;
  selectedAssets: AssetInfo[];
  reserveConfigs: ReserveConfig[];
  emissions: EmissionConfig[];
}

export interface DeploymentStatus {
  status: 'idle' | 'validating' | 'deploying' | 'success' | 'error';
  message?: string;
  txHash?: string;
  poolAddress?: string;
}

export interface WalletInfo {
  publicKey: string;
  isConnected: boolean;
  walletType: string;
}

export type WizardStep = 'basics' | 'assets' | 'risk' | 'emissions' | 'deploy';

export interface RiskPreset {
  name: string;
  description: string;
  c_factor: number;
  l_factor: number;
  util: number;
  max_util: number;
  r_base: number;
  r_one: number;
  r_two: number;
  r_three: number;
  reactivity: number;
} 
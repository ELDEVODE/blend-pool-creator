import { NextRequest, NextResponse } from 'next/server';
import { DeploymentService } from '../../services/deploymentService';

interface PoolConfiguration {
  basics: {
    name: string;
    network: string;
    backstopTakeRate: number;
    maxPositions: number;
    minCollateral: string;
  };
  selectedAssets: Array<{
    symbol: string;
    contractId: string;
    decimals: number;
    enabled: boolean;
  }>;
  reserveConfigs: Array<{
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
  }>;
  emissions: Array<{
    reserve_index: number;
    res_type: 0 | 1;
    share: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Validate required fields
    if (!formData.name || !formData.network) {
      return NextResponse.json({
        valid: false,
        errors: ['Pool name and network are required'],
        warnings: []
      });
    }

    // Create deployment service and validate configuration
    const deploymentService = new DeploymentService(formData.network);
    const validation = await deploymentService.validateConfiguration(formData);

    return NextResponse.json(validation);

  } catch (error) {
    console.error('Configuration validation error:', error);
    
    return NextResponse.json({
      valid: false,
      errors: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    });
  }
} 
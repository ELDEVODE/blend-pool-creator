import { NextRequest, NextResponse } from 'next/server';
import { Keypair } from '@stellar/stellar-sdk';
import { DeploymentService } from '../../services/deploymentService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Restrict to testnet only
    if (formData.network !== 'testnet') {
      return NextResponse.json(
        { error: 'Only testnet deployments are supported' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!formData.name || !formData.selectedAssets || formData.selectedAssets.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: name and selectedAssets are required' },
        { status: 400 }
      );
    }

    // Get the user's secret key from the request body
    const userSecretKey = formData.userSecretKey;
    if (!userSecretKey) {
      return NextResponse.json(
        { error: 'User secret key required for deployment' },
        { status: 400 }
      );
    }

    // Create keypair from secret key
    let userKeypair: Keypair;
    try {
      userKeypair = Keypair.fromSecret(userSecretKey);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid secret key format' },
        { status: 400 }
      );
    }

    console.log('Starting pool deployment for:', formData.name);

    // Create deployment service (restricted to testnet)
    const deploymentService = new DeploymentService('testnet');
    
    // Validate configuration first
    const validation = await deploymentService.validateConfiguration(formData);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Configuration validation failed',
          errors: validation.errors,
          warnings: validation.warnings
        },
        { status: 400 }
      );
    }

    // Deploy the pool
    const result = await deploymentService.deployPool(formData, userKeypair);

    console.log('Pool deployment completed:', result);

    return NextResponse.json({
      success: true,
      poolAddress: result.poolAddress,
      transactionHashes: result.transactionHashes,
      network: 'testnet',
      warnings: validation.warnings
    });

  } catch (error) {
    console.error('Pool deployment error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown deployment error';
    
    return NextResponse.json(
      { 
        error: 'Pool deployment failed',
        details: errorMessage
      },
      { status: 500 }
    );
  }
} 
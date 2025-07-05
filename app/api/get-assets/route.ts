import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network') || 'testnet';

    // Validate network
    const validNetworks = ['mainnet', 'testnet', 'futurenet', 'local'];
    if (!validNetworks.includes(network)) {
      return NextResponse.json(
        { error: 'Invalid network' },
        { status: 400 }
      );
    }

    // Read the contract file for the network
    const contractFilePath = path.join(process.cwd(), '..', `${network}.contracts.json`);
    const contractFile = await readFile(contractFilePath, 'utf-8');
    const contractData = JSON.parse(contractFile);

    // Extract available assets with metadata
    const assetList = [];
    const assetDecimals: Record<string, number> = {
      'XLM': 7,
      'USDC': 7,
      'BLND': 7,
      'wETH': 8,
      'wBTC': 8,
      'Fixed': 7,
      'YieldBlox': 7,
    };

    for (const [symbol, contractId] of Object.entries(contractData.ids)) {
      // Skip non-asset contracts
      if (['cometFactory', 'comet', 'oraclemock', 'emitter', 'poolFactory', 'poolFactoryV2', 'backstop', 'backstopV2', 'bootstrapper'].includes(symbol)) {
        continue;
      }

      // Skip pool names (usually contain 'V2' suffix or are longer descriptive names)
      if (symbol.includes('V2') && !symbol.startsWith('w')) {
        continue;
      }

      assetList.push({
        symbol,
        contractId: contractId as string,
        decimals: assetDecimals[symbol] || 7,
        enabled: false,
      });
    }

    return NextResponse.json({
      network,
      assets: assetList,
    });

  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets for network' },
      { status: 500 }
    );
  }
} 
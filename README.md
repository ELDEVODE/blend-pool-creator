# Blend Pool Creator

![Blend Pool Creator](./public/logo.png)

A modern, enterprise-grade web interface for creating and deploying custom lending pools on the Stellar blockchain using the Blend Protocol. This tool provides a user-friendly wizard-style interface that simplifies the complex process of pool deployment while maintaining professional-grade security and functionality.

## 🚀 Features

### 🎯 **Intuitive Pool Creation Wizard**
- **5-Step Guided Process**: Pool Basics → Asset Selection → Risk Parameters → Emissions → Deploy
- **Real-time Validation**: Instant feedback on configuration errors
- **Progress Tracking**: Visual progress indicator with completion status
- **Step Navigation**: Click to jump between completed steps

### 🛡️ **Enterprise Security**
- **Testnet-Only Deployment**: Safety-first approach for testing and development
- **Wallet Integration**: Secure Stellar wallet connection with secret key management
- **Input Validation**: Comprehensive validation at every step
- **Error Handling**: Detailed error messages and recovery suggestions

### 💎 **Professional UI/UX**
- **Modern Dark Theme**: Sleek interface with green accent colors
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Animated Components**: Smooth transitions and visual feedback
- **Dashboard Layout**: Compact, information-dense interface

### ⚙️ **Advanced Configuration**
- **Asset Selection**: Choose from popular Stellar assets or add custom tokens
- **Risk Management**: Predefined risk presets (Conservative, Balanced, Aggressive) or custom parameters
- **Emissions Setup**: Configure lending and borrowing reward distributions
- **Pool Optimization**: Fine-tune backstop rates, collateral factors, and interest rate curves

## 🏗️ Tech Stack

### **Frontend**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom components
- **Lucide React**: Modern icon library

### **Blockchain Integration**
- **Stellar SDK**: Official Stellar JavaScript SDK
- **Blend SDK**: Blend Protocol integration library
- **Soroban**: Smart contract platform on Stellar

### **Development Tools**
- **ESLint**: Code linting and quality
- **PostCSS**: CSS processing
- **Bun**: Fast package manager and runtime

## 📦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Stellar testnet account with XLM for gas fees
- Basic understanding of Stellar blockchain and lending protocols

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/blend-utils.git
   cd blend-utils/frontend
   ```

2. **Install dependencies**
   ```bash
   # Using bun (recommended)
   bun install
   
   # Or using npm
   npm install
   ```

3. **Start the development server**
   ```bash
   # Using bun
   bun dev
   
   # Or using npm
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

### Step 1: Connect Your Wallet
1. Click "Connect Wallet" in the sidebar
2. Enter your Stellar testnet public key (starts with 'G')
3. Provide your secret key (starts with 'S') for deployment
4. Verify connection status shows "READY"

### Step 2: Configure Pool Basics
1. Enter a unique pool name
2. Set maximum positions (1-10 assets)
3. Configure backstop take rate (0-100%)
4. Set minimum collateral requirements

### Step 3: Select Assets
1. Choose from popular testnet assets (XLM, USDC, BLND, etc.)
2. Add custom assets with contract addresses
3. Verify asset selection doesn't exceed max positions

### Step 4: Configure Risk Parameters
1. **Conservative**: Lower risk, stable returns
2. **Balanced**: Moderate risk/reward balance  
3. **Aggressive**: Higher risk, potential higher returns
4. **Custom**: Fine-tune all parameters manually

### Step 5: Set Up Emissions (Optional)
1. Configure supply emissions for lenders
2. Set borrow emissions for borrowers
3. Allocate reward distribution percentages

### Step 6: Deploy
1. Review complete configuration summary
2. Click "Deploy Pool" to submit to Stellar testnet
3. Monitor transaction progress and completion
4. Receive pool address and transaction hashes

## 🔧 Configuration Options

### Risk Parameters
- **Collateral Factor**: Percentage of asset value that can be borrowed against
- **Liquidation Factor**: Threshold for liquidation events
- **Utilization Rates**: Target and maximum utilization percentages
- **Interest Rate Curves**: Base rates and scaling factors
- **Reactivity**: How quickly rates adjust to utilization changes

### Supported Assets
- **XLM**: Native Stellar Lumens
- **USDC**: USD Coin stablecoin
- **BLND**: Native Blend Protocol token
- **wETH**: Wrapped Ethereum
- **wBTC**: Wrapped Bitcoin
- **Custom Assets**: Any Stellar/Soroban compatible token

## 🛠️ Development

### Project Structure
```
frontend/
├── app/
│   ├── components/          # Reusable UI components
│   ├── create-pool/         # Pool creation wizard
│   ├── services/           # Blockchain integration
│   ├── api/                # API routes
│   └── hooks/              # Custom React hooks
├── lib/
│   └── contracts/          # Contract addresses and ABIs
└── public/                 # Static assets
```

### Available Scripts
```bash
# Development
bun dev                     # Start dev server
bun build                   # Build for production
bun start                   # Start production server

# Code Quality
bun lint                    # Run ESLint
bun type-check             # TypeScript type checking
```

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
```

## 🚨 Important Notes

### Testnet Only
This application is configured for **Stellar testnet only** for safety. It will not work with mainnet keys or contracts.

### Security Considerations
- Never use mainnet secret keys in this application
- Secret keys are processed locally and never stored
- Always verify you're on testnet before deployment
- Double-check all parameters before final deployment

### Rate Limits
- Stellar testnet has rate limits
- Large deployments may need retry logic
- Monitor transaction status for failures

## 📋 API Reference

### Deploy Pool Endpoint
```typescript
POST /api/deploy-pool
Content-Type: application/json

{
  "name": "My Test Pool",
  "selectedAssets": [
    {
      "id": "XLM",
      "symbol": "XLM", 
      "address": "native",
      "decimals": 7
    }
  ],
  "riskParameters": {
    "preset": "balanced"
  },
  "emissions": [],
  "userSecretKey": "S..."
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🔗 Links

- **Blend Protocol**: [https://blend.capital](https://blend.capital)
- **Stellar**: [https://stellar.org](https://stellar.org)
- **Soroban**: [https://soroban.stellar.org](https://soroban.stellar.org)
- **Documentation**: [Blend Protocol Docs](https://docs.blend.capital)

## ⚠️ Disclaimer

This software is provided for educational and development purposes. Use at your own risk. Always verify transactions and thoroughly test on testnet before any mainnet deployment. The developers are not responsible for any loss of funds or assets.

---

Built with ❤️ for the Stellar ecosystem

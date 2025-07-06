import Link from "next/link";
import { Terminal, Zap, Shield, Globe, Rocket, CheckCircle, TrendingUp, Target, Settings, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Matrix-like background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2322c55e' fill-opacity='0.1'%3E%3Ctext x='10' y='20' font-family='monospace' font-size='12'%3E0%3C/text%3E%3Ctext x='40' y='50' font-family='monospace' font-size='12'%3E1%3C/text%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Enhanced Terminal Header */}
        <div className="text-center mb-20">
          {/* System status badge */}
          <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full text-green-400 text-sm font-mono font-bold mb-8 backdrop-blur-sm animate-pulse">
            <Terminal className="w-5 h-5" />
            <span>BLEND_PROTOCOL_V2.0</span>
            <CheckCircle className="w-5 h-5" />
          </div>

          {/* Terminal prompt */}
          <div className="mb-8">
            <div className="font-mono text-lg text-green-400 mb-4 opacity-80">
              <span className="animate-pulse">$</span> blend_protocol --init --mode=production
            </div>
            <div className="inline-block border border-green-500/30 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-xl shadow-green-500/20">
              <span className="text-green-400 font-mono text-sm font-bold">
                <span className="animate-pulse">●</span> SYSTEM ONLINE - READY FOR DEPLOYMENT
              </span>
            </div>
          </div>
          
          {/* Main title with enhanced styling */}
          <h1 className="text-5xl md:text-8xl font-bold mb-8 font-mono leading-tight">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              BLEND POOL
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              CREATOR
            </span>
          </h1>
          
          {/* Glowing separator */}
          <div className="relative mb-8">
            <div className="h-1 w-48 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 mx-auto rounded-full shadow-xl shadow-green-400/50"></div>
            <div className="absolute inset-0 h-1 w-48 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 mx-auto rounded-full blur-md opacity-70"></div>
          </div>
          
          {/* Enhanced description */}
          <div className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto font-mono leading-relaxed">
            <div className="mb-4">
              <span className="text-green-400">$</span> Deploy custom lending pools on the Blend Protocol
            </div>
            <div className="mb-4">
              <span className="text-green-400">$</span> Enterprise-grade terminal interface for DeFi professionals
            </div>
            <div className="mb-4">
              <span className="text-green-400">$</span> Zero coding required - just intelligent configuration
            </div>
          </div>

          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/create-pool"
              className="group relative overflow-hidden bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-green-400 text-black px-10 py-5 rounded-xl text-lg font-mono font-bold hover:from-green-500 hover:to-emerald-600 transition-all duration-300 shadow-xl shadow-green-400/30 hover:shadow-2xl hover:shadow-green-400/50 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-3">
                <Rocket className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span>INITIALIZE POOL</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>
            
            <a
              href="https://docs.blend.capital"
              target="_blank"
              rel="noopener noreferrer"
              className="group border-2 border-green-500/50 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm text-green-300 px-10 py-5 rounded-xl text-lg font-mono font-bold hover:border-green-400 hover:bg-gradient-to-r hover:from-green-900/20 hover:to-emerald-900/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/20 transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <Terminal className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span>DOCUMENTATION</span>
                <ExternalLink className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </a>
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 shadow-xl shadow-green-500/10 hover:border-green-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-400/20 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-green-400/30 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-4 font-mono uppercase tracking-wide">
                EASY SETUP
              </h3>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
                Guided wizard walks you through each step of pool configuration with intelligent defaults, 
                helpful explanations, and real-time validation to ensure optimal setup.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 shadow-xl shadow-green-500/10 hover:border-green-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-400/20 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-green-400/30 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-4 font-mono uppercase tracking-wide">
                RISK MANAGEMENT
              </h3>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
                Choose from battle-tested risk profiles or customize advanced parameters with 
                real-time validation, comprehensive tooltips, and industry best practices.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 shadow-xl shadow-green-500/10 hover:border-green-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-400/20 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-green-400/30 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-4 font-mono uppercase tracking-wide">
                MULTI-NETWORK
              </h3>
              <p className="text-gray-300 font-mono text-sm leading-relaxed">
                Deploy across Stellar networks with confidence. Test your configuration 
                safely on testnet before deploying to mainnet with enterprise-grade security.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Deployment Process */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-green-500/30 rounded-3xl p-10 shadow-2xl shadow-green-500/10 mb-20">
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <Terminal className="w-8 h-8 text-green-400 mr-4" />
              <h2 className="text-4xl font-bold text-green-400 font-mono uppercase tracking-wide">
                DEPLOYMENT PROCESS
              </h2>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full shadow-lg shadow-green-400/50"></div>
          </div>
          
          {/* Step-by-step process */}
          <div className="space-y-12">
            {/* Steps 1-3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 text-black rounded-xl flex items-center justify-center mx-auto mb-6 font-mono text-xl font-bold shadow-lg shadow-green-400/30 group-hover:scale-110 transition-transform duration-300">
                  01
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm group-hover:border-green-400/40 transition-all duration-300">
                  <Settings className="w-6 h-6 text-green-400 mx-auto mb-3" />
                  <h4 className="font-mono font-bold text-green-400 mb-3 uppercase text-lg">POOL BASICS</h4>
                  <p className="text-sm text-gray-300 font-mono leading-relaxed">
                    Configure pool name, network selection, and fundamental parameters including backstop rates and position limits.
                  </p>
                </div>
              </div>
              
              <div className="group text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 border-2 border-green-400 text-green-400 rounded-xl flex items-center justify-center mx-auto mb-6 font-mono text-xl font-bold shadow-lg shadow-green-400/20 group-hover:scale-110 transition-transform duration-300">
                  02
                </div>
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm group-hover:border-green-400/40 transition-all duration-300">
                  <Target className="w-6 h-6 text-green-400 mx-auto mb-3" />
                  <h4 className="font-mono font-bold text-green-400 mb-3 uppercase text-lg">SELECT ASSETS</h4>
                  <p className="text-sm text-gray-300 font-mono leading-relaxed">
                    Choose which tokens to include in your pool from popular assets or add custom tokens with validation.
                  </p>
                </div>
              </div>
              
              <div className="group text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 border-2 border-green-400 text-green-400 rounded-xl flex items-center justify-center mx-auto mb-6 font-mono text-xl font-bold shadow-lg shadow-green-400/20 group-hover:scale-110 transition-transform duration-300">
                  03
                </div>
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm group-hover:border-green-400/40 transition-all duration-300">
                  <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-3" />
                  <h4 className="font-mono font-bold text-green-400 mb-3 uppercase text-lg">RISK PARAMETERS</h4>
                  <p className="text-sm text-gray-300 font-mono leading-relaxed">
                    Configure lending parameters, interest rates, and risk management settings with preset templates.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Steps 4-5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="group text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 border-2 border-green-400 text-green-400 rounded-xl flex items-center justify-center mx-auto mb-6 font-mono text-xl font-bold shadow-lg shadow-green-400/20 group-hover:scale-110 transition-transform duration-300">
                  04
                </div>
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm group-hover:border-green-400/40 transition-all duration-300">
                  <Zap className="w-6 h-6 text-green-400 mx-auto mb-3" />
                  <h4 className="font-mono font-bold text-green-400 mb-3 uppercase text-lg">EMISSIONS</h4>
                  <p className="text-sm text-gray-300 font-mono leading-relaxed">
                    Set up reward distribution mechanisms for both lenders and borrowers with flexible emission schedules.
                  </p>
                </div>
              </div>
              
              <div className="group text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 border-2 border-green-400 text-green-400 rounded-xl flex items-center justify-center mx-auto mb-6 font-mono text-xl font-bold shadow-lg shadow-green-400/20 group-hover:scale-110 transition-transform duration-300">
                  05
                </div>
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm group-hover:border-green-400/40 transition-all duration-300">
                  <Rocket className="w-6 h-6 text-green-400 mx-auto mb-3" />
                  <h4 className="font-mono font-bold text-green-400 mb-3 uppercase text-lg">DEPLOY</h4>
                  <p className="text-sm text-gray-300 font-mono leading-relaxed">
                    Review your configuration and deploy your pool with comprehensive transaction tracking and status updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Security Notice */}
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-2xl p-8 backdrop-blur-sm mb-20">
          <div className="flex items-start space-x-4">
            <Shield className="w-8 h-8 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-yellow-300 font-mono mb-4 uppercase">SECURITY NOTICE</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-yellow-200 font-mono leading-relaxed">
                <div>
                  <h4 className="font-bold text-yellow-300 mb-2">🔒 TESTNET FIRST</h4>
                  <p>This deployment wizard is currently configured for testnet only. Always test your pool configuration thoroughly before considering mainnet deployment.</p>
                </div>
                <div>
                  <h4 className="font-bold text-yellow-300 mb-2">🔐 SECURE PRACTICE</h4>
                  <p>Never use mainnet credentials in testnet environments. Your keys are processed locally and never stored on our servers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Terminal Footer */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 shadow-xl shadow-green-500/10">
            <div className="font-mono text-sm text-green-400 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span>blend_protocol --version 2.0.1-testnet</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Status: <span className="text-green-300 font-bold">READY FOR DEPLOYMENT</span></span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Build: stellar-soroban-enterprise</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

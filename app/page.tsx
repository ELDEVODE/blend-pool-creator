import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Terminal Header */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="font-mono text-sm text-green-500 mb-2">
              &gt; blend_protocol --init
            </div>
            <div className="inline-block border border-green-500/30 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-md terminal-border">
              <span className="text-green-400 font-mono text-xs">SYSTEM ONLINE</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-green-400 mb-6 font-mono terminal-cursor">
            BLEND POOL CREATOR
          </h1>
          <div className="h-1 w-32 bg-green-500 mx-auto mb-6 terminal-glow"></div>
          
          <p className="text-xl md:text-2xl text-green-300/80 mb-8 max-w-3xl mx-auto font-mono">
            &gt; Deploy custom lending pools on the Blend Protocol<br/>
            &gt; Terminal-based interface for advanced users<br/>
            &gt; No coding required - just configuration
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/create-pool"
              className="group bg-black border-2 border-green-500 text-green-400 px-8 py-4 rounded-lg text-lg font-mono font-medium hover:bg-green-500/10 transition-all duration-300 terminal-glow uppercase tracking-wider"
            >
              <span className="mr-2">&gt;</span>
              Initialize Pool
            </Link>
            <a
              href="https://docs.blend.capital"
            target="_blank"
            rel="noopener noreferrer"
              className="border-2 border-green-500/50 text-green-300 px-8 py-4 rounded-lg text-lg font-mono font-medium hover:border-green-500 hover:bg-green-500/5 transition-all duration-300 uppercase tracking-wider"
            >
              <span className="mr-2">?</span>
              Documentation
            </a>
          </div>
        </div>

        {/* Terminal Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 terminal-border backdrop-blur-sm hover:border-green-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center mb-4 font-mono text-green-400 text-xl">
              ⚡
            </div>
            <h3 className="text-xl font-semibold text-green-400 mb-2 font-mono uppercase tracking-wide">
              &gt; Easy Setup
            </h3>
            <p className="text-green-300/70 font-mono text-sm leading-relaxed">
              Guided wizard walks you through each step of pool configuration with helpful explanations and smart defaults.
            </p>
          </div>

          <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 terminal-border backdrop-blur-sm hover:border-green-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center mb-4 font-mono text-green-400 text-xl">
              🛡️
            </div>
            <h3 className="text-xl font-semibold text-green-400 mb-2 font-mono uppercase tracking-wide">
              &gt; Risk Management
            </h3>
            <p className="text-green-300/70 font-mono text-sm leading-relaxed">
              Choose from preset risk profiles or customize parameters with real-time validation and helpful tooltips.
            </p>
          </div>

          <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 terminal-border backdrop-blur-sm hover:border-green-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center mb-4 font-mono text-green-400 text-xl">
              🌐
            </div>
            <h3 className="text-xl font-semibold text-green-400 mb-2 font-mono uppercase tracking-wide">
              &gt; Multi-Network
            </h3>
            <p className="text-green-300/70 font-mono text-sm leading-relaxed">
              Deploy on mainnet, testnet, or futurenet. Test your configuration safely before going live.
            </p>
          </div>
        </div>

        {/* Terminal Process Flow */}
        <div className="bg-black/60 border border-green-500/30 rounded-lg p-8 terminal-border backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-green-400 mb-2 font-mono uppercase tracking-wide">
              &gt; Deployment Process
            </h2>
            <div className="h-0.5 w-full bg-gradient-to-r from-green-500 via-green-400 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center group">
              <div className="w-10 h-10 bg-green-500 border border-green-400 text-black rounded-full flex items-center justify-center mx-auto mb-3 font-mono text-sm font-bold group-hover:bg-green-400 transition-colors">
                01
              </div>
              <h4 className="font-mono font-bold text-green-400 mb-2 uppercase text-sm">Pool Basics</h4>
              <p className="text-xs text-green-300/70 font-mono">Set name, network, and fundamental parameters</p>
            </div>
            
            <div className="hidden md:flex items-center justify-center">
              <div className="h-0.5 w-full bg-gradient-to-r from-green-500 to-green-400"></div>
            </div>
            
            <div className="text-center group">
              <div className="w-10 h-10 bg-black border-2 border-green-500 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 font-mono text-sm font-bold group-hover:bg-green-500/20 transition-colors">
                02
              </div>
              <h4 className="font-mono font-bold text-green-400 mb-2 uppercase text-sm">Select Assets</h4>
              <p className="text-xs text-green-300/70 font-mono">Choose which tokens to include in your pool</p>
            </div>
            
            <div className="hidden md:flex items-center justify-center">
              <div className="h-0.5 w-full bg-gradient-to-r from-green-400 to-green-300"></div>
            </div>
            
            <div className="text-center group">
              <div className="w-10 h-10 bg-black border-2 border-green-500 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 font-mono text-sm font-bold group-hover:bg-green-500/20 transition-colors">
                03
              </div>
              <h4 className="font-mono font-bold text-green-400 mb-2 uppercase text-sm">Risk Parameters</h4>
              <p className="text-xs text-green-300/70 font-mono">Configure lending parameters and interest rates</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="text-center group">
              <div className="w-10 h-10 bg-black border-2 border-green-500 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 font-mono text-sm font-bold group-hover:bg-green-500/20 transition-colors">
                04
              </div>
              <h4 className="font-mono font-bold text-green-400 mb-2 uppercase text-sm">Emissions</h4>
              <p className="text-xs text-green-300/70 font-mono">Set up reward distribution</p>
            </div>
            
            <div className="text-center group">
              <div className="w-10 h-10 bg-black border-2 border-green-500 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 font-mono text-sm font-bold group-hover:bg-green-500/20 transition-colors">
                05
              </div>
              <h4 className="font-mono font-bold text-green-400 mb-2 uppercase text-sm">Deploy</h4>
              <p className="text-xs text-green-300/70 font-mono">Review and deploy your pool</p>
            </div>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="mt-16 text-center">
          <div className="font-mono text-sm text-green-500/60">
            &gt; blend_protocol --version 2.0.0<br/>
            &gt; Status: READY FOR DEPLOYMENT
          </div>
        </div>
      </div>
    </div>
  );
}

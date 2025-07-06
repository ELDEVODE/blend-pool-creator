import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blend Pool Creator | Stellar Lending Pool Deployment",
  description: "Modern web interface for creating and deploying custom lending pools on the Stellar blockchain using the Blend Protocol. Enterprise-grade security with testnet-only deployment.",
  keywords: ["Stellar", "Blend Protocol", "DeFi", "Lending Pool", "Soroban", "Blockchain", "Cryptocurrency"],
  authors: [{ name: "Blend Protocol Community" }],

  openGraph: {
    title: "Blend Pool Creator",
    description: "Create and deploy lending pools on the Stellar blockchain with the Blend Protocol",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Blend Pool Creator',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Blend Pool Creator",
    description: "Create and deploy lending pools on the Stellar blockchain with the Blend Protocol",
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-950 text-green-400 min-h-screen terminal-scanline overflow-x-hidden`}
        style={{
          background: 'linear-gradient(180deg, #0a0f0a 0%, #0f1a0f 100%)',
        }}
      >
        {/* Terminal grid overlay */}
        <div 
          className="fixed inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Terminal content */}
        <div className="relative z-10">
        {children}
        </div>

        {/* Terminal noise overlay */}
        <div 
          className="fixed inset-0 opacity-5 pointer-events-none mix-blend-overlay"
          style={{
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </body>
    </html>
  );
}

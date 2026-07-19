import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, EyeOff, Key, Network, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';

export const AboutMidnight: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-2">
          <Network className="h-3.5 w-3.5" />
          <span>Midnight Network Protocol</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Privacy-Preserving Code Attestations
        </h1>
        <p className="text-zinc-400 text-xs max-w-xl mx-auto leading-relaxed">
          Midnight is a data protection sidechain that enables developers to build shielded smart contracts and privacy-preserving dApps. Learn how we utilize its protocol to secure software due diligence.
        </p>
      </div>

      {/* Grid: Core technology blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 space-y-3">
          <div className="h-8 w-8 rounded bg-zinc-950 border border-border flex items-center justify-center text-primary mb-2">
            <Lock className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-200">Shielded State</h3>
          <p className="text-zinc-400 text-xs leading-normal">
            Midnight uses private state models. Unlike traditional public ledgers, contract variables and calculations remain concealed, proving compliance parameters without public logs.
          </p>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="h-8 w-8 rounded bg-zinc-950 border border-border flex items-center justify-center text-primary mb-2">
            <EyeOff className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-200">Zero-Knowledge Proofs</h3>
          <p className="text-zinc-400 text-xs leading-normal">
            ZKPs mathematically verify that a statement is true without disclosing the details. GhostAudit compiles complex code audit outputs into compact verification hashes.
          </p>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="h-8 w-8 rounded bg-zinc-950 border border-border flex items-center justify-center text-primary mb-2">
            <Key className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-200">Selective Disclosure</h3>
          <p className="text-zinc-400 text-xs leading-normal">
            Startups hold primary keys, deciding when to reveal reports. They can share specific indicators (e.g. licensing rating) while keeping critical code alerts private.
          </p>
        </Card>
      </div>

      {/* Protocol Diagram */}
      <Card className="p-5">
        <CardHeader className="px-0 pt-0 pb-3 flex justify-between items-center border-b border-border">
          <h3 className="text-white font-bold text-xs">Confidential Verification Flow</h3>
          <span className="text-[9px] text-zinc-500 font-mono font-bold">PROTOCOL SPECIFICATION</span>
        </CardHeader>
        <CardContent className="px-0 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                label: 'Local Codebase',
                desc: 'Proprietary codebase parsed and decrypted client-side.'
              },
              {
                step: '02',
                label: 'GhostAudit Analyzer',
                desc: 'Local static scanners identify structural quality and security metrics.'
              },
              {
                step: '03',
                label: 'ZK Proof Compiler',
                desc: 'Audit parameters compiled into a Zero-Knowledge proof.'
              },
              {
                step: '04',
                label: 'Midnight Ledger',
                desc: 'Proof validation state anchored securely to the sidechain.'
              },
              {
                step: '05',
                label: 'Investor Portal',
                desc: 'External stakeholders verify credentials with selective keys.'
              }
            ].map((node, idx) => (
              <div key={idx} className="flex flex-col items-center text-center relative group">
                <div className="h-10 w-10 bg-zinc-900 border border-border flex items-center justify-center text-primary font-mono font-bold text-xs mb-3 group-hover:border-zinc-700 transition-all duration-200">
                  {node.step}
                </div>
                <h4 className="text-white font-bold text-[11px] mb-1.5">{node.label}</h4>
                <p className="text-zinc-500 text-[10px] leading-normal max-w-[130px] mx-auto">
                  {node.desc}
                </p>

                {idx < 4 && (
                  <div className="hidden md:block absolute top-5 -right-5 text-zinc-700">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Workflow & Roadmap */}
      <Card className="p-5 space-y-4 bg-[#121212]/50 border-border">
        <CardHeader className="px-0 pt-0 pb-3 border-b border-[#242424]">
          <h3 className="text-white font-bold text-xs">Product Workflow & Integration Roadmap</h3>
        </CardHeader>
        <CardContent className="px-0 pt-4 space-y-6 text-xs leading-relaxed text-zinc-400">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest font-mono block">
                Current Supported Workflow (v1.0)
              </span>
              <div className="space-y-1.5 font-mono text-[10px] text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">1.</span>
                  <span>Repository ZIP Archive Upload</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">2.</span>
                  <span>Browser-Side Safe Extraction & Parsing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">3.</span>
                  <span>Local Static Due Diligence Scans</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">4.</span>
                  <span>Zero-Knowledge Proof Compilation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">5.</span>
                  <span>Midnight Network On-Chain Attestation</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 opacity-70">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">
                Future Integration Roadmap (Roadmap Only)
              </span>
              <div className="space-y-1.5 font-mono text-[10px] text-zinc-500">
                <div className="flex items-center gap-2">
                  <span>1.</span>
                  <span>Direct GitHub Repository URL Submission</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>2.</span>
                  <span>Secure Backend Proxy Authentication Request</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>3.</span>
                  <span>Ephemeral Private Sandbox Downloader</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>4.</span>
                  <span>In-Browser Confidential Audit Parsing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>5.</span>
                  <span>Zero-Knowledge Proof Attestation Registry</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Block */}
      <div className="p-5 rounded bg-[#121212] border border-border flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-left">
          <h3 className="text-sm font-bold text-white">Ready to verify software due diligence?</h3>
          <p className="text-zinc-400 text-xs max-w-lg leading-normal">
            GhostAudit integrates custom node parser frameworks and Midnight Network sidechains to compile code quality credentials.
          </p>
        </div>
        <Link to="/live-audit">
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            Run Audit Session
          </Button>
        </Link>
      </div>
    </div>
  );
};

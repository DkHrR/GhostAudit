import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Sparkles, ArrowRight, EyeOff } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { RadialProgressChart } from '../components/Charts';

export const LandingPage: React.FC = () => {
  const [completed, setCompleted] = useState<boolean>(false);
  const [activeRepo, setActiveRepo] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [auditResult, setAuditResult] = useState<any>(null);

  useEffect(() => {
    const isDone = localStorage.getItem('ghost_audit_completed') === 'true';
    setCompleted(isDone);
    if (isDone) {
      const repoData = localStorage.getItem('ghost_active_repo');
      if (repoData) setActiveRepo(JSON.parse(repoData));
      const histData = localStorage.getItem('ghost_verification_history');
      if (histData) setHistory(JSON.parse(histData));
      const auditData = localStorage.getItem('ghost_active_audit');
      if (auditData) setAuditResult(JSON.parse(auditData));
    }
  }, []);

  const hasProof = history && history.length > 0;
  const securityScore = auditResult?.securityScore !== undefined ? auditResult.securityScore : 96;

  return (
    <div className="bg-background text-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 border-b border-border">
        {/* Subtle, wide gradient behind title */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#121212] border border-border text-xs text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Privacy-Preserving Code Verification</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-3xl mx-auto">
            Verify software quality without exposing your source code.
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            GhostAudit enables startups to prove security, architecture quality, and engineering maturity through privacy-preserving AI analysis powered by Midnight Network.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/live-audit?start=true">
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Start Free Audit Proof
              </Button>
            </Link>
            <Link to="/about-midnight">
              <Button variant="secondary" size="md">
                Learn About Midnight
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Centerpiece Showcase: Proof Details */}
      <section className="py-16 max-w-4xl mx-auto px-4 w-full">
        <div className="space-y-4 text-center mb-10">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono">
            VERIFIED PROOF SCHEMATIC
          </span>
          <h2 className="text-xl font-bold">Confidential Verification Record</h2>
        </div>

        <Card className="p-6 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${completed ? 'bg-emerald-500' : 'bg-zinc-650'}`} />
              <span className={`text-[10px] font-bold font-mono tracking-wider uppercase ${completed ? 'text-emerald-400' : 'text-zinc-400'}`}>
                {completed ? (hasProof ? 'Midnight proof active' : 'Technical due diligence complete (Proof pending wallet)') : 'Example Proof Template'}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-white leading-tight">
              {completed ? `${activeRepo?.name || 'repository'} (Active Scope)` : 'repository-name (Visual Showcase)'}
            </h3>
            
            <p className="text-zinc-400 text-xs leading-normal">
              {completed 
                ? `This proof guarantees that ${activeRepo?.name || 'the repository'} contains ${auditResult?.secretsLogs?.length || 0} critical security alerts, conforms to validated module separation guidelines, and has a security score of ${auditResult?.securityScore || 100}%.`
                : 'This proof schematic template displays verified indicators (e.g. licensing rating, architectural complexity indices) without disclosing proprietary files or logic.'
              }
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#0A0A0A] p-2.5 rounded border border-border">
                <span className="text-[9px] uppercase font-bold text-zinc-500 block">PROOF HASH</span>
                <span className="text-xs font-mono text-zinc-300 font-semibold block truncate">
                  {completed ? (hasProof ? history[0].proofId : 'Pending wallet anchor') : 'zk_ga_template_proof'}
                </span>
              </div>
              <div className="bg-[#0A0A0A] p-2.5 rounded border border-border">
                <span className="text-[9px] uppercase font-bold text-zinc-500 block">AUDIT COMPLIANCE</span>
                <span className="text-xs font-mono text-zinc-300 font-semibold block truncate">
                  {completed ? (securityScore >= 90 ? 'AAA M&A Spec v2.1' : 'AA M&A Spec v2.1') : 'AAA M&A Spec v2.1'}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center p-3 border border-border bg-[#0A0A0A] rounded w-full md:w-auto">
            <RadialProgressChart 
              percentage={completed ? securityScore : 96} 
              size={130} 
              strokeWidth={8} 
              title={completed ? "Quality rating" : "Quality rating (Example)"} 
              subtitle="M&A Grade" 
            />
          </div>
        </Card>
      </section>

      {/* Minimal Feature List */}
      <section className="py-16 bg-[#121212] border-y border-border">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="h-8 w-8 rounded bg-zinc-900 border border-border flex items-center justify-center text-primary mb-3">
                <EyeOff className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Confidential Local Analysis</h3>
              <p className="text-zinc-400 text-xs leading-normal">
                Analysis code compiles and parses in a secure client-side sandbox. Your proprietary source files never leave your system boundaries.
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-8 w-8 rounded bg-zinc-900 border border-border flex items-center justify-center text-primary mb-3">
                <Brain className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">AI Due Diligence Mapping</h3>
              <p className="text-zinc-400 text-xs leading-normal">
                Generates a granular understanding of technical debt levels, structural layering conventions, and secrets exposure to build an objective maturity record.
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-8 w-8 rounded bg-zinc-900 border border-border flex items-center justify-center text-emerald-500 mb-3">
                <Shield className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Midnight Proof Anchor</h3>
              <p className="text-zinc-400 text-xs leading-normal">
                Proof outcomes are validated and registered on the Midnight sidechain. Share results securely using cryptographic selective disclosure keys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Due Diligence Timeline Steps */}
      <section className="py-16 max-w-3xl mx-auto px-4 w-full">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-xl font-bold">The Verification Protocol</h2>
          <p className="text-zinc-400 text-xs">Four phases to cryptographic investor readiness.</p>
        </div>

        <div className="space-y-6">
          {[
            { step: '01', title: 'Compile Local Codebase', desc: 'Securely upload your zip file. Code tokens are parsed and mapped locally.' },
            { step: '02', title: 'AI Due Diligence Scanner', desc: 'Scan modules for exposed credentials, outdated packages, and layer violations.' },
            { step: '03', title: 'Assemble Cryptographic Proof', desc: 'Compile verification outcomes into a client-side Zero-Knowledge proof.' },
            { step: '04', title: 'Issue Selective Disclosure', desc: 'Anchor proof stamp on Midnight Network. Issue limited viewing keys to Venture Capitalists.' }
          ].map((wf, idx) => (
            <div key={idx} className="flex gap-4 items-center p-3 rounded border border-border bg-[#121212]/40">
              <div className="h-10 w-10 bg-zinc-900 border border-border flex items-center justify-center font-mono font-bold text-xs text-primary shrink-0">
                {wf.step}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{wf.title}</h4>
                <p className="text-zinc-400 text-[11px] mt-0.5">{wf.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-12 bg-black border-t border-border mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-lg font-bold">Ready to verify software maturity?</h2>
          <p className="text-zinc-400 text-xs max-w-md mx-auto leading-relaxed">
            Accelerate your funding due diligence rounds. Generate verification proofs in seconds while keeping IP protected.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link to="/live-audit">
              <Button variant="primary">
                Verify Repository
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary">
                Explore Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

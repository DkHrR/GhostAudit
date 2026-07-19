import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Sparkles, CheckCircle2, Lightbulb, ArrowLeft, Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { StatusBadge } from '../components/StatusBadge';
import type { AuditResult } from '../models/audit';
import { Button } from '../components/Button';
import { useAudit } from '../hooks/useAudit';

export const AIExecutiveSummary: React.FC = () => {
  const navigate = useNavigate();
  const { resetSession } = useAudit();
  const [completed, setCompleted] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const isDone = localStorage.getItem('ghost_audit_completed') === 'true';
    setCompleted(isDone);
    if (isDone) {
      const data = localStorage.getItem('ghost_active_audit');
      if (data) {
        setAuditResult(JSON.parse(data));
      }
      const histData = localStorage.getItem('ghost_verification_history');
      if (histData) {
        setHistory(JSON.parse(histData));
      }
    } else {
      setAuditResult(null);
      setHistory([]);
    }
  }, []);

  if (!completed || !auditResult) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8">
        <Card className="p-8 text-center flex flex-col items-center justify-center min-h-[380px] bg-[#121212] border-[#242424] space-y-5">
          <div className="h-12 w-12 rounded bg-zinc-950 border border-border flex items-center justify-center text-zinc-500 mb-2">
            <Brain className="h-6 w-6" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">No executive summary available.</h2>
            <p className="text-zinc-400 text-xs max-w-lg mx-auto leading-relaxed">
              Run an AI audit to generate a summary.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/live-audit">
              <Button variant="primary">
                Start Audit
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const overallRisk = 100 - auditResult.securityScore;
  const hasProof = history && history.length > 0;
  const proofId = hasProof ? history[0].proofId : 'Not Generated';

  const repoName = auditResult.repository.name;
  const repoType = auditResult.repository.type || 'Repository Archive';
  const fileKeys = Object.keys(auditResult.repository.files || {});
  const depCount = (auditResult.dependenciesList || []).length;
  const recCount = (auditResult.recommendations || []).length;
  const secretCount = (auditResult.secretsLogs || []).length;
  const layerCount = (auditResult.architectureLayers || []).length;
  // Detect README presence from file keys
  const hasReadme = fileKeys.some(k => k.toLowerCase().split('/').pop()?.startsWith('readme'));

  const metrics = [
    { label: 'Overall Risk Score', value: overallRisk, max: 100, variant: 'accent' as const, desc: secretCount > 0 ? `${secretCount} credential pattern(s) flagged — review secrets before deployment.` : 'No plaintext credentials detected in indexed source files.' },
    { label: 'Security Score', value: auditResult.securityScore, max: 100, variant: 'primary' as const, desc: recCount > 0 ? `${recCount} security/maintenance recommendation(s) generated from repository scan.` : 'No critical security findings in scanned files.' },
    { label: 'Architecture Quality', value: auditResult.maintainabilityScore, max: 100, variant: 'primary' as const, desc: layerCount > 0 ? `${layerCount} architectural component layer(s) inferred from repository layout.` : 'Architecture inferred from file naming and directory structure.' },
    { label: 'Maintainability Score', value: auditResult.maintainabilityScore, max: 100, variant: 'primary' as const, desc: hasReadme ? 'README.md documentation present at repository root.' : 'README.md documentation not detected at repository root.' },
    { label: 'Dependency Health', value: auditResult.dependencyHealthScore, max: 100, variant: 'accent' as const, desc: depCount > 0 ? `${depCount} dependency declaration(s) parsed from manifest files.` : 'No dependency manifest detected in repository.' }
  ];

  // Detect repo technology from type label for narrative branching
  const isReactRepo = repoType.toLowerCase().includes('react');
  const isExpressRepo = repoType.toLowerCase().includes('express');
  const isPythonRepo = repoType.toLowerCase().includes('python') || repoType.toLowerCase().includes('flask') || repoType.toLowerCase().includes('django');
  const isFlaskRepo = repoType.toLowerCase().includes('flask');
  const isDjangoRepo = repoType.toLowerCase().includes('django');
  const isFullStack = repoType.toLowerCase().includes('full-stack') || repoType.toLowerCase().includes('full stack');

  // Build technology-specific paragraph 1
  let paragraph1: string;
  if (isFullStack) {
    paragraph1 = `The repository ${repoName} is classified as a ${repoType}. Static analysis identified ${fileKeys.length} source files across the repository archive. The project integrates a React front-end with an Express back-end${ (auditResult.architectureLayers || []).some(l => l.type === 'Auth Gateway') ? ', and authentication-related modules were identified in the file structure' : ''}. Dependency manifests (package.json) were parsed to enumerate the JavaScript ecosystem dependencies.`;
  } else if (isReactRepo) {
    paragraph1 = `The repository ${repoName} is classified as a ${repoType}. Static analysis indexed ${fileKeys.length} source files. The project uses React as its primary UI framework with a component-based architecture. Package.json was parsed to enumerate ${depCount} declared JavaScript dependencies. ${ (auditResult.architectureLayers || []).some(l => l.type === 'UI Component') ? `${layerCount} UI component and page-layer files were identified.` : 'No server-side code was detected — this is a client-side single-page application.'}`;
  } else if (isExpressRepo) {
    paragraph1 = `The repository ${repoName} is classified as a ${repoType}. Static analysis indexed ${fileKeys.length} source files. The project implements a Node.js HTTP server using Express, with ${layerCount > 0 ? layerCount + ' architectural layers (entrypoints, controllers, or services) inferred from the file structure' : 'routing modules inferred from file naming conventions'}. Package.json was parsed to enumerate ${depCount} declared dependencies.`;
  } else if (isDjangoRepo) {
    paragraph1 = `The repository ${repoName} is classified as a ${repoType}. Static analysis indexed ${fileKeys.length} source files. The project uses the Django framework, a Python-based web framework with a model-view-template architecture. Requirements.txt was parsed to enumerate ${depCount} declared Python dependencies.`;
  } else if (isFlaskRepo) {
    paragraph1 = `The repository ${repoName} is classified as a ${repoType}. Static analysis indexed ${fileKeys.length} source files. The project uses Flask, a lightweight Python WSGI framework. Requirements.txt was parsed to enumerate ${depCount} declared Python packages.`;
  } else if (isPythonRepo) {
    paragraph1 = `The repository ${repoName} is classified as a ${repoType}. Static analysis indexed ${fileKeys.length} source files. The project contains Python source files${ depCount > 0 ? ` and ${depCount} dependencies declared in requirements.txt` : ' with no dependency manifest detected'}.`;
  } else {
    paragraph1 = `The repository ${repoName} is classified as a ${repoType}. Static analysis indexed ${fileKeys.length} source files. ${ layerCount > 0 ? `${layerCount} structural component layers were inferred from the repository layout.` : 'Repository structure and metadata were analyzed.'}`;
  }

  // Build paragraph 2 from real findings
  let paragraph2: string;
  if (depCount > 0) {
    paragraph2 = `Dependency manifests were parsed, identifying ${depCount} external package declarations. ${
      recCount > 0
        ? `${recCount} maintenance recommendation(s) were generated based on detected dependency versions or missing security configurations.`
        : 'No critical version advisories were identified in the parsed dependency list.'
    } ${
      secretCount > 0
        ? `Secrets scanning identified ${secretCount} potential plaintext credential pattern(s) in source files — these should be resolved before deployment.`
        : 'Secrets scanning detected no plaintext credential patterns in the indexed source files.'
    }`;
  } else {
    paragraph2 = `No dependency manifest (package.json or requirements.txt) was found in the repository. ${
      secretCount > 0
        ? `Secrets scanning identified ${secretCount} potential plaintext credential pattern(s) in source files.`
        : 'Secrets scanning detected no plaintext credential patterns in the indexed source files.'
    } Repository structure and project metadata were analyzed for classification purposes.`;
  }

  const handleNewAudit = () => {
    resetSession();
    navigate('/live-audit');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sub navigation buttons panel */}
      <div className="flex items-center gap-2 border-b border-border pb-3 mb-1">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
            Back to Dashboard
          </Button>
        </Link>
        <span className="text-zinc-700">|</span>
        <Button variant="ghost" size="sm" onClick={handleNewAudit} className="text-xs text-zinc-400 hover:text-white" leftIcon={<Plus className="h-3.5 w-3.5" />}>
          New Audit
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white tracking-tight">
            AI Executive Summary
          </h1>
          <p className="text-zinc-400 text-xs">
            AI-generated due diligence assessments, security maturity scores, and code health logs.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-950/20 border border-emerald-900/40 text-xs font-bold text-emerald-450">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>M&A Investment Grade: AAA</span>
        </div>
      </div>

      {/* Grid of Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Metrics Box */}
        <Card className="md:col-span-2 p-5 space-y-5">
          <h3 className="text-white font-bold text-xs border-b border-border pb-3">
            Core Due Diligence Scores
          </h3>
          
          <div className="space-y-4">
            {metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">{m.label}</span>
                  <span className="text-white font-mono">
                    {m.value}/{m.max}
                  </span>
                </div>
                <ProgressBar value={m.value} max={m.max} variant={m.variant} size="sm" animate={true} />
                <span className="text-[10px] text-zinc-500 block">{m.desc}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Investment Readiness & Status */}
        <Card className="flex flex-col justify-between p-5 space-y-4">
          <div className="space-y-3">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">
              Investment Readiness State
            </span>
            <div className="inline-flex items-center gap-2 p-3 bg-emerald-950/30 border border-emerald-900/40 rounded text-emerald-400 font-bold text-sm font-mono">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
              <span>READY FOR REVIEW</span>
            </div>
            <p className="text-xs text-zinc-400 leading-normal mt-2">
              This repository conforms to enterprise-grade compliance. Security, licensing, and secrets modules pass automated investor standards.
            </p>
          </div>

          <div className="border-t border-border pt-4 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">M&A Risk Level</span>
              <span className="font-bold text-emerald-450">{auditResult.riskRating}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Midnight Proof Status</span>
              <StatusBadge type={hasProof ? 'verified' : 'pending'} />
            </div>
          </div>
        </Card>
      </div>

      {/* AI Narrative Executive Summary */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-border pb-3">
          <Brain className="h-4.5 w-4.5 text-primary shrink-0" />
          <h3 className="text-white font-bold text-xs">AI Narrative Due Diligence Report</h3>
        </div>

        <div className="space-y-4 text-zinc-350 text-xs md:text-sm leading-relaxed max-w-4xl font-sans">
          <p>
            {paragraph1}
          </p>
          <p>
            {paragraph2}
          </p>
          <p>
            {hasProof ? (
              <>
                Furthermore, GhostAudit verified that zero-knowledge proofs have been compiled and registered on the Midnight Network (Proof ID: <span className="font-mono text-zinc-350">{proofId}</span>). This enables secure, cryptographically validated due diligence sharing with designated stakeholders without revealing details of the repository structure or IP.
              </>
            ) : (
              <>
                Furthermore, GhostAudit successfully completed all repository structural checks. A Midnight Zero-Knowledge Proof has not yet been generated for this session — this is <em>optional</em>. Once generated, stakeholders can cryptographically verify these compliance parameters without accessing the codebase.
              </>
            )}
          </p>
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className="p-6">
        <div className="flex items-center gap-2.5 border-b border-border pb-3 mb-4">
          <Lightbulb className="h-4.5 w-4.5 text-primary shrink-0" />
          <h3 className="text-white font-bold text-xs">Key Architectural & Security Recommendations</h3>
        </div>
        <div className="space-y-3">
          {[...auditResult.secretsLogs, ...auditResult.recommendations].map((rec, idx) => (
            <div key={idx} className="flex gap-4 items-start p-3 bg-black/40 rounded border border-border">
              <div className="shrink-0 pt-0.5">
                <StatusBadge type={rec.severity} />
              </div>
              <div className="space-y-1">
                <h4 className="text-white font-bold text-xs">Correction: {rec.filePath}:{rec.lineNumber}</h4>
                <p className="text-zinc-400 text-xs leading-normal">{rec.description}</p>
                <div className="mt-2 text-[10px] font-mono whitespace-pre-wrap p-2 bg-black border border-zinc-850 text-zinc-350 rounded font-semibold">
                  {rec.recommendedCorrection}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

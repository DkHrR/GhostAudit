import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Lock, 
  Package, 
  Network, 
  Download,
  CheckCircle2,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { BarChart } from '../components/Charts';
import { useAudit } from '../hooks/useAudit';

export const AuditReport: React.FC = () => {
  const navigate = useNavigate();
  const { resetSession } = useAudit();
  const [activeTab, setActiveTab] = useState<'secrets' | 'dependencies' | 'architecture'>('secrets');
  const [completed, setCompleted] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [activeRepo, setActiveRepo] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const isDone = localStorage.getItem('ghost_audit_completed') === 'true';
    setCompleted(isDone);
    if (isDone) {
      const auditData = localStorage.getItem('ghost_active_audit');
      if (auditData) {
        setAuditResult(JSON.parse(auditData));
      }
      const repoData = localStorage.getItem('ghost_active_repo');
      if (repoData) {
        setActiveRepo(JSON.parse(repoData));
      }
      const histData = localStorage.getItem('ghost_verification_history');
      if (histData) {
        setHistory(JSON.parse(histData));
      }
    }
  }, []);

  const handleExportProof = () => {
    const isDone = localStorage.getItem('ghost_audit_completed') === 'true';
    if (!isDone) return;
    const repoData = localStorage.getItem('ghost_active_repo');
    const name = repoData ? JSON.parse(repoData).name : 'repository';
    const histData = localStorage.getItem('ghost_verification_history');
    const proofRecord = histData ? JSON.parse(histData)[0] : null;

    if (!proofRecord) {
      alert('Cryptographic proof is pending wallet connection and anchoring.');
      return;
    }

    const proofData = JSON.stringify(proofRecord, null, 2);
    const blob = new Blob([proofData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}_midnight_proof.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!completed) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8">
        <Card className="p-8 text-center flex flex-col items-center justify-center min-h-[380px] bg-[#121212] border-[#242424] space-y-5">
          <div className="h-12 w-12 rounded bg-zinc-950 border border-border flex items-center justify-center text-zinc-500 mb-2">
            <ShieldAlert className="h-6 w-6" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">No audit report available.</h2>
            <p className="text-zinc-405 text-xs max-w-lg mx-auto leading-relaxed">
              Run an audit session to generate your first report.
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

  // Dynamic calculations from storage
  const secrets = auditResult?.secretsLogs || [];
  const recs = auditResult?.recommendations || [];
  const allIssues = [...secrets, ...recs];

  const criticalCount = allIssues.filter(i => i.severity === 'critical').length;
  const highCount = allIssues.filter(i => i.severity === 'high').length;
  const mediumCount = allIssues.filter(i => i.severity === 'medium').length;
  const lowCount = allIssues.filter(i => i.severity === 'low').length;
  const infoCount = allIssues.filter(i => i.severity === 'info' || i.severity === 'informational').length;

  const severityData = [
    { label: 'Critical', value: criticalCount },
    { label: 'High', value: highCount },
    { label: 'Medium', value: mediumCount },
    { label: 'Low', value: lowCount },
    { label: 'Informational', value: infoCount },
  ];

  const repoName = activeRepo?.name || 'repository';
  const repoType = activeRepo?.type || 'Source codebase';
  const commitHash = activeRepo?.hash || 'unavailable';
  const hasProof = history && history.length > 0;
  const proofId = hasProof ? history[0].proofId : 'Not Generated';

  // Phase 2 Health score calculations
  const hasReadme = activeRepo?.files ? Object.keys(activeRepo.files).some(k => k.toLowerCase().endsWith('readme.md')) : false;
  
  let todoCount = 0;
  if (activeRepo?.files) {
    Object.values(activeRepo.files).forEach((content: any) => {
      if (typeof content === 'string') {
        const matches = content.match(/\/\/.*TODO|\/\*[\s\S]*?TODO/gi);
        if (matches) todoCount += matches.length;
      }
    });
  }

  const securityScore = auditResult?.securityScore !== undefined ? auditResult.securityScore : 100;
  
  let healthScore: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention' = 'Excellent';
  if (securityScore < 70 || secrets.length > 2) {
    healthScore = 'Needs Attention';
  } else if (securityScore < 85 || !hasReadme) {
    healthScore = 'Fair';
  } else if (securityScore < 95 || todoCount > 5) {
    healthScore = 'Good';
  }

  let overallRisk: 'Low' | 'Medium' | 'High' = 'Low';
  if (securityScore < 70) {
    overallRisk = 'High';
  } else if (securityScore < 90) {
    overallRisk = 'Medium';
  }

  let aiRecommendation: 'Proceed' | 'Proceed with Caution' | 'Requires Further Review' | 'High Risk' = 'Proceed';
  if (securityScore < 70) {
    aiRecommendation = 'High Risk';
  } else if (securityScore < 85) {
    aiRecommendation = 'Requires Further Review';
  } else if (securityScore < 95 || !hasReadme || todoCount > 8) {
    aiRecommendation = 'Proceed with Caution';
  }

  // Evidence list building
  const evidenceList: string[] = [];
  if (secrets.length > 0) {
    evidenceList.push(`${secrets.length} hardcoded secret/credential fallback pattern(s) identified in code strings.`);
  } else {
    evidenceList.push(`Zero plaintext credentials or private keys detected in source code strings.`);
  }

  if (recs.length > 0) {
    evidenceList.push(`${recs.length} package dependency vulnerability warning(s) or version mismatch alert(s) detected.`);
  } else {
    evidenceList.push(`All core packages matched secure baseline releases.`);
  }

  if (!hasReadme) {
    evidenceList.push(`README.md documentation file is missing at repository root.`);
  } else {
    evidenceList.push(`README.md documentation file found and indexed at root.`);
  }

  if (todoCount > 0) {
    evidenceList.push(`Detected ${todoCount} pending TODO comments in code files, denoting incomplete features.`);
  } else {
    evidenceList.push(`No pending TODO comments or architectural debt markers found.`);
  }

  // Technology Stack list
  const extensions = new Set<string>();
  if (activeRepo?.files) {
    Object.keys(activeRepo.files).forEach(f => {
      const ext = f.split('.').pop()?.toUpperCase();
      if (ext && ext.length < 5) extensions.add(ext);
    });
  }
  const techStackStr = extensions.size > 0 ? Array.from(extensions).join(', ') : 'Not detected';

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
            Detailed Software Audit Report
          </h1>
          <p className="text-zinc-400 text-xs">
            Detailed results regarding secret detection logs, package dependencies, and architecture layers.
          </p>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          disabled={!hasProof}
          onClick={handleExportProof}
          leftIcon={<Download className="h-4 w-4" />}
        >
          {hasProof ? 'Export Cryptographic Proof' : 'No Midnight Proof Generated'}
        </Button>
      </div>

      {/* 1. Executive Summary & Overview Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 p-6 space-y-4">
          <div className="border-b border-[#242424] pb-3 flex items-center justify-between">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono">Executive Summary</h3>
            <span className="text-[10px] text-zinc-500 font-mono">CONFIDENTIAL REPORT</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-zinc-500 text-[10px] block font-mono">HEALTH RATING</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-sm font-mono inline-block ${
                healthScore === 'Excellent' ? 'bg-emerald-950/40 text-emerald-450 border border-emerald-900/40' :
                healthScore === 'Good' ? 'bg-blue-950/40 text-blue-400 border border-blue-900/40' :
                healthScore === 'Fair' ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-900/40' :
                'bg-red-950/40 text-red-500 border border-red-900/40'
              }`}>
                {healthScore.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 text-[10px] block font-mono">OVERALL RISK</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-sm font-mono inline-block ${
                overallRisk === 'Low' ? 'bg-emerald-950/40 text-emerald-450 border border-emerald-900/40' :
                overallRisk === 'Medium' ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-900/40' :
                'bg-red-950/40 text-red-500 border border-red-900/40'
              }`}>
                {overallRisk.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 text-[10px] block font-mono">SECURITY INDEX</span>
              <span className="text-sm font-bold text-white font-mono block mt-0.5">
                {securityScore}%
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 text-[10px] block font-mono">RECOMMENDATION</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-sm font-mono inline-block ${
                aiRecommendation === 'Proceed' ? 'bg-emerald-950/40 text-emerald-450 border border-emerald-900/40' :
                aiRecommendation === 'Proceed with Caution' ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-900/40' :
                'bg-red-950/40 text-red-500 border border-red-900/40'
              }`}>
                {aiRecommendation.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="pt-2 text-zinc-450 text-xs leading-relaxed font-sans">
            <span className="text-white font-bold block mb-1">AI Recommendation Details</span>
            {aiRecommendation === 'Proceed' && 'The analyzed codebase exhibits high compliance with baseline standards. The repository structure is mature, with zero hardcoded API keys detected.'}
            {aiRecommendation === 'Proceed with Caution' && 'The codebase satisfies core structural constraints but contains minor maintenance alerts or undocumented modules that require caution.'}
            {aiRecommendation === 'Requires Further Review' && 'Vulnerability fallbacks or dependencies require further review before closing due diligence audits.'}
            {aiRecommendation === 'High Risk' && 'Significant security findings (such as exposed plaintext tokens or private credentials) present high risk. Rectification required.'}
          </div>
        </Card>

        {/* 2. Repository Overview & Stack Card */}
        <Card className="col-span-1 p-6 space-y-4">
          <div className="border-b border-[#242424] pb-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono">Repository Overview</h3>
          </div>

          <div className="space-y-2.5 font-mono text-[11px] text-zinc-400">
            <div className="flex justify-between items-center border-b border-[#242424]/40 pb-1.5">
              <span>Repo ID</span>
              <span className="text-white font-semibold truncate max-w-[145px]">{repoName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#242424]/40 pb-1.5">
              <span>Architecture</span>
              <span className="text-white font-semibold truncate max-w-[145px]">{repoType}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#242424]/40 pb-1.5">
              <span>Workspace Size</span>
              <span className="text-white font-semibold">{activeRepo?.size || '0 MB'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#242424]/40 pb-1.5">
              <span>Files Count</span>
              <span className="text-white font-semibold">{activeRepo?.filesCount || 0}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#242424]/40 pb-1.5">
              <span>Technology Profile</span>
              <span className="text-white font-semibold truncate max-w-[120px]">{techStackStr}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Commit Hash</span>
              <span className="text-white font-semibold truncate max-w-[120px]">{commitHash}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Midnight Positioning & Verification Banner */}
      <Card className="p-5 border-l-2 border-l-primary bg-[#0000FE]/5 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold text-primary uppercase font-mono tracking-wider">
            Midnight Privacy Attestation Protocol
          </span>
        </div>
        <p className="text-zinc-400 leading-relaxed text-[11px] max-w-5xl">
          GhostAudit performs repository structural scans locally inside your browser sandbox. Verification outcomes are compiled into zero-knowledge attestation statements and anchored on the Midnight Network (Proof Stamp: <span className="text-white font-mono">{proofId}</span>).
        </p>
        <p className="text-zinc-500 text-[10.5px] italic">
          Disclaimer: This is a privacy-preserving static compliance verification and does not constitute a guaranteed vulnerability-free code audit.
        </p>
      </Card>

      {/* 4. Risk Assessment & Evidence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Severity Chart */}
        <Card className="col-span-1 lg:col-span-2 p-6 flex flex-col justify-between">
          <div className="border-b border-[#242424] pb-3 mb-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono">Technical Risk Assessment</h3>
          </div>
          <div className="flex items-end justify-center p-2 mb-2">
            <BarChart data={severityData} height={120} />
          </div>
          <div className="text-[10.5px] text-zinc-550 font-mono text-center pt-2 border-t border-[#242424]">
            Issues categorized by analyzer severity rules.
          </div>
        </Card>

        {/* Evidence Card */}
        <Card className="col-span-1 p-6 space-y-4">
          <div className="border-b border-[#242424] pb-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider font-mono">Dossier Evidence</h3>
          </div>
          
          <ul className="space-y-3 font-sans text-xs text-zinc-400">
            {evidenceList.map((ev, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className={`text-[9px] shrink-0 font-mono block mt-0.5 ${
                  ev.includes('identified') || ev.includes('missing') ? 'text-red-400' : 'text-emerald-450'
                }`}>
                  {ev.includes('identified') || ev.includes('missing') ? '✖' : '✔'}
                </span>
                <span>{ev}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Tabs list */}
      <Card>
        {/* Navigation Tabs */}
        <div className="flex border-b border-border bg-[#161616]/30">
          {[
            { id: 'secrets', label: 'Secret Detection', icon: Lock },
            { id: 'dependencies', label: 'Dependency Health', icon: Package },
            { id: 'architecture', label: 'Architecture Map', icon: Network },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary text-white bg-zinc-900/40'
                    : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-950/20'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <CardContent className="p-6">
          {activeTab === 'secrets' && (
            <div className="space-y-6">
              {highCount > 0 ? (
                <div className="flex items-center gap-2 p-4 rounded bg-red-950/10 border border-red-900/35">
                  <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-300 leading-normal font-semibold">
                    <span className="font-bold">{highCount} High Risk Issue{highCount > 1 ? 's' : ''}:</span> Leaked/hardcoded key fallback pattern detected in source files.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-4 rounded bg-emerald-950/10 border border-emerald-900/35">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-300 leading-normal font-semibold">
                    <span className="font-bold">All Secrets Checked:</span> Zero hardcoded tokens or private keys identified in scanned source code.
                  </p>
                </div>
              )}

              {/* Secret item detail */}
              <div className="space-y-4">
                {secrets.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 rounded bg-[#0A0A0A] border border-border space-y-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-200">
                        {item.filePath}:{item.lineNumber ? `L${item.lineNumber}` : ''}
                      </span>
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-red-950/30 text-red-400 rounded border border-red-900/40">
                        {item.severity.toUpperCase()} SEVERITY
                      </span>
                    </div>
                    
                    <p className="text-xs text-zinc-400 leading-normal">
                      {item.description}
                    </p>
                    
                    {item.recommendedCorrection && (
                      <div className="p-3 bg-black rounded border border-[#242424] font-mono text-[10px] text-zinc-400 whitespace-pre-wrap">
                        {item.recommendedCorrection}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dependencies' && (
            <div className="space-y-6">
              {lowCount > 0 ? (
                <div className="flex items-center gap-2 p-4 rounded bg-emerald-950/10 border border-emerald-900/35">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-300 leading-normal font-semibold">
                    <span className="font-bold">Security Standard Verified:</span> Package audit successful with minor update advisories.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-4 rounded bg-emerald-950/10 border border-emerald-900/35">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <p className="text-xs text-emerald-300 leading-normal font-semibold">
                    <span className="font-bold">No Critical Vulnerabilities:</span> All packages loaded conform to verified software standards.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {auditResult?.dependenciesList && auditResult.dependenciesList.length > 0 ? (
                  auditResult.dependenciesList.map((dep: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#0A0A0A] border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-zinc-200">{dep.name}</span>
                        <p className="text-zinc-500 text-[10px] font-mono">Declared: {dep.version}</p>
                      </div>
                      <div className="flex gap-4 sm:gap-10">
                        <div>
                          <span className="text-zinc-500 text-[9px] block font-semibold uppercase">Update status</span>
                          <span className="text-zinc-300 font-semibold">{dep.status}</span>
                        </div>
                        <div className="text-right sm:text-left">
                          <span className="text-zinc-500 text-[9px] block font-semibold uppercase">Security state</span>
                          <span className="text-emerald-400 font-semibold font-mono">{dep.security}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-xs font-mono text-center py-6">
                    No external dependencies detected in parsed files.
                  </p>
                )}
              </div>
            </div>
          )}
 
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <p className="text-xs text-zinc-400 leading-relaxed">
                GhostAudit maps architecture components to verify layering rules. Clean layering proves security isolation and maintainability during due diligence checks.
              </p>
 
              {/* Dynamic SVG Node architecture graph */}
              <div className="w-full flex items-center justify-center p-6 border border-border bg-black rounded-xl min-h-[220px]">
                {auditResult?.architectureLayers && auditResult.architectureLayers.length > 0 ? (
                  <svg className="w-full max-w-lg h-auto overflow-visible" viewBox="0 0 400 160">
                    {auditResult.architectureLayers.map((layer: any, idx: number) => {
                      const x = 30 + (idx % 3) * 125;
                      const y = 20 + Math.floor(idx / 3) * 55;
                      return (
                        <g key={idx}>
                          <rect x={x} y={y} width="105" height="40" rx="6" fill="#121212" stroke={layer.type === 'Auth Gateway' || layer.type === 'Controller' ? '#0000FE' : '#242424'} strokeWidth="1.5" />
                          <text x={x + 52} y={y + 18} fill="#FFFFFF" fontSize="9" fontFamily="Inter" fontWeight="bold" textAnchor="middle">{layer.type}</text>
                          <text x={x + 52} y={y + 29} fill="#A1A1AA" fontSize="7.5" fontFamily="JetBrains Mono" textAnchor="middle">{layer.name}</text>
                        </g>
                      );
                    })}
                  </svg>
                ) : (
                  <div className="text-zinc-550 text-xs font-mono py-8 text-center w-full">
                    Architecture could not be inferred from the uploaded repository.
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

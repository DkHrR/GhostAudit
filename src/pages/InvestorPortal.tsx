import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  CheckCircle2, 
  Share2,
  Unlock,
  ArrowRight,
  ArrowLeft,
  Plus
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { useMidnight } from '../hooks/useMidnight';
import { useAudit } from '../hooks/useAudit';

export const InvestorPortal: React.FC = () => {
  const navigate = useNavigate();
  const { resetSession } = useAudit();
  const {
    copied,
    isUnlocked,
    disclosureConfig,
    handleToggle,
    handleCopyLink,
    verificationHistory,
    resetVerification
  } = useMidnight();

  const repoData = localStorage.getItem('ghost_active_repo');
  const repoName = repoData ? JSON.parse(repoData).name : 'repository';

  const auditData = localStorage.getItem('ghost_active_audit');
  const activeRepoSecurityScore = auditData ? JSON.parse(auditData).securityScore : 100;

  const activeProof = verificationHistory[0];
  const baseTime = activeProof?.anchoredAt ? new Date(activeProof.anchoredAt) : new Date();

  const formatOffset = (minsOffset: number) => {
    const t = new Date(baseTime.getTime() + minsOffset * 60000);
    return t.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const timelineSteps = [
    { title: 'Repository Upload', desc: 'Code zipped & encrypted locally', date: formatOffset(-10), done: true },
    { title: 'Local Static Audit', desc: `Security index estimated at ${activeRepoSecurityScore}%`, date: formatOffset(-8), done: true },
    { title: 'ZKP Compiler Run', desc: 'Midnight Zero-Knowledge proof compiled', date: formatOffset(-5), done: true },
    { title: 'Disclosure Keys Created', desc: 'Granting selective metrics access', date: formatOffset(0), done: true },
    { title: 'Investor Verification', desc: 'VC registry checking and stamp validation', date: 'Awaiting view', done: false }
  ];

  if (!isUnlocked) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8">
        {/* Locked State Container */}
        <Card className="p-8 text-center flex flex-col items-center justify-center min-h-[380px] bg-[#121212] border-[#242424] space-y-5">
          <div className="h-12 w-12 rounded bg-zinc-950 border border-border flex items-center justify-center text-zinc-500 mb-2">
            <Lock className="h-6 w-6" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight">No zero-knowledge proof available.</h2>
            <p className="text-zinc-400 text-xs max-w-lg mx-auto leading-relaxed">
              Generate and anchor an audit before sharing with investors.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/live-audit?start=true">
              <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Launch AI Due Diligence Session
              </Button>
            </Link>
          </div>

          <div className="text-[10px] text-zinc-500 font-mono pt-4 uppercase">
            Awaiting Midnight network verification anchors
          </div>
        </Card>

        {/* Blurred preview mock card of the portal */}
        <div className="opacity-20 pointer-events-none select-none relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border-border bg-surface">
              <div className="h-4 w-1/3 bg-zinc-800 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-zinc-900 rounded" />
                <div className="h-3 w-5/6 bg-zinc-900 rounded" />
              </div>
            </Card>
            <Card className="p-4 border-border bg-surface">
              <div className="h-4 w-1/4 bg-zinc-800 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-zinc-900 rounded" />
                <div className="h-3 w-3/4 bg-zinc-900 rounded" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const handleNewAudit = () => {
    resetSession();
    navigate('/live-audit');
  };

  return (
    <div className="space-y-6">
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
      {/* Unlocked Banner */}
      <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded flex items-center justify-between flex-wrap gap-3 animate-fadeIn">
        <div className="flex items-center gap-2 text-emerald-450 text-xs font-semibold">
          <Unlock className="h-4 w-4 stroke-2" />
          <span>Verification Unlocked: Cryptographic proof for {repoName} is active on Midnight Network.</span>
        </div>
        <Button variant="ghost" size="sm" className="text-[10px] uppercase font-mono px-2 py-1 text-zinc-405 hover:text-white" onClick={resetVerification}>
          Reset Session
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Investor Portal
          </h1>
          <p className="text-zinc-400 text-xs">
            Manage selective disclosure settings and share cryptographic verification proofs with stakeholders.
          </p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Share2 className="h-4 w-4" />} onClick={handleCopyLink}>
          {copied ? 'Link Copied' : 'Copy Access Link'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Selective Disclosure Controls */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-white font-bold text-xs">Selective Disclosure Settings</h3>
              <div className="flex items-center gap-1.5 text-xs text-primary font-semibold font-mono">
                <Lock className="h-3.5 w-3.5" />
                <span>Zero-Knowledge Proof Configured</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-zinc-400 leading-normal mb-2">
                Configure which metrics are disclosed to external stakeholders (Venture Capitalists, M&A Auditors). Your proprietary codebase stays strictly hidden; only the checked items below are compiled into the cryptographic proof.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: 'overallRisk', label: 'Overall Risk Score', desc: 'Disclose risk level metric' },
                  { key: 'securityScore', label: 'Security Maturity Score', desc: 'Disclose core index score' },
                  { key: 'maintainability', label: 'Maintainability Index', desc: 'Disclose technical debt levels' },
                  { key: 'secretsLogs', label: 'Secret Detection Logs', desc: 'Show locations of flagged tokens' },
                  { key: 'dependencyDetails', label: 'Dependency & Licensing Details', desc: 'Disclose package and audit metadata' },
                  { key: 'architectureMap', label: 'Architecture Layer Maps', desc: 'Disclose structural diagrams' }
                ].map((item) => (
                  <div 
                    key={item.key}
                    onClick={() => handleToggle(item.key as any)}
                    className={`p-3 rounded border transition-all duration-200 cursor-pointer select-none flex items-center justify-between gap-4 ${
                      disclosureConfig[item.key as keyof typeof disclosureConfig]
                        ? 'border-primary bg-[#0000FE]/5'
                        : 'border-border bg-black/10 hover:border-zinc-800'
                    }`}
                  >
                    <div>
                      <h4 className="text-white font-bold text-xs">{item.label}</h4>
                      <p className="text-zinc-500 text-[10px] mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`h-4.5 w-4.5 rounded-sm flex items-center justify-center border transition-all shrink-0 ${
                      disclosureConfig[item.key as keyof typeof disclosureConfig]
                        ? 'border-primary bg-primary text-white'
                        : 'border-zinc-855 bg-black'
                    }`}>
                      {disclosureConfig[item.key as keyof typeof disclosureConfig] && <CheckCircle2 className="h-3 w-3 stroke-2" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cryptographic Proof Registry */}
          <Card>
            <CardHeader>
              <h3 className="text-white font-bold text-xs">Cryptographic Verification Registry</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#242424]">
                {verificationHistory.map((item, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="font-mono font-bold text-white">{item.repoName}</span>
                      <p className="text-zinc-500 text-[10px] font-mono truncate max-w-sm">Proof ID: {item.proofId}</p>
                    </div>
                    <div className="flex gap-4 sm:gap-10 items-center justify-between sm:justify-end">
                      <div className="text-right sm:text-left">
                        <span className="text-zinc-500 text-[9px] block font-bold font-mono">Ledger Tx</span>
                        <span className="text-zinc-350 font-semibold font-mono truncate max-w-[100px] block">{item.midnightTxHash}</span>
                      </div>
                      <StatusBadge type={item.repoName.includes('contract') ? 'flagged' : 'verified'} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Invite Stakeholders & Timeline */}
        <div className="space-y-6">
          {/* Invite Board / Investors */}
          <Card className="p-5 space-y-4">
            <h3 className="text-white font-bold text-xs">Grant Access</h3>
            <p className="text-xs text-zinc-400 leading-normal">
              Generate a temporary, client-side encrypted key and email it directly to VC stakeholders or acquiring parties.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="investor@venturefund.com"
                className="w-full bg-black border border-border rounded px-3 py-2 text-xs text-white placeholder-zinc-500 font-semibold focus:outline-none focus:border-zinc-700"
              />
              <Button variant="primary" className="w-full">
                Send Secure Invite
              </Button>
            </div>
          </Card>

          {/* Secure Audit Milestone Timeline */}
          <Card>
            <CardHeader>
              <h3 className="text-white font-bold text-xs">Audit Proof Timeline</h3>
            </CardHeader>
            <CardContent className="space-y-5">
              {timelineSteps.map((time, idx) => (
                <div key={idx} className="flex gap-3 text-xs items-start font-mono">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center border text-[8px] font-bold ${
                      time.done 
                        ? 'border-emerald-600 bg-emerald-950 text-emerald-400' 
                        : 'border-zinc-800 bg-zinc-900 text-zinc-500'
                    }`}>
                      {time.done ? '✓' : '●'}
                    </div>
                    {idx < 4 && <div className="w-0.5 h-10 bg-zinc-850 my-1" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h4 className={`font-bold ${time.done ? 'text-zinc-200' : 'text-zinc-500'}`}>{time.title}</h4>
                      <span className="text-[9px] text-zinc-500">{time.date}</span>
                    </div>
                    <p className="text-zinc-400 text-[10px] font-sans leading-normal">{time.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

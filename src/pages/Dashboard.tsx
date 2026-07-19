import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  ShieldCheck, 
  ArrowRight,
  Shield,
  FileCheck2,
  CheckCircle2,
  Lock,
  Trash2,
  Clock,
  Play,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { RadialProgressChart, AreaChart } from '../components/Charts';
import { useAudit } from '../hooks/useAudit';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { resetSession } = useAudit();
  
  const [completed, setCompleted] = useState<boolean>(false);
  const [activeRepo, setActiveRepo] = useState<any>(null);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [auditHistory, setAuditHistory] = useState<any[]>([]);

  useEffect(() => {
    const check = () => {
      const savedRepo = localStorage.getItem('ghost_active_repo');
      const isDone = localStorage.getItem('ghost_audit_completed') === 'true';
      setCompleted(isDone);
      if (savedRepo) {
        setActiveRepo(JSON.parse(savedRepo));
      } else {
        setActiveRepo(null);
      }

      const auditData = localStorage.getItem('ghost_active_audit');
      if (auditData) {
        setAuditResult(JSON.parse(auditData));
      } else {
        setAuditResult(null);
      }

      const histData = localStorage.getItem('ghost_audit_history');
      setAuditHistory(histData ? JSON.parse(histData) : []);
    };

    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  const handleNewAudit = () => {
    resetSession();
    navigate('/live-audit');
  };

  const deleteAudit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const historyStr = localStorage.getItem('ghost_audit_history');
    if (historyStr) {
      const historyArr = JSON.parse(historyStr);
      const filtered = historyArr.filter((h: any) => h.id !== id);
      localStorage.setItem('ghost_audit_history', JSON.stringify(filtered));
      
      // If deleted matches active target scope, clear it
      if (activeRepo && (activeRepo.hash === id || activeRepo.name === id)) {
        resetSession();
      } else {
        setAuditHistory(filtered);
      }
      
      // Sync layout
      window.dispatchEvent(new Event('storage'));
    }
  };

  const restoreSession = (item: any) => {
    localStorage.setItem('ghost_active_repo', JSON.stringify(item.repo));
    localStorage.setItem('ghost_active_audit', JSON.stringify(item.result));
    localStorage.setItem('ghost_audit_completed', 'true');
    if (item.proofId) {
      const proof = {
        proofId: item.proofId,
        midnightTxHash: item.midnightTxHash || '0xstub',
        anchoredAt: item.timestamp,
        proverVersion: 'Halo2-v1.0',
        repoName: item.repo.name
      };
      localStorage.setItem('ghost_verification_history', JSON.stringify([proof]));
    } else {
      localStorage.removeItem('ghost_verification_history');
    }
    window.dispatchEvent(new Event('storage'));
    navigate('/report');
  };

  const securityScore = auditResult?.securityScore !== undefined ? auditResult.securityScore : 100;

  const activities = [
    {
      time: 'Just now',
      event: completed && auditResult?.securityScore
        ? `ZKP validation proof ready for VC review (Security Score: ${securityScore}%)`
        : 'Confidential due diligence platform online',
      icon: ShieldCheck,
      color: completed ? 'text-emerald-500' : 'text-zinc-500'
    },
    {
      time: '1h ago',
      event: activeRepo 
        ? `Assessment loaded for ${activeRepo.name}`
        : 'Awaiting codebase uploader pipeline activity',
      icon: FileCheck2,
      color: 'text-primary'
    },
    {
      time: '3h ago',
      event: 'Selective access key generated for VC review panel',
      icon: Lock,
      color: 'text-zinc-400'
    }
  ];

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Repository Audits
          </h1>
          <p className="text-zinc-400 text-xs">
            Overview of software quality proofs, static analysis statuses, and selective disclosure access.
          </p>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleNewAudit}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          New Audit Session
        </Button>
      </div>

      {/* 1. Active target / Session Management Block */}
      <Card className="p-6 border-l-2 border-l-primary bg-[#0000FE]/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase font-mono tracking-wider">
                Active Audit Scope
              </span>
            </div>
            
            {activeRepo ? (
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white font-mono">{activeRepo.name}</h2>
                <p className="text-xs text-zinc-400">
                  {completed 
                    ? `Repository analysis successfully completed with a quality index of ${securityScore}%.` 
                    : `Repository scan is partially complete. You can resume this session below.`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-zinc-300">No active repository selected</h2>
                <p className="text-xs text-zinc-400">
                  Upload a ZIP archive codebase to start a new static compliance and ZK verification audit.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2.5 shrink-0 w-full md:w-auto">
            {activeRepo ? (
              <>
                {completed ? (
                  <Link to="/report" className="w-full md:w-auto">
                    <Button variant="primary" size="sm" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      View Report
                    </Button>
                  </Link>
                ) : (
                  <Link to="/live-audit" className="w-full md:w-auto">
                    <Button variant="primary" size="sm" className="w-full" leftIcon={<Play className="h-4 w-4" />}>
                      Resume Audit
                    </Button>
                  </Link>
                )}
                <Button variant="secondary" size="sm" onClick={handleNewAudit} className="w-full md:w-auto">
                  New Audit
                </Button>
              </>
            ) : (
              <Link to="/live-audit" className="w-full">
                <Button variant="primary" size="sm" className="w-full" leftIcon={<Plus className="h-4 w-4" />}>
                  Start New Audit
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card>

      {/* Grid: Charts & Summary (visible if activeRepo and completed) */}
      {completed && activeRepo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <h3 className="text-white font-bold text-xs">Security Quality Index History</h3>
            </CardHeader>
            <CardContent className="h-[170px] flex items-center justify-center p-4">
              <AreaChart 
                labels={['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
                points={[82, 85, 84, 91, 89, securityScore]}
              />
            </CardContent>
          </Card>

          <Card className="col-span-1 flex items-center justify-center p-3">
            <RadialProgressChart 
              percentage={securityScore} 
              size={120} 
              strokeWidth={8} 
              title="Global Security Rating"
              subtitle={securityScore >= 90 ? "AAA Quality" : (securityScore >= 80 ? "AA Quality" : "A Quality")}
            />
          </Card>
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Repositories & History */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-sm font-bold text-zinc-300 px-1">Audit History</h2>
          
          {auditHistory.length > 0 ? (
            <div className="space-y-4">
              {auditHistory.map((item) => (
                <Card 
                  key={item.id} 
                  variant="interactive" 
                  onClick={() => restoreSession(item)}
                  className="p-4 bg-[#121212] border-[#242424] hover:border-zinc-800 transition-all cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-bold text-sm font-mono">{item.repo.name}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono font-bold rounded border ${
                          item.proofId 
                            ? 'bg-emerald-950/20 text-emerald-450 border-emerald-900/40' 
                            : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                        }`}>
                          {item.proofId ? 'Midnight Verified' : 'Proof Not Generated'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-mono">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                        <span>•</span>
                        <span>{item.repo.filesCount} files</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-end border-t border-[#242424] sm:border-t-0 pt-3 sm:pt-0">
                      <div className="text-right sm:pr-2">
                        <span className="text-[9px] text-zinc-500 block font-bold font-mono">MATURITY</span>
                        <span className="text-sm font-bold text-white font-mono">{item.result.securityScore}%</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={(e) => { e.stopPropagation(); restoreSession(item); }}
                          leftIcon={<FileText className="h-3.5 w-3.5" />}
                        >
                          Report
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => deleteAudit(item.id, e)}
                          className="text-zinc-500 hover:text-red-400 hover:bg-red-950/20 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {item.proofId && (
                    <div className="mt-3 pt-2.5 border-t border-[#242424] flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-primary" />
                        Midnight Proof ID
                      </span>
                      <span className="font-semibold text-zinc-400 truncate max-w-sm">{item.proofId}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center flex flex-col items-center justify-center min-h-[180px] bg-black/20 border-[#242424] space-y-3">
              <span className="text-zinc-650 text-xs italic font-mono">
                No audits completed yet.
              </span>
              <p className="text-zinc-500 text-[11px] max-w-xs mx-auto">
                Upload your first repository codebase archive to begin technical due diligence.
              </p>
            </Card>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Checklist */}
          <Card>
            <CardHeader>
              <h3 className="text-white font-bold text-xs">M&A Audit Targets</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Secret Tokens Verification', checked: true },
                { label: 'Outdated Packages Check', checked: true },
                { label: 'Licensing Verification', checked: true },
                { label: 'ZKP Midnight anchors compiled', checked: true },
                { label: 'Architectural Layer verification', checked: true },
                { label: 'Investor disclosure scopes', checked: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  <div className="h-4 w-4 rounded flex items-center justify-center shrink-0 border border-emerald-600/50 bg-emerald-950/10 text-emerald-450">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-zinc-300">
                    {item.label}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activities */}
          <Card>
            <CardHeader>
              <h3 className="text-white font-bold text-xs">Timeline Activity</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#242424]">
                {activities.map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <div key={idx} className="p-4 flex gap-3 text-left">
                      <div className={`h-7 w-7 rounded bg-[#0A0A0A] border border-[#242424] flex items-center justify-center shrink-0 ${act.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-zinc-350 text-xs leading-normal font-semibold">
                          {act.event}
                        </p>
                        <span className="text-[9px] text-zinc-500 font-mono block">{act.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

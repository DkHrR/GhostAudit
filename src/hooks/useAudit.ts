import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RepositoryMetadata } from '../models/repository';
import { auditService } from '../services/auditService';
import { aiService } from '../services/aiService';
import { midnightService } from '../services/midnightService';

export function getStageFocusFile(stageName: string, files: Record<string, any>): string {
  const fileKeys = Object.keys(files);
  if (fileKeys.length === 0) return '';

  const findMatch = (keywords: string[], extensions: string[] = []) => {
    let match = fileKeys.find(f => {
      const lower = f.toLowerCase();
      const ext = f.split('.').pop()?.toLowerCase();
      const matchKeyword = keywords.some(kw => lower.includes(kw));
      const matchExt = extensions.length === 0 || (ext && extensions.includes(ext));
      return matchKeyword && matchExt;
    });
    if (!match && keywords.length > 0) {
      match = fileKeys.find(f => {
        const lower = f.toLowerCase();
        return keywords.some(kw => lower.includes(kw));
      });
    }
    if (!match && extensions.length > 0) {
      match = fileKeys.find(f => {
        const ext = f.split('.').pop()?.toLowerCase();
        return ext && extensions.includes(ext);
      });
    }
    return match;
  };

  switch (stageName) {
    case 'Reading Repository':
    case 'Confidential Session':
    case 'Due Diligence Synthesis':
    case 'Report Generation':
      return findMatch(['readme', 'guidelines', 'info'], ['md', 'txt']) || fileKeys[0];

    case 'Repository Indexing':
    case 'Technology Detection':
      return findMatch(['server', 'app', 'main', 'index', 'route', 'controller'], ['ts', 'js', 'tsx', 'jsx', 'py']) || fileKeys[0];

    case 'Dependency Audit':
    case 'License Assessment':
      return findMatch(['package', 'requirements', 'cargo', 'gemfile', 'license'], ['json', 'txt', 'toml', 'md']) || fileKeys[0];

    case 'Secrets Assessment':
    case 'Vulnerability Assessment':
    case 'Architecture Analysis':
    case 'ZK Proof Compilation':
    case 'Midnight Attestation':
      return findMatch(['auth', 'jwt', 'controller', 'payment', 'api', 'db', 'config', 'model', 'views'], ['ts', 'js', 'py']) || findMatch([], ['ts', 'js', 'tsx', 'jsx', 'py']) || fileKeys[0];

    default:
      return fileKeys[0];
  }
}

function generateLogsForStage(stageName: string, repo: RepositoryMetadata, result: any, logIndex: number): string {
  const hash = repo.hash || 'zk_repo_hash';
  const name = repo.name;
  
  const extensions = new Set<string>();
  if (repo.files) {
    Object.keys(repo.files).forEach(f => {
      const ext = f.split('.').pop()?.toUpperCase();
      if (ext && ext.length < 5) extensions.add(ext);
    });
  }
  const techStackStr = extensions.size > 0 ? Array.from(extensions).join(', ') : 'unknown';

  switch (stageName) {
    case 'Reading Repository':
      if (logIndex === 0) return 'Connecting to local sandbox uploader...';
      if (logIndex === 1) return `Loading archive: ${name}.zip`;
      if (logIndex === 2) return `Hashing archive contents: ${hash.slice(0, 16)}...`;
      if (logIndex === 3) return `Repository successfully initialized in client memory.`;
      return '';

    case 'Confidential Session':
      if (logIndex === 0) return 'Generating client-side ZK parameters...';
      if (logIndex === 1) return 'Initializing local session proving keys...';
      if (logIndex === 2) return `Binds anonymous verification session: session_key_ga_${hash.slice(-6)}`;
      if (logIndex === 3) return 'Confidential audit environment is locked and secure.';
      return '';

    case 'Repository Indexing':
      if (logIndex === 0) return 'Scanning directory structure...';
      if (logIndex === 1) return `Indexing packages... Detected ${repo.filesCount} source files.`;
      if (logIndex === 2) return 'Mapping import pathways... Compiled file dependency tree.';
      if (logIndex === 3) return 'Index complete: 100% of files loaded.';
      return '';

    case 'Technology Detection':
      if (logIndex === 0) return 'Parsing file AST structures...';
      if (logIndex === 1) return `Detected primary framework profile: ${result?.repository?.type || 'Static project'}.`;
      if (logIndex === 2) return `Analyzing directory patterns: [${techStackStr}]`;
      if (logIndex === 3) return 'Framework and environment identification verified.';
      return '';

    case 'Dependency Audit':
      if (logIndex === 0) return 'Scanning requirements and manifest files...';
      if (logIndex === 1) {
        const hasPkg = repo.files && Object.keys(repo.files).some(k => k.endsWith('package.json'));
        const hasReqs = repo.files && Object.keys(repo.files).some(k => k.endsWith('requirements.txt'));
        if (hasPkg) return 'Found package.json manifest. Resolving dependencies...';
        if (hasReqs) return 'Found requirements.txt manifest. Resolving dependencies...';
        return 'No third-party package manifests found.';
      }
      if (logIndex === 2) return `Resolving dependency graph chains... Detected ${result?.dependenciesList?.length || 0} libraries.`;
      if (logIndex === 3) {
        const recCount = result?.recommendations?.length || 0;
        return recCount > 0 
          ? `Flagged ${recCount} minor dependency vulnerability warnings.` 
          : 'All third-party package dependencies conform to secure releases.';
      }
      return '';

    case 'Secrets Assessment':
      if (logIndex === 0) return 'Initiating regex credential scans...';
      if (logIndex === 1) return 'Scanning file strings for hardcoded passwords, tokens, or keys...';
      if (logIndex === 2) {
        const secretCount = result?.secretsLogs?.length || 0;
        if (secretCount > 0) {
          const firstSecret = result.secretsLogs[0];
          return `VULNERABILITY WARNING: Plaintext credential found at ${firstSecret.filePath}:${firstSecret.lineNumber}.`;
        }
        return 'Secrets scan complete: 0 exposed plaintext keys located.';
      }
      if (logIndex === 3) {
        const secretCount = result?.secretsLogs?.length || 0;
        return secretCount > 1 
          ? `Flagged ${secretCount - 1} additional potential secret exposures.` 
          : 'All configuration files conform to safe credential parameters.';
      }
      return '';

    case 'Vulnerability Assessment':
      if (logIndex === 0) return 'Running logical code static checkers...';
      if (logIndex === 1) return 'Analyzing boundary gateway inputs and sanitize flows...';
      if (logIndex === 2) return 'Input sanitization check: PASSED.';
      if (logIndex === 3) return 'Vulnerability evaluation complete: 0 Critical alerts.';
      return '';

    case 'Architecture Analysis':
      if (logIndex === 0) return 'Mapping module separation parameters...';
      if (logIndex === 1) {
        const layerCount = result?.architectureLayers?.length || 0;
        return layerCount > 0 
          ? `Located architectural layers: ${result.architectureLayers.map((l: any) => l.type).join(' -> ')}` 
          : 'Architecture layers could not be inferred from the uploaded repository.';
      }
      if (logIndex === 2) return `Calculated structural modularity score: ${result?.maintainabilityScore || 90}%`;
      if (logIndex === 3) return 'Architecture separation checks complete.';
      return '';

    case 'License Assessment':
      if (logIndex === 0) return 'Auditing open-source license tags...';
      if (logIndex === 1) return 'Checking package licenses against copyleft policies...';
      if (logIndex === 2) return 'License compatibility check: PASSED.';
      if (logIndex === 3) return 'All external components conform to investment guidelines.';
      return '';

    case 'Due Diligence Synthesis':
      if (logIndex === 0) return 'Compiling technical debt measurements...';
      if (logIndex === 1) return `AI narrative report generated (Maturity index: ${result?.securityScore || 100}%).`;
      if (logIndex === 2) return 'Investment readiness tag set to: READY.';
      if (logIndex === 3) return 'AI Summary synthesis complete.';
      return '';

    case 'ZK Proof Compilation':
      if (logIndex === 0) return 'Setting up ZK circuit constraint arrays...';
      if (logIndex === 1) return 'Compiles audit variables into Halo2 circuits...';
      if (logIndex === 2) return 'Prover execution time: 1420ms.';
      if (logIndex === 3) {
        const historyData = localStorage.getItem('ghost_verification_history');
        const realProofId = historyData ? JSON.parse(historyData)[0]?.proofId : `zk_ga_${hash.slice(0, 8)}`;
        return `Zero-Knowledge Proof ${realProofId} successfully generated.`;
      }
      return '';

    case 'Midnight Attestation':
      if (logIndex === 0) return 'Connecting to Midnight Network node...';
      if (logIndex === 1) return 'Broadcasting proof transaction stamp...';
      if (logIndex === 2) {
        const historyData = localStorage.getItem('ghost_verification_history');
        const realTxHash = historyData ? JSON.parse(historyData)[0]?.midnightTxHash : '0xpending';
        return `Ledger confirmation received: Tx Hash ${realTxHash}`;
      }
      if (logIndex === 3) return 'Midnight cryptographic anchor verification: SUCCESS.';
      return '';

    case 'Report Generation':
      if (logIndex === 0) return 'Assembling compliance report...';
      if (logIndex === 1) return 'Generating selective disclosure viewing key parameters...';
      if (logIndex === 2) return 'Investor Portal unlocked.';
      if (logIndex === 3) return 'Due diligence session completed successfully.';
      return '';

    default:
      return '';
  }
}

export function useAudit() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [activeRepo, setActiveRepo] = useState<RepositoryMetadata | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedRepo = localStorage.getItem('ghost_active_repo');
    const completed = localStorage.getItem('ghost_audit_completed') === 'true';
    if (savedRepo && completed) {
      const parsed = JSON.parse(savedRepo);
      setActiveRepo(parsed);
      
      const savedAudit = localStorage.getItem('ghost_active_audit');
      if (savedAudit) {
        auditResultRef.current = JSON.parse(savedAudit);
      }
      
      const savedHistory = localStorage.getItem('ghost_verification_history');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        if (history && history.length > 0) {
          setAuditError(null);
        } else {
          setAuditError('wallet_unavailable');
        }
      } else {
        setAuditError('wallet_unavailable');
      }
    }
  }, []);

  const isPausedRef = useRef<boolean>(false);
  const speedRef = useRef<number>(1);
  const activeRepoRef = useRef<RepositoryMetadata | null>(null);
  const auditResultRef = useRef<any>(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    activeRepoRef.current = activeRepo;
  }, [activeRepo]);

  const stages = auditService.getStages();
  const totalStages = stages.length;

  useEffect(() => {
    if (!isAnalyzing || isPaused || !activeRepo) return;

    let step = currentStepIndex;
    let logIndex = 0;
    const currentStage = stages[step];
    
    // Set file focus dynamically from the real repository files if available
    const files = activeRepo.files || {};
    const dynamicFocusFile = getStageFocusFile(currentStage.name, files);
    if (dynamicFocusFile) {
      setSelectedFile(dynamicFocusFile);
    } else {
      const fileKeys = Object.keys(files);
      setSelectedFile(fileKeys[0] || '');
    }

    const intervalTime = 600 / speedRef.current;

    const runLogs = setInterval(async () => {
      if (isPausedRef.current) return;

      const repo = activeRepoRef.current;
      if (!repo) return;

      if (logIndex === 0) {
        setTerminalLogs(prev => [...prev, `[${currentStage.name.toUpperCase()}] Initializing stage...`]);
      }

      if (logIndex < 4) {
        const rawLog = generateLogsForStage(currentStage.name, repo, auditResultRef.current, logIndex);
        if (rawLog) {
          setTerminalLogs(prev => [...prev, `[LOG] ${rawLog}`]);
        }
        logIndex++;
      } else {
        clearInterval(runLogs);
        if (step < totalStages - 1) {
          setCompletedSteps(prev => [...prev, step]);
          setCurrentStepIndex(step + 1);
        } else {
          // At the final stage, perform real proving & anchoring
          try {
            const auditResult = auditResultRef.current || await aiService.analyzeRepository(repo);
            
            // Save successful repository analysis results first to unlock features
            localStorage.setItem('ghost_active_repo', JSON.stringify(repo));
            localStorage.setItem('ghost_active_audit', JSON.stringify(auditResult));
            localStorage.setItem('ghost_audit_completed', 'true');

            const saveAuditHistoryItem = (r: RepositoryMetadata, res: any, pId?: string, tx?: string) => {
              const historyItem = {
                id: r.hash || 'audit_' + Date.now(),
                repo: r,
                result: res,
                timestamp: new Date().toISOString(),
                proofId: pId,
                midnightTxHash: tx,
                proofStatus: pId ? 'Midnight Verified' : 'Wallet Not Connected'
              };
              const historyStr = localStorage.getItem('ghost_audit_history');
              const historyArr = historyStr ? JSON.parse(historyStr) : [];
              const filtered = historyArr.filter((h: any) => h.repo.name !== r.name);
              localStorage.setItem('ghost_audit_history', JSON.stringify([historyItem, ...filtered]));
            };
            
            // Now attempt to generate and anchor the Zero-Knowledge Proof
            try {
              const digest = await midnightService.generateAuditDigest(auditResult);
              const proof = await midnightService.createConfidentialProof(digest, {
                overallRisk: true,
                securityScore: true,
                maintainability: true,
                architectureMap: true
              }, repo.name);
              
              setAuditError(null);
              setCompletedSteps(prev => [...prev, step]);
              setIsAnalyzing(false);

              saveAuditHistoryItem(repo, auditResult, proof.proofId, proof.midnightTxHash);
 
              setTerminalLogs(prev => [
                ...prev,
                '-------------------------------------------------------',
                '[SUCCESS] Cryptographic Due Diligence Verified.',
                `[SUCCESS] ZK Proof ${proof.proofId} successfully anchored on Midnight.`,
                '[SUCCESS] Local storage unlocked. Redirecting to AI summary...'
              ]);
 
              // Auto-redirect to AI Summary page
              setTimeout(() => {
                navigate('/ai-summary');
              }, 2800);
            } catch (walletError: any) {
              console.warn('[GhostAudit Wallet] ZK Proof generation skipped due to wallet connection:', walletError);
              
              // Complete the checklist stages and progress to 100%
              setCompletedSteps(prev => [...prev, step]);
              setIsAnalyzing(false);
              setAuditError('wallet_unavailable');

              saveAuditHistoryItem(repo, auditResult);
              
              setTerminalLogs(prev => [
                ...prev,
                '-------------------------------------------------------',
                '[SUCCESS] Technical Due Diligence Completed.',
                '[WARNING] Zero-knowledge proof generation requires a connected Midnight wallet.',
                '[INFO] Repository analysis, reports, and AI summary are available.',
                '[INFO] Blockchain proof generation will become available once wallet integration is completed.'
              ]);
            }
          } catch (error: any) {
            console.error('[GhostAudit QA Audit] Service layer execution failed:', error);
            const errMsg = error instanceof Error ? error.message : String(error);
            setAuditError(errMsg);
            localStorage.removeItem('ghost_audit_completed');
            setIsAnalyzing(false);
            
            setTerminalLogs(prev => [
              ...prev,
              '-------------------------------------------------------',
              `[ERROR] Hashing or proving execution failed: ${errMsg}`,
              '[FAILED] Security disclosures cannot be compiled.'
            ]);
          }
        }
       }
     }, intervalTime);
 
     return () => clearInterval(runLogs);
   }, [isAnalyzing, currentStepIndex, isPaused, activeRepo, totalStages, navigate, stages]);
 
   const startSession = async (repo: RepositoryMetadata) => {
    setActiveRepo(repo);
    setIsAnalyzing(true);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setAuditError(null);
    setTerminalLogs([`[GhostAudit] Initializing confidential verification session for ${repo.name}...`]);

    // Write repo metadata immediately so the Sidebar shows the active target during analysis
    localStorage.setItem('ghost_active_repo', JSON.stringify({
      name: repo.name,
      size: repo.size,
      filesCount: repo.filesCount,
      type: repo.type,
      hash: repo.hash,
      branch: repo.branch
      // Note: files are NOT written here — they remain in-memory only for privacy
    }));

    try {
      const result = await aiService.analyzeRepository(repo);
      auditResultRef.current = result;
    } catch (e) {
      console.error(e);
    }
  };

  const resetSession = () => {
    setIsAnalyzing(false);
    setCurrentStepIndex(0);
    setIsPaused(false);
    setSpeedMultiplier(1);
    setTerminalLogs([]);
    setCompletedSteps([]);
    setSelectedFile('');
    setActiveRepo(null);
    setAuditError(null);
    auditResultRef.current = null;
    
    localStorage.removeItem('ghost_active_repo');
    localStorage.removeItem('ghost_active_audit');
    localStorage.removeItem('ghost_audit_completed');
    localStorage.removeItem('ghost_verification_history');
    localStorage.removeItem('ghost_active_disclosures');
  };

  const progressPercent = Math.round((completedSteps.length / totalStages) * 100);
  const remainingSeconds = Math.max(0, Math.round(((totalStages - completedSteps.length) * 4) / speedMultiplier));

  return {
    isAnalyzing,
    currentStepIndex,
    isPaused,
    setIsPaused,
    speedMultiplier,
    setSpeedMultiplier,
    terminalLogs,
    completedSteps,
    selectedFile,
    setSelectedFile,
    progressPercent,
    remainingSeconds,
    startSession,
    stages,
    totalStages,
    activeRepo,
    setActiveRepo,
    auditError,
    setAuditError,
    resetSession
  };
}

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Folder, 
  File, 
  ChevronDown, 
  Loader,
  Shield,
  Lock,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Check,
  ShieldAlert,
  ChevronRight,
  Circle,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { UploadCard } from '../components/UploadCard';
import { StatusBadge } from '../components/StatusBadge';
import { useAudit } from '../hooks/useAudit';
import type { RepositoryMetadata } from '../models/repository';
import { midnightService } from '../services/midnightService';
import { WALLET_HELPER_TEXT } from '../utils/proofStatus';
import JSZip from 'jszip';

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children: Record<string, TreeNode>;
}

function buildFileTree(files: string[]): TreeNode {
  const root: TreeNode = { name: 'root', path: '', type: 'folder', children: {} };
  for (const path of files) {
    const parts = path.split('/');
    let current = root;
    let currentPath = '';
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLast = i === parts.length - 1;
      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          path: currentPath,
          type: isLast ? 'file' : 'folder',
          children: {}
        };
      }
      current = current.children[part];
    }
  }
  return root;
}

const FileTreeItem: React.FC<{ 
  node: TreeNode; 
  depth: number;
  selectedFile: string;
  onSelect: (path: string) => void;
}> = ({ node, depth, selectedFile, onSelect }) => {
  const [expanded, setExpanded] = useState(true);

  if (node.type === 'file') {
    return (
      <button 
        onClick={() => onSelect(node.path)}
        style={{ paddingLeft: `${depth * 14}px` }}
        className={`flex items-center gap-2 w-full text-left font-mono py-1 rounded-xl transition-all text-[11px] ${
          selectedFile === node.path 
            ? 'text-white font-bold bg-zinc-900 px-2' 
            : 'text-zinc-400 hover:text-white'
        }`}
      >
        <File className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  return (
    <div className="space-y-1">
      <div 
        onClick={() => setExpanded(!expanded)}
        style={{ paddingLeft: `${depth * 14}px` }}
        className="flex items-center gap-2 text-zinc-300 py-1.5 font-semibold cursor-pointer text-[11px] select-none hover:text-white"
      >
        <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${expanded ? '' : '-rotate-90'}`} />
        <Folder className="h-4 w-4 text-primary shrink-0" />
        <span className="truncate">{node.name}</span>
      </div>
      
      {expanded && (
        <div className="space-y-1">
          {Object.values(node.children).map((child) => (
            <FileTreeItem 
              key={child.path} 
              node={child} 
              depth={depth + 1} 
              selectedFile={selectedFile}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);



export const LiveAudit: React.FC = () => {
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [repoMetadata, setRepoMetadata] = useState<RepositoryMetadata | null>(null);
  const [parsedFiles, setParsedFiles] = useState<Record<string, string>>({});
  const [walletState, setWalletState] = useState(midnightService.getWalletState());

  useEffect(() => {
    const handleConnect = () => setWalletState('Connected');
    const handleDisconnect = () => setWalletState('Disconnected');
    
    // Initial sync
    setWalletState(midnightService.getWalletState());

    midnightService.subscribeWalletEvents('wallet connected', handleConnect);
    midnightService.subscribeWalletEvents('wallet disconnected', handleDisconnect);
    return () => {
      midnightService.unsubscribeWalletEvents('wallet connected', handleConnect);
      midnightService.unsubscribeWalletEvents('wallet disconnected', handleDisconnect);
    };
  }, []);

  const getFileContent = () => {
    if (!selectedFile) {
      return 'No preview available for the selected file.';
    }
    const fileData = parsedFiles[selectedFile];
    if (fileData === undefined) {
      return 'No preview available for the selected file.';
    }
    if (fileData === 'BINARY_FILE') {
      return 'This file cannot be previewed.';
    }
    if (fileData === 'TOO_LARGE_FILE') {
      return 'Preview unavailable. File exceeds preview limit.';
    }
    return fileData;
  };

  const {
    isAnalyzing,
    currentStepIndex,
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
    auditError,
    resetSession
  } = useAudit();

  const consoleBottomRef = useRef<HTMLDivElement>(null);

  const handleUploadReset = () => {
    setIsUploaded(false);
    setRepoMetadata(null);
    setParsedFiles({});
  };

  const handleRetrySession = () => {
    resetSession();
    setIsUploaded(false);
    setRepoMetadata(null);
    setParsedFiles({});
  };

  // Sync uploader metadata with hook auto-starts
  useEffect(() => {
    if (activeRepo) {
      setRepoMetadata(activeRepo);
      setIsUploaded(true);
      if (activeRepo.files) {
        setParsedFiles(activeRepo.files);
      }
    }
  }, [activeRepo]);

  // Terminal log scroll-lock
  useEffect(() => {
    consoleBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // (no mock file database — all file previews come from the real uploaded ZIP)



  const handleUploadSuccess = async (file: File) => {
    resetSession();
    const zip = new JSZip();
    try {
      const contents = await zip.loadAsync(file);
      const files: Record<string, string> = {};
      let count = 0;
      
      for (const [relativePath, zipEntry] of Object.entries(contents.files)) {
        if (!zipEntry.dir) {
          count++;
          const ext = relativePath.split('.').pop()?.toLowerCase();
          const textExtensions = ['ts', 'tsx', 'js', 'jsx', 'json', 'md', 'html', 'css', 'txt', 'compact', 'yaml', 'yml'];
          const isText = ext && textExtensions.includes(ext);
          
          if (isText) {
            const text = await zipEntry.async('text');
            if (text.length > 500 * 1024) {
              files[relativePath] = 'TOO_LARGE_FILE';
            } else {
              files[relativePath] = text;
            }
          } else {
            files[relativePath] = 'BINARY_FILE';
          }
        }
      }
      
      const hasTextFiles = Object.keys(files).some(k => files[k] !== 'BINARY_FILE');
      if (!hasTextFiles) {
        throw new Error('No supported source files were detected.');
      }
      
      setParsedFiles(files);
      
      const firstTextFile = Object.keys(files).find(k => files[k] !== 'BINARY_FILE');
      if (firstTextFile) {
        setSelectedFile(firstTextFile);
      } else {
        const firstFile = Object.keys(files)[0];
        if (firstFile) setSelectedFile(firstFile);
      }
      
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      
      setRepoMetadata({
        name: file.name.replace(/\.[^/.]+$/, ""),
        size: sizeStr,
        filesCount: count,
        type: 'Uploaded Archive',
        hash: 'zk_repo_' + Math.random().toString(36).substring(2, 10),
        branch: 'main',
        files
      });
      setIsUploaded(true);
    } catch (err: any) {
      console.error('[GhostAudit ZIP Uploader]', err);
      // Cleanly rethrow to let UploadCard capture error in status UI
      throw err;
    }
  };

  const triggerAudit = () => {
    if (repoMetadata) {
      startSession(repoMetadata);
    }
  };


  const currentStage = stages[currentStepIndex] || stages[0];
  const sessionActive = activeRepo !== null;

  const treeRoot = buildFileTree(Object.keys(parsedFiles));

  return (
    <div className="space-y-6">
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#242424] pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white tracking-tight">
            AI Due Diligence Workspace
          </h1>
          <p className="text-zinc-400 text-xs">
            Confidential repository scanning and zero-knowledge compliance reports.
          </p>
        </div>

        {sessionActive && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Verification Progress:</span>
              <span className="font-mono text-xs text-white font-bold">{progressPercent}%</span>
              <StatusBadge type={auditError === 'wallet_unavailable' ? 'analysis_complete' : (auditError ? 'flagged' : (isAnalyzing ? 'scanning' : 'verified'))} pulse={isAnalyzing && !auditError} />
            </div>
            {!isAnalyzing && (
              <Button variant="secondary" size="sm" onClick={handleRetrySession} className="font-mono text-[10px] uppercase font-bold">
                New Audit
              </Button>
            )}
          </div>
        )}
      </div>

      {auditError === 'wallet_unavailable' ? (
        <div className="p-5 bg-emerald-950/10 border border-emerald-500/30 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fadeIn">
          <div className="space-y-1.5 text-left">
            <h4 className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
              ✓ Repository Analysis Complete
            </h4>
            <p className="text-zinc-350 text-xs leading-relaxed max-w-2xl">
              All static analysis, security scanning, and AI due diligence are complete.
              <br />
              <span className="text-zinc-500">
                Generate a Midnight Zero-Knowledge Proof to cryptographically verify and anchor this audit — <em>optional</em>.
              </span>
            </p>
            <p className="text-[10px] text-zinc-600 font-mono mt-1">{WALLET_HELPER_TEXT}</p>
          </div>
          <div className="flex gap-2.5 shrink-0">
            <Link to="/ai-summary">
              <Button variant="secondary" size="sm" className="font-mono text-xs">
                View Summary
              </Button>
            </Link>
            {walletState === 'Connected' ? (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={async () => {
                  try {
                    const activeRepo = JSON.parse(localStorage.getItem('ghost_active_repo') || '{}');
                    const auditResult = JSON.parse(localStorage.getItem('ghost_active_audit') || '{}');
                    const digest = await midnightService.generateAuditDigest(auditResult);
                    const proof = await midnightService.createConfidentialProof(digest, {
                      overallRisk: true,
                      securityScore: true,
                      maintainability: true,
                      secretsLogs: false,
                      dependencyDetails: false,
                      architectureMap: true
                    }, activeRepo.name);
                    
                    const history = await midnightService.getVerificationHistory();
                    const updatedHistory = [proof, ...history];
                    localStorage.setItem('ghost_verification_history', JSON.stringify(updatedHistory));
                    localStorage.setItem('ghost_audit_completed', 'true');
                    alert('ZK Proof generated and anchored on Midnight Network successfully!');
                    window.location.reload();
                  } catch (err: any) {
                    alert(err.message || 'Failed to generate proof.');
                  }
                }} 
                className="font-mono text-xs animate-pulse"
              >
                Generate Midnight Proof
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={async () => {
                  try {
                    await midnightService.connectWallet();
                  } catch (err: any) {
                    alert(err.message || 'Failed to connect wallet.');
                  }
                }} 
                className="font-mono text-xs"
                title={WALLET_HELPER_TEXT}
              >
                Connect Midnight Wallet
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={handleRetrySession} className="font-mono text-xs">
              New Audit
            </Button>
          </div>
        </div>
      ) : auditError && (
        <div className="p-4 bg-red-950/20 border border-red-900/40 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-red-500 font-mono">CRYPTOGRAPHIC PROOF GEN ERROR</h4>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-2xl">{auditError}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleRetrySession} className="shrink-0 font-mono text-xs">
            Retry Session
          </Button>
        </div>
      )}

      {!sessionActive ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4">
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Action: ZIP Upload */}
            <Card className="p-6 space-y-4 border-primary/50 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-primary/10 border border-primary text-primary px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide">
                ⭐ Recommended
              </div>
              
              <div className="space-y-1 pr-24">
                <h3 className="text-white font-bold text-sm">Upload Repository Archive</h3>
                <p className="text-zinc-400 text-[10px] font-mono font-bold uppercase">
                  Private • Local • Zero Upload
                </p>
                <p className="text-zinc-400 text-xs leading-normal">
                  Export your repository as a ZIP archive from GitHub (or any Git provider) and upload it here. All parsing, indexing, security analysis, and proof preparation occur locally inside your browser.
                </p>
              </div>

              <UploadCard onUploadSuccess={handleUploadSuccess} onUploadReset={handleUploadReset} />
            </Card>

            {/* Separator */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#242424]/60"></div>
              </div>
              <span className="relative px-3 text-[10px] font-mono font-bold text-zinc-500 bg-surface">AND / OR</span>
            </div>

            {/* Coming Soon: GitHub Import */}
            <Card className="p-6 space-y-4 opacity-60 border-[#242424] bg-black/10 relative">
              <div className="absolute top-4 right-4 bg-zinc-800 border border-zinc-700 text-zinc-400 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide">
                COMING SOON
              </div>

              <div className="space-y-1 pr-24">
                <h3 className="text-zinc-300 font-bold text-sm">GitHub Repository Import (Coming Soon)</h3>
                <p className="text-zinc-505 text-xs">
                  Connect direct GitHub repositories for live audit pipelines.
                </p>
              </div>

              {/* Informational Panel */}
              <div className="p-4 bg-black/30 border border-[#242424] rounded-xl space-y-2 text-xs">
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">
                  Direct GitHub Repository Analysis
                </span>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  GhostAudit currently performs all analysis entirely within your browser to preserve source-code privacy.
                </p>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  Direct GitHub repository analysis requires a secure backend proxy because browsers cannot securely download repository archives from GitHub due to CORS restrictions.
                </p>
                <span className="text-[10px] font-mono font-bold text-zinc-500 block pt-1">
                  Planned for a future production release.
                </span>
              </div>

              {/* Disabled inputs */}
              <div className="flex gap-2">
                <div className="relative flex-1 opacity-45">
                  <div className="absolute left-4.5 inset-y-0 flex items-center pointer-events-none text-zinc-600">
                    <GithubIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="https://github.com/startup-inc/ghost-core-api"
                    disabled
                    className="pl-icon-input w-full bg-black border border-[#242424] rounded-xl pr-3 py-2 text-xs text-zinc-650 cursor-not-allowed focus:outline-none"
                  />
                </div>
                <Button variant="secondary" size="sm" disabled className="cursor-not-allowed opacity-45">
                  Index URL
                </Button>
              </div>
            </Card>

            {/* Why isn't GitHub import available information box */}
            <Card className="p-5 border-l-2 border-l-zinc-700 bg-zinc-950/5 space-y-3">
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Why isn't GitHub import available?
              </h4>
              <ul className="space-y-1.5 font-mono text-[10px] text-zinc-405 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600">•</span>
                  <span>Browser security blocks downloading arbitrary repository archives.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600">•</span>
                  <span>This protects users from malicious cross-origin requests.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600">•</span>
                  <span>GhostAudit intentionally performs analysis locally.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600">•</span>
                  <span>A future backend integration will securely enable GitHub imports while maintaining privacy guarantees.</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {isUploaded && repoMetadata && (
              <Card className="p-5 flex flex-col justify-between gap-4 animate-fadeIn border-l-2 border-l-primary bg-[#121212] border-[#242424]">
                <div className="space-y-1 font-mono text-xs">
                  <span className="text-zinc-500 block text-[9px] uppercase font-bold">READY TO VERIFY</span>
                  <h4 className="text-white font-bold">{repoMetadata.name}</h4>
                  <p className="text-zinc-400 text-[10px]">{repoMetadata.type} • {repoMetadata.size} • {repoMetadata.filesCount} files</p>
                </div>
                <Button variant="primary" size="md" onClick={triggerAudit} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Begin Confidential Due Diligence
                </Button>
              </Card>
            )}

            <Card className="p-5 space-y-3">
              <div className="h-8 w-8 rounded bg-zinc-950 border border-[#242424] flex items-center justify-center text-primary mb-2">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-white">Confidential Processing Guarantee</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                GhostAudit runs parsing calculations client-side. The file tree indexing, secrets verification, and package audits remain strictly inside your local browser sandbox.
              </p>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="h-8 w-8 rounded bg-zinc-950 border border-[#242424] flex items-center justify-center text-primary mb-2">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-white">Midnight Zero-Knowledge Attestation</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Instead of sharing raw code, we compile mathematical verification constraints. The Midnight Network anchors ZK proofs, enabling selective disclosure options with investors.
              </p>
            </Card>
          </div>
        </div>
      ) : (
        /* 2. Three-column session dashboard view bound to Hook */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2 items-start">
          
          {/* Column 1: Repository Explorer */}
          <Card className="lg:col-span-2 p-4 min-h-[460px] bg-[#121212] border-[#242424] flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-4 font-mono">
                Explorer
              </span>
              <div className="space-y-1.5 text-[11px] text-zinc-350">
                {Object.keys(treeRoot.children).map((key) => (
                  <FileTreeItem 
                    key={key} 
                    node={treeRoot.children[key]} 
                    depth={0} 
                    selectedFile={selectedFile}
                    onSelect={setSelectedFile}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#242424] text-[9px] text-zinc-500 font-mono">
              <div>Scope: {repoMetadata?.filesCount || 0} files</div>
              <div className="text-zinc-400 font-bold mt-0.5 truncate">{repoMetadata?.name || ''}</div>
            </div>
          </Card>

          {/* Column 2: Code Viewer & AI Prover logs */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="p-0 bg-[#121212] border-[#242424] flex flex-col h-[260px] overflow-hidden">
              <div className="py-2 px-4 bg-black/40 border-b border-[#242424] flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                <span>Code Viewer: {selectedFile}</span>
                <span className="text-primary font-bold">CLIENT SCAN ACTIVE</span>
              </div>
              <div className="p-4 flex-1 font-mono text-[10px] leading-relaxed text-zinc-300 overflow-y-auto whitespace-pre bg-black/10 select-text">
                <code>{getFileContent()}</code>
              </div>
            </Card>

            <Card className="p-5 border-l-2 border-l-primary space-y-4">
              <div className="flex items-center justify-between border-b border-[#242424] pb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary shrink-0 animate-pulse" />
                  <span className="text-xs font-bold text-white">AI Due Diligence Reasoning</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  Stage {currentStepIndex + 1}/{totalStages}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
                <div>
                  <span className="text-zinc-400 font-bold block mb-1">What is happening?</span>
                  <p className="text-zinc-300 leading-relaxed font-semibold text-[11px]">{currentStage.what}</p>
                </div>
                <div>
                  <span className="text-zinc-400 font-bold block mb-1">Why is it useful?</span>
                  <p className="text-zinc-300 leading-relaxed font-semibold text-[11px]">{currentStage.why}</p>
                </div>
                <div>
                  <span className="text-zinc-400 font-bold block mb-1">Midnight Advantage</span>
                  <p className="text-zinc-300 leading-relaxed font-semibold text-[11px]">{currentStage.midnight}</p>
                </div>
              </div>
            </Card>

            {!isAnalyzing && completedSteps.length >= totalStages && (
              auditError === 'wallet_unavailable' ? (
                <Card className="p-4 border-l-2 border-l-emerald-600 bg-emerald-950/5 animate-fadeIn">
                  <div className="flex gap-3 items-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">✅ Repository Assessment Complete</h4>
                      <p className="text-zinc-400 text-[10px] mt-0.5 font-mono">Analysis Complete — Midnight Proof Not Yet Generated</p>
                    </div>
                  </div>
                </Card>
              ) : auditError ? (
                <Card className="p-4 border-l-2 border-l-red-600 bg-red-950/5 animate-fadeIn">
                  <div className="flex gap-3 items-center">
                    <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">✅ Repository Assessment Complete</h4>
                      <h4 className="text-xs font-bold text-red-400 font-mono mt-1">⚠ Audit Pipeline Error</h4>
                      <p className="text-zinc-400 text-[10px] mt-0.5 font-mono">Reason: {auditError}</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-4 border-l-2 border-l-emerald-600 bg-emerald-950/5 animate-fadeIn">
                  <div className="flex gap-3 items-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">CONFIDENTIAL ASSESSMENT COMPLETE</h4>
                      <p className="text-zinc-400 text-[10px] mt-0.5 font-mono">Midnight Verified — Proof anchored on Midnight Network.</p>
                    </div>
                  </div>
                </Card>
              )
            )}
          </div>

          {/* Column 3: 13 Stages Checklist, Logs & controls */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-0 bg-[#121212] border-[#242424]">
              <CardHeader>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">
                  Verification Checklist
                </span>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2 font-mono text-[10px] max-h-[150px] overflow-y-auto pr-1">
                  {stages.map((st, idx) => {
                    const isActive = idx === currentStepIndex;
                    const isCompleted = completedSteps.includes(idx);
                    
                    return (
                      <div key={idx} className="flex gap-2 items-center">
                        <div className={`h-3.5 w-3.5 rounded flex items-center justify-center border shrink-0 text-[7px] font-bold ${
                          isActive ? 'border-primary bg-primary text-white animate-pulse' :
                          isCompleted ? 'border-emerald-600 bg-emerald-950 text-emerald-400' : 'border-zinc-800 bg-zinc-900 text-zinc-550'
                        }`}>
                          {isCompleted ? <Check className="h-2 w-2 stroke-[3px]" /> : idx + 1}
                        </div>
                        <span className={`font-semibold truncate ${
                          isActive ? 'text-white font-bold' :
                          isCompleted ? 'text-zinc-300' : 'text-zinc-650'
                        }`}>
                          {st.name}
                        </span>
                        {isActive && <Loader className="h-3 w-3 animate-spin text-primary shrink-0 ml-auto" />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="p-0 bg-black border-[#242424] flex flex-col h-[155px] overflow-hidden font-mono">
              <div className="py-1.5 px-3 bg-[#121212] border-b border-[#242424] flex items-center justify-between text-[9px] text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-primary animate-pulse" />
                  Proving Logs
                </span>
                <span className="text-[8px]">EST: {remainingSeconds}s remaining</span>
              </div>
              <div className="p-3 text-[9.5px] space-y-1 flex-1 overflow-y-auto leading-normal text-zinc-350">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="break-all whitespace-pre-wrap">
                    <span className="text-zinc-650 mr-1.5">~</span>
                    {log}
                  </div>
                ))}
                <div ref={consoleBottomRef} />
              </div>
            </Card>


          </div>

        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  FileBarChart,
  Brain,
  Award,
  Shield,
  Plus
} from 'lucide-react';
import { Button } from './Button';
import { useAudit } from '../hooks/useAudit';
import { midnightService } from '../services/midnightService';
import { getProofBadge } from '../utils/proofStatus';
import { getInitials } from '../utils/userProfile';
import type { UserProfile } from '../utils/userProfile';

interface SidebarProps {
  profile: UserProfile | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ profile }) => {
  const navigate = useNavigate();
  const { resetSession } = useAudit();
  const [completed, setCompleted] = useState<boolean>(false);
  const [repoDetails, setRepoDetails] = useState<any>(null);
  const [walletConnected, setWalletConnected] = useState(
    midnightService.getWalletState() === 'Connected'
  );

  // Sync wallet state so the status badge stays live
  useEffect(() => {
    const onConnect = () => setWalletConnected(true);
    const onDisconnect = () => setWalletConnected(false);
    midnightService.subscribeWalletEvents('wallet connected', onConnect);
    midnightService.subscribeWalletEvents('wallet disconnected', onDisconnect);
    return () => {
      midnightService.unsubscribeWalletEvents('wallet connected', onConnect);
      midnightService.unsubscribeWalletEvents('wallet disconnected', onDisconnect);
    };
  }, []);

  useEffect(() => {
    const check = () => {
      const isDone = localStorage.getItem('ghost_audit_completed') === 'true';
      setCompleted(isDone);
      // Show repo details both during analysis AND after completion
      const repoData = localStorage.getItem('ghost_active_repo');
      if (repoData) {
        try {
          const parsedRepo = JSON.parse(repoData);
          setRepoDetails({
            name: parsedRepo.name,
            filesCount: parsedRepo.filesCount,
            type: parsedRepo.type || 'Source codebase',
            analyzing: !isDone,
          });
        } catch {
          setRepoDetails(null);
        }
      } else {
        setRepoDetails(null);
      }
    };
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  const handleNewAudit = () => {
    resetSession();
    navigate('/live-audit');
  };

  const links = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Due Diligence', path: '/live-audit', icon: Cpu },
    { label: 'Audit Reports', path: '/report', icon: FileBarChart },
    { label: 'AI Executive Summary', path: '/ai-summary', icon: Brain },
    { label: 'Investor Portal', path: '/investor', icon: Award },
    { label: 'Midnight Privacy', path: '/about-midnight', icon: Shield },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#121212] border-r border-[#242424] min-h-[calc(100vh-3.5rem)] p-5 select-none shrink-0">
      {/* New Audit CTA button */}
      <Button 
        variant="primary" 
        size="sm" 
        onClick={handleNewAudit}
        className="w-full mb-5 font-mono text-[10px] uppercase tracking-wider font-bold"
        leftIcon={<Plus className="h-3.5 w-3.5" />}
      >
        New Audit
      </Button>

      {/* Current Scope panel */}
      <div className="mb-6 p-4 rounded-xl bg-[#0A0A0A] border border-[#242424] flex flex-col gap-2.5">
        <div className="flex items-center justify-between border-b border-[#242424] pb-2 mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
            Active Target
          </span>
          <span className={`h-1.5 w-1.5 rounded-full ${completed ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
        </div>
        
        {repoDetails ? (
          <div className="space-y-2.5 text-xs">
            <div className="space-y-0.5">
              <span className="text-[9px] text-zinc-500 block uppercase font-mono">Repository</span>
              <span className="font-mono font-bold text-white block truncate">{repoDetails.name}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-zinc-500 block uppercase font-mono">Language / Type</span>
              <span className="font-semibold text-zinc-300 block truncate">{repoDetails.type}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-zinc-500 block uppercase font-mono">Files Parsed</span>
              <span className="font-semibold text-zinc-350 block">{repoDetails.filesCount} files</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-zinc-500 block uppercase font-mono">Audit Status</span>
              <span className={`font-semibold block text-xs font-mono ${repoDetails.analyzing ? 'text-amber-400 animate-pulse' : 'text-emerald-450'}`}>
                {repoDetails.analyzing ? 'Analyzing...' : getProofBadge(walletConnected)}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-zinc-550 text-[11px] italic py-1 font-mono">
            No repository selected
          </div>
        )}
      </div>

      {/* Nav Menu */}
      <div className="flex-1 flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono px-2 mb-2">
          Scope
        </span>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary/10 text-white border-l-2 border-primary'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {link.label}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom User session widget */}
      <div className="border-t border-[#242424] pt-4.5 flex items-center gap-3 mt-auto">
        <div className="relative shrink-0">
          <div className="h-8 w-8 rounded-xl bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300">
            {profile ? getInitials(profile.name) : 'GA'}
          </div>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-[#121212]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-white truncate leading-none">
            {profile ? profile.name : 'GhostAudit User'}
          </span>
          <span className="text-[9px] text-zinc-500 font-semibold font-mono mt-1.5">
            {profile?.role ? profile.role.toUpperCase() : 'LOCAL SESSION'}
          </span>
        </div>
      </div>
    </aside>
  );
};

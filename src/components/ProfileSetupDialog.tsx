import React, { useState } from 'react';
import { User, Briefcase, Building2, ChevronDown, Shield } from 'lucide-react';
import { saveProfile } from '../utils/userProfile';
import type { UserRole, UserProfile } from '../utils/userProfile';

const ROLES: UserRole[] = [
  'Developer',
  'Security Engineer',
  'Founder',
  'Investor',
  'Auditor',
  'Other',
];

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export const ProfileSetupDialog: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Developer');
  const [company, setCompany] = useState('');
  const [nameError, setNameError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Name is required.');
      return;
    }
    const profile: UserProfile = { name: trimmed, role, company: company.trim() };
    saveProfile(profile);
    onComplete(profile);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
      aria-modal="true"
      role="dialog"
      aria-labelledby="profile-dialog-title"
    >
      {/* Panel */}
      <div className="relative w-full max-w-md mx-4 bg-[#111111] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-primary via-violet-500 to-transparent" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Shield className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h2
                id="profile-dialog-title"
                className="text-white font-bold text-sm tracking-tight"
              >
                Welcome to GhostAudit
              </h2>
              <p className="text-zinc-500 text-[11px] font-mono mt-0.5">
                Set up your local session profile — stored on your device only.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="profile-name"
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5"
              >
                <User className="h-3 w-3" />
                Name <span className="text-primary">*</span>
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim()) setNameError('');
                }}
                placeholder="Your name"
                autoFocus
                className={`w-full bg-[#0A0A0A] border ${
                  nameError ? 'border-red-600' : 'border-[#2a2a2a]'
                } rounded-lg px-3 py-2.5 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-primary/60 transition-colors`}
              />
              {nameError && (
                <p className="text-red-500 text-[10px] font-mono">{nameError}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label
                htmlFor="profile-role"
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5"
              >
                <Briefcase className="h-3 w-3" />
                Role
              </label>
              <div className="relative">
                <select
                  id="profile-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full appearance-none bg-[#0A0A0A] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-primary/60 transition-colors pr-8"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Company (optional) */}
            <div className="space-y-1.5">
              <label
                htmlFor="profile-company"
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5"
              >
                <Building2 className="h-3 w-3" />
                Company{' '}
                <span className="text-zinc-600 normal-case font-normal">(optional)</span>
              </label>
              <input
                id="profile-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your company or organisation"
                className="w-full bg-[#0A0A0A] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-xs font-mono placeholder:text-zinc-600 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            {/* Privacy note */}
            <p className="text-[10px] text-zinc-600 font-mono leading-relaxed border-t border-[#1e1e1e] pt-3">
              All data stays on your device. GhostAudit does not transmit profile
              information.
            </p>

            {/* Submit */}
            <button
              id="profile-submit-btn"
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-bold font-mono tracking-wider uppercase py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              Save Profile & Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

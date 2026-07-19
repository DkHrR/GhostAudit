import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProfileSetupDialog } from './components/ProfileSetupDialog';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { LiveAudit } from './pages/LiveAudit';
import { AuditReport } from './pages/AuditReport';
import { AIExecutiveSummary } from './pages/AIExecutiveSummary';
import { InvestorPortal } from './pages/InvestorPortal';
import { AboutMidnight } from './pages/AboutMidnight';
import { loadProfile } from './utils/userProfile';
import type { UserProfile } from './utils/userProfile';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // Profile state — initialised synchronously from localStorage.
  // loadProfile is passed as an initialiser function so it only runs once.
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try { return loadProfile(); } catch { return null; }
  });

  const handleProfileComplete = (saved: UserProfile) => {
    setProfile(saved);
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col">
      {/* First-launch onboarding dialog — renders over any page */}
      {!profile && (
        <ProfileSetupDialog onComplete={handleProfileComplete} />
      )}

      {/* Top sticky navbar */}
      <Navbar />

      {/* Sidebar + Main content container */}
      <div className="flex flex-1">
        {/* Left Side Navigation (visible only on app pages) */}
        {!isLandingPage && <Sidebar profile={profile} />}

        {/* Main page content area */}
        <main className={`flex-1 ${isLandingPage ? 'p-0' : 'p-6 max-w-7xl mx-auto w-full'}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live-audit" element={<LiveAudit />} />
            <Route path="/report" element={<AuditReport />} />
            <Route path="/ai-summary" element={<AIExecutiveSummary />} />
            <Route path="/investor" element={<InvestorPortal />} />
            <Route path="/about-midnight" element={<AboutMidnight />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

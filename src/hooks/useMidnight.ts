import { useState, useEffect } from 'react';
import type { ProofMetadata, VerificationResult } from '../models/proof';
import { midnightService } from '../services/midnightService';

export function useMidnight() {
  const [copied, setCopied] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [verificationHistory, setVerificationHistory] = useState<ProofMetadata[]>([]);
  const [disclosureConfig, setDisclosureConfig] = useState({
    overallRisk: true,
    securityScore: true,
    maintainability: true,
    secretsLogs: false,
    dependencyDetails: false,
    architectureMap: true
  });

  // Check state on mount & storage event
  useEffect(() => {
    const checkStatus = () => {
      const completed = localStorage.getItem('ghost_audit_completed') === 'true';
      setIsUnlocked(completed);
    };

    checkStatus();
    window.addEventListener('storage', checkStatus);
    
    // Load history from service
    midnightService.getVerificationHistory().then(history => {
      setVerificationHistory(history);
    });

    return () => window.removeEventListener('storage', checkStatus);
  }, []);

  const handleCopyLink = () => {
    const activeProof = verificationHistory[0]?.proofId || 'zk_ga_proving';
    const link = `${window.location.origin}/share/${activeProof}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggle = (key: keyof typeof disclosureConfig) => {
    setDisclosureConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const verifyOnLedger = async (proofId: string, accessKey = 'master_key'): Promise<VerificationResult> => {
    return await midnightService.verifyProof(proofId, accessKey);
  };

  const resetVerification = () => {
    localStorage.removeItem('ghost_audit_completed');
    setIsUnlocked(false);
  };

  return {
    copied,
    isUnlocked,
    disclosureConfig,
    handleToggle,
    handleCopyLink,
    verifyOnLedger,
    verificationHistory,
    resetVerification
  };
}

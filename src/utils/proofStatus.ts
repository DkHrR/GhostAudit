/**
 * proofStatus.ts
 * Single source of truth for wallet/proof status labels across GhostAudit.
 *
 * Phase 1: Repository Analysis  — always available, no wallet required.
 * Phase 2: Midnight Proof       — optional, requires connected wallet.
 */

export type ProofStatusKey =
  | 'no_proof_no_wallet'
  | 'no_proof_wallet_connected'
  | 'proof_generated';

export interface ProofStatusInfo {
  /** Short badge label shown in StatusBadge / Sidebar */
  badge: string;
  /** Longer human-readable status line */
  label: string;
  /** CTA button label when action is available */
  buttonLabel: string;
  /** True when proof has been anchored on Midnight */
  isVerified: boolean;
}

const STATUS_MAP: Record<ProofStatusKey, ProofStatusInfo> = {
  no_proof_no_wallet: {
    badge: 'Analysis Complete',
    label: 'Wallet Not Connected — Proof Not Generated',
    buttonLabel: 'Connect Midnight Wallet',
    isVerified: false,
  },
  no_proof_wallet_connected: {
    badge: 'Wallet Connected',
    label: 'Wallet Connected — Ready to Generate Proof',
    buttonLabel: 'Generate Midnight Proof',
    isVerified: false,
  },
  proof_generated: {
    badge: 'Midnight Verified',
    label: 'Proof Anchored on Midnight Network',
    buttonLabel: 'View Proof',
    isVerified: true,
  },
};

/**
 * Derives the proof status key from local storage + wallet state.
 * Call this wherever you need to render wallet/proof UI.
 */
export function getProofStatusKey(walletConnected: boolean): ProofStatusKey {
  const histStr = localStorage.getItem('ghost_verification_history');
  const history = histStr ? JSON.parse(histStr) : [];
  if (history.length > 0) return 'proof_generated';
  if (walletConnected) return 'no_proof_wallet_connected';
  return 'no_proof_no_wallet';
}

export function getProofStatus(walletConnected: boolean): ProofStatusInfo {
  return STATUS_MAP[getProofStatusKey(walletConnected)];
}

/** Convenience: just the badge string */
export function getProofBadge(walletConnected: boolean): string {
  return getProofStatus(walletConnected).badge;
}

/** Tooltip / helper text shown next to every wallet button */
export const WALLET_HELPER_TEXT =
  'A Midnight wallet is only required to generate and anchor a Zero-Knowledge Proof. ' +
  'Repository analysis works completely offline — no wallet needed.';

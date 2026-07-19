import type { RepositoryMetadata } from './repository';

export type VulnerabilitySeverity = 'critical' | 'high' | 'medium' | 'low';

export interface VulnerabilityItem {
  /** The filepath location of the flagged finding */
  filePath: string;
  
  /** The specific line number in the source file */
  lineNumber: number;
  
  /** Detailed description of the vulnerability or finding */
  description: string;
  
  /** The risk severity tag */
  severity: VulnerabilitySeverity;
  
  /** Actionable correction advice or code diff recommendations */
  recommendedCorrection: string;
}

export interface AuditResult {
  /** Reference to the scanned repository parameters */
  repository: RepositoryMetadata;
  
  /** Scaled security index (0 to 100) */
  securityScore: number;
  
  /** Broad M&A risk categorization */
  riskRating: 'VERY LOW' | 'LOW' | 'MEDIUM' | 'HIGH';
  
  /** Evaluated clean code rating index (0 to 100) */
  maintainabilityScore: number;
  
  /** Package health rating index (0 to 100) */
  dependencyHealthScore: number;
  
  /** List of credentials and secret keys flagged */
  secretsLogs: VulnerabilityItem[];
  
  /** Array of general codebase hygiene recommendations */
  recommendations: VulnerabilityItem[];
  
  /** Timestamp when the audit finalized */
  timestamp: string;

  /** Dynamic list of parsed dependencies */
  dependenciesList?: { name: string; version: string; status: string; security: string }[];

  /** Dynamic list of architecture component layers */
  architectureLayers?: { name: string; file: string; type: string }[];
}

export interface AuditDigest {
  /** Cryptographic commitment hash representing the whole audit result content */
  digestHash: string;
  
  /** SHA-256 baseline hash of the analyzed repository */
  repositoryHash: string;
  
  /** Timestamp representing digest creation */
  createdAt: string;
}

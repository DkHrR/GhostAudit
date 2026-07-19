export interface RepositoryMetadata {
  /** The human-readable name of the repository */
  name: string;
  
  /** The formatted file size of the codebase (e.g. "14.8 MB") */
  size: string;
  
  /** The total count of source files indexed */
  filesCount: number;
  
  /** The detected project type/framework summary (e.g. "Full-stack NodeJS") */
  type: string;
  
  /** Client-side generated cryptographic SHA-256 hash of the codebase contents */
  hash: string;
  
  /** The active branch under analysis (e.g. "main") */
  branch: string;

  /** Dynamic in-memory dictionary mapping file paths to their string contents */
  files?: Record<string, string>;
}

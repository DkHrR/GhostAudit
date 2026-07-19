export interface StageDetails {
  name: string;
  what: string;
  why: string;
  midnight: string;
  focusFile: string;
  terminalLogs: string[];
}

export class AuditService {
  private readonly stages: StageDetails[] = [
    {
      name: 'Reading Repository',
      what: 'Read and encrypt code files client-side in the browser session.',
      why: 'Keeps your intellectual property fully secure, rather than uploading plaintext source files to outside servers.',
      midnight: 'Enables private processing models where the browser functions as a secure workspace.',
      focusFile: 'README.md',
      terminalLogs: [
        'Connecting to local sandbox uploader...',
        'Loading archive...',
        'Hashing archive contents...',
        'Repository successfully initialized in client memory.'
      ]
    },
    {
      name: 'Confidential Session',
      what: 'Start a cryptographically isolated session sandbox.',
      why: 'Guarantees that third-party nodes cannot inspect variables or execution parameters.',
      midnight: 'Binds the session identity to anonymous ledger tokens, establishing an audit baseline.',
      focusFile: 'README.md',
      terminalLogs: [
        'Generating client-side ZK parameters...',
        'Initializing local session proving keys...',
        'Binds anonymous verification session.',
        'Confidential audit environment is locked and secure.'
      ]
    },
    {
      name: 'Repository Indexing',
      what: 'Enumerate and catalog the files, structures, and configuration files.',
      why: 'Creates the structural index necessary for static analyzers to navigate modules.',
      midnight: 'Ensures the index of repository symbols stays local; only verification outcomes are signed.',
      focusFile: 'README.md',
      terminalLogs: [
        'Scanning directory structure...',
        'Indexing packages...',
        'Mapping import pathways...',
        'Index complete.'
      ]
    },
    {
      name: 'Technology Detection',
      what: 'Identify programming frameworks, databases, and authentication schemas.',
      why: 'Validates that the project uses standard design patterns (like MVC or clean layering).',
      midnight: 'Allows startups to prove structural maturity constraints without revealing files.',
      focusFile: 'README.md',
      terminalLogs: [
        'Parsing file AST structures...',
        'Detecting primary technology stack...',
        'Analyzing directory patterns...',
        'Verification finished.'
      ]
    },
    {
      name: 'Dependency Audit',
      what: 'Scan package configurations and build third-party dependency chains.',
      why: 'Exposes supply-chain vulnerabilities, licensing alerts, and outdated libraries.',
      midnight: 'Generates private verification hashes of package states for ZK assertions.',
      focusFile: 'README.md',
      terminalLogs: [
        'Scanning requirements and manifests...',
        'Resolving dependency graph chains...',
        'Checking package health against database records...',
        'No critical vulnerability advisories found.'
      ]
    },
    {
      name: 'Secrets Assessment',
      what: 'Scan code strings for hardcoded passwords, private tokens, or API credentials.',
      why: 'Prevents credentials from leaking to git, which risks server exposure.',
      midnight: 'Proves that all configuration variables follow secure vault patterns without disclosing keys.',
      focusFile: 'README.md',
      terminalLogs: [
        'Initiating regex credential scans...',
        'Analyzing source files...',
        'Checking for exposed tokens...',
        'Secrets check complete.'
      ]
    },
    {
      name: 'Vulnerability Assessment',
      what: 'Run checks for SQL injection, buffer bugs, and unauthorized inputs.',
      why: 'Ensures the codebase is robust and resistant to hacker intrusions.',
      midnight: 'Midnight enables proving that vulnerability counts are below threshold parameters.',
      focusFile: 'README.md',
      terminalLogs: [
        'Running logical code static checkers...',
        'Analyzing border gateway data handlers...',
        'Input sanitization check completed.',
        'Vulnerability evaluation complete.'
      ]
    },
    {
      name: 'Architecture Analysis',
      what: 'Graph connection pathways between services, routers, and controllers.',
      why: 'Proves code isolation (e.g. database layers are not bypassed directly).',
      midnight: 'Proves that the codebase adheres to standard design rules without exposing control flow logic.',
      focusFile: 'README.md',
      terminalLogs: [
        'Mapping module separation parameters...',
        'Checking layer isolation guidelines...',
        'Modularity evaluation complete.',
        'Architecture layering checks complete.'
      ]
    },
    {
      name: 'License Assessment',
      what: 'Audit copyright types of all external library dependencies.',
      why: 'Protects commercial codebases from copyleft clauses (like GPL) that require open-sourcing.',
      midnight: 'Allows trustless validation of license compliance metrics privately.',
      focusFile: 'README.md',
      terminalLogs: [
        'Auditing open-source license tags...',
        'Checking package licenses against copyleft policies...',
        'License compatibility check completed.'
      ]
    },
    {
      name: 'Due Diligence Synthesis',
      what: 'Translate complex audit outputs into simple scores and risk descriptions.',
      why: 'Helps investors, acquirers, and non-technical teams review code health in seconds.',
      midnight: 'Allows startups to pack summaries into selective disclosure fields, preventing IP leakage.',
      focusFile: 'README.md',
      terminalLogs: [
        'Compiling technical debt measurements...',
        'AI narrative report compilation started...',
        'Investment readiness tag assessment completed.',
        'AI Summary synthesis complete.'
      ]
    },
    {
      name: 'ZK Proof Compilation',
      what: 'Translate code audits, security indices, and compliance into a ZK proof.',
      why: 'Provides a trustless verification proof that others can check without seeing code.',
      midnight: 'Midnight\'s Zero-Knowledge engine compiles mathematical claims into tiny crypt-stamps.',
      focusFile: 'README.md',
      terminalLogs: [
        'Setting up ZK circuit constraint arrays...',
        'Compiling audit variables into ZK circuits...',
        'Prover execution completed successfully.'
      ]
    },
    {
      name: 'Midnight Attestation',
      what: 'Anchor the ZK proof transaction hash onto the Midnight ledger.',
      why: 'Secures proof parameters in an immutable public registry so they cannot be forged.',
      midnight: 'Anchors audit validity trustlessly, allowing VCs to verify state stamps securely.',
      focusFile: 'README.md',
      terminalLogs: [
        'Connecting to Midnight Network node...',
        'Broadcasting proof transaction stamp...',
        'Ledger confirmation received.',
        'Midnight cryptographic anchor verification: SUCCESS.'
      ]
    },
    {
      name: 'Report Generation',
      what: 'Compile selective disclosure permissions and build the investor dossier.',
      why: 'Unlocks a secure review portal that startups can share with VCs.',
      midnight: 'Allows stakeholders to trustlessly verify audit results without seeing the codebase.',
      focusFile: 'README.md',
      terminalLogs: [
        'Assembling M&A-ready compliance reports...',
        'Generating selective disclosure viewing key parameters...',
        'Investor Portal unlocked.',
        'Due diligence session completed successfully.'
      ]
    }
  ];

  /**
   * Retrieves the comprehensive list of pipeline stages.
   */
  public getStages(): StageDetails[] {
    return this.stages;
  }
}

export const auditService = new AuditService();

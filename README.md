# GhostAudit — Privacy-Preserving Software Due Diligence

GhostAudit is a modern, enterprise-grade software due diligence platform built for startups, enterprises, investors, and M&A teams. It enables organizations to prove the quality, security, and maturity of their software repositories without revealing proprietary source code.

By leveraging **Zero-Knowledge Proofs (ZKP)** and the **Midnight Network**, GhostAudit compiles code quality metrics and vulnerability logs into cryptographic commitments on-chain, allowing VC stakeholders to verify security claims selectively and trustlessly.

---

## 🚀 Key Features

- **Guided AI Analysis Pipeline**: Indexes folders, evaluates AST structures, runs dependency scans, checks secrets, and generates security maturity ratings.
- **Strict Cryptographic Anchoring**: Generates deterministic SHA-256 digests of audit findings using the GhostAudit Canonical JSON (GACJ) standard.
- **Zero-Knowledge Disclosures**: Anchors commitment digests on Midnight and selectively discloses verified ratings directly to investors without leaking code details.
- **Midnight Verification Registry**: An independent portal for VC auditors to query on-chain proofs and validate startup disclosures.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript 6.0, Vite 8.1, Tailwind CSS
- **Cryptography**: Web Crypto Subtle API (SHA-255 native hashing)
- **Blockchain**: Midnight Network SDK (v4.1.1)
- **Contract Language**: Compact Smart Contract Language (v0.23)

---

## 📂 Project Architecture

GhostAudit maintains a strict layered architecture separating React components from blockchain dependencies:

```text
src/
 ├── services/            # Service Layer (Business logic and SDK integrations)
 │     auditService.ts    # Pipeline stages and console logs
 │     aiService.ts       # AST scanners and metrics evaluators
 │     midnightService.ts # Wallet, contract, and proving engine integration
 │     providers.ts       # Midnight SDK provider managers
 │     errors.ts          # Typed custom exceptions
 │
 ├── models/              # Clean interfaces and typed structures
 │     audit.ts           # Audit results and digests
 │     proof.ts           # ZK proof metadata
 │     repository.ts      # Codebase parameters
 │
 ├── hooks/               # React Hooks Layer (Decoupled state machines)
 │     useAudit.ts        # Live audit console state
 │     useMidnight.ts     # Selective disclosure control state
 │
 ├── pages/               # React UI View Components
 │     LiveAudit.tsx      # Terminal workspace
 │     InvestorPortal.tsx # Disclosures controls
```

---

## 🔒 AuditProof Compact Contract

The smart contract is written in **Compact** and located at [contracts/audit-proof.compact](file:///contracts/audit-proof.compact):

- **Ledger State**:
  - `proofRegistry`: Maps `proofId` to public `auditDigest` hashes.
  - `disclosedScores`: Maps `proofId` to selectively disclosed metrics.
- **ZK Circuits**:
  - `anchorAudit`: Registers a new audit commitment.
  - `discloseScore`: Verifies that a disclosed score matches the on-chain commitment before writing to the public ledger.

---

## 🔨 Build & Validation Instructions

### Installation
```bash
npm install
```

### Production Build
```bash
npm run build
```

### Verification Scripts
To run Milestone integration checks, use:
```bash
# Verify Milestone 2 (Wallet)
npx tsx scratch/test_milestone2_wallet.ts

# Verify Milestone 4 (Blockchain)
npx tsx scratch/test_milestone4_blockchain.ts

# Verify Milestone 5 (End-to-End Workflow)
npx tsx scratch/test_milestone5_workflow.ts
```

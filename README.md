# 👻 GhostAudit

Privacy-preserving software due diligence powered by AI analysis and Midnight zero-knowledge proofs.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)
![Vite](https://img.shields.io/badge/Vite-8-purple)
![Midnight](https://img.shields.io/badge/Midnight-ZK-success)

---

## Table of contents

- [Overview](#overview)
- [What GhostAudit does](#what-ghostaudit-does)
- [Current implementation status](#current-implementation-status)
- [Product workflow](#product-workflow)
- [Application routes](#application-routes)
- [Audit stages](#audit-stages)
- [Data model](#data-model)
- [Midnight integration](#midnight-integration)
- [Smart contract](#smart-contract)
- [Repository structure](#repository-structure)
- [Getting started](#getting-started)
- [Configuration and runtime behavior](#configuration-and-runtime-behavior)
- [Troubleshooting](#troubleshooting)
- [Known limitations](#known-limitations)

## Overview

GhostAudit is a frontend-first due diligence prototype that demonstrates how repository analysis outputs can be converted into deterministic cryptographic commitments and then anchored for verification-style workflows.

The app is designed around a privacy-preserving narrative:

1. analyze repository signals,
2. produce an audit result object,
3. canonicalize and hash that result,
4. create a proof record,
5. support selective disclosure checks for investor-facing review.

## What GhostAudit does

- Guides users through a multi-stage “live audit” experience.
- Builds typed audit summaries (risk, security, maintainability, dependency health).
- Flags potential secret exposures and structural hygiene gaps.
- Generates a deterministic digest from audit results using canonical serialization.
- Simulates proof anchoring and proof verification through Midnight service abstractions.
- Stores audit and proof session artifacts in browser localStorage for UI continuity.

## Current implementation status

GhostAudit currently mixes:

- **real frontend flow and typed domain models**, with
- **mocked/simulated chain and wallet behavior** in service logic.

This makes the repository useful for:

- demonstrating UX and architecture,
- iterating on due-diligence data structures,
- validating end-to-end interaction flow.

It is **not yet a production-grade on-chain attestation system**.

## Product workflow

### 1) Session start

The user starts an audit session with repository metadata and in-memory file content.

### 2) Analysis

`AiService.analyzeRepository()` inspects:

- repository structure signals (`README`, `LICENSE`, CI, Docker, env template),
- file extensions and file-path heuristics,
- dependency manifests (`package.json`, `requirements.txt`),
- possible plaintext credentials via regex pattern matching.

### 3) Score synthesis

The app derives:

- `securityScore` (0–100),
- `maintainabilityScore` (0–100),
- `dependencyHealthScore` (0–100),
- `riskRating` (`VERY LOW | LOW | MEDIUM | HIGH`),
- recommendations and findings lists.

### 4) Digest generation

`MidnightService.generateAuditDigest()`:

- canonical-serializes the audit result,
- computes SHA-256 hash,
- returns digest metadata.

### 5) Proof creation + anchoring

`MidnightService.createConfidentialProof()`:

- creates a proof ID,
- anchors digest via `anchorAudit`,
- waits for confirmation status,
- stores proof history in localStorage.

### 6) Disclosure + verification

Investor workflow checks proof validity and returns disclosed fields configured in UI state.

## Application routes

Routes are declared in `src/App.tsx`:

- `/` → `LandingPage`
- `/dashboard` → `Dashboard`
- `/live-audit` → `LiveAudit`
- `/report` → `AuditReport`
- `/ai-summary` → `AIExecutiveSummary`
- `/investor` → `InvestorPortal`
- `/about-midnight` → `AboutMidnight`

## Audit stages

The `AuditService` exposes a 13-stage pipeline used by the live audit console:

1. Reading Repository  
2. Confidential Session  
3. Repository Indexing  
4. Technology Detection  
5. Dependency Audit  
6. Secrets Assessment  
7. Vulnerability Assessment  
8. Architecture Analysis  
9. License Assessment  
10. Due Diligence Synthesis  
11. ZK Proof Compilation  
12. Midnight Attestation  
13. Report Generation

Each stage includes:

- `what` (stage objective),
- `why` (due diligence value),
- `midnight` (privacy/attestation framing),
- synthetic terminal log events for UX progression.

## Data model

Core interfaces are defined under `src/models/`:

- `RepositoryMetadata`  
  includes name, size, file count, type, hash, branch, optional files map.
- `AuditResult`  
  includes scores, risk rating, secrets logs, recommendations, dependencies, architecture layers.
- `AuditDigest`  
  includes digest hash, repository hash, and digest timestamp.
- `ProofMetadata`  
  includes proof ID, tx hash, anchor timestamp, prover version, repo name.
- `VerificationResult`  
  includes validity flag, disclosed items list, and verification timestamp.

## Midnight integration

`src/services/midnightService.ts` provides:

- wallet state handling (`Disconnected`, `Connecting`, `Connected`, etc.),
- contract deploy/load abstractions,
- digest anchoring and tx confirmation checks,
- proof verification helpers,
- local verification history retrieval.

It also contains simulated branches (for testing UI/error paths), such as forced wallet unavailability, network mismatch, timeout, and transaction rejection flags.

## Smart contract

Compact contract path:

- `contracts/audit-proof.compact`

Contract elements:

- `proofRegistry` ledger map (`proofId -> digest`)
- `disclosedScores` ledger map (`proofId -> score`)
- circuit `anchorAudit(proofId, digest)`
- circuit `discloseScore(proofId, score, salt)`

## Repository structure

```text
contracts/
  audit-proof.compact          Compact contract for proof registry/disclosure
  index.ts                     Contract version/schema exports

src/
  components/                  Shared UI elements (layout, dialogs, navigation)
  hooks/                       Stateful workflow hooks (audit + midnight UX flows)
  models/                      TypeScript interfaces for audit/proof/repository data
  pages/                       Route-level screens (dashboard, audit, investor portal, etc.)
  services/                    Domain/service layer (AI analysis, audit stages, midnight)
  utils/                       Utility functions (hashing, profile, formatting helpers)
  App.tsx                      Router + page composition + shell layout
  main.tsx                     React app bootstrap
```

## Getting started

### Prerequisites

- Node.js (current LTS recommended)
- npm

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

Vite prints a local URL (commonly `http://localhost:5173`).

### Build for production

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Preview production build

```bash
npm run preview
```

## Configuration and runtime behavior

### Browser storage keys used by the app

GhostAudit persists session information in localStorage with keys including:

- `ghost_active_repo`
- `ghost_active_audit`
- `ghost_audit_completed`
- `ghost_verification_history`
- `ghost_active_disclosures`
- `ghost_audit_history`

### Privacy behavior in current code

- File content can be kept in-memory during analysis flow.
- Stored repository metadata may exclude raw file bodies for sidebar/session context.
- Proof and disclosure state are persisted locally for UX continuity.

## Troubleshooting

- **Blank investor data:** run a live audit first so history/disclosures exist.
- **Proof generation skipped:** wallet may not be connected or simulation flags may force failure.
- **No dependency output:** uploaded repository may lack recognized manifests (`package.json`/`requirements.txt`).
- **Build issues:** ensure local Node/npm versions are recent enough for React 19 + Vite 8 + TypeScript 6.

## Known limitations

- Wallet/network logic is primarily mocked for demo and testing flows.
- Contract interaction is represented through service-level simulation rather than live network calls.
- Static analysis heuristics are intentionally lightweight and not a replacement for full SAST/DAST tooling.
- The app is suitable for prototyping and demos, not yet for regulated production due diligence.

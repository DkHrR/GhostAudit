# 👻 GhostAudit

Privacy-preserving software due diligence powered by AI analysis and Midnight zero-knowledge proofs.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)
![Vite](https://img.shields.io/badge/Vite-8-purple)
![Midnight](https://img.shields.io/badge/Midnight-ZK-success)

## Overview

GhostAudit helps teams prove software quality and security findings without exposing proprietary source code.  
Audit outputs are converted into deterministic digests and anchored with Midnight tooling so stakeholders can verify claims with selective disclosure.

## Core capabilities

- Analyze repository metadata and audit-related signals through a guided frontend workflow.
- Structure findings into typed audit/proof models for consistent downstream use.
- Integrate with Midnight SDK services for proof generation and verification flows.
- Support investor-facing review and disclosure views in a dedicated portal.

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Midnight JavaScript SDK packages (`4.1.1`)
- Compact smart contract (`contracts/audit-proof.compact`)

## Repository structure

```text
contracts/
  audit-proof.compact

src/
  components/        Reusable UI building blocks
  hooks/             App-level state and workflow hooks
  models/            Typed domain models (audit, proof, repository)
  pages/             Route-level UI screens
  services/          Audit, AI, repository, and Midnight integrations
  utils/             Shared helper utilities
```

## Getting started

### Prerequisites

- Node.js (current LTS recommended)
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

### Available scripts

```bash
npm run dev      # Start development server
npm run build    # Type-check and build production bundle
npm run lint     # Run oxlint
npm run preview  # Preview production build locally
```

## Contract

The Compact contract used for proof anchoring is located at:

- `contracts/audit-proof.compact`

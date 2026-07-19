export class ConfigurationError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'ConfigurationError';
  }
}

export class ProviderInitializationError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'ProviderInitializationError';
  }
}

export class WalletConnectionError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'WalletConnectionError';
  }
}

export class NetworkUnavailableError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'NetworkUnavailableError';
  }
}

export class ProofProviderUnavailableError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'ProofProviderUnavailableError';
  }
}

export class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedError';
  }
}

export class WalletUnavailableError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'WalletUnavailableError';
  }
}

export class PermissionDeniedError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'PermissionDeniedError';
  }
}

export class NetworkMismatchError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'NetworkMismatchError';
  }
}

export class WalletLockedError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'WalletLockedError';
  }
}

export class AccountNotFoundError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'AccountNotFoundError';
  }
}

export class DuplicateConnectionError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'DuplicateConnectionError';
  }
}

export class ContractDeploymentError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'ContractDeploymentError';
  }
}

export class TransactionSubmissionError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'TransactionSubmissionError';
  }
}

export class TransactionTimeoutError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'TransactionTimeoutError';
  }
}

export class TransactionRejectedError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'TransactionRejectedError';
  }
}

export class LedgerQueryError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'LedgerQueryError';
  }
}

export class SynchronizationError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'SynchronizationError';
  }
}

export class ContractVersionMismatchError extends Error {
  public override readonly cause?: Error;
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'ContractVersionMismatchError';
  }
}

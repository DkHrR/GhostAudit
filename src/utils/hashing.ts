export class CryptographicHashError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CryptographicHashError';
  }
}

/**
 * Serializes any data structure to a canonical JSON string (GACJ) for deterministic hashing.
 * - Keys are sorted lexicographically.
 * - Strings normalized to Unicode Form C (NFC).
 * - Floats rounded to nearest integer to avoid browser/OS formatting discrepancies.
 * - Minified spacing (no whitespace).
 */
export function canonicalSerialize(payload: any): string {
  if (payload === null || payload === undefined) {
    return 'null';
  }
  if (typeof payload !== 'object') {
    if (typeof payload === 'string') {
      return JSON.stringify(payload.normalize('NFC'));
    }
    if (typeof payload === 'number') {
      return Math.round(payload).toString();
    }
    return JSON.stringify(payload);
  }
  if (Array.isArray(payload)) {
    return '[' + payload.map(item => canonicalSerialize(item)).join(',') + ']';
  }
  const sortedKeys = Object.keys(payload).sort();
  const pairs = sortedKeys.map(key => {
    return JSON.stringify(key) + ':' + canonicalSerialize(payload[key]);
  });
  return '{' + pairs.join(',') + '}';
}

/**
 * Generates a SHA-256 cryptographic hash of a given string content using browser Crypto APIs.
 * Throws a CryptographicHashError on failures. No fallback alternate algorithm is allowed.
 * 
 * @param content The string payload to hash.
 * @returns A promise resolving to the hex-encoded string of the SHA-256 digest.
 */
export async function sha256(content: string): Promise<string> {
  const win = typeof window !== 'undefined' ? (window as any) : (globalThis as any);
  if (win && win.forceHashingFailure === true) {
    throw new CryptographicHashError(
      "QA simulated: Native SHA-256 execution failed. Cryptographic guarantees invalid."
    );
  }

  // Node compatibility fallback for non-browser testing environments
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    try {
      const nodeCrypto = await import('crypto');
      return nodeCrypto.createHash('sha256').update(content).digest('hex');
    } catch (err: any) {
      throw new CryptographicHashError(`No cryptographic engine available: ${err.message}`);
    }
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    throw new CryptographicHashError(
      `Native SHA-256 compilation failed. Cryptographic guarantees cannot be met: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

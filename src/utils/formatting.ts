/**
 * Truncates a cryptographic hash string for compact visual presentation.
 * 
 * @param hash The target hash string to format.
 * @param chars The count of leading and trailing characters to keep (default: 6).
 * @returns A formatted string (e.g. "zk_ga_8f3a...2b9").
 */
export function formatHash(hash: string, chars = 6): string {
  if (!hash || hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

/**
 * Formats an ISO date string into a readable timestamp.
 * 
 * @param isoString The ISO 8601 date string.
 * @returns A formatted text representation (e.g. "Jul 18, 17:30").
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return isoString;
  }
}

/**
 * Formats a raw number of bytes into a human-readable file capacity string.
 * 
 * @param bytes The raw size in bytes.
 * @returns A formatted size tag (e.g. "14.8 MB").
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

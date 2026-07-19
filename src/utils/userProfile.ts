/**
 * userProfile.ts
 * Lightweight local profile storage — no authentication, no backend.
 */

export const PROFILE_STORAGE_KEY = 'ghost_user_profile';

export type UserRole =
  | 'Developer'
  | 'Security Engineer'
  | 'Founder'
  | 'Investor'
  | 'Auditor'
  | 'Other';

export interface UserProfile {
  name: string;
  role: UserRole;
  company: string; // optional — may be empty string
}

const VALID_ROLES: UserRole[] = [
  'Developer',
  'Security Engineer',
  'Founder',
  'Investor',
  'Auditor',
  'Other',
];

/**
 * Returns the saved profile, or null if none exists or the stored value is
 * corrupted / missing required fields.  Never throws.
 */
export function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Guard against corrupted / empty objects
    if (
      !parsed ||
      typeof parsed.name !== 'string' ||
      !parsed.name.trim() ||
      !VALID_ROLES.includes(parsed.role)
    ) {
      return null;
    }
    return {
      name: parsed.name.trim(),
      role: parsed.role as UserRole,
      company: typeof parsed.company === 'string' ? parsed.company : '',
    };
  } catch {
    return null;
  }
}

/** Persists the profile to localStorage.  Never throws. */
export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage unavailable (private mode quota, etc.) — silently ignore
  }
}

/** Returns initials (up to 2 chars) from a display name.  Safe for empty input. */
export function getInitials(name: string): string {
  if (!name || !name.trim()) return 'GA';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/** Generic fallback displayed when no profile exists yet. */
export const DEFAULT_PROFILE: UserProfile = {
  name: 'GhostAudit User',
  role: 'Auditor',
  company: '',
};

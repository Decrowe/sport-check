// Primitive hashing utilities (NOT production-grade). Uses Web Crypto API (SHA-256).
// Hash format: hex( SHA256( globalSaltBase + perUserSalt + password + pepper ) )

import { AUTH_GLOBAL_SALT_BASE, AUTH_PEPPER } from '@environment';

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function randomSalt(bytes = 16): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return toHex(arr.buffer);
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(
    `${AUTH_GLOBAL_SALT_BASE}:${salt}:${password}:${AUTH_PEPPER}`
  );
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}

export async function verifyPassword(
  password: string,
  salt: string,
  storedHash: string
): Promise<boolean> {
  const h = await hashPassword(password, salt);
  return h === storedHash;
}

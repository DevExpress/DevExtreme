import os from 'os';

export function isWindowsOS() {
  return os.platform() === 'win32';
}

export function containsGlobPattern(pattern: string): boolean {
  return /[*?[\]{}]/.test(pattern);
}

export function escapeRegExpLiteral(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

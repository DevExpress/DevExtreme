import os from 'os';

export function isWindowsOS() {
  return os.platform() === 'win32';
}

export function containsGlobPattern(pattern: string): boolean {
  return /[*?[\]{}]/.test(pattern);
}

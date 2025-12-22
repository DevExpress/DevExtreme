import os from 'os';

export function isWindowsOS() {
  return os.platform() === 'win32';
}

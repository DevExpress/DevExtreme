import sh from 'shelljs';
import fs from 'fs';

export function ensureEmptyDir(path: string): void {
  if (fs.existsSync(path)) {
    sh.rm('-r', path)
  }
  sh.mkdir('-p', path)
}

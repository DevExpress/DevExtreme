import { spawn } from 'child_process';
import { join } from 'path';
import { mkdirSync, copyFileSync } from 'fs';

const copyMeta = (): void => {
  // we need to copy meta: package has different from tests file structure
  const metaPath = join('src', 'dart-compiler', 'metadata');
  const metaFileName = 'dx-theme-builder-metadata.json';
  const sourceMetaPath = join('dart-compiler', 'metadata');

  mkdirSync(metaPath, { recursive: true });
  copyFileSync(join(sourceMetaPath, metaFileName), join(metaPath, metaFileName));
};

copyMeta();

const childProcess = spawn(
  'dart',
  ['./main.dart'],
  {
    detached: true,
    cwd: join(process.cwd(), 'dart-compiler'),
  },
);

childProcess.stdout.on('data', (data) => console.log(data.toString()));
childProcess.stderr.on('data', (data) => console.error(data.toString()));
childProcess.on('error', (error) => console.error('Failed to start subprocess.', error.toString()));
childProcess.on('close', (code) => console.log('Child process exited with code ', code.toString()));

setTimeout(() => process.exit(), 3000);

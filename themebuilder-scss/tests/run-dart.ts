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

childProcess.on('error', (error) => {
  console.error('Failed to start subprocess.', error);
});

childProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

childProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

childProcess.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// setTimeout(() => process.exit(), 1000);

import { existsSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const toolsDir = dirname(fileURLToPath(import.meta.url));
const packageDir = resolve(toolsDir, '../..');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (exit ${result.status})`);
}

try {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: pnpm run fonts:embed-license [metadata.json]');
    console.log('Default config: tools/fonts/license.metadata.json');
    console.log('Creates a Python environment and outputs under .cache/font-license/.');
    process.exit(0);
  }
  if (args.length > 1) throw new Error('Expected at most one configuration path');
  const configPath = args[0] ? resolve(args[0]) : join(toolsDir, 'license.metadata.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (config.schemaVersion !== 1) throw new Error('Expected schemaVersion: 1');
  const stems = ['dxicons', 'dxiconsmaterial', 'dxiconsfluent'];
  const configErrors = [];
  for (const stem of stems) {
    for (const key of ['copyright', 'licenseDescription', 'licenseUrl']) {
      const value = config.fonts?.[stem]?.[key];
      if (typeof value !== 'string' || !value.trim() || /<[^>]+>/.test(value)) {
        configErrors.push(`fonts.${stem}.${key}: missing, empty, or still contains a placeholder`);
      } else if (key === 'licenseUrl') {
        try {
          const url = new URL(value);
          if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol');
        } catch {
          configErrors.push(`fonts.${stem}.${key}: expected an absolute HTTP(S) URL`);
        }
      }
    }
  }
  if (configErrors.length) {
    throw new Error([
      'License metadata configuration is incomplete or invalid.',
      `File: ${configPath}`,
      ...configErrors.map((message) => `  - ${message}`),
      'Replace all placeholders with confirmed license data and fix invalid URLs, then rerun the command.',
      'No fonts were changed; Python setup has not started.',
    ].join('\n'));
  }
  for (const stem of stems) {
    if (!existsSync(join(packageDir, 'icons', `${stem}.ttf`))) {
      throw new Error(`Missing input: ${stem}.ttf`);
    }
  }

  // Validate configuration before creating an environment or downloading dependencies.
  const cache = join(packageDir, '.cache/font-license');
  const venv = join(cache, 'venv');
  const python = join(venv, process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
  mkdirSync(cache, { recursive: true });
  if (!existsSync(python)) {
    console.log('Creating isolated Python environment...');
    run('python3', ['-m', 'venv', venv]);
  }
  const probe = spawnSync(python, ['-c', 'import fontTools.ttLib; import brotli'], { stdio: 'ignore' });
  if (probe.error || probe.status !== 0) {
    console.log('Installing FontTools and WOFF dependencies (network required)...');
    run(python, ['-m', 'pip', 'install', '-r', join(toolsDir, 'requirements.txt')]);
  }
  const output = mkdtempSync(join(cache, 'output-'));
  console.log(`Output directory: ${output}`);
  run(python, [join(toolsDir, 'embed-license.py'), join(packageDir, 'icons'), output], {
    input: JSON.stringify(config),
    stdio: ['pipe', 'inherit', 'inherit'],
  });
  console.log(`Generated and checked 9 files in ${output}`);
  console.log('Source fonts unchanged. Review glyphs and rendering before replacing them.');
} catch (error) {
  console.error(`[fonts:embed-license] ERROR: ${error.message}`);
  process.exitCode = 1;
}

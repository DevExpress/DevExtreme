import { logger } from '@nx/devkit';
import { spawn } from 'child_process';
import * as path from 'path';
import { createExecutor } from '../../utils/create-executor';
import { TranspileSystemjsExecutorSchema } from './schema';

const DEFAULT_BUILDER_SCRIPT = './testing/systemjs-builder.js';
const DEFAULT_MODES = ['modules', 'testing', 'css', 'js-vendors'];

interface ResolvedTranspileSystemjs {
  builderScript: string;
  modes: string[];
  cwd: string;
}

function runBuilderMode(builderScript: string, mode: string, cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    spawn('node', [builderScript, `--transpile=${mode}`], { cwd, stdio: 'inherit' })
      .on('error', reject)
      .on('close', (code) =>
        code
          ? reject(new Error(`systemjs-builder --transpile=${mode} exited with code ${code}`))
          : resolve(),
      );
  });
}

export default createExecutor<TranspileSystemjsExecutorSchema, ResolvedTranspileSystemjs>({
  name: 'Transpile SystemJS',
  resolve: (options, { projectRoot }) => ({
    builderScript: path.join(projectRoot, options.builderScript || DEFAULT_BUILDER_SCRIPT),
    modes: options.modes && options.modes.length > 0 ? options.modes : DEFAULT_MODES,
    cwd: projectRoot,
  }),
  run: async ({ builderScript, modes, cwd }) => {
    logger.verbose(`Transpiling SystemJS modes in parallel: ${modes.join(', ')}`);

    await Promise.all(modes.map((mode) => runBuilderMode(builderScript, mode, cwd)));

    logger.verbose('SystemJS transpilation complete');
  },
});

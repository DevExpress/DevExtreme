import { spawn } from 'child_process';
import { BuildOptions } from 'esbuild';
import { existsSync, mkdirSync, removeSync } from 'fs-extra';
import { Demo, Framework } from '../helper/types';
import { createDemoLayout, getDestinationPathByDemo, getSourcePathByDemo } from '../helper';
import { getIndexHtmlPath, getProjectNameByDemo } from './utils';

interface Bundler {
  framework: Framework;
  getBuildOptions: (demo: Demo) => BuildOptions;
  buildDemo: (demo: Demo, res) => void;
}
export default class AngularBundler implements Bundler {
  framework: Framework;

  constructor() {
    this.framework = 'Angular';
  }

  getBuildOptions = (): BuildOptions => ({});

  buildDemo = (demo: Demo, res): Promise<void> => {
    const sourceDemoPath = getSourcePathByDemo(demo, this.framework);
    if (!existsSync(sourceDemoPath)) {
      res();
      return;
    }

    const destinationDemoPath = getDestinationPathByDemo(demo, this.framework);
    const indexHtmlPath = getIndexHtmlPath(demo);

    if (existsSync(destinationDemoPath)) {
      removeSync(destinationDemoPath);
    }

    if (existsSync(indexHtmlPath)) {
      removeSync(indexHtmlPath);
    }

    mkdirSync(destinationDemoPath, { recursive: true });
    mkdirSync(indexHtmlPath, { recursive: true });

    createDemoLayout(demo, this.framework);

    const isWin = process.platform === 'win32';
    const npmCmd = isWin ? 'npm.cmd' : 'npm';
    const npmArgs = ['run', 'build-angular', '--', getProjectNameByDemo(demo)];
    const ngBuildProcess = spawn(npmCmd, npmArgs);
    ngBuildProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    ngBuildProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    ngBuildProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      res();
    });
  };
}

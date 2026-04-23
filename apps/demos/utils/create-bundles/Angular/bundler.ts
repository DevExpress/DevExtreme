import { exec } from 'child_process';
import { BuildOptions } from 'esbuild';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  removeSync,
  statSync,
  writeFileSync,
} from 'fs-extra';
import { dirname, join, relative } from 'path';
import { Demo, Framework } from '../helper/types';
import { createDemoLayout, getDestinationPathByDemo, getSourcePathByDemo } from '../helper';
import { getIndexHtmlPath, getProjectNameByDemo } from './utils';

interface Bundler {
  framework: Framework;
  getBuildOptions: (demo: Demo) => BuildOptions;
  buildDemo: (demo: Demo, res) => void;
}

type ChangedFile = {
  path: string;
  originalContent: string;
};

export default class AngularBundler implements Bundler {
  framework: Framework;

  constructor() {
    this.framework = 'Angular';
  }

  getBuildOptions = (): BuildOptions => ({});

  private updateAntiForgeryImport = (sourceDemoPath: string): ChangedFile[] => {
    const angularAppPath = join(sourceDemoPath, 'app');
    if (!existsSync(angularAppPath)) {
      return [];
    }

    const changedFiles: ChangedFile[] = [];
    const oldImport = "import 'anti-forgery';";
    const antiForgeryFilePath = join(__dirname, '..', '..', '..', 'shared', 'anti-forgery', 'fetch-override.js');

    const replaceRecursively = (directoryPath: string) => {
      const entries = readdirSync(directoryPath);
      entries.forEach((entryName) => {
        const entryPath = join(directoryPath, entryName);
        const isDirectory = statSync(entryPath).isDirectory();
        if (isDirectory) {
          replaceRecursively(entryPath);
          return;
        }

        if (!entryPath.endsWith('.ts')) {
          return;
        }

        const content = readFileSync(entryPath, 'utf8');
        if (!content.includes(oldImport)) {
          return;
        }

        const relativeImportPath = relative(dirname(entryPath), antiForgeryFilePath).split('\\').join('/');
        const normalizedImportPath = relativeImportPath.startsWith('.') ? relativeImportPath : `./${relativeImportPath}`;
        const newImport = `import '${normalizedImportPath}';`;
        changedFiles.push({ path: entryPath, originalContent: content });
        writeFileSync(entryPath, content.split(oldImport).join(newImport), 'utf8');
      });
    };

    replaceRecursively(angularAppPath);
    return changedFiles;
  };

  private restoreChangedFiles = (changedFiles: ChangedFile[]) => {
    changedFiles.forEach(({ path, originalContent }) => {
      if (existsSync(path)) {
        writeFileSync(path, originalContent, 'utf8');
      }
    });
  };

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
    const changedFiles = this.updateAntiForgeryImport(sourceDemoPath);

    const ngBuildCommand = `npm run build-angular -- ${getProjectNameByDemo(demo)}`;
    const ngBuildProcess = exec(ngBuildCommand);
    ngBuildProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    ngBuildProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    ngBuildProcess.on('close', (code) => {
      this.restoreChangedFiles(changedFiles);
      console.log(`child process exited with code ${code}`);
      res();
    });
  };
}

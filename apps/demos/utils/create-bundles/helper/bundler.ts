import { BuildOptions, build } from 'esbuild';
import { existsSync, mkdirSync, removeSync } from 'fs-extra';
import { Demo, Framework } from './types';
import { createDemoLayout, getDestinationPathByDemo, getSourcePathByDemo } from '.';

interface Bundler {
  framework: Framework;
  getBuildOptions(demo: Demo): BuildOptions;
  buildDemo(demo: Demo, res): Promise<void>;
}

export abstract class ESBundler implements Bundler {
  abstract getBuildOptions(demo: Demo): BuildOptions;

  framework: Framework;

  constructor(framework: Framework) {
    this.framework = framework;
  }

  buildDemo = async (demo: Demo, res): Promise<void> => {
    const sourceDemoPath = getSourcePathByDemo(demo, this.framework);
    if (!existsSync(sourceDemoPath)) {
      res();
      return;
    }

    const destinationDemoPath = getDestinationPathByDemo(demo, this.framework);
    if (existsSync(destinationDemoPath)) {
      removeSync(destinationDemoPath);
    }

    mkdirSync(destinationDemoPath, { recursive: true });

    const options = this.getBuildOptions(demo);
    await build(options);

    createDemoLayout(demo, this.framework);
    res();
  };
}

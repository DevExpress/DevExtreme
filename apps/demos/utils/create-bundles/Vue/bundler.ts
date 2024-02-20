import { BuildOptions } from 'esbuild';
// eslint-disable-next-line import/no-extraneous-dependencies
import vuePlugin from 'esbuild-plugin-vue3';
import { join } from 'path';
import {
  getDestinationPathByDemo, getSourcePathByDemo,
} from '../helper';
import { ESBundler } from '../helper/bundler';
import { Demo } from '../helper/types';

export default class VueBundler extends ESBundler {
  constructor() {
    super('Vue');
  }

  getBuildOptions = (demo: Demo): BuildOptions => {
    const sourceDemoPath = getSourcePathByDemo(demo, this.framework);
    const destinationDemoPath = getDestinationPathByDemo(demo, this.framework);

    const options: BuildOptions = {
      bundle: true,
      minify: true,
      loader: {
        '.png': 'dataurl',
        '.svg': 'dataurl',
      },
      entryNames: '[dir]/bundle.[hash]',
      outdir: destinationDemoPath,
      entryPoints: this.#getEntryPoints(sourceDemoPath),
      plugins: [vuePlugin() as any],
      define: {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
      },
    };

    return options;
  };

  #getEntryPoints = (sourceDemoPath: string) => [join(sourceDemoPath, 'index.js')];
}

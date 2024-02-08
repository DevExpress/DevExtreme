/* eslint-disable import/no-extraneous-dependencies */
import yargs from 'yargs';
import { Framework, Args, Item } from './helper/types';
import { copyMetadata, isSkipDemo } from './helper';
import { ESBundler } from './helper/bundler';
import ReactBundler from './React/bundler';

import * as menuMeta from '../../JSDemos/menuMeta.json';
import VueBundler from './Vue/bundler';

const argv = yargs.options({
  framework: { type: 'string' },
  'copy-metadata': { type: 'boolean' },
}).argv as Args;

const getBundler = (framework: Framework): ESBundler => {
  if (framework === 'React') {
    return new ReactBundler();
  }

  if (framework === 'Vue') {
    return new VueBundler();
  }

  return undefined;
};

const buildDemos = async (bundler: ESBundler) => {
  const menu: Item[] = (menuMeta as any).default;

  for (const meta of menu) {
    for (const group of meta.Groups) {
      const demos = group.Demos || [];
      for (const demo of demos) {
        if (isSkipDemo(demo)) {
          break;
        }

        console.log(`${bundler.framework} Demo: ${demo.Widget} - ${demo.Name}`);

        // eslint-disable-next-line no-await-in-loop
        await bundler.buildDemo(demo);
      }
    }
  }
};

if (argv['copy-metadata']) {
  copyMetadata();
}

const currentBundler = getBundler(argv.framework);
if (currentBundler) {
  buildDemos(currentBundler);
}

import yargs from 'yargs';

import {
  Framework, Args, Item, Demo,
} from './helper/types';
import { copyMetadata, isSkipDemo } from './helper';

import { ESBundler } from './helper/bundler';
import ReactBundler from './React/bundler';
import VueBundler from './Vue/bundler';
import AngularBundler from './Angular/bundler';

import * as menuMeta from '../../menuMeta.json';

const argv = yargs.options({
  framework: { type: 'string' },
  'copy-metadata': { type: 'boolean' },
}).argv as Args;

const getBundler = (framework: Framework): ESBundler => {
  if (framework === 'Angular') {
    return new AngularBundler();
  }
  if (framework === 'React') {
    return new ReactBundler();
  }

  if (framework === 'Vue') {
    return new VueBundler();
  }

  return undefined;
};

const menu: Item[] = (menuMeta as any).default;
const allDemos: Demo[] = [];

const collectDemosFromGroups = (groups: Item['Groups']) => {
  for (const group of groups) {
    const demos = group.Demos || [];
    for (const demo of demos) {
      if (!isSkipDemo(demo)) {
        allDemos.push(demo);
      }
    }

    const subGroups = (group as unknown as { Groups?: Item['Groups'] }).Groups || [];
    if (subGroups.length) {
      collectDemosFromGroups(subGroups);
    }
  }
};

for (const meta of menu) {
  collectDemosFromGroups(meta.Groups || []);
}

async function processDemosInBatches(bundler: ESBundler, demoList: Demo[], batchSize: number) {
  const batches = [];
  for (let i = 0; i < demoList.length; i += batchSize) {
    const batch = demoList.slice(i, i + batchSize);

    batches.push(await processBatch(bundler, batch));
  }
  await Promise.all(batches);
}

async function processBatch(bundler: ESBundler, demos: Demo[]) {
  const promises = demos.map((demo) => processDemo(bundler, demo));
  await Promise.all(promises);
}

// eslint-disable-next-line require-await
async function processDemo(bundler: ESBundler, demo: Demo) {
  return new Promise((res) => {
    bundler.buildDemo(demo, res);
  }).then(() => { console.log(`${bundler.framework} Demo: ${demo.Widget} - ${demo.Name}`); });
}

const currentBundler = getBundler(argv.framework);

if (argv['copy-metadata']) {
  copyMetadata();
}
if (currentBundler) {
  const CONSTEL = process.env.CONSTEL || '1/1';
  const [current, total] = CONSTEL.split('/').map(Number);
  const start = (current - 1) * allDemos.length / total;
  const end = start + allDemos.length / total;
  const currentDemos = allDemos.slice(start, end);

  let batchSize = Math.ceil(allDemos.length / total);
  if (currentBundler.framework === 'Angular') {
    batchSize = 1;
    processDemosInBatches(currentBundler, currentDemos, batchSize)
      .then(() => {
        console.log('All batches processed successfully.');
      })
      .catch((error) => {
        console.error(`Error processing batches: ${error}`);
      });
  } else {
    processDemosInBatches(currentBundler, allDemos, 5);
  }
}

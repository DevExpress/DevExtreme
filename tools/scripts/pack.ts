import { assert } from './common';
import { getProject } from './common/nx';
import { npm } from './common/monorepo-tools';
import { NPM_DIR } from './common/paths';

const [,, name] = process.argv;
const outputPath = getProject(name).data?.targets?.build?.options?.outputPath;
assert(
  !!outputPath,
  `Could not find "build.options.outputPath" of project "${name}". Is project.json configured  correctly?`
);

process.chdir(outputPath);

npm.pack({destination: NPM_DIR});
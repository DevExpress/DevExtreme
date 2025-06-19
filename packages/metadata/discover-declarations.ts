import { Declarations } from 'devextreme-internal-tools/metadata';
import { cleanArtifacts } from './common';
import { resolve } from 'path';
import { PATHS } from './common/paths';

cleanArtifacts(
  'Declarations.Discoverer.cfg.json',
  'Declarations.json',
  'devextreme-uml.wsd',
  'modules-meta.json',
  'ts-members-meta.json',
);

Declarations.discover({
  args: {
    artifacts: PATHS.artifactsDir,
    sources: resolve('../devextreme/js'),
    exclude: /js\/(renovation|__internal|.eslintrc.js)/,
    compilerOptions: {
      typeRoots: [],
    },
  },
});

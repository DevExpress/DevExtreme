import { Imd } from 'devextreme-internal-tools/metadata';
import { cleanArtifacts } from './common';
import { IMD_FILE, PATHS } from './common/paths';

cleanArtifacts(IMD_FILE, 'IntegrationDataGenerator.cfg.json');

Imd.makeMetadata({
  args: {
    artifacts: PATHS.artifactsDir,
  },
});

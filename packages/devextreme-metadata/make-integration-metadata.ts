import { Imd } from 'devextreme-internal-tools/metadata';
import { cleanArtifacts, replaceTypes, types } from './common';
import { IMD_FILE, PATHS } from './common/paths';

cleanArtifacts(IMD_FILE, 'IntegrationDataGenerator.cfg.json');

Imd.makeMetadata({
  args: {
    artifacts: PATHS.artifactsDir,
  },
  mutations: [
    ...replaceTypes({
      uid: 'ui/card_view:dxCardViewOptions.filterBuilderPopup',
      types: [types.object],
    }),
    ...replaceTypes({
      uid: 'ui/card_view:Editing.popup',
      types: [types.object],
    }),
  ],
});

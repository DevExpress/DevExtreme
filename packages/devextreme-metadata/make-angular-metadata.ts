import { Ng } from 'devextreme-internal-tools/metadata';
import { cleanArtifacts, removeMembers } from './common';
import { commonSmdCollectionItems } from './common/smd';
import { NG_SMD_FILE, PATHS } from './common/paths';

cleanArtifacts(NG_SMD_FILE, 'NgSmdGenerator.cfg.json');

Ng.makeMetadata({
  args: {
    artifacts: PATHS.artifactsDir,
  },
  mutations: [
    removeMembers(/\/calendar:dxCalendarOptions.todayButtonText/),
    removeMembers(/\/card_view:/),
    removeMembers(/\/drop_down_editor\/ui.drop_down_editor:FieldAddons/),
    removeMembers(/\/scheduler:Toolbar/),
    removeMembers(/\/stepper:/),
  ],
  variables: {
    collectionItems: [...commonSmdCollectionItems],
  },
});

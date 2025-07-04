import { Imd } from 'devextreme-internal-tools/metadata';
import { addMember, cleanArtifacts, object, removeMembers } from './common';
import { IMD_FILE, PATHS } from './common/paths';

cleanArtifacts(IMD_FILE, 'IntegrationDataGenerator.cfg.json');

Imd.makeMetadata({
  args: {
    artifacts: PATHS.artifactsDir,
  },
  mutations: [
    removeMembers(/\/card_view:dxCardViewOptions.filterBuilderPopup/),
    removeMembers(/\/card_view:Editing.popup/),
    addMember({
      uid: 'ui/card_view:dxCardViewOptions.filterBuilderPopup',
      types: [object()],
    }),
    addMember({
      uid: 'ui/card_view:Editing.popup',
      types: [object()],
    }),
  ],
});

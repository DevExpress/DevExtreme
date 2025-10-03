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
    removeMembers(/\/grids:ColumnBase.ai/),
    removeMembers(/\/grids:LoadPanel.indicatorOptions/),
    removeMembers(/\/calendar:dxCalendarOptions.todayButtonText/),
    removeMembers(/\/card_view:/),
    removeMembers(/\/form:dxFormOptions\.(aiIntegration|onSmartPasting|onSmartPasted|smartPaste)/),
    removeMembers(/\/form:dxFormSimpleItem\.aiOptions/),
    removeMembers(/\/form:FormPredefinedButtonItem/),
    removeMembers(/\/drop_down_editor\/ui.drop_down_editor:FieldAddons/),
    removeMembers(/\/load_panel:dxLoadPanelOptions.indicatorOptions/),
    removeMembers(/\/scheduler:Toolbar/),
    removeMembers(/\/scheduler:dxSchedulerOptions\.editing\.form/),
    removeMembers(/\/stepper:/),
    removeMembers(/\/speech_to_text:/),
  ],
  variables: {
    collectionItems: [...commonSmdCollectionItems],
  },
});

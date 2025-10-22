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
    removeMembers(/\/calendar:dxCalendarOptions.todayButtonText/),
    removeMembers(/\/card_view:/),
    removeMembers(/\/chat:TextMessage.attachments/),
    removeMembers(/\/chat:dxChatOptions\.(fileUploaderOptions|onAttachmentDownload)/),
    removeMembers(/\/form:dxFormOptions\.(aiIntegration|onSmartPasting|onSmartPasted|smartPaste)/),
    removeMembers(/\/form:dxFormSimpleItem\.aiOptions/),
    removeMembers(/\/form:FormPredefinedButtonItem/),
    removeMembers(/\/drop_down_editor\/ui.drop_down_editor:FieldAddons/),
    removeMembers(/\/load_panel:dxLoadPanelOptions.indicatorOptions/),
    removeMembers(/\/grids:LoadPanel.indicatorOptions/),
    removeMembers(/\/scheduler:Toolbar/),
    removeMembers(/\/scheduler:dxSchedulerOptions\.editing\.form/),
    removeMembers(/\/scheduler:dxSchedulerOptions\.resources\.icon/),
    removeMembers(/\/stepper:/),
    removeMembers(/\/speech_to_text:/),
  ],
  variables: {
    collectionItems: [...commonSmdCollectionItems],
  },
});

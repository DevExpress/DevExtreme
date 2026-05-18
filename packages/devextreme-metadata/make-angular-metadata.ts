import { Ng, removeMembers, replaceTypes } from 'devextreme-internal-tools/metadata';
import { cleanArtifacts, types } from './common';
import { commonSmdCollectionItems } from './common/smd';
import { NG_SMD_FILE, PATHS } from './common/paths';
import { replaceTypesMutations } from './common-smd-mutations';

cleanArtifacts(NG_SMD_FILE, 'NgSmdGenerator.cfg.json');

Ng.makeMetadata({
  args: {
    artifacts: PATHS.artifactsDir,
  },
  mutations: [
    [
      ['ui/box:dxBoxOptions', 'ui/box:dxBoxItem.box'],
      ['ui/button:dxButtonOptions', 'common:TextEditorButton.options'],
      ['ui/button:dxButtonOptions', 'ui/form:dxFormButtonItem.buttonOptions'],
      ['ui/calendar:dxCalendarOptions', 'ui/date_box:DateBoxBaseOptions.calendarOptions'],
      ['ui/filter_builder:dxFilterBuilderOptions', 'common/grids:GridBaseOptions.filterBuilder'],
      ['ui/filter_builder:dxFilterBuilderOptions', 'ui/card_view:dxCardViewOptions.filterBuilder'],
      ['ui/popover:dxPopoverOptions', 'ui/lookup:dxLookupOptions.dropDownOptions'],
      ['ui/popup:dxPopupOptions', 'common/grids:EditingBase.popup'],
      ['ui/popup:dxPopupOptions', 'common/grids:GridBaseOptions.filterBuilderPopup'],
      ['ui/popup:dxPopupOptions', 'ui/autocomplete:dxAutocompleteOptions.dropDownOptions'],
      ['ui/popup:dxPopupOptions', 'ui/card_view:dxCardViewOptions.filterBuilderPopup'],
      ['ui/popup:dxPopupOptions', 'ui/color_box:dxColorBoxOptions.dropDownOptions'],
      ['ui/popup:dxPopupOptions', 'ui/date_box:DateBoxBaseOptions.dropDownOptions'],
      ['ui/popup:dxPopupOptions', 'ui/drop_down_box:dxDropDownBoxOptions.dropDownOptions'],
      ['ui/popup:dxPopupOptions', 'ui/drop_down_button:dxDropDownButtonOptions.dropDownOptions'],
      ['ui/popup:dxPopupOptions', 'ui/select_box:dxSelectBoxOptions.dropDownOptions'],
      ['ui/sortable:dxSortableOptions', 'ui/list:dxListOptions.itemDragging'],
      ['ui/splitter:dxSplitterOptions', 'ui/splitter:dxSplitterItem.splitter'],
      ['ui/tab_panel:dxTabPanelOptions', 'ui/form:dxFormTabbedItem.tabPanelOptions'],
      [
        'ui/text_box:dxTextBoxOptions',
        'ui/widget/ui.search_box_mixin:SearchBoxMixinOptions.searchEditorOptions',
      ],
    ].map((pair) => replaceTypes(pair[1], ['*'], [types.uidRef(pair[0], true), 'undefined'])),

    [
      ['ui/form:dxFormOptions', 'common/grids:EditingBase.form'],
      ['ui/form:dxFormOptions', 'ui/card_view:Editing.form'],
      ['ui/popup:dxPopupOptions', 'common/grids:EditingBase.popup'],
      ['ui/popup:dxPopupOptions', 'ui/card_view:Editing.popup'],
    ].map((pair) => replaceTypes(pair[1], ['*'], [types.uidRef(pair[0], true)])),

    ...replaceTypesMutations,

    removeMembers(/\/grids:ColumnBase.ai/),
    removeMembers(/\/grids:GridBaseOptions.aiAssistant/),
    removeMembers(/\/grids:AIAssistant/),
    removeMembers(/\/calendar:dxCalendarOptions.todayButtonText/),
    removeMembers(/\/card_view:/),
    removeMembers(/\/chat:TextMessage.attachments/),
    removeMembers(
      /\/chat:dxChatOptions\.(fileUploaderOptions|inputFieldText|sendButtonOptions|speechToTextOptions|suggestions|onAttachmentDownloadClick)/,
    ),
    removeMembers(/\/form:dxFormOptions\.(aiIntegration|onSmartPasting|onSmartPasted|smartPaste)/),
    removeMembers(/\/form:dxFormSimpleItem\.aiOptions/),
    removeMembers(/\/form:FormPredefinedButtonItem/),
    removeMembers(/\/drop_down_editor\/ui.drop_down_editor:FieldAddons/),
    removeMembers(/\/load_panel:dxLoadPanelOptions.indicatorOptions/),
    removeMembers(/\/grids:LoadPanel.indicatorOptions/),
    removeMembers(/\/popup:dxPopupOptions.tabFocusLoopEnabled/),
    removeMembers(/\/scheduler:Toolbar/),
    removeMembers(/\/scheduler:dxSchedulerOptions\.editing\.form/),
    removeMembers(/\/scheduler:dxSchedulerOptions\.editing\.popup/),
    removeMembers(/\/scheduler:dxSchedulerOptions\.resources\.icon/),
    removeMembers(/\/scheduler:.*\.snapToCellsMode/),
    removeMembers(/\/scheduler:.*\.hiddenWeekDays/),
    removeMembers(/\/stepper:/),
    removeMembers(/\/speech_to_text:/),
    removeMembers(/\/tree_list:dxTreeListColumnButton.onClick/),
  ],
  variables: {
    CollectionItems: [...commonSmdCollectionItems],
  },
});

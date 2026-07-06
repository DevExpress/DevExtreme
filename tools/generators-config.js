function commonConfig() {
  return {
    variables: {
      defaultImports: {
        "CollectionWidget": "devextreme/ui/collection/ui.collection_widget.base",
        "DataSource": "devextreme/data/data_source",
        "DOMComponent": "devextreme/core/dom_component",
        "dxButton": "devextreme/ui/button",
        "dxChat": "devextreme/ui/chat",
        "dxDataGrid": "devextreme/ui/data_grid",
        "dxDateBox": "devextreme/ui/date_box",
        "dxDraggable": "devextreme/ui/draggable",
        "dxDropDownButton": "devextreme/ui/drop_down_button",
        "dxFileUploader": "devextreme/ui/file_uploader",
        "dxFilterBuilder": "devextreme/ui/filter_builder",
        "dxForm": "devextreme/ui/form",
        "dxOverlay": "devextreme/ui/overlay",
        "dxPopover": "devextreme/ui/popover",
        "dxPopup": "devextreme/ui/popup",
        "dxScheduler": "devextreme/ui/scheduler",
        "dxSortable": "devextreme/ui/sortable",
        "dxTabPanel": "devextreme/ui/tab_panel",
        "dxTreeList": "devextreme/ui/tree_list",
        "Editor": "devextreme/ui/editor/editor",
        "FileSystemItem": "devextreme/file_management/file_system_item",
        "PivotGridDataSource": "devextreme/ui/pivot_grid/data_source",
        "UploadInfo": "devextreme/file_management/upload_info",
        "Widget": "devextreme/ui/widget/ui.widget"
      },
      genericTypes: {
        "CollectionWidget": {},
        "Component": {},
        "dxOverlay": {},
        "dxPopupOptions": {},
        "dxPopoverOptions": {},
        "dxTextBoxOptions": {},
        "EventInfo": {},
        "NativeEventInfo": {},
        "Widget": {}
      },
      importOverrides: {
        "ButtonItem": "devextreme/ui/button",
        "commonSeriesSettings": "devextreme/ui/chart",
        "Component": "devextreme/core/component",
        "ComponentOptions": "devextreme/core/component",
        "CustomStoreOptions": "devextreme/common/data",
        "DataSourceOptions": "devextreme/data/data_source",
        "dxAccordionItem": "devextreme/ui/accordion",
        "dxActionSheetItem": "devextreme/ui/action_sheet",
        "dxBoxItem": "devextreme/ui/box",
        "dxBoxOptions": "devextreme/ui/box",
        "dxButtonGroupItem": "devextreme/ui/button_group",
        "dxButtonOptions": "devextreme/ui/button",
        "dxCalendarOptions": "devextreme/ui/calendar",
        "dxChartCommonSeriesSettings": "devextreme/viz/chart",
        "dxContextMenuItem": "devextreme/ui/context_menu",
        "dxDataGridColumn": "devextreme/ui/data_grid",
        "dxDataGridColumnButton": "devextreme/ui/data_grid",
        "dxDropDownButtonItem": "devextreme/ui/drop_down_button",
        "dxFileManagerContextMenuItem": "devextreme/ui/file_manager",
        "dxFileManagerToolbarItem": "devextreme/ui/file_manager",
        "dxFileUploaderOptions": "devextreme/ui/file_uploader",
        "dxFilterBuilderCustomOperation": "devextreme/ui/filter_builder",
        "dxFilterBuilderOptions": "devextreme/ui/filter_builder",
        "dxFormButtonItem": "devextreme/ui/form",
        "dxFormEmptyItem": "devextreme/ui/form",
        "dxFormGroupItem": "devextreme/ui/form",
        "dxFormOptions": "devextreme/ui/form",
        "dxFormSimpleItem": "devextreme/ui/form",
        "dxFormTabbedItem": "devextreme/ui/form",
        "dxFunnelItem": "devextreme/viz/funnel",
        "dxGalleryItem": "devextreme/ui/gallery",
        "dxGanttContextMenuItem": "devextreme/ui/gantt",
        "dxGanttToolbarItem": "devextreme/ui/gantt",
        "dxHtmlEditorImageUploadTabItem": "devextreme/ui/html_editor",
        "dxHtmlEditorTableContextMenuItem": "devextreme/ui/html_editor",
        "dxHtmlEditorToolbarItem": "devextreme/ui/html_editor",
        "dxListItem": "devextreme/ui/list",
        "dxMenuItem": "devextreme/ui/menu",
        "dxMultiViewItem": "devextreme/ui/multi_view",
        "dxPivotGridPivotGridCell": "devextreme/ui/pivot_grid",
        "dxPopoverOptions": "devextreme/ui/popover",
        "dxPopupOptions": "devextreme/ui/popup",
        "dxResponsiveBoxItem": "devextreme/ui/responsive_box",
        "dxSortableOptions": "devextreme/ui/sortable",
        "dxSplitterItem": "devextreme/ui/splitter",
        "dxSplitterOptions": "devextreme/ui/splitter",
        "dxStepperItem": "devextreme/ui/stepper",
        "dxStepperOptions": "devextreme/ui/stepper",
        "dxTabPanelItem": "devextreme/ui/tab_panel",
        "dxTabPanelOptions": "devextreme/ui/tab_panel",
        "dxTabsItem": "devextreme/ui/tabs",
        "dxTextBoxOptions": "devextreme/ui/text_box",
        "dxTileViewItem": "devextreme/ui/tile_view",
        "dxToolbarItem": "devextreme/ui/toolbar",
        "dxToolbarOptions": "devextreme/ui/toolbar",
        "dxTreeListColumn": "devextreme/ui/tree_list",
        "dxTreeListColumnButton": "devextreme/ui/tree_list",
        "dxTreeViewItem": "devextreme/ui/tree_view",
        "GridBase": "devextreme/common/grids",
        "SeriesPoint": "devextreme/common/charts",
        "SeriesLabel": "devextreme/common/charts",
        "ValidationRule": "devextreme/common"
      },
      nameConflictsResolutionNamespaces: {
        "ValidationRule": "CommonTypes",
        "VisualRange": "CommonChartTypes"
      },
      typeResolutions: {
        "AsyncRule": "ValidationRule",
        "CompareRule": "ValidationRule",
        "CustomRule": "ValidationRule",
        "dxChartOptions.commonSeriesSettings": "dxChartCommonSeriesSettings",
        "dxChartSeriesTypes.CommonSeries.label": "SeriesLabel",
        "dxChartSeriesTypes.CommonSeries.point": "SeriesPoint",
        "EmailRule": "ValidationRule",
        "NumericRule": "ValidationRule",
        "PatternRule": "ValidationRule",
        "RangeRule": "ValidationRule",
        "RequiredRule": "ValidationRule",
        "StringLengthRule": "ValidationRule"
      },
      nameTransformRules: {
        acronyms: ['AI']
      }
    }
  }
}

const reactConfig = {
  ...commonConfig()
}

const angularConfig = {
  ...commonConfig()
}
angularConfig.variables.genericTypes['CoreComponent'] = {};
angularConfig.variables.nonExportedNestedComponents = ['DxiToolbarItem', 'DxiMenuItem'];

const vueConfig = {
  ...commonConfig()
}

module.exports = {
  reactConfig,
  angularConfig,
  vueConfig,
}

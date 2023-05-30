export { ExplicitTypes } from "devextreme/ui/data_grid";
import DataGrid, { Properties } from "devextreme/ui/data_grid";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "allowColumnReordering" |
  "allowColumnResizing" |
  "autoNavigateToFocusedRow" |
  "cacheEnabled" |
  "cellHintEnabled" |
  "columnAutoWidth" |
  "columnChooser" |
  "columnFixing" |
  "columnHidingEnabled" |
  "columnMinWidth" |
  "columnResizingMode" |
  "columns" |
  "columnWidth" |
  "customizeColumns" |
  "dataRowTemplate" |
  "dataSource" |
  "dateSerializationFormat" |
  "disabled" |
  "editing" |
  "elementAttr" |
  "errorRowEnabled" |
  "export" |
  "filterBuilder" |
  "filterBuilderPopup" |
  "filterPanel" |
  "filterRow" |
  "filterSyncEnabled" |
  "filterValue" |
  "focusedColumnIndex" |
  "focusedRowEnabled" |
  "focusedRowIndex" |
  "focusedRowKey" |
  "grouping" |
  "groupPanel" |
  "headerFilter" |
  "height" |
  "highlightChanges" |
  "hint" |
  "hoverStateEnabled" |
  "keyboardNavigation" |
  "keyExpr" |
  "loadPanel" |
  "masterDetail" |
  "noDataText" |
  "onAdaptiveDetailRowPreparing" |
  "onCellClick" |
  "onCellDblClick" |
  "onCellHoverChanged" |
  "onCellPrepared" |
  "onContentReady" |
  "onContextMenuPreparing" |
  "onDataErrorOccurred" |
  "onDisposing" |
  "onEditCanceled" |
  "onEditCanceling" |
  "onEditingStart" |
  "onEditorPrepared" |
  "onEditorPreparing" |
  "onExporting" |
  "onFocusedCellChanged" |
  "onFocusedCellChanging" |
  "onFocusedRowChanged" |
  "onFocusedRowChanging" |
  "onInitialized" |
  "onInitNewRow" |
  "onKeyDown" |
  "onOptionChanged" |
  "onRowClick" |
  "onRowCollapsed" |
  "onRowCollapsing" |
  "onRowDblClick" |
  "onRowExpanded" |
  "onRowExpanding" |
  "onRowInserted" |
  "onRowInserting" |
  "onRowPrepared" |
  "onRowRemoved" |
  "onRowRemoving" |
  "onRowUpdated" |
  "onRowUpdating" |
  "onRowValidating" |
  "onSaved" |
  "onSaving" |
  "onSelectionChanged" |
  "onToolbarPreparing" |
  "pager" |
  "paging" |
  "remoteOperations" |
  "renderAsync" |
  "repaintChangesOnly" |
  "rowAlternationEnabled" |
  "rowDragging" |
  "rowTemplate" |
  "rtlEnabled" |
  "scrolling" |
  "searchPanel" |
  "selectedRowKeys" |
  "selection" |
  "selectionFilter" |
  "showBorders" |
  "showColumnHeaders" |
  "showColumnLines" |
  "showRowLines" |
  "sortByGroupSummaryInfo" |
  "sorting" |
  "stateStoring" |
  "summary" |
  "syncLookupFilterValues" |
  "tabIndex" |
  "toolbar" |
  "twoWayBindingEnabled" |
  "visible" |
  "width" |
  "wordWrapEnabled"
>;

interface DxDataGrid extends AccessibleOptions {
  readonly instance?: DataGrid;
}
const DxDataGrid = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowColumnReordering: Boolean,
    allowColumnResizing: Boolean,
    autoNavigateToFocusedRow: Boolean,
    cacheEnabled: Boolean,
    cellHintEnabled: Boolean,
    columnAutoWidth: Boolean,
    columnChooser: Object,
    columnFixing: Object,
    columnHidingEnabled: Boolean,
    columnMinWidth: Number,
    columnResizingMode: String,
    columns: Array,
    columnWidth: [Number, String],
    customizeColumns: Function,
    dataRowTemplate: {},
    dataSource: {},
    dateSerializationFormat: String,
    disabled: Boolean,
    editing: Object,
    elementAttr: Object,
    errorRowEnabled: Boolean,
    export: Object,
    filterBuilder: Object,
    filterBuilderPopup: Object,
    filterPanel: Object,
    filterRow: Object,
    filterSyncEnabled: [Boolean, String],
    filterValue: [Array, Function, String],
    focusedColumnIndex: Number,
    focusedRowEnabled: Boolean,
    focusedRowIndex: Number,
    focusedRowKey: {},
    grouping: Object,
    groupPanel: Object,
    headerFilter: Object,
    height: [Function, Number, String],
    highlightChanges: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    keyboardNavigation: Object,
    keyExpr: [Array, String],
    loadPanel: Object,
    masterDetail: Object,
    noDataText: String,
    onAdaptiveDetailRowPreparing: Function,
    onCellClick: Function,
    onCellDblClick: Function,
    onCellHoverChanged: Function,
    onCellPrepared: Function,
    onContentReady: Function,
    onContextMenuPreparing: Function,
    onDataErrorOccurred: Function,
    onDisposing: Function,
    onEditCanceled: Function,
    onEditCanceling: Function,
    onEditingStart: Function,
    onEditorPrepared: Function,
    onEditorPreparing: Function,
    onExporting: Function,
    onFocusedCellChanged: Function,
    onFocusedCellChanging: Function,
    onFocusedRowChanged: Function,
    onFocusedRowChanging: Function,
    onInitialized: Function,
    onInitNewRow: Function,
    onKeyDown: Function,
    onOptionChanged: Function,
    onRowClick: Function,
    onRowCollapsed: Function,
    onRowCollapsing: Function,
    onRowDblClick: Function,
    onRowExpanded: Function,
    onRowExpanding: Function,
    onRowInserted: Function,
    onRowInserting: Function,
    onRowPrepared: Function,
    onRowRemoved: Function,
    onRowRemoving: Function,
    onRowUpdated: Function,
    onRowUpdating: Function,
    onRowValidating: Function,
    onSaved: Function,
    onSaving: Function,
    onSelectionChanged: Function,
    onToolbarPreparing: Function,
    pager: Object,
    paging: Object,
    remoteOperations: [Boolean, Object, String],
    renderAsync: Boolean,
    repaintChangesOnly: Boolean,
    rowAlternationEnabled: Boolean,
    rowDragging: Object,
    rowTemplate: {},
    rtlEnabled: Boolean,
    scrolling: Object,
    searchPanel: Object,
    selectedRowKeys: Array,
    selection: Object,
    selectionFilter: [Array, Function, String],
    showBorders: Boolean,
    showColumnHeaders: Boolean,
    showColumnLines: Boolean,
    showRowLines: Boolean,
    sortByGroupSummaryInfo: Array,
    sorting: Object,
    stateStoring: Object,
    summary: Object,
    syncLookupFilterValues: Boolean,
    tabIndex: Number,
    toolbar: Object,
    twoWayBindingEnabled: Boolean,
    visible: Boolean,
    width: [Function, Number, String],
    wordWrapEnabled: Boolean
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowColumnReordering": null,
    "update:allowColumnResizing": null,
    "update:autoNavigateToFocusedRow": null,
    "update:cacheEnabled": null,
    "update:cellHintEnabled": null,
    "update:columnAutoWidth": null,
    "update:columnChooser": null,
    "update:columnFixing": null,
    "update:columnHidingEnabled": null,
    "update:columnMinWidth": null,
    "update:columnResizingMode": null,
    "update:columns": null,
    "update:columnWidth": null,
    "update:customizeColumns": null,
    "update:dataRowTemplate": null,
    "update:dataSource": null,
    "update:dateSerializationFormat": null,
    "update:disabled": null,
    "update:editing": null,
    "update:elementAttr": null,
    "update:errorRowEnabled": null,
    "update:export": null,
    "update:filterBuilder": null,
    "update:filterBuilderPopup": null,
    "update:filterPanel": null,
    "update:filterRow": null,
    "update:filterSyncEnabled": null,
    "update:filterValue": null,
    "update:focusedColumnIndex": null,
    "update:focusedRowEnabled": null,
    "update:focusedRowIndex": null,
    "update:focusedRowKey": null,
    "update:grouping": null,
    "update:groupPanel": null,
    "update:headerFilter": null,
    "update:height": null,
    "update:highlightChanges": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:keyboardNavigation": null,
    "update:keyExpr": null,
    "update:loadPanel": null,
    "update:masterDetail": null,
    "update:noDataText": null,
    "update:onAdaptiveDetailRowPreparing": null,
    "update:onCellClick": null,
    "update:onCellDblClick": null,
    "update:onCellHoverChanged": null,
    "update:onCellPrepared": null,
    "update:onContentReady": null,
    "update:onContextMenuPreparing": null,
    "update:onDataErrorOccurred": null,
    "update:onDisposing": null,
    "update:onEditCanceled": null,
    "update:onEditCanceling": null,
    "update:onEditingStart": null,
    "update:onEditorPrepared": null,
    "update:onEditorPreparing": null,
    "update:onExporting": null,
    "update:onFocusedCellChanged": null,
    "update:onFocusedCellChanging": null,
    "update:onFocusedRowChanged": null,
    "update:onFocusedRowChanging": null,
    "update:onInitialized": null,
    "update:onInitNewRow": null,
    "update:onKeyDown": null,
    "update:onOptionChanged": null,
    "update:onRowClick": null,
    "update:onRowCollapsed": null,
    "update:onRowCollapsing": null,
    "update:onRowDblClick": null,
    "update:onRowExpanded": null,
    "update:onRowExpanding": null,
    "update:onRowInserted": null,
    "update:onRowInserting": null,
    "update:onRowPrepared": null,
    "update:onRowRemoved": null,
    "update:onRowRemoving": null,
    "update:onRowUpdated": null,
    "update:onRowUpdating": null,
    "update:onRowValidating": null,
    "update:onSaved": null,
    "update:onSaving": null,
    "update:onSelectionChanged": null,
    "update:onToolbarPreparing": null,
    "update:pager": null,
    "update:paging": null,
    "update:remoteOperations": null,
    "update:renderAsync": null,
    "update:repaintChangesOnly": null,
    "update:rowAlternationEnabled": null,
    "update:rowDragging": null,
    "update:rowTemplate": null,
    "update:rtlEnabled": null,
    "update:scrolling": null,
    "update:searchPanel": null,
    "update:selectedRowKeys": null,
    "update:selection": null,
    "update:selectionFilter": null,
    "update:showBorders": null,
    "update:showColumnHeaders": null,
    "update:showColumnLines": null,
    "update:showRowLines": null,
    "update:sortByGroupSummaryInfo": null,
    "update:sorting": null,
    "update:stateStoring": null,
    "update:summary": null,
    "update:syncLookupFilterValues": null,
    "update:tabIndex": null,
    "update:toolbar": null,
    "update:twoWayBindingEnabled": null,
    "update:visible": null,
    "update:width": null,
    "update:wordWrapEnabled": null,
  },
  computed: {
    instance(): DataGrid {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = DataGrid;
    (this as any).$_hasAsyncTemplate = false;
    (this as any).$_expectedChildren = {
      column: { isCollectionItem: true, optionName: "columns" },
      columnChooser: { isCollectionItem: false, optionName: "columnChooser" },
      columnFixing: { isCollectionItem: false, optionName: "columnFixing" },
      dataGridHeaderFilter: { isCollectionItem: false, optionName: "headerFilter" },
      dataGridSelection: { isCollectionItem: false, optionName: "selection" },
      editing: { isCollectionItem: false, optionName: "editing" },
      export: { isCollectionItem: false, optionName: "export" },
      filterBuilder: { isCollectionItem: false, optionName: "filterBuilder" },
      filterBuilderPopup: { isCollectionItem: false, optionName: "filterBuilderPopup" },
      filterPanel: { isCollectionItem: false, optionName: "filterPanel" },
      filterRow: { isCollectionItem: false, optionName: "filterRow" },
      grouping: { isCollectionItem: false, optionName: "grouping" },
      groupPanel: { isCollectionItem: false, optionName: "groupPanel" },
      headerFilter: { isCollectionItem: false, optionName: "headerFilter" },
      keyboardNavigation: { isCollectionItem: false, optionName: "keyboardNavigation" },
      loadPanel: { isCollectionItem: false, optionName: "loadPanel" },
      masterDetail: { isCollectionItem: false, optionName: "masterDetail" },
      pager: { isCollectionItem: false, optionName: "pager" },
      paging: { isCollectionItem: false, optionName: "paging" },
      remoteOperations: { isCollectionItem: false, optionName: "remoteOperations" },
      rowDragging: { isCollectionItem: false, optionName: "rowDragging" },
      scrolling: { isCollectionItem: false, optionName: "scrolling" },
      searchPanel: { isCollectionItem: false, optionName: "searchPanel" },
      selection: { isCollectionItem: false, optionName: "selection" },
      sortByGroupSummaryInfo: { isCollectionItem: true, optionName: "sortByGroupSummaryInfo" },
      sorting: { isCollectionItem: false, optionName: "sorting" },
      stateStoring: { isCollectionItem: false, optionName: "stateStoring" },
      summary: { isCollectionItem: false, optionName: "summary" },
      toolbar: { isCollectionItem: false, optionName: "toolbar" }
    };
  }
});

const DxAnimation = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:hide": null,
    "update:show": null,
  },
  props: {
    hide: [Object, Number, String],
    show: [Object, Number, String]
  }
});
(DxAnimation as any).$_optionName = "animation";
(DxAnimation as any).$_expectedChildren = {
  hide: { isCollectionItem: false, optionName: "hide" },
  show: { isCollectionItem: false, optionName: "show" }
};
const DxAsyncRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:reevaluate": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    reevaluate: Boolean,
    type: String,
    validationCallback: Function
  }
});
(DxAsyncRule as any).$_optionName = "validationRules";
(DxAsyncRule as any).$_isCollectionItem = true;
(DxAsyncRule as any).$_predefinedProps = {
  type: "async"
};
const DxAt = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: String,
    y: String
  }
});
(DxAt as any).$_optionName = "at";
const DxBoundaryOffset = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: Number,
    y: Number
  }
});
(DxBoundaryOffset as any).$_optionName = "boundaryOffset";
const DxButton = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:hint": null,
    "update:icon": null,
    "update:name": null,
    "update:onClick": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    cssClass: String,
    disabled: [Boolean, Function],
    hint: String,
    icon: String,
    name: String,
    onClick: Function,
    template: {},
    text: String,
    visible: [Boolean, Function]
  }
});
(DxButton as any).$_optionName = "buttons";
(DxButton as any).$_isCollectionItem = true;
const DxChange = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:data": null,
    "update:insertAfterKey": null,
    "update:insertBeforeKey": null,
    "update:type": null,
  },
  props: {
    data: {},
    insertAfterKey: {},
    insertBeforeKey: {},
    type: String
  }
});
(DxChange as any).$_optionName = "changes";
(DxChange as any).$_isCollectionItem = true;
const DxColCountByScreen = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:lg": null,
    "update:md": null,
    "update:sm": null,
    "update:xs": null,
  },
  props: {
    lg: Number,
    md: Number,
    sm: Number,
    xs: Number
  }
});
(DxColCountByScreen as any).$_optionName = "colCountByScreen";
const DxCollision = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: String,
    y: String
  }
});
(DxCollision as any).$_optionName = "collision";
const DxColumn = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:allowEditing": null,
    "update:allowExporting": null,
    "update:allowFiltering": null,
    "update:allowFixing": null,
    "update:allowGrouping": null,
    "update:allowHeaderFiltering": null,
    "update:allowHiding": null,
    "update:allowReordering": null,
    "update:allowResizing": null,
    "update:allowSearch": null,
    "update:allowSorting": null,
    "update:autoExpandGroup": null,
    "update:buttons": null,
    "update:calculateCellValue": null,
    "update:calculateDisplayValue": null,
    "update:calculateFilterExpression": null,
    "update:calculateGroupValue": null,
    "update:calculateSortValue": null,
    "update:caption": null,
    "update:cellTemplate": null,
    "update:columns": null,
    "update:cssClass": null,
    "update:customizeText": null,
    "update:dataField": null,
    "update:dataType": null,
    "update:editCellTemplate": null,
    "update:editorOptions": null,
    "update:encodeHtml": null,
    "update:falseText": null,
    "update:filterOperations": null,
    "update:filterType": null,
    "update:filterValue": null,
    "update:filterValues": null,
    "update:fixed": null,
    "update:fixedPosition": null,
    "update:format": null,
    "update:formItem": null,
    "update:groupCellTemplate": null,
    "update:groupIndex": null,
    "update:headerCellTemplate": null,
    "update:headerFilter": null,
    "update:hidingPriority": null,
    "update:isBand": null,
    "update:lookup": null,
    "update:minWidth": null,
    "update:name": null,
    "update:ownerBand": null,
    "update:renderAsync": null,
    "update:selectedFilterOperation": null,
    "update:setCellValue": null,
    "update:showEditorAlways": null,
    "update:showInColumnChooser": null,
    "update:showWhenGrouped": null,
    "update:sortIndex": null,
    "update:sortingMethod": null,
    "update:sortOrder": null,
    "update:trueText": null,
    "update:type": null,
    "update:validationRules": null,
    "update:visible": null,
    "update:visibleIndex": null,
    "update:width": null,
  },
  props: {
    alignment: String,
    allowEditing: Boolean,
    allowExporting: Boolean,
    allowFiltering: Boolean,
    allowFixing: Boolean,
    allowGrouping: Boolean,
    allowHeaderFiltering: Boolean,
    allowHiding: Boolean,
    allowReordering: Boolean,
    allowResizing: Boolean,
    allowSearch: Boolean,
    allowSorting: Boolean,
    autoExpandGroup: Boolean,
    buttons: Array,
    calculateCellValue: Function,
    calculateDisplayValue: [Function, String],
    calculateFilterExpression: Function,
    calculateGroupValue: [Function, String],
    calculateSortValue: [Function, String],
    caption: String,
    cellTemplate: {},
    columns: Array,
    cssClass: String,
    customizeText: Function,
    dataField: String,
    dataType: String,
    editCellTemplate: {},
    editorOptions: {},
    encodeHtml: Boolean,
    falseText: String,
    filterOperations: Array,
    filterType: String,
    filterValue: {},
    filterValues: Array,
    fixed: Boolean,
    fixedPosition: String,
    format: [Object, Function, String],
    formItem: Object,
    groupCellTemplate: {},
    groupIndex: Number,
    headerCellTemplate: {},
    headerFilter: Object,
    hidingPriority: Number,
    isBand: Boolean,
    lookup: Object,
    minWidth: Number,
    name: String,
    ownerBand: Number,
    renderAsync: Boolean,
    selectedFilterOperation: String,
    setCellValue: Function,
    showEditorAlways: Boolean,
    showInColumnChooser: Boolean,
    showWhenGrouped: Boolean,
    sortIndex: Number,
    sortingMethod: Function,
    sortOrder: String,
    trueText: String,
    type: String,
    validationRules: Array,
    visible: Boolean,
    visibleIndex: Number,
    width: [Number, String]
  }
});
(DxColumn as any).$_optionName = "columns";
(DxColumn as any).$_isCollectionItem = true;
(DxColumn as any).$_expectedChildren = {
  AsyncRule: { isCollectionItem: true, optionName: "validationRules" },
  button: { isCollectionItem: true, optionName: "buttons" },
  columnHeaderFilter: { isCollectionItem: false, optionName: "headerFilter" },
  columnLookup: { isCollectionItem: false, optionName: "lookup" },
  CompareRule: { isCollectionItem: true, optionName: "validationRules" },
  CustomRule: { isCollectionItem: true, optionName: "validationRules" },
  EmailRule: { isCollectionItem: true, optionName: "validationRules" },
  format: { isCollectionItem: false, optionName: "format" },
  formItem: { isCollectionItem: false, optionName: "formItem" },
  headerFilter: { isCollectionItem: false, optionName: "headerFilter" },
  lookup: { isCollectionItem: false, optionName: "lookup" },
  NumericRule: { isCollectionItem: true, optionName: "validationRules" },
  PatternRule: { isCollectionItem: true, optionName: "validationRules" },
  RangeRule: { isCollectionItem: true, optionName: "validationRules" },
  RequiredRule: { isCollectionItem: true, optionName: "validationRules" },
  StringLengthRule: { isCollectionItem: true, optionName: "validationRules" },
  validationRule: { isCollectionItem: true, optionName: "validationRules" }
};
const DxColumnChooser = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:emptyPanelText": null,
    "update:enabled": null,
    "update:height": null,
    "update:mode": null,
    "update:position": null,
    "update:search": null,
    "update:searchTimeout": null,
    "update:selection": null,
    "update:sortOrder": null,
    "update:title": null,
    "update:width": null,
  },
  props: {
    allowSearch: Boolean,
    emptyPanelText: String,
    enabled: Boolean,
    height: Number,
    mode: String,
    position: Object,
    search: Object,
    searchTimeout: Number,
    selection: Object,
    sortOrder: String,
    title: String,
    width: Number
  }
});
(DxColumnChooser as any).$_optionName = "columnChooser";
(DxColumnChooser as any).$_expectedChildren = {
  columnChooserSearch: { isCollectionItem: false, optionName: "search" },
  columnChooserSelection: { isCollectionItem: false, optionName: "selection" },
  position: { isCollectionItem: false, optionName: "position" },
  search: { isCollectionItem: false, optionName: "search" },
  selection: { isCollectionItem: false, optionName: "selection" }
};
const DxColumnChooserSearch = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:editorOptions": null,
    "update:enabled": null,
    "update:timeout": null,
  },
  props: {
    editorOptions: {},
    enabled: Boolean,
    timeout: Number
  }
});
(DxColumnChooserSearch as any).$_optionName = "search";
const DxColumnChooserSelection = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSelectAll": null,
    "update:recursive": null,
    "update:selectByClick": null,
  },
  props: {
    allowSelectAll: Boolean,
    recursive: Boolean,
    selectByClick: Boolean
  }
});
(DxColumnChooserSelection as any).$_optionName = "selection";
const DxColumnFixing = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:texts": null,
  },
  props: {
    enabled: Boolean,
    texts: Object
  }
});
(DxColumnFixing as any).$_optionName = "columnFixing";
(DxColumnFixing as any).$_expectedChildren = {
  columnFixingTexts: { isCollectionItem: false, optionName: "texts" },
  texts: { isCollectionItem: false, optionName: "texts" }
};
const DxColumnFixingTexts = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:fix": null,
    "update:leftPosition": null,
    "update:rightPosition": null,
    "update:unfix": null,
  },
  props: {
    fix: String,
    leftPosition: String,
    rightPosition: String,
    unfix: String
  }
});
(DxColumnFixingTexts as any).$_optionName = "texts";
const DxColumnHeaderFilter = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:allowSelectAll": null,
    "update:dataSource": null,
    "update:groupInterval": null,
    "update:height": null,
    "update:search": null,
    "update:searchMode": null,
    "update:width": null,
  },
  props: {
    allowSearch: Boolean,
    allowSelectAll: Boolean,
    dataSource: {},
    groupInterval: [Number, String],
    height: Number,
    search: Object,
    searchMode: String,
    width: Number
  }
});
(DxColumnHeaderFilter as any).$_optionName = "headerFilter";
(DxColumnHeaderFilter as any).$_expectedChildren = {
  columnHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  search: { isCollectionItem: false, optionName: "search" }
};
const DxColumnHeaderFilterSearch = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:editorOptions": null,
    "update:enabled": null,
    "update:mode": null,
    "update:searchExpr": null,
    "update:timeout": null,
  },
  props: {
    editorOptions: {},
    enabled: Boolean,
    mode: String,
    searchExpr: [Array, Function, String],
    timeout: Number
  }
});
(DxColumnHeaderFilterSearch as any).$_optionName = "search";
const DxColumnLookup = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowClearing": null,
    "update:calculateCellValue": null,
    "update:dataSource": null,
    "update:displayExpr": null,
    "update:valueExpr": null,
  },
  props: {
    allowClearing: Boolean,
    calculateCellValue: Function,
    dataSource: {},
    displayExpr: [Function, String],
    valueExpr: String
  }
});
(DxColumnLookup as any).$_optionName = "lookup";
const DxCompareRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:comparisonTarget": null,
    "update:comparisonType": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    comparisonTarget: Function,
    comparisonType: String,
    ignoreEmptyValue: Boolean,
    message: String,
    type: String
  }
});
(DxCompareRule as any).$_optionName = "validationRules";
(DxCompareRule as any).$_isCollectionItem = true;
(DxCompareRule as any).$_predefinedProps = {
  type: "compare"
};
const DxCursorOffset = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: Number,
    y: Number
  }
});
(DxCursorOffset as any).$_optionName = "cursorOffset";
const DxCustomOperation = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:calculateFilterExpression": null,
    "update:caption": null,
    "update:customizeText": null,
    "update:dataTypes": null,
    "update:editorTemplate": null,
    "update:hasValue": null,
    "update:icon": null,
    "update:name": null,
  },
  props: {
    calculateFilterExpression: Function,
    caption: String,
    customizeText: Function,
    dataTypes: Array,
    editorTemplate: {},
    hasValue: Boolean,
    icon: String,
    name: String
  }
});
(DxCustomOperation as any).$_optionName = "customOperations";
(DxCustomOperation as any).$_isCollectionItem = true;
const DxCustomRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:reevaluate": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    reevaluate: Boolean,
    type: String,
    validationCallback: Function
  }
});
(DxCustomRule as any).$_optionName = "validationRules";
(DxCustomRule as any).$_isCollectionItem = true;
(DxCustomRule as any).$_predefinedProps = {
  type: "custom"
};
const DxDataGridHeaderFilter = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:allowSelectAll": null,
    "update:height": null,
    "update:search": null,
    "update:searchTimeout": null,
    "update:texts": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    allowSearch: Boolean,
    allowSelectAll: Boolean,
    height: Number,
    search: Object,
    searchTimeout: Number,
    texts: Object,
    visible: Boolean,
    width: Number
  }
});
(DxDataGridHeaderFilter as any).$_optionName = "headerFilter";
(DxDataGridHeaderFilter as any).$_expectedChildren = {
  dataGridHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  dataGridHeaderFilterTexts: { isCollectionItem: false, optionName: "texts" },
  search: { isCollectionItem: false, optionName: "search" },
  texts: { isCollectionItem: false, optionName: "texts" }
};
const DxDataGridHeaderFilterSearch = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:editorOptions": null,
    "update:enabled": null,
    "update:mode": null,
    "update:timeout": null,
  },
  props: {
    editorOptions: {},
    enabled: Boolean,
    mode: String,
    timeout: Number
  }
});
(DxDataGridHeaderFilterSearch as any).$_optionName = "search";
const DxDataGridHeaderFilterTexts = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cancel": null,
    "update:emptyValue": null,
    "update:ok": null,
  },
  props: {
    cancel: String,
    emptyValue: String,
    ok: String
  }
});
(DxDataGridHeaderFilterTexts as any).$_optionName = "texts";
const DxDataGridSelection = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSelectAll": null,
    "update:deferred": null,
    "update:mode": null,
    "update:selectAllMode": null,
    "update:showCheckBoxesMode": null,
  },
  props: {
    allowSelectAll: Boolean,
    deferred: Boolean,
    mode: String,
    selectAllMode: String,
    showCheckBoxesMode: String
  }
});
(DxDataGridSelection as any).$_optionName = "selection";
const DxEditing = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowAdding": null,
    "update:allowDeleting": null,
    "update:allowUpdating": null,
    "update:changes": null,
    "update:confirmDelete": null,
    "update:editColumnName": null,
    "update:editRowKey": null,
    "update:form": null,
    "update:mode": null,
    "update:newRowPosition": null,
    "update:popup": null,
    "update:refreshMode": null,
    "update:selectTextOnEditStart": null,
    "update:startEditAction": null,
    "update:texts": null,
    "update:useIcons": null,
  },
  props: {
    allowAdding: Boolean,
    allowDeleting: [Boolean, Function],
    allowUpdating: [Boolean, Function],
    changes: Array,
    confirmDelete: Boolean,
    editColumnName: String,
    editRowKey: {},
    form: Object,
    mode: String,
    newRowPosition: String,
    popup: Object,
    refreshMode: String,
    selectTextOnEditStart: Boolean,
    startEditAction: String,
    texts: {},
    useIcons: Boolean
  }
});
(DxEditing as any).$_optionName = "editing";
(DxEditing as any).$_expectedChildren = {
  change: { isCollectionItem: true, optionName: "changes" },
  editingTexts: { isCollectionItem: false, optionName: "texts" },
  form: { isCollectionItem: false, optionName: "form" },
  popup: { isCollectionItem: false, optionName: "popup" },
  texts: { isCollectionItem: false, optionName: "texts" }
};
const DxEditingTexts = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:addRow": null,
    "update:cancelAllChanges": null,
    "update:cancelRowChanges": null,
    "update:confirmDeleteMessage": null,
    "update:confirmDeleteTitle": null,
    "update:deleteRow": null,
    "update:editRow": null,
    "update:saveAllChanges": null,
    "update:saveRowChanges": null,
    "update:undeleteRow": null,
    "update:validationCancelChanges": null,
  },
  props: {
    addRow: String,
    cancelAllChanges: String,
    cancelRowChanges: String,
    confirmDeleteMessage: String,
    confirmDeleteTitle: String,
    deleteRow: String,
    editRow: String,
    saveAllChanges: String,
    saveRowChanges: String,
    undeleteRow: String,
    validationCancelChanges: String
  }
});
(DxEditingTexts as any).$_optionName = "texts";
const DxEmailRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    type: String
  }
});
(DxEmailRule as any).$_optionName = "validationRules";
(DxEmailRule as any).$_isCollectionItem = true;
(DxEmailRule as any).$_predefinedProps = {
  type: "email"
};
const DxExport = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowExportSelectedData": null,
    "update:enabled": null,
    "update:formats": null,
    "update:texts": null,
  },
  props: {
    allowExportSelectedData: Boolean,
    enabled: Boolean,
    formats: Array,
    texts: Object
  }
});
(DxExport as any).$_optionName = "export";
(DxExport as any).$_expectedChildren = {
  exportTexts: { isCollectionItem: false, optionName: "texts" },
  texts: { isCollectionItem: false, optionName: "texts" }
};
const DxExportTexts = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:exportAll": null,
    "update:exportSelectedRows": null,
    "update:exportTo": null,
  },
  props: {
    exportAll: String,
    exportSelectedRows: String,
    exportTo: String
  }
});
(DxExportTexts as any).$_optionName = "texts";
const DxField = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:calculateFilterExpression": null,
    "update:caption": null,
    "update:customizeText": null,
    "update:dataField": null,
    "update:dataType": null,
    "update:editorOptions": null,
    "update:editorTemplate": null,
    "update:falseText": null,
    "update:filterOperations": null,
    "update:format": null,
    "update:lookup": null,
    "update:name": null,
    "update:trueText": null,
  },
  props: {
    calculateFilterExpression: Function,
    caption: String,
    customizeText: Function,
    dataField: String,
    dataType: String,
    editorOptions: {},
    editorTemplate: {},
    falseText: String,
    filterOperations: Array,
    format: [Object, Function, String],
    lookup: Object,
    name: String,
    trueText: String
  }
});
(DxField as any).$_optionName = "fields";
(DxField as any).$_isCollectionItem = true;
(DxField as any).$_expectedChildren = {
  fieldLookup: { isCollectionItem: false, optionName: "lookup" },
  format: { isCollectionItem: false, optionName: "format" },
  lookup: { isCollectionItem: false, optionName: "lookup" }
};
const DxFieldLookup = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowClearing": null,
    "update:dataSource": null,
    "update:displayExpr": null,
    "update:valueExpr": null,
  },
  props: {
    allowClearing: Boolean,
    dataSource: [Array, Object],
    displayExpr: [Function, String],
    valueExpr: [Function, String]
  }
});
(DxFieldLookup as any).$_optionName = "lookup";
const DxFilterBuilder = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowHierarchicalFields": null,
    "update:bindingOptions": null,
    "update:customOperations": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:fields": null,
    "update:filterOperationDescriptions": null,
    "update:focusStateEnabled": null,
    "update:groupOperationDescriptions": null,
    "update:groupOperations": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:maxGroupLevel": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onEditorPrepared": null,
    "update:onEditorPreparing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:rtlEnabled": null,
    "update:tabIndex": null,
    "update:value": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowHierarchicalFields: Boolean,
    bindingOptions: Object,
    customOperations: Array,
    disabled: Boolean,
    elementAttr: Object,
    fields: Array,
    filterOperationDescriptions: Object,
    focusStateEnabled: Boolean,
    groupOperationDescriptions: Object,
    groupOperations: Array,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    maxGroupLevel: Number,
    onContentReady: Function,
    onDisposing: Function,
    onEditorPrepared: Function,
    onEditorPreparing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onValueChanged: Function,
    rtlEnabled: Boolean,
    tabIndex: Number,
    value: [Array, Function, String],
    visible: Boolean,
    width: [Function, Number, String]
  }
});
(DxFilterBuilder as any).$_optionName = "filterBuilder";
(DxFilterBuilder as any).$_expectedChildren = {
  customOperation: { isCollectionItem: true, optionName: "customOperations" },
  field: { isCollectionItem: true, optionName: "fields" },
  filterOperationDescriptions: { isCollectionItem: false, optionName: "filterOperationDescriptions" },
  groupOperationDescriptions: { isCollectionItem: false, optionName: "groupOperationDescriptions" }
};
const DxFilterBuilderPopup = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:animation": null,
    "update:bindingOptions": null,
    "update:closeOnOutsideClick": null,
    "update:container": null,
    "update:contentTemplate": null,
    "update:copyRootClassesToWrapper": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:dragAndResizeArea": null,
    "update:dragEnabled": null,
    "update:dragOutsideBoundary": null,
    "update:elementAttr": null,
    "update:enableBodyScroll": null,
    "update:focusStateEnabled": null,
    "update:fullScreen": null,
    "update:height": null,
    "update:hideOnOutsideClick": null,
    "update:hideOnParentScroll": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:maxHeight": null,
    "update:maxWidth": null,
    "update:minHeight": null,
    "update:minWidth": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onHidden": null,
    "update:onHiding": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onResize": null,
    "update:onResizeEnd": null,
    "update:onResizeStart": null,
    "update:onShowing": null,
    "update:onShown": null,
    "update:onTitleRendered": null,
    "update:position": null,
    "update:resizeEnabled": null,
    "update:restorePosition": null,
    "update:rtlEnabled": null,
    "update:shading": null,
    "update:shadingColor": null,
    "update:showCloseButton": null,
    "update:showTitle": null,
    "update:tabIndex": null,
    "update:title": null,
    "update:titleTemplate": null,
    "update:toolbarItems": null,
    "update:visible": null,
    "update:width": null,
    "update:wrapperAttr": null,
  },
  props: {
    accessKey: String,
    animation: Object,
    bindingOptions: Object,
    closeOnOutsideClick: [Boolean, Function],
    container: {},
    contentTemplate: {},
    copyRootClassesToWrapper: Boolean,
    deferRendering: Boolean,
    disabled: Boolean,
    dragAndResizeArea: {},
    dragEnabled: Boolean,
    dragOutsideBoundary: Boolean,
    elementAttr: {},
    enableBodyScroll: Boolean,
    focusStateEnabled: Boolean,
    fullScreen: Boolean,
    height: [Function, Number, String],
    hideOnOutsideClick: [Boolean, Function],
    hideOnParentScroll: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    maxHeight: [Function, Number, String],
    maxWidth: [Function, Number, String],
    minHeight: [Function, Number, String],
    minWidth: [Function, Number, String],
    onContentReady: Function,
    onDisposing: Function,
    onHidden: Function,
    onHiding: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onResize: Function,
    onResizeEnd: Function,
    onResizeStart: Function,
    onShowing: Function,
    onShown: Function,
    onTitleRendered: Function,
    position: [Function, Object, String],
    resizeEnabled: Boolean,
    restorePosition: Boolean,
    rtlEnabled: Boolean,
    shading: Boolean,
    shadingColor: String,
    showCloseButton: Boolean,
    showTitle: Boolean,
    tabIndex: Number,
    title: String,
    titleTemplate: {},
    toolbarItems: Array,
    visible: Boolean,
    width: [Function, Number, String],
    wrapperAttr: {}
  }
});
(DxFilterBuilderPopup as any).$_optionName = "filterBuilderPopup";
const DxFilterOperationDescriptions = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:between": null,
    "update:contains": null,
    "update:endsWith": null,
    "update:equal": null,
    "update:greaterThan": null,
    "update:greaterThanOrEqual": null,
    "update:isBlank": null,
    "update:isNotBlank": null,
    "update:lessThan": null,
    "update:lessThanOrEqual": null,
    "update:notContains": null,
    "update:notEqual": null,
    "update:startsWith": null,
  },
  props: {
    between: String,
    contains: String,
    endsWith: String,
    equal: String,
    greaterThan: String,
    greaterThanOrEqual: String,
    isBlank: String,
    isNotBlank: String,
    lessThan: String,
    lessThanOrEqual: String,
    notContains: String,
    notEqual: String,
    startsWith: String
  }
});
(DxFilterOperationDescriptions as any).$_optionName = "filterOperationDescriptions";
const DxFilterPanel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customizeText": null,
    "update:filterEnabled": null,
    "update:texts": null,
    "update:visible": null,
  },
  props: {
    customizeText: Function,
    filterEnabled: Boolean,
    texts: Object,
    visible: Boolean
  }
});
(DxFilterPanel as any).$_optionName = "filterPanel";
(DxFilterPanel as any).$_expectedChildren = {
  filterPanelTexts: { isCollectionItem: false, optionName: "texts" },
  texts: { isCollectionItem: false, optionName: "texts" }
};
const DxFilterPanelTexts = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:clearFilter": null,
    "update:createFilter": null,
    "update:filterEnabledHint": null,
  },
  props: {
    clearFilter: String,
    createFilter: String,
    filterEnabledHint: String
  }
});
(DxFilterPanelTexts as any).$_optionName = "texts";
const DxFilterRow = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:applyFilter": null,
    "update:applyFilterText": null,
    "update:betweenEndText": null,
    "update:betweenStartText": null,
    "update:operationDescriptions": null,
    "update:resetOperationText": null,
    "update:showAllText": null,
    "update:showOperationChooser": null,
    "update:visible": null,
  },
  props: {
    applyFilter: String,
    applyFilterText: String,
    betweenEndText: String,
    betweenStartText: String,
    operationDescriptions: Object,
    resetOperationText: String,
    showAllText: String,
    showOperationChooser: Boolean,
    visible: Boolean
  }
});
(DxFilterRow as any).$_optionName = "filterRow";
(DxFilterRow as any).$_expectedChildren = {
  operationDescriptions: { isCollectionItem: false, optionName: "operationDescriptions" }
};
const DxForm = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:alignItemLabels": null,
    "update:alignItemLabelsInAllGroups": null,
    "update:bindingOptions": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:customizeItem": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:formData": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:labelLocation": null,
    "update:labelMode": null,
    "update:minColWidth": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onEditorEnterKey": null,
    "update:onFieldDataChanged": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:optionalMark": null,
    "update:readOnly": null,
    "update:requiredMark": null,
    "update:requiredMessage": null,
    "update:rtlEnabled": null,
    "update:screenByWidth": null,
    "update:scrollingEnabled": null,
    "update:showColonAfterLabel": null,
    "update:showOptionalMark": null,
    "update:showRequiredMark": null,
    "update:showValidationSummary": null,
    "update:tabIndex": null,
    "update:validationGroup": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    alignItemLabels: Boolean,
    alignItemLabelsInAllGroups: Boolean,
    bindingOptions: Object,
    colCount: [Number, String],
    colCountByScreen: Object,
    customizeItem: Function,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    formData: {},
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    items: Array,
    labelLocation: String,
    labelMode: String,
    minColWidth: Number,
    onContentReady: Function,
    onDisposing: Function,
    onEditorEnterKey: Function,
    onFieldDataChanged: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    optionalMark: String,
    readOnly: Boolean,
    requiredMark: String,
    requiredMessage: String,
    rtlEnabled: Boolean,
    screenByWidth: Function,
    scrollingEnabled: Boolean,
    showColonAfterLabel: Boolean,
    showOptionalMark: Boolean,
    showRequiredMark: Boolean,
    showValidationSummary: Boolean,
    tabIndex: Number,
    validationGroup: String,
    visible: Boolean,
    width: [Function, Number, String]
  }
});
(DxForm as any).$_optionName = "form";
(DxForm as any).$_expectedChildren = {
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" }
};
const DxFormat = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:currency": null,
    "update:formatter": null,
    "update:parser": null,
    "update:precision": null,
    "update:type": null,
    "update:useCurrencyAccountingStyle": null,
  },
  props: {
    currency: String,
    formatter: Function,
    parser: Function,
    precision: Number,
    type: String,
    useCurrencyAccountingStyle: Boolean
  }
});
(DxFormat as any).$_optionName = "format";
const DxFormItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:dataField": null,
    "update:editorOptions": null,
    "update:editorType": null,
    "update:helpText": null,
    "update:isRequired": null,
    "update:itemType": null,
    "update:label": null,
    "update:name": null,
    "update:template": null,
    "update:validationRules": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    colSpan: Number,
    cssClass: String,
    dataField: String,
    editorOptions: {},
    editorType: String,
    helpText: String,
    isRequired: Boolean,
    itemType: String,
    label: Object,
    name: String,
    template: {},
    validationRules: Array,
    visible: Boolean,
    visibleIndex: Number
  }
});
(DxFormItem as any).$_optionName = "formItem";
(DxFormItem as any).$_expectedChildren = {
  AsyncRule: { isCollectionItem: true, optionName: "validationRules" },
  CompareRule: { isCollectionItem: true, optionName: "validationRules" },
  CustomRule: { isCollectionItem: true, optionName: "validationRules" },
  EmailRule: { isCollectionItem: true, optionName: "validationRules" },
  label: { isCollectionItem: false, optionName: "label" },
  NumericRule: { isCollectionItem: true, optionName: "validationRules" },
  PatternRule: { isCollectionItem: true, optionName: "validationRules" },
  RangeRule: { isCollectionItem: true, optionName: "validationRules" },
  RequiredRule: { isCollectionItem: true, optionName: "validationRules" },
  StringLengthRule: { isCollectionItem: true, optionName: "validationRules" },
  validationRule: { isCollectionItem: true, optionName: "validationRules" }
};
const DxFrom = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:left": null,
    "update:opacity": null,
    "update:position": null,
    "update:scale": null,
    "update:top": null,
  },
  props: {
    left: Number,
    opacity: Number,
    position: Object,
    scale: Number,
    top: Number
  }
});
(DxFrom as any).$_optionName = "from";
(DxFrom as any).$_expectedChildren = {
  position: { isCollectionItem: false, optionName: "position" }
};
const DxGrouping = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowCollapsing": null,
    "update:autoExpandAll": null,
    "update:contextMenuEnabled": null,
    "update:expandMode": null,
    "update:texts": null,
  },
  props: {
    allowCollapsing: Boolean,
    autoExpandAll: Boolean,
    contextMenuEnabled: Boolean,
    expandMode: String,
    texts: Object
  }
});
(DxGrouping as any).$_optionName = "grouping";
(DxGrouping as any).$_expectedChildren = {
  groupingTexts: { isCollectionItem: false, optionName: "texts" },
  texts: { isCollectionItem: false, optionName: "texts" }
};
const DxGroupingTexts = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:groupByThisColumn": null,
    "update:groupContinuedMessage": null,
    "update:groupContinuesMessage": null,
    "update:ungroup": null,
    "update:ungroupAll": null,
  },
  props: {
    groupByThisColumn: String,
    groupContinuedMessage: String,
    groupContinuesMessage: String,
    ungroup: String,
    ungroupAll: String
  }
});
(DxGroupingTexts as any).$_optionName = "texts";
const DxGroupItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignByColumn": null,
    "update:column": null,
    "update:customizeText": null,
    "update:displayFormat": null,
    "update:name": null,
    "update:showInColumn": null,
    "update:showInGroupFooter": null,
    "update:skipEmptyValues": null,
    "update:summaryType": null,
    "update:valueFormat": null,
  },
  props: {
    alignByColumn: Boolean,
    column: String,
    customizeText: Function,
    displayFormat: String,
    name: String,
    showInColumn: String,
    showInGroupFooter: Boolean,
    skipEmptyValues: Boolean,
    summaryType: String,
    valueFormat: [Object, Function, String]
  }
});
(DxGroupItem as any).$_optionName = "groupItems";
(DxGroupItem as any).$_isCollectionItem = true;
(DxGroupItem as any).$_expectedChildren = {
  valueFormat: { isCollectionItem: false, optionName: "valueFormat" }
};
const DxGroupOperationDescriptions = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:and": null,
    "update:notAnd": null,
    "update:notOr": null,
    "update:or": null,
  },
  props: {
    and: String,
    notAnd: String,
    notOr: String,
    or: String
  }
});
(DxGroupOperationDescriptions as any).$_optionName = "groupOperationDescriptions";
const DxGroupPanel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowColumnDragging": null,
    "update:emptyPanelText": null,
    "update:visible": null,
  },
  props: {
    allowColumnDragging: Boolean,
    emptyPanelText: String,
    visible: [Boolean, String]
  }
});
(DxGroupPanel as any).$_optionName = "groupPanel";
const DxHeaderFilter = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:allowSelectAll": null,
    "update:dataSource": null,
    "update:groupInterval": null,
    "update:height": null,
    "update:search": null,
    "update:searchMode": null,
    "update:searchTimeout": null,
    "update:texts": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    allowSearch: Boolean,
    allowSelectAll: Boolean,
    dataSource: {},
    groupInterval: [Number, String],
    height: Number,
    search: Object,
    searchMode: String,
    searchTimeout: Number,
    texts: Object,
    visible: Boolean,
    width: Number
  }
});
(DxHeaderFilter as any).$_optionName = "headerFilter";
const DxHide = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:complete": null,
    "update:delay": null,
    "update:direction": null,
    "update:duration": null,
    "update:easing": null,
    "update:from": null,
    "update:staggerDelay": null,
    "update:start": null,
    "update:to": null,
    "update:type": null,
  },
  props: {
    complete: Function,
    delay: Number,
    direction: String,
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function,
    to: Object,
    type: String
  }
});
(DxHide as any).$_optionName = "hide";
(DxHide as any).$_expectedChildren = {
  from: { isCollectionItem: false, optionName: "from" },
  to: { isCollectionItem: false, optionName: "to" }
};
const DxItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:html": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:name": null,
    "update:options": null,
    "update:showText": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    cssClass: String,
    disabled: Boolean,
    html: String,
    locateInMenu: String,
    location: String,
    menuItemTemplate: {},
    name: String,
    options: {},
    showText: String,
    template: {},
    text: String,
    visible: Boolean,
    widget: String
  }
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
const DxKeyboardNavigation = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:editOnKeyPress": null,
    "update:enabled": null,
    "update:enterKeyAction": null,
    "update:enterKeyDirection": null,
  },
  props: {
    editOnKeyPress: Boolean,
    enabled: Boolean,
    enterKeyAction: String,
    enterKeyDirection: String
  }
});
(DxKeyboardNavigation as any).$_optionName = "keyboardNavigation";
const DxLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:location": null,
    "update:showColon": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    alignment: String,
    location: String,
    showColon: Boolean,
    template: {},
    text: String,
    visible: Boolean
  }
});
(DxLabel as any).$_optionName = "label";
const DxLoadPanel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:height": null,
    "update:indicatorSrc": null,
    "update:shading": null,
    "update:shadingColor": null,
    "update:showIndicator": null,
    "update:showPane": null,
    "update:text": null,
    "update:width": null,
  },
  props: {
    enabled: [Boolean, String],
    height: Number,
    indicatorSrc: String,
    shading: Boolean,
    shadingColor: String,
    showIndicator: Boolean,
    showPane: Boolean,
    text: String,
    width: Number
  }
});
(DxLoadPanel as any).$_optionName = "loadPanel";
const DxLookup = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowClearing": null,
    "update:calculateCellValue": null,
    "update:dataSource": null,
    "update:displayExpr": null,
    "update:valueExpr": null,
  },
  props: {
    allowClearing: Boolean,
    calculateCellValue: Function,
    dataSource: {},
    displayExpr: [Function, String],
    valueExpr: [String, Function]
  }
});
(DxLookup as any).$_optionName = "lookup";
const DxMasterDetail = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:autoExpandAll": null,
    "update:enabled": null,
    "update:template": null,
  },
  props: {
    autoExpandAll: Boolean,
    enabled: Boolean,
    template: {}
  }
});
(DxMasterDetail as any).$_optionName = "masterDetail";
const DxMy = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: String,
    y: String
  }
});
(DxMy as any).$_optionName = "my";
const DxNumericRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    type: String
  }
});
(DxNumericRule as any).$_optionName = "validationRules";
(DxNumericRule as any).$_isCollectionItem = true;
(DxNumericRule as any).$_predefinedProps = {
  type: "numeric"
};
const DxOffset = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: Number,
    y: Number
  }
});
(DxOffset as any).$_optionName = "offset";
const DxOperationDescriptions = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:between": null,
    "update:contains": null,
    "update:endsWith": null,
    "update:equal": null,
    "update:greaterThan": null,
    "update:greaterThanOrEqual": null,
    "update:lessThan": null,
    "update:lessThanOrEqual": null,
    "update:notContains": null,
    "update:notEqual": null,
    "update:startsWith": null,
  },
  props: {
    between: String,
    contains: String,
    endsWith: String,
    equal: String,
    greaterThan: String,
    greaterThanOrEqual: String,
    lessThan: String,
    lessThanOrEqual: String,
    notContains: String,
    notEqual: String,
    startsWith: String
  }
});
(DxOperationDescriptions as any).$_optionName = "operationDescriptions";
const DxPager = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowedPageSizes": null,
    "update:displayMode": null,
    "update:infoText": null,
    "update:label": null,
    "update:showInfo": null,
    "update:showNavigationButtons": null,
    "update:showPageSizeSelector": null,
    "update:visible": null,
  },
  props: {
    allowedPageSizes: [Array, String],
    displayMode: String,
    infoText: String,
    label: String,
    showInfo: Boolean,
    showNavigationButtons: Boolean,
    showPageSizeSelector: Boolean,
    visible: [Boolean, String]
  }
});
(DxPager as any).$_optionName = "pager";
const DxPaging = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:pageIndex": null,
    "update:pageSize": null,
  },
  props: {
    enabled: Boolean,
    pageIndex: Number,
    pageSize: Number
  }
});
(DxPaging as any).$_optionName = "paging";
const DxPatternRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:pattern": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    pattern: {},
    type: String
  }
});
(DxPatternRule as any).$_optionName = "validationRules";
(DxPatternRule as any).$_isCollectionItem = true;
(DxPatternRule as any).$_predefinedProps = {
  type: "pattern"
};
const DxPopup = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:animation": null,
    "update:bindingOptions": null,
    "update:closeOnOutsideClick": null,
    "update:container": null,
    "update:contentTemplate": null,
    "update:copyRootClassesToWrapper": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:dragAndResizeArea": null,
    "update:dragEnabled": null,
    "update:dragOutsideBoundary": null,
    "update:elementAttr": null,
    "update:enableBodyScroll": null,
    "update:focusStateEnabled": null,
    "update:fullScreen": null,
    "update:height": null,
    "update:hideOnOutsideClick": null,
    "update:hideOnParentScroll": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:maxHeight": null,
    "update:maxWidth": null,
    "update:minHeight": null,
    "update:minWidth": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onHidden": null,
    "update:onHiding": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onResize": null,
    "update:onResizeEnd": null,
    "update:onResizeStart": null,
    "update:onShowing": null,
    "update:onShown": null,
    "update:onTitleRendered": null,
    "update:position": null,
    "update:resizeEnabled": null,
    "update:restorePosition": null,
    "update:rtlEnabled": null,
    "update:shading": null,
    "update:shadingColor": null,
    "update:showCloseButton": null,
    "update:showTitle": null,
    "update:tabIndex": null,
    "update:title": null,
    "update:titleTemplate": null,
    "update:toolbarItems": null,
    "update:visible": null,
    "update:width": null,
    "update:wrapperAttr": null,
  },
  props: {
    accessKey: String,
    animation: Object,
    bindingOptions: Object,
    closeOnOutsideClick: [Boolean, Function],
    container: {},
    contentTemplate: {},
    copyRootClassesToWrapper: Boolean,
    deferRendering: Boolean,
    disabled: Boolean,
    dragAndResizeArea: {},
    dragEnabled: Boolean,
    dragOutsideBoundary: Boolean,
    elementAttr: {},
    enableBodyScroll: Boolean,
    focusStateEnabled: Boolean,
    fullScreen: Boolean,
    height: [Function, Number, String],
    hideOnOutsideClick: [Boolean, Function],
    hideOnParentScroll: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    maxHeight: [Function, Number, String],
    maxWidth: [Function, Number, String],
    minHeight: [Function, Number, String],
    minWidth: [Function, Number, String],
    onContentReady: Function,
    onDisposing: Function,
    onHidden: Function,
    onHiding: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onResize: Function,
    onResizeEnd: Function,
    onResizeStart: Function,
    onShowing: Function,
    onShown: Function,
    onTitleRendered: Function,
    position: [Function, Object, String],
    resizeEnabled: Boolean,
    restorePosition: Boolean,
    rtlEnabled: Boolean,
    shading: Boolean,
    shadingColor: String,
    showCloseButton: Boolean,
    showTitle: Boolean,
    tabIndex: Number,
    title: String,
    titleTemplate: {},
    toolbarItems: Array,
    visible: Boolean,
    width: [Function, Number, String],
    wrapperAttr: {}
  }
});
(DxPopup as any).$_optionName = "popup";
(DxPopup as any).$_expectedChildren = {
  animation: { isCollectionItem: false, optionName: "animation" },
  position: { isCollectionItem: false, optionName: "position" },
  toolbarItem: { isCollectionItem: true, optionName: "toolbarItems" }
};
const DxPosition = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:at": null,
    "update:boundary": null,
    "update:boundaryOffset": null,
    "update:collision": null,
    "update:my": null,
    "update:of": null,
    "update:offset": null,
  },
  props: {
    at: [Object, String],
    boundary: {},
    boundaryOffset: [Object, String],
    collision: [Object, String],
    my: [Object, String],
    of: {},
    offset: [Object, String]
  }
});
(DxPosition as any).$_optionName = "position";
const DxRangeRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:reevaluate": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    max: {},
    message: String,
    min: {},
    reevaluate: Boolean,
    type: String
  }
});
(DxRangeRule as any).$_optionName = "validationRules";
(DxRangeRule as any).$_isCollectionItem = true;
(DxRangeRule as any).$_predefinedProps = {
  type: "range"
};
const DxRemoteOperations = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:filtering": null,
    "update:grouping": null,
    "update:groupPaging": null,
    "update:paging": null,
    "update:sorting": null,
    "update:summary": null,
  },
  props: {
    filtering: Boolean,
    grouping: Boolean,
    groupPaging: Boolean,
    paging: Boolean,
    sorting: Boolean,
    summary: Boolean
  }
});
(DxRemoteOperations as any).$_optionName = "remoteOperations";
const DxRequiredRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:message": null,
    "update:trim": null,
    "update:type": null,
  },
  props: {
    message: String,
    trim: Boolean,
    type: String
  }
});
(DxRequiredRule as any).$_optionName = "validationRules";
(DxRequiredRule as any).$_isCollectionItem = true;
(DxRequiredRule as any).$_predefinedProps = {
  type: "required"
};
const DxRowDragging = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowDropInsideItem": null,
    "update:allowReordering": null,
    "update:autoScroll": null,
    "update:boundary": null,
    "update:container": null,
    "update:cursorOffset": null,
    "update:data": null,
    "update:dragDirection": null,
    "update:dragTemplate": null,
    "update:dropFeedbackMode": null,
    "update:filter": null,
    "update:group": null,
    "update:handle": null,
    "update:onAdd": null,
    "update:onDragChange": null,
    "update:onDragEnd": null,
    "update:onDragMove": null,
    "update:onDragStart": null,
    "update:onRemove": null,
    "update:onReorder": null,
    "update:scrollSensitivity": null,
    "update:scrollSpeed": null,
    "update:showDragIcons": null,
  },
  props: {
    allowDropInsideItem: Boolean,
    allowReordering: Boolean,
    autoScroll: Boolean,
    boundary: {},
    container: {},
    cursorOffset: [Object, String],
    data: {},
    dragDirection: String,
    dragTemplate: {},
    dropFeedbackMode: String,
    filter: String,
    group: String,
    handle: String,
    onAdd: Function,
    onDragChange: Function,
    onDragEnd: Function,
    onDragMove: Function,
    onDragStart: Function,
    onRemove: Function,
    onReorder: Function,
    scrollSensitivity: Number,
    scrollSpeed: Number,
    showDragIcons: Boolean
  }
});
(DxRowDragging as any).$_optionName = "rowDragging";
(DxRowDragging as any).$_expectedChildren = {
  cursorOffset: { isCollectionItem: false, optionName: "cursorOffset" }
};
const DxScrolling = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:columnRenderingMode": null,
    "update:mode": null,
    "update:preloadEnabled": null,
    "update:renderAsync": null,
    "update:rowRenderingMode": null,
    "update:scrollByContent": null,
    "update:scrollByThumb": null,
    "update:showScrollbar": null,
    "update:useNative": null,
  },
  props: {
    columnRenderingMode: String,
    mode: String,
    preloadEnabled: Boolean,
    renderAsync: Boolean,
    rowRenderingMode: String,
    scrollByContent: Boolean,
    scrollByThumb: Boolean,
    showScrollbar: String,
    useNative: [Boolean, String]
  }
});
(DxScrolling as any).$_optionName = "scrolling";
const DxSearch = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:editorOptions": null,
    "update:enabled": null,
    "update:mode": null,
    "update:searchExpr": null,
    "update:timeout": null,
  },
  props: {
    editorOptions: {},
    enabled: Boolean,
    mode: String,
    searchExpr: [Array, Function, String],
    timeout: Number
  }
});
(DxSearch as any).$_optionName = "search";
const DxSearchPanel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:highlightCaseSensitive": null,
    "update:highlightSearchText": null,
    "update:placeholder": null,
    "update:searchVisibleColumnsOnly": null,
    "update:text": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    highlightCaseSensitive: Boolean,
    highlightSearchText: Boolean,
    placeholder: String,
    searchVisibleColumnsOnly: Boolean,
    text: String,
    visible: Boolean,
    width: Number
  }
});
(DxSearchPanel as any).$_optionName = "searchPanel";
const DxSelection = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSelectAll": null,
    "update:deferred": null,
    "update:mode": null,
    "update:recursive": null,
    "update:selectAllMode": null,
    "update:selectByClick": null,
    "update:showCheckBoxesMode": null,
  },
  props: {
    allowSelectAll: Boolean,
    deferred: Boolean,
    mode: String,
    recursive: Boolean,
    selectAllMode: String,
    selectByClick: Boolean,
    showCheckBoxesMode: String
  }
});
(DxSelection as any).$_optionName = "selection";
const DxShow = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:complete": null,
    "update:delay": null,
    "update:direction": null,
    "update:duration": null,
    "update:easing": null,
    "update:from": null,
    "update:staggerDelay": null,
    "update:start": null,
    "update:to": null,
    "update:type": null,
  },
  props: {
    complete: Function,
    delay: Number,
    direction: String,
    duration: Number,
    easing: String,
    from: Object,
    staggerDelay: Number,
    start: Function,
    to: Object,
    type: String
  }
});
(DxShow as any).$_optionName = "show";
const DxSortByGroupSummaryInfo = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:groupColumn": null,
    "update:sortOrder": null,
    "update:summaryItem": null,
  },
  props: {
    groupColumn: String,
    sortOrder: String,
    summaryItem: [Number, String]
  }
});
(DxSortByGroupSummaryInfo as any).$_optionName = "sortByGroupSummaryInfo";
(DxSortByGroupSummaryInfo as any).$_isCollectionItem = true;
const DxSorting = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ascendingText": null,
    "update:clearText": null,
    "update:descendingText": null,
    "update:mode": null,
    "update:showSortIndexes": null,
  },
  props: {
    ascendingText: String,
    clearText: String,
    descendingText: String,
    mode: String,
    showSortIndexes: Boolean
  }
});
(DxSorting as any).$_optionName = "sorting";
const DxStateStoring = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customLoad": null,
    "update:customSave": null,
    "update:enabled": null,
    "update:savingTimeout": null,
    "update:storageKey": null,
    "update:type": null,
  },
  props: {
    customLoad: Function,
    customSave: Function,
    enabled: Boolean,
    savingTimeout: Number,
    storageKey: String,
    type: String
  }
});
(DxStateStoring as any).$_optionName = "stateStoring";
const DxStringLengthRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:trim": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    max: Number,
    message: String,
    min: Number,
    trim: Boolean,
    type: String
  }
});
(DxStringLengthRule as any).$_optionName = "validationRules";
(DxStringLengthRule as any).$_isCollectionItem = true;
(DxStringLengthRule as any).$_predefinedProps = {
  type: "stringLength"
};
const DxSummary = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:calculateCustomSummary": null,
    "update:groupItems": null,
    "update:recalculateWhileEditing": null,
    "update:skipEmptyValues": null,
    "update:texts": null,
    "update:totalItems": null,
  },
  props: {
    calculateCustomSummary: Function,
    groupItems: Array,
    recalculateWhileEditing: Boolean,
    skipEmptyValues: Boolean,
    texts: Object,
    totalItems: Array
  }
});
(DxSummary as any).$_optionName = "summary";
(DxSummary as any).$_expectedChildren = {
  groupItem: { isCollectionItem: true, optionName: "groupItems" },
  summaryTexts: { isCollectionItem: false, optionName: "texts" },
  texts: { isCollectionItem: false, optionName: "texts" },
  totalItem: { isCollectionItem: true, optionName: "totalItems" }
};
const DxSummaryTexts = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:avg": null,
    "update:avgOtherColumn": null,
    "update:count": null,
    "update:max": null,
    "update:maxOtherColumn": null,
    "update:min": null,
    "update:minOtherColumn": null,
    "update:sum": null,
    "update:sumOtherColumn": null,
  },
  props: {
    avg: String,
    avgOtherColumn: String,
    count: String,
    max: String,
    maxOtherColumn: String,
    min: String,
    minOtherColumn: String,
    sum: String,
    sumOtherColumn: String
  }
});
(DxSummaryTexts as any).$_optionName = "texts";
const DxTexts = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:addRow": null,
    "update:avg": null,
    "update:avgOtherColumn": null,
    "update:cancel": null,
    "update:cancelAllChanges": null,
    "update:cancelRowChanges": null,
    "update:clearFilter": null,
    "update:confirmDeleteMessage": null,
    "update:confirmDeleteTitle": null,
    "update:count": null,
    "update:createFilter": null,
    "update:deleteRow": null,
    "update:editRow": null,
    "update:emptyValue": null,
    "update:exportAll": null,
    "update:exportSelectedRows": null,
    "update:exportTo": null,
    "update:filterEnabledHint": null,
    "update:fix": null,
    "update:groupByThisColumn": null,
    "update:groupContinuedMessage": null,
    "update:groupContinuesMessage": null,
    "update:leftPosition": null,
    "update:max": null,
    "update:maxOtherColumn": null,
    "update:min": null,
    "update:minOtherColumn": null,
    "update:ok": null,
    "update:rightPosition": null,
    "update:saveAllChanges": null,
    "update:saveRowChanges": null,
    "update:sum": null,
    "update:sumOtherColumn": null,
    "update:undeleteRow": null,
    "update:unfix": null,
    "update:ungroup": null,
    "update:ungroupAll": null,
    "update:validationCancelChanges": null,
  },
  props: {
    addRow: String,
    avg: String,
    avgOtherColumn: String,
    cancel: String,
    cancelAllChanges: String,
    cancelRowChanges: String,
    clearFilter: String,
    confirmDeleteMessage: String,
    confirmDeleteTitle: String,
    count: String,
    createFilter: String,
    deleteRow: String,
    editRow: String,
    emptyValue: String,
    exportAll: String,
    exportSelectedRows: String,
    exportTo: String,
    filterEnabledHint: String,
    fix: String,
    groupByThisColumn: String,
    groupContinuedMessage: String,
    groupContinuesMessage: String,
    leftPosition: String,
    max: String,
    maxOtherColumn: String,
    min: String,
    minOtherColumn: String,
    ok: String,
    rightPosition: String,
    saveAllChanges: String,
    saveRowChanges: String,
    sum: String,
    sumOtherColumn: String,
    undeleteRow: String,
    unfix: String,
    ungroup: String,
    ungroupAll: String,
    validationCancelChanges: String
  }
});
(DxTexts as any).$_optionName = "texts";
const DxTo = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:left": null,
    "update:opacity": null,
    "update:position": null,
    "update:scale": null,
    "update:top": null,
  },
  props: {
    left: Number,
    opacity: Number,
    position: Object,
    scale: Number,
    top: Number
  }
});
(DxTo as any).$_optionName = "to";
const DxToolbar = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:items": null,
    "update:visible": null,
  },
  props: {
    disabled: Boolean,
    items: Array,
    visible: Boolean
  }
});
(DxToolbar as any).$_optionName = "toolbar";
(DxToolbar as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" }
};
const DxToolbarItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:html": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:options": null,
    "update:showText": null,
    "update:template": null,
    "update:text": null,
    "update:toolbar": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    cssClass: String,
    disabled: Boolean,
    html: String,
    locateInMenu: String,
    location: String,
    menuItemTemplate: {},
    options: {},
    showText: String,
    template: {},
    text: String,
    toolbar: String,
    visible: Boolean,
    widget: String
  }
});
(DxToolbarItem as any).$_optionName = "toolbarItems";
(DxToolbarItem as any).$_isCollectionItem = true;
const DxTotalItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:column": null,
    "update:cssClass": null,
    "update:customizeText": null,
    "update:displayFormat": null,
    "update:name": null,
    "update:showInColumn": null,
    "update:skipEmptyValues": null,
    "update:summaryType": null,
    "update:valueFormat": null,
  },
  props: {
    alignment: String,
    column: String,
    cssClass: String,
    customizeText: Function,
    displayFormat: String,
    name: String,
    showInColumn: String,
    skipEmptyValues: Boolean,
    summaryType: String,
    valueFormat: [Object, Function, String]
  }
});
(DxTotalItem as any).$_optionName = "totalItems";
(DxTotalItem as any).$_isCollectionItem = true;
(DxTotalItem as any).$_expectedChildren = {
  valueFormat: { isCollectionItem: false, optionName: "valueFormat" }
};
const DxValidationRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:comparisonTarget": null,
    "update:comparisonType": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:pattern": null,
    "update:reevaluate": null,
    "update:trim": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    comparisonTarget: Function,
    comparisonType: String,
    ignoreEmptyValue: Boolean,
    max: {},
    message: String,
    min: {},
    pattern: {},
    reevaluate: Boolean,
    trim: Boolean,
    type: String,
    validationCallback: Function
  }
});
(DxValidationRule as any).$_optionName = "validationRules";
(DxValidationRule as any).$_isCollectionItem = true;
(DxValidationRule as any).$_predefinedProps = {
  type: "required"
};
const DxValueFormat = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:currency": null,
    "update:formatter": null,
    "update:parser": null,
    "update:precision": null,
    "update:type": null,
    "update:useCurrencyAccountingStyle": null,
  },
  props: {
    currency: String,
    formatter: Function,
    parser: Function,
    precision: Number,
    type: String,
    useCurrencyAccountingStyle: Boolean
  }
});
(DxValueFormat as any).$_optionName = "valueFormat";

export default DxDataGrid;
export {
  DxDataGrid,
  DxAnimation,
  DxAsyncRule,
  DxAt,
  DxBoundaryOffset,
  DxButton,
  DxChange,
  DxColCountByScreen,
  DxCollision,
  DxColumn,
  DxColumnChooser,
  DxColumnChooserSearch,
  DxColumnChooserSelection,
  DxColumnFixing,
  DxColumnFixingTexts,
  DxColumnHeaderFilter,
  DxColumnHeaderFilterSearch,
  DxColumnLookup,
  DxCompareRule,
  DxCursorOffset,
  DxCustomOperation,
  DxCustomRule,
  DxDataGridHeaderFilter,
  DxDataGridHeaderFilterSearch,
  DxDataGridHeaderFilterTexts,
  DxDataGridSelection,
  DxEditing,
  DxEditingTexts,
  DxEmailRule,
  DxExport,
  DxExportTexts,
  DxField,
  DxFieldLookup,
  DxFilterBuilder,
  DxFilterBuilderPopup,
  DxFilterOperationDescriptions,
  DxFilterPanel,
  DxFilterPanelTexts,
  DxFilterRow,
  DxForm,
  DxFormat,
  DxFormItem,
  DxFrom,
  DxGrouping,
  DxGroupingTexts,
  DxGroupItem,
  DxGroupOperationDescriptions,
  DxGroupPanel,
  DxHeaderFilter,
  DxHide,
  DxItem,
  DxKeyboardNavigation,
  DxLabel,
  DxLoadPanel,
  DxLookup,
  DxMasterDetail,
  DxMy,
  DxNumericRule,
  DxOffset,
  DxOperationDescriptions,
  DxPager,
  DxPaging,
  DxPatternRule,
  DxPopup,
  DxPosition,
  DxRangeRule,
  DxRemoteOperations,
  DxRequiredRule,
  DxRowDragging,
  DxScrolling,
  DxSearch,
  DxSearchPanel,
  DxSelection,
  DxShow,
  DxSortByGroupSummaryInfo,
  DxSorting,
  DxStateStoring,
  DxStringLengthRule,
  DxSummary,
  DxSummaryTexts,
  DxTexts,
  DxTo,
  DxToolbar,
  DxToolbarItem,
  DxTotalItem,
  DxValidationRule,
  DxValueFormat
};
import type * as DxDataGridTypes from "devextreme/ui/data_grid_types";
export { DxDataGridTypes };

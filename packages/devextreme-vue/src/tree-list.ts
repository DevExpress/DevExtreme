export { ExplicitTypes } from "devextreme/ui/tree_list";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import TreeList, { Properties } from "devextreme/ui/tree_list";
import  DataSource from "devextreme/data/data_source";
import  dxTreeList from "devextreme/ui/tree_list";
import  dxOverlay from "devextreme/ui/overlay";
import  DOMComponent from "devextreme/core/dom_component";
import  dxPopup from "devextreme/ui/popup";
import  dxSortable from "devextreme/ui/sortable";
import  dxDraggable from "devextreme/ui/draggable";
import {
 AIAssistant,
 ColumnChooser,
 ColumnResizeMode,
 FilterPanel,
 HeaderFilter,
 Pager,
 SearchPanel,
 Sorting,
 AIColumnMode,
 CommandInfo,
 ResponseStatusTexts,
 ResponseStatus,
 DataChangeType,
 ColumnAIOptions,
 FilterOperation,
 FilterType,
 FixedPosition,
 ColumnHeaderFilter,
 SelectedFilterOperation,
 ColumnChooserMode,
 ColumnChooserSearchConfig,
 ColumnChooserSelectionConfig,
 HeaderFilterGroupInterval,
 ColumnHeaderFilterSearchConfig,
 HeaderFilterSearchConfig,
 DataChange,
 GridsEditMode,
 GridsEditRefreshMode,
 StartEditAction,
 FilterPanelTexts,
 ApplyFilterMode,
 HeaderFilterTexts,
 EnterKeyAction,
 EnterKeyDirection,
 PagerPageSize,
 GridBase,
 DataRenderMode,
 StateStoreType,
} from "devextreme/common/grids";
import {
 AIIntegration,
} from "devextreme/common/ai-integration";
import {
 dxTreeListColumn,
 TreeListFilterMode,
 AdaptiveDetailRowPreparingEvent,
 AIAssistantRequestCreatingEvent,
 AIColumnRequestCreatingEvent,
 CellClickEvent,
 CellDblClickEvent,
 CellHoverChangedEvent,
 CellPreparedEvent,
 ContentReadyEvent,
 ContextMenuPreparingEvent,
 DataErrorOccurredEvent,
 DisposingEvent,
 EditCanceledEvent,
 EditCancelingEvent,
 EditingStartEvent,
 EditorPreparedEvent,
 EditorPreparingEvent,
 FocusedCellChangedEvent,
 FocusedCellChangingEvent,
 FocusedRowChangedEvent,
 FocusedRowChangingEvent,
 InitializedEvent,
 InitNewRowEvent,
 KeyDownEvent,
 NodesInitializedEvent,
 OptionChangedEvent,
 RowClickEvent,
 RowCollapsedEvent,
 RowCollapsingEvent,
 RowDblClickEvent,
 RowExpandedEvent,
 RowExpandingEvent,
 RowInsertedEvent,
 RowInsertingEvent,
 RowPreparedEvent,
 RowRemovedEvent,
 RowRemovingEvent,
 RowUpdatedEvent,
 RowUpdatingEvent,
 RowValidatingEvent,
 SavedEvent,
 SavingEvent,
 SelectionChangedEvent,
 ToolbarPreparingEvent,
 dxTreeListToolbar,
 dxTreeListRowObject,
 TreeListPredefinedColumnButton,
 ColumnButtonClickEvent,
 dxTreeListColumnButton,
 TreeListCommandColumnType,
 TreeListPredefinedToolbarItem,
 dxTreeListToolbarItem,
} from "devextreme/ui/tree_list";
import {
 Mode,
 DataStructure,
 ValidationRuleType,
 HorizontalAlignment,
 VerticalAlignment,
 TextEditorButtonLocation,
 ButtonStyle,
 ButtonType,
 DataType,
 Format as CommonFormat,
 SortOrder,
 SearchMode,
 ComparisonOperator,
 TextBoxPredefinedButton,
 TextEditorButton,
 LabelMode,
 MaskMode,
 EditorStyle,
 ValidationMessageMode,
 Position,
 ValidationStatus,
 PositionAlignment,
 Direction,
 ToolbarItemLocation,
 ToolbarItemComponent,
 DisplayMode,
 DragDirection,
 DragHighlight,
 ScrollMode,
 ScrollbarMode,
 SingleMultipleOrNone,
 TabsIconPosition,
 TabsStyle,
} from "devextreme/common";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 dxFilterBuilderOptions,
 dxFilterBuilderField,
 FieldInfo,
 FilterBuilderOperation,
 dxFilterBuilderCustomOperation,
 GroupOperation,
 ContentReadyEvent as FilterBuilderContentReadyEvent,
 DisposingEvent as FilterBuilderDisposingEvent,
 EditorPreparedEvent as FilterBuilderEditorPreparedEvent,
 EditorPreparingEvent as FilterBuilderEditorPreparingEvent,
 InitializedEvent as FilterBuilderInitializedEvent,
 OptionChangedEvent as FilterBuilderOptionChangedEvent,
 ValueChangedEvent as FilterBuilderValueChangedEvent,
} from "devextreme/ui/filter_builder";
import {
 dxPopupOptions,
 dxPopupToolbarItem,
 ToolbarLocation,
} from "devextreme/ui/popup";
import {
 PagerBase,
} from "devextreme/ui/pagination";
import {
 dxTextBoxOptions,
 TextBoxType,
 ChangeEvent,
 ContentReadyEvent as TextBoxContentReadyEvent,
 CopyEvent,
 CutEvent,
 DisposingEvent as TextBoxDisposingEvent,
 EnterKeyEvent,
 FocusInEvent,
 FocusOutEvent,
 InitializedEvent as TextBoxInitializedEvent,
 InputEvent,
 KeyDownEvent as TextBoxKeyDownEvent,
 KeyUpEvent,
 OptionChangedEvent as TextBoxOptionChangedEvent,
 PasteEvent,
 ValueChangedEvent,
} from "devextreme/ui/text_box";
import {
 AnimationConfig,
 CollisionResolution,
 PositionConfig,
 AnimationState,
 AnimationType,
 CollisionResolutionCombination,
} from "devextreme/common/core/animation";
import {
 dxButtonOptions,
 ClickEvent,
 ContentReadyEvent as ButtonContentReadyEvent,
 DisposingEvent as ButtonDisposingEvent,
 InitializedEvent as ButtonInitializedEvent,
 OptionChangedEvent as ButtonOptionChangedEvent,
} from "devextreme/ui/button";
import {
 FormItemType,
 FormPredefinedButtonItem,
 dxFormSimpleItem,
 dxFormOptions,
 dxFormGroupItem,
 dxFormTabbedItem,
 dxFormEmptyItem,
 dxFormButtonItem,
 LabelLocation,
 FormLabelMode,
 ContentReadyEvent as FormContentReadyEvent,
 DisposingEvent as FormDisposingEvent,
 EditorEnterKeyEvent,
 FieldDataChangedEvent,
 InitializedEvent as FormInitializedEvent,
 OptionChangedEvent as FormOptionChangedEvent,
 SmartPastedEvent,
 SmartPastingEvent,
 FormItemComponent,
} from "devextreme/ui/form";
import {
 Format,
} from "devextreme/common/core/localization";
import {
 event,
} from "devextreme/events/events.types";
import {
 EventInfo,
} from "devextreme/common/core/events";
import {
 Component,
} from "devextreme/core/component";
import {
 LoadingAnimationType,
} from "devextreme/ui/load_indicator";
import {
 dxTabPanelOptions,
 dxTabPanelItem,
 ContentReadyEvent as TabPanelContentReadyEvent,
 DisposingEvent as TabPanelDisposingEvent,
 InitializedEvent as TabPanelInitializedEvent,
 ItemClickEvent,
 ItemContextMenuEvent,
 ItemHoldEvent,
 ItemRenderedEvent,
 OptionChangedEvent as TabPanelOptionChangedEvent,
 SelectionChangedEvent as TabPanelSelectionChangedEvent,
 SelectionChangingEvent,
 TitleClickEvent,
 TitleHoldEvent,
 TitleRenderedEvent,
} from "devextreme/ui/tab_panel";
import {
 LocateInMenuMode,
 ShowTextMode,
} from "devextreme/ui/toolbar";
import {
 LoadPanelIndicatorProperties,
} from "devextreme/ui/load_panel";
import  * as CommonTypes from "devextreme/common";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "aiAssistant" |
  "aiIntegration" |
  "allowColumnReordering" |
  "allowColumnResizing" |
  "autoExpandAll" |
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
  "dataSource" |
  "dataStructure" |
  "dateSerializationFormat" |
  "disabled" |
  "editing" |
  "elementAttr" |
  "errorRowEnabled" |
  "expandedRowKeys" |
  "expandNodesOnFiltering" |
  "filterBuilder" |
  "filterBuilderPopup" |
  "filterMode" |
  "filterPanel" |
  "filterRow" |
  "filterSyncEnabled" |
  "filterValue" |
  "focusedColumnIndex" |
  "focusedRowEnabled" |
  "focusedRowIndex" |
  "focusedRowKey" |
  "hasItemsExpr" |
  "headerFilter" |
  "height" |
  "highlightChanges" |
  "hint" |
  "hoverStateEnabled" |
  "itemsExpr" |
  "keyboardNavigation" |
  "keyExpr" |
  "loadPanel" |
  "noDataText" |
  "onAdaptiveDetailRowPreparing" |
  "onAIAssistantRequestCreating" |
  "onAIColumnRequestCreating" |
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
  "onFocusedCellChanged" |
  "onFocusedCellChanging" |
  "onFocusedRowChanged" |
  "onFocusedRowChanging" |
  "onInitialized" |
  "onInitNewRow" |
  "onKeyDown" |
  "onNodesInitialized" |
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
  "parentIdExpr" |
  "remoteOperations" |
  "renderAsync" |
  "repaintChangesOnly" |
  "rootValue" |
  "rowAlternationEnabled" |
  "rowDragging" |
  "rtlEnabled" |
  "scrolling" |
  "searchPanel" |
  "selectedRowKeys" |
  "selection" |
  "showBorders" |
  "showColumnHeaders" |
  "showColumnLines" |
  "showRowLines" |
  "sorting" |
  "stateStoring" |
  "syncLookupFilterValues" |
  "tabIndex" |
  "toolbar" |
  "twoWayBindingEnabled" |
  "visible" |
  "width" |
  "wordWrapEnabled"
>;

interface DxTreeList extends AccessibleOptions {
  readonly instance?: TreeList;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    aiAssistant: Object as PropType<AIAssistant | Record<string, any>>,
    aiIntegration: Object as PropType<AIIntegration>,
    allowColumnReordering: Boolean,
    allowColumnResizing: Boolean,
    autoExpandAll: Boolean,
    autoNavigateToFocusedRow: Boolean,
    cacheEnabled: Boolean,
    cellHintEnabled: Boolean,
    columnAutoWidth: Boolean,
    columnChooser: Object as PropType<ColumnChooser | Record<string, any>>,
    columnFixing: Object as PropType<Record<string, any>>,
    columnHidingEnabled: Boolean,
    columnMinWidth: Number,
    columnResizingMode: String as PropType<ColumnResizeMode>,
    columns: Array as PropType<Array<dxTreeListColumn | string>>,
    columnWidth: [String, Number] as PropType<Mode | number>,
    customizeColumns: Function as PropType<((columns: Array<dxTreeListColumn>) => void)>,
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    dataStructure: String as PropType<DataStructure>,
    dateSerializationFormat: String,
    disabled: Boolean,
    editing: Object as PropType<Record<string, any>>,
    elementAttr: Object as PropType<Record<string, any>>,
    errorRowEnabled: Boolean,
    expandedRowKeys: Array as PropType<Array<any>>,
    expandNodesOnFiltering: Boolean,
    filterBuilder: Object as PropType<dxFilterBuilderOptions | Record<string, any>>,
    filterBuilderPopup: Object as PropType<dxPopupOptions<any> | Record<string, any>>,
    filterMode: String as PropType<TreeListFilterMode>,
    filterPanel: Object as PropType<FilterPanel>,
    filterRow: Object as PropType<Record<string, any>>,
    filterSyncEnabled: [Boolean, String] as PropType<boolean | Mode>,
    filterValue: [Array, Function, String] as PropType<Array<any> | ((() => any)) | string>,
    focusedColumnIndex: Number,
    focusedRowEnabled: Boolean,
    focusedRowIndex: Number,
    focusedRowKey: {},
    hasItemsExpr: [Function, String] as PropType<(((item: any, value: boolean) => boolean | undefined)) | string>,
    headerFilter: Object as PropType<HeaderFilter | Record<string, any>>,
    height: [Number, String],
    highlightChanges: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    itemsExpr: [Function, String] as PropType<(((item: any, value: Array<any>) => Array<any> | undefined)) | string>,
    keyboardNavigation: Object as PropType<Record<string, any>>,
    keyExpr: [Function, String] as PropType<(((item: any, value: any) => any)) | string>,
    loadPanel: Object as PropType<Record<string, any>>,
    noDataText: String,
    onAdaptiveDetailRowPreparing: Function as PropType<((e: AdaptiveDetailRowPreparingEvent) => void)>,
    onAIAssistantRequestCreating: Function as PropType<((e: AIAssistantRequestCreatingEvent) => void)>,
    onAIColumnRequestCreating: Function as PropType<((e: AIColumnRequestCreatingEvent) => void)>,
    onCellClick: Function as PropType<((e: CellClickEvent) => void)>,
    onCellDblClick: Function as PropType<((e: CellDblClickEvent) => void)>,
    onCellHoverChanged: Function as PropType<((e: CellHoverChangedEvent) => void)>,
    onCellPrepared: Function as PropType<((e: CellPreparedEvent) => void)>,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onContextMenuPreparing: Function as PropType<((e: ContextMenuPreparingEvent) => void)>,
    onDataErrorOccurred: Function as PropType<((e: DataErrorOccurredEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onEditCanceled: Function as PropType<((e: EditCanceledEvent) => void)>,
    onEditCanceling: Function as PropType<((e: EditCancelingEvent) => void)>,
    onEditingStart: Function as PropType<((e: EditingStartEvent) => void)>,
    onEditorPrepared: Function as PropType<((e: EditorPreparedEvent) => void)>,
    onEditorPreparing: Function as PropType<((e: EditorPreparingEvent) => void)>,
    onFocusedCellChanged: Function as PropType<((e: FocusedCellChangedEvent) => void)>,
    onFocusedCellChanging: Function as PropType<((e: FocusedCellChangingEvent) => void)>,
    onFocusedRowChanged: Function as PropType<((e: FocusedRowChangedEvent) => void)>,
    onFocusedRowChanging: Function as PropType<((e: FocusedRowChangingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onInitNewRow: Function as PropType<((e: InitNewRowEvent) => void)>,
    onKeyDown: Function as PropType<((e: KeyDownEvent) => void)>,
    onNodesInitialized: Function as PropType<((e: NodesInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onRowClick: Function as PropType<((e: RowClickEvent) => void)>,
    onRowCollapsed: Function as PropType<((e: RowCollapsedEvent) => void)>,
    onRowCollapsing: Function as PropType<((e: RowCollapsingEvent) => void)>,
    onRowDblClick: Function as PropType<((e: RowDblClickEvent) => void)>,
    onRowExpanded: Function as PropType<((e: RowExpandedEvent) => void)>,
    onRowExpanding: Function as PropType<((e: RowExpandingEvent) => void)>,
    onRowInserted: Function as PropType<((e: RowInsertedEvent) => void)>,
    onRowInserting: Function as PropType<((e: RowInsertingEvent) => void)>,
    onRowPrepared: Function as PropType<((e: RowPreparedEvent) => void)>,
    onRowRemoved: Function as PropType<((e: RowRemovedEvent) => void)>,
    onRowRemoving: Function as PropType<((e: RowRemovingEvent) => void)>,
    onRowUpdated: Function as PropType<((e: RowUpdatedEvent) => void)>,
    onRowUpdating: Function as PropType<((e: RowUpdatingEvent) => void)>,
    onRowValidating: Function as PropType<((e: RowValidatingEvent) => void)>,
    onSaved: Function as PropType<((e: SavedEvent) => void)>,
    onSaving: Function as PropType<((e: SavingEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: SelectionChangedEvent) => void)>,
    onToolbarPreparing: Function as PropType<((e: ToolbarPreparingEvent) => void)>,
    pager: Object as PropType<Pager | Record<string, any> | PagerBase>,
    paging: Object as PropType<Record<string, any>>,
    parentIdExpr: [Function, String] as PropType<(((item: any, value: any) => any | undefined)) | string>,
    remoteOperations: [String, Object] as PropType<Mode | Record<string, any>>,
    renderAsync: Boolean,
    repaintChangesOnly: Boolean,
    rootValue: {},
    rowAlternationEnabled: Boolean,
    rowDragging: Object as PropType<Record<string, any>>,
    rtlEnabled: Boolean,
    scrolling: Object as PropType<Record<string, any>>,
    searchPanel: Object as PropType<SearchPanel | Record<string, any>>,
    selectedRowKeys: Array as PropType<Array<any>>,
    selection: Object as PropType<Record<string, any>>,
    showBorders: Boolean,
    showColumnHeaders: Boolean,
    showColumnLines: Boolean,
    showRowLines: Boolean,
    sorting: Object as PropType<Sorting | Record<string, any>>,
    stateStoring: Object as PropType<Record<string, any>>,
    syncLookupFilterValues: Boolean,
    tabIndex: Number,
    toolbar: Object as PropType<dxTreeListToolbar | Record<string, any>>,
    twoWayBindingEnabled: Boolean,
    visible: Boolean,
    width: [Number, String],
    wordWrapEnabled: Boolean
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:aiAssistant": null,
    "update:aiIntegration": null,
    "update:allowColumnReordering": null,
    "update:allowColumnResizing": null,
    "update:autoExpandAll": null,
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
    "update:dataSource": null,
    "update:dataStructure": null,
    "update:dateSerializationFormat": null,
    "update:disabled": null,
    "update:editing": null,
    "update:elementAttr": null,
    "update:errorRowEnabled": null,
    "update:expandedRowKeys": null,
    "update:expandNodesOnFiltering": null,
    "update:filterBuilder": null,
    "update:filterBuilderPopup": null,
    "update:filterMode": null,
    "update:filterPanel": null,
    "update:filterRow": null,
    "update:filterSyncEnabled": null,
    "update:filterValue": null,
    "update:focusedColumnIndex": null,
    "update:focusedRowEnabled": null,
    "update:focusedRowIndex": null,
    "update:focusedRowKey": null,
    "update:hasItemsExpr": null,
    "update:headerFilter": null,
    "update:height": null,
    "update:highlightChanges": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:itemsExpr": null,
    "update:keyboardNavigation": null,
    "update:keyExpr": null,
    "update:loadPanel": null,
    "update:noDataText": null,
    "update:onAdaptiveDetailRowPreparing": null,
    "update:onAIAssistantRequestCreating": null,
    "update:onAIColumnRequestCreating": null,
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
    "update:onFocusedCellChanged": null,
    "update:onFocusedCellChanging": null,
    "update:onFocusedRowChanged": null,
    "update:onFocusedRowChanging": null,
    "update:onInitialized": null,
    "update:onInitNewRow": null,
    "update:onKeyDown": null,
    "update:onNodesInitialized": null,
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
    "update:parentIdExpr": null,
    "update:remoteOperations": null,
    "update:renderAsync": null,
    "update:repaintChangesOnly": null,
    "update:rootValue": null,
    "update:rowAlternationEnabled": null,
    "update:rowDragging": null,
    "update:rtlEnabled": null,
    "update:scrolling": null,
    "update:searchPanel": null,
    "update:selectedRowKeys": null,
    "update:selection": null,
    "update:showBorders": null,
    "update:showColumnHeaders": null,
    "update:showColumnLines": null,
    "update:showRowLines": null,
    "update:sorting": null,
    "update:stateStoring": null,
    "update:syncLookupFilterValues": null,
    "update:tabIndex": null,
    "update:toolbar": null,
    "update:twoWayBindingEnabled": null,
    "update:visible": null,
    "update:width": null,
    "update:wordWrapEnabled": null,
  },
  computed: {
    instance(): TreeList {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = TreeList;
    (this as any).$_hasAsyncTemplate = false;
    (this as any).$_expectedChildren = {
      aiAssistant: { isCollectionItem: false, optionName: "aiAssistant" },
      column: { isCollectionItem: true, optionName: "columns" },
      columnChooser: { isCollectionItem: false, optionName: "columnChooser" },
      columnFixing: { isCollectionItem: false, optionName: "columnFixing" },
      editing: { isCollectionItem: false, optionName: "editing" },
      filterBuilder: { isCollectionItem: false, optionName: "filterBuilder" },
      filterBuilderPopup: { isCollectionItem: false, optionName: "filterBuilderPopup" },
      filterPanel: { isCollectionItem: false, optionName: "filterPanel" },
      filterRow: { isCollectionItem: false, optionName: "filterRow" },
      headerFilter: { isCollectionItem: false, optionName: "headerFilter" },
      keyboardNavigation: { isCollectionItem: false, optionName: "keyboardNavigation" },
      loadPanel: { isCollectionItem: false, optionName: "loadPanel" },
      pager: { isCollectionItem: false, optionName: "pager" },
      paging: { isCollectionItem: false, optionName: "paging" },
      remoteOperations: { isCollectionItem: false, optionName: "remoteOperations" },
      rowDragging: { isCollectionItem: false, optionName: "rowDragging" },
      scrolling: { isCollectionItem: false, optionName: "scrolling" },
      searchPanel: { isCollectionItem: false, optionName: "searchPanel" },
      selection: { isCollectionItem: false, optionName: "selection" },
      sorting: { isCollectionItem: false, optionName: "sorting" },
      stateStoring: { isCollectionItem: false, optionName: "stateStoring" },
      toolbar: { isCollectionItem: false, optionName: "toolbar" },
      treeListHeaderFilter: { isCollectionItem: false, optionName: "headerFilter" },
      treeListSelection: { isCollectionItem: false, optionName: "selection" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxTreeList = defineComponent(componentConfig);


const DxAIConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aiIntegration": null,
    "update:editorOptions": null,
    "update:emptyText": null,
    "update:mode": null,
    "update:noDataText": null,
    "update:popup": null,
    "update:prompt": null,
    "update:showHeaderMenu": null,
  },
  props: {
    aiIntegration: Object as PropType<AIIntegration>,
    editorOptions: Object as PropType<dxTextBoxOptions<any> | Record<string, any>>,
    emptyText: String,
    mode: String as PropType<AIColumnMode>,
    noDataText: String,
    popup: Object as PropType<Record<string, any>>,
    prompt: String,
    showHeaderMenu: Boolean
  }
};

prepareConfigurationComponentConfig(DxAIConfig);

const DxAI = defineComponent(DxAIConfig);

(DxAI as any).$_optionName = "ai";
(DxAI as any).$_expectedChildren = {
  editorOptions: { isCollectionItem: false, optionName: "editorOptions" }
};

const DxAIAssistantConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aiIntegration": null,
    "update:chat": null,
    "update:customizeResponseText": null,
    "update:customizeResponseTitle": null,
    "update:enabled": null,
    "update:popup": null,
    "update:title": null,
  },
  props: {
    aiIntegration: Object as PropType<AIIntegration>,
    chat: Object as PropType<Record<string, any>>,
    customizeResponseText: Function as PropType<((command: CommandInfo) => ResponseStatusTexts)>,
    customizeResponseTitle: Function as PropType<((status: ResponseStatus, commandNames: Array<string>) => string)>,
    enabled: Boolean,
    popup: Object as PropType<dxPopupOptions<any> | Record<string, any>>,
    title: String
  }
};

prepareConfigurationComponentConfig(DxAIAssistantConfig);

const DxAIAssistant = defineComponent(DxAIAssistantConfig);

(DxAIAssistant as any).$_optionName = "aiAssistant";
(DxAIAssistant as any).$_expectedChildren = {
  popup: { isCollectionItem: false, optionName: "popup" }
};

const DxAIOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:instruction": null,
  },
  props: {
    disabled: Boolean,
    instruction: String
  }
};

prepareConfigurationComponentConfig(DxAIOptionsConfig);

const DxAIOptions = defineComponent(DxAIOptionsConfig);

(DxAIOptions as any).$_optionName = "aiOptions";

const DxAnimationConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:hide": null,
    "update:show": null,
  },
  props: {
    hide: [Object, Number, String] as PropType<AnimationConfig | number | Record<string, any> | string>,
    show: [Object, Number, String] as PropType<AnimationConfig | number | Record<string, any> | string>
  }
};

prepareConfigurationComponentConfig(DxAnimationConfig);

const DxAnimation = defineComponent(DxAnimationConfig);

(DxAnimation as any).$_optionName = "animation";
(DxAnimation as any).$_expectedChildren = {
  hide: { isCollectionItem: false, optionName: "hide" },
  show: { isCollectionItem: false, optionName: "show" }
};

const DxAsyncRuleConfig = {
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
    type: String as PropType<ValidationRuleType>,
    validationCallback: Function as PropType<((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: any }) => any)>
  }
};

prepareConfigurationComponentConfig(DxAsyncRuleConfig);

const DxAsyncRule = defineComponent(DxAsyncRuleConfig);

(DxAsyncRule as any).$_optionName = "validationRules";
(DxAsyncRule as any).$_isCollectionItem = true;
(DxAsyncRule as any).$_predefinedProps = {
  type: "async"
};

const DxAtConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: String as PropType<HorizontalAlignment>,
    y: String as PropType<VerticalAlignment>
  }
};

prepareConfigurationComponentConfig(DxAtConfig);

const DxAt = defineComponent(DxAtConfig);

(DxAt as any).$_optionName = "at";

const DxBoundaryOffsetConfig = {
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
};

prepareConfigurationComponentConfig(DxBoundaryOffsetConfig);

const DxBoundaryOffset = defineComponent(DxBoundaryOffsetConfig);

(DxBoundaryOffset as any).$_optionName = "boundaryOffset";

const DxButtonConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:hint": null,
    "update:icon": null,
    "update:location": null,
    "update:name": null,
    "update:onClick": null,
    "update:options": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    cssClass: String,
    disabled: [Boolean, Function] as PropType<boolean | (((options: { column: dxTreeListColumn, component: dxTreeList, row: dxTreeListRowObject }) => boolean))>,
    hint: String,
    icon: String,
    location: String as PropType<TextEditorButtonLocation>,
    name: String as PropType<string | TreeListPredefinedColumnButton>,
    onClick: Function as PropType<((e: ColumnButtonClickEvent) => void)>,
    options: Object as PropType<dxButtonOptions | Record<string, any>>,
    template: {},
    text: String,
    visible: [Boolean, Function] as PropType<boolean | (((options: { column: dxTreeListColumn, component: dxTreeList, row: dxTreeListRowObject }) => boolean))>
  }
};

prepareConfigurationComponentConfig(DxButtonConfig);

const DxButton = defineComponent(DxButtonConfig);

(DxButton as any).$_optionName = "buttons";
(DxButton as any).$_isCollectionItem = true;
(DxButton as any).$_expectedChildren = {
  options: { isCollectionItem: false, optionName: "options" }
};

const DxButtonItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:buttonOptions": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:horizontalAlignment": null,
    "update:itemType": null,
    "update:name": null,
    "update:verticalAlignment": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    buttonOptions: Object as PropType<dxButtonOptions | Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    itemType: String as PropType<FormItemType>,
    name: String as PropType<FormPredefinedButtonItem | string>,
    verticalAlignment: String as PropType<VerticalAlignment>,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxButtonItemConfig);

const DxButtonItem = defineComponent(DxButtonItemConfig);

(DxButtonItem as any).$_optionName = "items";
(DxButtonItem as any).$_isCollectionItem = true;
(DxButtonItem as any).$_predefinedProps = {
  itemType: "button"
};
(DxButtonItem as any).$_expectedChildren = {
  buttonOptions: { isCollectionItem: false, optionName: "buttonOptions" }
};

const DxButtonOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:icon": null,
    "update:onClick": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:template": null,
    "update:text": null,
    "update:type": null,
    "update:useSubmitBehavior": null,
    "update:validationGroup": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    onClick: Function as PropType<((e: ClickEvent) => void)>,
    onContentReady: Function as PropType<((e: ButtonContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: ButtonDisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: ButtonInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: ButtonOptionChangedEvent) => void)>,
    rtlEnabled: Boolean,
    stylingMode: String as PropType<ButtonStyle>,
    tabIndex: Number,
    template: {},
    text: String,
    type: String as PropType<ButtonType | string>,
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxButtonOptionsConfig);

const DxButtonOptions = defineComponent(DxButtonOptionsConfig);

(DxButtonOptions as any).$_optionName = "buttonOptions";

const DxChangeConfig = {
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
    type: String as PropType<DataChangeType>
  }
};

prepareConfigurationComponentConfig(DxChangeConfig);

const DxChange = defineComponent(DxChangeConfig);

(DxChange as any).$_optionName = "changes";
(DxChange as any).$_isCollectionItem = true;

const DxColCountByScreenConfig = {
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
};

prepareConfigurationComponentConfig(DxColCountByScreenConfig);

const DxColCountByScreen = defineComponent(DxColCountByScreenConfig);

(DxColCountByScreen as any).$_optionName = "colCountByScreen";

const DxCollisionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: String as PropType<CollisionResolution>,
    y: String as PropType<CollisionResolution>
  }
};

prepareConfigurationComponentConfig(DxCollisionConfig);

const DxCollision = defineComponent(DxCollisionConfig);

(DxCollision as any).$_optionName = "collision";

const DxColumnConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ai": null,
    "update:alignment": null,
    "update:allowEditing": null,
    "update:allowFiltering": null,
    "update:allowFixing": null,
    "update:allowHeaderFiltering": null,
    "update:allowHiding": null,
    "update:allowReordering": null,
    "update:allowResizing": null,
    "update:allowSearch": null,
    "update:allowSorting": null,
    "update:buttons": null,
    "update:calculateCellValue": null,
    "update:calculateDisplayValue": null,
    "update:calculateFilterExpression": null,
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
    ai: Object as PropType<ColumnAIOptions | Record<string, any>>,
    alignment: String as PropType<HorizontalAlignment>,
    allowEditing: Boolean,
    allowFiltering: Boolean,
    allowFixing: Boolean,
    allowHeaderFiltering: Boolean,
    allowHiding: Boolean,
    allowReordering: Boolean,
    allowResizing: Boolean,
    allowSearch: Boolean,
    allowSorting: Boolean,
    buttons: Array as PropType<Array<dxTreeListColumnButton | TreeListPredefinedColumnButton>>,
    calculateCellValue: Function as PropType<((rowData: any) => any)>,
    calculateDisplayValue: [Function, String] as PropType<(((rowData: any) => any)) | string>,
    calculateFilterExpression: Function as PropType<((filterValue: any, selectedFilterOperation: string | null, target: string) => string | (() => any) | Array<any>)>,
    calculateSortValue: [Function, String] as PropType<(((rowData: any) => any)) | string>,
    caption: String,
    cellTemplate: {},
    columns: Array as PropType<Array<dxTreeListColumn | string>>,
    cssClass: String,
    customizeText: Function as PropType<((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string)>,
    dataField: String,
    dataType: String as PropType<DataType>,
    editCellTemplate: {},
    editorOptions: {},
    encodeHtml: Boolean,
    falseText: String,
    filterOperations: Array as PropType<Array<FilterOperation | string>>,
    filterType: String as PropType<FilterType>,
    filterValue: {},
    filterValues: Array as PropType<Array<any>>,
    fixed: Boolean,
    fixedPosition: String as PropType<FixedPosition>,
    format: [Object, String, Function] as PropType<Format | CommonFormat | (((value: number | Date) => string)) | Record<string, any> | string>,
    formItem: Object as PropType<dxFormSimpleItem | Record<string, any>>,
    headerCellTemplate: {},
    headerFilter: Object as PropType<ColumnHeaderFilter | Record<string, any>>,
    hidingPriority: Number,
    isBand: Boolean,
    lookup: Object as PropType<Record<string, any>>,
    minWidth: Number,
    name: String,
    ownerBand: Number,
    renderAsync: Boolean,
    selectedFilterOperation: String as PropType<SelectedFilterOperation>,
    setCellValue: Function as PropType<((newData: any, value: any, currentRowData: any) => any)>,
    showEditorAlways: Boolean,
    showInColumnChooser: Boolean,
    sortIndex: Number,
    sortingMethod: Function as PropType<((value1: any, value2: any) => number)>,
    sortOrder: String as PropType<SortOrder>,
    trueText: String,
    type: String as PropType<TreeListCommandColumnType>,
    validationRules: Array as PropType<Array<CommonTypes.ValidationRule>>,
    visible: Boolean,
    visibleIndex: Number,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxColumnConfig);

const DxColumn = defineComponent(DxColumnConfig);

(DxColumn as any).$_optionName = "columns";
(DxColumn as any).$_isCollectionItem = true;
(DxColumn as any).$_expectedChildren = {
  ai: { isCollectionItem: false, optionName: "ai" },
  AsyncRule: { isCollectionItem: true, optionName: "validationRules" },
  button: { isCollectionItem: true, optionName: "buttons" },
  columnButton: { isCollectionItem: true, optionName: "buttons" },
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

const DxColumnButtonConfig = {
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
    disabled: [Boolean, Function] as PropType<boolean | (((options: { column: dxTreeListColumn, component: dxTreeList, row: dxTreeListRowObject }) => boolean))>,
    hint: String,
    icon: String,
    name: String as PropType<string | TreeListPredefinedColumnButton>,
    onClick: Function as PropType<((e: ColumnButtonClickEvent) => void)>,
    template: {},
    text: String,
    visible: [Boolean, Function] as PropType<boolean | (((options: { column: dxTreeListColumn, component: dxTreeList, row: dxTreeListRowObject }) => boolean))>
  }
};

prepareConfigurationComponentConfig(DxColumnButtonConfig);

const DxColumnButton = defineComponent(DxColumnButtonConfig);

(DxColumnButton as any).$_optionName = "buttons";
(DxColumnButton as any).$_isCollectionItem = true;

const DxColumnChooserConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:container": null,
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
    container: {},
    emptyPanelText: String,
    enabled: Boolean,
    height: [Number, String],
    mode: String as PropType<ColumnChooserMode>,
    position: Object as PropType<PositionConfig | Record<string, any>>,
    search: Object as PropType<ColumnChooserSearchConfig | Record<string, any>>,
    searchTimeout: Number,
    selection: Object as PropType<ColumnChooserSelectionConfig | Record<string, any>>,
    sortOrder: String as PropType<SortOrder>,
    title: String,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxColumnChooserConfig);

const DxColumnChooser = defineComponent(DxColumnChooserConfig);

(DxColumnChooser as any).$_optionName = "columnChooser";
(DxColumnChooser as any).$_expectedChildren = {
  columnChooserSearch: { isCollectionItem: false, optionName: "search" },
  columnChooserSelection: { isCollectionItem: false, optionName: "selection" },
  position: { isCollectionItem: false, optionName: "position" },
  search: { isCollectionItem: false, optionName: "search" },
  selection: { isCollectionItem: false, optionName: "selection" }
};

const DxColumnChooserSearchConfig = {
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
};

prepareConfigurationComponentConfig(DxColumnChooserSearchConfig);

const DxColumnChooserSearch = defineComponent(DxColumnChooserSearchConfig);

(DxColumnChooserSearch as any).$_optionName = "search";

const DxColumnChooserSelectionConfig = {
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
};

prepareConfigurationComponentConfig(DxColumnChooserSelectionConfig);

const DxColumnChooserSelection = defineComponent(DxColumnChooserSelectionConfig);

(DxColumnChooserSelection as any).$_optionName = "selection";

const DxColumnFixingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:icons": null,
    "update:texts": null,
  },
  props: {
    enabled: Boolean,
    icons: Object as PropType<Record<string, any>>,
    texts: Object as PropType<Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxColumnFixingConfig);

const DxColumnFixing = defineComponent(DxColumnFixingConfig);

(DxColumnFixing as any).$_optionName = "columnFixing";
(DxColumnFixing as any).$_expectedChildren = {
  columnFixingTexts: { isCollectionItem: false, optionName: "texts" },
  icons: { isCollectionItem: false, optionName: "icons" },
  texts: { isCollectionItem: false, optionName: "texts" }
};

const DxColumnFixingTextsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:fix": null,
    "update:leftPosition": null,
    "update:rightPosition": null,
    "update:stickyPosition": null,
    "update:unfix": null,
  },
  props: {
    fix: String,
    leftPosition: String,
    rightPosition: String,
    stickyPosition: String,
    unfix: String
  }
};

prepareConfigurationComponentConfig(DxColumnFixingTextsConfig);

const DxColumnFixingTexts = defineComponent(DxColumnFixingTextsConfig);

(DxColumnFixingTexts as any).$_optionName = "texts";

const DxColumnHeaderFilterConfig = {
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
    dataSource: [Array, Object, Function] as PropType<Array<any> | DataSourceOptions | (((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void)) | null | Store | Record<string, any>>,
    groupInterval: [String, Number] as PropType<HeaderFilterGroupInterval | number>,
    height: [Number, String],
    search: Object as PropType<ColumnHeaderFilterSearchConfig | HeaderFilterSearchConfig | Record<string, any>>,
    searchMode: String as PropType<SearchMode>,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxColumnHeaderFilterConfig);

const DxColumnHeaderFilter = defineComponent(DxColumnHeaderFilterConfig);

(DxColumnHeaderFilter as any).$_optionName = "headerFilter";
(DxColumnHeaderFilter as any).$_expectedChildren = {
  columnHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  search: { isCollectionItem: false, optionName: "search" }
};

const DxColumnHeaderFilterSearchConfig = {
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
    mode: String as PropType<SearchMode>,
    searchExpr: [Array, Function, String] as PropType<(Array<(() => any) | string>) | ((() => any)) | string>,
    timeout: Number
  }
};

prepareConfigurationComponentConfig(DxColumnHeaderFilterSearchConfig);

const DxColumnHeaderFilterSearch = defineComponent(DxColumnHeaderFilterSearchConfig);

(DxColumnHeaderFilterSearch as any).$_optionName = "search";

const DxColumnLookupConfig = {
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
    calculateCellValue: Function as PropType<((rowData: any) => any)>,
    dataSource: [Array, Object, Function] as PropType<Array<any> | DataSourceOptions | (((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions)) | null | Store | Record<string, any>>,
    displayExpr: [Function, String] as PropType<(((data: any) => string)) | string>,
    valueExpr: String
  }
};

prepareConfigurationComponentConfig(DxColumnLookupConfig);

const DxColumnLookup = defineComponent(DxColumnLookupConfig);

(DxColumnLookup as any).$_optionName = "lookup";

const DxCompareRuleConfig = {
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
    comparisonTarget: Function as PropType<(() => any)>,
    comparisonType: String as PropType<ComparisonOperator>,
    ignoreEmptyValue: Boolean,
    message: String,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxCompareRuleConfig);

const DxCompareRule = defineComponent(DxCompareRuleConfig);

(DxCompareRule as any).$_optionName = "validationRules";
(DxCompareRule as any).$_isCollectionItem = true;
(DxCompareRule as any).$_predefinedProps = {
  type: "compare"
};

const DxCursorOffsetConfig = {
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
};

prepareConfigurationComponentConfig(DxCursorOffsetConfig);

const DxCursorOffset = defineComponent(DxCursorOffsetConfig);

(DxCursorOffset as any).$_optionName = "cursorOffset";

const DxCustomOperationConfig = {
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
    calculateFilterExpression: Function as PropType<((filterValue: any, field: dxFilterBuilderField) => string | (() => any) | Array<any>)>,
    caption: String,
    customizeText: Function as PropType<((fieldInfo: FieldInfo) => string)>,
    dataTypes: Array as PropType<Array<DataType>>,
    editorTemplate: {},
    hasValue: Boolean,
    icon: String,
    name: String
  }
};

prepareConfigurationComponentConfig(DxCustomOperationConfig);

const DxCustomOperation = defineComponent(DxCustomOperationConfig);

(DxCustomOperation as any).$_optionName = "customOperations";
(DxCustomOperation as any).$_isCollectionItem = true;

const DxCustomRuleConfig = {
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
    type: String as PropType<ValidationRuleType>,
    validationCallback: Function as PropType<((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: any }) => boolean)>
  }
};

prepareConfigurationComponentConfig(DxCustomRuleConfig);

const DxCustomRule = defineComponent(DxCustomRuleConfig);

(DxCustomRule as any).$_optionName = "validationRules";
(DxCustomRule as any).$_isCollectionItem = true;
(DxCustomRule as any).$_predefinedProps = {
  type: "custom"
};

const DxEditingConfig = {
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
    "update:popup": null,
    "update:refreshMode": null,
    "update:selectTextOnEditStart": null,
    "update:startEditAction": null,
    "update:texts": null,
    "update:useIcons": null,
  },
  props: {
    allowAdding: [Boolean, Function] as PropType<boolean | (((options: { component: dxTreeList, row: dxTreeListRowObject }) => boolean))>,
    allowDeleting: [Boolean, Function] as PropType<boolean | (((options: { component: dxTreeList, row: dxTreeListRowObject }) => boolean))>,
    allowUpdating: [Boolean, Function] as PropType<boolean | (((options: { component: dxTreeList, row: dxTreeListRowObject }) => boolean))>,
    changes: Array as PropType<Array<DataChange>>,
    confirmDelete: Boolean,
    editColumnName: String,
    editRowKey: {},
    form: Object as PropType<dxFormOptions | Record<string, any>>,
    mode: String as PropType<GridsEditMode>,
    popup: Object as PropType<dxPopupOptions<any> | Record<string, any>>,
    refreshMode: String as PropType<GridsEditRefreshMode>,
    selectTextOnEditStart: Boolean,
    startEditAction: String as PropType<StartEditAction>,
    texts: Object as PropType<Record<string, any>>,
    useIcons: Boolean
  }
};

prepareConfigurationComponentConfig(DxEditingConfig);

const DxEditing = defineComponent(DxEditingConfig);

(DxEditing as any).$_optionName = "editing";
(DxEditing as any).$_expectedChildren = {
  change: { isCollectionItem: true, optionName: "changes" },
  editingTexts: { isCollectionItem: false, optionName: "texts" },
  form: { isCollectionItem: false, optionName: "form" },
  popup: { isCollectionItem: false, optionName: "popup" },
  texts: { isCollectionItem: false, optionName: "texts" }
};

const DxEditingTextsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:addRow": null,
    "update:addRowToNode": null,
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
    addRowToNode: String,
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
};

prepareConfigurationComponentConfig(DxEditingTextsConfig);

const DxEditingTexts = defineComponent(DxEditingTextsConfig);

(DxEditingTexts as any).$_optionName = "texts";

const DxEditorOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:buttons": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:inputAttr": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:label": null,
    "update:labelMode": null,
    "update:mask": null,
    "update:maskChar": null,
    "update:maskInvalidMessage": null,
    "update:maskRules": null,
    "update:maxLength": null,
    "update:mode": null,
    "update:name": null,
    "update:onChange": null,
    "update:onContentReady": null,
    "update:onCopy": null,
    "update:onCut": null,
    "update:onDisposing": null,
    "update:onEnterKey": null,
    "update:onFocusIn": null,
    "update:onFocusOut": null,
    "update:onInitialized": null,
    "update:onInput": null,
    "update:onKeyDown": null,
    "update:onKeyUp": null,
    "update:onOptionChanged": null,
    "update:onPaste": null,
    "update:onValueChanged": null,
    "update:placeholder": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:showClearButton": null,
    "update:showMaskMode": null,
    "update:spellcheck": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:text": null,
    "update:useMaskedValue": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:valueChangeEvent": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    buttons: Array as PropType<Array<string | TextBoxPredefinedButton | TextEditorButton>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    isDirty: Boolean,
    isValid: Boolean,
    label: String,
    labelMode: String as PropType<LabelMode>,
    mask: String,
    maskChar: String,
    maskInvalidMessage: String,
    maskRules: {},
    maxLength: [Number, String],
    mode: String as PropType<TextBoxType>,
    name: String,
    onChange: Function as PropType<((e: ChangeEvent) => void)>,
    onContentReady: Function as PropType<((e: TextBoxContentReadyEvent) => void)>,
    onCopy: Function as PropType<((e: CopyEvent) => void)>,
    onCut: Function as PropType<((e: CutEvent) => void)>,
    onDisposing: Function as PropType<((e: TextBoxDisposingEvent) => void)>,
    onEnterKey: Function as PropType<((e: EnterKeyEvent) => void)>,
    onFocusIn: Function as PropType<((e: FocusInEvent) => void)>,
    onFocusOut: Function as PropType<((e: FocusOutEvent) => void)>,
    onInitialized: Function as PropType<((e: TextBoxInitializedEvent) => void)>,
    onInput: Function as PropType<((e: InputEvent) => void)>,
    onKeyDown: Function as PropType<((e: TextBoxKeyDownEvent) => void)>,
    onKeyUp: Function as PropType<((e: KeyUpEvent) => void)>,
    onOptionChanged: Function as PropType<((e: TextBoxOptionChangedEvent) => void)>,
    onPaste: Function as PropType<((e: PasteEvent) => void)>,
    onValueChanged: Function as PropType<((e: ValueChangedEvent) => void)>,
    placeholder: String,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    showClearButton: Boolean,
    showMaskMode: String as PropType<MaskMode>,
    spellcheck: Boolean,
    stylingMode: String as PropType<EditorStyle>,
    tabIndex: Number,
    text: String,
    useMaskedValue: Boolean,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: String as PropType<ValidationMessageMode>,
    validationMessagePosition: String as PropType<Position>,
    validationStatus: String as PropType<ValidationStatus>,
    value: String,
    valueChangeEvent: String,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxEditorOptionsConfig);

const DxEditorOptions = defineComponent(DxEditorOptionsConfig);

(DxEditorOptions as any).$_optionName = "editorOptions";
(DxEditorOptions as any).$_expectedChildren = {
  button: { isCollectionItem: true, optionName: "buttons" },
  editorOptionsButton: { isCollectionItem: true, optionName: "buttons" }
};

const DxEditorOptionsButtonConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:location": null,
    "update:name": null,
    "update:options": null,
  },
  props: {
    location: String as PropType<TextEditorButtonLocation>,
    name: String,
    options: Object as PropType<dxButtonOptions | Record<string, any>>
  }
};

prepareConfigurationComponentConfig(DxEditorOptionsButtonConfig);

const DxEditorOptionsButton = defineComponent(DxEditorOptionsButtonConfig);

(DxEditorOptionsButton as any).$_optionName = "buttons";
(DxEditorOptionsButton as any).$_isCollectionItem = true;
(DxEditorOptionsButton as any).$_expectedChildren = {
  options: { isCollectionItem: false, optionName: "options" }
};

const DxEmailRuleConfig = {
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
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxEmailRuleConfig);

const DxEmailRule = defineComponent(DxEmailRuleConfig);

(DxEmailRule as any).$_optionName = "validationRules";
(DxEmailRule as any).$_isCollectionItem = true;
(DxEmailRule as any).$_predefinedProps = {
  type: "email"
};

const DxEmptyItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:itemType": null,
    "update:name": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    colSpan: Number,
    cssClass: String,
    itemType: String as PropType<FormItemType>,
    name: String,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxEmptyItemConfig);

const DxEmptyItem = defineComponent(DxEmptyItemConfig);

(DxEmptyItem as any).$_optionName = "items";
(DxEmptyItem as any).$_isCollectionItem = true;
(DxEmptyItem as any).$_predefinedProps = {
  itemType: "empty"
};

const DxFieldConfig = {
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
    calculateFilterExpression: Function as PropType<((filterValue: any, selectedFilterOperation: string) => string | (() => any) | Array<any>)>,
    caption: String,
    customizeText: Function as PropType<((fieldInfo: FieldInfo) => string)>,
    dataField: String,
    dataType: String as PropType<DataType>,
    editorOptions: {},
    editorTemplate: {},
    falseText: String,
    filterOperations: Array as PropType<Array<FilterBuilderOperation | string>>,
    format: [Object, String, Function] as PropType<Format | CommonFormat | (((value: number | Date) => string)) | Record<string, any> | string>,
    lookup: Object as PropType<Record<string, any>>,
    name: String,
    trueText: String
  }
};

prepareConfigurationComponentConfig(DxFieldConfig);

const DxField = defineComponent(DxFieldConfig);

(DxField as any).$_optionName = "fields";
(DxField as any).$_isCollectionItem = true;
(DxField as any).$_expectedChildren = {
  fieldLookup: { isCollectionItem: false, optionName: "lookup" },
  format: { isCollectionItem: false, optionName: "format" },
  lookup: { isCollectionItem: false, optionName: "lookup" }
};

const DxFieldLookupConfig = {
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
    dataSource: [Array, Object] as PropType<Array<any> | DataSourceOptions | Store | Record<string, any>>,
    displayExpr: [Function, String] as PropType<(((data: any) => string)) | string>,
    valueExpr: [Function, String] as PropType<(((data: any) => string | number | boolean)) | string>
  }
};

prepareConfigurationComponentConfig(DxFieldLookupConfig);

const DxFieldLookup = defineComponent(DxFieldLookupConfig);

(DxFieldLookup as any).$_optionName = "lookup";

const DxFilterBuilderConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowHierarchicalFields": null,
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
    customOperations: Array as PropType<Array<dxFilterBuilderCustomOperation>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    fields: Array as PropType<Array<dxFilterBuilderField>>,
    filterOperationDescriptions: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    groupOperationDescriptions: Object as PropType<Record<string, any>>,
    groupOperations: Array as PropType<Array<GroupOperation>>,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    maxGroupLevel: Number,
    onContentReady: Function as PropType<((e: FilterBuilderContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: FilterBuilderDisposingEvent) => void)>,
    onEditorPrepared: Function as PropType<((e: FilterBuilderEditorPreparedEvent) => void)>,
    onEditorPreparing: Function as PropType<((e: FilterBuilderEditorPreparingEvent) => void)>,
    onInitialized: Function as PropType<((e: FilterBuilderInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: FilterBuilderOptionChangedEvent) => void)>,
    onValueChanged: Function as PropType<((e: FilterBuilderValueChangedEvent) => void)>,
    rtlEnabled: Boolean,
    tabIndex: Number,
    value: [Array, Function, String] as PropType<Array<any> | ((() => any)) | string>,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxFilterBuilderConfig);

const DxFilterBuilder = defineComponent(DxFilterBuilderConfig);

(DxFilterBuilder as any).$_optionName = "filterBuilder";
(DxFilterBuilder as any).$_expectedChildren = {
  customOperation: { isCollectionItem: true, optionName: "customOperations" },
  field: { isCollectionItem: true, optionName: "fields" },
  filterOperationDescriptions: { isCollectionItem: false, optionName: "filterOperationDescriptions" },
  groupOperationDescriptions: { isCollectionItem: false, optionName: "groupOperationDescriptions" }
};

const DxFilterBuilderPopupConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:animation": null,
    "update:container": null,
    "update:contentTemplate": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:dragAndResizeArea": null,
    "update:dragEnabled": null,
    "update:dragOutsideBoundary": null,
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
    "update:tabFocusLoopEnabled": null,
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
    animation: Object as PropType<Record<string, any>>,
    container: {},
    contentTemplate: {},
    deferRendering: Boolean,
    disabled: Boolean,
    dragAndResizeArea: {},
    dragEnabled: Boolean,
    dragOutsideBoundary: Boolean,
    enableBodyScroll: Boolean,
    focusStateEnabled: Boolean,
    fullScreen: Boolean,
    height: [Number, String],
    hideOnOutsideClick: [Boolean, Function] as PropType<boolean | (((event: event) => boolean))>,
    hideOnParentScroll: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    maxHeight: [Number, String],
    maxWidth: [Number, String],
    minHeight: [Number, String],
    minWidth: [Number, String],
    onContentReady: Function as PropType<((e: EventInfo<any>) => void)>,
    onDisposing: Function as PropType<((e: EventInfo<any>) => void)>,
    onHidden: Function as PropType<((e: EventInfo<any>) => void)>,
    onHiding: Function as PropType<((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void)>,
    onInitialized: Function as PropType<((e: { component: Component<any>, element: any }) => void)>,
    onOptionChanged: Function as PropType<((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void)>,
    onResize: Function as PropType<((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void)>,
    onResizeEnd: Function as PropType<((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void)>,
    onResizeStart: Function as PropType<((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void)>,
    onShowing: Function as PropType<((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void)>,
    onShown: Function as PropType<((e: EventInfo<any>) => void)>,
    onTitleRendered: Function as PropType<((e: { component: dxPopup, element: any, model: any, titleElement: any }) => void)>,
    position: [Function, String, Object] as PropType<((() => void)) | PositionAlignment | PositionConfig | Record<string, any>>,
    resizeEnabled: Boolean,
    restorePosition: Boolean,
    rtlEnabled: Boolean,
    shading: Boolean,
    shadingColor: String,
    showCloseButton: Boolean,
    showTitle: Boolean,
    tabFocusLoopEnabled: Boolean,
    tabIndex: Number,
    title: String,
    titleTemplate: {},
    toolbarItems: Array as PropType<Array<dxPopupToolbarItem>>,
    visible: Boolean,
    width: [Number, String],
    wrapperAttr: {}
  }
};

prepareConfigurationComponentConfig(DxFilterBuilderPopupConfig);

const DxFilterBuilderPopup = defineComponent(DxFilterBuilderPopupConfig);

(DxFilterBuilderPopup as any).$_optionName = "filterBuilderPopup";
(DxFilterBuilderPopup as any).$_expectedChildren = {
  animation: { isCollectionItem: false, optionName: "animation" },
  position: { isCollectionItem: false, optionName: "position" },
  toolbarItem: { isCollectionItem: true, optionName: "toolbarItems" }
};

const DxFilterOperationDescriptionsConfig = {
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
};

prepareConfigurationComponentConfig(DxFilterOperationDescriptionsConfig);

const DxFilterOperationDescriptions = defineComponent(DxFilterOperationDescriptionsConfig);

(DxFilterOperationDescriptions as any).$_optionName = "filterOperationDescriptions";

const DxFilterPanelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:customizeText": null,
    "update:filterEnabled": null,
    "update:texts": null,
    "update:visible": null,
  },
  props: {
    customizeText: Function as PropType<((e: { component: FilterPanel, filterValue: Record<string, any>, text: string }) => string)>,
    filterEnabled: Boolean,
    texts: Object as PropType<FilterPanelTexts | Record<string, any>>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxFilterPanelConfig);

const DxFilterPanel = defineComponent(DxFilterPanelConfig);

(DxFilterPanel as any).$_optionName = "filterPanel";
(DxFilterPanel as any).$_expectedChildren = {
  filterPanelTexts: { isCollectionItem: false, optionName: "texts" },
  texts: { isCollectionItem: false, optionName: "texts" }
};

const DxFilterPanelTextsConfig = {
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
};

prepareConfigurationComponentConfig(DxFilterPanelTextsConfig);

const DxFilterPanelTexts = defineComponent(DxFilterPanelTextsConfig);

(DxFilterPanelTexts as any).$_optionName = "texts";

const DxFilterRowConfig = {
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
    applyFilter: String as PropType<ApplyFilterMode>,
    applyFilterText: String,
    betweenEndText: String,
    betweenStartText: String,
    operationDescriptions: Object as PropType<Record<string, any>>,
    resetOperationText: String,
    showAllText: String,
    showOperationChooser: Boolean,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxFilterRowConfig);

const DxFilterRow = defineComponent(DxFilterRowConfig);

(DxFilterRow as any).$_optionName = "filterRow";
(DxFilterRow as any).$_expectedChildren = {
  operationDescriptions: { isCollectionItem: false, optionName: "operationDescriptions" }
};

const DxFormConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:aiIntegration": null,
    "update:alignItemLabels": null,
    "update:alignItemLabelsInAllGroups": null,
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
    "update:isDirty": null,
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
    "update:onSmartPasted": null,
    "update:onSmartPasting": null,
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
    aiIntegration: Object as PropType<AIIntegration>,
    alignItemLabels: Boolean,
    alignItemLabelsInAllGroups: Boolean,
    colCount: [String, Number] as PropType<Mode | number>,
    colCountByScreen: Object as PropType<Record<string, any>>,
    customizeItem: Function as PropType<((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => void)>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    formData: {},
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    isDirty: Boolean,
    items: Array as PropType<Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>>,
    labelLocation: String as PropType<LabelLocation>,
    labelMode: String as PropType<FormLabelMode>,
    minColWidth: Number,
    onContentReady: Function as PropType<((e: FormContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: FormDisposingEvent) => void)>,
    onEditorEnterKey: Function as PropType<((e: EditorEnterKeyEvent) => void)>,
    onFieldDataChanged: Function as PropType<((e: FieldDataChangedEvent) => void)>,
    onInitialized: Function as PropType<((e: FormInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: FormOptionChangedEvent) => void)>,
    onSmartPasted: Function as PropType<((e: SmartPastedEvent) => void)>,
    onSmartPasting: Function as PropType<((e: SmartPastingEvent) => void)>,
    optionalMark: String,
    readOnly: Boolean,
    requiredMark: String,
    requiredMessage: String,
    rtlEnabled: Boolean,
    screenByWidth: Function as PropType<(() => void)>,
    scrollingEnabled: Boolean,
    showColonAfterLabel: Boolean,
    showOptionalMark: Boolean,
    showRequiredMark: Boolean,
    showValidationSummary: Boolean,
    tabIndex: Number,
    validationGroup: String,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxFormConfig);

const DxForm = defineComponent(DxFormConfig);

(DxForm as any).$_optionName = "form";
(DxForm as any).$_expectedChildren = {
  ButtonItem: { isCollectionItem: true, optionName: "items" },
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" },
  EmptyItem: { isCollectionItem: true, optionName: "items" },
  GroupItem: { isCollectionItem: true, optionName: "items" },
  item: { isCollectionItem: true, optionName: "items" },
  SimpleItem: { isCollectionItem: true, optionName: "items" },
  TabbedItem: { isCollectionItem: true, optionName: "items" }
};

const DxFormatConfig = {
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
    formatter: Function as PropType<((value: number | Date) => string)>,
    parser: Function as PropType<((value: string) => number | Date)>,
    precision: Number,
    type: String as PropType<CommonFormat | string>,
    useCurrencyAccountingStyle: Boolean
  }
};

prepareConfigurationComponentConfig(DxFormatConfig);

const DxFormat = defineComponent(DxFormatConfig);

(DxFormat as any).$_optionName = "format";

const DxFormItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aiOptions": null,
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
    aiOptions: Object as PropType<Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    dataField: String,
    editorOptions: {},
    editorType: String as PropType<FormItemComponent>,
    helpText: String,
    isRequired: Boolean,
    itemType: String as PropType<FormItemType>,
    label: Object as PropType<Record<string, any>>,
    name: String,
    template: {},
    validationRules: Array as PropType<Array<CommonTypes.ValidationRule>>,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxFormItemConfig);

const DxFormItem = defineComponent(DxFormItemConfig);

(DxFormItem as any).$_optionName = "formItem";
(DxFormItem as any).$_expectedChildren = {
  aiOptions: { isCollectionItem: false, optionName: "aiOptions" },
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

const DxFromConfig = {
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
    position: Object as PropType<PositionConfig | Record<string, any>>,
    scale: Number,
    top: Number
  }
};

prepareConfigurationComponentConfig(DxFromConfig);

const DxFrom = defineComponent(DxFromConfig);

(DxFrom as any).$_optionName = "from";
(DxFrom as any).$_expectedChildren = {
  position: { isCollectionItem: false, optionName: "position" }
};

const DxGroupItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignItemLabels": null,
    "update:caption": null,
    "update:captionTemplate": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:items": null,
    "update:itemType": null,
    "update:name": null,
    "update:template": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    alignItemLabels: Boolean,
    caption: String,
    captionTemplate: {},
    colCount: Number,
    colCountByScreen: Object as PropType<Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    items: Array as PropType<Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>>,
    itemType: String as PropType<FormItemType>,
    name: String,
    template: {},
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxGroupItemConfig);

const DxGroupItem = defineComponent(DxGroupItemConfig);

(DxGroupItem as any).$_optionName = "items";
(DxGroupItem as any).$_isCollectionItem = true;
(DxGroupItem as any).$_predefinedProps = {
  itemType: "group"
};
(DxGroupItem as any).$_expectedChildren = {
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" }
};

const DxGroupOperationDescriptionsConfig = {
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
};

prepareConfigurationComponentConfig(DxGroupOperationDescriptionsConfig);

const DxGroupOperationDescriptions = defineComponent(DxGroupOperationDescriptionsConfig);

(DxGroupOperationDescriptions as any).$_optionName = "groupOperationDescriptions";

const DxHeaderFilterConfig = {
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
    dataSource: [Array, Object, Function] as PropType<Array<any> | DataSourceOptions | (((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void)) | null | Store | Record<string, any>>,
    groupInterval: [String, Number] as PropType<HeaderFilterGroupInterval | number>,
    height: [Number, String],
    search: Object as PropType<ColumnHeaderFilterSearchConfig | HeaderFilterSearchConfig | Record<string, any>>,
    searchMode: String as PropType<SearchMode>,
    searchTimeout: Number,
    texts: Object as PropType<HeaderFilterTexts | Record<string, any>>,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxHeaderFilterConfig);

const DxHeaderFilter = defineComponent(DxHeaderFilterConfig);

(DxHeaderFilter as any).$_optionName = "headerFilter";
(DxHeaderFilter as any).$_expectedChildren = {
  columnHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  treeListHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  treeListHeaderFilterTexts: { isCollectionItem: false, optionName: "texts" }
};

const DxHideConfig = {
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
    complete: Function as PropType<(($element: any, config: AnimationConfig) => void)>,
    delay: Number,
    direction: String as PropType<Direction>,
    duration: Number,
    easing: String,
    from: Object as PropType<AnimationState | Record<string, any>>,
    staggerDelay: Number,
    start: Function as PropType<(($element: any, config: AnimationConfig) => void)>,
    to: Object as PropType<AnimationState | Record<string, any>>,
    type: String as PropType<AnimationType>
  }
};

prepareConfigurationComponentConfig(DxHideConfig);

const DxHide = defineComponent(DxHideConfig);

(DxHide as any).$_optionName = "hide";
(DxHide as any).$_expectedChildren = {
  from: { isCollectionItem: false, optionName: "from" },
  to: { isCollectionItem: false, optionName: "to" }
};

const DxIconsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:fix": null,
    "update:leftPosition": null,
    "update:rightPosition": null,
    "update:stickyPosition": null,
    "update:unfix": null,
  },
  props: {
    fix: String,
    leftPosition: String,
    rightPosition: String,
    stickyPosition: String,
    unfix: String
  }
};

prepareConfigurationComponentConfig(DxIconsConfig);

const DxIcons = defineComponent(DxIconsConfig);

(DxIcons as any).$_optionName = "icons";

const DxIndicatorOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:animationType": null,
    "update:height": null,
    "update:src": null,
    "update:width": null,
  },
  props: {
    animationType: String as PropType<LoadingAnimationType>,
    height: [Number, String],
    src: String,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxIndicatorOptionsConfig);

const DxIndicatorOptions = defineComponent(DxIndicatorOptionsConfig);

(DxIndicatorOptions as any).$_optionName = "indicatorOptions";

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aiOptions": null,
    "update:alignItemLabels": null,
    "update:badge": null,
    "update:buttonOptions": null,
    "update:caption": null,
    "update:captionTemplate": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:dataField": null,
    "update:disabled": null,
    "update:editorOptions": null,
    "update:editorType": null,
    "update:helpText": null,
    "update:horizontalAlignment": null,
    "update:html": null,
    "update:icon": null,
    "update:isRequired": null,
    "update:items": null,
    "update:itemType": null,
    "update:label": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:name": null,
    "update:options": null,
    "update:showText": null,
    "update:tabPanelOptions": null,
    "update:tabs": null,
    "update:tabTemplate": null,
    "update:template": null,
    "update:text": null,
    "update:title": null,
    "update:validationRules": null,
    "update:verticalAlignment": null,
    "update:visible": null,
    "update:visibleIndex": null,
    "update:widget": null,
  },
  props: {
    aiOptions: Object as PropType<Record<string, any>>,
    alignItemLabels: Boolean,
    badge: String,
    buttonOptions: Object as PropType<dxButtonOptions | Record<string, any>>,
    caption: String,
    captionTemplate: {},
    colCount: Number,
    colCountByScreen: Object as PropType<Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    dataField: String,
    disabled: Boolean,
    editorOptions: {},
    editorType: String as PropType<FormItemComponent>,
    helpText: String,
    horizontalAlignment: String as PropType<HorizontalAlignment>,
    html: String,
    icon: String,
    isRequired: Boolean,
    items: Array as PropType<Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>>,
    itemType: String as PropType<FormItemType>,
    label: Object as PropType<Record<string, any>>,
    locateInMenu: String as PropType<LocateInMenuMode>,
    location: String as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    name: String as PropType<string | FormPredefinedButtonItem | TreeListPredefinedToolbarItem>,
    options: {},
    showText: String as PropType<ShowTextMode>,
    tabPanelOptions: Object as PropType<dxTabPanelOptions | Record<string, any>>,
    tabs: Array as PropType<Array<Record<string, any>>>,
    tabTemplate: {},
    template: {},
    text: String,
    title: String,
    validationRules: Array as PropType<Array<CommonTypes.ValidationRule>>,
    verticalAlignment: String as PropType<VerticalAlignment>,
    visible: Boolean,
    visibleIndex: Number,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
(DxItem as any).$_expectedChildren = {
  aiOptions: { isCollectionItem: false, optionName: "aiOptions" },
  AsyncRule: { isCollectionItem: true, optionName: "validationRules" },
  buttonOptions: { isCollectionItem: false, optionName: "buttonOptions" },
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" },
  CompareRule: { isCollectionItem: true, optionName: "validationRules" },
  CustomRule: { isCollectionItem: true, optionName: "validationRules" },
  EmailRule: { isCollectionItem: true, optionName: "validationRules" },
  label: { isCollectionItem: false, optionName: "label" },
  NumericRule: { isCollectionItem: true, optionName: "validationRules" },
  PatternRule: { isCollectionItem: true, optionName: "validationRules" },
  RangeRule: { isCollectionItem: true, optionName: "validationRules" },
  RequiredRule: { isCollectionItem: true, optionName: "validationRules" },
  StringLengthRule: { isCollectionItem: true, optionName: "validationRules" },
  tab: { isCollectionItem: true, optionName: "tabs" },
  tabPanelOptions: { isCollectionItem: false, optionName: "tabPanelOptions" },
  validationRule: { isCollectionItem: true, optionName: "validationRules" }
};

const DxKeyboardNavigationConfig = {
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
    enterKeyAction: String as PropType<EnterKeyAction>,
    enterKeyDirection: String as PropType<EnterKeyDirection>
  }
};

prepareConfigurationComponentConfig(DxKeyboardNavigationConfig);

const DxKeyboardNavigation = defineComponent(DxKeyboardNavigationConfig);

(DxKeyboardNavigation as any).$_optionName = "keyboardNavigation";

const DxLabelConfig = {
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
    alignment: String as PropType<HorizontalAlignment>,
    location: String as PropType<LabelLocation>,
    showColon: Boolean,
    template: {},
    text: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxLabelConfig);

const DxLabel = defineComponent(DxLabelConfig);

(DxLabel as any).$_optionName = "label";

const DxLoadPanelConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:height": null,
    "update:indicatorOptions": null,
    "update:indicatorSrc": null,
    "update:shading": null,
    "update:shadingColor": null,
    "update:showIndicator": null,
    "update:showPane": null,
    "update:text": null,
    "update:width": null,
  },
  props: {
    enabled: [Boolean, String] as PropType<boolean | Mode>,
    height: [Number, String],
    indicatorOptions: Object as PropType<LoadPanelIndicatorProperties | Record<string, any>>,
    indicatorSrc: String,
    shading: Boolean,
    shadingColor: String,
    showIndicator: Boolean,
    showPane: Boolean,
    text: String,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxLoadPanelConfig);

const DxLoadPanel = defineComponent(DxLoadPanelConfig);

(DxLoadPanel as any).$_optionName = "loadPanel";
(DxLoadPanel as any).$_expectedChildren = {
  indicatorOptions: { isCollectionItem: false, optionName: "indicatorOptions" }
};

const DxLookupConfig = {
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
    calculateCellValue: Function as PropType<((rowData: any) => any)>,
    dataSource: [Array, Object, Function] as PropType<Array<any> | DataSourceOptions | (((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions)) | null | Store | Record<string, any>>,
    displayExpr: [Function, String] as PropType<(((data: any) => string)) | string>,
    valueExpr: [String, Function] as PropType<string | (((data: any) => string | number | boolean))>
  }
};

prepareConfigurationComponentConfig(DxLookupConfig);

const DxLookup = defineComponent(DxLookupConfig);

(DxLookup as any).$_optionName = "lookup";

const DxMyConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:x": null,
    "update:y": null,
  },
  props: {
    x: String as PropType<HorizontalAlignment>,
    y: String as PropType<VerticalAlignment>
  }
};

prepareConfigurationComponentConfig(DxMyConfig);

const DxMy = defineComponent(DxMyConfig);

(DxMy as any).$_optionName = "my";

const DxNumericRuleConfig = {
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
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxNumericRuleConfig);

const DxNumericRule = defineComponent(DxNumericRuleConfig);

(DxNumericRule as any).$_optionName = "validationRules";
(DxNumericRule as any).$_isCollectionItem = true;
(DxNumericRule as any).$_predefinedProps = {
  type: "numeric"
};

const DxOffsetConfig = {
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
};

prepareConfigurationComponentConfig(DxOffsetConfig);

const DxOffset = defineComponent(DxOffsetConfig);

(DxOffset as any).$_optionName = "offset";

const DxOperationDescriptionsConfig = {
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
};

prepareConfigurationComponentConfig(DxOperationDescriptionsConfig);

const DxOperationDescriptions = defineComponent(DxOperationDescriptionsConfig);

(DxOperationDescriptions as any).$_optionName = "operationDescriptions";

const DxOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:icon": null,
    "update:onClick": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:template": null,
    "update:text": null,
    "update:type": null,
    "update:useSubmitBehavior": null,
    "update:validationGroup": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    onClick: Function as PropType<((e: ClickEvent) => void)>,
    onContentReady: Function as PropType<((e: ButtonContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: ButtonDisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: ButtonInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: ButtonOptionChangedEvent) => void)>,
    rtlEnabled: Boolean,
    stylingMode: String as PropType<ButtonStyle>,
    tabIndex: Number,
    template: {},
    text: String,
    type: String as PropType<ButtonType | string>,
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxOptionsConfig);

const DxOptions = defineComponent(DxOptionsConfig);

(DxOptions as any).$_optionName = "options";

const DxPagerConfig = {
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
    allowedPageSizes: [Array, String] as PropType<(Array<number | PagerPageSize>) | Mode>,
    displayMode: String as PropType<DisplayMode>,
    infoText: String,
    label: String,
    showInfo: Boolean,
    showNavigationButtons: Boolean,
    showPageSizeSelector: [Boolean, String] as PropType<boolean | Mode>,
    visible: [Boolean, String] as PropType<boolean | Mode>
  }
};

prepareConfigurationComponentConfig(DxPagerConfig);

const DxPager = defineComponent(DxPagerConfig);

(DxPager as any).$_optionName = "pager";

const DxPagingConfig = {
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
};

prepareConfigurationComponentConfig(DxPagingConfig);

const DxPaging = defineComponent(DxPagingConfig);

(DxPaging as any).$_optionName = "paging";

const DxPatternRuleConfig = {
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
    pattern: [RegExp, String],
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxPatternRuleConfig);

const DxPatternRule = defineComponent(DxPatternRuleConfig);

(DxPatternRule as any).$_optionName = "validationRules";
(DxPatternRule as any).$_isCollectionItem = true;
(DxPatternRule as any).$_predefinedProps = {
  type: "pattern"
};

const DxPopupConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:animation": null,
    "update:container": null,
    "update:contentTemplate": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:dragAndResizeArea": null,
    "update:dragEnabled": null,
    "update:dragOutsideBoundary": null,
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
    "update:tabFocusLoopEnabled": null,
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
    animation: Object as PropType<Record<string, any>>,
    container: {},
    contentTemplate: {},
    deferRendering: Boolean,
    disabled: Boolean,
    dragAndResizeArea: {},
    dragEnabled: Boolean,
    dragOutsideBoundary: Boolean,
    enableBodyScroll: Boolean,
    focusStateEnabled: Boolean,
    fullScreen: Boolean,
    height: [Number, String],
    hideOnOutsideClick: [Boolean, Function] as PropType<boolean | (((event: event) => boolean))>,
    hideOnParentScroll: Boolean,
    hint: String,
    hoverStateEnabled: Boolean,
    maxHeight: [Number, String],
    maxWidth: [Number, String],
    minHeight: [Number, String],
    minWidth: [Number, String],
    onContentReady: Function as PropType<((e: EventInfo<any>) => void)>,
    onDisposing: Function as PropType<((e: EventInfo<any>) => void)>,
    onHidden: Function as PropType<((e: EventInfo<any>) => void)>,
    onHiding: Function as PropType<((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void)>,
    onInitialized: Function as PropType<((e: { component: Component<any>, element: any }) => void)>,
    onOptionChanged: Function as PropType<((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void)>,
    onResize: Function as PropType<((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void)>,
    onResizeEnd: Function as PropType<((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void)>,
    onResizeStart: Function as PropType<((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void)>,
    onShowing: Function as PropType<((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void)>,
    onShown: Function as PropType<((e: EventInfo<any>) => void)>,
    onTitleRendered: Function as PropType<((e: { component: dxPopup, element: any, model: any, titleElement: any }) => void)>,
    position: [Function, String, Object] as PropType<((() => void)) | PositionAlignment | PositionConfig | Record<string, any>>,
    resizeEnabled: Boolean,
    restorePosition: Boolean,
    rtlEnabled: Boolean,
    shading: Boolean,
    shadingColor: String,
    showCloseButton: Boolean,
    showTitle: Boolean,
    tabFocusLoopEnabled: Boolean,
    tabIndex: Number,
    title: String,
    titleTemplate: {},
    toolbarItems: Array as PropType<Array<dxPopupToolbarItem>>,
    visible: Boolean,
    width: [Number, String],
    wrapperAttr: {}
  }
};

prepareConfigurationComponentConfig(DxPopupConfig);

const DxPopup = defineComponent(DxPopupConfig);

(DxPopup as any).$_optionName = "popup";
(DxPopup as any).$_expectedChildren = {
  animation: { isCollectionItem: false, optionName: "animation" },
  position: { isCollectionItem: false, optionName: "position" },
  toolbarItem: { isCollectionItem: true, optionName: "toolbarItems" }
};

const DxPositionConfig = {
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
    at: [Object, String] as PropType<Record<string, any> | PositionAlignment>,
    boundary: {},
    boundaryOffset: [Object, String] as PropType<Record<string, any> | string>,
    collision: [String, Object] as PropType<CollisionResolutionCombination | Record<string, any>>,
    my: [Object, String] as PropType<Record<string, any> | PositionAlignment>,
    of: {},
    offset: [Object, String] as PropType<Record<string, any> | string>
  }
};

prepareConfigurationComponentConfig(DxPositionConfig);

const DxPosition = defineComponent(DxPositionConfig);

(DxPosition as any).$_optionName = "position";
(DxPosition as any).$_expectedChildren = {
  at: { isCollectionItem: false, optionName: "at" },
  boundaryOffset: { isCollectionItem: false, optionName: "boundaryOffset" },
  collision: { isCollectionItem: false, optionName: "collision" },
  my: { isCollectionItem: false, optionName: "my" },
  offset: { isCollectionItem: false, optionName: "offset" }
};

const DxRangeRuleConfig = {
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
    max: [Date, Number, String],
    message: String,
    min: [Date, Number, String],
    reevaluate: Boolean,
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxRangeRuleConfig);

const DxRangeRule = defineComponent(DxRangeRuleConfig);

(DxRangeRule as any).$_optionName = "validationRules";
(DxRangeRule as any).$_isCollectionItem = true;
(DxRangeRule as any).$_predefinedProps = {
  type: "range"
};

const DxRemoteOperationsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:filtering": null,
    "update:grouping": null,
    "update:sorting": null,
  },
  props: {
    filtering: Boolean,
    grouping: Boolean,
    sorting: Boolean
  }
};

prepareConfigurationComponentConfig(DxRemoteOperationsConfig);

const DxRemoteOperations = defineComponent(DxRemoteOperationsConfig);

(DxRemoteOperations as any).$_optionName = "remoteOperations";

const DxRequiredRuleConfig = {
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
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxRequiredRuleConfig);

const DxRequiredRule = defineComponent(DxRequiredRuleConfig);

(DxRequiredRule as any).$_optionName = "validationRules";
(DxRequiredRule as any).$_isCollectionItem = true;
(DxRequiredRule as any).$_predefinedProps = {
  type: "required"
};

const DxRowDraggingConfig = {
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
    cursorOffset: [Object, String] as PropType<Record<string, any> | string>,
    data: {},
    dragDirection: String as PropType<DragDirection>,
    dragTemplate: {},
    dropFeedbackMode: String as PropType<DragHighlight>,
    filter: String,
    group: String,
    handle: String,
    onAdd: Function as PropType<((e: { component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void)>,
    onDragChange: Function as PropType<((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void)>,
    onDragEnd: Function as PropType<((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void)>,
    onDragMove: Function as PropType<((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void)>,
    onDragStart: Function as PropType<((e: { cancel: boolean, component: GridBase, event: event, fromData: any, fromIndex: number, itemData: any, itemElement: any }) => void)>,
    onRemove: Function as PropType<((e: { component: GridBase, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void)>,
    onReorder: Function as PropType<((e: { component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, promise: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void)>,
    scrollSensitivity: Number,
    scrollSpeed: Number,
    showDragIcons: Boolean
  }
};

prepareConfigurationComponentConfig(DxRowDraggingConfig);

const DxRowDragging = defineComponent(DxRowDraggingConfig);

(DxRowDragging as any).$_optionName = "rowDragging";
(DxRowDragging as any).$_expectedChildren = {
  cursorOffset: { isCollectionItem: false, optionName: "cursorOffset" }
};

const DxScrollingConfig = {
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
    columnRenderingMode: String as PropType<DataRenderMode>,
    mode: String as PropType<ScrollMode>,
    preloadEnabled: Boolean,
    renderAsync: Boolean,
    rowRenderingMode: String as PropType<DataRenderMode>,
    scrollByContent: Boolean,
    scrollByThumb: Boolean,
    showScrollbar: String as PropType<ScrollbarMode>,
    useNative: [Boolean, String] as PropType<boolean | Mode>
  }
};

prepareConfigurationComponentConfig(DxScrollingConfig);

const DxScrolling = defineComponent(DxScrollingConfig);

(DxScrolling as any).$_optionName = "scrolling";

const DxSearchConfig = {
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
    mode: String as PropType<SearchMode>,
    searchExpr: [Array, Function, String] as PropType<(Array<(() => any) | string>) | ((() => any)) | string>,
    timeout: Number
  }
};

prepareConfigurationComponentConfig(DxSearchConfig);

const DxSearch = defineComponent(DxSearchConfig);

(DxSearch as any).$_optionName = "search";

const DxSearchPanelConfig = {
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
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxSearchPanelConfig);

const DxSearchPanel = defineComponent(DxSearchPanelConfig);

(DxSearchPanel as any).$_optionName = "searchPanel";

const DxSelectionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSelectAll": null,
    "update:mode": null,
    "update:recursive": null,
    "update:selectByClick": null,
  },
  props: {
    allowSelectAll: Boolean,
    mode: String as PropType<SingleMultipleOrNone>,
    recursive: Boolean,
    selectByClick: Boolean
  }
};

prepareConfigurationComponentConfig(DxSelectionConfig);

const DxSelection = defineComponent(DxSelectionConfig);

(DxSelection as any).$_optionName = "selection";

const DxShowConfig = {
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
    complete: Function as PropType<(($element: any, config: AnimationConfig) => void)>,
    delay: Number,
    direction: String as PropType<Direction>,
    duration: Number,
    easing: String,
    from: Object as PropType<AnimationState | Record<string, any>>,
    staggerDelay: Number,
    start: Function as PropType<(($element: any, config: AnimationConfig) => void)>,
    to: Object as PropType<AnimationState | Record<string, any>>,
    type: String as PropType<AnimationType>
  }
};

prepareConfigurationComponentConfig(DxShowConfig);

const DxShow = defineComponent(DxShowConfig);

(DxShow as any).$_optionName = "show";
(DxShow as any).$_expectedChildren = {
  from: { isCollectionItem: false, optionName: "from" },
  to: { isCollectionItem: false, optionName: "to" }
};

const DxSimpleItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:aiOptions": null,
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
    aiOptions: Object as PropType<Record<string, any>>,
    colSpan: Number,
    cssClass: String,
    dataField: String,
    editorOptions: {},
    editorType: String as PropType<FormItemComponent>,
    helpText: String,
    isRequired: Boolean,
    itemType: String as PropType<FormItemType>,
    label: Object as PropType<Record<string, any>>,
    name: String,
    template: {},
    validationRules: Array as PropType<Array<CommonTypes.ValidationRule>>,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxSimpleItemConfig);

const DxSimpleItem = defineComponent(DxSimpleItemConfig);

(DxSimpleItem as any).$_optionName = "items";
(DxSimpleItem as any).$_isCollectionItem = true;
(DxSimpleItem as any).$_predefinedProps = {
  itemType: "simple"
};
(DxSimpleItem as any).$_expectedChildren = {
  aiOptions: { isCollectionItem: false, optionName: "aiOptions" },
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

const DxSortingConfig = {
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
    mode: String as PropType<SingleMultipleOrNone>,
    showSortIndexes: Boolean
  }
};

prepareConfigurationComponentConfig(DxSortingConfig);

const DxSorting = defineComponent(DxSortingConfig);

(DxSorting as any).$_optionName = "sorting";

const DxStateStoringConfig = {
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
    customLoad: Function as PropType<(() => any)>,
    customSave: Function as PropType<((gridState: any) => void)>,
    enabled: Boolean,
    savingTimeout: Number,
    storageKey: String,
    type: String as PropType<StateStoreType>
  }
};

prepareConfigurationComponentConfig(DxStateStoringConfig);

const DxStateStoring = defineComponent(DxStateStoringConfig);

(DxStateStoring as any).$_optionName = "stateStoring";

const DxStringLengthRuleConfig = {
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
    type: String as PropType<ValidationRuleType>
  }
};

prepareConfigurationComponentConfig(DxStringLengthRuleConfig);

const DxStringLengthRule = defineComponent(DxStringLengthRuleConfig);

(DxStringLengthRule as any).$_optionName = "validationRules";
(DxStringLengthRule as any).$_isCollectionItem = true;
(DxStringLengthRule as any).$_predefinedProps = {
  type: "stringLength"
};

const DxTabConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignItemLabels": null,
    "update:badge": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:disabled": null,
    "update:icon": null,
    "update:items": null,
    "update:tabTemplate": null,
    "update:template": null,
    "update:title": null,
  },
  props: {
    alignItemLabels: Boolean,
    badge: String,
    colCount: Number,
    colCountByScreen: Object as PropType<Record<string, any>>,
    disabled: Boolean,
    icon: String,
    items: Array as PropType<Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>>,
    tabTemplate: {},
    template: {},
    title: String
  }
};

prepareConfigurationComponentConfig(DxTabConfig);

const DxTab = defineComponent(DxTabConfig);

(DxTab as any).$_optionName = "tabs";
(DxTab as any).$_isCollectionItem = true;
(DxTab as any).$_expectedChildren = {
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" }
};

const DxTabbedItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:itemType": null,
    "update:name": null,
    "update:tabPanelOptions": null,
    "update:tabs": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    colSpan: Number,
    cssClass: String,
    itemType: String as PropType<FormItemType>,
    name: String,
    tabPanelOptions: Object as PropType<dxTabPanelOptions | Record<string, any>>,
    tabs: Array as PropType<Array<Record<string, any>>>,
    visible: Boolean,
    visibleIndex: Number
  }
};

prepareConfigurationComponentConfig(DxTabbedItemConfig);

const DxTabbedItem = defineComponent(DxTabbedItemConfig);

(DxTabbedItem as any).$_optionName = "items";
(DxTabbedItem as any).$_isCollectionItem = true;
(DxTabbedItem as any).$_predefinedProps = {
  itemType: "tabbed"
};
(DxTabbedItem as any).$_expectedChildren = {
  tab: { isCollectionItem: true, optionName: "tabs" },
  tabPanelOptions: { isCollectionItem: false, optionName: "tabPanelOptions" }
};

const DxTabPanelOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:animationEnabled": null,
    "update:dataSource": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:iconPosition": null,
    "update:itemHoldTimeout": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:itemTitleTemplate": null,
    "update:keyExpr": null,
    "update:loop": null,
    "update:noDataText": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemHold": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:onSelectionChanged": null,
    "update:onSelectionChanging": null,
    "update:onTitleClick": null,
    "update:onTitleHold": null,
    "update:onTitleRendered": null,
    "update:repaintChangesOnly": null,
    "update:rtlEnabled": null,
    "update:scrollByContent": null,
    "update:scrollingEnabled": null,
    "update:selectedIndex": null,
    "update:selectedItem": null,
    "update:showNavButtons": null,
    "update:stylingMode": null,
    "update:swipeEnabled": null,
    "update:tabIndex": null,
    "update:tabsPosition": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    animationEnabled: Boolean,
    dataSource: [Array, Object, String] as PropType<(Array<any | dxTabPanelItem | string>) | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    deferRendering: Boolean,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    iconPosition: String as PropType<TabsIconPosition>,
    itemHoldTimeout: Number,
    items: Array as PropType<Array<any | dxTabPanelItem | string>>,
    itemTemplate: {},
    itemTitleTemplate: {},
    keyExpr: [Function, String] as PropType<(((item: any) => any)) | string>,
    loop: Boolean,
    noDataText: String,
    onContentReady: Function as PropType<((e: TabPanelContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: TabPanelDisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: TabPanelInitializedEvent) => void)>,
    onItemClick: Function as PropType<((e: ItemClickEvent) => void)>,
    onItemContextMenu: Function as PropType<((e: ItemContextMenuEvent) => void)>,
    onItemHold: Function as PropType<((e: ItemHoldEvent) => void)>,
    onItemRendered: Function as PropType<((e: ItemRenderedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: TabPanelOptionChangedEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: TabPanelSelectionChangedEvent) => void)>,
    onSelectionChanging: Function as PropType<((e: SelectionChangingEvent) => void)>,
    onTitleClick: Function as PropType<((e: TitleClickEvent) => void)>,
    onTitleHold: Function as PropType<((e: TitleHoldEvent) => void)>,
    onTitleRendered: Function as PropType<((e: TitleRenderedEvent) => void)>,
    repaintChangesOnly: Boolean,
    rtlEnabled: Boolean,
    scrollByContent: Boolean,
    scrollingEnabled: Boolean,
    selectedIndex: Number,
    selectedItem: {},
    showNavButtons: Boolean,
    stylingMode: String as PropType<TabsStyle>,
    swipeEnabled: Boolean,
    tabIndex: Number,
    tabsPosition: String as PropType<Position>,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxTabPanelOptionsConfig);

const DxTabPanelOptions = defineComponent(DxTabPanelOptionsConfig);

(DxTabPanelOptions as any).$_optionName = "tabPanelOptions";
(DxTabPanelOptions as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" },
  tabPanelOptionsItem: { isCollectionItem: true, optionName: "items" }
};

const DxTabPanelOptionsItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:badge": null,
    "update:disabled": null,
    "update:html": null,
    "update:icon": null,
    "update:tabTemplate": null,
    "update:template": null,
    "update:text": null,
    "update:title": null,
    "update:visible": null,
  },
  props: {
    badge: String,
    disabled: Boolean,
    html: String,
    icon: String,
    tabTemplate: {},
    template: {},
    text: String,
    title: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxTabPanelOptionsItemConfig);

const DxTabPanelOptionsItem = defineComponent(DxTabPanelOptionsItemConfig);

(DxTabPanelOptionsItem as any).$_optionName = "items";
(DxTabPanelOptionsItem as any).$_isCollectionItem = true;

const DxTextsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:addRow": null,
    "update:addRowToNode": null,
    "update:cancel": null,
    "update:cancelAllChanges": null,
    "update:cancelRowChanges": null,
    "update:clearFilter": null,
    "update:confirmDeleteMessage": null,
    "update:confirmDeleteTitle": null,
    "update:createFilter": null,
    "update:deleteRow": null,
    "update:editRow": null,
    "update:emptyValue": null,
    "update:filterEnabledHint": null,
    "update:fix": null,
    "update:leftPosition": null,
    "update:ok": null,
    "update:rightPosition": null,
    "update:saveAllChanges": null,
    "update:saveRowChanges": null,
    "update:stickyPosition": null,
    "update:undeleteRow": null,
    "update:unfix": null,
    "update:validationCancelChanges": null,
  },
  props: {
    addRow: String,
    addRowToNode: String,
    cancel: String,
    cancelAllChanges: String,
    cancelRowChanges: String,
    clearFilter: String,
    confirmDeleteMessage: String,
    confirmDeleteTitle: String,
    createFilter: String,
    deleteRow: String,
    editRow: String,
    emptyValue: String,
    filterEnabledHint: String,
    fix: String,
    leftPosition: String,
    ok: String,
    rightPosition: String,
    saveAllChanges: String,
    saveRowChanges: String,
    stickyPosition: String,
    undeleteRow: String,
    unfix: String,
    validationCancelChanges: String
  }
};

prepareConfigurationComponentConfig(DxTextsConfig);

const DxTexts = defineComponent(DxTextsConfig);

(DxTexts as any).$_optionName = "texts";

const DxToConfig = {
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
    position: Object as PropType<PositionConfig | Record<string, any>>,
    scale: Number,
    top: Number
  }
};

prepareConfigurationComponentConfig(DxToConfig);

const DxTo = defineComponent(DxToConfig);

(DxTo as any).$_optionName = "to";
(DxTo as any).$_expectedChildren = {
  position: { isCollectionItem: false, optionName: "position" }
};

const DxToolbarConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:disabled": null,
    "update:items": null,
    "update:visible": null,
  },
  props: {
    disabled: Boolean,
    items: Array as PropType<Array<dxTreeListToolbarItem | TreeListPredefinedToolbarItem>>,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxToolbarConfig);

const DxToolbar = defineComponent(DxToolbarConfig);

(DxToolbar as any).$_optionName = "toolbar";
(DxToolbar as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" },
  treeListToolbarItem: { isCollectionItem: true, optionName: "items" }
};

const DxToolbarItemConfig = {
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
    locateInMenu: String as PropType<LocateInMenuMode>,
    location: String as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    options: {},
    showText: String as PropType<ShowTextMode>,
    template: {},
    text: String,
    toolbar: String as PropType<ToolbarLocation>,
    visible: Boolean,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxToolbarItemConfig);

const DxToolbarItem = defineComponent(DxToolbarItemConfig);

(DxToolbarItem as any).$_optionName = "toolbarItems";
(DxToolbarItem as any).$_isCollectionItem = true;

const DxTreeListHeaderFilterConfig = {
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
    height: [Number, String],
    search: Object as PropType<HeaderFilterSearchConfig | Record<string, any>>,
    searchTimeout: Number,
    texts: Object as PropType<HeaderFilterTexts | Record<string, any>>,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxTreeListHeaderFilterConfig);

const DxTreeListHeaderFilter = defineComponent(DxTreeListHeaderFilterConfig);

(DxTreeListHeaderFilter as any).$_optionName = "headerFilter";
(DxTreeListHeaderFilter as any).$_expectedChildren = {
  search: { isCollectionItem: false, optionName: "search" },
  texts: { isCollectionItem: false, optionName: "texts" },
  treeListHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  treeListHeaderFilterTexts: { isCollectionItem: false, optionName: "texts" }
};

const DxTreeListHeaderFilterSearchConfig = {
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
    mode: String as PropType<SearchMode>,
    timeout: Number
  }
};

prepareConfigurationComponentConfig(DxTreeListHeaderFilterSearchConfig);

const DxTreeListHeaderFilterSearch = defineComponent(DxTreeListHeaderFilterSearchConfig);

(DxTreeListHeaderFilterSearch as any).$_optionName = "search";

const DxTreeListHeaderFilterTextsConfig = {
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
};

prepareConfigurationComponentConfig(DxTreeListHeaderFilterTextsConfig);

const DxTreeListHeaderFilterTexts = defineComponent(DxTreeListHeaderFilterTextsConfig);

(DxTreeListHeaderFilterTexts as any).$_optionName = "texts";

const DxTreeListSelectionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSelectAll": null,
    "update:mode": null,
    "update:recursive": null,
  },
  props: {
    allowSelectAll: Boolean,
    mode: String as PropType<SingleMultipleOrNone>,
    recursive: Boolean
  }
};

prepareConfigurationComponentConfig(DxTreeListSelectionConfig);

const DxTreeListSelection = defineComponent(DxTreeListSelectionConfig);

(DxTreeListSelection as any).$_optionName = "selection";

const DxTreeListToolbarItemConfig = {
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
    locateInMenu: String as PropType<LocateInMenuMode>,
    location: String as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    name: String as PropType<string | TreeListPredefinedToolbarItem>,
    options: {},
    showText: String as PropType<ShowTextMode>,
    template: {},
    text: String,
    visible: Boolean,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxTreeListToolbarItemConfig);

const DxTreeListToolbarItem = defineComponent(DxTreeListToolbarItemConfig);

(DxTreeListToolbarItem as any).$_optionName = "items";
(DxTreeListToolbarItem as any).$_isCollectionItem = true;

const DxValidationRuleConfig = {
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
    comparisonTarget: Function as PropType<(() => any)>,
    comparisonType: String as PropType<ComparisonOperator>,
    ignoreEmptyValue: Boolean,
    max: [Date, Number, String],
    message: String,
    min: [Date, Number, String],
    pattern: [RegExp, String],
    reevaluate: Boolean,
    trim: Boolean,
    type: String as PropType<ValidationRuleType>,
    validationCallback: Function as PropType<((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: any }) => boolean)>
  }
};

prepareConfigurationComponentConfig(DxValidationRuleConfig);

const DxValidationRule = defineComponent(DxValidationRuleConfig);

(DxValidationRule as any).$_optionName = "validationRules";
(DxValidationRule as any).$_isCollectionItem = true;
(DxValidationRule as any).$_predefinedProps = {
  type: "required"
};

export default DxTreeList;
export {
  DxTreeList,
  DxAI,
  DxAIAssistant,
  DxAIOptions,
  DxAnimation,
  DxAsyncRule,
  DxAt,
  DxBoundaryOffset,
  DxButton,
  DxButtonItem,
  DxButtonOptions,
  DxChange,
  DxColCountByScreen,
  DxCollision,
  DxColumn,
  DxColumnButton,
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
  DxEditing,
  DxEditingTexts,
  DxEditorOptions,
  DxEditorOptionsButton,
  DxEmailRule,
  DxEmptyItem,
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
  DxGroupItem,
  DxGroupOperationDescriptions,
  DxHeaderFilter,
  DxHide,
  DxIcons,
  DxIndicatorOptions,
  DxItem,
  DxKeyboardNavigation,
  DxLabel,
  DxLoadPanel,
  DxLookup,
  DxMy,
  DxNumericRule,
  DxOffset,
  DxOperationDescriptions,
  DxOptions,
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
  DxSimpleItem,
  DxSorting,
  DxStateStoring,
  DxStringLengthRule,
  DxTab,
  DxTabbedItem,
  DxTabPanelOptions,
  DxTabPanelOptionsItem,
  DxTexts,
  DxTo,
  DxToolbar,
  DxToolbarItem,
  DxTreeListHeaderFilter,
  DxTreeListHeaderFilterSearch,
  DxTreeListHeaderFilterTexts,
  DxTreeListSelection,
  DxTreeListToolbarItem,
  DxValidationRule
};
import type * as DxTreeListTypes from "devextreme/ui/tree_list_types";
export { DxTreeListTypes };

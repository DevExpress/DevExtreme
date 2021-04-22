/* eslint-disable max-classes-per-file */
import {
  ComponentBindings,
  OneWay,
  Event,
  TwoWay,
  Nested,
  Template,
} from '@devextreme-generator/declarations';
import DxDataGrid from '../../../../../ui/data_grid';
import type {
  Options,
  Column,
  RowObject,
  ColumnButtonClickEvent,
  ColumnButtonTemplateData,
  ColumnCustomizeTextArg,
  RowDraggingAddEvent,
  RowDraggingChangeEvent,
  CustomSummaryInfo,
  ColumnCellTemplateData,
  RowDraggingTemplateData,
  ColumnEditCellTemplateData,
  ColumnGroupCellTemplateData,
  ColumnHeaderCellTemplateData,
  MasterDetailTemplateData,
  SummaryItemTextInfo,
  AdaptiveDetailRowPreparingEvent,
  CellClickEvent,
  CellDblClickEvent,
  CellHoverChangedEvent,
  CellPreparedEvent,
  ContextMenuPreparingEvent,
  ExcelCellInfo,
  DataErrorOccurredEvent,
  RowDraggingEndEvent,
  RowDraggingMoveEvent,
  RowDraggingStartEvent,
  EditingStartEvent,
  EditorPreparedEvent,
  EditorPreparingEvent,
  ExportedEvent,
  ExportingEvent,
  FileSavingEvent,
  FilterPanelCustomizeTextArg,
  FocusedCellChangedEvent,
  FocusedCellChangingEvent,
  FocusedRowChangedEvent,
  FocusedRowChangingEvent,
  InitNewRowEvent,
  KeyDownEvent,
  RowDraggingRemoveEvent,
  RowDraggingReorderEvent,
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
  SelectionChangedEvent,
  ToolbarPreparingEvent,
} from '../../../../../ui/data_grid';
import { BaseWidgetProps } from '../../../common/base_props';

import type { dxFilterBuilderOptions } from '../../../../../ui/filter_builder';
import { DxPromise } from '../../../../../core/utils/deferred'; // eslint-disable-line import/named
import type { UserDefinedElement, DxElement } from '../../../../../core/element'; // eslint-disable-line import/named
import type { template } from '../../../../../core/templates/template';
import DataSource from '../../../../../data/data_source';
import type { DataSourceOptions } from '../../../../../data/data_source';
import type { dxPopupOptions } from '../../../../../ui/popup';
import type {
  RequiredRule,
  NumericRule,
  RangeRule,
  StringLengthRule,
  CustomRule,
  PatternRule,
  CompareRule,
  EmailRule,
  AsyncRule,
// eslint-disable-next-line import/extensions
} from '../../../../../ui/validation_rules';
import type { format } from '../../../../../ui/widget/ui.widget';
import type { dxFormSimpleItem, dxFormOptions } from '../../../../../ui/form';
import type Store from '../../../../../data/abstract_store';
import messageLocalization from '../../../../../localization/message';

@ComponentBindings()
export class DataGridColumnButton {
  @OneWay()
  name?: 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;

  @Event()
  onClick?:
  | ((e: ColumnButtonClickEvent) => any);

  @OneWay()
  template?:
  | template
  | ((
    cellElement: DxElement,
    cellInfo: ColumnButtonTemplateData,
  ) => string | UserDefinedElement);

  @OneWay()
  visible?:
  | boolean
  | ((options: {
    component?: DxDataGrid;
    row?: RowObject;
    column?: Column;
  }) => boolean);
}

@ComponentBindings()
export class DataGridColumnHeaderFilter {
  @OneWay()
  allowSearch?: boolean;

  @OneWay()
  dataSource?:
  | any[]
  | ((options: { component?: any; dataSource?: DataSourceOptions }) => any)
  | DataSourceOptions;

  @OneWay()
  groupInterval?: 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year' | number;

  @OneWay()
  height?: number;

  @OneWay()
  searchMode?: 'contains' | 'startswith' | 'equals';

  @OneWay()
  width?: number;
}

@ComponentBindings()
export class DataGridColumnLookup {
  @OneWay()
  allowClearing?: boolean;

  @OneWay()
  dataSource?:
  | any[]
  | DataSourceOptions
  | Store
  | ((options: { data?: any; key?: any }) => any[] | DataSourceOptions | Store);

  @OneWay()
  displayExpr?: string | ((data: any) => string);

  @OneWay()
  valueExpr?: string;
}

@ComponentBindings()
export class DataGridColumn {
  @OneWay()
  alignment?: 'center' | 'left' | 'right';

  @OneWay()
  allowEditing?: boolean;

  @OneWay()
  allowFiltering?: boolean;

  @OneWay()
  allowFixing?: boolean;

  @OneWay()
  allowHeaderFiltering?: boolean;

  @OneWay()
  allowHiding?: boolean;

  @OneWay()
  allowReordering?: boolean;

  @OneWay()
  allowResizing?: boolean;

  @OneWay()
  allowSearch?: boolean;

  @OneWay()
  allowSorting?: boolean;

  @Event()
  calculateCellValue?: (rowData: any) => any;

  @Event()
  calculateDisplayValue?: string | ((rowData: any) => any);

  @Event()
  calculateFilterExpression?: (
    filterValue: any,
    selectedFilterOperation: string,
    target: string,
  ) => string | any[] | ((...args: any[]) => any);

  @Event()
  calculateSortValue?: string | ((rowData: any) => any);

  @OneWay()
  caption?: string;

  @OneWay()
  cssClass?: string;

  @Event()
  customizeText?: (cellInfo: ColumnCustomizeTextArg) => string;

  @OneWay()
  dataField?: string;

  @OneWay()
  dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';

  @OneWay()
  editorOptions?: any;

  @OneWay()
  encodeHtml?: boolean;

  @OneWay()
  falseText?: string;

  @OneWay()
  filterOperations?: (| '='
  | '<>'
  | '<'
  | '<='
  | '>'
  | '>='
  | 'contains'
  | 'endswith'
  | 'isblank'
  | 'isnotblank'
  | 'notcontains'
  | 'startswith'
  | 'between'
  | 'anyof'
  | 'noneof')[];

  @OneWay()
  filterType?: 'exclude' | 'include';

  @OneWay()
  filterValue?: any;

  @OneWay()
  filterValues?: any[];

  @OneWay()
  fixed?: boolean;

  @OneWay()
  fixedPosition?: 'left' | 'right';

  @OneWay()
  formItem?: dxFormSimpleItem;

  @OneWay()
  format?: format;

  @Nested()
  headerFilter?: DataGridColumnHeaderFilter;

  @OneWay()
  hidingPriority?: number;

  @OneWay()
  isBand?: boolean;

  @Nested()
  lookup?: DataGridColumnLookup;

  @OneWay()
  minWidth?: number;

  @OneWay()
  name?: string;

  @OneWay()
  ownerBand?: number;

  @OneWay()
  renderAsync?: boolean;

  @OneWay()
  selectedFilterOperation?:
  | '<'
  | '<='
  | '<>'
  | '='
  | '>'
  | '>='
  | 'between'
  | 'contains'
  | 'endswith'
  | 'notcontains'
  | 'startswith';

  @Event()
  setCellValue?: (
    newData: any,
    value: any,
    currentRowData: any,
  ) => void | DxPromise;

  @OneWay()
  showEditorAlways?: boolean;

  @OneWay()
  showInColumnChooser?: boolean;

  @OneWay()
  sortIndex?: number;

  @OneWay()
  sortOrder?: 'asc' | 'desc';

  @Event()
  sortingMethod?: (value1: any, value2: any) => number;

  @OneWay()
  trueText?: string;

  @OneWay()
  validationRules?: (| RequiredRule
  | NumericRule
  | RangeRule
  | StringLengthRule
  | CustomRule
  | CompareRule
  | PatternRule
  | EmailRule
  | AsyncRule)[];

  @OneWay()
  visible?: boolean;

  @OneWay()
  visibleIndex?: number;

  @OneWay()
  width?: number | string;

  @OneWay()
  allowExporting?: boolean;

  @OneWay()
  allowGrouping?: boolean;

  @OneWay()
  autoExpandGroup?: boolean;

  @Nested()
  buttons?: ('cancel' | 'delete' | 'edit' | 'save' | 'undelete' | DataGridColumnButton)[];

  @OneWay()
  calculateGroupValue?: string | ((rowData: any) => any);

  @OneWay()
  cellTemplate?:
  | template
  | ((
    cellElement: DxElement,
    cellInfo: ColumnCellTemplateData,
  ) => any);

  @OneWay()
  columns?: (Column | string)[];

  @OneWay()
  editCellTemplate?:
  | template
  | ((
    cellElement: DxElement,
    cellInfo: ColumnEditCellTemplateData,
  ) => any);

  @OneWay()
  groupCellTemplate?:
  | template
  | ((
    cellElement: DxElement,
    cellInfo: ColumnGroupCellTemplateData,
  ) => any);

  @OneWay()
  groupIndex?: number;

  @OneWay()
  headerCellTemplate?:
  | template
  | ((
    columnHeader: DxElement,
    headerInfo: ColumnHeaderCellTemplateData,
  ) => any);

  @OneWay()
  showWhenGrouped?: boolean;

  @OneWay()
  type?: 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection';
}

@ComponentBindings()
export class DataGridEditingTexts {
  @OneWay()
  addRow?: string;

  @OneWay()
  cancelAllChanges?: string;

  @OneWay()
  cancelRowChanges?: string;

  @OneWay()
  confirmDeleteMessage?: string;

  @OneWay()
  confirmDeleteTitle?: string;

  @OneWay()
  deleteRow?: string;

  @OneWay()
  editRow?: string;

  @OneWay()
  saveAllChanges?: string;

  @OneWay()
  undeleteRow?: string;

  @OneWay()
  validationCancelChanges?: string;
}

@ComponentBindings()
export class DataGridEditing {
  @OneWay()
  allowAdding?: boolean;

  @OneWay()
  allowDeleting?:
  | boolean
  | ((options: { component?: DxDataGrid; row?: RowObject }) => boolean);

  @OneWay()
  allowUpdating?:
  | boolean
  | ((options: { component?: DxDataGrid; row?: RowObject }) => boolean);

  @OneWay()
  confirmDelete?: boolean;

  @OneWay()
  form?: dxFormOptions;

  @OneWay()
  mode?: 'batch' | 'cell' | 'row' | 'form' | 'popup';

  @OneWay()
  popup?: dxPopupOptions;

  @OneWay()
  refreshMode?: 'full' | 'reshape' | 'repaint';

  @OneWay()
  selectTextOnEditStart?: boolean;

  @OneWay()
  startEditAction?: 'click' | 'dblClick';

  @Nested()
  texts?: DataGridEditingTexts;

  @OneWay()
  useIcons?: boolean;

  @TwoWay()
  changes?: [];

  @TwoWay()
  editRowKey?: any;

  @TwoWay()
  editColumnName?: string; // TODO null
}

@ComponentBindings()
export class DataGridScrolling {
  @OneWay()
  mode?: 'infinite' | 'standard' | 'virtual';

  @OneWay()
  columnRenderingMode?: 'standard' | 'virtual';

  @OneWay()
  preloadEnabled?: boolean;

  @OneWay()
  rowRenderingMode?: 'standard' | 'virtual';

  @OneWay()
  scrollByContent?: boolean;

  @OneWay()
  scrollByThumb?: boolean;

  @OneWay()
  showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';

  @OneWay()
  useNative?: boolean | 'auto';

  // private

  @OneWay()
  timeout?: number;

  @OneWay()
  updateTimeout?: number;

  @OneWay()
  minTimeout?: number;

  @OneWay()
  renderingThreshold?: number;

  @OneWay()
  removeInvisiblePages?: boolean;

  @OneWay()
  loadTwoPagesOnStart?: boolean;

  @OneWay()
  rowPageSize?: number;

  @OneWay()
  columnPageSize?: number;

  @OneWay()
  columnRenderingThreshold?: number;
}

@ComponentBindings()
export class DataGridSelection {
  @OneWay()
  allowSelectAll?: boolean;

  @OneWay()
  mode?: 'multiple' | 'none' | 'single';

  @OneWay()
  deferred?: boolean;

  @OneWay()
  selectAllMode?: 'allPages' | 'page';

  @OneWay()
  showCheckBoxesMode?: 'always' | 'none' | 'onClick' | 'onLongTap';
}

@ComponentBindings()
export class DataGridPaging {
  @OneWay()
  enabled?: boolean;

  @OneWay()
  pageIndex?: number;

  @OneWay()
  pageSize?: number;
}

@ComponentBindings()
export class DataGridSortByGroupSummaryInfoItem {
  @OneWay()
  groupColumn?: string;

  @OneWay()
  sortOrder?: 'asc' | 'desc';

  @OneWay()
  summaryItem?: string | number;
}

@ComponentBindings()
export class DataGridGroupPanel {
  @OneWay()
  allowColumnDragging?: boolean;

  @OneWay()
  emptyPanelText?: string;

  @OneWay()
  visible?: boolean | 'auto';
}

@ComponentBindings()
export class DataGridGrouping {
  @OneWay()
  allowCollapsing?: boolean;

  @OneWay()
  autoExpandAll?: boolean;

  @OneWay()
  contextMenuEnabled?: boolean;

  @OneWay()
  expandMode?: 'buttonClick' | 'rowClick';

  @OneWay()
  texts?: {
    groupByThisColumn?: string;
    groupContinuedMessage?: string;
    groupContinuesMessage?: string;
    ungroup?: string;
    ungroupAll?: string;
  };
}

@ComponentBindings()
export class DataGridSummaryGroupItem {
  @OneWay()
  alignByColumn?: boolean;

  @OneWay()
  column?: string;

  @Event()
  customizeText?: (itemInfo: SummaryItemTextInfo) => string;

  @OneWay()
  displayFormat?: string;

  @OneWay()
  name?: string;

  @OneWay()
  showInColumn?: string;

  @OneWay()
  showInGroupFooter?: boolean;

  @OneWay()
  skipEmptyValues?: boolean;

  @OneWay()
  summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string;

  @OneWay()
  valueFormat?: format;
}

@ComponentBindings()
export class DataGridSummaryTotalItem {
  @OneWay()
  alignment?: 'center' | 'left' | 'right';

  @OneWay()
  column?: string;

  @OneWay()
  cssClass?: string;

  @Event()
  customizeText?: (itemInfo: SummaryItemTextInfo) => string;

  @OneWay()
  displayFormat?: string;

  @OneWay()
  name?: string;

  @OneWay()
  showInColumn?: string;

  @OneWay()
  skipEmptyValues?: boolean;

  @OneWay()
  summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string;

  @OneWay()
  valueFormat?: format;
}

@ComponentBindings()
export class DataGridSummary {
  @Event()
  calculateCustomSummary?: (options: CustomSummaryInfo) => any;

  @Nested()
  groupItems?: DataGridSummaryGroupItem[];

  @OneWay()
  recalculateWhileEditing?: boolean;

  @OneWay()
  skipEmptyValues?: boolean;

  @OneWay()
  texts?: {
    avg?: string;
    avgOtherColumn?: string;
    count?: string;
    max?: string;
    maxOtherColumn?: string;
    min?: string;
    minOtherColumn?: string;
    sum?: string;
    sumOtherColumn?: string;
  };

  @Nested()
  totalItems?: DataGridSummaryTotalItem[];
}

@ComponentBindings()
export class DataGridPager {
  @OneWay()
  allowedPageSizes?: (number | 'all')[] | 'auto';

  @OneWay()
  displayMode?: 'adaptive' | 'compact' | 'full';

  @OneWay()
  infoText?: string;

  @OneWay()
  showInfo?: boolean;

  @OneWay()
  showNavigationButtons?: boolean;

  @OneWay()
  showPageSizeSelector?: boolean;

  @OneWay()
  visible?: boolean | 'auto';
}

@ComponentBindings()
export class DataGridMasterDetail {
  @OneWay()
  autoExpandAll?: boolean;

  @OneWay()
  enabled?: boolean;

  @OneWay()
  template?:
  | template
  | ((
    detailElement: DxElement,
    detailInfo: MasterDetailTemplateData,
  ) => any);
}

@ComponentBindings()
export class DataGridRowDragging {
  @OneWay()
  allowDropInsideItem?: boolean;

  @OneWay()
  allowReordering?: boolean;

  @OneWay()
  autoScroll?: boolean;

  @OneWay()
  boundary?: string | UserDefinedElement;

  @OneWay()
  container?: string | UserDefinedElement;

  @OneWay()
  cursorOffset?: string | { x?: number; y?: number };

  @OneWay()
  data?: any;

  @OneWay()
  dragDirection?: 'both' | 'horizontal' | 'vertical';

  @OneWay()
  dragTemplate?:
  | template
  | ((
    dragInfo: RowDraggingTemplateData,
    containerElement: DxElement,
  ) => string | UserDefinedElement);

  @OneWay()
  dropFeedbackMode?: 'push' | 'indicate';

  @OneWay()
  filter?: string;

  @OneWay()
  group?: string;

  @OneWay()
  handle?: string;

  @Event()
  onAdd?: (e: RowDraggingAddEvent) => any;

  @Event()
  onDragChange?: (e: RowDraggingChangeEvent) => any;

  @Event()
  onDragEnd?: (e: RowDraggingEndEvent) => any;

  @Event()
  onDragMove?: (e: RowDraggingMoveEvent) => any;

  @Event()
  onDragStart?: (e: RowDraggingStartEvent) => any;

  @Event()
  onRemove?: (e: RowDraggingRemoveEvent) => any;

  @Event()
  onReorder?: (e: RowDraggingReorderEvent) => any;

  @OneWay()
  scrollSensitivity?: number;

  @OneWay()
  scrollSpeed?: number;

  @OneWay()
  showDragIcons?: boolean;
}

@ComponentBindings()
export class DataGridColumnChooser {
  @OneWay()
  allowSearch?: boolean;

  @OneWay()
  emptyPanelText?: string;

  @OneWay()
  enabled?: boolean;

  @OneWay()
  height?: number;

  @OneWay()
  mode?: 'dragAndDrop' | 'select';

  @OneWay()
  searchTimeout?: number;

  @OneWay()
  title?: string;

  @OneWay()
  width?: number;
}

@ComponentBindings()
export class DataGridColumnFixing {
  @OneWay()
  enabled?: boolean;

  @OneWay()
  texts?: {
    fix?: string;
    leftPosition?: string;
    rightPosition?: string;
    unfix?: string;
  };
}

@ComponentBindings()
export class DataGridSearchPanel {
  @OneWay()
  highlightCaseSensitive?: boolean;

  @OneWay()
  highlightSearchText?: boolean;

  @OneWay()
  placeholder?: string;

  @OneWay()
  searchVisibleColumnsOnly?: boolean;

  @OneWay()
  text?: string;

  @OneWay()
  visible?: boolean;

  @OneWay()
  width?: number;
}

@ComponentBindings()
export class DataGridSorting {
  @OneWay()
  ascendingText?: string;

  @OneWay()
  clearText?: string;

  @OneWay()
  descendingText?: string;

  @OneWay()
  mode?: 'multiple' | 'none' | 'single';

  @OneWay()
  showSortIndexes?: boolean;
}

@ComponentBindings()
export class DataGridStateStoring {
  @Event()
  customLoad?: () => DxPromise<any>;

  @Event()
  customSave?: (gridState: any) => any;

  @OneWay()
  enabled?: boolean;

  @OneWay()
  savingTimeout?: number;

  @OneWay()
  storageKey?: string;

  @OneWay()
  type?: 'custom' | 'localStorage' | 'sessionStorage';
}

@ComponentBindings()
export class DataGridFilterPanel {
  @Event()
  customizeText?: (e: FilterPanelCustomizeTextArg<DxDataGrid>) => string;

  @OneWay()
  filterEnabled?: boolean;

  @OneWay()
  texts?: { clearFilter?: string; createFilter?: string; filterEnabledHint?: string };

  @OneWay()
  visible?: boolean;
}

@ComponentBindings()
export class DataGridFilterRow {
  @OneWay()
  applyFilter?: 'auto' | 'onClick';

  @OneWay()
  applyFilterText?: string;

  @OneWay()
  betweenEndText?: string;

  @OneWay()
  betweenStartText?: string;

  @OneWay()
  operationDescriptions?: {
    between?: string;
    contains?: string;
    endsWith?: string;
    equal?: string;
    greaterThan?: string;
    greaterThanOrEqual?: string;
    lessThan?: string;
    lessThanOrEqual?: string;
    notContains?: string;
    notEqual?: string;
    startsWith?: string;
  };

  @OneWay()
  resetOperationText?: string;

  @OneWay()
  showAllText?: string;

  @OneWay()
  showOperationChooser?: boolean;

  @OneWay()
  visible?: boolean;
}

@ComponentBindings()
export class DataGridHeaderFilter {
  @OneWay()
  allowSearch?: boolean;

  @OneWay()
  height?: number;

  @OneWay()
  searchTimeout?: number;

  @OneWay()
  texts?: { cancel?: string; emptyValue?: string; ok?: string };

  @OneWay()
  visible?: boolean;

  @OneWay()
  width?: number;
}

@ComponentBindings()
export class DataGridKeyboardNavigation {
  @OneWay()
  editOnKeyPress?: boolean;

  @OneWay()
  enabled?: boolean;

  @OneWay()
  enterKeyAction?: 'startEdit' | 'moveFocus';

  @OneWay()
  enterKeyDirection?: 'none' | 'column' | 'row';
}

@ComponentBindings()
export class DataGridLoadPanel {
  @OneWay()
  enabled?: boolean | 'auto';

  @OneWay()
  height?: number;

  @OneWay()
  indicatorSrc?: string;

  @OneWay()
  shading?: boolean;

  @OneWay()
  shadingColor?: string;

  @OneWay()
  showIndicator?: boolean;

  @OneWay()
  showPane?: boolean;

  @OneWay()
  text?: string;

  @OneWay()
  width?: number;
}

@ComponentBindings()
export class DataGridExport {
  @OneWay() allowExportSelectedData?: boolean;

  @Event() customizeExcelCell?: ((options: ExcelCellInfo) => any);

  @OneWay() enabled?: boolean;

  @OneWay() excelFilterEnabled?: boolean;

  @OneWay() excelWrapTextEnabled?: boolean;

  @OneWay() fileName?: string;

  @OneWay() ignoreExcelErrors?: boolean;

  @OneWay() proxyUrl?: string;

  @OneWay() texts?: { exportAll?: string; exportSelectedRows?: string; exportTo?: string };
}

@ComponentBindings()
export class DataGridCommonColumnSettings {
  @OneWay() allowFiltering?: boolean;

  @OneWay() allowHiding?: boolean;

  @OneWay() allowSorting?: boolean;

  @OneWay() allowEditing?: boolean;

  @OneWay() allowExporting?: boolean;

  @OneWay() encodeHtml?: boolean;

  @OneWay() trueText?: string;

  @OneWay() falseText?: string;
}

@ComponentBindings()
export class DataGridProps extends BaseWidgetProps implements Options {
  @Nested() columns?: (DataGridColumn | string)[];

  @Nested() editing?: DataGridEditing /* = {
    mode: 'row',
    refreshMode: 'full',
    allowAdding: false,
    allowUpdating: false,
    allowDeleting: false,
    useIcons: false,
    selectTextOnEditStart: false,
    confirmDelete: true,
    form: {
      colCount: 2,
    },
    popup: {},
    startEditAction: 'click',
    editRowKey: null,
    editColumnName: undefined,
    changes: [],
  } */;

  @OneWay() export?: DataGridExport;

  @Nested() groupPanel?: DataGridGroupPanel /* = {
    visible: false,
    emptyPanelText: messageLocalization.format('dxDataGrid-groupPanelEmptyText'),
    allowColumnDragging: true,
  } */;

  @Nested() grouping?: DataGridGrouping /* = {
    autoExpandAll: true,
    allowCollapsing: true,
    contextMenuEnabled: false,
    expandMode: 'buttonClick',
    texts: {
      groupContinuesMessage: messageLocalization.format('dxDataGrid-groupContinuesMessage'),
      groupContinuedMessage: messageLocalization.format('dxDataGrid-groupContinuedMessage'),
      groupByThisColumn: messageLocalization.format('dxDataGrid-groupHeaderText'),
      ungroup: messageLocalization.format('dxDataGrid-ungroupHeaderText'),
      ungroupAll: messageLocalization.format('dxDataGrid-ungroupAllText'),
    },
  } */;

  @Nested() masterDetail?: DataGridMasterDetail;

  @Nested() scrolling?: DataGridScrolling /* = {
    timeout: 300,
    updateTimeout: 300,
    minTimeout: 0,
    renderingThreshold: 100,
    removeInvisiblePages: true,
    rowPageSize: 5,
    mode: 'standard',
    preloadEnabled: false,
    rowRenderingMode: 'standard',
    loadTwoPagesOnStart: false,
    columnRenderingMode: 'standard',
    columnPageSize: 5,
    columnRenderingThreshold: 300,
    useNative: 'auto',
  } */;

  @Nested() selection?: DataGridSelection;

  @Nested() sortByGroupSummaryInfo?: DataGridSortByGroupSummaryInfoItem[];

  @Nested() summary?: DataGridSummary;

  @Nested() columnChooser?: DataGridColumnChooser;

  @Nested() columnFixing?: DataGridColumnFixing;

  @Nested() filterPanel?: DataGridFilterPanel;

  @Nested() filterRow?: DataGridFilterRow;

  @Nested() headerFilter?: DataGridHeaderFilter;

  @OneWay() useKeyboard?: boolean; // TODO remove

  @Nested() keyboardNavigation?: DataGridKeyboardNavigation /* = {
    enabled: true,
    enterKeyAction: 'startEdit',
    enterKeyDirection: 'none',
    editOnKeyPress: false,
  } */;

  @Nested() loadPanel?: DataGridLoadPanel;

  @Nested() pager?: DataGridPager;

  @Nested() paging?: DataGridPaging;

  @Nested() rowDragging?: DataGridRowDragging;

  @Nested() searchPanel?: DataGridSearchPanel /*= {
    visible: false,
    width: 160,
    placeholder: messageLocalization.format('dxDataGrid-searchPanelPlaceholder'),
    highlightSearchText: true,
    highlightCaseSensitive: false,
    text: '',
    searchVisibleColumnsOnly: false,
  } */;

  @Nested() sorting?: DataGridSorting /*= {
    mode: 'single',
    ascendingText: messageLocalization.format('dxDataGrid-sortingAscendingText'),
    descendingText: messageLocalization.format('dxDataGrid-sortingDescendingText'),
    clearText: messageLocalization.format('dxDataGrid-sortingClearText'),
    showSortIndexes: true,
  } */;

  @Nested() stateStoring?: DataGridStateStoring;

  @Template() rowTemplate?: template | ((rowElement: DxElement, rowInfo: any) => any);

  @OneWay() customizeColumns?: (columns: Column[]) => any;

  @OneWay() customizeExportData?: (
    columns: Column[],
    rows: RowObject[],
  ) => any;

  @OneWay() keyExpr?: string | string[];

  @OneWay() remoteOperations?:
  | boolean
  | {
    filtering?: boolean;
    groupPaging?: boolean;
    grouping?: boolean;
    paging?: boolean;
    sorting?: boolean;
    summary?: boolean;
  }
  | 'auto';

  @OneWay() allowColumnReordering?: boolean;

  @OneWay() allowColumnResizing?: boolean;

  @OneWay() autoNavigateToFocusedRow?: boolean;

  @OneWay() cacheEnabled?: boolean;

  @OneWay() cellHintEnabled?: boolean;

  @OneWay() columnAutoWidth?: boolean;

  @OneWay() columnHidingEnabled?: boolean;

  @OneWay() columnMinWidth?: number;

  @OneWay() columnResizingMode?: 'nextColumn' | 'widget';

  @OneWay() columnWidth?: number;

  @OneWay() dataSource?: string | any[] | DataSource | DataSourceOptions;

  @OneWay() dateSerializationFormat?: string;

  @OneWay() errorRowEnabled?: boolean;

  @OneWay() filterBuilder?: dxFilterBuilderOptions;

  @OneWay() filterBuilderPopup?: dxPopupOptions;

  @OneWay() filterSyncEnabled?: boolean | 'auto' = 'auto';

  @OneWay() focusedRowEnabled?: boolean;

  @OneWay() highlightChanges?: boolean;

  @OneWay() noDataText?: string;

  @OneWay() renderAsync?: boolean;

  @OneWay() repaintChangesOnly?: boolean;

  @OneWay() rowAlternationEnabled?: boolean;

  @OneWay() showBorders?: boolean = false;

  @OneWay() showColumnHeaders?: boolean = true;

  @OneWay() showColumnLines?: boolean = true;

  @OneWay() showRowLines?: boolean = false;

  @OneWay() twoWayBindingEnabled?: boolean;

  @OneWay() wordWrapEnabled?: boolean;

  @OneWay() loadingTimeout?: number = 30;

  @OneWay() commonColumnSettings?: DataGridCommonColumnSettings = {
    allowExporting: true,
    allowFiltering: true,
    allowHiding: true,
    allowSorting: true,
    allowEditing: true,
    encodeHtml: true,
    trueText: messageLocalization.format('dxDataGrid-trueText'),
    falseText: messageLocalization.format('dxDataGrid-falseText'),
  };

  // TODO Vitik: Default should be null, but declaration doesnt support it
  @TwoWay() filterValue?: string | any[] | ((...args: any[]) => any) = [];

  @TwoWay() focusedColumnIndex = -1;

  @TwoWay() focusedRowIndex = -1;

  @TwoWay() focusedRowKey: any | null = null;

  @TwoWay() selectedRowKeys: any[] = [];

  @TwoWay() selectionFilter: string | any[] | ((...args: any[]) => any) = [];

  @Event() onCellClick?:
  | ((e: CellClickEvent) => any);

  @Event() onCellDblClick?: (e: CellDblClickEvent) => any;

  @Event() onCellHoverChanged?: (e: CellHoverChangedEvent) => any;

  @Event() onCellPrepared?: (e: CellPreparedEvent) => any;

  @Event() onContextMenuPreparing?: (e: ContextMenuPreparingEvent) => any;

  @Event() onEditingStart?: (e: EditingStartEvent) => any;

  @Event() onEditorPrepared?: (options: EditorPreparedEvent) => any;

  @Event() onEditorPreparing?: (e: EditorPreparingEvent) => any;

  @Event() onExported?: (e: ExportedEvent) => any;

  @Event() onExporting?: (e: ExportingEvent) => any;

  @Event() onFileSaving?: (e: FileSavingEvent) => any;

  @Event() onFocusedCellChanged?: (e: FocusedCellChangedEvent) => any;

  @Event() onFocusedCellChanging?: (e: FocusedCellChangingEvent) => any;

  @Event() onFocusedRowChanged?: (e: FocusedRowChangedEvent) => any;

  @Event() onFocusedRowChanging?: (e: FocusedRowChangingEvent) => any;

  @Event() onRowClick?: (e: RowClickEvent) => any;

  @Event() onRowDblClick?: (e: RowDblClickEvent) => any;

  @Event() onRowPrepared?: (e: RowPreparedEvent) => any;

  @Event() onAdaptiveDetailRowPreparing?: (e: AdaptiveDetailRowPreparingEvent) => any;

  @Event() onDataErrorOccurred?: (e: DataErrorOccurredEvent) => any;

  @Event() onInitNewRow?: (e: InitNewRowEvent) => any;

  @Event() onKeyDown?: (e: KeyDownEvent) => any;

  @Event() onRowCollapsed?: (e: RowCollapsedEvent) => any;

  @Event() onRowCollapsing?: (e: RowCollapsingEvent) => any;

  @Event() onRowExpanded?: (e: RowExpandedEvent) => any;

  @Event() onRowExpanding?: (e: RowExpandingEvent) => any;

  @Event() onRowInserted?: (e: RowInsertedEvent) => any;

  @Event() onRowInserting?: (e: RowInsertingEvent) => any;

  @Event() onRowRemoved?: (e: RowRemovedEvent) => any;

  @Event() onRowRemoving?: (e: RowRemovingEvent) => any;

  @Event() onRowUpdated?: (e: RowUpdatedEvent) => any;

  @Event() onRowUpdating?: (e: RowUpdatingEvent) => any;

  @Event() onRowValidating?: (e: RowValidatingEvent) => any;

  @Event() onSelectionChanged?: (e: SelectionChangedEvent) => any;

  @Event() onToolbarPreparing?: (e: ToolbarPreparingEvent) => any;
}

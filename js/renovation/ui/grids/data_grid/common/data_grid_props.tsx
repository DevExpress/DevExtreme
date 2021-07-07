/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
import {
  ComponentBindings,
  OneWay,
  Event,
  TwoWay,
  Nested,
  Template,
} from '@devextreme-generator/declarations';
import type { dxToolbarItem } from '../../../../../ui/toolbar';
import type { dxLoadPanelAnimation } from '../../../../../ui/load_panel';
import DxDataGrid from '../../../../../ui/data_grid';
import type {
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
  SavingEvent,
  SavedEvent,
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
import type { Properties as PopupProperties } from '../../../../../ui/popup';
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
import type { Format } from '../../../../../localization';
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

  @OneWay()
  disabled?:
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
  | Store
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
  filterOperations?: (
    | '='
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
  format?: Format;

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
  ) => undefined | DxPromise;

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
  validationRules?: (
    | RequiredRule
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
  allowAdding? = false;

  @OneWay()
  allowDeleting?:
  | boolean
  | ((options: { component?: DxDataGrid; row?: RowObject }) => boolean) = false;

  @OneWay()
  allowUpdating?:
  | boolean
  | ((options: { component?: DxDataGrid; row?: RowObject }) => boolean) = false;

  @OneWay()
  confirmDelete? = true;

  @OneWay()
  form?: dxFormOptions = { colCount: 2 };

  @OneWay()
  mode?: 'batch' | 'cell' | 'row' | 'form' | 'popup' = 'row';

  @OneWay()
  popup?: PopupProperties = {};

  @OneWay()
  refreshMode?: 'full' | 'reshape' | 'repaint' = 'full';

  @OneWay()
  selectTextOnEditStart? = false;

  @OneWay()
  startEditAction?: 'click' | 'dblClick' = 'click';

  @Nested()
  texts?: DataGridEditingTexts;

  @OneWay()
  useIcons? = false;

  @TwoWay()
  changes?: [] = [];

  @TwoWay()
  editRowKey?: any = null;

  @TwoWay()
  editColumnName?: string | null = null;
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
  valueFormat?: Format;
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
  valueFormat?: Format;
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
  onAdd?: (e: RowDraggingAddEvent) => void;

  @Event()
  onDragChange?: (e: RowDraggingChangeEvent) => void;

  @Event()
  onDragEnd?: (e: RowDraggingEndEvent) => void;

  @Event()
  onDragMove?: (e: RowDraggingMoveEvent) => void;

  @Event()
  onDragStart?: (e: RowDraggingStartEvent) => void;

  @Event()
  onRemove?: (e: RowDraggingRemoveEvent) => void;

  @Event()
  onReorder?: (e: RowDraggingReorderEvent) => void;

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

  @OneWay()
  sortOrder?: 'asc' | 'desc';
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

  @OneWay()
  animation?: dxLoadPanelAnimation;
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

type DataGridDefaultToolbarItemName = 'addRowButton' | 'applyFilterButton' | 'columnChooserButton' | 'exportButton' | 'groupPanel' | 'revertButton' | 'saveButton' | 'searchPanel';

export interface DataGridToolbarItem extends dxToolbarItem {
  name?: DataGridDefaultToolbarItemName | string;
}

@ComponentBindings()
export class DataGridToolbar {
  @OneWay() items?: (DataGridDefaultToolbarItemName | DataGridToolbarItem)[];
}

@ComponentBindings()
export class DataGridProps extends BaseWidgetProps /* implements Options */ {
  @Nested() columns?: (DataGridColumn | string)[];

  @Nested() editing?: DataGridEditing = {
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
    editColumnName: null,
    changes: [],
  };

  @OneWay() export?: DataGridExport;

  @Nested() groupPanel?: DataGridGroupPanel = {
    visible: false,
    emptyPanelText: messageLocalization.format('dxDataGrid-groupPanelEmptyText'),
    allowColumnDragging: true,
  };

  @Nested() grouping?: DataGridGrouping = {
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
  };

  @Nested() masterDetail?: DataGridMasterDetail;

  @Nested() scrolling?: DataGridScrolling = {
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
  };

  @Nested() selection?: DataGridSelection;

  @Nested() sortByGroupSummaryInfo?: DataGridSortByGroupSummaryInfoItem[];

  @Nested() summary?: DataGridSummary;

  @Nested() columnChooser?: DataGridColumnChooser;

  @Nested() columnFixing?: DataGridColumnFixing;

  @Nested() filterPanel?: DataGridFilterPanel;

  @Nested() filterRow?: DataGridFilterRow;

  @Nested() headerFilter?: DataGridHeaderFilter;

  @OneWay() useKeyboard?: boolean; // TODO remove

  @Nested() keyboardNavigation?: DataGridKeyboardNavigation = {
    enabled: true,
    enterKeyAction: 'startEdit',
    enterKeyDirection: 'none',
    editOnKeyPress: false,
  };

  @Nested() loadPanel?: DataGridLoadPanel = {
    enabled: 'auto',
    text: messageLocalization.format('Loading'),
    width: 200,
    height: 90,
    showIndicator: true,
    indicatorSrc: '',
    showPane: true,
  };

  @Nested() pager?: DataGridPager;

  @Nested() paging?: DataGridPaging;

  @Nested() rowDragging?: DataGridRowDragging;

  @Nested() searchPanel?: DataGridSearchPanel = {
    visible: false,
    width: 160,
    placeholder: messageLocalization.format('dxDataGrid-searchPanelPlaceholder'),
    highlightSearchText: true,
    highlightCaseSensitive: false,
    text: '',
    searchVisibleColumnsOnly: false,
  };

  @Nested() sorting?: DataGridSorting = {
    mode: 'single',
    ascendingText: messageLocalization.format('dxDataGrid-sortingAscendingText'),
    descendingText: messageLocalization.format('dxDataGrid-sortingDescendingText'),
    clearText: messageLocalization.format('dxDataGrid-sortingClearText'),
    showSortIndexes: true,
  };

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

  @OneWay() dataSource?: string | any[] | Store | DataSource | DataSourceOptions;

  @OneWay() dateSerializationFormat?: string;

  @OneWay() errorRowEnabled?: boolean;

  @OneWay() filterBuilder?: dxFilterBuilderOptions;

  @OneWay() filterBuilderPopup?: PopupProperties;

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

  @OneWay() toolbar?: DataGridToolbar;

  @TwoWay() filterValue?: string | any[] | ((...args: any[]) => any) | null = null;

  @TwoWay() focusedColumnIndex = -1;

  @TwoWay() focusedRowIndex = -1;

  @TwoWay() focusedRowKey: any = null;

  @TwoWay() selectedRowKeys: any[] = [];

  @TwoWay() selectionFilter: string | any[] | ((...args: any[]) => any) = [];

  @Event() onCellClick?:
  | ((e: CellClickEvent) => any);

  @Event() onCellDblClick?: (e: CellDblClickEvent) => void;

  @Event() onCellHoverChanged?: (e: CellHoverChangedEvent) => void;

  @Event() onCellPrepared?: (e: CellPreparedEvent) => void;

  @Event() onContextMenuPreparing?: (e: ContextMenuPreparingEvent) => void;

  @Event() onEditingStart?: (e: EditingStartEvent) => void;

  @Event() onEditorPrepared?: (options: EditorPreparedEvent) => void;

  @Event() onEditorPreparing?: (e: EditorPreparingEvent) => void;

  @Event() onExported?: (e: ExportedEvent) => void;

  @Event() onExporting?: (e: ExportingEvent) => void;

  @Event() onFileSaving?: (e: FileSavingEvent) => void;

  @Event() onFocusedCellChanged?: (e: FocusedCellChangedEvent) => void;

  @Event() onFocusedCellChanging?: (e: FocusedCellChangingEvent) => void;

  @Event() onFocusedRowChanged?: (e: FocusedRowChangedEvent) => void;

  @Event() onFocusedRowChanging?: (e: FocusedRowChangingEvent) => void;

  @Event() onRowClick?: (e: RowClickEvent) => void;

  @Event() onRowDblClick?: (e: RowDblClickEvent) => void;

  @Event() onRowPrepared?: (e: RowPreparedEvent) => void;

  @Event() onAdaptiveDetailRowPreparing?: (e: AdaptiveDetailRowPreparingEvent) => void;

  @Event() onDataErrorOccurred?: (e: DataErrorOccurredEvent) => void;

  @Event() onInitNewRow?: (e: InitNewRowEvent) => void;

  @Event() onKeyDown?: (e: KeyDownEvent) => void;

  @Event() onRowCollapsed?: (e: RowCollapsedEvent) => void;

  @Event() onRowCollapsing?: (e: RowCollapsingEvent) => void;

  @Event() onRowExpanded?: (e: RowExpandedEvent) => void;

  @Event() onRowExpanding?: (e: RowExpandingEvent) => void;

  @Event() onRowInserted?: (e: RowInsertedEvent) => void;

  @Event() onRowInserting?: (e: RowInsertingEvent) => void;

  @Event() onRowRemoved?: (e: RowRemovedEvent) => void;

  @Event() onRowRemoving?: (e: RowRemovingEvent) => void;

  @Event() onRowUpdated?: (e: RowUpdatedEvent) => void;

  @Event() onRowUpdating?: (e: RowUpdatingEvent) => void;

  @Event() onRowValidating?: (e: RowValidatingEvent) => void;

  @Event() onSelectionChanged?: (e: SelectionChangedEvent) => void;

  @Event() onToolbarPreparing?: (e: ToolbarPreparingEvent) => void;

  @Event() onSaving?: (e: SavingEvent) => void;

  @Event() onSaved?: (e: SavedEvent) => void;
}

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
import { FilterDescriptor } from '../../../../../data';
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
  EditorOptions,
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
import devices from '../../../../../core/devices';
import browser from '../../../../../core/utils/browser';
import { isMaterial, current } from '../../../../../ui/themes';

function getDefaultShowRowLines(): boolean {
  return devices.real().platform === 'ios' || isMaterial(current());
}

function getDefaultShowColumnLines(): boolean {
  return !isMaterial(current());
}

@ComponentBindings()
export class DataGridColumnButton
  <TRowData,
   TKey,
   TCellValue,
   TColumns extends Column<TRowData, TKey, any>[]=Column<TRowData, TKey, any>[],
  > {
  @OneWay()
  name?: 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;

  @Event()
  onClick?:
  | ((e: ColumnButtonClickEvent<TRowData, TKey, TCellValue, TColumns>) => any);

  @OneWay()
  template?:
  | template
  | ((
    cellElement: DxElement,
    cellInfo: ColumnButtonTemplateData<TRowData, TKey, TCellValue, TColumns>,
  ) => string | UserDefinedElement);

  @OneWay()
  visible?:
  | boolean
  | ((options: {
    component?: DxDataGrid<TRowData, string, TKey, TColumns>;
    row?: RowObject<TRowData, TKey, TColumns>;
    column?: Column<TRowData, TKey, TCellValue>;
  }) => boolean);

  @OneWay()
  disabled?: boolean
  | ((options: {
    component?: DxDataGrid<TRowData, string, TKey, TColumns>;
    row?: RowObject<TRowData, TKey, TColumns>;
    column?: Column<TRowData, TKey, TCellValue>;
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
export class DataGridColumn<TRowData, TKey, TCellValue> {
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
  calculateCellValue?: (rowData: TRowData) => TCellValue;

  @Event()
  calculateDisplayValue?: string | ((rowData: TRowData) => any);

  @Event()
  calculateFilterExpression?: (
    filterValue: TCellValue | TCellValue[],
    selectedFilterOperation: string,
    target: 'filterRow' | 'headerFilter' | 'filterBuilder' | 'search'
  ) => FilterDescriptor;

  @Event()
  calculateSortValue?: string | ((rowData: TRowData) => any);

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
  editorOptions?: EditorOptions;

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
  filterValue?: TCellValue;

  @OneWay()
  filterValues?: TCellValue[];

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
    newData: TRowData,
    value: TCellValue,
    currentRowData: TRowData,
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
  sortingMethod?: (value1: TCellValue, value2: TCellValue) => number;

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
  buttons?: ('cancel' | 'delete' | 'edit' | 'save' | 'undelete' | DataGridColumnButton<TRowData, TKey, TCellValue>)[];

  @OneWay()
  calculateGroupValue?: string | ((rowData: TRowData) => any);

  @OneWay()
  cellTemplate?:
  | template
  | ((
    cellElement: DxElement,
    cellInfo: ColumnCellTemplateData<TRowData, TKey, TCellValue>,
  ) => string | UserDefinedElement);

  @OneWay()
  columns?: (Column<TRowData, TKey, any> | string)[];

  @OneWay()
  editCellTemplate?:
  | template
  | ((
    cellElement: DxElement,
    cellInfo: ColumnEditCellTemplateData<TRowData, TKey, TCellValue>,
  ) => string | UserDefinedElement);

  @OneWay()
  groupCellTemplate?:
  | template
  | ((
    cellElement: DxElement,
    cellInfo: ColumnGroupCellTemplateData<TRowData, TKey, TCellValue>,
  ) => string | UserDefinedElement);

  @OneWay()
  groupIndex?: number;

  @OneWay()
  headerCellTemplate?:
  | template
  | ((
    columnHeader: DxElement,
    headerInfo: ColumnHeaderCellTemplateData<TRowData, TKey, TCellValue>,
  ) => string | UserDefinedElement);

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
  saveRowChanges?: string;

  @OneWay()
  undeleteRow?: string;

  @OneWay()
  validationCancelChanges?: string;
}

@ComponentBindings()
export class DataGridEditing
  <TRowData,
   TKey,
   TColumns extends Column<TRowData, TKey, any>[] = Column<TRowData, TKey, any>[],
  > {
  @OneWay()
  allowAdding? = false;

  @OneWay()
  allowDeleting?:
  | boolean
  | ((options: {
    component?: DxDataGrid<TRowData, string, TKey>;
    row?: RowObject<TRowData, TKey, TColumns>;
  }) => boolean) = false;

  @OneWay()
  allowUpdating?:
  | boolean
  | ((options: {
    component?: DxDataGrid<TRowData, string, TKey>;
    row?: RowObject<TRowData, TKey, TColumns>;
  }) => boolean) = false;

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
  texts?: DataGridEditingTexts = {
    editRow: messageLocalization.format('dxDataGrid-editingEditRow'),
    saveAllChanges: messageLocalization.format('dxDataGrid-editingSaveAllChanges'),
    saveRowChanges: messageLocalization.format('dxDataGrid-editingSaveRowChanges'),
    cancelAllChanges: messageLocalization.format('dxDataGrid-editingCancelAllChanges'),
    cancelRowChanges: messageLocalization.format('dxDataGrid-editingCancelRowChanges'),
    addRow: messageLocalization.format('dxDataGrid-editingAddRow'),
    deleteRow: messageLocalization.format('dxDataGrid-editingDeleteRow'),
    undeleteRow: messageLocalization.format('dxDataGrid-editingUndeleteRow'),
    confirmDeleteMessage: messageLocalization.format('dxDataGrid-editingConfirmDeleteMessage'),
    confirmDeleteTitle: '',
    validationCancelChanges: messageLocalization.format('dxDataGrid-validationCancelChanges'),
  };

  @OneWay()
  useIcons? = isMaterial(current());

  @TwoWay()
  changes?: any[] = [];

  @TwoWay()
  editRowKey?: TKey | null = null;

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

  @OneWay()
  newMode?: boolean;

  @OneWay()
  minGap?: number;
}

@ComponentBindings()
export class DataGridSelection<TDeferred extends boolean> {
  @OneWay()
  allowSelectAll?: boolean;

  @OneWay()
  mode?: 'multiple' | 'none' | 'single';

  @OneWay()
  deferred?: TDeferred;

  @OneWay()
  selectAllMode?: 'allPages' | 'page';

  @OneWay()
  showCheckBoxesMode?: 'always' | 'none' | 'onClick' | 'onLongTap';

  @OneWay()
  maxFilterLengthInRequest?: number;
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
export class DataGridSummary<TKey, TRowData> {
  @Event()
  calculateCustomSummary?: (options: CustomSummaryInfo<TKey, TRowData>) => any;

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
export class DataGridMasterDetail<TRowData, TKey> {
  @OneWay()
  autoExpandAll?: boolean;

  @OneWay()
  enabled?: boolean;

  @OneWay()
  template?:
  | template
  | ((
    detailElement: DxElement,
    detailInfo: MasterDetailTemplateData<TRowData, TKey>,
  ) => string | UserDefinedElement);
}

@ComponentBindings()
export class DataGridRowDragging<TKey, TRowData> {
  @OneWay()
  allowDropInsideItem?: boolean;

  @OneWay()
  allowReordering?: boolean;

  @OneWay()
  autoScroll?: boolean;

  @OneWay()
  boundary?: string | HTMLElement;

  @OneWay()
  container?: string | HTMLElement;

  @OneWay()
  cursorOffset?: string | { x?: number; y?: number };

  @OneWay()
  data?: TRowData;

  @OneWay()
  dragDirection?: 'both' | 'horizontal' | 'vertical';

  @OneWay()
  dragTemplate?:
  | template
  | ((
    dragInfo: RowDraggingTemplateData<TRowData>,
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
  onAdd?: (e: RowDraggingAddEvent<TKey, TRowData>) => void;

  @Event()
  onDragChange?: (e: RowDraggingChangeEvent<TKey, TRowData>) => void;

  @Event()
  onDragEnd?: (e: RowDraggingEndEvent<TKey, TRowData>) => void;

  @Event()
  onDragMove?: (e: RowDraggingMoveEvent<TKey, TRowData>) => void;

  @Event()
  onDragStart?: (e: RowDraggingStartEvent<TKey, TRowData>) => void;

  @Event()
  onRemove?: (e: RowDraggingRemoveEvent<TKey, TRowData>) => void;

  @Event()
  onReorder?: (e: RowDraggingReorderEvent<TKey, TRowData>) => void;

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
export class DataGridStateStoring<TStateStoringType extends 'custom' | 'localStorage' | 'sessionStorage'> {
  @Event()
  customLoad?: TStateStoringType extends 'custom' ? (() => PromiseLike<any>) : never;

  @Event()
  customSave?: TStateStoringType extends 'custom' ? ((gridState: any) => void) : never;

  @OneWay()
  enabled?: boolean;

  @OneWay()
  savingTimeout?: number;

  @OneWay()
  storageKey?: TStateStoringType extends 'localStorage' | 'sessionStorage' ? string : never;

  @OneWay()
  type?: 'custom' | 'localStorage' | 'sessionStorage';
}

@ComponentBindings()
export class DataGridFilterPanel<TRowData, TKey> {
  @Event()
  customizeText?: (e: FilterPanelCustomizeTextArg<DxDataGrid<TRowData, string, TKey>>) => string;

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
    isBlank?: string;
    isNotBlank?: string;
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
export class DataGridExport<TKey, TRowData> {
  @OneWay() allowExportSelectedData?: boolean;

  @Event() customizeExcelCell?: (options: ExcelCellInfo<TKey, TRowData>) => void;

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
export class DataGridProps
  <TRowData,
   TKeyExpr extends string | string[],
   TKey=TKeyExpr extends keyof TRowData ? TRowData[TKeyExpr] : any,
   TColumns extends Column<TRowData, TKey, any>[]= Column<TRowData, TKey, any>[],
   TSelectionDeferred extends boolean=boolean,
   TStateStoringType extends 'custom' | 'localStorage' | 'sessionStorage'='custom' | 'localStorage' | 'sessionStorage',
  >
  extends BaseWidgetProps /* implements Options */ {
  @Nested() columns?: TColumns;

  @Nested() editing?: DataGridEditing<TKey, TRowData> = {
    mode: 'row',
    refreshMode: 'full',
    allowAdding: false,
    allowUpdating: false,
    allowDeleting: false,
    useIcons: isMaterial(current()),
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
    texts: {
      editRow: messageLocalization.format('dxDataGrid-editingEditRow'),
      saveAllChanges: messageLocalization.format('dxDataGrid-editingSaveAllChanges'),
      saveRowChanges: messageLocalization.format('dxDataGrid-editingSaveRowChanges'),
      cancelAllChanges: messageLocalization.format('dxDataGrid-editingCancelAllChanges'),
      cancelRowChanges: messageLocalization.format('dxDataGrid-editingCancelRowChanges'),
      addRow: messageLocalization.format('dxDataGrid-editingAddRow'),
      deleteRow: messageLocalization.format('dxDataGrid-editingDeleteRow'),
      undeleteRow: messageLocalization.format('dxDataGrid-editingUndeleteRow'),
      confirmDeleteMessage: messageLocalization.format('dxDataGrid-editingConfirmDeleteMessage'),
      confirmDeleteTitle: '',
      validationCancelChanges: messageLocalization.format('dxDataGrid-validationCancelChanges'),
    },
  };

  @OneWay() export?: DataGridExport<TKey, TRowData> = {
    enabled: false,
    fileName: 'DataGrid',
    excelFilterEnabled: false,
    allowExportSelectedData: false,
    ignoreExcelErrors: true,
    customizeExcelCell: undefined,
    texts: {
      exportTo: messageLocalization.format('dxDataGrid-exportTo'),
      exportAll: messageLocalization.format('dxDataGrid-exportAll'),
      exportSelectedRows: messageLocalization.format('dxDataGrid-exportSelectedRows'),
    },
  };

  @Nested() groupPanel?: DataGridGroupPanel = {
    visible: false,
    emptyPanelText: messageLocalization.format('dxDataGrid-groupPanelEmptyText'),
    allowColumnDragging: true,
  };

  @Nested() grouping?: DataGridGrouping = {
    autoExpandAll: true,
    allowCollapsing: true,
    contextMenuEnabled: false,
    expandMode: devices.real().deviceType !== 'desktop' ? 'rowClick' : 'buttonClick',
    texts: {
      groupContinuesMessage: messageLocalization.format('dxDataGrid-groupContinuesMessage'),
      groupContinuedMessage: messageLocalization.format('dxDataGrid-groupContinuedMessage'),
      groupByThisColumn: messageLocalization.format('dxDataGrid-groupHeaderText'),
      ungroup: messageLocalization.format('dxDataGrid-ungroupHeaderText'),
      ungroupAll: messageLocalization.format('dxDataGrid-ungroupAllText'),
    },
  };

  @Nested() masterDetail?: DataGridMasterDetail<TRowData, TKey> = {
    enabled: false,
    autoExpandAll: false,
  };

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
    newMode: true,
    minGap: 1,
  };

  @Nested() selection?: DataGridSelection<TSelectionDeferred> = {
    mode: 'none',
    showCheckBoxesMode: 'onClick',
    allowSelectAll: true,
    selectAllMode: 'allPages',
    maxFilterLengthInRequest: 1500,
    deferred: false,
  };

  @Nested() sortByGroupSummaryInfo?: DataGridSortByGroupSummaryInfoItem[];

  @Nested() summary?: DataGridSummary<TKey, TRowData> = {
    groupItems: undefined,
    totalItems: undefined,
    calculateCustomSummary: undefined,
    skipEmptyValues: true,
    recalculateWhileEditing: false,
    texts: {
      sum: messageLocalization.format('dxDataGrid-summarySum'),
      sumOtherColumn: messageLocalization.format('dxDataGrid-summarySumOtherColumn'),
      min: messageLocalization.format('dxDataGrid-summaryMin'),
      minOtherColumn: messageLocalization.format('dxDataGrid-summaryMinOtherColumn'),
      max: messageLocalization.format('dxDataGrid-summaryMax'),
      maxOtherColumn: messageLocalization.format('dxDataGrid-summaryMaxOtherColumn'),
      avg: messageLocalization.format('dxDataGrid-summaryAvg'),
      avgOtherColumn: messageLocalization.format('dxDataGrid-summaryAvgOtherColumn'),
      count: messageLocalization.format('dxDataGrid-summaryCount'),
    },
  };

  @Nested() columnChooser?: DataGridColumnChooser = {
    enabled: false,
    allowSearch: false,
    searchTimeout: 500,
    mode: 'dragAndDrop',
    width: 250,
    height: 260,
    title: messageLocalization.format('dxDataGrid-columnChooserTitle'),
    emptyPanelText: messageLocalization.format('dxDataGrid-columnChooserEmptyText'),
  };

  @Nested() columnFixing?: DataGridColumnFixing = {
    enabled: false,
    texts: {
      fix: messageLocalization.format('dxDataGrid-columnFixingFix'),
      unfix: messageLocalization.format('dxDataGrid-columnFixingUnfix'),
      leftPosition: messageLocalization.format('dxDataGrid-columnFixingLeftPosition'),
      rightPosition: messageLocalization.format('dxDataGrid-columnFixingRightPosition'),
    },
  };

  @Nested() filterPanel?: DataGridFilterPanel<TKey, TRowData> = {
    visible: false,
    filterEnabled: true,
    texts: {
      createFilter: messageLocalization.format('dxDataGrid-filterPanelCreateFilter'),
      clearFilter: messageLocalization.format('dxDataGrid-filterPanelClearFilter'),
      filterEnabledHint: messageLocalization.format('dxDataGrid-filterPanelFilterEnabledHint'),
    },
  };

  @Nested() filterRow?: DataGridFilterRow = {
    visible: false,
    showOperationChooser: true,
    showAllText: messageLocalization.format('dxDataGrid-filterRowShowAllText'),
    resetOperationText: messageLocalization.format('dxDataGrid-filterRowResetOperationText'),
    applyFilter: 'auto',
    applyFilterText: messageLocalization.format('dxDataGrid-applyFilterText'),
    operationDescriptions: {
      equal: messageLocalization.format('dxDataGrid-filterRowOperationEquals'),
      notEqual: messageLocalization.format('dxDataGrid-filterRowOperationNotEquals'),
      lessThan: messageLocalization.format('dxDataGrid-filterRowOperationLess'),
      lessThanOrEqual: messageLocalization.format('dxDataGrid-filterRowOperationLessOrEquals'),
      greaterThan: messageLocalization.format('dxDataGrid-filterRowOperationGreater'),
      greaterThanOrEqual: messageLocalization.format('dxDataGrid-filterRowOperationGreaterOrEquals'),
      startsWith: messageLocalization.format('dxDataGrid-filterRowOperationStartsWith'),
      contains: messageLocalization.format('dxDataGrid-filterRowOperationContains'),
      notContains: messageLocalization.format('dxDataGrid-filterRowOperationNotContains'),
      endsWith: messageLocalization.format('dxDataGrid-filterRowOperationEndsWith'),
      between: messageLocalization.format('dxDataGrid-filterRowOperationBetween'),
      isBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsBlank'),
      isNotBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsNotBlank'),
    },
    betweenStartText: messageLocalization.format('dxDataGrid-filterRowOperationBetweenStartText'),
    betweenEndText: messageLocalization.format('dxDataGrid-filterRowOperationBetweenEndText'),
  };

  @Nested() headerFilter?: DataGridHeaderFilter = {
    visible: false,
    width: 252,
    height: isMaterial(current()) ? 315 : 325,
    allowSearch: false,
    searchTimeout: 500,
    texts: {
      emptyValue: messageLocalization.format('dxDataGrid-headerFilterEmptyValue'),
      ok: messageLocalization.format('dxDataGrid-headerFilterOK'),
      cancel: messageLocalization.format('dxDataGrid-headerFilterCancel'),
    },
  };

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

  @Nested() pager?: DataGridPager = {
    visible: 'auto',
    showPageSizeSelector: false,
    allowedPageSizes: 'auto',
  };

  @Nested() paging?: DataGridPaging = {
    enabled: true,
  };

  @Nested() rowDragging?: DataGridRowDragging<TKey, TRowData> = {
    showDragIcons: true,
    dropFeedbackMode: 'indicate',
    allowReordering: false,
    allowDropInsideItem: false,
  };

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

  @Nested() stateStoring?: DataGridStateStoring<TStateStoringType> = {
    enabled: false,
    type: 'localStorage',
    savingTimeout: 2000,
  };

  @Template() rowTemplate?: template | (
    (rowElement: DxElement, rowInfo: TRowData) => string | UserDefinedElement
  );

  @OneWay() customizeColumns?: (columns: TColumns) => void;

  @OneWay() customizeExportData?: (
    columns: TColumns,
    rows: RowObject<TRowData, TKey, TColumns>[],
  ) => void;

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
  | 'auto' = 'auto';

  @OneWay() allowColumnReordering?: boolean = false;

  @OneWay() allowColumnResizing?: boolean = false;

  @OneWay() autoNavigateToFocusedRow?: boolean = true;

  @OneWay() cacheEnabled?: boolean = true;

  @OneWay() cellHintEnabled?: boolean = true;

  @OneWay() columnAutoWidth?: boolean = false;

  @OneWay() columnHidingEnabled?: boolean = false;

  @OneWay() columnMinWidth?: number;

  @OneWay() columnResizingMode?: 'nextColumn' | 'widget' = 'nextColumn';

  @OneWay() columnWidth?: number;

  @OneWay() dataSource?: string | TRowData[] | Store | DataSource | DataSourceOptions;

  @OneWay() dateSerializationFormat?: string;

  @OneWay() errorRowEnabled?: boolean = true;

  @OneWay() filterBuilder?: dxFilterBuilderOptions = {
    groupOperationDescriptions: {
      and: messageLocalization.format('dxFilterBuilder-and'),
      or: messageLocalization.format('dxFilterBuilder-or'),
      notAnd: messageLocalization.format('dxFilterBuilder-notAnd'),
      notOr: messageLocalization.format('dxFilterBuilder-notOr'),
    },
    filterOperationDescriptions: {
      between: messageLocalization.format('dxFilterBuilder-filterOperationBetween'),
      equal: messageLocalization.format('dxFilterBuilder-filterOperationEquals'),
      notEqual: messageLocalization.format('dxFilterBuilder-filterOperationNotEquals'),
      lessThan: messageLocalization.format('dxFilterBuilder-filterOperationLess'),
      lessThanOrEqual: messageLocalization.format('dxFilterBuilder-filterOperationLessOrEquals'),
      greaterThan: messageLocalization.format('dxFilterBuilder-filterOperationGreater'),
      greaterThanOrEqual: messageLocalization.format('dxFilterBuilder-filterOperationGreaterOrEquals'),
      startsWith: messageLocalization.format('dxFilterBuilder-filterOperationStartsWith'),
      contains: messageLocalization.format('dxFilterBuilder-filterOperationContains'),
      notContains: messageLocalization.format('dxFilterBuilder-filterOperationNotContains'),
      endsWith: messageLocalization.format('dxFilterBuilder-filterOperationEndsWith'),
      isBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsBlank'),
      isNotBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsNotBlank'),
    },
  };

  @OneWay() filterBuilderPopup?: PopupProperties = {};

  @OneWay() filterSyncEnabled?: boolean | 'auto' = 'auto';

  @OneWay() focusedRowEnabled?: boolean = false;

  @OneWay() highlightChanges?: boolean = false;

  @OneWay() noDataText?: string = messageLocalization.format('dxDataGrid-noDataText');

  @OneWay() renderAsync?: boolean = false;

  @OneWay() repaintChangesOnly?: boolean = false;

  @OneWay() rowAlternationEnabled?: boolean = false;

  @OneWay() showBorders?: boolean = false;

  @OneWay() showColumnHeaders?: boolean = true;

  @OneWay() showColumnLines?: boolean = getDefaultShowColumnLines();

  @OneWay() showRowLines?: boolean = getDefaultShowRowLines();

  @OneWay() twoWayBindingEnabled?: boolean = true;

  @OneWay() wordWrapEnabled?: boolean = false;

  @OneWay() loadingTimeout?: number = browser.webkit ? 30 /* T344031 */ : 0;

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

  @TwoWay() filterValue?: FilterDescriptor;

  @TwoWay() focusedColumnIndex = -1;

  @TwoWay() focusedRowIndex = -1;

  @TwoWay() focusedRowKey: TKey | null = null;

  @TwoWay() selectedRowKeys: TKey[] = [];

  @TwoWay() selectionFilter: FilterDescriptor = [];

  @Event() onCellClick?:
  | ((e: CellClickEvent<TKey, TRowData>) => void);

  @Event() onCellDblClick?: (e: CellDblClickEvent<TKey, TRowData>) => void;

  @Event() onCellHoverChanged?: (e: CellHoverChangedEvent<TKey, TRowData>) => void;

  @Event() onCellPrepared?: (e: CellPreparedEvent<TKey, TRowData>) => void;

  @Event() onContextMenuPreparing?: (e: ContextMenuPreparingEvent<TKey, TRowData>) => void;

  @Event() onEditingStart?: (e: EditingStartEvent<TKey, TRowData>) => void;

  @Event() onEditorPrepared?: (options: EditorPreparedEvent<TKey, TRowData>) => void;

  @Event() onEditorPreparing?: (e: EditorPreparingEvent<TKey, TRowData>) => void;

  @Event() onExported?: (e: ExportedEvent<TKey, TRowData>) => void;

  @Event() onExporting?: (e: ExportingEvent<TKey, TRowData>) => void;

  @Event() onFileSaving?: (e: FileSavingEvent<TKey, TRowData>) => void;

  @Event() onFocusedCellChanged?: (e: FocusedCellChangedEvent<TKey, TRowData>) => void;

  @Event() onFocusedCellChanging?: (e: FocusedCellChangingEvent<TKey, TRowData>) => void;

  @Event() onFocusedRowChanged?: (e: FocusedRowChangedEvent<TKey, TRowData>) => void;

  @Event() onFocusedRowChanging?: (e: FocusedRowChangingEvent<TKey, TRowData>) => void;

  @Event() onRowClick?: (e: RowClickEvent<TKey, TRowData>) => void;

  @Event() onRowDblClick?: (e: RowDblClickEvent<TKey, TRowData>) => void;

  @Event() onRowPrepared?: (e: RowPreparedEvent<TKey, TRowData>) => void;

  @Event() onAdaptiveDetailRowPreparing?:
  (e: AdaptiveDetailRowPreparingEvent<TKey, TRowData>) => void;

  @Event() onDataErrorOccurred?: (e: DataErrorOccurredEvent<TKey, TRowData>) => void;

  @Event() onInitNewRow?: (e: InitNewRowEvent<TKey, TRowData>) => void;

  @Event() onKeyDown?: (e: KeyDownEvent<TKey, TRowData>) => void;

  @Event() onRowCollapsed?: (e: RowCollapsedEvent<TKey, TRowData>) => void;

  @Event() onRowCollapsing?: (e: RowCollapsingEvent<TKey, TRowData>) => void;

  @Event() onRowExpanded?: (e: RowExpandedEvent<TKey, TRowData>) => void;

  @Event() onRowExpanding?: (e: RowExpandingEvent<TKey, TRowData>) => void;

  @Event() onRowInserted?: (e: RowInsertedEvent<TKey, TRowData>) => void;

  @Event() onRowInserting?: (e: RowInsertingEvent<TKey, TRowData>) => void;

  @Event() onRowRemoved?: (e: RowRemovedEvent<TKey, TRowData>) => void;

  @Event() onRowRemoving?: (e: RowRemovingEvent<TKey, TRowData>) => void;

  @Event() onRowUpdated?: (e: RowUpdatedEvent<TKey, TRowData>) => void;

  @Event() onRowUpdating?: (e: RowUpdatingEvent<TKey, TRowData>) => void;

  @Event() onRowValidating?: (e: RowValidatingEvent<TKey, TRowData>) => void;

  @Event() onSelectionChanged?: (e: SelectionChangedEvent<TKey, TRowData>) => void;

  @Event() onToolbarPreparing?: (e: ToolbarPreparingEvent<TKey, TRowData>) => void;

  @Event() onSaving?: (e: SavingEvent<TKey, TRowData>) => void;

  @Event() onSaved?: (e: SavedEvent<TKey, TRowData>) => void;

  // private
  @OneWay() adaptColumnWidthByRatio?: boolean = true;

  @OneWay() regenerateColumnsByVisibleItems?: boolean = false;

  @OneWay() useLegacyKeyboardNavigation?: boolean = false;
}

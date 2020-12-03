/* eslint-disable max-classes-per-file */
import {
  ComponentBindings,
  OneWay,
  Event,
  TwoWay,
  Nested,
  Template,
} from 'devextreme-generator/component_declaration/common';
import DxDataGrid from '../../../ui/data_grid';
import type { /* Options, */ dxDataGridColumn, dxDataGridRowObject } from '../../../ui/data_grid';
import { WidgetProps } from '../common/widget';

import type { dxFilterBuilderOptions } from '../../../ui/filter_builder';
import type { dxElement } from '../../../core/element';
import type { template } from '../../../core/templates/template';
import type { event } from '../../../events/index';
import DataSource from '../../../data/data_source';
import type { DataSourceOptions } from '../../../data/data_source';
import type { dxPopupOptions } from '../../../ui/popup';
import type { dxToolbarOptions } from '../../../ui/toolbar';
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
} from '../../../ui/validation_rules.d';
import type { format } from '../../../ui/widget/ui.widget';
import type dxSortable from '../../../ui/sortable';
import type dxDraggable from '../../../ui/draggable';
import type { dxFormSimpleItem, dxFormOptions } from '../../../ui/form';
import type Store from '../../../data/abstract_store';
import type { ExcelDataGridCell } from '../../../excel_exporter';
import type { ExcelFont } from '../../../exporter/excel/excel.doc_comments';

@ComponentBindings()
export class DataGridColumnButton {
  @OneWay()
  name?: 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;

  @Event()
  onClick?:
  | ((e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    event?: event;
    row?: dxDataGridRowObject;
    column?: dxDataGridColumn;
  }) => any)
  | string;

  @OneWay()
  template?:
  | template
  | ((
    cellElement: dxElement,
    cellInfo: {
      component?: DxDataGrid;
      data?: any;
      key?: any;
      columnIndex?: number;
      column?: dxDataGridColumn;
      rowIndex?: number;
      rowType?: string;
      row?: dxDataGridRowObject;
    },
  ) => string | Element | JQuery);

  @OneWay()
  visible?:
  | boolean
  | ((options: {
    component?: DxDataGrid;
    row?: dxDataGridRowObject;
    column?: dxDataGridColumn;
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
  alignment?: 'center' | 'left' | 'right' | undefined;

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
  ) => string | any[] | Function;

  @Event()
  calculateSortValue?: string | ((rowData: any) => any);

  @OneWay()
  caption?: string;

  @OneWay()
  cssClass?: string;

  @Event()
  customizeText?: (cellInfo: {
    value?: string | number | Date;
    valueText?: string;
    target?: string;
    groupInterval?: string | number;
  }) => string;

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
  ) => void | Promise<void> | JQueryPromise<void>;

  @OneWay()
  showEditorAlways?: boolean;

  @OneWay()
  showInColumnChooser?: boolean;

  @OneWay()
  sortIndex?: number;

  @OneWay()
  sortOrder?: 'asc' | 'desc' | undefined;

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
    cellElement: dxElement,
    cellInfo: {
      data?: any;
      component?: DxDataGrid;
      value?: any;
      oldValue?: any;
      displayValue?: any;
      text?: string;
      columnIndex?: number;
      rowIndex?: number;
      column?: dxDataGridColumn;
      row?: dxDataGridRowObject;
      rowType?: string;
      watch?: Function;
    },
  ) => any);

  @OneWay()
  columns?: (dxDataGridColumn | string)[];

  @OneWay()
  editCellTemplate?:
  | template
  | ((
    cellElement: dxElement,
    cellInfo: {
      setValue?: any;
      data?: any;
      component?: DxDataGrid;
      value?: any;
      displayValue?: any;
      text?: string;
      columnIndex?: number;
      rowIndex?: number;
      column?: dxDataGridColumn;
      row?: dxDataGridRowObject;
      rowType?: string;
      watch?: Function;
    },
  ) => any);

  @OneWay()
  groupCellTemplate?:
  | template
  | ((
    cellElement: dxElement,
    cellInfo: {
      data?: any;
      component?: DxDataGrid;
      value?: any;
      text?: string;
      displayValue?: any;
      columnIndex?: number;
      rowIndex?: number;
      column?: dxDataGridColumn;
      row?: dxDataGridRowObject;
      summaryItems?: any[];
      groupContinuesMessage?: string;
      groupContinuedMessage?: string;
    },
  ) => any);

  @OneWay()
  groupIndex?: number;

  @OneWay()
  headerCellTemplate?:
  | template
  | ((
    columnHeader: dxElement,
    headerInfo: {
      component?: DxDataGrid;
      columnIndex?: number;
      column?: dxDataGridColumn;
    },
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
  | ((options: { component?: DxDataGrid; row?: dxDataGridRowObject }) => boolean);

  @OneWay()
  allowUpdating?:
  | boolean
  | ((options: { component?: DxDataGrid; row?: dxDataGridRowObject }) => boolean);

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
  customizeText?: (itemInfo: { value?: string | number | Date; valueText?: string }) => string;

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
  customizeText?: (itemInfo: { value?: string | number | Date; valueText?: string }) => string;

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
  calculateCustomSummary?: (options: {
    component?: DxDataGrid;
    name?: string;
    summaryProcess?: string;
    value?: any;
    totalValue?: any;
    groupIndex?: number;
  }) => any;

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
  allowedPageSizes?: number[] | 'auto';

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
    detailElement: dxElement,
    detailInfo: {
      key?: any;
      data?: any;
      watch?: Function;
    },
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
  boundary?: string | Element | JQuery;

  @OneWay()
  container?: string | Element | JQuery;

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
    dragInfo: {
      itemData?: any;
      itemElement?: dxElement;
    },
    containerElement: dxElement,
  ) => string | Element | JQuery);

  @OneWay()
  dropFeedbackMode?: 'push' | 'indicate';

  @OneWay()
  filter?: string;

  @OneWay()
  group?: string;

  @OneWay()
  handle?: string;

  @Event()
  onAdd?: (e: {
    event?: event;
    itemData?: any;
    itemElement?: dxElement;
    fromIndex?: number;
    toIndex?: number;
    fromComponent?: dxSortable | dxDraggable;
    toComponent?: dxSortable | dxDraggable;
    fromData?: any;
    toData?: any;
    dropInsideItem?: boolean;
  }) => any;

  @Event()
  onDragChange?: (e: {
    event?: event;
    cancel?: boolean;
    itemData?: any;
    itemElement?: dxElement;
    fromIndex?: number;
    toIndex?: number;
    fromComponent?: dxSortable | dxDraggable;
    toComponent?: dxSortable | dxDraggable;
    fromData?: any;
    toData?: any;
    dropInsideItem?: boolean;
  }) => any;

  @Event()
  onDragEnd?: (e: {
    event?: event;
    cancel?: boolean;
    itemData?: any;
    itemElement?: dxElement;
    fromIndex?: number;
    toIndex?: number;
    fromComponent?: dxSortable | dxDraggable;
    toComponent?: dxSortable | dxDraggable;
    fromData?: any;
    toData?: any;
    dropInsideItem?: boolean;
  }) => any;

  @Event()
  onDragMove?: (e: {
    event?: event;
    cancel?: boolean;
    itemData?: any;
    itemElement?: dxElement;
    fromIndex?: number;
    toIndex?: number;
    fromComponent?: dxSortable | dxDraggable;
    toComponent?: dxSortable | dxDraggable;
    fromData?: any;
    toData?: any;
    dropInsideItem?: boolean;
  }) => any;

  @Event()
  onDragStart?: (e: {
    event?: event;
    cancel?: boolean;
    itemData?: any;
    itemElement?: dxElement;
    fromIndex?: number;
    fromData?: any;
  }) => any;

  @Event()
  onRemove?: (e: {
    event?: event;
    itemData?: any;
    itemElement?: dxElement;
    fromIndex?: number;
    toIndex?: number;
    fromComponent?: dxSortable | dxDraggable;
    toComponent?: dxSortable | dxDraggable;
    fromData?: any;
    toData?: any;
  }) => any;

  @Event()
  onReorder?: (e: {
    event?: event;
    itemData?: any;
    itemElement?: dxElement;
    fromIndex?: number;
    toIndex?: number;
    fromComponent?: dxSortable | dxDraggable;
    toComponent?: dxSortable | dxDraggable;
    fromData?: any;
    toData?: any;
    dropInsideItem?: boolean;
    promise?: Promise<void> | JQueryPromise<void>;
  }) => any;

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
  customLoad?: () => Promise<any> | JQueryPromise<any>;

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
  customizeText?: (e: { component?: DxDataGrid; filterValue?: any; text?: string }) => string;

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

  @Event() customizeExcelCell?: ((options: {
    component?: DxDataGrid;
    horizontalAlignment?: 'center' | 'centerContinuous' | 'distributed' | 'fill' |
    'general' | 'justify' | 'left' | 'right'; verticalAlignment?: 'bottom' |
    'center' | 'distributed' | 'justify' | 'top';
    wrapTextEnabled?: boolean;
    backgroundColor?: string;
    fillPatternType?: 'darkDown' | 'darkGray' | 'darkGrid' | 'darkHorizontal' |
    'darkTrellis' | 'darkUp' | 'darkVertical' | 'gray0625' | 'gray125' |
    'lightDown' | 'lightGray' | 'lightGrid' | 'lightHorizontal' | 'lightTrellis' |
    'lightUp' | 'lightVertical' | 'mediumGray' | 'none' | 'solid';
    fillPatternColor?: string;
    font?: ExcelFont; value?: string | number | Date;
    numberFormat?: string; gridCell?: ExcelDataGridCell;
  }) => any);

  @OneWay() enabled?: boolean;

  @OneWay() excelFilterEnabled?: boolean;

  @OneWay() excelWrapTextEnabled?: boolean;

  @OneWay() fileName?: string;

  @OneWay() ignoreExcelErrors?: boolean;

  @OneWay() proxyUrl?: string;

  @OneWay() texts?: { exportAll?: string; exportSelectedRows?: string; exportTo?: string };
}

@ComponentBindings()
export class DataGridProps extends WidgetProps /* implements Options */ {
  @Nested() columns?: (DataGridColumn | string)[];

  @Nested() editing?: DataGridEditing;

  @OneWay() export?: DataGridExport;

  @Nested() groupPanel?: DataGridGroupPanel;

  @Nested() grouping?: DataGridGrouping;

  @Nested() masterDetail?: DataGridMasterDetail;

  @Nested() scrolling?: DataGridScrolling;

  @Nested() selection?: DataGridSelection;

  @Nested() sortByGroupSummaryInfo?: DataGridSortByGroupSummaryInfoItem[];

  @Nested() summary?: DataGridSummary;

  @Nested() columnChooser?: DataGridColumnChooser;

  @Nested() columnFixing?: DataGridColumnFixing;

  @Nested() filterPanel?: DataGridFilterPanel;

  @Nested() filterRow?: DataGridFilterRow;

  @Nested() headerFilter?: DataGridHeaderFilter;

  @Nested() keyboardNavigation?: DataGridKeyboardNavigation;

  @Nested() loadPanel?: DataGridLoadPanel;

  @Nested() pager?: DataGridPager;

  @Nested() paging?: DataGridPaging;

  @Nested() rowDragging?: DataGridRowDragging;

  @Nested() searchPanel?: DataGridSearchPanel;

  @Nested() sorting?: DataGridSorting;

  @Nested() stateStoring?: DataGridStateStoring;

  @Template() rowTemplate?: template | ((rowElement: dxElement, rowInfo: any) => any);

  @OneWay() customizeColumns?: (columns: dxDataGridColumn[]) => any;

  @OneWay() customizeExportData?: (
    columns: dxDataGridColumn[],
    rows: dxDataGridRowObject[],
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

  @OneWay() filterSyncEnabled?: boolean | 'auto';

  @OneWay() focusedRowEnabled?: boolean;

  @OneWay() highlightChanges?: boolean;

  @OneWay() noDataText?: string;

  @OneWay() renderAsync?: boolean;

  @OneWay() repaintChangesOnly?: boolean;

  @OneWay() rowAlternationEnabled?: boolean;

  @OneWay() showBorders?: boolean;

  @OneWay() showColumnHeaders?: boolean = true;

  @OneWay() showColumnLines?: boolean;

  @OneWay() showRowLines?: boolean;

  @OneWay() twoWayBindingEnabled?: boolean;

  @OneWay() wordWrapEnabled?: boolean;

  @TwoWay() filterValue: string | any[] | Function | null = null;

  @TwoWay() focusedColumnIndex = -1;

  @TwoWay() focusedRowIndex = -1;

  @TwoWay() focusedRowKey: any | null = null;

  @TwoWay() selectedRowKeys: any[] = [];

  @TwoWay() selectionFilter: string | any[] | Function = [];

  @Event() onCellClick?:
  | string
  | ((e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    jQueryEvent?: JQueryEventObject;
    event?: event;
    data?: any;
    key?: any;
    value?: any;
    displayValue?: any;
    text?: string;
    columnIndex?: number;
    column?: any;
    rowIndex?: number;
    rowType?: string;
    cellElement?: dxElement;
    row?: dxDataGridRowObject;
  }) => any);

  @Event() onCellDblClick?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    event?: event;
    data?: any;
    key?: any;
    value?: any;
    displayValue?: any;
    text?: string;
    columnIndex?: number;
    column?: dxDataGridColumn;
    rowIndex?: number;
    rowType?: string;
    cellElement?: dxElement;
    row?: dxDataGridRowObject;
  }) => any;

  @Event() onCellHoverChanged?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    eventType?: string;
    data?: any;
    key?: any;
    value?: any;
    text?: string;
    displayValue?: any;
    columnIndex?: number;
    rowIndex?: number;
    column?: dxDataGridColumn;
    rowType?: string;
    cellElement?: dxElement;
    row?: dxDataGridRowObject;
  }) => any;

  @Event() onCellPrepared?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    data?: any;
    key?: any;
    value?: any;
    displayValue?: any;
    text?: string;
    columnIndex?: number;
    column?: dxDataGridColumn;
    rowIndex?: number;
    rowType?: string;
    row?: dxDataGridRowObject;
    isSelected?: boolean;
    isExpanded?: boolean;
    isNewRow?: boolean;
    cellElement?: dxElement;
    watch?: Function;
    oldValue?: any;
  }) => any;

  @Event() onContextMenuPreparing?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    items?: any[];
    target?: string;
    targetElement?: dxElement;
    columnIndex?: number;
    column?: dxDataGridColumn;
    rowIndex?: number;
    row?: dxDataGridRowObject;
  }) => any;

  @Event() onEditingStart?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    data?: any;
    key?: any;
    cancel?: boolean;
    column?: any;
  }) => any;

  @Event() onEditorPrepared?: (options: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    parentType?: string;
    value?: any;
    setValue?: any;
    updateValueTimeout?: number;
    width?: number;
    disabled?: boolean;
    rtlEnabled?: boolean;
    editorElement?: dxElement;
    readOnly?: boolean;
    dataField?: string;
    row?: dxDataGridRowObject;
  }) => any;

  @Event() onEditorPreparing?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    parentType?: string;
    value?: any;
    setValue?: any;
    updateValueTimeout?: number;
    width?: number;
    disabled?: boolean;
    rtlEnabled?: boolean;
    cancel?: boolean;
    editorElement?: dxElement;
    readOnly?: boolean;
    editorName?: string;
    editorOptions?: any;
    dataField?: string;
    row?: dxDataGridRowObject;
  }) => any;

  @Event() onExported?: (e: { component?: DxDataGrid; element?: dxElement; model?: any }) => any;

  @Event() onExporting?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    fileName?: string;
    cancel?: boolean;
  }) => any;

  @Event() onFileSaving?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    fileName?: string;
    format?: string;
    data?: Blob;
    cancel?: boolean;
  }) => any;

  @Event() onFocusedCellChanged?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    cellElement?: dxElement;
    columnIndex?: number;
    rowIndex?: number;
    row?: dxDataGridRowObject;
    column?: dxDataGridColumn;
  }) => any;

  @Event() onFocusedCellChanging?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    cellElement?: dxElement;
    prevColumnIndex?: number;
    prevRowIndex?: number;
    newColumnIndex?: number;
    newRowIndex?: number;
    event?: event;
    rows?: dxDataGridRowObject[];
    columns?: dxDataGridColumn[];
    cancel?: boolean;
    isHighlighted?: boolean;
  }) => any;

  @Event() onFocusedRowChanged?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    rowElement?: dxElement;
    rowIndex?: number;
    row?: dxDataGridRowObject;
  }) => any;

  @Event() onFocusedRowChanging?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    rowElement?: dxElement;
    prevRowIndex?: number;
    newRowIndex?: number;
    event?: event;
    rows?: dxDataGridRowObject[];
    cancel?: boolean;
  }) => any;

  @Event() onRowClick?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    jQueryEvent?: JQueryEventObject;
    event?: event;
    data?: any;
    key?: any;
    values?: any[];
    columns?: any[];
    rowIndex?: number;
    rowType?: string;
    isSelected?: boolean;
    isExpanded?: boolean;
    isNewRow?: boolean;
    groupIndex?: number;
    rowElement?: dxElement;
    handled?: boolean;
  }) => any;

  @Event() onRowDblClick?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    event?: event;
    data?: any;
    key?: any;
    values?: any[];
    columns?: dxDataGridColumn[];
    rowIndex?: number;
    rowType?: string;
    isSelected?: boolean;
    isExpanded?: boolean;
    isNewRow?: boolean;
    groupIndex?: number;
    rowElement?: dxElement;
  }) => any;

  @Event() onRowPrepared?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    data?: any;
    key?: any;
    values?: any[];
    columns?: dxDataGridColumn[];
    rowIndex?: number;
    rowType?: string;
    groupIndex?: number;
    isSelected?: boolean;
    isExpanded?: boolean;
    isNewRow?: boolean;
    rowElement?: dxElement;
  }) => any;

  @Event() onAdaptiveDetailRowPreparing?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    formOptions?: any;
  }) => any;

  @Event() onDataErrorOccurred?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    error?: Error;
  }) => any;

  @Event() onInitNewRow?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    data?: any;
    promise?: Promise<void> | JQueryPromise<void>;
  }) => any;

  @Event() onKeyDown?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    jQueryEvent?: JQueryEventObject;
    event?: event;
    handled?: boolean;
  }) => any;

  @Event() onRowCollapsed?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    key?: any;
  }) => any;

  @Event() onRowCollapsing?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    key?: any;
    cancel?: boolean;
  }) => any;

  @Event() onRowExpanded?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    key?: any;
  }) => any;

  @Event() onRowExpanding?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    key?: any;
    cancel?: boolean;
  }) => any;

  @Event() onRowInserted?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    data?: any;
    key?: any;
    error?: Error;
  }) => any;

  @Event() onRowInserting?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    data?: any;
    cancel?: boolean | Promise<void> | JQueryPromise<void>;
  }) => any;

  @Event() onRowRemoved?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    data?: any;
    key?: any;
    error?: Error;
  }) => any;

  @Event() onRowRemoving?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    data?: any;
    key?: any;
    cancel?: boolean | Promise<void> | JQueryPromise<void>;
  }) => any;

  @Event() onRowUpdated?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    data?: any;
    key?: any;
    error?: Error;
  }) => any;

  @Event() onRowUpdating?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    oldData?: any;
    newData?: any;
    key?: any;
    cancel?: boolean | Promise<void> | JQueryPromise<void>;
  }) => any;

  @Event() onRowValidating?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    brokenRules?: (| RequiredRule
    | NumericRule
    | RangeRule
    | StringLengthRule
    | CustomRule
    | CompareRule
    | PatternRule
    | EmailRule
    | AsyncRule)[];
    isValid?: boolean;
    key?: any;
    newData?: any;
    oldData?: any;
    errorText?: string;
    promise?: Promise<void> | JQueryPromise<void>;
  }) => any;

  @Event() onSelectionChanged?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    currentSelectedRowKeys?: any[];
    currentDeselectedRowKeys?: any[];
    selectedRowKeys?: any[];
    selectedRowsData?: any[];
  }) => any;

  @Event() onToolbarPreparing?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    toolbarOptions?: dxToolbarOptions;
  }) => any;
}

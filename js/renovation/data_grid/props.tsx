import {
  ComponentBindings,
  OneWay,
  Event,
  TwoWay,
  Nested,
  Template,
} from 'devextreme-generator/component_declaration/common';
import DxDataGrid from '../../ui/data_grid';
import type { /* Options, */ dxDataGridColumn, dxDataGridRowObject } from '../../ui/data_grid';
import { WidgetProps } from '../common/widget';

import type { dxFilterBuilderOptions } from '../../ui/filter_builder';
import type { dxElement } from '../../core/element';
import type { template } from '../../core/templates/template';
import type { event } from '../../events/index';
import DataSource from '../../data/data_source';
import type { DataSourceOptions } from '../../data/data_source';
import type { dxPopupOptions } from '../../ui/popup';
import type { dxToolbarOptions } from '../../ui/toolbar';
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
} from '../../ui/validation_engine';
// import { ExcelFont } from '../../exporter/excel/excel.doc_comments';
// import { ExcelDataGridCell } from '../../excel_exporter';
import type { format } from '../../ui/widget/ui.widget';
import type dxSortable from '../../ui/sortable';
import type dxDraggable from '../../ui/draggable';
import type { dxFormSimpleItem, dxFormOptions } from '../../ui/form';
import type Store from '../../data/abstract_store';

export declare type DataGridColumnButton = {
  name?: 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
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
  visible?:
  | boolean
  | ((options: {
    component?: DxDataGrid;
    row?: dxDataGridRowObject;
    column?: dxDataGridColumn;
  }) => boolean);
};

export declare type DataGridColumnHeaderFilter = {
  allowSearch?: boolean;
  dataSource?:
  | Array<any>
  | ((options: { component?: any; dataSource?: DataSourceOptions }) => any)
  | DataSourceOptions;
  groupInterval?: 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year' | number;
  height?: number;
  searchMode?: 'contains' | 'startswith' | 'equals';
  width?: number;
};

export declare type DataGridColumnLookup = {
  allowClearing?: boolean;
  dataSource?:
  | Array<any>
  | DataSourceOptions
  | Store
  | ((options: { data?: any; key?: any }) => Array<any> | DataSourceOptions | Store);
  displayExpr?: string | ((data: any) => string);
  valueExpr?: string;
};

export declare type DataGridColumn = {
  alignment?: 'center' | 'left' | 'right' | undefined;
  allowEditing?: boolean;
  allowFiltering?: boolean;
  allowFixing?: boolean;
  allowHeaderFiltering?: boolean;
  allowHiding?: boolean;
  allowReordering?: boolean;
  allowResizing?: boolean;
  allowSearch?: boolean;
  allowSorting?: boolean;
  calculateCellValue?: (rowData: any) => any;
  calculateDisplayValue?: string | ((rowData: any) => any);
  calculateFilterExpression?: (
    filterValue: any,
    selectedFilterOperation: string,
    target: string,
  ) => string | Array<any> | Function;
  calculateSortValue?: string | ((rowData: any) => any);
  caption?: string;
  cssClass?: string;
  customizeText?: (cellInfo: {
    value?: string | number | Date;
    valueText?: string;
    target?: string;
    groupInterval?: string | number;
  }) => string;
  dataField?: string;
  dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
  editorOptions?: any;
  encodeHtml?: boolean;
  falseText?: string;
  filterOperations?: Array<
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
  | 'noneof'
  >;
  filterType?: 'exclude' | 'include';
  filterValue?: any;
  filterValues?: Array<any>;
  fixed?: boolean;
  fixedPosition?: 'left' | 'right';
  formItem?: dxFormSimpleItem;
  format?: format;
  headerFilter?: DataGridColumnHeaderFilter;
  hidingPriority?: number;
  isBand?: boolean;
  lookup?: DataGridColumnLookup;
  minWidth?: number;
  name?: string;
  ownerBand?: number;
  renderAsync?: boolean;
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
  setCellValue?: (
    newData: any,
    value: any,
    currentRowData: any,
  ) => void | Promise<void> | JQueryPromise<void>;
  showEditorAlways?: boolean;
  showInColumnChooser?: boolean;
  sortIndex?: number;
  sortOrder?: 'asc' | 'desc' | undefined;
  sortingMethod?: (value1: any, value2: any) => number;
  trueText?: string;
  validationRules?: Array<
  | RequiredRule
  | NumericRule
  | RangeRule
  | StringLengthRule
  | CustomRule
  | CompareRule
  | PatternRule
  | EmailRule
  | AsyncRule
  >;
  visible?: boolean;
  visibleIndex?: number;
  width?: number | string;

  allowExporting?: boolean;
  allowGrouping?: boolean;
  autoExpandGroup?: boolean;
  buttons?: Array<'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | DataGridColumnButton>;
  calculateGroupValue?: string | ((rowData: any) => any);
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
  columns?: Array<dxDataGridColumn | string>;
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
      summaryItems?: Array<any>;
      groupContinuesMessage?: string;
      groupContinuedMessage?: string;
    },
  ) => any);
  groupIndex?: number;
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
  showWhenGrouped?: boolean;
  type?: 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection';
};

export declare type DataGridEditingTexts = {
  addRow?: string;
  cancelAllChanges?: string;
  cancelRowChanges?: string;
  confirmDeleteMessage?: string;
  confirmDeleteTitle?: string;
  deleteRow?: string;
  editRow?: string;
  saveAllChanges?: string;
  undeleteRow?: string;
  validationCancelChanges?: string;
};

export declare type DataGridEditing = {
  allowAdding?: boolean;
  allowDeleting?:
  | boolean
  | ((options: { component?: DxDataGrid; row?: dxDataGridRowObject }) => boolean);
  allowUpdating?:
  | boolean
  | ((options: { component?: DxDataGrid; row?: dxDataGridRowObject }) => boolean);
  confirmDelete?: boolean;
  form?: dxFormOptions;
  mode?: 'batch' | 'cell' | 'row' | 'form' | 'popup';
  popup?: dxPopupOptions;
  refreshMode?: 'full' | 'reshape' | 'repaint';
  selectTextOnEditStart?: boolean;
  startEditAction?: 'click' | 'dblClick';
  texts?: DataGridEditingTexts;
  useIcons?: boolean;
};

export declare type DataGridScrolling = {
  mode?: 'infinite' | 'standard' | 'virtual';
  columnRenderingMode?: 'standard' | 'virtual';
  preloadEnabled?: boolean;
  rowRenderingMode?: 'standard' | 'virtual';
  scrollByContent?: boolean;
  scrollByThumb?: boolean;
  showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
  useNative?: boolean | 'auto';
};

export declare type DataGridSelection = {
  allowSelectAll?: boolean;
  mode?: 'multiple' | 'none' | 'single';
  deferred?: boolean;
  selectAllMode?: 'allPages' | 'page';
  showCheckBoxesMode?: 'always' | 'none' | 'onClick' | 'onLongTap';
};

export declare type DataGridPaging = {
  enabled?: boolean;
  pageIndex?: number;
  pageSize?: number;
};

export declare type DataGridSortByGroupSummaryInfoItem = {
  groupColumn?: string;
  sortOrder?: 'asc' | 'desc';
  summaryItem?: string | number;
};

export declare type DataGridGroupPanel = {
  allowColumnDragging?: boolean;
  emptyPanelText?: string;
  visible?: boolean | 'auto';
};

export declare type DataGridGrouping = {
  allowCollapsing?: boolean;
  autoExpandAll?: boolean;
  contextMenuEnabled?: boolean;
  expandMode?: 'buttonClick' | 'rowClick';
  texts?: {
    groupByThisColumn?: string;
    groupContinuedMessage?: string;
    groupContinuesMessage?: string;
    ungroup?: string;
    ungroupAll?: string;
  };
};

export declare type DataGridSummaryGroupItem = {
  alignByColumn?: boolean;
  column?: string;
  customizeText?: (itemInfo: { value?: string | number | Date; valueText?: string }) => string;
  displayFormat?: string;
  name?: string;
  showInColumn?: string;
  showInGroupFooter?: boolean;
  skipEmptyValues?: boolean;
  summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string;
  valueFormat?: format;
};

export declare type DataGridSummaryTotalItem = {
  alignment?: 'center' | 'left' | 'right';
  column?: string;
  cssClass?: string;
  customizeText?: (itemInfo: { value?: string | number | Date; valueText?: string }) => string;
  displayFormat?: string;
  name?: string;
  showInColumn?: string;
  skipEmptyValues?: boolean;
  summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string;
  valueFormat?: format;
};

export declare type DataGridSummary = {
  calculateCustomSummary?: (options: {
    component?: DxDataGrid;
    name?: string;
    summaryProcess?: string;
    value?: any;
    totalValue?: any;
    groupIndex?: number;
  }) => any;
  groupItems?: Array<DataGridSummaryGroupItem>;
  recalculateWhileEditing?: boolean;
  skipEmptyValues?: boolean;
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
  totalItems?: Array<DataGridSummaryTotalItem>;
};

export declare type DataGridPager = {
  allowedPageSizes?: Array<number> | 'auto';
  infoText?: string;
  showInfo?: boolean;
  showNavigationButtons?: boolean;
  showPageSizeSelector?: boolean;
  visible?: boolean | 'auto';
};

export declare type DataGridMasterDetail = {
  autoExpandAll?: boolean;
  enabled?: boolean;
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
};

export declare type DataGridRowDragging = {
  allowDropInsideItem?: boolean;
  allowReordering?: boolean;
  autoScroll?: boolean;
  boundary?: string | Element | JQuery;
  container?: string | Element | JQuery;
  cursorOffset?: string | { x?: number; y?: number };
  data?: any;
  dragDirection?: 'both' | 'horizontal' | 'vertical';
  dragTemplate?:
  | template
  | ((
    dragInfo: {
      itemData?: any;
      itemElement?: dxElement;
    },
    containerElement: dxElement,
  ) => string | Element | JQuery);
  dropFeedbackMode?: 'push' | 'indicate';
  filter?: string;
  group?: string;
  handle?: string;
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
  onDragStart?: (e: {
    event?: event;
    cancel?: boolean;
    itemData?: any;
    itemElement?: dxElement;
    fromIndex?: number;
    fromData?: any;
  }) => any;
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
  scrollSensitivity?: number;
  scrollSpeed?: number;
  showDragIcons?: boolean;
};

export declare type DataGridColumnChooser = {
  allowSearch?: boolean;
  emptyPanelText?: string;
  enabled?: boolean;
  height?: number;
  mode?: 'dragAndDrop' | 'select';
  searchTimeout?: number;
  title?: string;
  width?: number;
};

export declare type DataGridColumnFixing = {
  enabled?: boolean;
  texts?: {
    fix?: string;
    leftPosition?: string;
    rightPosition?: string;
    unfix?: string;
  };
};

export declare type DataGridSearchPanel = {
  highlightCaseSensitive?: boolean;
  highlightSearchText?: boolean;
  placeholder?: string;
  searchVisibleColumnsOnly?: boolean;
  text?: string;
  visible?: boolean;
  width?: number;
};

export declare type DataGridSorting = {
  ascendingText?: string;
  clearText?: string;
  descendingText?: string;
  mode?: 'multiple' | 'none' | 'single';
  showSortIndexes?: boolean;
};

export declare type DataGridStateStoring = {
  customLoad?: () => Promise<any> | JQueryPromise<any>;
  customSave?: (gridState: any) => any;
  enabled?: boolean;
  savingTimeout?: number;
  storageKey?: string;
  type?: 'custom' | 'localStorage' | 'sessionStorage';
};

export declare type DataGridFilterPanel = {
  customizeText?: (e: { component?: DxDataGrid; filterValue?: any; text?: string }) => string;
  filterEnabled?: boolean;
  texts?: { clearFilter?: string; createFilter?: string; filterEnabledHint?: string };
  visible?: boolean;
};

export declare type DataGridFilterRow = {
  applyFilter?: 'auto' | 'onClick';
  applyFilterText?: string;
  betweenEndText?: string;
  betweenStartText?: string;
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
  resetOperationText?: string;
  showAllText?: string;
  showOperationChooser?: boolean;
  visible?: boolean;
};

export declare type DataGridHeaderFilter = {
  allowSearch?: boolean;
  height?: number;
  searchTimeout?: number;
  texts?: { cancel?: string; emptyValue?: string; ok?: string };
  visible?: boolean;
  width?: number;
};

export declare type DataGridKeyboardNavigation = {
  editOnKeyPress?: boolean;
  enabled?: boolean;
  enterKeyAction?: 'startEdit' | 'moveFocus';
  enterKeyDirection?: 'none' | 'column' | 'row';
};

export declare type DataGridLoadPanel = {
  enabled?: boolean | 'auto';
  height?: number;
  indicatorSrc?: string;
  shading?: boolean;
  shadingColor?: string;
  showIndicator?: boolean;
  showPane?: boolean;
  text?: string;
  width?: number;
};

/*
export declare type DataGridExport = {
  allowExportSelectedData?: boolean;
  customizeExcelCell?: ((options: {
    component?: DxDataGrid,
    horizontalAlignment?: 'center' | 'centerContinuous' | 'distributed' | 'fill' |
      'general' | 'justify' | 'left' | 'right', verticalAlignment?: 'bottom' |
      'center' | 'distributed' | 'justify' | 'top',
    wrapTextEnabled?: boolean,
    backgroundColor?: string,
    fillPatternType?: 'darkDown' | 'darkGray' | 'darkGrid' | 'darkHorizontal' |
      'darkTrellis' | 'darkUp' | 'darkVertical' | 'gray0625' | 'gray125' |
      'lightDown' | 'lightGray' | 'lightGrid' | 'lightHorizontal' | 'lightTrellis' |
      'lightUp' | 'lightVertical' | 'mediumGray' | 'none' | 'solid',
    fillPatternColor?: string,
    font?: ExcelFont, value?: string | number | Date,
    numberFormat?: string, gridCell?: ExcelDataGridCell
  }) => any);
  enabled?: boolean;
  excelFilterEnabled?: boolean;
  excelWrapTextEnabled?: boolean;
  fileName?: string;
  ignoreExcelErrors?: boolean;
  proxyUrl?: string;
  texts?: { exportAll?: string, exportSelectedRows?: string, exportTo?: string };
}
*/

@ComponentBindings()
export class DataGridProps extends WidgetProps /* implements Options */ {
  @Nested() columns?: Array<DataGridColumn | string>;

  @Nested() editing?: DataGridEditing;

  // @OneWay() export?: DataGridExport;
  @Nested() groupPanel?: DataGridGroupPanel;

  @Nested() grouping?: DataGridGrouping;

  @Nested() masterDetail?: DataGridMasterDetail;

  @Nested() scrolling?: DataGridScrolling;

  @Nested() selection?: DataGridSelection;

  @Nested() sortByGroupSummaryInfo?: Array<DataGridSortByGroupSummaryInfoItem>;

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

  @OneWay() customizeColumns?: (columns: Array<dxDataGridColumn>) => any;

  @OneWay() customizeExportData?: (
    columns: Array<dxDataGridColumn>,
    rows: Array<dxDataGridRowObject>,
  ) => any;

  @OneWay() keyExpr?: string | Array<string>;

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

  @OneWay() dataSource?: string | Array<any> | DataSource | DataSourceOptions;

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

  @TwoWay() filterValue?: string | Array<any> | Function;

  @TwoWay() focusedColumnIndex?: number;

  @TwoWay() focusedRowIndex?: number;

  @TwoWay() focusedRowKey?: any;

  @TwoWay() selectedRowKeys?: Array<any>;

  @TwoWay() selectionFilter?: string | Array<any> | Function;

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
    items?: Array<any>;
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
    rows?: Array<dxDataGridRowObject>;
    columns?: Array<dxDataGridColumn>;
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
    rows?: Array<dxDataGridRowObject>;
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
    values?: Array<any>;
    columns?: Array<any>;
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
    values?: Array<any>;
    columns?: Array<dxDataGridColumn>;
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
    values?: Array<any>;
    columns?: Array<dxDataGridColumn>;
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
    brokenRules?: Array<
    | RequiredRule
    | NumericRule
    | RangeRule
    | StringLengthRule
    | CustomRule
    | CompareRule
    | PatternRule
    | EmailRule
    | AsyncRule
    >;
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
    currentSelectedRowKeys?: Array<any>;
    currentDeselectedRowKeys?: Array<any>;
    selectedRowKeys?: Array<any>;
    selectedRowsData?: Array<any>;
  }) => any;

  @Event() onToolbarPreparing?: (e: {
    component?: DxDataGrid;
    element?: dxElement;
    model?: any;
    toolbarOptions?: dxToolbarOptions;
  }) => any;
}

import {
  DataType,
  DisplayMode,
  DragDirection,
  Draggable,
  DragHighlight,
  HorizontalAlignment,
  Mode,
  Scrollable,
  ScrollbarMode,
  SearchMode,
  SingleMultipleOrNone,
  Sortable,
  SortOrder,
  ValidationRule,
  template,
} from '../common';

import {
  DeepPartial,
} from '../core/index';

import {
  UserDefinedElement,
  DxElement,
  UserDefinedElementsArray,
} from '../core/element';

import {
  DataSource,
  DataSourceOptions,
} from './data';

import { DataSourceLike } from '../data/data_source';

import {
  Cancelable,
  EventInfo,
  NativeEventInfo,
} from './core/events';

import {
  DxPromise,
} from '../core/utils/deferred';

import {
  Format,
} from './core/localization';

import {
  FilterLookupDataSource,
  Properties as FilterBuilderProperties,
} from '../ui/filter_builder';

import {
  Properties as FormProperties,
  SimpleItem,
} from '../ui/form';

import {
  Properties as PopupProperties,
} from '../ui/popup';

import {
  Properties as ToolbarProperties,
} from '../ui/toolbar';

import {
  WidgetOptions,
} from '../ui/widget/ui.widget';
import { PositionConfig } from './core/animation';
import { PagerBase } from '../ui/pagination';

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export type AdaptiveDetailRowPreparingInfo = {
  /**
   * @docid
   * @type object
   */
  readonly formOptions: any;
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type ApplyFilterMode = 'auto' | 'onClick';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type ApplyChangesMode = 'instantly' | 'onDemand';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type FixedPosition = 'left' | 'right' | 'sticky';

/**
 * @hidden
 * @docid GridBaseColumn
 * @namespace DevExpress.common.grids
 * @type object
 */
export interface ColumnBase<TRowData = any> {
  /**
   * @docid GridBaseColumn.alignment
   * @default undefined
   * @acceptValues undefined
   * @public
   */
  alignment?: HorizontalAlignment | undefined;
  /**
   * @docid GridBaseColumn.allowEditing
   * @default true
   * @public
   */
  allowEditing?: boolean;
  /**
   * @docid GridBaseColumn.allowFiltering
   * @default true
   * @public
   */
  allowFiltering?: boolean;
  /**
   * @docid GridBaseColumn.allowFixing
   * @default true
   * @public
   */
  allowFixing?: boolean;
  /**
   * @docid GridBaseColumn.allowHeaderFiltering
   * @default true
   * @public
   */
  allowHeaderFiltering?: boolean;
  /**
   * @docid GridBaseColumn.allowHiding
   * @default false &for(command column)
   * @default true
   * @public
   */
  allowHiding?: boolean;
  /**
   * @docid GridBaseColumn.allowReordering
   * @default true
   * @public
   */
  allowReordering?: boolean;
  /**
   * @docid GridBaseColumn.allowResizing
   * @default true
   * @public
   */
  allowResizing?: boolean;
  /**
   * @docid GridBaseColumn.allowSearch
   * @default true
   * @public
   */
  allowSearch?: boolean;
  /**
   * @docid GridBaseColumn.allowSorting
   * @default true
   * @public
   */
  allowSorting?: boolean;
  /**
   * @docid GridBaseColumn.calculateCellValue
   * @type_function_context GridBaseColumn
   * @type_function_param1 rowData:object
   * @public
   */
  calculateCellValue?: ((this: ColumnBase, rowData: TRowData) => any);
  /**
   * @public
   */
  defaultCalculateCellValue?: this['calculateCellValue'];
  /**
   * @docid GridBaseColumn.calculateDisplayValue
   * @type_function_context GridBaseColumn
   * @type_function_param1 rowData:object
   * @public
   */
  calculateDisplayValue?: string | ((this: ColumnBase, rowData: TRowData) => any);
  /**
   * @docid GridBaseColumn.calculateFilterExpression
   * @type_function_context GridBaseColumn
   * @type_function_return Filter expression
   * @public
   */
  calculateFilterExpression?: ((this: ColumnBase, filterValue: any, selectedFilterOperation: string | null, target: string) => string | Array<any> | Function);
  /**
   * @public
   */
  defaultCalculateFilterExpression?: this['calculateFilterExpression'];
  /**
   * @docid GridBaseColumn.calculateSortValue
   * @type_function_context GridBaseColumn
   * @type_function_param1 rowData:object
   * @public
   */
  calculateSortValue?: string | ((this: ColumnBase, rowData: TRowData) => any);
  /**
   * @docid GridBaseColumn.caption
   * @default undefined
   * @public
   */
  caption?: string | undefined;
  /**
   * @docid GridBaseColumn.cssClass
   * @default undefined
   * @public
   */
  cssClass?: string | undefined;
  /**
   * @docid GridBaseColumn.customizeText
   * @type_function_context GridBaseColumn
   * @type_function_param1 cellInfo:object
   * @public
   */
  customizeText?: ((this: ColumnBase, cellInfo: ColumnCustomizeTextArg) => string);
  /**
   * @docid GridBaseColumn.dataField
   * @default undefined
   * @public
   */
  dataField?: string | undefined;
  /**
   * @docid GridBaseColumn.dataType
   * @default undefined
   * @public
   */
  dataType?: DataType | undefined;
  /**
   * @docid GridBaseColumn.editorOptions
   * @public
   */
  editorOptions?: any;
  /**
   * @docid GridBaseColumn.encodeHtml
   * @default true
   * @public
   */
  encodeHtml?: boolean;
  /**
   * @docid GridBaseColumn.falseText
   * @default "false"
   * @public
   */
  falseText?: string;
  /**
   * @docid GridBaseColumn.filterOperations
   * @default undefined
   * @public
   */
  filterOperations?: Array<FilterOperation | string>;
  /**
   * @docid GridBaseColumn.filterType
   * @default "include"
   * @public
   */
  filterType?: FilterType;
  /**
   * @docid GridBaseColumn.filterValue
   * @default undefined
   * @fires GridBaseOptions.onOptionChanged
   * @public
   */
  filterValue?: any | undefined;
  /**
   * @docid GridBaseColumn.filterValues
   * @default undefined
   * @fires GridBaseOptions.onOptionChanged
   * @public
   */
  filterValues?: Array<any>;
  /**
   * @docid GridBaseColumn.fixed
   * @default false
   * @public
   */
  fixed?: boolean;
  /**
   * @docid GridBaseColumn.fixedPosition
   * @default undefined
   * @public
   */
  fixedPosition?: FixedPosition | undefined;
  /**
   * @docid GridBaseColumn.formItem
   * @type dxFormSimpleItem
   * @public
   */
  formItem?: SimpleItem;
  /**
   * @docid GridBaseColumn.format
   * @default ""
   * @public
   */
  format?: Format;
  /**
   * @docid GridBaseColumn.headerFilter
   * @type object
   * @default undefined
   * @public
   */
  headerFilter?: ColumnHeaderFilter | undefined;
  /**
   * @docid GridBaseColumn.hidingPriority
   * @default undefined
   * @public
   */
  hidingPriority?: number | undefined;
  /**
   * @docid GridBaseColumn.isBand
   * @default undefined
   * @public
   */
  isBand?: boolean | undefined;
  /**
   * @docid GridBaseColumn.lookup
   * @type object
   * @default undefined
   * @public
   */
  lookup?: ColumnLookup | undefined;
  /**
   * @docid GridBaseColumn.minWidth
   * @default undefined
   * @public
   */
  minWidth?: number | undefined;
  /**
   * @docid GridBaseColumn.name
   * @default undefined
   * @public
   */
  name?: string | undefined;
  /**
   * @docid GridBaseColumn.ownerBand
   * @default undefined
   * @public
   */
  ownerBand?: number | undefined;
  /**
   * @docid GridBaseColumn.renderAsync
   * @default false
   * @public
   */
  renderAsync?: boolean;
  /**
   * @docid GridBaseColumn.selectedFilterOperation
   * @default undefined
   * @fires GridBaseOptions.onOptionChanged
   * @public
   */
  selectedFilterOperation?: SelectedFilterOperation | undefined;
  /**
   * @docid GridBaseColumn.setCellValue
   * @type_function_context GridBaseColumn
   * @type_function_param1 newData:object
   * @type_function_param3 currentRowData:object
   * @type_function_return void|Promise<void>
   * @public
   */
  setCellValue?: ((this: ColumnBase, newData: DeepPartial<TRowData>, value: any, currentRowData: TRowData) => void | PromiseLike<void>);
  /**
   * @public
   */
  defaultSetCellValue?: this['setCellValue'];
  /**
   * @docid GridBaseColumn.showEditorAlways
   * @default false
   * @public
   */
  showEditorAlways?: boolean;
  /**
   * @docid GridBaseColumn.showInColumnChooser
   * @default true
   * @public
   */
  showInColumnChooser?: boolean;
  /**
   * @docid GridBaseColumn.sortIndex
   * @default undefined
   * @fires GridBaseOptions.onOptionChanged
   * @public
   */
  sortIndex?: number | undefined;
  /**
   * @docid GridBaseColumn.sortOrder
   * @default undefined
   * @acceptValues undefined
   * @fires GridBaseOptions.onOptionChanged
   * @public
   */
  sortOrder?: SortOrder | undefined;
  /**
   * @docid GridBaseColumn.sortingMethod
   * @default undefined
   * @type_function_context GridBaseColumn
   * @public
   */
  sortingMethod?: ((this: ColumnBase, value1: any, value2: any) => number) | undefined;
  /**
   * @docid GridBaseColumn.trueText
   * @default "true"
   * @public
   */
  trueText?: string;
  /**
   * @docid GridBaseColumn.validationRules
   * @type Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>
   * @public
   */
  validationRules?: Array<ValidationRule>;
  /**
   * @docid GridBaseColumn.visible
   * @default true
   * @fires GridBaseOptions.onOptionChanged
   * @public
   */
  visible?: boolean;
  /**
   * @docid GridBaseColumn.visibleIndex
   * @default undefined
   * @fires GridBaseOptions.onOptionChanged
   * @public
   */
  visibleIndex?: number | undefined;
  /**
   * @docid GridBaseColumn.width
   * @default undefined
   * @public
   */
  width?: number | string | undefined;
}

/**
 * @hidden
 * @docid GridBaseColumnButton
 * @namespace DevExpress.common.grids
 * @type object
 */
export interface ColumnButtonBase {
  /**
   * @docid GridBaseColumnButton.cssClass
   * @public
   */
  cssClass?: string;
  /**
   * @docid GridBaseColumnButton.hint
   * @public
   */
  hint?: string;
  /**
   * @docid GridBaseColumnButton.icon
   * @public
   */
  icon?: string;
  /**
   * @docid GridBaseColumnButton.text
   * @public
   */
  text?: string;
}

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type ColumnChooser = {
  /**
   * @docid GridBaseOptions.columnChooser.allowSearch
   * @default false
   * @deprecated
   */
  allowSearch?: boolean;
  /**
     * @docid GridBaseOptions.columnChooser.container
     * @default undefined
     * @public
     */
  container?: string | UserDefinedElement | undefined;
  /**
   * @docid GridBaseOptions.columnChooser.emptyPanelText
   * @default "Drag a column here to hide it"
   */
  emptyPanelText?: string;
  /**
   * @docid GridBaseOptions.columnChooser.enabled
   * @default false
   */
  enabled?: boolean;
  /**
   * @docid GridBaseOptions.columnChooser.height
   * @default 260
   */
  height?: number | string;
  /**
   * @docid GridBaseOptions.columnChooser.mode
   * @default "dragAndDrop"
   */
  mode?: ColumnChooserMode;
  /**
   * @docid GridBaseOptions.columnChooser.position
   * @default undefined
   */
  position?: PositionConfig | undefined;
  /**
   * @docid GridBaseOptions.columnChooser.search
   */
  search?: ColumnChooserSearchConfig;
  /**
   * @docid GridBaseOptions.columnChooser.searchTimeout
   * @default 500
   * @deprecated
   */
  searchTimeout?: number;
  /**
   * @docid GridBaseOptions.columnChooser.selection
   */
  selection?: ColumnChooserSelectionConfig;
  /**
   * @docid GridBaseOptions.columnChooser.title
   * @default "Column Chooser"
   */
  title?: string;
  /**
   * @docid GridBaseOptions.columnChooser.width
   * @default 250
   */
  width?: number | string;
  /**
   * @docid GridBaseOptions.columnChooser.sortOrder
   * @default undefined
   */
  sortOrder?: SortOrder | undefined;
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type ColumnChooserMode = 'dragAndDrop' | 'select';

/**
 * @public
 * @docid
 * @namespace DevExpress.common.grids
 */
export type ColumnChooserSearchConfig = {
  /**
   * @docid
   * @default {}
   */
  editorOptions?: any;
  /**
   * @docid
   * @default false
   */
  enabled?: boolean;
  /**
   * @docid
   * @default 500
   */
  timeout?: number;
};

/**
 * @public
 * @docid
 * @namespace DevExpress.common.grids
 */
export type ColumnChooserSelectionConfig = {
  /**
   * @docid
   * @default false
   */
  allowSelectAll?: boolean;
  /**
   * @docid
   * @default false
   */
  recursive?: boolean;
  /**
   * @docid
   * @default false
   */
  selectByClick?: boolean;
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type ColumnCustomizeTextArg = {
  value?: any;
  valueText?: string;
  target?: string;
  groupInterval?: string | number;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type ColumnFixing = {
  /**
   * @docid GridBaseOptions.columnFixing.enabled
   * @default false
   */
  enabled?: boolean;
  /**
   * @docid GridBaseOptions.columnFixing.texts
   * @type object
   */
  texts?: ColumnFixingTexts;
  /**
   * @docid GridBaseOptions.columnFixing.icons
   * @type object
   */
  icons?: ColumnFixingIcons;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type ColumnFixingTexts = {
  /**
   * @docid GridBaseOptions.columnFixing.texts.fix
   * @default "Fix"
   */
  fix?: string;
  /**
   * @docid GridBaseOptions.columnFixing.texts.leftPosition
   * @default "To the left"
   */
  leftPosition?: string;
  /**
   * @docid GridBaseOptions.columnFixing.texts.rightPosition
   * @default "To the right"
   */
  rightPosition?: string;
  /**
   * @docid GridBaseOptions.columnFixing.texts.unfix
   * @default "Unfix"
   */
  unfix?: string;
  /**
   * @docid GridBaseOptions.columnFixing.texts.stickyPosition
   * @default "Stick in place"
   */
  stickyPosition?: string;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type ColumnFixingIcons = {
  /**
   * @docid GridBaseOptions.columnFixing.icons.fix
   * @default "fix-column"
   */
  fix?: string;
  /**
   * @docid GridBaseOptions.columnFixing.icons.leftPosition
   * @default "fix-column-left"
   */
  leftPosition?: string;
  /**
   * @docid GridBaseOptions.columnFixing.icons.rightPosition
   * @default "fix-column-right"
   */
  rightPosition?: string;
  /**
   * @docid GridBaseOptions.columnFixing.icons.unfix
   * @default "unfix-column"
   */
  unfix?: string;
  /**
   * @docid GridBaseOptions.columnFixing.icons.stickyPosition
   * @default "stick-column"
   */
  stickyPosition?: string;
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type ColumnHeaderFilter = {
  /**
   * @docid GridBaseColumn.headerFilter.allowSearch
   * @default false
   * @deprecated
   */
  allowSearch?: boolean;
  /**
   * @docid GridBaseColumn.headerFilter.allowSelectAll
   * @default true
   */
  allowSelectAll?: boolean;
  /**
   * @docid GridBaseColumn.headerFilter.dataSource
   * @type_function_param1_field component:object
   * @default undefined
   * @type Array<any>|Store|DataSourceOptions|Function|null|undefined
   */
  dataSource?: FilterLookupDataSource<any> | ((options: { component?: any; dataSource?: DataSourceOptions | null }) => void) | undefined;
  /**
   * @docid GridBaseColumn.headerFilter.groupInterval
   * @default undefined
   */
  groupInterval?: HeaderFilterGroupInterval | number | undefined;
  /**
   * @docid GridBaseColumn.headerFilter.height
   * @default undefined
   */
  height?: number | string | undefined;
  /**
   * @docid GridBaseColumn.headerFilter.search
   */
  search?: ColumnHeaderFilterSearchConfig;
  /**
   * @docid GridBaseColumn.headerFilter.searchMode
   * @default 'contains'
   * @deprecated
   */
  searchMode?: SearchMode;
  /**
   * @docid GridBaseColumn.headerFilter.width
   * @default undefined
   */
  width?: number | string | undefined;
};

/**
 * @public
 * @docid
 * @namespace DevExpress.common.grids
 * @inherits HeaderFilterSearchConfig
 */
export type ColumnHeaderFilterSearchConfig = HeaderFilterSearchConfig & {
  /**
   * @docid
   * @type getter|Array<getter>|undefined
   * @default undefined
   */
  searchExpr?: string | Function | Array<string | Function> | undefined;
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type ColumnLookup = {
  /**
   * @docid GridBaseColumn.lookup.allowClearing
   * @default false
   */
  allowClearing?: boolean;
  /**
   * @docid GridBaseColumn.lookup.dataSource
   * @type_function_param1_field data:object
   * @default undefined
   * @type_function_return Array<any>|Store|DataSourceOptions
   * @type Array<any>|Store|DataSourceOptions|Function|null|undefined
   */
  dataSource?: FilterLookupDataSource<any> | ((options: { data?: any; key?: any }) => FilterLookupDataSource<any>) | null | undefined;
  /**
   * @docid GridBaseColumn.lookup.displayExpr
   * @default undefined
   * @type_function_param1 data:object
   */
  displayExpr?: string | ((data: any) => string) | undefined;
  /**
   * @docid GridBaseColumn.lookup.valueExpr
   * @default undefined
   */
  valueExpr?: string | undefined;
  /**
   * @docid GridBaseColumn.lookup.calculateCellValue
   * @type_function_param1 rowData:object
   * @public
   */
  calculateCellValue?: ((rowData: any) => any);
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type ColumnResizeMode = 'nextColumn' | 'widget';

/**
 * @public
 * @docid
 * @namespace DevExpress.common.grids
 */
export type DataChange<TRowData = any, TKey = any> = {
  /**
   * @docid
   */
  key: TKey;
  /**
   * @docid
   */
  type: DataChangeType;
  /**
   * @docid
   * @type any
   */
  data: DeepPartial<TRowData>;
  /**
   * @docid
   */
  insertAfterKey?: TKey;
  /**
   * @docid
   */
  insertBeforeKey?: TKey;
};

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export type DataChangeInfo<TRowData = any, TKey = any> = {
  /**
   * @docid
   * @type Array<DataChange>
   */
  readonly changes: Array<DataChange<TRowData, TKey>>;
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type DataChangeType = 'insert' | 'update' | 'remove';

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export type DataErrorOccurredInfo = {
  /** @docid */
  readonly error?: Error;
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type DataRenderMode = 'standard' | 'virtual';

/**
 * @namespace DevExpress.common.grids
 */
export type DragDropInfo = {
  readonly dropInsideItem: boolean;
};

/**
 * @namespace DevExpress.common.grids
 */
export type DragReorderInfo = {
  readonly dropInsideItem: boolean;
  promise?: PromiseLike<void>;
};

/**
 * @namespace DevExpress.common.grids
 */
export interface DragStartEventInfo<TRowData = any> {
  itemData?: TRowData;
  readonly itemElement: DxElement;
  readonly fromIndex: number;
  readonly fromData?: any;
}

/**
 * @hidden
 * @docid
 * @namespace DevExpress.common.grids
 */
export interface EditingBase<TRowData = any, TKey = any> {
  /**
   * @docid GridBaseOptions.editing.confirmDelete
   * @default true
   * @public
   */
  confirmDelete?: boolean;
  /**
   * @docid GridBaseOptions.editing.changes
   * @default []
   * @fires GridBaseOptions.onOptionChanged
   * @public
   * @type Array<DataChange>
   */
  changes?: Array<DataChange<TRowData, TKey>>;
  /**
   * @docid GridBaseOptions.editing.editColumnName
   * @default null
   * @fires GridBaseOptions.onOptionChanged
   * @public
   */
  editColumnName?: string;
  /**
   * @docid GridBaseOptions.editing.editRowKey
   * @default null
   * @fires GridBaseOptions.onOptionChanged
   * @public
   */
  editRowKey?: TKey;
  /**
   * @docid GridBaseOptions.editing.form
   * @public
   * @type dxFormOptions
   */
  form?: FormProperties;
  /**
   * @docid GridBaseOptions.editing.mode
   * @default "row"
   * @public
   */
  mode?: GridsEditMode;
  /**
   * @docid GridBaseOptions.editing.popup
   * @public
   * @type dxPopupOptions
   */
  popup?: PopupProperties;
  /**
   * @docid GridBaseOptions.editing.refreshMode
   * @default "full"
   * @public
   */
  refreshMode?: GridsEditRefreshMode;
  /**
   * @docid GridBaseOptions.editing.selectTextOnEditStart
   * @default false
   * @public
   */
  selectTextOnEditStart?: boolean;
  /**
   * @docid GridBaseOptions.editing.startEditAction
   * @default "click"
   * @public
   */
  startEditAction?: StartEditAction;
  /**
   * @docid GridBaseOptions.editing.texts
   * @type object
   * @public
   */
  texts?: EditingTextsBase;
  /**
   * @docid GridBaseOptions.editing.useIcons
   * @default true &for(Material)
   * @default true &for(Fluent)
   * @default false
   * @public
   */
  useIcons?: boolean;
}

/**
 * @hidden
 * @docid
 * @namespace DevExpress.common.grids
 */
export interface EditingTextsBase {
  /**
   * @docid GridBaseOptions.editing.texts.addRow
   * @default "Add a row"
   * @public
   */
  addRow?: string;
  /**
   * @docid GridBaseOptions.editing.texts.cancelAllChanges
   * @default "Discard changes"
   * @public
   */
  cancelAllChanges?: string;
  /**
   * @docid GridBaseOptions.editing.texts.cancelRowChanges
   * @default "Cancel"
   * @public
   */
  cancelRowChanges?: string;
  /**
   * @docid GridBaseOptions.editing.texts.confirmDeleteMessage
   * @default "Are you sure you want to delete this record?"
   * @public
   */
  confirmDeleteMessage?: string;
  /**
   * @docid GridBaseOptions.editing.texts.confirmDeleteTitle
   * @default ""
   * @public
   */
  confirmDeleteTitle?: string;
  /**
   * @docid GridBaseOptions.editing.texts.deleteRow
   * @default "Delete"
   * @public
   */
  deleteRow?: string;
  /**
   * @docid GridBaseOptions.editing.texts.editRow
   * @default "Edit"
   * @public
   */
  editRow?: string;
  /**
   * @docid GridBaseOptions.editing.texts.saveAllChanges
   * @default "Save changes"
   * @public
   */
  saveAllChanges?: string;
  /**
   * @docid GridBaseOptions.editing.texts.saveRowChanges
   * @default "Save"
   * @public
   */
  saveRowChanges?: string;
  /**
   * @docid GridBaseOptions.editing.texts.undeleteRow
   * @default "Undelete"
   * @public
   */
  undeleteRow?: string;
  /**
   * @docid GridBaseOptions.editing.texts.validationCancelChanges
   * @default "Cancel changes"
   * @public
   */
  validationCancelChanges?: string;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type EnterKeyAction = 'startEdit' | 'moveFocus';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type EnterKeyDirection = 'none' | 'column' | 'row';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type FilterOperation = '=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | 'anyof' | 'noneof';

/**
 * @namespace DevExpress.common.grids
 */
export interface FilterPanelCustomizeTextArg<TComponent> {
  readonly component: TComponent;
  readonly filterValue: any;
  readonly text: string;
}

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type FilterPanelTexts = {
  /**
   * @docid GridBaseOptions.filterPanel.texts.clearFilter
   * @default "Clear"
   */
  clearFilter?: string;
  /**
   * @docid GridBaseOptions.filterPanel.texts.createFilter
   * @default "Create Filter"
   */
  createFilter?: string;
  /**
   * @docid GridBaseOptions.filterPanel.texts.filterEnabledHint
   * @default "Enable the filter"
   */
  filterEnabledHint?: string;
};

/**
 * @docid
 * @namespace DevExpress.common.grids
 */
export interface FilterPanel<TComponent extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> {
  /**
   * @docid GridBaseOptions.filterPanel.customizeText
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field filterValue:object
   */
  customizeText?: ((e: FilterPanelCustomizeTextArg<TComponent>) => string);
  /**
   * @docid GridBaseOptions.filterPanel.filterEnabled
   * @default true
   * @fires GridBaseOptions.onOptionChanged
   */
  filterEnabled?: boolean;
  /**
   * @docid GridBaseOptions.filterPanel.texts
   * @type object
   * @default {}
   */
  texts?: FilterPanelTexts;
  /**
   * @docid GridBaseOptions.filterPanel.visible
   * @default false
   */
  visible?: boolean;
}

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type FilterRow = {
  /**
   * @docid GridBaseOptions.filterRow.applyFilter
   * @default "auto"
   */
  applyFilter?: ApplyFilterMode;
  /**
   * @docid GridBaseOptions.filterRow.applyFilterText
   * @default "Apply filter"
   */
  applyFilterText?: string;
  /**
   * @docid GridBaseOptions.filterRow.betweenEndText
   * @default "End"
   */
  betweenEndText?: string;
  /**
   * @docid GridBaseOptions.filterRow.betweenStartText
   * @default "Start"
   */
  betweenStartText?: string;
  /**
   * @docid GridBaseOptions.filterRow.operationDescriptions
   * @type object
   */
  operationDescriptions?: FilterRowOperationDescriptions;
  /**
   * @docid GridBaseOptions.filterRow.resetOperationText
   * @default "Reset"
   */
  resetOperationText?: string;
  /**
   * @docid GridBaseOptions.filterRow.showAllText
   * @default "(All)"
   */
  showAllText?: string;
  /**
   * @docid GridBaseOptions.filterRow.showOperationChooser
   * @default true
   */
  showOperationChooser?: boolean;
  /**
   * @docid GridBaseOptions.filterRow.visible
   * @default false
   */
  visible?: boolean;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type FilterRowOperationDescriptions = {
  /**
   * @docid GridBaseOptions.filterRow.operationDescriptions.between
   * @default "Between"
   */
  between?: string;
  /**
   * @docid GridBaseOptions.filterRow.operationDescriptions.contains
   * @default "Contains"
   */
  contains?: string;
  /**
   * @docid GridBaseOptions.filterRow.operationDescriptions.endsWith
   * @default "Ends with"
   */
  endsWith?: string;
  /**
   * @docid GridBaseOptions.filterRow.operationDescriptions.equal
   * @default "Equals"
   */
  equal?: string;
  /**
   * @docid GridBaseOptions.filterRow.operationDescriptions.greaterThan
   * @default "Greater than"
   */
  greaterThan?: string;
  /**
   * @docid GridBaseOptions.filterRow.operationDescriptions.greaterThanOrEqual
   * @default "Greater than or equal to"
   */
  greaterThanOrEqual?: string;
  /**
   * @docid GridBaseOptions.filterRow.operationDescriptions.lessThan
   * @default "Less than"
   */
  lessThan?: string;
  /**
   * @docid GridBaseOptions.filterRow.operationDescriptions.lessThanOrEqual
   * @default "Less than or equal to"
   */
  lessThanOrEqual?: string;
  /**
   * @docid GridBaseOptions.filterRow.operationDescriptions.notContains
   * @default "Does not contain"
   */
  notContains?: string;
  /**
   * @docid GridBaseOptions.filterRow.operationDescriptions.notEqual
   * @default "Does not equal"
   */
  notEqual?: string;
  /**
   * @docid GridBaseOptions.filterRow.operationDescriptions.startsWith
   * @default "Starts with"
   */
  startsWith?: string;
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type FilterType = 'exclude' | 'include';

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type HeaderFilter = {
  /**
   * @docid GridBaseOptions.headerFilter.allowSearch
   * @default false
   * @deprecated
   */
  allowSearch?: boolean;
  /**
   * @docid GridBaseOptions.headerFilter.allowSelectAll
   * @default true
   */
  allowSelectAll?: boolean;
  /**
   * @docid GridBaseOptions.headerFilter.height
   * @default 315 &for(Material)
   * @default 315 &for(Fluent)
   * @default 325
   */
  height?: number | string;
  /**
   * @docid GridBaseOptions.headerFilter.search
   */
  search?: HeaderFilterSearchConfig;
  /**
   * @docid GridBaseOptions.headerFilter.searchTimeout
   * @default 500
   * @deprecated
   */
  searchTimeout?: number;
  /**
   * @docid GridBaseOptions.headerFilter.texts
   * @type object
   */
  texts?: HeaderFilterTexts;
  /**
   * @docid GridBaseOptions.headerFilter.visible
   * @default false
   */
  visible?: boolean;
  /**
   * @docid GridBaseOptions.headerFilter.width
   * @default 252
   */
  width?: number | string;
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type HeaderFilterGroupInterval = 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year';

/**
 * @public
 * @docid
 * @namespace DevExpress.common.grids
 */
export type HeaderFilterSearchConfig = {
  /**
   * @docid
   * @default {}
   */
  editorOptions?: any;
  /**
   * @docid
   * @default false
   */
  enabled?: boolean;
  /**
   * @docid
   * @default 'contains'
   */
  mode?: SearchMode;
  /**
   * @docid
   * @default 500
   */
  timeout?: number;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type HeaderFilterTexts = {
  /**
   * @docid GridBaseOptions.headerFilter.texts.cancel
   * @default "Cancel"
   */
  cancel?: string;
  /**
   * @docid GridBaseOptions.headerFilter.texts.emptyValue
   * @default "(Blanks)"
   */
  emptyValue?: string;
  /**
   * @docid GridBaseOptions.headerFilter.texts.ok
   * @default "Ok"
   */
  ok?: string;
};

/**
 * @docid
 * @inherits Widget, DataHelperMixin
 * @hidden
 * @namespace DevExpress.common.grids
 * @options GridBaseOptions
 */
export interface GridBase<TRowData = any, TKey = any> {
  /**
   * @docid
   * @publicName beginCustomLoading(messageText)
   * @public
   */
  beginCustomLoading(messageText: string): void;
  /**
   * @docid
   * @publicName byKey(key)
   * @param1 key:object|string|number
   * @return Promise<Object>
   * @public
   */
  byKey(key: TKey): DxPromise<TRowData>;
  /**
   * @docid
   * @publicName cancelEditData()
   * @public
   */
  cancelEditData(): void;
  /**
   * @docid
   * @publicName cellValue(rowIndex, dataField)
   * @public
   */
  cellValue(rowIndex: number, dataField: string): any;
  /**
   * @docid
   * @publicName cellValue(rowIndex, dataField, value)
   * @public
   */
  cellValue(rowIndex: number, dataField: string, value: any): void;
  /**
   * @docid
   * @publicName cellValue(rowIndex, visibleColumnIndex)
   * @public
   */
  cellValue(rowIndex: number, visibleColumnIndex: number): any;
  /**
   * @docid
   * @publicName cellValue(rowIndex, visibleColumnIndex, value)
   * @public
   */
  cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
  /**
   * @docid
   * @publicName clearFilter()
   * @public
   */
  clearFilter(): void;
  /**
   * @docid
   * @publicName clearFilter(filterName)
   * @public
   */
  clearFilter(filterName: string): void;
  /**
   * @docid
   * @publicName clearSelection()
   * @public
   */
  clearSelection(): void;
  /**
   * @docid
   * @publicName clearSorting()
   * @public
   */
  clearSorting(): void;
  /**
   * @docid
   * @publicName closeEditCell()
   * @public
   */
  closeEditCell(): void;
  /**
   * @docid
   * @publicName collapseAdaptiveDetailRow()
   * @public
   */
  collapseAdaptiveDetailRow(): void;
  /**
   * @docid
   * @publicName columnCount()
   * @public
   */
  columnCount(): number;
  /**
   * @docid
   * @publicName columnOption(id)
   * @return object
   * @public
   */
  columnOption(id: number | string): any;
  /**
   * @docid
   * @publicName columnOption(id, optionName)
   * @public
   */
  columnOption(id: number | string, optionName: string): any;
  /**
   * @docid
   * @publicName columnOption(id, optionName, optionValue)
   * @public
   */
  columnOption(id: number | string, optionName: string, optionValue: any): void;
  /**
   * @docid
   * @publicName columnOption(id, options)
   * @param2 options:object
   * @public
   */
  columnOption(id: number | string, options: any): void;
  /**
   * @docid
   * @publicName deleteColumn(id)
   * @public
   */
  deleteColumn(id: number | string): void;
  /**
   * @docid
   * @publicName deleteRow(rowIndex)
   * @public
   */
  deleteRow(rowIndex: number): void;
  /**
   * @docid
   * @publicName deselectAll()
   * @return Promise<void>
   * @public
   */
  deselectAll(): DxPromise<void>;
  /**
   * @docid
   * @publicName deselectRows(keys)
   * @return Promise<any>
   * @public
   */
  deselectRows(keys: Array<any>): DxPromise<any>;
  /**
   * @docid
   * @publicName editCell(rowIndex, dataField)
   * @public
   */
  editCell(rowIndex: number, dataField: string): void;
  /**
   * @docid
   * @publicName editCell(rowIndex, visibleColumnIndex)
   * @public
   */
  editCell(rowIndex: number, visibleColumnIndex: number): void;
  /**
   * @docid
   * @publicName editRow(rowIndex)
   * @public
   */
  editRow(rowIndex: number): void;
  /**
   * @docid
   * @publicName endCustomLoading()
   * @public
   */
  endCustomLoading(): void;
  /**
   * @docid
   * @publicName expandAdaptiveDetailRow(key)
   * @public
   */
  expandAdaptiveDetailRow(key: TKey): void;
  /**
   * @docid
   * @publicName filter()
   * @public
   */
  filter(): any;
  /**
   * @docid
   * @publicName filter(filterExpr)
   * @public
   */
  filter(filterExpr: any): void;
  focus(): void;
  /**
   * @docid
   * @publicName focus(element)
   * @param1 element:Element|jQuery
   * @public
   */
  focus(element: UserDefinedElement): void;
  /**
   * @docid
   * @publicName getCellElement(rowIndex, dataField)
   * @public
   */
  getCellElement(rowIndex: number, dataField: string): DxElement | undefined;
  /**
   * @docid
   * @publicName getCellElement(rowIndex, visibleColumnIndex)
   * @public
   */
  getCellElement(rowIndex: number, visibleColumnIndex: number): DxElement | undefined;
  /**
   * @docid
   * @publicName getCombinedFilter()
   * @public
   */
  getCombinedFilter(): any;
  /**
   * @docid
   * @publicName getCombinedFilter(returnDataField)
   * @public
   */
  getCombinedFilter(returnDataField: boolean): any;
  getDataSource(): DataSource<TRowData, TKey>;
  /**
   * @docid
   * @publicName getKeyByRowIndex(rowIndex)
   * @param1 rowIndex:numeric
   * @return any
   * @public
   */
  getKeyByRowIndex(rowIndex: number): TKey | undefined;
  /**
   * @docid
   * @publicName getRowElement(rowIndex)
   * @return Array<Element>|jQuery|undefined
   * @public
   */
  getRowElement(rowIndex: number): UserDefinedElementsArray | undefined;
  /**
   * @docid
   * @publicName getRowIndexByKey(key)
   * @param1 key:object|string|number
   * @return numeric
   * @public
   */
  getRowIndexByKey(key: TKey): number;
  /**
   * @docid
   * @publicName getScrollable()
   * @public
   * @return dxScrollable
   */
  getScrollable(): Scrollable;
  /**
   * @docid
   * @publicName getVisibleColumnIndex(id)
   * @public
   */
  getVisibleColumnIndex(id: number | string): number;
  /**
   * @docid
   * @publicName hasEditData()
   * @public
   */
  hasEditData(): boolean;
  /**
   * @docid
   * @publicName hideColumnChooser()
   * @public
   */
  hideColumnChooser(): void;
  /**
   * @docid
   * @publicName isAdaptiveDetailRowExpanded(key)
   * @public
   */
  isAdaptiveDetailRowExpanded(key: TKey): boolean;
  /**
   * @docid
   * @publicName isRowFocused(key)
   * @public
   */
  isRowFocused(key: TKey): boolean;
  /**
   * @docid
   * @publicName isRowSelected(key)
   * @public
   */
  isRowSelected(key: TKey): boolean;
  /**
   * @docid
   * @publicName keyOf(obj)
   * @param1 obj:object
   * @public
   */
  keyOf(obj: TRowData): TKey;
  /**
   * @docid
   * @publicName navigateToRow(key)
   * @public
   * @return Promise<void>
   */
  navigateToRow(key: TKey): DxPromise<void>;
  /**
   * @docid
   * @publicName pageCount()
   * @return numeric
   * @public
   */
  pageCount(): number;
  /**
   * @docid
   * @publicName pageIndex()
   * @return numeric
   * @public
   */
  pageIndex(): number;
  /**
   * @docid
   * @publicName pageIndex(newIndex)
   * @param1 newIndex:numeric
   * @return Promise<void>
   * @public
   */
  pageIndex(newIndex: number): DxPromise<void>;
  /**
   * @docid
   * @publicName pageSize()
   * @return numeric
   * @public
   */
  pageSize(): number;
  /**
   * @docid
   * @publicName pageSize(value)
   * @param1 value:numeric
   * @public
   */
  pageSize(value: number): void;
  /**
   * @docid
   * @publicName refresh()
   * @return Promise<void>
   * @public
   */
  refresh(): DxPromise<void>;
  /**
   * @docid
   * @publicName refresh(changesOnly)
   * @return Promise<void>
   * @public
   */
  refresh(changesOnly: boolean): DxPromise<void>;
  /**
   * @docid
   * @publicName repaintRows(rowIndexes)
   * @public
   */
  repaintRows(rowIndexes: Array<number>): void;
  /**
   * @docid
   * @publicName saveEditData()
   * @return Promise<void>
   * @public
   */
  saveEditData(): DxPromise<void>;
  /**
   * @docid
   * @publicName searchByText(text)
   * @public
   */
  searchByText(text: string): void;
  /**
   * @docid
   * @publicName selectAll()
   * @return Promise<void>
   * @public
   */
  selectAll(): DxPromise<void>;
  /**
   * @docid
   * @publicName selectRows(keys, preserve)
   * @return Promise<any>
   * @public
   */
  selectRows(keys: Array<TKey>, preserve: boolean): DxPromise<Array<TRowData>>;
  /**
   * @docid
   * @publicName selectRowsByIndexes(indexes)
   * @return Promise<any>
   * @public
   */
  selectRowsByIndexes(indexes: Array<number>): DxPromise<Array<TRowData>>;
  /**
   * @docid
   * @publicName showColumnChooser()
   * @public
   */
  showColumnChooser(): void;
  /**
   * @docid
   * @publicName state()
   * @return object
   * @public
   */
  state(): any;
  /**
   * @docid
   * @publicName state(state)
   * @param1 state:object
   * @public
   */
  state(state: any): void;
  /**
   * @docid
   * @publicName undeleteRow(rowIndex)
   * @public
   */
  undeleteRow(rowIndex: number): void;
  /**
   * @docid
   * @publicName updateDimensions()
   * @public
   */
  updateDimensions(): void;
}

/**
 * @namespace DevExpress.common.grids
 */
interface GridBaseOptionsBlank<TComponent extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> extends WidgetOptions<TComponent> {
    /**
     * @hidden
     * @docid GridBaseOptions.focusStateEnabled
     */
    focusStateEnabled?: any;
}

/**
 * @namespace DevExpress.common.grids
 * @docid
 * @type object
 */
export type GridBaseOptions<TComponent extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> = Omit<GridBaseOptionsBlank<TComponent, TRowData, TKey>, 'focusStateEnabled'> & {
  /**
   * @docid
   * @default false
   * @public
   */
  allowColumnReordering?: boolean;
  /**
   * @docid
   * @default false
   * @public
   */
  allowColumnResizing?: boolean;
  /**
   * @docid
   * @default true
   * @public
   */
  autoNavigateToFocusedRow?: boolean;
  /**
   * @docid
   * @default true
   * @public
   */
  cacheEnabled?: boolean;
  /**
   * @docid
   * @default true
   * @public
   */
  cellHintEnabled?: boolean;
  /**
   * @docid
   * @default false
   * @public
   */
  columnAutoWidth?: boolean;
  /**
   * @docid
   * @type object
   * @public
   * @inherits ColumnChooser
   */
  columnChooser?: ColumnChooser;
  /**
   * @docid
   * @type object
   * @public
   */
  columnFixing?: ColumnFixing;
  /**
   * @docid
   * @default false
   * @public
   */
  columnHidingEnabled?: boolean;
  /**
   * @docid
   * @default undefined
   * @public
   */
  columnMinWidth?: number | undefined;
  /**
   * @docid
   * @default "nextColumn"
   * @public
   */
  columnResizingMode?: ColumnResizeMode;
  /**
   * @docid
   * @default undefined
   * @public
   */
  columnWidth?: number | Mode | undefined;
  /**
   * @docid
   * @type Array<GridBaseColumn|string>
   * @fires GridBaseOptions.onOptionChanged
   * @default undefined
   * @public
   */
  columns?: Array<ColumnBase<TRowData> | string> | undefined;
  /**
   * @docid
   * @default null
   * @public
   * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
   */
  dataSource?: DataSourceLike<TRowData, TKey> | null;
  /**
   * @docid
   * @public
   */
  dateSerializationFormat?: string;
  /**
   * @docid
   * @public
   * @type object
   */
  editing?: EditingBase<TRowData, TKey>;
  /**
   * @docid
   * @default true
   * @public
   */
  errorRowEnabled?: boolean;
  /**
   * @docid
   * @default {}
   * @public
   * @type dxFilterBuilderOptions
   */
  filterBuilder?: FilterBuilderProperties;
  /**
   * @docid
   * @default {}
   * @public
   * @type dxPopupOptions
   */
  filterBuilderPopup?: PopupProperties;
  /**
   * @docid
   * @type object
   * @default {}
   * @public
   */
  filterPanel?: FilterPanel<TComponent, TRowData, TKey>;
  /**
   * @docid
   * @type object
   * @public
   */
  filterRow?: FilterRow;
  /**
   * @docid
   * @default "auto"
   * @public
   */
  filterSyncEnabled?: boolean | Mode;
  /**
   * @docid
   * @type Filter expression
   * @default null
   * @fires GridBase.onOptionChanged
   * @public
   */
  filterValue?: string | Array<any> | Function;
  /**
   * @docid
   * @default -1
   * @fires GridBaseOptions.onFocusedCellChanged
   * @public
   */
  focusedColumnIndex?: number;
  /**
   * @docid
   * @default false
   * @public
   */
  focusedRowEnabled?: boolean;
  /**
   * @docid
   * @default -1
   * @fires GridBaseOptions.onFocusedRowChanged
   * @public
   */
  focusedRowIndex?: number;
  /**
   * @docid
   * @default undefined
   * @fires GridBaseOptions.onFocusedRowChanged
   * @public
   */
  focusedRowKey?: TKey | undefined;
  /**
   * @docid
   * @type object
   * @public
   */
  headerFilter?: HeaderFilter;
  /**
   * @docid
   * @default false
   * @public
   */
  highlightChanges?: boolean;
  /**
   * @docid
   * @type object
   * @public
   */
  keyboardNavigation?: KeyboardNavigation;
  /**
   * @docid
   * @type object
   * @public
   */
  loadPanel?: LoadPanel;
  /**
   * @docid
   * @default "No data"
   * @public
   */
  noDataText?: string;
  /**
   * @docid
   * @default null
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field formOptions:object
   * @action
   * @public
   */
  onAdaptiveDetailRowPreparing?: ((e: EventInfo<TComponent> & AdaptiveDetailRowPreparingInfo) => void);
  /**
   * @docid
   * @default null
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @action
   * @public
   */
  onDataErrorOccurred?: ((e: EventInfo<TComponent> & DataErrorOccurredInfo) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field changes:Array<DataChange>
   * @default null
   * @action
   * @public
   */
  onEditCanceled?: ((e: EventInfo<TComponent> & DataChangeInfo<TRowData, TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field changes:Array<DataChange>
   * @default null
   * @action
   * @public
   */
  onEditCanceling?: ((e: Cancelable & EventInfo<TComponent> & DataChangeInfo<TRowData, TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field data:object
   * @type_function_param1_field promise:Promise<void>
   * @default null
   * @action
   * @public
   */
  onInitNewRow?: ((e: EventInfo<TComponent> & NewRowInfo<TRowData>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field event:event
   * @default null
   * @action
   * @public
   */
  onKeyDown?: ((e: NativeEventInfo<TComponent, KeyboardEvent> & KeyDownInfo) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field key:any
   * @default null
   * @action
   * @public
   */
  onRowCollapsed?: ((e: EventInfo<TComponent> & RowKeyInfo<TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field key:any
   * @default null
   * @action
   * @public
   */
  onRowCollapsing?: ((e: Cancelable & EventInfo<TComponent> & RowKeyInfo<TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field key:any
   * @default null
   * @action
   * @public
   */
  onRowExpanded?: ((e: EventInfo<TComponent> & RowKeyInfo<TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field key:any
   * @default null
   * @action
   * @public
   */
  onRowExpanding?: ((e: Cancelable & EventInfo<TComponent> & RowKeyInfo<TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field data:object
   * @type_function_param1_field key:any
   * @default null
   * @action
   * @public
   */
  onRowInserted?: ((e: EventInfo<TComponent> & RowInsertedInfo<TRowData, TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field data:object
   * @type_function_param1_field cancel:boolean|Promise<void>
   * @default null
   * @action
   * @public
   */
  onRowInserting?: ((e: EventInfo<TComponent> & RowInsertingInfo<TRowData>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field data:object
   * @type_function_param1_field key:any
   * @default null
   * @action
   * @public
   */
  onRowRemoved?: ((e: EventInfo<TComponent> & RowRemovedInfo<TRowData, TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field data:object
   * @type_function_param1_field key:any
   * @type_function_param1_field cancel:boolean|Promise<void>
   * @default null
   * @action
   * @public
   */
  onRowRemoving?: ((e: EventInfo<TComponent> & RowRemovingInfo<TRowData, TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field data:object
   * @type_function_param1_field key:any
   * @default null
   * @action
   * @public
   */
  onRowUpdated?: ((e: EventInfo<TComponent> & RowUpdatedInfo<TRowData, TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field oldData:object
   * @type_function_param1_field newData:object
   * @type_function_param1_field key:any
   * @type_function_param1_field cancel:boolean|Promise<void>
   * @default null
   * @action
   * @public
   */
  onRowUpdating?: ((e: EventInfo<TComponent> & RowUpdatingInfo<TRowData, TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field key:any
   * @type_function_param1_field newData:object
   * @type_function_param1_field oldData:object
   * @type_function_param1_field promise:Promise<void>
   * @type_function_param1_field brokenRules:Array<RequiredRule|NumericRule|RangeRule|StringLengthRule|CustomRule|CompareRule|PatternRule|EmailRule|AsyncRule>
   * @default null
   * @action
   * @public
   */
  onRowValidating?: ((e: EventInfo<TComponent> & RowValidatingInfo<TRowData, TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field changes:Array<DataChange>
   * @default null
   * @action
   * @public
   */
  onSaved?: ((e: EventInfo<TComponent> & DataChangeInfo<TRowData, TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field changes:Array<DataChange>
   * @type_function_param1_field promise:Promise<void>
   * @default null
   * @action
   * @public
   */
  onSaving?: ((e: EventInfo<TComponent> & SavingInfo<TRowData, TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field currentSelectedRowKeys:Array<any>
   * @type_function_param1_field currentDeselectedRowKeys:Array<any>
   * @type_function_param1_field selectedRowKeys:Array<any>
   * @type_function_param1_field selectedRowsData:Array<Object>
   * @default null
   * @action
   * @public
   */
  onSelectionChanged?: ((e: EventInfo<TComponent> & SelectionChangedInfo<TRowData, TKey>) => void);
  /**
   * @docid
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field toolbarOptions:dxToolbarOptions
   * @default null
   * @action
   * @public
   */
  onToolbarPreparing?: ((e: EventInfo<TComponent> & ToolbarPreparingInfo) => void);
  /**
   * @docid
   * @public
   */
  pager?: Pager;
  /**
   * @docid
   * @public
   * @type object
   */
  paging?: PagingBase;
  /**
   * @docid
   * @default false
   * @public
   */
  renderAsync?: boolean;
  /**
   * @docid
   * @default false
   * @public
   */
  repaintChangesOnly?: boolean;
  /**
   * @docid
   * @default false
   * @public
   */
  rowAlternationEnabled?: boolean;
  /**
   * @docid
   * @type object
   * @public
   */
  rowDragging?: RowDragging<TComponent, TRowData, TKey>;
  /**
   * @docid
   * @public
   * @type object
   */
  scrolling?: ScrollingBase;
  /**
   * @docid
   * @type object
   * @public
   */
  searchPanel?: SearchPanel;
  /**
   * @docid
   * @fires GridBaseOptions.onSelectionChanged
   * @public
   */
  selectedRowKeys?: Array<TKey>;
  /**
   * @docid
   * @public
   * @type object
   */
  selection?: SelectionBase;
  /**
   * @docid
   * @default false
   * @public
   */
  showBorders?: boolean;
  /**
   * @docid
   * @default true
   * @public
   */
  showColumnHeaders?: boolean;
  /**
   * @docid
   * @default false &for(Material)
   * @default false &for(Fluent)
   * @default true
   * @public
   */
  showColumnLines?: boolean;
  /**
   * @docid
   * @default true &for(iOS)
   * @default true &for(Material)
   * @default true &for(Fluent)
   * @default false
   * @public
   */
  showRowLines?: boolean;
  /**
   * @docid
   * @type object
   * @public
   */
  sorting?: Sorting;
  /**
   * @docid
   * @type object
   * @public
   */
  stateStoring?: StateStoring;
  /**
   * @docid
   * @default true
   * @public
   */
  twoWayBindingEnabled?: boolean;
  /**
   * @docid
   * @default false
   * @public
   */
  wordWrapEnabled?: boolean;
  /**
   * @docid
   * @default true
   * @public
   */
  syncLookupFilterValues?: boolean;
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type GridsEditMode = 'batch' | 'cell' | 'row' | 'form' | 'popup';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type GridsEditRefreshMode = 'full' | 'reshape' | 'repaint';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type GroupExpandMode = 'buttonClick' | 'rowClick';

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type KeyboardNavigation = {
  /**
   * @docid GridBaseOptions.keyboardNavigation.editOnKeyPress
   * @default false
   */
  editOnKeyPress?: boolean;
  /**
   * @docid GridBaseOptions.keyboardNavigation.enabled
   * @default true
   */
  enabled?: boolean;
  /**
   * @docid GridBaseOptions.keyboardNavigation.enterKeyAction
   * @default "startEdit"
   */
  enterKeyAction?: EnterKeyAction;
  /**
   * @docid GridBaseOptions.keyboardNavigation.enterKeyDirection
   * @default "none"
   */
  enterKeyDirection?: EnterKeyDirection;
};

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export type KeyDownInfo = {
  /** @docid */
  handled: boolean;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type LoadPanel = {
  /**
   * @docid GridBaseOptions.loadPanel.enabled
   * @default "auto"
   */
  enabled?: boolean | Mode;
  /**
   * @docid GridBaseOptions.loadPanel.height
   * @default 90
   */
  height?: number | string;
  /**
   * @docid GridBaseOptions.loadPanel.indicatorSrc
   * @default ""
   */
  indicatorSrc?: string;
  /**
   * @docid GridBaseOptions.loadPanel.shading
   * @default false
   */
  shading?: boolean;
  /**
   * @docid GridBaseOptions.loadPanel.shadingColor
   * @default ''
   */
  shadingColor?: string;
  /**
   * @docid GridBaseOptions.loadPanel.showIndicator
   * @default true
   */
  showIndicator?: boolean;
  /**
   * @docid GridBaseOptions.loadPanel.showPane
   * @default true
   */
  showPane?: boolean;
  /**
   * @docid GridBaseOptions.loadPanel.text
   * @default "Loading..."
   */
  text?: string;
  /**
   * @docid GridBaseOptions.loadPanel.width
   * @default 200
   */
  width?: number | string;
};

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export interface NewRowInfo<TRowData = any> {
  /**
   * @docid
   * @type object
   */
  data: TRowData;
  /**
   * @docid
   * @type Promise<void>
   */
  promise?: PromiseLike<void>;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type NewRowPosition = 'first' | 'last' | 'pageBottom' | 'pageTop' | 'viewportBottom' | 'viewportTop';

/**
 * @docid
 * @public
 * @inherits PagerBase
 * @namespace DevExpress.common.grids
 */
export type Pager = PagerBase & {
  /**
   * @docid
   * @public
   * @default "auto"
   */
  allowedPageSizes?: Array<(number | PagerPageSize)> | Mode;

  /**
   * @docid
   * @public
   * @default "auto"
   */
  visible?: boolean | Mode;
};

/**
 * @deprecated Use DisplayMode from /common instead
 * @namespace DevExpress.common.grids
 */
export type PagerDisplayMode = DisplayMode;

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type PagerPageSize = 'all' | 'auto';

/**
 * @hidden
 * @docid
 * @namespace DevExpress.common.grids
 */
export interface PagingBase {
  /**
   * @docid GridBaseOptions.paging.enabled
   * @default true
   * @public
   */
  enabled?: boolean;
  /**
   * @docid GridBaseOptions.paging.pageIndex
   * @default 0
   * @fires GridBaseOptions.onOptionChanged
   * @public
   */
  pageIndex?: number;
  /**
   * @docid GridBaseOptions.paging.pageSize
   * @default 20
   * @fires GridBaseOptions.onOptionChanged
   * @public
   */
  pageSize?: number;
}

export type ReducedNativeEventInfo<TComponent extends GridBase> = Required<Pick<NativeEventInfo<TComponent, PointerEvent | MouseEvent | TouchEvent>, 'component' | 'event'>>;

/**
 * @docid
 * @namespace DevExpress.common.grids
 */
export type RowDragging<TComponent extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> = {
  /**
   * @docid GridBaseOptions.rowDragging.allowDropInsideItem
   * @default false
   */
  allowDropInsideItem?: boolean;
  /**
   * @docid GridBaseOptions.rowDragging.allowReordering
   * @default false
   */
  allowReordering?: boolean;
  /**
   * @docid GridBaseOptions.rowDragging.autoScroll
   * @default true
   */
  autoScroll?: boolean;
  /**
   * @docid GridBaseOptions.rowDragging.boundary
   * @default undefined
   */
  boundary?: string | UserDefinedElement | undefined;
  /**
   * @docid GridBaseOptions.rowDragging.container
   * @default undefined
   */
  container?: string | UserDefinedElement | undefined;
  /**
   * @docid GridBaseOptions.rowDragging.cursorOffset
   */
  cursorOffset?: string | {
    /**
     * @docid GridBaseOptions.rowDragging.cursorOffset.x
     * @default 0
     */
    x?: number;
    /**
     * @docid GridBaseOptions.rowDragging.cursorOffset.y
     * @default 0
     */
    y?: number;
  };
  /**
   * @docid GridBaseOptions.rowDragging.data
   * @default undefined
   */
  data?: any | undefined;
  /**
   * @docid GridBaseOptions.rowDragging.dragDirection
   * @default "both"
   */
  dragDirection?: DragDirection;
  /**
   * @docid GridBaseOptions.rowDragging.dragTemplate
   * @type_function_param1 dragInfo:object
   * @type_function_param1_field itemData:any
   * @type_function_return string|Element|jQuery
   * @default undefined
   */
  dragTemplate?: template | ((dragInfo: RowDraggingTemplateData<TRowData>, containerElement: DxElement) => string | UserDefinedElement) | undefined;
  /**
   * @docid GridBaseOptions.rowDragging.dropFeedbackMode
   * @default "indicate"
   */
  dropFeedbackMode?: DragHighlight;
  /**
   * @docid GridBaseOptions.rowDragging.filter
   * @deprecated
   * @default "> *"
   */
  filter?: string;
  /**
   * @docid GridBaseOptions.rowDragging.group
   * @default undefined
   */
  group?: string | undefined;
  /**
   * @docid GridBaseOptions.rowDragging.handle
   * @default ""
   */
  handle?: string;
  /**
   * @docid GridBaseOptions.rowDragging.onAdd
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field event:event
   * @type_function_param1_field itemData:any
   * @type_function_param1_field fromComponent:dxSortable|dxDraggable
   * @type_function_param1_field toComponent:dxSortable|dxDraggable
   */
  onAdd?: ((e: ReducedNativeEventInfo<TComponent> & RowDraggingEventInfo<TRowData> & DragDropInfo) => void);
  /**
   * @docid GridBaseOptions.rowDragging.onDragChange
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field event:event
   * @type_function_param1_field itemData:any
   * @type_function_param1_field fromComponent:dxSortable|dxDraggable
   * @type_function_param1_field toComponent:dxSortable|dxDraggable
   */
  onDragChange?: ((e: Cancelable & ReducedNativeEventInfo<TComponent> & RowDraggingEventInfo<TRowData> & DragDropInfo) => void);
  /**
   * @docid GridBaseOptions.rowDragging.onDragEnd
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field event:event
   * @type_function_param1_field itemData:any
   * @type_function_param1_field fromComponent:dxSortable|dxDraggable
   * @type_function_param1_field toComponent:dxSortable|dxDraggable
   */
  onDragEnd?: ((e: Cancelable & ReducedNativeEventInfo<TComponent> & RowDraggingEventInfo<TRowData> & DragDropInfo) => void);
  /**
   * @docid GridBaseOptions.rowDragging.onDragMove
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field event:event
   * @type_function_param1_field itemData:any
   * @type_function_param1_field fromComponent:dxSortable|dxDraggable
   * @type_function_param1_field toComponent:dxSortable|dxDraggable
   */
  onDragMove?: ((e: Cancelable & ReducedNativeEventInfo<TComponent> & RowDraggingEventInfo<TRowData> & DragDropInfo) => void);
  /**
   * @docid GridBaseOptions.rowDragging.onDragStart
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field event:event
   * @type_function_param1_field itemData:any
   */
  onDragStart?: ((e: Cancelable & ReducedNativeEventInfo<TComponent> & DragStartEventInfo<TRowData>) => void);
  /**
   * @docid GridBaseOptions.rowDragging.onRemove
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field event:event
   * @type_function_param1_field itemData:any
   * @type_function_param1_field fromComponent:dxSortable|dxDraggable
   * @type_function_param1_field toComponent:dxSortable|dxDraggable
   */
  onRemove?: ((e: ReducedNativeEventInfo<TComponent> & RowDraggingEventInfo<TRowData>) => void);
  /**
   * @docid GridBaseOptions.rowDragging.onReorder
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field event:event
   * @type_function_param1_field itemData:any
   * @type_function_param1_field promise:Promise<void>
   * @type_function_param1_field fromComponent:dxSortable|dxDraggable
   * @type_function_param1_field toComponent:dxSortable|dxDraggable
   */
  onReorder?: ((e: ReducedNativeEventInfo<TComponent> & RowDraggingEventInfo<TRowData> & DragReorderInfo) => void);
  /**
   * @docid GridBaseOptions.rowDragging.scrollSensitivity
   * @default 60
   */
  scrollSensitivity?: number;
  /**
   * @docid GridBaseOptions.rowDragging.scrollSpeed
   * @default 30
   */
  scrollSpeed?: number;
  /**
   * @docid GridBaseOptions.rowDragging.showDragIcons
   * @default true
   */
  showDragIcons?: boolean;
};

/**
 * @namespace DevExpress.common.grids
 */
export interface RowDraggingEventInfo<TRowData = any> {
  readonly itemData?: TRowData;
  readonly itemElement: DxElement;
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly fromComponent: Sortable | Draggable;
  readonly toComponent: Sortable | Draggable;
  readonly fromData?: any;
  readonly toData?: any;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type RowDraggingTemplateData<TRowData = any> = {
  readonly itemData: TRowData;
  readonly itemElement: DxElement;
};

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export type RowInsertedInfo<TRowData = any, TKey = any> = {
  /**
   * @docid
   * @type object
   */
  readonly data: TRowData;
  /** @docid */
  readonly key: TKey;
  /** @docid */
  readonly error: Error;
};

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export type RowInsertingInfo<TRowData = any> = {
  /**
   * @docid
   * @type object
   */
  data: TRowData;
  /**
   * @docid
   * @type boolean|Promise<boolean>|Promise<void>
   */
  cancel: boolean | PromiseLike<boolean> | PromiseLike<void>;
};

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export type RowKeyInfo<TKey = any> = {
  /** @docid */
  readonly key: TKey;
};

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export interface RowRemovedInfo<TRowData = any, TKey = any> {
  /**
   * @docid
   * @type object
   */
  readonly data: TRowData;
  /** @docid */
  readonly key: TKey;
  /** @docid */
  readonly error: Error;
}

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export interface RowRemovingInfo<TRowData = any, TKey = any> {
  /**
   * @docid
   * @type object
   */
  readonly data: TRowData;
  /** @docid */
  readonly key: TKey;
  /**
   * @docid
   * @type boolean|Promise<boolean>|Promise<void>
   */
  cancel: boolean | PromiseLike<boolean> | PromiseLike<void>;
}

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export interface RowUpdatedInfo<TRowData = any, TKey = any> {
  /**
   * @docid
   * @type object
   */
  readonly data: TRowData;
  /** @docid */
  readonly key: TKey;
  /** @docid */
  readonly error: Error;
}

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export interface RowUpdatingInfo<TRowData = any, TKey = any> {
  /**
   * @docid
   * @type object
   */
  readonly oldData: TRowData;
  /**
   * @docid
   * @type object
   */
  newData: DeepPartial<TRowData>;
  /** @docid */
  readonly key: TKey;
  /**
   * @docid
   * @type boolean|Promise<boolean>|Promise<void>
   */
  cancel: boolean | PromiseLike<boolean> | PromiseLike<void>;
}

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export interface RowValidatingInfo<TRowData = any, TKey = any> {
  /** @docid */
  readonly brokenRules: Array<ValidationRule>;
  /** @docid */
  isValid: boolean;
  /** @docid */
  readonly key: TKey;
  /**
   * @docid
   * @type object
   */
  readonly newData: DeepPartial<TRowData>;
  /**
   * @docid
   * @type object
   */
  /** @docid */
  readonly oldData: TRowData;
  /** @docid */
  errorText: string;
  /**
   * @docid
   * @type Promise<void>
   */
  promise?: PromiseLike<void>;
}

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export interface SavingInfo<TRowData = any, TKey = any> {
  /**
   * @docid
   * @type Array<DataChange>
   */
  changes: Array<DataChange<TRowData, TKey>>;
  /**
   * @docid
   * @type Promise<void>
   */
  promise?: PromiseLike<void>;
  /** @docid */
  cancel: boolean;
}

/**
 * @hidden
 * @docid
 * @namespace DevExpress.common.grids
 */
export interface ScrollingBase {
  /**
   * @docid GridBaseOptions.scrolling.columnRenderingMode
   * @default "standard"
   * @public
   */
  columnRenderingMode?: DataRenderMode;
  /**
   * @docid GridBaseOptions.scrolling.preloadEnabled
   * @default false
   * @public
   */
  preloadEnabled?: boolean;
  /**
   * @docid GridBaseOptions.scrolling.rowRenderingMode
   * @default "standard"
   * @public
   */
  rowRenderingMode?: DataRenderMode;
  /**
   * @docid GridBaseOptions.scrolling.scrollByContent
   * @default true
   * @default false &for(non-touch_devices)
   * @public
   */
  scrollByContent?: boolean;
  /**
   * @docid GridBaseOptions.scrolling.scrollByThumb
   * @default false
   * @public
   */
  scrollByThumb?: boolean;
  /**
   * @docid GridBaseOptions.scrolling.showScrollbar
   * @default 'onHover' &for(desktop)
   * @default 'onScroll'
   * @public
   */
  showScrollbar?: ScrollbarMode;
  /**
   * @docid GridBaseOptions.scrolling.useNative
   * @default "auto"
   * @public
   */
  useNative?: boolean | Mode;
  /**
   * @docid GridBaseOptions.scrolling.renderAsync
   * @default undefined
   * @public
   */
  renderAsync?: boolean | undefined;
}

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type SearchPanel = {
  /**
   * @docid GridBaseOptions.searchPanel.highlightCaseSensitive
   * @default false
   */
  highlightCaseSensitive?: boolean;
  /**
   * @docid GridBaseOptions.searchPanel.highlightSearchText
   * @default true
   */
  highlightSearchText?: boolean;
  /**
   * @docid GridBaseOptions.searchPanel.placeholder
   * @default "Search..."
   */
  placeholder?: string;
  /**
   * @docid GridBaseOptions.searchPanel.searchVisibleColumnsOnly
   * @default false
   */
  searchVisibleColumnsOnly?: boolean;
  /**
   * @docid GridBaseOptions.searchPanel.text
   * @default ""
   * @fires GridBaseOptions.onOptionChanged
   */
  text?: string;
  /**
   * @docid GridBaseOptions.searchPanel.visible
   * @default false
   */
  visible?: boolean;
  /**
   * @docid GridBaseOptions.searchPanel.width
   * @default 160
   */
  width?: string | number;
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type SelectedFilterOperation = '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';

/**
 * @hidden
 * @docid
 * @namespace DevExpress.common.grids
 */
export interface SelectionBase {
  /**
   * @docid GridBaseOptions.selection.allowSelectAll
   * @default true
   * @public
   */
  allowSelectAll?: boolean;
  /**
   * @docid GridBaseOptions.selection.mode
   * @default "none"
   * @public
   */
  mode?: SingleMultipleOrNone;
}

/**
 * @docid _common_grids_SelectionChangedInfo
 * @hidden
 * @namespace DevExpress.common.grids
 */
export interface SelectionChangedInfo<TRowData = any, TKey = any> {
  /**
   * @docid _common_grids_SelectionChangedInfo.currentSelectedRowKeys
   * @type Array<any>
   */
  readonly currentSelectedRowKeys: Array<TKey>;
  /**
   * @docid _common_grids_SelectionChangedInfo.currentDeselectedRowKeys
   * @type Array<any>
   */
  readonly currentDeselectedRowKeys: Array<TKey>;
  /**
   * @docid _common_grids_SelectionChangedInfo.selectedRowKeys
   * @type Array<any>
   */
  readonly selectedRowKeys: Array<TKey>;
  /**
   * @docid _common_grids_SelectionChangedInfo.selectedRowsData
   * @type Array<Object>
   */
  readonly selectedRowsData: Array<TRowData>;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type SelectionColumnDisplayMode = 'always' | 'none' | 'onClick' | 'onLongTap';

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type Sorting = {
  /**
   * @docid GridBaseOptions.sorting.ascendingText
   * @default "Sort Ascending"
   */
  ascendingText?: string;
  /**
   * @docid GridBaseOptions.sorting.clearText
   * @default "Clear Sorting"
   */
  clearText?: string;
  /**
   * @docid GridBaseOptions.sorting.descendingText
   * @default "Sort Descending"
   */
  descendingText?: string;
  /**
   * @docid GridBaseOptions.sorting.mode
   * @default "single"
   */
  mode?: SingleMultipleOrNone;
  /**
   * @docid GridBaseOptions.sorting.showSortIndexes
   * @default true
   */
  showSortIndexes?: boolean;
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type StartEditAction = 'click' | 'dblClick';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type StateStoreType = 'custom' | 'localStorage' | 'sessionStorage';

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export type StateStoring = {
  /**
   * @docid GridBaseOptions.stateStoring.customLoad
   * @type Function
   * @type_function_return Promise<Object>
   */
  customLoad?: (() => PromiseLike<any>);
  /**
   * @docid GridBaseOptions.stateStoring.customSave
   * @type_function_param1 gridState:object
   * @type_function_return void
   */
  customSave?: ((gridState: any) => any);
  /**
   * @docid GridBaseOptions.stateStoring.enabled
   * @default false
   */
  enabled?: boolean;
  /**
   * @docid GridBaseOptions.stateStoring.savingTimeout
   * @default 2000
   */
  savingTimeout?: number;
  /**
   * @docid GridBaseOptions.stateStoring.storageKey
   * @default null
   */
  storageKey?: string;
  /**
   * @docid GridBaseOptions.stateStoring.type
   * @default "localStorage"
   */
  type?: StateStoreType;
};

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type SummaryType = 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum';

/**
 * @docid
 * @hidden
 * @namespace DevExpress.common.grids
 */
export interface ToolbarPreparingInfo {
  /**
   * @docid
   * @type dxToolbarOptions
   */
  toolbarOptions: ToolbarProperties;
}

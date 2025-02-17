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
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type AdaptiveDetailRowPreparingInfo = {
  /**
   * 
   */
  readonly formOptions: any;
};

export type ApplyFilterMode = 'auto' | 'onClick';

export type ApplyChangesMode = 'instantly' | 'onDemand';

export type FixedPosition = 'left' | 'right' | 'sticky';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ColumnBase<TRowData = any> {
  /**
   * Aligns the content of the column.
   */
  alignment?: HorizontalAlignment | undefined;
  /**
   * Specifies whether a user can edit values in the column at runtime. By default, inherits the value of the editing.allowUpdating property.
   */
  allowEditing?: boolean;
  /**
   * Specifies whether data can be filtered by this column. Applies only if filterRow.visible is true.
   */
  allowFiltering?: boolean;
  /**
   * Specifies whether a user can fix the column at runtime. Applies only if columnFixing.enabled is true.
   */
  allowFixing?: boolean;
  /**
   * Specifies whether the header filter can be used to filter data by this column. Applies only if headerFilter.visible is true. By default, inherits the value of the allowFiltering property.
   */
  allowHeaderFiltering?: boolean;
  /**
   * Specifies whether a user can hide the column using the column chooser at runtime. Applies only if columnChooser.enabled is true.
   */
  allowHiding?: boolean;
  /**
   * Specifies whether users can reorder this column. Overrides the allowColumnReordering property value.
   */
  allowReordering?: boolean;
  /**
   * Specifies whether a user can resize the column at runtime. Applies only if allowColumnResizing is true.
   */
  allowResizing?: boolean;
  /**
   * Specifies whether this column can be searched. Applies only if searchPanel.visible is true. Inherits the value of the allowFiltering property by default.
   */
  allowSearch?: boolean;
  /**
   * Specifies whether a user can sort rows by this column at runtime. Applies only if sorting.mode differs from &apos;none&apos;.
   */
  allowSorting?: boolean;
  /**
   * Calculates custom cell values. Use this function to create an unbound data column.
   */
  calculateCellValue?: ((this: ColumnBase, rowData: TRowData) => any);
  defaultCalculateCellValue?: this['calculateCellValue'];
  /**
   * Calculates custom display values for column cells. Requires specifying the dataField or calculateCellValue property. Used in lookup optimization.
   */
  calculateDisplayValue?: string | ((this: ColumnBase, rowData: TRowData) => any);
  /**
   * Specifies the column&apos;s custom rules to filter data.
   */
  calculateFilterExpression?: ((this: ColumnBase, filterValue: any, selectedFilterOperation: string | null, target: string) => string | Array<any> | Function);
  defaultCalculateFilterExpression?: this['calculateFilterExpression'];
  /**
   * Calculates custom values used to sort this column.
   */
  calculateSortValue?: string | ((this: ColumnBase, rowData: TRowData) => any);
  /**
   * Specifies a caption for the column.
   */
  caption?: string | undefined;
  /**
   * Specifies a CSS class to be applied to the column.
   */
  cssClass?: string | undefined;
  /**
   * Customizes the text displayed in column cells.
   */
  customizeText?: ((this: ColumnBase, cellInfo: ColumnCustomizeTextArg) => string);
  /**
   * Binds the column to a field of the dataSource.
   */
  dataField?: string | undefined;
  /**
   * Casts column values to a specific data type.
   */
  dataType?: DataType | undefined;
  /**
   * Configures the default UI component used for editing and filtering in the filter row.
   */
  editorOptions?: any;
  /**
   * Specifies whether HTML tags are displayed as plain text or applied to the values of the column.
   */
  encodeHtml?: boolean;
  /**
   * In a boolean column, replaces all false items with a specified text. Applies only if showEditorAlways property is false.
   */
  falseText?: string;
  /**
   * Specifies available filter operations. Applies if allowFiltering is true and the filterRow and/or filterPanel are visible.
   */
  filterOperations?: Array<FilterOperation | string>;
  /**
   * Specifies whether a user changes the current filter by including (selecting) or excluding (clearing the selection of) values. Applies only if headerFilter.visible and allowHeaderFiltering are true.
   */
  filterType?: FilterType;
  /**
   * Specifies the value to display in the filter row.
   */
  filterValue?: any | undefined;
  /**
   * Sets the values in the header filter.
   */
  filterValues?: Array<any>;
  /**
   * Fixes the column.
   */
  fixed?: boolean;
  /**
   * Specifies the column position. Applies only if columns[].fixed is true.
   */
  fixedPosition?: FixedPosition | undefined;
  /**
   * Configures the form item that the column produces in the editing state. Applies only if editing.mode is &apos;form&apos; or &apos;popup&apos;.
   */
  formItem?: SimpleItem;
  /**
   * Formats a value before it is displayed in a column cell.
   */
  format?: Format;
  /**
   * Specifies data settings for the header filter.
   */
  headerFilter?: ColumnHeaderFilter | undefined;
  /**
   * Specifies the order in which columns are hidden when the UI component adapts to the screen or container size. Ignored if allowColumnResizing is `true` and columnResizingMode is &apos;widget&apos;.
   */
  hidingPriority?: number | undefined;
  /**
   * Specifies whether the column organizes other columns into bands.
   */
  isBand?: boolean | undefined;
  /**
   * Specifies properties of a lookup column.
   */
  lookup?: ColumnLookup | undefined;
  /**
   * Specifies the minimum width of the column.
   */
  minWidth?: number | undefined;
  /**
   * Specifies the column&apos;s unique identifier. If not set in code, this value is inherited from the dataField.
   */
  name?: string | undefined;
  /**
   * Specifies the band column that owns the current column. Accepts the index of the band column in the columns array.
   */
  ownerBand?: number | undefined;
  /**
   * Specifies whether to render the column after other columns and elements. Use if column cells have a complex template. Requires the width property specified.
   */
  renderAsync?: boolean;
  /**
   * Specifies a filter operation that applies when users use the filter row to filter the column.
   */
  selectedFilterOperation?: SelectedFilterOperation | undefined;
  /**
   * Specifies a function to be invoked after the user has edited a cell value, but before it is saved in the data source.
   */
  setCellValue?: ((this: ColumnBase, newData: DeepPartial<TRowData>, value: any, currentRowData: TRowData) => void | PromiseLike<void>);
  defaultSetCellValue?: this['setCellValue'];
  /**
   * Specifies whether the column displays its values in editors.
   */
  showEditorAlways?: boolean;
  /**
   * Specifies whether the column chooser can contain the column header.
   */
  showInColumnChooser?: boolean;
  /**
   * Specifies the index according to which columns participate in sorting.
   */
  sortIndex?: number | undefined;
  /**
   * Specifies the sort order of column values.
   */
  sortOrder?: SortOrder | undefined;
  /**
   * Specifies a custom comparison function for sorting. Applies only when sorting is performed on the client.
   */
  sortingMethod?: ((this: ColumnBase, value1: any, value2: any) => number) | undefined;
  /**
   * In a boolean column, replaces all true items with a specified text. Applies only if showEditorAlways property is false.
   */
  trueText?: string;
  /**
   * Specifies validation rules to be checked when cell values are updated.
   */
  validationRules?: Array<ValidationRule>;
  /**
   * Specifies whether the column is visible, that is, occupies space in the table.
   */
  visible?: boolean;
  /**
   * Specifies the position of the column regarding other columns in the resulting UI component.
   */
  visibleIndex?: number | undefined;
  /**
   * Specifies the column&apos;s width in pixels or as a percentage. Ignored if it is less than minWidth.
   */
  width?: number | string | undefined;
}

/**
 * Allows you to customize buttons in the edit column or create a custom command column. Applies only if the column&apos;s type is &apos;buttons&apos;.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ColumnButtonBase {
  /**
   * Specifies a CSS class to be applied to the button.
   */
  cssClass?: string;
  /**
   * Specifies the text for the hint that appears when the button is hovered over or long-pressed.
   */
  hint?: string;
  /**
   * Specifies the button&apos;s icon.
   */
  icon?: string;
  /**
   * Specifies the button&apos;s text. Applies only if the button&apos;s icon is not specified.
   */
  text?: string;
}

/**
 * Configures the column chooser.
 */
export type ColumnChooser = {
  /**
   * Specifies whether searching is enabled in the column chooser.
   * @deprecated Use DataGrid search.enabled or TreeList search.enabled instead.
   */
  allowSearch?: boolean;
  /**
   * Specifies a container in which the column chooser should be rendered.
   */
  container?: string | UserDefinedElement | undefined;
  /**
   * Specifies text displayed by the column chooser when it is empty.
   */
  emptyPanelText?: string;
  /**
   * Specifies whether a user can open the column chooser.
   */
  enabled?: boolean;
  /**
   * Specifies the height of the column chooser.
   */
  height?: number | string;
  /**
   * Specifies how a user manages columns using the column chooser.
   */
  mode?: ColumnChooserMode;
  /**
   * Configures the column chooser&apos;s position.
   */
  position?: PositionConfig | undefined;
  /**
   * Configures the column chooser&apos;s search functionality.
   */
  search?: ColumnChooserSearchConfig;
  /**
   * Specifies a delay in milliseconds between when a user finishes typing in the column chooser&apos;s search panel, and when the search is executed.
   * @deprecated Use DataGrid search.timeout or TreeList search.timeout instead.
   */
  searchTimeout?: number;
  /**
   * Configures column selection functionality within the column chooser.
   */
  selection?: ColumnChooserSelectionConfig;
  /**
   * Specifies the title of the column chooser.
   */
  title?: string;
  /**
   * Specifies the width of the column chooser.
   */
  width?: number | string;
  /**
   * Specifies the sort order of column headers.
   */
  sortOrder?: SortOrder | undefined;
};

export type ColumnChooserMode = 'dragAndDrop' | 'select';

/**
 * Configures the column chooser&apos;s search functionality.
 */
export type ColumnChooserSearchConfig = {
  /**
   * Configures the search box.
   */
  editorOptions?: any;
  /**
   * Specifies whether search is enabled in the column chooser.
   */
  enabled?: boolean;
  /**
   * Specifies a timeout, in milliseconds, during which a user may continue to modify the search value without starting the search operation.
   */
  timeout?: number;
};

/**
 * Configures column selection functionality within the column chooser.
 */
export type ColumnChooserSelectionConfig = {
  /**
   * Specifies whether a &apos;Select All&apos; option is available to users.
   */
  allowSelectAll?: boolean;
  /**
   * Specifies whether selection is recursive.
   */
  recursive?: boolean;
  /**
   * Specifies whether an item becomes selected if a user clicks the item&apos;s label.
   */
  selectByClick?: boolean;
};

export type ColumnCustomizeTextArg = {
  value?: any;
  valueText?: string;
  target?: string;
  groupInterval?: string | number;
};

/**
 * Configures column fixing.
 */
export type ColumnFixing = {
  /**
   * Enables column fixing.
   */
  enabled?: boolean;
  /**
   * Contains properties that specify texts for column fixing commands in the context menu of a column header.
   */
  texts?: ColumnFixingTexts;
  /**
   * Contains properties that specify icons for column fixing commands in the context menu of a column header.
   */
  icons?: ColumnFixingIcons;
};

/**
 * Contains properties that specify texts for column fixing commands in the context menu of a column header.
 */
export type ColumnFixingTexts = {
  /**
   * Specifies text for the context menu item that fixes a column.
   */
  fix?: string;
  /**
   * Specifies text for the context menu subitem that fixes a column to the left edge of the UI component.
   */
  leftPosition?: string;
  /**
   * Specifies text for the context menu subitem that fixes a column to the right edge of the UI component.
   */
  rightPosition?: string;
  /**
   * Specifies text for the context menu item that unfixes a column.
   */
  unfix?: string;
  /**
   * Specifies text for the context menu subitem that enables sticky column behavior.
   */
  stickyPosition?: string;
};

/**
 * Configures column fixing icons.
 */
export type ColumnFixingIcons = {
  /**
   * Specifies an icon for the context menu item that fixes a column.
   */
  fix?: string;
  /**
   * Specifies an icon for the context menu subitem that fixes a column to the left edge of the UI component.
   */
  leftPosition?: string;
  /**
   * Specifies an icon for the context menu subitem that fixes a column to the right edge of the UI component.
   */
  rightPosition?: string;
  /**
   * Specifies an icon for the context menu item that unfixes a column.
   */
  unfix?: string;
  /**
   * Specifies an icon for the context menu subitem that enables sticky column behavior.
   */
  stickyPosition?: string;
};

export type ColumnHeaderFilter = {
  /**
   * Specifies whether searching is enabled in the header filter.
   * @deprecated Use DataGrid search.enabled, TreeList search.enabled, or Gantt search.enabled instead.
   */
  allowSearch?: boolean;
  /**
   * Specifies whether a &apos;Select All&apos; option is available to users.
   */
  allowSelectAll?: boolean;
  /**
   * Specifies the header filter&apos;s data source.
   */
  dataSource?: FilterLookupDataSource<any> | ((options: { component?: any; dataSource?: DataSourceOptions | null }) => void) | undefined;
  /**
   * Specifies how the header filter combines values into groups. Does not apply if you specify a custom header filter data source.
   */
  groupInterval?: HeaderFilterGroupInterval | number | undefined;
  /**
   * Specifies the height of the popup menu containing filtering values.
   */
  height?: number | string | undefined;
  /**
   * Configures the header filter&apos;s search functionality.
   */
  search?: ColumnHeaderFilterSearchConfig;
  /**
   * Specifies a comparison operation used to search header filter values.
   * @deprecated Use DataGrid search.mode, TreeList search.mode, or Gantt search.mode instead.
   */
  searchMode?: SearchMode;
  /**
   * Specifies the width of the popup menu containing filtering values.
   */
  width?: number | string | undefined;
};

/**
 * Configures the header filter&apos;s search.
 */
export type ColumnHeaderFilterSearchConfig = HeaderFilterSearchConfig & {
  /**
   * Specifies a data object&apos;s field name or an expression whose value is compared to the search string.
   */
  searchExpr?: string | Function | Array<string | Function> | undefined;
};

export type ColumnLookup = {
  /**
   * Specifies whether to display the Clear button in lookup column cells while they are being edited.
   */
  allowClearing?: boolean;
  /**
   * Specifies the data source for the lookup column.
   */
  dataSource?: FilterLookupDataSource<any> | ((options: { data?: any; key?: any }) => FilterLookupDataSource<any>) | null | undefined;
  /**
   * Specifies the data source field whose values must be displayed.
   */
  displayExpr?: string | ((data: any) => string) | undefined;
  /**
   * Specifies the data field whose values should be replaced with values from the displayExpr field.
   */
  valueExpr?: string | undefined;
  /**
   * 
   */
  calculateCellValue?: ((rowData: any) => any);
};

export type ColumnResizeMode = 'nextColumn' | 'widget';

/**
 * 
 */
export type DataChange<TRowData = any, TKey = any> = {
  /**
   * The key of the row being created, updated, or removed.
   */
  key: TKey;
  /**
   * Data change type.
   */
  type: DataChangeType;
  /**
   * An object with updated row fields.
   */
  data: DeepPartial<TRowData>;
  /**
   * A key that identifies a record after which a new record should be inserted. Applies only if the type is &apos;insert&apos;.
   */
  insertAfterKey?: TKey;
  /**
   * A key that identifies the record before which a new record should be inserted. Applies only if the type is &apos;insert&apos;.
   */
  insertBeforeKey?: TKey;
};

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DataChangeInfo<TRowData = any, TKey = any> = {
  /**
   * 
   */
  readonly changes: Array<DataChange<TRowData, TKey>>;
};

export type DataChangeType = 'insert' | 'update' | 'remove';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DataErrorOccurredInfo = {
  /**
   * 
   */
  readonly error?: Error;
};

export type DataRenderMode = 'standard' | 'virtual';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DragDropInfo = {
  readonly dropInsideItem: boolean;
};

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type DragReorderInfo = {
  readonly dropInsideItem: boolean;
  promise?: PromiseLike<void>;
};

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface DragStartEventInfo<TRowData = any> {
  itemData?: TRowData;
  readonly itemElement: DxElement;
  readonly fromIndex: number;
  readonly fromData?: any;
}

/**
 * Overriden.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface EditingBase<TRowData = any, TKey = any> {
  /**
   * Specifies if confirmation is required when a user deletes a row.
   */
  confirmDelete?: boolean;
  /**
   * An array of pending row changes.
   */
  changes?: Array<DataChange<TRowData, TKey>>;
  /**
   * The name of a column being edited. Applies only if editing.mode is &apos;cell&apos; or &apos;batch&apos;.
   */
  editColumnName?: string;
  /**
   * The key(s) of a row being edited.
   */
  editRowKey?: TKey;
  /**
   * Configures the form. Used only if editing.mode is &apos;form&apos; or &apos;popup&apos;.
   */
  form?: FormProperties;
  /**
   * Specifies how a user edits data.
   */
  mode?: GridsEditMode;
  /**
   * Configures the popup. Used only if editing.mode is &apos;popup&apos;.
   */
  popup?: PopupProperties;
  /**
   * Specifies operations that are performed after saving changes.
   */
  refreshMode?: GridsEditRefreshMode;
  /**
   * Specifies whether to select text in a cell when a user starts editing.
   */
  selectTextOnEditStart?: boolean;
  /**
   * Specifies whether a single or double click should switch a cell to the editing state. Applies if editing.mode is &apos;cell&apos; or &apos;batch&apos;.
   */
  startEditAction?: StartEditAction;
  /**
   * Contains properties that specify texts for editing-related UI elements.
   */
  texts?: EditingTextsBase;
  /**
   * Specifies whether the edit column uses icons instead of links.
   */
  useIcons?: boolean;
}

/**
 * Contains properties that specify texts for editing-related UI elements.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface EditingTextsBase {
  /**
   * Specifies text for a hint that appears when a user pauses on the global &apos;Add&apos; button. Applies only if editing.allowAdding is true.
   */
  addRow?: string;
  /**
   * Specifies text for a hint that appears when a user pauses on the &apos;Discard&apos; button. Applies only if editing.mode is &apos;batch&apos;.
   */
  cancelAllChanges?: string;
  /**
   * Specifies text for a button that cancels changes in a row. Applies only if editing.allowUpdating is true and editing.mode is &apos;row&apos;, &apos;popup&apos; or &apos;form&apos;.
   */
  cancelRowChanges?: string;
  /**
   * Specifies a message that prompts a user to confirm deletion.
   */
  confirmDeleteMessage?: string;
  /**
   * Specifies a title for the window that asks a user to confirm deletion.
   */
  confirmDeleteTitle?: string;
  /**
   * Specifies text for buttons that delete rows. Applies only if allowDeleting is true.
   */
  deleteRow?: string;
  /**
   * Specifies text for buttons that switch rows into the editing state. Applies only if allowUpdating is true.
   */
  editRow?: string;
  /**
   * Specifies text for a hint that appears when a user pauses on the global &apos;Save&apos; button. Applies only if editing.mode is &apos;batch&apos;.
   */
  saveAllChanges?: string;
  /**
   * Specifies text for a button that saves changes made in a row. Applies only if allowUpdating is true and editing.mode is &apos;row&apos;, &apos;popup&apos; or &apos;form&apos;.
   */
  saveRowChanges?: string;
  /**
   * Specifies text for buttons that recover deleted rows. Applies only if allowDeleting is true and editing.mode is &apos;batch&apos;.
   */
  undeleteRow?: string;
  /**
   * Specifies text for a hint appearing when a user pauses on the button that cancels changes in a cell. Applies only if editing.mode is &apos;cell&apos; and data validation is enabled.
   */
  validationCancelChanges?: string;
}

export type EnterKeyAction = 'startEdit' | 'moveFocus';

export type EnterKeyDirection = 'none' | 'column' | 'row';

export type FilterOperation = '=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | 'anyof' | 'noneof';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface FilterPanelCustomizeTextArg<TComponent> {
  readonly component: TComponent;
  readonly filterValue: any;
  readonly text: string;
}

/**
 * Specifies texts for the filter panel&apos;s elements.
 */
export type FilterPanelTexts = {
  /**
   * The text of the &apos;Clear&apos; link.
   */
  clearFilter?: string;
  /**
   * The text of the &apos;Create Filter&apos; link.
   */
  createFilter?: string;
  /**
   * The hint of the checkbox that applies the filter.
   */
  filterEnabledHint?: string;
};

/**
 * Configures the filter panel.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface FilterPanel<TComponent extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> {
  /**
   * Customizes the filter expression&apos;s text representation.
   */
  customizeText?: ((e: FilterPanelCustomizeTextArg<TComponent>) => string);
  /**
   * Specifies whether the filter expression is applied.
   */
  filterEnabled?: boolean;
  /**
   * Specifies texts for the filter panel&apos;s elements.
   */
  texts?: FilterPanelTexts;
  /**
   * Specifies whether the filter panel is visible.
   */
  visible?: boolean;
}

/**
 * Configures the filter row.
 */
export type FilterRow = {
  /**
   * Specifies when to apply a filter.
   */
  applyFilter?: ApplyFilterMode;
  /**
   * Specifies text for a hint that appears when a user pauses on a button that applies the filter.
   */
  applyFilterText?: string;
  /**
   * Specifies a placeholder for the editor that specifies the end of a range when a user selects the &apos;between&apos; filter operation.
   */
  betweenEndText?: string;
  /**
   * Specifies a placeholder for the editor that specifies the start of a range when a user selects the &apos;between&apos; filter operation.
   */
  betweenStartText?: string;
  /**
   * Specifies descriptions for filter operations on the filter list.
   */
  operationDescriptions?: FilterRowOperationDescriptions;
  /**
   * Specifies text for the reset operation on the filter list.
   */
  resetOperationText?: string;
  /**
   * Specifies text for the item that clears the applied filter. Used only when a cell of the filter row contains a select box.
   */
  showAllText?: string;
  /**
   * Specifies whether icons that open the filter lists are visible.
   */
  showOperationChooser?: boolean;
  /**
   * Specifies whether the filter row is visible.
   */
  visible?: boolean;
};

/**
 * Specifies descriptions for filter operations on the filter list.
 */
export type FilterRowOperationDescriptions = {
  /**
   * A description for the &apos;between&apos; operation.
   */
  between?: string;
  /**
   * A description for the &apos;contains&apos; operation.
   */
  contains?: string;
  /**
   * A description for the &apos;endswith&apos; operation.
   */
  endsWith?: string;
  /**
   * A description for the &apos;=&apos; operation.
   */
  equal?: string;
  /**
   * A description for the &apos;&gt;&apos; operation.
   */
  greaterThan?: string;
  /**
   * A description for the &apos;&gt;=&apos; operation.
   */
  greaterThanOrEqual?: string;
  /**
   * A description for the &apos;&lt;&apos; operation.
   */
  lessThan?: string;
  /**
   * A description for the &apos;&lt;=&apos; operation.
   */
  lessThanOrEqual?: string;
  /**
   * A description for the &apos;notcontains&apos; operation.
   */
  notContains?: string;
  /**
   * A description for the &apos;&lt;&gt;&apos; operation.
   */
  notEqual?: string;
  /**
   * A description for the &apos;startswith&apos; operation.
   */
  startsWith?: string;
};

export type FilterType = 'exclude' | 'include';

/**
 * Configures the header filter feature.
 */
export type HeaderFilter = {
  /**
   * Specifies whether searching is enabled in the header filter.
   * @deprecated Use DataGrid search.enabled or TreeList search.enabled instead.
   */
  allowSearch?: boolean;
  /**
   * Specifies whether a &apos;Select All&apos; option is available to users.
   */
  allowSelectAll?: boolean;
  /**
   * Specifies the height of the popup menu that contains values for filtering.
   */
  height?: number | string;
  /**
   * Configures the header filter&apos;s search box.
   */
  search?: HeaderFilterSearchConfig;
  /**
   * Specifies a delay in milliseconds between when a user finishes typing in the header filter&apos;s search panel, and when the search is executed.
   * @deprecated Use DataGrid search.timeout or TreeList search.timeout instead.
   */
  searchTimeout?: number;
  /**
   * Contains properties that specify text for various elements of the popup menu.
   */
  texts?: HeaderFilterTexts;
  /**
   * Specifies whether header filter icons are visible.
   */
  visible?: boolean;
  /**
   * Specifies the width of the popup menu that contains values for filtering.
   */
  width?: number | string;
};

export type HeaderFilterGroupInterval = 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year';

/**
 * Configures the header filter&apos;s search functionality.
 */
export type HeaderFilterSearchConfig = {
  /**
   * 
   */
  editorOptions?: any;
  /**
   * Specifies whether search UI is enabled in the header filter.
   */
  enabled?: boolean;
  /**
   * Specifies a comparison operation used to search header filter values.
   */
  mode?: SearchMode;
  /**
   * Specifies a timeout, in milliseconds, during which a user may continue to modify the search value without starting the search operation.
   */
  timeout?: number;
};

/**
 * Contains properties that specify text for various elements of the popup menu.
 */
export type HeaderFilterTexts = {
  /**
   * Specifies text for the button that closes the popup menu without applying a filter.
   */
  cancel?: string;
  /**
   * Specifies a name for the item that represents empty values in the popup menu.
   */
  emptyValue?: string;
  /**
   * Specifies text for the button that applies the specified filter.
   */
  ok?: string;
};

/**
 * The base class for UI components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface GridBase<TRowData = any, TKey = any> {
  /**
   * Shows the load panel.
   */
  beginCustomLoading(messageText: string): void;
  /**
   * Gets a data object with a specific key.
   */
  byKey(key: TKey): DxPromise<TRowData>;
  /**
   * Discards changes that a user made to data.
   */
  cancelEditData(): void;
  /**
   * Gets the value of a cell with a specific row index and a data field, column caption or name.
   */
  cellValue(rowIndex: number, dataField: string): any;
  /**
   * Sets a new value to a cell with a specific row index and a data field, column caption or name.
   */
  cellValue(rowIndex: number, dataField: string, value: any): void;
  /**
   * Gets the value of a cell with specific row and column indexes.
   */
  cellValue(rowIndex: number, visibleColumnIndex: number): any;
  /**
   * Sets a new value to a cell with specific row and column indexes.
   */
  cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
  /**
   * Clears all filters applied to UI component rows.
   */
  clearFilter(): void;
  /**
   * Clears all row filters of a specific type.
   */
  clearFilter(filterName: string): void;
  /**
   * Clears selection of all rows on all pages.
   */
  clearSelection(): void;
  /**
   * Clears sorting settings of all columns at once.
   */
  clearSorting(): void;
  /**
   * Switches the cell being edited back to the normal state. Takes effect only if editing.mode is batch or cell and showEditorAlways is false.
   */
  closeEditCell(): void;
  /**
   * Collapses the currently expanded adaptive detail row (if there is one).
   */
  collapseAdaptiveDetailRow(): void;
  /**
   * Gets the data column count. Includes visible and hidden columns, excludes command columns.
   */
  columnCount(): number;
  /**
   * Gets all properties of a column with a specific identifier.
   */
  columnOption(id: number | string): any;
  /**
   * Gets the value of a single column property.
   */
  columnOption(id: number | string, optionName: string): any;
  /**
   * Updates the value of a single column property.
   */
  columnOption(id: number | string, optionName: string, optionValue: any): void;
  /**
   * Updates the values of several column properties.
   */
  columnOption(id: number | string, options: any): void;
  /**
   * Removes a column.
   */
  deleteColumn(id: number | string): void;
  /**
   * Removes a row with a specific index.
   */
  deleteRow(rowIndex: number): void;
  /**
   * Clears the selection of all rows on all pages or the currently rendered page only.
   */
  deselectAll(): DxPromise<void>;
  /**
   * Cancels the selection of rows with specific keys.
   */
  deselectRows(keys: Array<any>): DxPromise<any>;
  /**
   * Switches a cell with a specific row index and a data field to the editing state. Takes effect only if the editing mode is &apos;batch&apos; or &apos;cell&apos;.
   */
  editCell(rowIndex: number, dataField: string): void;
  /**
   * Switches a cell with specific row and column indexes to the editing state. Takes effect only if the editing mode is &apos;batch&apos; or &apos;cell&apos;.
   */
  editCell(rowIndex: number, visibleColumnIndex: number): void;
  /**
   * Switches a row with a specific index to the editing state. Takes effect only if the editing mode is &apos;row&apos;, &apos;popup&apos; or &apos;form&apos;.
   */
  editRow(rowIndex: number): void;
  /**
   * Hides the load panel.
   */
  endCustomLoading(): void;
  /**
   * Expands an adaptive detail row.
   */
  expandAdaptiveDetailRow(key: TKey): void;
  /**
   * Gets a filter expression applied to the UI component&apos;s data source using the filter(filterExpr) method and the DataSource&apos;s filter property.
   */
  filter(): any;
  /**
   * Applies a filter to the dataSource.
   */
  filter(filterExpr: any): void;
  focus(): void;
  /**
   * Sets focus on a specific cell.
   */
  focus(element: UserDefinedElement): void;
  /**
   * Gets a cell with a specific row index and a data field, column caption or name.
   */
  getCellElement(rowIndex: number, dataField: string): DxElement | undefined;
  /**
   * Gets a cell with specific row and column indexes.
   */
  getCellElement(rowIndex: number, visibleColumnIndex: number): DxElement | undefined;
  /**
   * Gets the total filter that combines all the filters applied.
   */
  getCombinedFilter(): any;
  /**
   * Gets the total filter that combines all the filters applied.
   */
  getCombinedFilter(returnDataField: boolean): any;
  getDataSource(): DataSource<TRowData, TKey>;
  /**
   * Gets the key of a row with a specific index.
   */
  getKeyByRowIndex(rowIndex: number): TKey | undefined;
  /**
   * Gets the container of a row with a specific index.
   */
  getRowElement(rowIndex: number): UserDefinedElementsArray | undefined;
  /**
   * Gets the index of a row with a specific key.
   */
  getRowIndexByKey(key: TKey): number;
  /**
   * Gets the instance of the UI component&apos;s scrollable part.
   */
  getScrollable(): Scrollable;
  /**
   * Gets the index of a visible column.
   */
  getVisibleColumnIndex(id: number | string): number;
  /**
   * Checks whether the UI component has unsaved changes.
   */
  hasEditData(): boolean;
  /**
   * Hides the column chooser.
   */
  hideColumnChooser(): void;
  /**
   * Checks whether an adaptive detail row is expanded or collapsed.
   */
  isAdaptiveDetailRowExpanded(key: TKey): boolean;
  /**
   * Checks whether a row with a specific key is focused.
   */
  isRowFocused(key: TKey): boolean;
  /**
   * Checks whether a row with a specific key is selected.
   */
  isRowSelected(key: TKey): boolean;
  /**
   * Gets a data object&apos;s key.
   */
  keyOf(obj: TRowData): TKey;
  /**
   * Navigates to a row with the specified key.
   */
  navigateToRow(key: TKey): DxPromise<void>;
  /**
   * Gets the total page count.
   */
  pageCount(): number;
  /**
   * Gets the current page index.
   */
  pageIndex(): number;
  /**
   * Switches the UI component to a specific page using a zero-based index.
   */
  pageIndex(newIndex: number): DxPromise<void>;
  /**
   * Gets the current page size.
   */
  pageSize(): number;
  /**
   * Sets the page size.
   */
  pageSize(value: number): void;
  /**
   * Reloads data and repaints data rows.
   */
  refresh(): DxPromise<void>;
  /**
   * Reloads data and repaints all or only updated data rows.
   */
  refresh(changesOnly: boolean): DxPromise<void>;
  /**
   * Repaints specific rows.
   */
  repaintRows(rowIndexes: Array<number>): void;
  /**
   * Saves changes that a user made to data.
   */
  saveEditData(): DxPromise<void>;
  /**
   * Seeks a search string in the columns whose allowSearch property is true.
   */
  searchByText(text: string): void;
  /**
   * Selects all rows.
   */
  selectAll(): DxPromise<void>;
  /**
   * Selects rows with specific keys.
   */
  selectRows(keys: Array<TKey>, preserve: boolean): DxPromise<Array<TRowData>>;
  /**
   * Selects rows with specific indexes.
   */
  selectRowsByIndexes(indexes: Array<number>): DxPromise<Array<TRowData>>;
  /**
   * Shows the column chooser.
   */
  showColumnChooser(): void;
  /**
   * Gets the current UI component state.
   */
  state(): any;
  /**
   * Sets the UI component state.
   */
  state(state: any): void;
  /**
   * Recovers a row deleted in batch editing mode.
   */
  undeleteRow(rowIndex: number): void;
  /**
   * Updates the UI component&apos;s content after resizing.
   */
  updateDimensions(): void;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
interface GridBaseOptionsBlank<TComponent extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> extends WidgetOptions<TComponent> {
    /**
     * 
     */
    focusStateEnabled?: any;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GridBaseOptions<TComponent extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> = Omit<GridBaseOptionsBlank<TComponent, TRowData, TKey>, 'focusStateEnabled'> & {
  /**
   * Specifies whether a user can reorder columns.
   */
  allowColumnReordering?: boolean;
  /**
   * Specifies whether a user can resize columns.
   */
  allowColumnResizing?: boolean;
  /**
   * Automatically scrolls the component to the focused row when the focusedRowKey is changed.
   */
  autoNavigateToFocusedRow?: boolean;
  /**
   * Specifies whether data should be cached.
   */
  cacheEnabled?: boolean;
  /**
   * Enables a hint that appears when a user hovers the mouse pointer over a cell with truncated content.
   */
  cellHintEnabled?: boolean;
  /**
   * Specifies whether columns should adjust their widths to the content.
   */
  columnAutoWidth?: boolean;
  /**
   * Configures the column chooser.
   */
  columnChooser?: ColumnChooser;
  /**
   * Configures column fixing.
   */
  columnFixing?: ColumnFixing;
  /**
   * Specifies whether the UI component should hide columns to adapt to the screen or container size. Ignored if allowColumnResizing is true and columnResizingMode is &apos;widget&apos;.
   */
  columnHidingEnabled?: boolean;
  /**
   * Specifies the minimum width of columns.
   */
  columnMinWidth?: number | undefined;
  /**
   * Specifies how the UI component resizes columns. Applies only if allowColumnResizing is true.
   */
  columnResizingMode?: ColumnResizeMode;
  /**
   * Specifies the width for all data columns. Has a lower priority than the column.width property.
   */
  columnWidth?: number | Mode | undefined;
  /**
   * Overridden.
   */
  columns?: Array<ColumnBase<TRowData> | string> | undefined;
  /**
   * Binds the UI component to data.
   */
  dataSource?: DataSourceLike<TRowData, TKey> | null;
  /**
   * Specifies the format in which date-time values should be sent to the server.
   */
  dateSerializationFormat?: string;
  /**
   * Overriden.
   */
  editing?: EditingBase<TRowData, TKey>;
  /**
   * Indicates whether to show the error row.
   */
  errorRowEnabled?: boolean;
  /**
   * Configures the integrated filter builder.
   */
  filterBuilder?: FilterBuilderProperties;
  /**
   * Configures the popup in which the integrated filter builder is shown.
   */
  filterBuilderPopup?: PopupProperties;
  /**
   * Configures the filter panel.
   */
  filterPanel?: FilterPanel<TComponent, TRowData, TKey>;
  /**
   * Configures the filter row.
   */
  filterRow?: FilterRow;
  /**
   * Specifies whether to synchronize the filter row, header filter, and filter builder. The synchronized filter expression is stored in the filterValue property.
   */
  filterSyncEnabled?: boolean | Mode;
  /**
   * Specifies a filter expression.
   */
  filterValue?: string | Array<any> | Function;
  /**
   * The index of the column that contains the focused data cell. This index is taken from the columns array.
   */
  focusedColumnIndex?: number;
  /**
   * Specifies whether the focused row feature is enabled.
   */
  focusedRowEnabled?: boolean;
  /**
   * Specifies or indicates the focused data row&apos;s index.
   */
  focusedRowIndex?: number;
  /**
   * Specifies initially or currently focused grid row&apos;s key.
   */
  focusedRowKey?: TKey | undefined;
  /**
   * Configures the header filter feature.
   */
  headerFilter?: HeaderFilter;
  /**
   * Specifies whether to highlight rows and cells with edited data. repaintChangesOnly should be true.
   */
  highlightChanges?: boolean;
  /**
   * Configures keyboard navigation.
   */
  keyboardNavigation?: KeyboardNavigation;
  /**
   * Configures the load panel.
   */
  loadPanel?: LoadPanel;
  /**
   * Specifies a text string shown when the widget does not display any data.
   */
  noDataText?: string;
  /**
   * A function that is executed before an adaptive detail row is rendered.
   */
  onAdaptiveDetailRowPreparing?: ((e: EventInfo<TComponent> & AdaptiveDetailRowPreparingInfo) => void);
  /**
   * A function that is executed when an error occurs in the data source.
   */
  onDataErrorOccurred?: ((e: EventInfo<TComponent> & DataErrorOccurredInfo) => void);
  /**
   * A function that is executed after row changes are discarded.
   */
  onEditCanceled?: ((e: EventInfo<TComponent> & DataChangeInfo<TRowData, TKey>) => void);
  /**
   * A function that is executed when the edit operation is canceled, but row changes are not yet discarded.
   */
  onEditCanceling?: ((e: Cancelable & EventInfo<TComponent> & DataChangeInfo<TRowData, TKey>) => void);
  /**
   * A function that is executed before a new row is added to the UI component.
   */
  onInitNewRow?: ((e: EventInfo<TComponent> & NewRowInfo<TRowData>) => void);
  /**
   * A function that is executed when the UI component is in focus and a key has been pressed down.
   */
  onKeyDown?: ((e: NativeEventInfo<TComponent, KeyboardEvent> & KeyDownInfo) => void);
  /**
   * A function that is executed after a row is collapsed.
   */
  onRowCollapsed?: ((e: EventInfo<TComponent> & RowKeyInfo<TKey>) => void);
  /**
   * A function that is executed before a row is collapsed.
   */
  onRowCollapsing?: ((e: Cancelable & EventInfo<TComponent> & RowKeyInfo<TKey>) => void);
  /**
   * A function that is executed after a row is expanded.
   */
  onRowExpanded?: ((e: EventInfo<TComponent> & RowKeyInfo<TKey>) => void);
  /**
   * A function that is executed before a row is expanded.
   */
  onRowExpanding?: ((e: Cancelable & EventInfo<TComponent> & RowKeyInfo<TKey>) => void);
  /**
   * A function that is executed after a new row has been inserted into the data source.
   */
  onRowInserted?: ((e: EventInfo<TComponent> & RowInsertedInfo<TRowData, TKey>) => void);
  /**
   * A function that is executed before a new row is inserted into the data source.
   */
  onRowInserting?: ((e: EventInfo<TComponent> & RowInsertingInfo<TRowData>) => void);
  /**
   * A function that is executed after a row has been removed from the data source.
   */
  onRowRemoved?: ((e: EventInfo<TComponent> & RowRemovedInfo<TRowData, TKey>) => void);
  /**
   * A function that is executed before a row is removed from the data source.
   */
  onRowRemoving?: ((e: EventInfo<TComponent> & RowRemovingInfo<TRowData, TKey>) => void);
  /**
   * A function that is executed after a row has been updated in the data source.
   */
  onRowUpdated?: ((e: EventInfo<TComponent> & RowUpdatedInfo<TRowData, TKey>) => void);
  /**
   * A function that is executed before a row is updated in the data source.
   */
  onRowUpdating?: ((e: EventInfo<TComponent> & RowUpdatingInfo<TRowData, TKey>) => void);
  /**
   * A function that is executed after cells in a row are validated against validation rules.
   */
  onRowValidating?: ((e: EventInfo<TComponent> & RowValidatingInfo<TRowData, TKey>) => void);
  /**
   * A function that is executed after row changes are saved.
   */
  onSaved?: ((e: EventInfo<TComponent> & DataChangeInfo<TRowData, TKey>) => void);
  /**
   * A function that is executed before pending row changes are saved.
   */
  onSaving?: ((e: EventInfo<TComponent> & SavingInfo<TRowData, TKey>) => void);
  /**
   * A function that is executed after selecting a row or clearing its selection.
   */
  onSelectionChanged?: ((e: EventInfo<TComponent> & SelectionChangedInfo<TRowData, TKey>) => void);
  /**
   * A function that is executed before the toolbar is created.
   */
  onToolbarPreparing?: ((e: EventInfo<TComponent> & ToolbarPreparingInfo) => void);
  /**
   * Configures the pager.
   */
  pager?: Pager;
  /**
   * Configures paging.
   */
  paging?: PagingBase;
  /**
   * Specifies whether to render the filter row, command columns, and columns with showEditorAlways set to true after other elements.
   */
  renderAsync?: boolean;
  /**
   * Specifies whether to repaint only those cells whose data changed.
   */
  repaintChangesOnly?: boolean;
  /**
   * Specifies whether rows should be shaded differently.
   */
  rowAlternationEnabled?: boolean;
  /**
   * Configures row reordering using drag and drop gestures.
   */
  rowDragging?: RowDragging<TComponent, TRowData, TKey>;
  /**
   * 
   */
  scrolling?: ScrollingBase;
  /**
   * Configures the search panel.
   */
  searchPanel?: SearchPanel;
  /**
   * Allows you to select rows or determine which rows are selected.
   */
  selectedRowKeys?: Array<TKey>;
  /**
   * 
   */
  selection?: SelectionBase;
  /**
   * Specifies whether the outer borders of the UI component are visible.
   */
  showBorders?: boolean;
  /**
   * Specifies whether column headers are visible.
   */
  showColumnHeaders?: boolean;
  /**
   * Specifies whether vertical lines that separate one column from another are visible.
   */
  showColumnLines?: boolean;
  /**
   * Specifies whether horizontal lines that separate one row from another are visible.
   */
  showRowLines?: boolean;
  /**
   * Configures runtime sorting.
   */
  sorting?: Sorting;
  /**
   * Configures state storing.
   */
  stateStoring?: StateStoring;
  /**
   * Specifies whether to enable two-way data binding.
   */
  twoWayBindingEnabled?: boolean;
  /**
   * Specifies whether text that does not fit into a column should be wrapped.
   */
  wordWrapEnabled?: boolean;
  /**
   * Specifies whether to show only relevant values in the header filter and filter row.
   */
  syncLookupFilterValues?: boolean;
};

export type GridsEditMode = 'batch' | 'cell' | 'row' | 'form' | 'popup';

export type GridsEditRefreshMode = 'full' | 'reshape' | 'repaint';

export type GroupExpandMode = 'buttonClick' | 'rowClick';

/**
 * Configures keyboard navigation.
 */
export type KeyboardNavigation = {
  /**
   * Specifies whether users can enter a new cell value on a key press. Applies if editing.mode is &apos;cell&apos; or &apos;batch&apos;.
   */
  editOnKeyPress?: boolean;
  /**
   * Enables keyboard navigation.
   */
  enabled?: boolean;
  /**
   * Specifies whether the Enter key switches the cell or row to the edit state or moves focus in the enterKeyDirection. Applies for all edit modes, except &apos;popup&apos;.
   */
  enterKeyAction?: EnterKeyAction;
  /**
   * Specifies the direction in which to move focus when a user presses Enter. Applies if editing.mode is &apos;cell&apos; or &apos;batch&apos;.
   */
  enterKeyDirection?: EnterKeyDirection;
};

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type KeyDownInfo = {
  /**
   * 
   */
  handled: boolean;
};

/**
 * Configures the load panel.
 */
export type LoadPanel = {
  /**
   * Enables displaying the load panel automatically.
   */
  enabled?: boolean | Mode;
  /**
   * Specifies the height of the load panel in pixels.
   */
  height?: number | string;
  /**
   * Specifies a URL pointing to an image to be used as a loading indicator.
   */
  indicatorSrc?: string;
  /**
   * Specifies whether to shade the UI component when the load panel is shown.
   */
  shading?: boolean;
  /**
   * Specifies the shading color. Applies only if shading is true.
   */
  shadingColor?: string;
  /**
   * Specifies whether to show the loading indicator.
   */
  showIndicator?: boolean;
  /**
   * Specifies whether to show the pane of the load panel.
   */
  showPane?: boolean;
  /**
   * Specifies text displayed on the load panel.
   */
  text?: string;
  /**
   * Specifies the width of the load panel in pixels.
   */
  width?: number | string;
};

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface NewRowInfo<TRowData = any> {
  /**
   * 
   */
  data: TRowData;
  /**
   * 
   */
  promise?: PromiseLike<void>;
}

export type NewRowPosition = 'first' | 'last' | 'pageBottom' | 'pageTop' | 'viewportBottom' | 'viewportTop';

/**
 * Configures the pager.
 */
export type Pager = PagerBase & {
  /**
   * Specifies the available page sizes in the page size selector.
   */
  allowedPageSizes?: Array<(number | PagerPageSize)> | Mode;

  /**
   * Specifies whether the pager is visible.
   */
  visible?: boolean | Mode;
};

/**
 * @deprecated Use DisplayMode from /common instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type PagerDisplayMode = DisplayMode;

export type PagerPageSize = 'all' | 'auto';

/**
 * Configures paging.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface PagingBase {
  /**
   * Enables paging.
   */
  enabled?: boolean;
  /**
   * Specifies the page to be displayed using a zero-based index.
   */
  pageIndex?: number;
  /**
   * Specifies the page size.
   */
  pageSize?: number;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type ReducedNativeEventInfo<TComponent extends GridBase> = Required<Pick<NativeEventInfo<TComponent, PointerEvent | MouseEvent | TouchEvent>, 'component' | 'event'>>;

/**
 * Configures row reordering using drag and drop gestures.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type RowDragging<TComponent extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> = {
  /**
   * Allows users to drop a row inside another row.
   */
  allowDropInsideItem?: boolean;
  /**
   * Allows row reordering using drag and drop gestures.
   */
  allowReordering?: boolean;
  /**
   * Enables automatic scrolling while dragging a row beyond the viewport.
   */
  autoScroll?: boolean;
  /**
   * Specifies a DOM element that limits the dragging area.
   */
  boundary?: string | UserDefinedElement | undefined;
  /**
   * Specifies a custom container in which the draggable row should be rendered.
   */
  container?: string | UserDefinedElement | undefined;
  /**
   * Specifies the cursor offset from the dragged row.
   */
  cursorOffset?: string | {
    /**
     * Specifies the horizontal cursor offset from the dragged row in pixels.
     */
    x?: number;
    /**
     * Specifies the vertical cursor offset from the dragged row in pixels.
     */
    y?: number;
  };
  /**
   * A container for custom data.
   */
  data?: any | undefined;
  /**
   * Specifies the directions in which a row can be dragged.
   */
  dragDirection?: DragDirection;
  /**
   * Specifies custom markup to be shown instead of the item being dragged.
   */
  dragTemplate?: template | ((dragInfo: RowDraggingTemplateData<TRowData>, containerElement: DxElement) => string | UserDefinedElement) | undefined;
  /**
   * Specifies how to highlight the row&apos;s drop position.
   */
  dropFeedbackMode?: DragHighlight;
  /**
   * Specifies a CSS selector for draggable rows.
   * @deprecated 
   */
  filter?: string;
  /**
   * Allows you to group several UI components so that users can drag and drop rows between them.
   */
  group?: string | undefined;
  /**
   * Specifies a CSS selector (ID or class) for the element(s) that should act as the drag handle(s).
   */
  handle?: string;
  /**
   * A function that is called when a new row is added.
   */
  onAdd?: ((e: ReducedNativeEventInfo<TComponent> & RowDraggingEventInfo<TRowData> & DragDropInfo) => void);
  /**
   * A function that is called when the dragged row&apos;s position is changed.
   */
  onDragChange?: ((e: Cancelable & ReducedNativeEventInfo<TComponent> & RowDraggingEventInfo<TRowData> & DragDropInfo) => void);
  /**
   * A function that is called when the drag gesture is finished.
   */
  onDragEnd?: ((e: Cancelable & ReducedNativeEventInfo<TComponent> & RowDraggingEventInfo<TRowData> & DragDropInfo) => void);
  /**
   * A function that is called every time a draggable row is moved.
   */
  onDragMove?: ((e: Cancelable & ReducedNativeEventInfo<TComponent> & RowDraggingEventInfo<TRowData> & DragDropInfo) => void);
  /**
   * A function that is called when the drag gesture is initialized.
   */
  onDragStart?: ((e: Cancelable & ReducedNativeEventInfo<TComponent> & DragStartEventInfo<TRowData>) => void);
  /**
   * A function that is called when a draggable row is removed.
   */
  onRemove?: ((e: ReducedNativeEventInfo<TComponent> & RowDraggingEventInfo<TRowData>) => void);
  /**
   * A function that is called when the draggable rows are reordered.
   */
  onReorder?: ((e: ReducedNativeEventInfo<TComponent> & RowDraggingEventInfo<TRowData> & DragReorderInfo) => void);
  /**
   * Specifies the distance in pixels from the edge of viewport at which scrolling should start. Applies only if autoScroll is true.
   */
  scrollSensitivity?: number;
  /**
   * Specifies the scrolling speed when dragging a row beyond the viewport. Applies only if autoScroll is true.
   */
  scrollSpeed?: number;
  /**
   * Shows or hides row dragging icons.
   */
  showDragIcons?: boolean;
};

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
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

export type RowDraggingTemplateData<TRowData = any> = {
  readonly itemData: TRowData;
  readonly itemElement: DxElement;
};

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type RowInsertedInfo<TRowData = any, TKey = any> = {
  /**
   * 
   */
  readonly data: TRowData;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  readonly error: Error;
};

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type RowInsertingInfo<TRowData = any> = {
  /**
   * 
   */
  data: TRowData;
  /**
   * 
   */
  cancel: boolean | PromiseLike<boolean> | PromiseLike<void>;
};

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type RowKeyInfo<TKey = any> = {
  /**
   * 
   */
  readonly key: TKey;
};

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface RowRemovedInfo<TRowData = any, TKey = any> {
  /**
   * 
   */
  readonly data: TRowData;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  readonly error: Error;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface RowRemovingInfo<TRowData = any, TKey = any> {
  /**
   * 
   */
  readonly data: TRowData;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  cancel: boolean | PromiseLike<boolean> | PromiseLike<void>;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface RowUpdatedInfo<TRowData = any, TKey = any> {
  /**
   * 
   */
  readonly data: TRowData;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  readonly error: Error;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface RowUpdatingInfo<TRowData = any, TKey = any> {
  /**
   * 
   */
  readonly oldData: TRowData;
  /**
   * 
   */
  newData: DeepPartial<TRowData>;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  cancel: boolean | PromiseLike<boolean> | PromiseLike<void>;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface RowValidatingInfo<TRowData = any, TKey = any> {
  /**
   * 
   */
  readonly brokenRules: Array<ValidationRule>;
  /**
   * 
   */
  isValid: boolean;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  readonly newData: DeepPartial<TRowData>;
  /**
   * @docid
   * @type object
   */
  /**
   * 
   */
  readonly oldData: TRowData;
  /**
   * 
   */
  errorText: string;
  /**
   * 
   */
  promise?: PromiseLike<void>;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface SavingInfo<TRowData = any, TKey = any> {
  /**
   * 
   */
  changes: Array<DataChange<TRowData, TKey>>;
  /**
   * 
   */
  promise?: PromiseLike<void>;
  /**
   * 
   */
  cancel: boolean;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ScrollingBase {
  /**
   * Specifies the rendering mode for columns. Applies when columns are left outside the viewport. Requires the columnWidth, columnAutoWidth, or width (for all columns) property specified.
   */
  columnRenderingMode?: DataRenderMode;
  /**
   * Specifies whether the UI component should load adjacent pages. Applies only if scrolling.mode is &apos;virtual&apos; or &apos;infinite&apos;.
   */
  preloadEnabled?: boolean;
  /**
   * Specifies the rendering mode for loaded rows.
   */
  rowRenderingMode?: DataRenderMode;
  /**
   * Specifies whether a user can scroll the content with a swipe gesture. Applies only if useNative is false.
   */
  scrollByContent?: boolean;
  /**
   * Specifies whether a user can scroll the content with the scrollbar. Applies only if useNative is false.
   */
  scrollByThumb?: boolean;
  /**
   * Specifies when to show scrollbars. Applies only if useNative is false.
   */
  showScrollbar?: ScrollbarMode;
  /**
   * Specifies whether the widget should use native or simulated scrolling.
   */
  useNative?: boolean | Mode;
  /**
   * Specifies whether to render rows after a user stops scrolling or at the same time as the user scrolls the widget.
   */
  renderAsync?: boolean | undefined;
}

/**
 * Configures the search panel.
 */
export type SearchPanel = {
  /**
   * Notifies the UI component whether search is case-sensitive to ensure that search results are highlighted correctly. Applies only if highlightSearchText is true.
   */
  highlightCaseSensitive?: boolean;
  /**
   * Specifies whether found substrings should be highlighted.
   */
  highlightSearchText?: boolean;
  /**
   * Specifies a placeholder for the search panel.
   */
  placeholder?: string;
  /**
   * Specifies whether the UI component should search against all columns or only visible ones.
   */
  searchVisibleColumnsOnly?: boolean;
  /**
   * Sets a search string for the search panel.
   */
  text?: string;
  /**
   * Specifies whether the search panel is visible or not.
   */
  visible?: boolean;
  /**
   * Specifies the width of the search panel in pixels.
   */
  width?: string | number;
};

export type SelectedFilterOperation = '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface SelectionBase {
  /**
   * Allows users to simultaneously select all or current page rows (depending on the selectAllMode).
   */
  allowSelectAll?: boolean;
  /**
   * Specifies the selection mode.
   */
  mode?: SingleMultipleOrNone;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface SelectionChangedInfo<TRowData = any, TKey = any> {
  /**
   * 
   */
  readonly currentSelectedRowKeys: Array<TKey>;
  /**
   * 
   */
  readonly currentDeselectedRowKeys: Array<TKey>;
  /**
   * 
   */
  readonly selectedRowKeys: Array<TKey>;
  /**
   * 
   */
  readonly selectedRowsData: Array<TRowData>;
}

export type SelectionColumnDisplayMode = 'always' | 'none' | 'onClick' | 'onLongTap';

/**
 * Configures runtime sorting.
 */
export type Sorting = {
  /**
   * Specifies text for the context menu item that sets an ascending sort order in a column.
   */
  ascendingText?: string;
  /**
   * Specifies text for the context menu item that clears sorting settings for a column.
   */
  clearText?: string;
  /**
   * Specifies text for the context menu item that sets a descending sort order in a column.
   */
  descendingText?: string;
  /**
   * Specifies the sorting mode.
   */
  mode?: SingleMultipleOrNone;
  /**
   * Specifies whether to display sort indexes in column headers. Applies only when sorting.mode is &apos;multiple&apos; and data is sorted by two or more columns.
   */
  showSortIndexes?: boolean;
};

export type StartEditAction = 'click' | 'dblClick';

export type StateStoreType = 'custom' | 'localStorage' | 'sessionStorage';

/**
 * Configures state storing.
 */
export type StateStoring = {
  /**
   * Specifies a function that is executed on state loading. Applies only if the type is &apos;custom&apos;.
   */
  customLoad?: (() => PromiseLike<any>);
  /**
   * Specifies a function that is executed on state change. Applies only if the type is &apos;custom&apos;.
   */
  customSave?: ((gridState: any) => any);
  /**
   * Enables state storing.
   */
  enabled?: boolean;
  /**
   * Specifies the delay in milliseconds between when a user makes a change and when this change is saved.
   */
  savingTimeout?: number;
  /**
   * Specifies the key for storing the UI component state.
   */
  storageKey?: string;
  /**
   * Specifies the type of storage where the state is saved.
   */
  type?: StateStoreType;
};

export type SummaryType = 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ToolbarPreparingInfo {
  /**
   * 
   */
  toolbarOptions: ToolbarProperties;
}

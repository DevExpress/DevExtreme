import { Controllers, ViewController, Views } from '../module_types';

interface State {
  _hiddenColumns: any;
  _$itemContents: any;
  _form: any;
  _hidingColumnsQueue: any;

  _columnsController: Controllers['columns'];
  _dataController: Controllers['data'];
  _editingController: Controllers['editing'];
  _rowsView: Views['rowsView'];
}

export interface AdaptiveColumnsController extends ViewController, State {
  _isRowEditMode: (this: this) => any;

  _isItemModified: (this: this, item, cellOptions) => any;

  _renderFormViewTemplate: (this: this, item, cellOptions, $container) => any;

  _getTemplate: (this: this, ...args: any[]) => any;

  _isVisibleColumnsValid: (this: this, visibleColumns) => any;

  _calculatePercentWidths: (this: this, widths, visibleColumns) => any;

  _isPercentWidth: (this: this, width) => any;

  _isColumnHidden: (this: this, column) => any;

  _getAverageColumnsWidth: (this: this, containerWidth, columns, columnsCanFit) => any;

  _calculateColumnWidth: (this: this, column, containerWidth, contentColumns, columnsCanFit) => any;

  _calculatePercentWidth: (this: this, options) => any;

  _getNotTruncatedColumnWidth: (this: this, column, containerWidth, contentColumns, columnsCanFit) => any;

  _getItemPercentWidth: (this: this, item) => any;

  _getCommandColumnsWidth: (this: this) => any;

  _isItemEdited: (this: this, item) => any;

  _getFormItemsByHiddenColumns: (this: this, hiddenColumns) => any;

  _getAdaptiveColumnVisibleIndex: (this: this, visibleColumns) => any;

  _hideAdaptiveColumn: (this: this, resultWidths, visibleColumns) => any;

  _showHiddenCellsInView: (this: this, options: any) => any;

  _showHiddenColumns: (this: this) => any;

  _isCellValid: (this: this, $cell) => any;

  _hideVisibleColumn: (this: this, options: any) => any;

  _hideVisibleColumnInView: (this: this, { view, isCommandColumn, visibleIndex }) => any;

  _findCellElementInRow: (this: this, $rowElement, visibleColumnIndex) => any;

  _hideVisibleCellInView: (this: this, options: any) => any;

  _getEditMode: (this: this) => any;

  isFormOrPopupEditMode: (this: this) => any;

  hideRedundantColumns: (this: this, resultWidths, visibleColumns, hiddenQueue) => any;

  getItemContentByColumnIndex: (this: this, visibleColumnIndex) => any;

  toggleExpandAdaptiveDetailRow: (this: this, key?, alwaysExpanded?) => any;

  createFormByHiddenColumns: (this: this, container, options) => any;

  hasAdaptiveDetailRowExpanded: (this: this) => any;

  updateForm: (this: this, hiddenColumns) => any;

  updateHidingQueue: (this: this, columns) => any;

  getHiddenColumns: (this: this) => any;

  hasHiddenColumns: (this: this) => any;

  getHidingColumnsQueue: (this: this) => any;

  isAdaptiveDetailRowExpanded: (this: this, key) => any;

  expandAdaptiveDetailRow: (this: this, key) => any;

  collapseAdaptiveDetailRow: (this: this) => any;

  updateCommandAdaptiveAriaLabel: (this: this, key, label) => any;

  setCommandAdaptiveAriaLabel: (this: this, $row, labelName) => any;

  getAdaptiveDetailItems: (this: this, ...args: any[]) => any;
}

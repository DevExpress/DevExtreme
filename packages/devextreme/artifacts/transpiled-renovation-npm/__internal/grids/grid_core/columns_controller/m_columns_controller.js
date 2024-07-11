"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.columnsControllerModule = exports.ColumnsController = void 0;
var _config = _interopRequireDefault(require("../../../../core/config"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _callbacks = _interopRequireDefault(require("../../../../core/utils/callbacks"));
var _data = require("../../../../core/utils/data");
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _inflector = require("../../../../core/utils/inflector");
var _iterator = require("../../../../core/utils/iterator");
var _object = require("../../../../core/utils/object");
var _type = require("../../../../core/utils/type");
var _variable_wrapper = _interopRequireDefault(require("../../../../core/utils/variable_wrapper"));
var _abstract_store = _interopRequireDefault(require("../../../../data/abstract_store"));
var _data_source = require("../../../../data/data_source/data_source");
var _utils = require("../../../../data/data_source/utils");
var _date = _interopRequireDefault(require("../../../../localization/date"));
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _filtering = _interopRequireDefault(require("../../../../ui/shared/filtering"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.errors"));
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _const = require("./const");
var _m_columns_controller_utils = require("./m_columns_controller_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class ColumnsController extends _m_modules.default.Controller {
  init(isApplyingUserState) {
    this._dataController = this.getController('data');
    this._focusController = this.getController('focus');
    this._stateStoringController = this.getController('stateStoring');
    const columns = this.option('columns');
    this._commandColumns = this._commandColumns || [];
    this._columns = this._columns || [];
    this._isColumnsFromOptions = !!columns;
    if (this._isColumnsFromOptions) {
      (0, _m_columns_controller_utils.assignColumns)(this, columns ? (0, _m_columns_controller_utils.createColumnsFromOptions)(this, columns) : []);
      (0, _m_columns_controller_utils.applyUserState)(this);
    } else {
      (0, _m_columns_controller_utils.assignColumns)(this, this._columnsUserState ? (0, _m_columns_controller_utils.createColumnsFromOptions)(this, this._columnsUserState) : this._columns);
    }
    (0, _m_columns_controller_utils.addExpandColumn)(this);
    if (this._dataSourceApplied) {
      this.applyDataSource(this._dataSource, true, isApplyingUserState);
    } else {
      (0, _m_columns_controller_utils.updateIndexes)(this);
    }
    this._checkColumns();
  }
  _getExpandColumnOptions() {
    return {
      type: 'expand',
      command: 'expand',
      width: 'auto',
      cssClass: _const.COMMAND_EXPAND_CLASS,
      allowEditing: false,
      allowGrouping: false,
      allowSorting: false,
      allowResizing: false,
      allowReordering: false,
      allowHiding: false
    };
  }
  _getFirstItems(dataSource) {
    let groupsCount;
    let items = [];
    const getFirstItemsCore = function (items, groupsCount) {
      if (!items || !groupsCount) {
        return items;
      }
      for (let i = 0; i < items.length; i++) {
        const childItems = getFirstItemsCore(items[i].items || items[i].collapsedItems, groupsCount - 1);
        if (childItems && childItems.length) {
          return childItems;
        }
      }
    };
    if (dataSource && dataSource.items().length > 0) {
      groupsCount = _m_utils.default.normalizeSortingInfo(dataSource.group()).length;
      items = getFirstItemsCore(dataSource.items(), groupsCount) || [];
    }
    return items;
  }
  _endUpdateCore() {
    !this._skipProcessingColumnsChange && (0, _m_columns_controller_utils.fireColumnsChanged)(this);
  }
  callbackNames() {
    return ['columnsChanged'];
  }
  getColumnByPath(path, columns) {
    const that = this;
    let column;
    const columnIndexes = [];
    path.replace(_const.COLUMN_OPTION_REGEXP, (_, columnIndex) => {
      // eslint-disable-next-line radix
      columnIndexes.push(parseInt(columnIndex));
      return '';
    });
    if (columnIndexes.length) {
      if (columns) {
        column = columnIndexes.reduce((column, index) => column && column.columns && column.columns[index], {
          columns
        });
      } else {
        column = (0, _m_columns_controller_utils.getColumnByIndexes)(that, columnIndexes);
      }
    }
    return column;
  }
  optionChanged(args) {
    let needUpdateRequireResize;
    switch (args.name) {
      case 'adaptColumnWidthByRatio':
        args.handled = true;
        break;
      case 'dataSource':
        if (args.value !== args.previousValue && !this.option('columns') && (!Array.isArray(args.value) || !Array.isArray(args.previousValue))) {
          this._columns = [];
        }
        break;
      case 'columns':
        needUpdateRequireResize = this._skipProcessingColumnsChange;
        args.handled = true;
        if (!this._skipProcessingColumnsChange) {
          if (args.name === args.fullName) {
            this._columnsUserState = null;
            this._ignoreColumnOptionNames = null;
            this.init();
          } else {
            this._columnOptionChanged(args);
            needUpdateRequireResize = true;
          }
        }
        if (needUpdateRequireResize) {
          this._updateRequireResize(args);
        }
        break;
      case 'commonColumnSettings':
      case 'columnAutoWidth':
      case 'allowColumnResizing':
      case 'allowColumnReordering':
      case 'columnFixing':
      case 'grouping':
      case 'groupPanel':
      case 'regenerateColumnsByVisibleItems':
      case 'customizeColumns':
      case 'columnHidingEnabled':
      case 'dateSerializationFormat':
      case 'columnResizingMode':
      case 'columnMinWidth':
      case 'columnWidth':
        {
          args.handled = true;
          const ignoreColumnOptionNames = args.fullName === 'columnWidth' && ['width'];
          this.reinit(ignoreColumnOptionNames);
          break;
        }
      case 'rtlEnabled':
        this.reinit();
        break;
      default:
        super.optionChanged(args);
    }
  }
  _columnOptionChanged(args) {
    let columnOptionValue = {};
    const column = this.getColumnByPath(args.fullName);
    const columnOptionName = args.fullName.replace(_const.COLUMN_OPTION_REGEXP, '');
    if (column) {
      if (columnOptionName) {
        columnOptionValue[columnOptionName] = args.value;
      } else {
        columnOptionValue = args.value;
      }
      this._skipProcessingColumnsChange = args.fullName;
      this.columnOption(column.index, columnOptionValue);
      this._skipProcessingColumnsChange = false;
    }
  }
  _updateRequireResize(args) {
    const {
      component
    } = this;
    if (args.fullName.replace(_const.COLUMN_OPTION_REGEXP, '') === 'width' && component._updateLockCount) {
      component._requireResize = true;
    }
  }
  publicMethods() {
    return ['addColumn', 'deleteColumn', 'columnOption', 'columnCount', 'clearSorting', 'clearGrouping', 'getVisibleColumns', 'getVisibleColumnIndex'];
  }
  applyDataSource(dataSource, forceApplying, isApplyingUserState) {
    const that = this;
    const isDataSourceLoaded = dataSource && dataSource.isLoaded();
    that._dataSource = dataSource;
    if (!that._dataSourceApplied || that._dataSourceColumnsCount === 0 || forceApplying || that.option('regenerateColumnsByVisibleItems')) {
      if (isDataSourceLoaded) {
        if (!that._isColumnsFromOptions) {
          const columnsFromDataSource = (0, _m_columns_controller_utils.createColumnsFromDataSource)(that, dataSource);
          if (columnsFromDataSource.length) {
            (0, _m_columns_controller_utils.assignColumns)(that, columnsFromDataSource);
            that._dataSourceColumnsCount = that._columns.length;
            (0, _m_columns_controller_utils.applyUserState)(that);
          }
        }
        return that.updateColumns(dataSource, forceApplying, isApplyingUserState);
      }
      that._dataSourceApplied = false;
      (0, _m_columns_controller_utils.updateIndexes)(that);
    } else if (isDataSourceLoaded && !that.isAllDataTypesDefined(true) && that.updateColumnDataTypes(dataSource)) {
      (0, _m_columns_controller_utils.updateColumnChanges)(that, 'columns');
      (0, _m_columns_controller_utils.fireColumnsChanged)(that);
      // @ts-expect-error
      return new _deferred.Deferred().reject().promise();
    }
  }
  reset() {
    this._dataSource = null;
    this._dataSourceApplied = false;
    this._dataSourceColumnsCount = undefined;
    this.reinit();
  }
  /**
   * @extended: virtual_columns
   * @private
   */
  resetColumnsCache() {
    const that = this;
    that._visibleColumns = undefined;
    that._fixedColumns = undefined;
    that._rowCount = undefined;
    (0, _m_columns_controller_utils.resetBandColumnsCache)(that);
  }
  reinit(ignoreColumnOptionNames) {
    this._columnsUserState = this.getUserState();
    this._ignoreColumnOptionNames = ignoreColumnOptionNames || null;
    this.init();
    if (ignoreColumnOptionNames) {
      this._ignoreColumnOptionNames = null;
    }
  }
  isInitialized() {
    return !!this._columns.length || !!this.option('columns');
  }
  isDataSourceApplied() {
    return this._dataSourceApplied;
  }
  getCommonSettings(column) {
    const commonColumnSettings = (!column || !column.type) && this.option('commonColumnSettings') || {};
    const groupingOptions = this.option('grouping') ?? {};
    const groupPanelOptions = this.option('groupPanel') ?? {};
    return (0, _extend.extend)({
      allowFixing: this.option('columnFixing.enabled'),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      allowResizing: this.option('allowColumnResizing') || undefined,
      allowReordering: this.option('allowColumnReordering'),
      minWidth: this.option('columnMinWidth'),
      width: this.option('columnWidth'),
      autoExpandGroup: groupingOptions.autoExpandAll,
      allowCollapsing: groupingOptions.allowCollapsing,
      allowGrouping: groupPanelOptions.allowColumnDragging && groupPanelOptions.visible || groupingOptions.contextMenuEnabled
    }, commonColumnSettings);
  }
  isColumnOptionUsed(optionName) {
    for (let i = 0; i < this._columns.length; i++) {
      if (this._columns[i][optionName]) {
        return true;
      }
    }
  }
  isAllDataTypesDefined(checkSerializers) {
    const columns = this._columns;
    if (!columns.length) {
      return false;
    }
    for (let i = 0; i < columns.length; i++) {
      if (!columns[i].dataField && columns[i].calculateCellValue === columns[i].defaultCalculateCellValue) {
        continue;
      }
      if (!columns[i].dataType || checkSerializers && columns[i].deserializeValue && columns[i].serializationFormat === undefined) {
        return false;
      }
    }
    return true;
  }
  getColumns() {
    return this._columns;
  }
  isBandColumnsUsed() {
    return this.getColumns().some(column => column.isBand);
  }
  getGroupColumns() {
    const result = [];
    (0, _iterator.each)(this._columns, function () {
      const column = this;
      if ((0, _type.isDefined)(column.groupIndex)) {
        result[column.groupIndex] = column;
      }
    });
    return result;
  }
  /**
   * @extended: state_storing
   */
  _shouldReturnVisibleColumns() {
    return true;
  }
  /**
   * @extended: virtual_column
   */
  _compileVisibleColumns(rowIndex) {
    this._visibleColumns = this._visibleColumns || this._compileVisibleColumnsCore();
    rowIndex = (0, _type.isDefined)(rowIndex) ? rowIndex : this._visibleColumns.length - 1;
    return this._visibleColumns[rowIndex] || [];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getVisibleColumns(rowIndex, isBase) {
    if (!this._shouldReturnVisibleColumns()) {
      return [];
    }
    // @ts-expect-error
    return this._compileVisibleColumns.apply(this, arguments);
  }
  /**
   * @extended: virtual_column
   */
  getFixedColumns(rowIndex) {
    this._fixedColumns = this._fixedColumns || this._getFixedColumnsCore();
    rowIndex = (0, _type.isDefined)(rowIndex) ? rowIndex : this._fixedColumns.length - 1;
    return this._fixedColumns[rowIndex] || [];
  }
  getFilteringColumns() {
    return this.getColumns().filter(item => (item.dataField || item.name) && (item.allowFiltering || item.allowHeaderFiltering)).map(item => {
      const field = (0, _extend.extend)(true, {}, item);
      if (!(0, _type.isDefined)(field.dataField)) {
        field.dataField = field.name;
      }
      field.filterOperations = item.filterOperations !== item.defaultFilterOperations ? field.filterOperations : null;
      return field;
    });
  }
  /**
   * @extended: virtual_column
   */
  getColumnIndexOffset() {
    return 0;
  }
  _getFixedColumnsCore() {
    const that = this;
    const result = [];
    const rowCount = that.getRowCount();
    const isColumnFixing = that._isColumnFixing();
    const transparentColumn = {
      command: 'transparent'
    };
    let transparentColspan = 0;
    let notFixedColumnCount;
    let transparentColumnIndex;
    let lastFixedPosition;
    if (isColumnFixing) {
      for (let i = 0; i <= rowCount; i++) {
        notFixedColumnCount = 0;
        lastFixedPosition = null;
        transparentColumnIndex = null;
        const visibleColumns = that.getVisibleColumns(i, true);
        for (let j = 0; j < visibleColumns.length; j++) {
          const prevColumn = visibleColumns[j - 1];
          const column = visibleColumns[j];
          if (!column.fixed) {
            if (i === 0) {
              if (column.isBand && column.colspan) {
                transparentColspan += column.colspan;
              } else {
                transparentColspan++;
              }
            }
            notFixedColumnCount++;
            if (!(0, _type.isDefined)(transparentColumnIndex)) {
              transparentColumnIndex = j;
            }
          } else if (prevColumn && prevColumn.fixed && (0, _m_columns_controller_utils.getFixedPosition)(that, prevColumn) !== (0, _m_columns_controller_utils.getFixedPosition)(that, column)) {
            if (!(0, _type.isDefined)(transparentColumnIndex)) {
              transparentColumnIndex = j;
            }
          } else {
            lastFixedPosition = column.fixedPosition;
          }
        }
        if (i === 0 && (notFixedColumnCount === 0 || notFixedColumnCount >= visibleColumns.length)) {
          return [];
        }
        if (!(0, _type.isDefined)(transparentColumnIndex)) {
          transparentColumnIndex = lastFixedPosition === 'right' ? 0 : visibleColumns.length;
        }
        result[i] = visibleColumns.slice(0);
        if (!transparentColumn.colspan) {
          transparentColumn.colspan = transparentColspan;
        }
        result[i].splice(transparentColumnIndex, notFixedColumnCount, transparentColumn);
      }
    }
    return result.map(columns => columns.map(column => {
      const newColumn = _extends({}, column);
      if (newColumn.headerId) {
        newColumn.headerId += '-fixed';
      }
      return newColumn;
    }));
  }
  _isColumnFixing() {
    let isColumnFixing = this.option('columnFixing.enabled');
    !isColumnFixing && (0, _iterator.each)(this._columns, (_, column) => {
      if (column.fixed) {
        isColumnFixing = true;
        return false;
      }
    });
    return isColumnFixing;
  }
  /**
   * @extended: master_detail
   */
  _getExpandColumnsCore() {
    return this.getGroupColumns();
  }
  getExpandColumns() {
    let expandColumns = this._getExpandColumnsCore();
    let expandColumn;
    const firstGroupColumn = expandColumns.filter(column => column.groupIndex === 0)[0];
    const isFixedFirstGroupColumn = firstGroupColumn && firstGroupColumn.fixed;
    const isColumnFixing = this._isColumnFixing();
    const rtlEnabled = this.option('rtlEnabled');
    if (expandColumns.length) {
      expandColumn = this.columnOption('command:expand');
    }
    expandColumns = (0, _iterator.map)(expandColumns, column => (0, _extend.extend)({}, column, {
      visibleWidth: null,
      minWidth: null,
      cellTemplate: !(0, _type.isDefined)(column.groupIndex) ? column.cellTemplate : null,
      headerCellTemplate: null,
      fixed: !(0, _type.isDefined)(column.groupIndex) || !isFixedFirstGroupColumn ? isColumnFixing : true,
      fixedPosition: rtlEnabled ? 'right' : 'left'
    }, expandColumn, {
      index: column.index,
      type: column.type || _const.GROUP_COMMAND_COLUMN_NAME
    }));
    return expandColumns;
  }
  getBandColumnsCache() {
    if (!this._bandColumnsCache) {
      const columns = this._columns;
      const columnChildrenByIndex = {};
      const columnParentByIndex = {};
      let isPlain = true;
      columns.forEach(column => {
        const {
          ownerBand
        } = column;
        // @ts-expect-error
        let parentIndex = (0, _type.isObject)(ownerBand) ? ownerBand.index : ownerBand;
        const parent = columns[parentIndex];
        if (column.hasColumns) {
          isPlain = false;
        }
        if (column.colspan) {
          column.colspan = undefined;
        }
        if (column.rowspan) {
          column.rowspan = undefined;
        }
        if (parent) {
          columnParentByIndex[column.index] = parent;
        } else {
          parentIndex = -1;
        }
        columnChildrenByIndex[parentIndex] = columnChildrenByIndex[parentIndex] || [];
        columnChildrenByIndex[parentIndex].push(column);
      });
      this._bandColumnsCache = {
        isPlain,
        columnChildrenByIndex,
        columnParentByIndex
      };
    }
    return this._bandColumnsCache;
  }
  /**
   * @extended: adaptivity
   */
  _isColumnVisible(column) {
    return column.visible && this.isParentColumnVisible(column.index);
  }
  _isColumnInGroupPanel(column) {
    return (0, _type.isDefined)(column.groupIndex) && !column.showWhenGrouped;
  }
  hasVisibleDataColumns() {
    const columns = this._columns;
    return columns.some(column => {
      const isVisible = this._isColumnVisible(column);
      const isInGroupPanel = this._isColumnInGroupPanel(column);
      const isCommand = !!column.command;
      return isVisible && !isInGroupPanel && !isCommand;
    });
  }
  _compileVisibleColumnsCore() {
    const bandColumnsCache = this.getBandColumnsCache();
    const columns = (0, _m_columns_controller_utils.mergeColumns)(this, this._columns, this._commandColumns, true);
    (0, _m_columns_controller_utils.processBandColumns)(this, columns, bandColumnsCache);
    const indexedColumns = this._getIndexedColumns(columns);
    const visibleColumns = this._getVisibleColumnsFromIndexed(indexedColumns);
    const isDataColumnsInvisible = !this.hasVisibleDataColumns();
    if (isDataColumnsInvisible && this._columns.length) {
      visibleColumns[visibleColumns.length - 1].push({
        command: 'empty'
      });
    }
    return visibleColumns;
  }
  _getIndexedColumns(columns) {
    const rtlEnabled = this.option('rtlEnabled');
    const rowCount = this.getRowCount();
    const columnDigitsCount = (0, _m_columns_controller_utils.digitsCount)(columns.length);
    const bandColumnsCache = this.getBandColumnsCache();
    const positiveIndexedColumns = [];
    const negativeIndexedColumns = [];
    for (let i = 0; i < rowCount; i += 1) {
      negativeIndexedColumns[i] = [{}];
      // 0 - fixed columns on the left side
      // 1 - not fixed columns
      // 2 - fixed columns on the right side
      positiveIndexedColumns[i] = [{}, {}, {}];
    }
    columns.forEach(column => {
      let {
        visibleIndex
      } = column;
      let indexedColumns;
      const parentBandColumns = (0, _m_columns_controller_utils.getParentBandColumns)(column.index, bandColumnsCache.columnParentByIndex);
      const isVisible = this._isColumnVisible(column);
      const isInGroupPanel = this._isColumnInGroupPanel(column);
      if (isVisible && !isInGroupPanel) {
        const rowIndex = parentBandColumns.length;
        if (visibleIndex < 0) {
          visibleIndex = -visibleIndex;
          indexedColumns = negativeIndexedColumns[rowIndex];
        } else {
          var _parentBandColumns$, _parentBandColumns$2;
          column.fixed = ((_parentBandColumns$ = parentBandColumns[0]) === null || _parentBandColumns$ === void 0 ? void 0 : _parentBandColumns$.fixed) ?? column.fixed;
          column.fixedPosition = ((_parentBandColumns$2 = parentBandColumns[0]) === null || _parentBandColumns$2 === void 0 ? void 0 : _parentBandColumns$2.fixedPosition) ?? column.fixedPosition;
          if (column.fixed) {
            const isDefaultCommandColumn = !!column.command && !(0, _m_columns_controller_utils.isCustomCommandColumn)(this, column);
            let isFixedToEnd = column.fixedPosition === 'right';
            if (rtlEnabled && !isDefaultCommandColumn) {
              isFixedToEnd = !isFixedToEnd;
            }
            indexedColumns = isFixedToEnd ? positiveIndexedColumns[rowIndex][2] : positiveIndexedColumns[rowIndex][0];
          } else {
            indexedColumns = positiveIndexedColumns[rowIndex][1];
          }
        }
        if (parentBandColumns.length) {
          visibleIndex = (0, _m_columns_controller_utils.numberToString)(visibleIndex, columnDigitsCount);
          for (let i = parentBandColumns.length - 1; i >= 0; i -= 1) {
            visibleIndex = (0, _m_columns_controller_utils.numberToString)(parentBandColumns[i].visibleIndex, columnDigitsCount) + visibleIndex;
          }
        }
        indexedColumns[visibleIndex] = indexedColumns[visibleIndex] || [];
        indexedColumns[visibleIndex].push(column);
      }
    });
    return {
      positiveIndexedColumns,
      negativeIndexedColumns
    };
  }
  _getVisibleColumnsFromIndexed(_ref) {
    let {
      positiveIndexedColumns,
      negativeIndexedColumns
    } = _ref;
    const result = [];
    const rowCount = this.getRowCount();
    const expandColumns = (0, _m_columns_controller_utils.mergeColumns)(this, this.getExpandColumns(), this._columns);
    let rowspanGroupColumns = 0;
    let rowspanExpandColumns = 0;
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      result.push([]);
      (0, _object.orderEach)(negativeIndexedColumns[rowIndex], (_, columns) => {
        result[rowIndex].unshift.apply(result[rowIndex], columns);
      });
      const firstPositiveIndexColumn = result[rowIndex].length;
      const positiveIndexedRowColumns = positiveIndexedColumns[rowIndex];
      positiveIndexedRowColumns.forEach(columnsByFixing => {
        (0, _object.orderEach)(columnsByFixing, (_, columnsByVisibleIndex) => {
          result[rowIndex].push.apply(result[rowIndex], columnsByVisibleIndex);
        });
      });
      // The order of processing is important
      if (rowspanExpandColumns <= rowIndex) {
        rowspanExpandColumns += _m_columns_controller_utils.processExpandColumns.call(this, result[rowIndex], expandColumns, _const.DETAIL_COMMAND_COLUMN_NAME, firstPositiveIndexColumn);
      }
      if (rowspanGroupColumns <= rowIndex) {
        rowspanGroupColumns += _m_columns_controller_utils.processExpandColumns.call(this, result[rowIndex], expandColumns, _const.GROUP_COMMAND_COLUMN_NAME, firstPositiveIndexColumn);
      }
    }
    result.push((0, _m_columns_controller_utils.getDataColumns)(result));
    return result;
  }
  getInvisibleColumns(columns, bandColumnIndex) {
    const that = this;
    let result = [];
    let hiddenColumnsByBand;
    columns = columns || that._columns;
    (0, _iterator.each)(columns, (_, column) => {
      if (column.ownerBand !== bandColumnIndex) {
        return;
      }
      if (column.isBand) {
        if (!column.visible) {
          hiddenColumnsByBand = that.getChildrenByBandColumn(column.index);
        } else {
          hiddenColumnsByBand = that.getInvisibleColumns(that.getChildrenByBandColumn(column.index), column.index);
        }
        if (hiddenColumnsByBand.length) {
          result.push(column);
          result = result.concat(hiddenColumnsByBand);
        }
        return;
      }
      if (!column.visible) {
        result.push(column);
      }
    });
    return result;
  }
  getChooserColumns(getAllColumns) {
    const columns = getAllColumns ? this.getColumns() : this.getInvisibleColumns();
    const columnChooserColumns = columns.filter(column => column.showInColumnChooser);
    const sortOrder = this.option('columnChooser.sortOrder');
    return (0, _m_columns_controller_utils.sortColumns)(columnChooserColumns, sortOrder);
  }
  /**
   * @extended: column_chooser
   */
  allowMoveColumn(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
    const that = this;
    const columnIndex = (0, _m_columns_controller_utils.getColumnIndexByVisibleIndex)(that, fromVisibleIndex, sourceLocation);
    const sourceColumn = that._columns[columnIndex];
    if (sourceColumn && (sourceColumn.allowReordering || sourceColumn.allowGrouping || sourceColumn.allowHiding)) {
      if (sourceLocation === targetLocation) {
        if (sourceLocation === _const.COLUMN_CHOOSER_LOCATION) {
          return false;
        }
        // @ts-expect-error
        fromVisibleIndex = (0, _type.isObject)(fromVisibleIndex) ? fromVisibleIndex.columnIndex : fromVisibleIndex;
        // @ts-expect-error
        toVisibleIndex = (0, _type.isObject)(toVisibleIndex) ? toVisibleIndex.columnIndex : toVisibleIndex;
        return fromVisibleIndex !== toVisibleIndex && fromVisibleIndex + 1 !== toVisibleIndex;
      }
      if (sourceLocation === _const.GROUP_LOCATION && targetLocation !== _const.COLUMN_CHOOSER_LOCATION || targetLocation === _const.GROUP_LOCATION) {
        return sourceColumn && sourceColumn.allowGrouping;
      }
      if (sourceLocation === _const.COLUMN_CHOOSER_LOCATION || targetLocation === _const.COLUMN_CHOOSER_LOCATION) {
        return sourceColumn && sourceColumn.allowHiding;
      }
      return true;
    }
    return false;
  }
  moveColumn(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
    const that = this;
    const options = {};
    let prevGroupIndex;
    const fromIndex = (0, _m_columns_controller_utils.getColumnIndexByVisibleIndex)(that, fromVisibleIndex, sourceLocation);
    const toIndex = (0, _m_columns_controller_utils.getColumnIndexByVisibleIndex)(that, toVisibleIndex, targetLocation);
    let targetGroupIndex;
    if (fromIndex >= 0) {
      const column = that._columns[fromIndex];
      // @ts-expect-error
      toVisibleIndex = (0, _type.isObject)(toVisibleIndex) ? toVisibleIndex.columnIndex : toVisibleIndex;
      targetGroupIndex = toIndex >= 0 ? that._columns[toIndex].groupIndex : -1;
      if ((0, _type.isDefined)(column.groupIndex) && sourceLocation === _const.GROUP_LOCATION) {
        if (targetGroupIndex > column.groupIndex) {
          targetGroupIndex--;
        }
        if (targetLocation !== _const.GROUP_LOCATION) {
          options.groupIndex = undefined;
        } else {
          prevGroupIndex = column.groupIndex;
          delete column.groupIndex;
          (0, _m_columns_controller_utils.updateColumnGroupIndexes)(that);
        }
      }
      if (targetLocation === _const.GROUP_LOCATION) {
        options.groupIndex = (0, _m_columns_controller_utils.moveColumnToGroup)(that, column, targetGroupIndex);
        column.groupIndex = prevGroupIndex;
      } else if (toVisibleIndex >= 0) {
        const targetColumn = that._columns[toIndex];
        if (!targetColumn || column.ownerBand !== targetColumn.ownerBand) {
          options.visibleIndex = _const.MAX_SAFE_INTEGER;
        } else if ((0, _m_columns_controller_utils.isColumnFixed)(that, column) ^ (0, _m_columns_controller_utils.isColumnFixed)(that, targetColumn)) {
          options.visibleIndex = _const.MAX_SAFE_INTEGER;
        } else {
          options.visibleIndex = targetColumn.visibleIndex;
        }
      }
      const isVisible = targetLocation !== _const.COLUMN_CHOOSER_LOCATION;
      if (column.visible !== isVisible) {
        options.visible = isVisible;
      }
      that.columnOption(column.index, options);
    }
  }
  changeSortOrder(columnIndex, sortOrder) {
    const that = this;
    const options = {};
    const sortingOptions = that.option('sorting');
    const sortingMode = sortingOptions && sortingOptions.mode;
    const needResetSorting = sortingMode === 'single' || !sortOrder;
    const allowSorting = sortingMode === 'single' || sortingMode === 'multiple';
    const column = that._columns[columnIndex];
    const nextSortOrder = function (column) {
      if (sortOrder === 'ctrl') {
        if (!('sortOrder' in column && 'sortIndex' in column)) {
          return false;
        }
        options.sortOrder = undefined;
        options.sortIndex = undefined;
      } else if ((0, _type.isDefined)(column.groupIndex) || (0, _type.isDefined)(column.sortIndex)) {
        options.sortOrder = column.sortOrder === 'desc' ? 'asc' : 'desc';
      } else {
        options.sortOrder = 'asc';
      }
      return true;
    };
    if (allowSorting && column && column.allowSorting) {
      if (needResetSorting && !(0, _type.isDefined)(column.groupIndex)) {
        (0, _iterator.each)(that._columns, function (index) {
          if (index !== columnIndex && this.sortOrder) {
            if (!(0, _type.isDefined)(this.groupIndex)) {
              delete this.sortOrder;
            }
            delete this.sortIndex;
          }
        });
      }
      if ((0, _m_columns_controller_utils.isSortOrderValid)(sortOrder)) {
        if (column.sortOrder !== sortOrder) {
          options.sortOrder = sortOrder;
        }
      } else if (sortOrder === 'none') {
        if (column.sortOrder) {
          options.sortIndex = undefined;
          options.sortOrder = undefined;
        }
      } else {
        nextSortOrder(column);
      }
    }
    that.columnOption(column.index, options);
  }
  /**
   * @extended: focus
   */
  getSortDataSourceParameters(useLocalSelector) {
    const that = this;
    const sortColumns = [];
    const sort = [];
    (0, _iterator.each)(that._columns, function () {
      if ((this.dataField || this.selector || this.calculateCellValue) && (0, _type.isDefined)(this.sortIndex) && !(0, _type.isDefined)(this.groupIndex)) {
        sortColumns[this.sortIndex] = this;
      }
    });
    (0, _iterator.each)(sortColumns, function () {
      const sortOrder = this && this.sortOrder;
      if ((0, _m_columns_controller_utils.isSortOrderValid)(sortOrder)) {
        const sortItem = {
          selector: this.calculateSortValue || this.displayField || this.calculateDisplayValue || useLocalSelector && this.selector || this.dataField || this.calculateCellValue,
          desc: this.sortOrder === 'desc'
        };
        if (this.sortingMethod) {
          sortItem.compare = this.sortingMethod.bind(this);
        }
        sort.push(sortItem);
      }
    });
    return sort.length > 0 ? sort : null;
  }
  getGroupDataSourceParameters(useLocalSelector) {
    const group = [];
    (0, _iterator.each)(this.getGroupColumns(), function () {
      const selector = this.calculateGroupValue || this.displayField || this.calculateDisplayValue || useLocalSelector && this.selector || this.dataField || this.calculateCellValue;
      if (selector) {
        const groupItem = {
          selector,
          desc: this.sortOrder === 'desc',
          isExpanded: !!this.autoExpandGroup
        };
        if (this.sortingMethod) {
          groupItem.compare = this.sortingMethod.bind(this);
        }
        group.push(groupItem);
      }
    });
    return group.length > 0 ? group : null;
  }
  refresh(updateNewLookupsOnly) {
    const deferreds = [];
    (0, _iterator.each)(this._columns, function () {
      const {
        lookup
      } = this;
      if (lookup && !this.calculateDisplayValue) {
        if (updateNewLookupsOnly && lookup.valueMap) {
          return;
        }
        if (lookup.update) {
          deferreds.push(lookup.update());
        }
      }
    });
    return _deferred.when.apply(_renderer.default, deferreds).done(_m_columns_controller_utils.resetColumnsCache.bind(null, this));
  }
  _updateColumnOptions(column, columnIndex) {
    var _this$_previousColumn, _this$_previousColumn2;
    const defaultSelector = data => column.calculateCellValue(data);
    const shouldTakeOriginalCallbackFromPrevious = this._reinitAfterLookupChanges && ((_this$_previousColumn = this._previousColumns) === null || _this$_previousColumn === void 0 ? void 0 : _this$_previousColumn[columnIndex]);
    column.selector = column.selector ?? defaultSelector;
    column.selector.columnIndex = columnIndex;
    column.selector.originalCallback = shouldTakeOriginalCallbackFromPrevious ? ((_this$_previousColumn2 = this._previousColumns[columnIndex].selector) === null || _this$_previousColumn2 === void 0 ? void 0 : _this$_previousColumn2.originalCallback) ?? column.selector : column.selector;
    (0, _iterator.each)(['calculateSortValue', 'calculateGroupValue', 'calculateDisplayValue'], (_, calculateCallbackName) => {
      const calculateCallback = column[calculateCallbackName];
      if ((0, _type.isFunction)(calculateCallback)) {
        if (!calculateCallback.originalCallback) {
          const context = {
            column
          };
          column[calculateCallbackName] = function (data) {
            return calculateCallback.call(context.column, data);
          };
          column[calculateCallbackName].originalCallback = calculateCallback;
          column[calculateCallbackName].columnIndex = columnIndex;
          column[calculateCallbackName].context = context;
        } else {
          column[calculateCallbackName].context.column = column;
        }
      }
    });
    if ((0, _type.isString)(column.calculateDisplayValue)) {
      column.displayField = column.calculateDisplayValue;
      column.calculateDisplayValue = (0, _data.compileGetter)(column.displayField);
    }
    if (column.calculateDisplayValue) {
      column.displayValueMap = column.displayValueMap || {};
    }
    (0, _m_columns_controller_utils.updateSerializers)(column, column.dataType);
    const {
      lookup
    } = column;
    if (lookup) {
      (0, _m_columns_controller_utils.updateSerializers)(lookup, lookup.dataType);
    }
    const dataType = lookup ? lookup.dataType : column.dataType;
    if (dataType) {
      column.alignment = column.alignment || (0, _m_columns_controller_utils.getAlignmentByDataType)(dataType, this.option('rtlEnabled'));
      column.format = column.format || _m_utils.default.getFormatByDataType(dataType);
      column.customizeText = column.customizeText || (0, _m_columns_controller_utils.getCustomizeTextByDataType)(dataType);
      column.defaultFilterOperations = column.defaultFilterOperations || !lookup && _const.DATATYPE_OPERATIONS[dataType] || [];
      if (!(0, _type.isDefined)(column.filterOperations)) {
        (0, _m_columns_controller_utils.setFilterOperationsAsDefaultValues)(column);
      }
      column.defaultFilterOperation = column.filterOperations && column.filterOperations[0] || '=';
      column.showEditorAlways = (0, _type.isDefined)(column.showEditorAlways) ? column.showEditorAlways : dataType === 'boolean' && !column.cellTemplate && !column.lookup;
    }
  }
  updateColumnDataTypes(dataSource) {
    const that = this;
    const dateSerializationFormat = that.option('dateSerializationFormat');
    const firstItems = that._getFirstItems(dataSource);
    let isColumnDataTypesUpdated = false;
    (0, _iterator.each)(that._columns, (index, column) => {
      let i;
      let value;
      let dataType;
      let lookupDataType;
      let valueDataType;
      const {
        lookup
      } = column;
      if (_m_utils.default.isDateType(column.dataType) && column.serializationFormat === undefined) {
        column.serializationFormat = dateSerializationFormat;
      }
      if (lookup && _m_utils.default.isDateType(lookup.dataType) && column.serializationFormat === undefined) {
        lookup.serializationFormat = dateSerializationFormat;
      }
      if (column.calculateCellValue && firstItems.length) {
        if (!column.dataType || lookup && !lookup.dataType) {
          for (i = 0; i < firstItems.length; i++) {
            value = column.calculateCellValue(firstItems[i]);
            if (!column.dataType) {
              valueDataType = (0, _m_columns_controller_utils.getValueDataType)(value);
              dataType = dataType || valueDataType;
              if (dataType && valueDataType && dataType !== valueDataType) {
                dataType = 'string';
              }
            }
            if (lookup && !lookup.dataType) {
              valueDataType = (0, _m_columns_controller_utils.getValueDataType)(_m_utils.default.getDisplayValue(column, value, firstItems[i]));
              lookupDataType = lookupDataType || valueDataType;
              if (lookupDataType && valueDataType && lookupDataType !== valueDataType) {
                lookupDataType = 'string';
              }
            }
          }
          if (dataType || lookupDataType) {
            if (dataType) {
              column.dataType = dataType;
            }
            if (lookup && lookupDataType) {
              lookup.dataType = lookupDataType;
            }
            isColumnDataTypesUpdated = true;
          }
        }
        if (column.serializationFormat === undefined || lookup && lookup.serializationFormat === undefined) {
          for (i = 0; i < firstItems.length; i++) {
            value = column.calculateCellValue(firstItems[i], true);
            if (column.serializationFormat === undefined) {
              column.serializationFormat = (0, _m_columns_controller_utils.getSerializationFormat)(column.dataType, value);
            }
            if (lookup && lookup.serializationFormat === undefined) {
              lookup.serializationFormat = (0, _m_columns_controller_utils.getSerializationFormat)(lookup.dataType, lookup.calculateCellValue(value, true));
            }
          }
        }
      }
      that._updateColumnOptions(column, index);
    });
    return isColumnDataTypesUpdated;
  }
  _customizeColumns(columns) {
    const that = this;
    const customizeColumns = that.option('customizeColumns');
    if (customizeColumns) {
      const hasOwnerBand = columns.some(column => (0, _type.isObject)(column.ownerBand));
      if (hasOwnerBand) {
        (0, _m_columns_controller_utils.updateIndexes)(that);
      }
      customizeColumns(columns);
      (0, _m_columns_controller_utils.assignColumns)(that, (0, _m_columns_controller_utils.createColumnsFromOptions)(that, columns));
    }
  }
  updateColumns(dataSource, forceApplying, isApplyingUserState) {
    if (!forceApplying) {
      this.updateSortingGrouping(dataSource);
    }
    if (!dataSource || dataSource.isLoaded()) {
      const sortParameters = dataSource ? dataSource.sort() || [] : this.getSortDataSourceParameters();
      const groupParameters = dataSource ? dataSource.group() || [] : this.getGroupDataSourceParameters();
      const filterParameters = dataSource === null || dataSource === void 0 ? void 0 : dataSource.lastLoadOptions().filter;
      if (!isApplyingUserState) {
        this._customizeColumns(this._columns);
      }
      (0, _m_columns_controller_utils.updateIndexes)(this);
      const columns = this._columns;
      return (0, _deferred.when)(this.refresh(true)).always(() => {
        if (this._columns !== columns) return;
        this._updateChanges(dataSource, {
          sorting: sortParameters,
          grouping: groupParameters,
          filtering: filterParameters
        });
        (0, _m_columns_controller_utils.fireColumnsChanged)(this);
      });
    }
  }
  _updateChanges(dataSource, parameters) {
    if (dataSource) {
      this.updateColumnDataTypes(dataSource);
      this._dataSourceApplied = true;
    }
    if (!_m_utils.default.equalSortParameters(parameters.sorting, this.getSortDataSourceParameters())) {
      (0, _m_columns_controller_utils.updateColumnChanges)(this, 'sorting');
    }
    if (!_m_utils.default.equalSortParameters(parameters.grouping, this.getGroupDataSourceParameters())) {
      (0, _m_columns_controller_utils.updateColumnChanges)(this, 'grouping');
    }
    if (this._dataController && !_m_utils.default.equalFilterParameters(parameters.filtering, this._dataController.getCombinedFilter())) {
      (0, _m_columns_controller_utils.updateColumnChanges)(this, 'filtering');
    }
    (0, _m_columns_controller_utils.updateColumnChanges)(this, 'columns');
  }
  updateSortingGrouping(dataSource, fromDataSource) {
    const that = this;
    let sortParameters;
    let isColumnsChanged;
    const updateSortGroupParameterIndexes = function (columns, sortParameters, indexParameterName) {
      (0, _iterator.each)(columns, (index, column) => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete column[indexParameterName];
        if (sortParameters) {
          for (let i = 0; i < sortParameters.length; i++) {
            const {
              selector
            } = sortParameters[i];
            const {
              isExpanded
            } = sortParameters[i];
            if (selector === column.dataField || selector === column.name || selector === column.displayField || selector === column.selector || selector === column.calculateCellValue || selector === column.calculateGroupValue || selector === column.calculateDisplayValue) {
              if (fromDataSource) {
                column.sortOrder = 'sortOrder' in column ? column.sortOrder : sortParameters[i].desc ? 'desc' : 'asc';
              } else {
                column.sortOrder = column.sortOrder || (sortParameters[i].desc ? 'desc' : 'asc');
              }
              if (isExpanded !== undefined) {
                column.autoExpandGroup = isExpanded;
              }
              column[indexParameterName] = i;
              break;
            }
          }
        }
      });
    };
    if (dataSource) {
      sortParameters = _m_utils.default.normalizeSortingInfo(dataSource.sort());
      const groupParameters = _m_utils.default.normalizeSortingInfo(dataSource.group());
      const columnsGroupParameters = that.getGroupDataSourceParameters();
      const columnsSortParameters = that.getSortDataSourceParameters();
      const groupingChanged = !_m_utils.default.equalSortParameters(groupParameters, columnsGroupParameters, true);
      const groupExpandingChanged = !groupingChanged && !_m_utils.default.equalSortParameters(groupParameters, columnsGroupParameters);
      if (!that._columns.length) {
        (0, _iterator.each)(groupParameters, (index, group) => {
          that._columns.push(group.selector);
        });
        (0, _iterator.each)(sortParameters, (index, sort) => {
          if (!(0, _type.isFunction)(sort.selector)) {
            that._columns.push(sort.selector);
          }
        });
        (0, _m_columns_controller_utils.assignColumns)(that, (0, _m_columns_controller_utils.createColumnsFromOptions)(that, that._columns));
      }
      if ((fromDataSource || !columnsGroupParameters && !that._hasUserState) && (groupingChanged || groupExpandingChanged)) {
        
        updateSortGroupParameterIndexes(that._columns, groupParameters, 'groupIndex');
        if (fromDataSource) {
          groupingChanged && (0, _m_columns_controller_utils.updateColumnChanges)(that, 'grouping');
          groupExpandingChanged && (0, _m_columns_controller_utils.updateColumnChanges)(that, 'groupExpanding');
          isColumnsChanged = true;
        }
      }
      if ((fromDataSource || !columnsSortParameters && !that._hasUserState) && !_m_utils.default.equalSortParameters(sortParameters, columnsSortParameters)) {
        
        updateSortGroupParameterIndexes(that._columns, sortParameters, 'sortIndex');
        if (fromDataSource) {
          (0, _m_columns_controller_utils.updateColumnChanges)(that, 'sorting');
          isColumnsChanged = true;
        }
      }
      if (isColumnsChanged) {
        (0, _m_columns_controller_utils.fireColumnsChanged)(that);
      }
    }
  }
  updateFilter(filter, remoteFiltering, columnIndex, filterValue) {
    const that = this;
    if (!Array.isArray(filter)) return filter;
    filter = (0, _extend.extend)([], filter);
    columnIndex = filter.columnIndex !== undefined ? filter.columnIndex : columnIndex;
    filterValue = filter.filterValue !== undefined ? filter.filterValue : filterValue;
    if ((0, _type.isString)(filter[0]) && filter[0] !== '!') {
      const column = that.columnOption(filter[0]);
      if (remoteFiltering) {
        if ((0, _config.default)().forceIsoDateParsing && column && column.serializeValue && filter.length > 1) {
          filter[filter.length - 1] = column.serializeValue(filter[filter.length - 1], 'filter');
        }
      } else if (column && column.selector) {
        filter[0] = column.selector;
        filter[0].columnIndex = column.index;
      }
    } else if ((0, _type.isFunction)(filter[0])) {
      filter[0].columnIndex = columnIndex;
      filter[0].filterValue = filterValue;
      filter[0].selectedFilterOperation = filter.selectedFilterOperation;
    }
    for (let i = 0; i < filter.length; i++) {
      filter[i] = that.updateFilter(filter[i], remoteFiltering, columnIndex, filterValue);
    }
    return filter;
  }
  columnCount() {
    return this._columns ? this._columns.length : 0;
  }
  columnOption(identifier, option, value, notFireEvent) {
    const that = this;
    const columns = that._columns.concat(that._commandColumns);
    const column = (0, _m_columns_controller_utils.findColumn)(columns, identifier);
    if (column) {
      if (arguments.length === 1) {
        return (0, _extend.extend)({}, column);
      }
      if ((0, _type.isString)(option)) {
        if (arguments.length === 2) {
          return (0, _m_columns_controller_utils.columnOptionCore)(that, column, option);
        }
        (0, _m_columns_controller_utils.columnOptionCore)(that, column, option, value, notFireEvent);
      } else if ((0, _type.isObject)(option)) {
        (0, _iterator.each)(option, (optionName, value) => {
          (0, _m_columns_controller_utils.columnOptionCore)(that, column, optionName, value, notFireEvent);
        });
      }
      (0, _m_columns_controller_utils.fireColumnsChanged)(that);
    }
  }
  clearSorting() {
    const that = this;
    const columnCount = this.columnCount();
    that.beginUpdate();
    for (let i = 0; i < columnCount; i++) {
      that.columnOption(i, 'sortOrder', undefined);
      // option needs to be deleted from column to prevert conflicts in syncing loadOptions from dataSource. See T1147379
      delete (0, _m_columns_controller_utils.findColumn)(that._columns, i).sortOrder;
    }
    that.endUpdate();
  }
  clearGrouping() {
    const that = this;
    const columnCount = this.columnCount();
    that.beginUpdate();
    for (let i = 0; i < columnCount; i++) {
      that.columnOption(i, 'groupIndex', undefined);
    }
    that.endUpdate();
  }
  getVisibleIndex(index, rowIndex) {
    const columns = this.getVisibleColumns(rowIndex);
    for (let i = columns.length - 1; i >= 0; i--) {
      if (columns[i].index === index) {
        return i;
      }
    }
    return -1;
  }
  getVisibleIndexByColumn(column, rowIndex) {
    const visibleColumns = this.getVisibleColumns(rowIndex);
    const visibleColumn = visibleColumns.filter(col => col.index === column.index && col.command === column.command)[0];
    return visibleColumns.indexOf(visibleColumn);
  }
  getVisibleColumnIndex(id, rowIndex) {
    const index = this.columnOption(id, 'index');
    return this.getVisibleIndex(index, rowIndex);
  }
  addColumn(options) {
    const that = this;
    let column = (0, _m_columns_controller_utils.createColumn)(that, options);
    const index = that._columns.length;
    that._columns.push(column);
    if (column.isBand) {
      that._columns = (0, _m_columns_controller_utils.createColumnsFromOptions)(that, that._columns);
      column = that._columns[index];
    }
    column.added = options;
    (0, _m_columns_controller_utils.updateIndexes)(that, column);
    that.updateColumns(that._dataSource);
    that._checkColumns();
  }
  deleteColumn(id) {
    const that = this;
    const column = that.columnOption(id);
    if (column && column.index >= 0) {
      (0, _m_columns_controller_utils.convertOwnerBandToColumnReference)(that._columns);
      that._columns.splice(column.index, 1);
      if (column.isBand) {
        const childIndexes = that.getChildrenByBandColumn(column.index).map(column => column.index);
        that._columns = that._columns.filter(column => childIndexes.indexOf(column.index) < 0);
      }
      (0, _m_columns_controller_utils.updateIndexes)(that);
      that.updateColumns(that._dataSource);
    }
  }
  addCommandColumn(options) {
    let commandColumn = this._commandColumns.filter(column => column.command === options.command)[0];
    if (!commandColumn) {
      commandColumn = options;
      this._commandColumns.push(commandColumn);
    }
  }
  getUserState() {
    const columns = this._columns;
    const result = [];
    let i;
    function handleStateField(index, value) {
      if (columns[i][value] !== undefined) {
        result[i][value] = columns[i][value];
      }
    }
    for (i = 0; i < columns.length; i++) {
      result[i] = {};
      (0, _iterator.each)(_const.USER_STATE_FIELD_NAMES, handleStateField);
    }
    return result;
  }
  setName(column) {
    column.name = column.name || column.dataField || column.type;
  }
  setUserState(state) {
    const that = this;
    const dataSource = that._dataSource;
    let ignoreColumnOptionNames = that.option('stateStoring.ignoreColumnOptionNames');
    state === null || state === void 0 || state.forEach(this.setName);
    if (!ignoreColumnOptionNames) {
      ignoreColumnOptionNames = [];
      const commonColumnSettings = that.getCommonSettings();
      if (!that.option('columnChooser.enabled')) ignoreColumnOptionNames.push('visible');
      if (that.option('sorting.mode') === 'none') ignoreColumnOptionNames.push('sortIndex', 'sortOrder');
      if (!commonColumnSettings.allowGrouping) ignoreColumnOptionNames.push('groupIndex');
      if (!commonColumnSettings.allowFixing) ignoreColumnOptionNames.push('fixed', 'fixedPosition');
      if (!commonColumnSettings.allowResizing) ignoreColumnOptionNames.push('width', 'visibleWidth');
      const isFilterPanelHidden = !that.option('filterPanel.visible');
      if (!that.option('filterRow.visible') && isFilterPanelHidden) ignoreColumnOptionNames.push('filterValue', 'selectedFilterOperation');
      if (!that.option('headerFilter.visible') && isFilterPanelHidden) ignoreColumnOptionNames.push('filterValues', 'filterType');
    }
    that._columnsUserState = state;
    that._ignoreColumnOptionNames = ignoreColumnOptionNames;
    that._hasUserState = !!state;
    (0, _m_columns_controller_utils.updateColumnChanges)(that, 'filtering');
    that.init(true);
    if (dataSource) {
      dataSource.sort(that.getSortDataSourceParameters());
      dataSource.group(that.getGroupDataSourceParameters());
    }
  }
  _checkColumns() {
    const usedNames = {};
    let hasEditableColumnWithoutName = false;
    const duplicatedNames = [];
    this._columns.forEach(column => {
      var _column$columns;
      const {
        name
      } = column;
      const isBand = (_column$columns = column.columns) === null || _column$columns === void 0 ? void 0 : _column$columns.length;
      const isEditable = column.allowEditing && (column.dataField || column.setCellValue) && !isBand;
      if (name) {
        if (usedNames[name]) {
          duplicatedNames.push(`"${name}"`);
        }
        usedNames[name] = true;
      } else if (isEditable) {
        hasEditableColumnWithoutName = true;
      }
    });
    if (duplicatedNames.length) {
      _ui.default.log('E1059', duplicatedNames.join(', '));
    }
    if (hasEditableColumnWithoutName) {
      _ui.default.log('E1060');
    }
  }
  _createCalculatedColumnOptions(columnOptions, bandColumn) {
    let calculatedColumnOptions = {};
    let {
      dataField
    } = columnOptions;
    if (Array.isArray(columnOptions.columns) && columnOptions.columns.length || columnOptions.isBand) {
      calculatedColumnOptions.isBand = true;
      dataField = null;
    }
    if (dataField) {
      if ((0, _type.isString)(dataField)) {
        const getter = (0, _data.compileGetter)(dataField);
        calculatedColumnOptions = {
          caption: (0, _inflector.captionize)(dataField),
          calculateCellValue(data, skipDeserialization) {
            // @ts-expect-error
            const value = getter(data);
            return this.deserializeValue && !skipDeserialization ? this.deserializeValue(value) : value;
          },
          setCellValue: _m_columns_controller_utils.defaultSetCellValue,
          parseValue(text) {
            const column = this;
            let result;
            let parsedValue;
            if (column.dataType === 'number') {
              if ((0, _type.isString)(text) && column.format) {
                result = (0, _m_columns_controller_utils.strictParseNumber)(text.trim(), column.format);
              } else if ((0, _type.isDefined)(text) && (0, _type.isNumeric)(text)) {
                result = Number(text);
              }
            } else if (column.dataType === 'boolean') {
              if (text === column.trueText) {
                result = true;
              } else if (text === column.falseText) {
                result = false;
              }
            } else if (_m_utils.default.isDateType(column.dataType)) {
              // @ts-expect-error
              parsedValue = _date.default.parse(text, column.format);
              if (parsedValue) {
                result = parsedValue;
              }
            } else {
              result = text;
            }
            return result;
          }
        };
      }
      calculatedColumnOptions.allowFiltering = true;
    } else {
      calculatedColumnOptions.allowFiltering = !!columnOptions.calculateFilterExpression;
    }
    calculatedColumnOptions.calculateFilterExpression = function () {
      // @ts-expect-error
      return _filtering.default.defaultCalculateFilterExpression.apply(this, arguments);
    };
    calculatedColumnOptions.defaultFilterOperation = '=';
    calculatedColumnOptions.createFilterExpression = function (filterValue, selectedFilterOperation) {
      let result;
      if (this.calculateFilterExpression) {
        result = this.calculateFilterExpression.apply(this, arguments);
      }
      if ((0, _type.isFunction)(result)) {
        result = [result, '=', true];
      }
      if (result) {
        result.columnIndex = this.index;
        result.filterValue = filterValue;
        result.selectedFilterOperation = selectedFilterOperation;
      }
      return result;
    };
    if (!dataField || !(0, _type.isString)(dataField)) {
      (0, _extend.extend)(true, calculatedColumnOptions, {
        allowSorting: false,
        allowGrouping: false,
        calculateCellValue() {
          return null;
        }
      });
    }
    if (bandColumn) {
      calculatedColumnOptions.allowFixing = false;
    }
    if (columnOptions.dataType) {
      calculatedColumnOptions.userDataType = columnOptions.dataType;
    }
    if (columnOptions.selectedFilterOperation && !('defaultSelectedFilterOperation' in calculatedColumnOptions)) {
      calculatedColumnOptions.defaultSelectedFilterOperation = columnOptions.selectedFilterOperation;
    }
    if (columnOptions.lookup) {
      calculatedColumnOptions.lookup = {
        calculateCellValue(value, skipDeserialization) {
          if (this.valueExpr) {
            value = this.valueMap && this.valueMap[value];
          }
          return this.deserializeValue && !skipDeserialization ? this.deserializeValue(value) : value;
        },
        updateValueMap() {
          this.valueMap = {};
          if (this.items) {
            const calculateValue = (0, _data.compileGetter)(this.valueExpr);
            const calculateDisplayValue = (0, _data.compileGetter)(this.displayExpr);
            for (let i = 0; i < this.items.length; i++) {
              const item = this.items[i];
              const displayValue = calculateDisplayValue(item);
              this.valueMap[calculateValue(item)] = displayValue;
              this.dataType = this.dataType || (0, _m_columns_controller_utils.getValueDataType)(displayValue);
            }
          }
        },
        update() {
          const that = this;
          let {
            dataSource
          } = that;
          if (dataSource) {
            if ((0, _type.isFunction)(dataSource) && !_variable_wrapper.default.isWrapped(dataSource)) {
              dataSource = dataSource({});
            }
            if ((0, _type.isPlainObject)(dataSource) || dataSource instanceof _abstract_store.default || Array.isArray(dataSource)) {
              if (that.valueExpr) {
                const dataSourceOptions = (0, _utils.normalizeDataSourceOptions)(dataSource);
                dataSourceOptions.paginate = false;
                dataSource = new _data_source.DataSource(dataSourceOptions);
                return dataSource.load().done(data => {
                  that.items = data;
                  that.updateValueMap && that.updateValueMap();
                });
              }
            } else {
              _ui.default.log('E1016');
            }
          } else {
            that.updateValueMap && that.updateValueMap();
          }
        }
      };
    }
    calculatedColumnOptions.resizedCallbacks = (0, _callbacks.default)();
    if (columnOptions.resized) {
      calculatedColumnOptions.resizedCallbacks.add(columnOptions.resized.bind(columnOptions));
    }
    (0, _iterator.each)(calculatedColumnOptions, optionName => {
      if ((0, _type.isFunction)(calculatedColumnOptions[optionName]) && optionName.indexOf('default') !== 0) {
        const defaultOptionName = `default${optionName.charAt(0).toUpperCase()}${optionName.substr(1)}`;
        calculatedColumnOptions[defaultOptionName] = calculatedColumnOptions[optionName];
      }
    });
    return calculatedColumnOptions;
  }
  getRowCount() {
    this._rowCount = this._rowCount || (0, _m_columns_controller_utils.getRowCount)(this);
    return this._rowCount;
  }
  getRowIndex(columnIndex, alwaysGetRowIndex) {
    const column = this._columns[columnIndex];
    const bandColumnsCache = this.getBandColumnsCache();
    return column && (alwaysGetRowIndex || column.visible && !(column.command || (0, _type.isDefined)(column.groupIndex))) ? (0, _m_columns_controller_utils.getParentBandColumns)(columnIndex, bandColumnsCache.columnParentByIndex).length : 0;
  }
  getChildrenByBandColumn(bandColumnIndex, onlyVisibleDirectChildren) {
    const that = this;
    const bandColumnsCache = that.getBandColumnsCache();
    const result = (0, _m_columns_controller_utils.getChildrenByBandColumn)(bandColumnIndex, bandColumnsCache.columnChildrenByIndex, !onlyVisibleDirectChildren);
    if (onlyVisibleDirectChildren) {
      return result.filter(column => column.visible && !column.command).sort((column1, column2) => column1.visibleIndex - column2.visibleIndex);
    }
    return result;
  }
  isParentBandColumn(columnIndex, bandColumnIndex) {
    let result = false;
    const column = this._columns[columnIndex];
    const bandColumnsCache = this.getBandColumnsCache();
    const parentBandColumns = column && (0, _m_columns_controller_utils.getParentBandColumns)(columnIndex, bandColumnsCache.columnParentByIndex);
    if (parentBandColumns) {
      // T416483 - fix for jquery 2.1.4
      (0, _iterator.each)(parentBandColumns, (_, bandColumn) => {
        if (bandColumn.index === bandColumnIndex) {
          result = true;
          return false;
        }
      });
    }
    return result;
  }
  isParentColumnVisible(columnIndex) {
    let result = true;
    const bandColumnsCache = this.getBandColumnsCache();
    const bandColumns = columnIndex >= 0 && (0, _m_columns_controller_utils.getParentBandColumns)(columnIndex, bandColumnsCache.columnParentByIndex);
    bandColumns && (0, _iterator.each)(bandColumns, (_, bandColumn) => {
      result = result && bandColumn.visible;
      return result;
    });
    return result;
  }
  getColumnId(column) {
    if (column.command && column.type === _const.GROUP_COMMAND_COLUMN_NAME) {
      if ((0, _m_columns_controller_utils.isCustomCommandColumn)(this, column)) {
        return `type:${column.type}`;
      }
      return `command:${column.command}`;
    }
    return column.index;
  }
  getCustomizeTextByDataType(dataType) {
    return (0, _m_columns_controller_utils.getCustomizeTextByDataType)(dataType);
  }
  getHeaderContentAlignment(columnAlignment) {
    const rtlEnabled = this.option('rtlEnabled');
    if (rtlEnabled) {
      return columnAlignment === 'left' ? 'right' : 'left';
    }
    return columnAlignment;
  }
}
exports.ColumnsController = ColumnsController;
const columnsControllerModule = exports.columnsControllerModule = {
  defaultOptions() {
    return {
      commonColumnSettings: {
        allowFiltering: true,
        allowHiding: true,
        allowSorting: true,
        allowEditing: true,
        encodeHtml: true,
        trueText: _message.default.format('dxDataGrid-trueText'),
        falseText: _message.default.format('dxDataGrid-falseText')
      },
      allowColumnReordering: false,
      allowColumnResizing: false,
      columnResizingMode: 'nextColumn',
      columnMinWidth: undefined,
      columnWidth: undefined,
      adaptColumnWidthByRatio: true,
      columns: undefined,
      regenerateColumnsByVisibleItems: false,
      customizeColumns: null,
      dateSerializationFormat: undefined
    };
  },
  controllers: {
    columns: ColumnsController
  }
};
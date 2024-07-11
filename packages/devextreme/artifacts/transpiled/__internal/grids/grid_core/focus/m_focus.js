"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.focusModule = exports.FocusController = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _m_editing_utils = require("../editing/m_editing_utils");
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _m_focus_utils = require("./m_focus_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */

const ROW_FOCUSED_CLASS = 'dx-row-focused';
const FOCUSED_ROW_SELECTOR = `.dx-row.${ROW_FOCUSED_CLASS}`;
const TABLE_POSTFIX_CLASS = 'table';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
class FocusController extends _m_modules.default.ViewController {
  // TODO getController
  //  This controller's method used in the data_controler (and maybe others) init methods
  //  And this controller's fields are empty when methods already called
  //  Therefore, as a temporary solution this private getters exist here
  getKeyboardController() {
    return this.getController('keyboardNavigation');
  }
  getDataController() {
    return this.getController('data');
  }
  init() {
    this.component._optionsByReference.focusedRowKey = true;
  }
  optionChanged(args) {
    const {
      name,
      value,
      previousValue
    } = args;
    switch (name) {
      case 'focusedRowIndex':
        this._focusRowByIndex(value);
        this.getKeyboardController()._fireFocusedRowChanged();
        args.handled = true;
        break;
      case 'focusedRowKey':
        if (Array.isArray(value) && JSON.stringify(value) === JSON.stringify(previousValue)) {
          return;
        }
        this._focusRowByKey(value);
        this.getKeyboardController()._fireFocusedRowChanged();
        args.handled = true;
        break;
      case 'focusedColumnIndex':
      case 'focusedRowEnabled':
      case 'autoNavigateToFocusedRow':
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
        break;
    }
  }
  publicMethods() {
    return ['navigateToRow', 'isRowFocused'];
  }
  isAutoNavigateToFocusedRow() {
    return this.option('scrolling.mode') !== 'infinite' && this.option('autoNavigateToFocusedRow');
  }
  _focusRowByIndex(index, operationTypes) {
    if (!this.option('focusedRowEnabled')) {
      return;
    }
    index = index !== undefined ? index : this.option('focusedRowIndex');
    if (index < 0) {
      if (this.isAutoNavigateToFocusedRow()) {
        this._resetFocusedRow();
      }
    } else {
      this._focusRowByIndexCore(index, operationTypes);
    }
  }
  _focusRowByIndexCore(index, operationTypes) {
    const pageSize = this.getDataController().pageSize();
    const setKeyByIndex = () => {
      if (this._isValidFocusedRowIndex(index)) {
        let rowIndex = index - this.getDataController().getRowIndexOffset(true);
        if (!operationTypes || operationTypes.paging && !operationTypes.filtering) {
          // @ts-expect-error
          const lastItemIndex = this.getDataController()._getLastItemIndex();
          rowIndex = Math.min(rowIndex, lastItemIndex);
        }
        const focusedRowKey = this.getDataController().getKeyByRowIndex(rowIndex, true);
        if ((0, _type.isDefined)(focusedRowKey) && !this.isRowFocused(focusedRowKey)) {
          this.option('focusedRowKey', focusedRowKey);
        }
      }
    };
    if (pageSize >= 0) {
      if (!this._isLocalRowIndex(index)) {
        const pageIndex = Math.floor(index / this.getDataController().pageSize());
        (0, _deferred.when)(this.getDataController().pageIndex(pageIndex), this.getDataController().waitReady()).done(() => {
          setKeyByIndex();
        });
      } else {
        setKeyByIndex();
      }
    }
  }
  _isLocalRowIndex(index) {
    const isVirtualScrolling = this.getKeyboardController()._isVirtualScrolling();
    if (isVirtualScrolling) {
      const pageIndex = Math.floor(index / this.getDataController().pageSize());
      // @ts-expect-error
      const virtualItems = this.getDataController().virtualItemsCount();
      const virtualItemsBegin = virtualItems ? virtualItems.begin : -1;
      const visibleRowsCount = this.getDataController().getVisibleRows().length + this.getDataController().getRowIndexOffset();
      const visiblePagesCount = Math.ceil(visibleRowsCount / this.getDataController().pageSize());
      return virtualItemsBegin <= index && visiblePagesCount > pageIndex;
    }
    return true;
  }
  _setFocusedRowKeyByIndex(index) {
    if (this._isValidFocusedRowIndex(index)) {
      const rowIndex = Math.min(index - this.getDataController().getRowIndexOffset(), this.getDataController().items().length - 1);
      const focusedRowKey = this.getDataController().getKeyByRowIndex(rowIndex);
      if ((0, _type.isDefined)(focusedRowKey) && !this.isRowFocused(focusedRowKey)) {
        this.option('focusedRowKey', focusedRowKey);
      }
    }
  }
  _focusRowByKey(key) {
    if (!(0, _type.isDefined)(key)) {
      this._resetFocusedRow();
    } else {
      this._navigateToRow(key, true);
    }
  }
  _resetFocusedRow() {
    const focusedRowKey = this.option('focusedRowKey');
    const isFocusedRowKeyDefined = (0, _type.isDefined)(focusedRowKey);
    if (!isFocusedRowKeyDefined && this.option('focusedRowIndex') < 0) {
      return;
    }
    if (isFocusedRowKeyDefined) {
      this.option('focusedRowKey', null);
    }
    this.getKeyboardController().setFocusedRowIndex(-1);
    this.option('focusedRowIndex', -1);
    this.getDataController().updateItems({
      changeType: 'updateFocusedRow',
      focusedRowKey: null
    });
    this.getKeyboardController()._fireFocusedRowChanged();
  }
  _isValidFocusedRowIndex(rowIndex) {
    const row = this.getDataController().getVisibleRows()[rowIndex];
    return !row || row.rowType === 'data' || row.rowType === 'group';
  }
  navigateToRow(key) {
    if (!this.isAutoNavigateToFocusedRow()) {
      this.option('focusedRowIndex', -1);
    }
    return this._navigateToRow(key);
  }
  _navigateToRow(key, needFocusRow) {
    const that = this;
    const isAutoNavigate = that.isAutoNavigateToFocusedRow();
    // @ts-expect-error
    const d = new _deferred.Deferred();
    if (key === undefined || !this.getDataController().dataSource()) {
      return d.reject().promise();
    }
    const rowIndexByKey = that.getFocusedRowIndexByKey(key);
    if (!isAutoNavigate && needFocusRow || rowIndexByKey >= 0) {
      that._navigateTo(key, d, needFocusRow);
    } else {
      // @ts-expect-error this is the TreeList's method
      this.getDataController().getPageIndexByKey(key).done(pageIndex => {
        if (pageIndex < 0) {
          d.resolve(-1);
          return;
        }
        if (pageIndex === this.getDataController().pageIndex()) {
          this.getDataController().reload().done(() => {
            if (that.isRowFocused(key) && this.getDataController().getRowIndexByKey(key) >= 0) {
              d.resolve(that.getFocusedRowIndexByKey(key));
            } else {
              that._navigateTo(key, d, needFocusRow);
            }
          }).fail(d.reject);
        } else {
          this.getDataController().pageIndex(pageIndex).done(() => {
            that._navigateTo(key, d, needFocusRow);
          }).fail(d.reject);
        }
      }).fail(d.reject);
    }
    return d.promise();
  }
  _navigateTo(key, deferred, needFocusRow) {
    const visibleRowIndex = this.getDataController().getRowIndexByKey(key);
    const isVirtualRowRenderingMode = _m_utils.default.isVirtualRowRendering(this);
    const isAutoNavigate = this.isAutoNavigateToFocusedRow();
    if (isAutoNavigate && isVirtualRowRenderingMode && visibleRowIndex < 0) {
      this._navigateToVirtualRow(key, deferred, needFocusRow);
    } else {
      this._navigateToVisibleRow(key, deferred, needFocusRow);
    }
  }
  _navigateToVisibleRow(key, deferred, needFocusRow) {
    if (needFocusRow) {
      this._triggerUpdateFocusedRow(key, deferred);
    } else {
      const focusedRowIndex = this.getFocusedRowIndexByKey(key);
      // @ts-expect-error
      this.getView('rowsView').scrollToRowElement(key, deferred).done(() => {
        deferred.resolve(focusedRowIndex);
      });
    }
  }
  _navigateToVirtualRow(key, deferred, needFocusRow) {
    const rowsScrollController = this.getDataController()._rowsScrollController;
    const rowIndex = _m_utils.default.getIndexByKey(key, this.getDataController().items(true));
    const scrollable = this.getView('rowsView').getScrollable();
    if (rowsScrollController && scrollable && rowIndex >= 0) {
      const focusedRowIndex = rowIndex + this.getDataController().getRowIndexOffset(true);
      const offset = rowsScrollController.getItemOffset(focusedRowIndex);
      const triggerUpdateFocusedRow = () => {
        if (this.getDataController().totalCount() && !this.getDataController().items().length) {
          return;
        }
        this.component.off('contentReady', triggerUpdateFocusedRow);
        if (needFocusRow) {
          this._triggerUpdateFocusedRow(key, deferred);
        } else {
          deferred.resolve(focusedRowIndex);
        }
      };
      this.component.on('contentReady', triggerUpdateFocusedRow);
      // @ts-expect-error
      this.getView('rowsView').scrollTopPosition(offset);
    } else {
      deferred.resolve(-1);
    }
  }
  _triggerUpdateFocusedRow(key, deferred) {
    const focusedRowIndex = this.getFocusedRowIndexByKey(key);
    if (this._isValidFocusedRowIndex(focusedRowIndex)) {
      let d;
      if (this.option('focusedRowEnabled')) {
        this.getDataController().updateItems({
          changeType: 'updateFocusedRow',
          focusedRowKey: key
        });
      } else {
        // TODO getView
        // @ts-expect-error
        d = this.getView('rowsView').scrollToRowElement(key);
      }
      (0, _deferred.when)(d).done(() => {
        this.getKeyboardController().setFocusedRowIndex(focusedRowIndex);
        deferred && deferred.resolve(focusedRowIndex);
      });
    } else {
      deferred && deferred.resolve(-1);
    }
  }
  getFocusedRowIndexByKey(key) {
    const loadedRowIndex = this.getDataController().getRowIndexByKey(key, true);
    return loadedRowIndex >= 0 ? loadedRowIndex + this.getDataController().getRowIndexOffset(true) : -1;
  }
  _focusRowByKeyOrIndex() {
    const focusedRowKey = this.option('focusedRowKey');
    let currentFocusedRowIndex = this.option('focusedRowIndex');
    if ((0, _type.isDefined)(focusedRowKey)) {
      const visibleRowIndex = this.getDataController().getRowIndexByKey(focusedRowKey);
      if (visibleRowIndex >= 0) {
        if (this.getKeyboardController()._isVirtualScrolling()) {
          currentFocusedRowIndex = visibleRowIndex + this.getDataController().getRowIndexOffset();
        }
        this.getKeyboardController().setFocusedRowIndex(currentFocusedRowIndex);
        this._triggerUpdateFocusedRow(focusedRowKey);
      } else {
        this._navigateToRow(focusedRowKey, true).done(focusedRowIndex => {
          if (currentFocusedRowIndex >= 0 && focusedRowIndex < 0) {
            this._focusRowByIndex();
          } else if (currentFocusedRowIndex < 0 && focusedRowIndex >= 0) {
            this.getKeyboardController().setFocusedRowIndex(focusedRowIndex);
          }
        });
      }
    } else if (currentFocusedRowIndex >= 0) {
      this._focusRowByIndex(currentFocusedRowIndex);
    }
  }
  isRowFocused(key) {
    const focusedRowKey = this.option('focusedRowKey');
    if ((0, _type.isDefined)(focusedRowKey)) {
      return (0, _common.equalByValue)(key, this.option('focusedRowKey'));
    }
    return undefined;
  }
  updateFocusedRow(e) {
    const that = this;
    const focusedRowIndex = e.focusedRowIndex ?? that.getDataController().getRowIndexByKey(e.focusedRowKey);
    const rowsView = that.getView('rowsView');
    let $tableElement;
    let $mainRow;
    (0, _iterator.each)(rowsView.getTableElements(), (index, element) => {
      const isMainTable = index === 0;
      $tableElement = (0, _renderer.default)(element);
      that._clearPreviousFocusedRow($tableElement, focusedRowIndex);
      const $row = that._prepareFocusedRow({
        changedItem: that.getDataController().getVisibleRows()[focusedRowIndex],
        $tableElement,
        focusedRowIndex
      });
      if (isMainTable) {
        $mainRow = $row;
      }
    });
    if (!e.preventScroll && $mainRow) {
      // @ts-expect-error
      rowsView.scrollToElementVertically($mainRow);
    }
  }
  _clearPreviousFocusedRow($tableElement, focusedRowIndex) {
    const isNotMasterDetailFocusedRow = (_, focusedRow) => {
      const $focusedRowTable = (0, _renderer.default)(focusedRow).closest(`.${this.addWidgetPrefix(TABLE_POSTFIX_CLASS)}`);
      return $tableElement.is($focusedRowTable);
    };
    const $prevRowFocusedElement = $tableElement.find(FOCUSED_ROW_SELECTOR).filter(isNotMasterDetailFocusedRow);
    $prevRowFocusedElement.removeClass(ROW_FOCUSED_CLASS).removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr('tabindex');
    $prevRowFocusedElement.children('td').removeAttr('tabindex');
    if (focusedRowIndex !== 0) {
      const $firstRow = (0, _renderer.default)(this.getView('rowsView').getRowElement(0));
      $firstRow.removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr('tabIndex');
    }
  }
  _prepareFocusedRow(options) {
    let $row;
    const {
      changedItem
    } = options;
    if (changedItem && (changedItem.rowType === 'data' || changedItem.rowType === 'group')) {
      const {
        focusedRowIndex
      } = options;
      const {
        $tableElement
      } = options;
      const tabIndex = this.option('tabindex') || 0;
      const rowsView = this.getView('rowsView');
      $row = (0, _renderer.default)(rowsView._getRowElements($tableElement).eq(focusedRowIndex));
      $row.addClass(ROW_FOCUSED_CLASS).attr('tabindex', tabIndex);
    }
    return $row;
  }
}
exports.FocusController = FocusController;
const keyboardNavigation = Base => class FocusKeyboardNavigationExtender extends Base {
  init() {
    const rowIndex = this.option('focusedRowIndex');
    const columnIndex = this.option('focusedColumnIndex');
    this.createAction('onFocusedRowChanging', {
      excludeValidators: ['disabled', 'readOnly']
    });
    this.createAction('onFocusedRowChanged', {
      excludeValidators: ['disabled', 'readOnly']
    });
    this.createAction('onFocusedCellChanging', {
      excludeValidators: ['disabled', 'readOnly']
    });
    this.createAction('onFocusedCellChanged', {
      excludeValidators: ['disabled', 'readOnly']
    });
    super.init();
    this.setRowFocusType();
    this._focusedCellPosition = {};
    if ((0, _type.isDefined)(rowIndex) && rowIndex >= 0) {
      this._focusedCellPosition.rowIndex = rowIndex;
    }
    if ((0, _type.isDefined)(columnIndex) && columnIndex >= 0) {
      this._focusedCellPosition.columnIndex = columnIndex;
    }
  }
  setFocusedRowIndex(rowIndex) {
    super.setFocusedRowIndex(rowIndex);
    this.option('focusedRowIndex', rowIndex);
  }
  setFocusedColumnIndex(columnIndex) {
    super.setFocusedColumnIndex(columnIndex);
    this.option('focusedColumnIndex', columnIndex);
  }
  _escapeKeyHandler(eventArgs, isEditing) {
    if (isEditing || !this.option('focusedRowEnabled')) {
      return super._escapeKeyHandler(eventArgs, isEditing);
    }
    if (this.isCellFocusType()) {
      this.setRowFocusType();
      this._focus(this._getCellElementFromTarget(eventArgs.originalEvent.target), true);
      return true;
    }
    return false;
  }
  _updateFocusedCellPosition($cell, direction) {
    const position = super._updateFocusedCellPosition($cell, direction);
    if (position && position.columnIndex >= 0) {
      this._fireFocusedCellChanged($cell);
    }
    return position;
  }
};
const editorFactory = Base => class FocusEditorFactoryExtender extends Base {
  renderFocusOverlay($element, isHideBorder) {
    var _this$_keyboardNaviga;
    const focusedRowEnabled = this.option('focusedRowEnabled');
    let $cell;
    if (!focusedRowEnabled || !((_this$_keyboardNaviga = this._keyboardNavigationController) !== null && _this$_keyboardNaviga !== void 0 && _this$_keyboardNaviga.isRowFocusType()) || this._editingController.isEditing()) {
      super.renderFocusOverlay($element, isHideBorder);
    } else if (focusedRowEnabled) {
      const isRowElement = this._keyboardNavigationController._getElementType($element) === 'row';
      if (isRowElement && !$element.hasClass(ROW_FOCUSED_CLASS)) {
        $cell = this._keyboardNavigationController.getFirstValidCellInRow($element);
        this._keyboardNavigationController.focus($cell);
      }
    }
  }
};
const columns = Base => class FocusColumnsExtender extends Base {
  getSortDataSourceParameters(_, sortByKey) {
    // @ts-expect-error
    let result = super.getSortDataSourceParameters.apply(this, arguments);
    const dataSource = this._dataController._dataSource;
    const store = this._dataController.store();
    let key = store && store.key();
    const remoteOperations = dataSource && dataSource.remoteOperations() || {};
    const isLocalOperations = Object.keys(remoteOperations).every(operationName => !remoteOperations[operationName]);
    if (key && (this.option('focusedRowEnabled') && this._focusController.isAutoNavigateToFocusedRow() !== false || sortByKey)) {
      key = Array.isArray(key) ? key : [key];
      const notSortedKeys = key.filter(key => !this.columnOption(key, 'sortOrder'));
      if (notSortedKeys.length) {
        result = result || [];
        if (isLocalOperations) {
          result.push({
            selector: dataSource.getDataIndexGetter(),
            desc: false
          });
        } else {
          notSortedKeys.forEach(notSortedKey => result.push({
            selector: notSortedKey,
            desc: false
          }));
        }
      }
    }
    return result;
  }
};
const data = Base => class FocusDataControllerExtender extends Base {
  _applyChange(change) {
    if (change && change.changeType === 'updateFocusedRow') return;
    // @ts-expect-error
    return super._applyChange.apply(this, arguments);
  }
  _fireChanged(e) {
    super._fireChanged(e);
    if (this.option('focusedRowEnabled') && this._dataSource) {
      const isPartialUpdate = e.changeType === 'update' && e.repaintChangesOnly;
      const isPartialUpdateWithDeleting = isPartialUpdate && e.changeTypes && e.changeTypes.indexOf('remove') >= 0;
      if (e.changeType === 'refresh' && e.items.length || isPartialUpdateWithDeleting) {
        this._updatePageIndexes();
        this._updateFocusedRow(e);
      } else if (e.changeType === 'append' || e.changeType === 'prepend') {
        this._updatePageIndexes();
      } else if (e.changeType === 'update' && e.repaintChangesOnly) {
        this._updateFocusedRow(e);
      }
    }
  }
  _updatePageIndexes() {
    const prevRenderingPageIndex = this._lastRenderingPageIndex || 0;
    const renderingPageIndex = this._rowsScrollController ? this._rowsScrollController.pageIndex() : 0;
    this._lastRenderingPageIndex = renderingPageIndex;
    this._isPagingByRendering = renderingPageIndex !== prevRenderingPageIndex;
  }
  isPagingByRendering() {
    return this._isPagingByRendering;
  }
  _updateFocusedRow(e) {
    const operationTypes = e.operationTypes || {};
    const {
      reload,
      fullReload,
      pageIndex,
      paging
    } = operationTypes;
    const isVirtualScrolling = this._keyboardNavigationController._isVirtualScrolling();
    const pagingWithoutVirtualScrolling = paging && !isVirtualScrolling;
    const focusedRowKey = this.option('focusedRowKey');
    const isAutoNavigate = this._focusController.isAutoNavigateToFocusedRow();
    const isReload = reload && pageIndex === false;
    if (isReload && !fullReload && (0, _type.isDefined)(focusedRowKey)) {
      this._focusController._navigateToRow(focusedRowKey, true).done(focusedRowIndex => {
        if (focusedRowIndex < 0) {
          this._focusController._focusRowByIndex(undefined, operationTypes);
        }
      });
    } else if (pagingWithoutVirtualScrolling && isAutoNavigate) {
      const rowIndexByKey = this.getRowIndexByKey(focusedRowKey);
      const focusedRowIndex = this.option('focusedRowIndex');
      const isValidRowIndexByKey = rowIndexByKey >= 0;
      const isValidFocusedRowIndex = focusedRowIndex >= 0;
      const isSameRowIndex = focusedRowIndex === rowIndexByKey;
      if (isValidFocusedRowIndex && (isSameRowIndex || !isValidRowIndexByKey)) {
        this._focusController._focusRowByIndex(focusedRowIndex, operationTypes);
      }
    } else if (pagingWithoutVirtualScrolling && !isAutoNavigate && this.getRowIndexByKey(focusedRowKey) < 0) {
      this.option('focusedRowIndex', -1);
    } else if (operationTypes.fullReload) {
      this._focusController._focusRowByKeyOrIndex();
    }
  }
  /**
   * @extended: TreeList's focus
   */
  getPageIndexByKey(key) {
    const that = this;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    that.getGlobalRowIndexByKey(key).done(globalIndex => {
      d.resolve(globalIndex >= 0 ? Math.floor(globalIndex / that.pageSize()) : -1);
    }).fail(d.reject);
    return d.promise();
  }
  getGlobalRowIndexByKey(key) {
    if (this._dataSource.group()) {
      // @ts-expect-error
      return this._calculateGlobalRowIndexByGroupedData(key);
    }
    // @ts-expect-error
    return this._calculateGlobalRowIndexByFlatData(key);
  }
  _calculateGlobalRowIndexByFlatData(key, groupFilter, useGroup) {
    const that = this;
    // @ts-expect-error
    const deferred = new _deferred.Deferred();
    const dataSource = that._dataSource;
    if (Array.isArray(key) || (0, _m_editing_utils.isNewRowTempKey)(key)) {
      return deferred.resolve(-1).promise();
    }
    let filter = that._generateFilterByKey(key);
    dataSource.load({
      filter: that._concatWithCombinedFilter(filter),
      skip: 0,
      take: 1
    }).done(data => {
      if (data.length > 0) {
        filter = that._generateOperationFilterByKey(key, data[0], useGroup);
        dataSource.load({
          filter: that._concatWithCombinedFilter(filter, groupFilter),
          skip: 0,
          take: 1,
          requireTotalCount: true
        }).done((_, extra) => {
          deferred.resolve(extra.totalCount);
        });
      } else {
        deferred.resolve(-1);
      }
    });
    return deferred.promise();
  }
  _concatWithCombinedFilter(filter, groupFilter) {
    const combinedFilter = this.getCombinedFilter();
    return _m_utils.default.combineFilters([filter, combinedFilter, groupFilter]);
  }
  _generateBooleanFilter(selector, value, sortInfo) {
    const {
      desc
    } = sortInfo;
    switch (true) {
      case value === false && desc:
        return [selector, '=', true];
      case value === false && !desc:
        return [selector, '=', null];
      case value === true && !desc:
      case !(0, _type.isBoolean)(value) && desc:
        return [selector, '<>', value];
      default:
        return undefined;
    }
  }
  // TODO Vinogradov: Move this method implementation to the UiGridCoreFocusUtils
  // and cover with unit tests.
  _generateOperationFilterByKey(key, rowData, useGroup) {
    const that = this;
    const dateSerializationFormat = that.option('dateSerializationFormat');
    const isRemoteFiltering = that._dataSource.remoteOperations().filtering;
    const isRemoteSorting = that._dataSource.remoteOperations().sorting;
    let filter = that._generateFilterByKey(key, '<');
    // @ts-expect-error
    let sort = that._columnsController.getSortDataSourceParameters(!isRemoteFiltering, true);
    if (useGroup) {
      const group = that._columnsController.getGroupDataSourceParameters(!isRemoteFiltering);
      if (group) {
        sort = sort ? group.concat(sort) : group;
      }
    }
    if (sort) {
      sort.slice().reverse().forEach(sortInfo => {
        const {
          selector,
          desc,
          compare
        } = sortInfo;
        const {
          getter,
          rawValue,
          safeValue
        } = _m_focus_utils.UiGridCoreFocusUtils.getSortFilterValue(sortInfo, rowData, {
          isRemoteFiltering,
          dateSerializationFormat,
          getSelector: selector => that._columnsController.columnOption(selector, 'selector')
        });
        filter = [[selector, '=', safeValue], 'and', filter];
        if (rawValue === null || (0, _type.isBoolean)(rawValue)) {
          const booleanFilter = that._generateBooleanFilter(selector, safeValue, desc);
          if (booleanFilter) {
            filter = [booleanFilter, 'or', filter];
          }
        } else {
          const filterOperation = desc ? '>' : '<';
          let sortFilter;
          if (compare && !isRemoteSorting) {
            sortFilter = data => {
              if (filterOperation === '<') {
                return compare(rawValue, getter(data)) >= 1;
              }
              return compare(rawValue, getter(data)) <= -1;
            };
          } else {
            sortFilter = [selector, filterOperation, safeValue];
            if (!desc) {
              sortFilter = [sortFilter, 'or', [selector, '=', null]];
            }
          }
          filter = [sortFilter, 'or', filter];
        }
      });
    }
    return filter;
  }
  _generateFilterByKey(key, operation) {
    const dataSourceKey = this._dataSource.key();
    let filter = [];
    if (!operation) {
      operation = '=';
    }
    if (Array.isArray(dataSourceKey)) {
      for (let i = 0; i < dataSourceKey.length; ++i) {
        const keyPart = key[dataSourceKey[i]];
        if (keyPart) {
          if (filter.length > 0) {
            filter.push('and');
          }
          filter.push([dataSourceKey[i], operation, keyPart]);
        }
      }
    } else {
      filter = [dataSourceKey, operation, key];
    }
    return filter;
  }
  _getLastItemIndex() {
    return this.items(true).length - 1;
  }
};
const editing = Base => class FocusEditingControllerExtender extends Base {
  _deleteRowCore(rowIndex) {
    // @ts-expect-error
    const deferred = super._deleteRowCore.apply(this, arguments);
    const rowKey = this._dataController.getKeyByRowIndex(rowIndex);
    deferred.done(() => {
      const rowIndex = this._dataController.getRowIndexByKey(rowKey);
      const visibleRows = this._dataController.getVisibleRows();
      if (rowIndex === -1 && !visibleRows.length) {
        this._focusController._resetFocusedRow();
      }
    });
  }
};
const rowsView = Base => class RowsViewFocusController extends Base {
  _createRow(row) {
    // @ts-expect-error
    const $row = super._createRow.apply(this, arguments);
    if (this.option('focusedRowEnabled') && row) {
      if (this._focusController.isRowFocused(row.key)) {
        $row.addClass(ROW_FOCUSED_CLASS);
      }
    }
    return $row;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _checkRowKeys(options) {
    // @ts-expect-error
    super._checkRowKeys.apply(this, arguments);
    if (this.option('focusedRowEnabled') && this.option('dataSource')) {
      const store = this._dataController.store();
      if (store && !store.key()) {
        this._dataController.fireError('E1042', 'Row focusing');
      }
    }
  }
  _update(change) {
    if (change.changeType === 'updateFocusedRow') {
      if (this.option('focusedRowEnabled')) {
        this._focusController.updateFocusedRow(change);
      }
    } else {
      super._update(change);
    }
  }
  updateFocusElementTabIndex($cellElements, preventScroll) {
    if (this.option('focusedRowEnabled')) {
      this._setFocusedRowElementTabIndex(preventScroll);
    } else {
      // @ts-expect-error
      super.updateFocusElementTabIndex($cellElements);
    }
  }
  _setFocusedRowElementTabIndex(preventScroll) {
    const focusedRowKey = this.option('focusedRowKey');
    const tabIndex = this.option('tabIndex') ?? 0;
    const columnsController = this._columnsController;
    let rowIndex = this._dataController.getRowIndexByKey(focusedRowKey);
    let columnIndex = this.option('focusedColumnIndex');
    const $row = this._findRowElementForTabIndex();
    const dataSource = this._dataController.dataSource();
    const operationTypes = dataSource === null || dataSource === void 0 ? void 0 : dataSource.operationTypes();
    const isPaging = !operationTypes || operationTypes.paging;
    if (!(0, _type.isDefined)(this._scrollToFocusOnResize)) {
      this._scrollToFocusOnResize = () => {
        this.scrollToElementVertically(this._findRowElementForTabIndex());
        this.resizeCompleted.remove(this._scrollToFocusOnResize);
      };
    }
    $row.attr('tabIndex', tabIndex);
    const rowIndexFromOption = this.option('focusedRowIndex') - this._dataController.getRowIndexOffset(true);
    if (!isPaging && rowIndex < 0 && rowIndexFromOption >= 0) {
      this._focusController.updateFocusedRow({
        focusedRowIndex: rowIndexFromOption,
        preventScroll
      });
    }
    if (rowIndex >= 0 && !preventScroll) {
      if (columnIndex < 0) {
        columnIndex = 0;
      }
      rowIndex += this._dataController.getRowIndexOffset();
      columnIndex += columnsController.getColumnIndexOffset();
      this._keyboardNavigationController.setFocusedCellPosition(rowIndex, columnIndex);
      if (this._focusController.isAutoNavigateToFocusedRow()) {
        // @ts-expect-error
        if (!isPaging && !this._dataController.isPagingByRendering()) {
          this.resizeCompleted.remove(this._scrollToFocusOnResize);
          this.resizeCompleted.add(this._scrollToFocusOnResize);
        }
      }
    }
  }
  _findRowElementForTabIndex() {
    const focusedRowKey = this.option('focusedRowKey');
    const rowIndex = this._dataController.getRowIndexByKey(focusedRowKey);
    return (0, _renderer.default)(this.getRowElement(rowIndex >= 0 ? rowIndex : 0));
  }
  scrollToRowElement(key) {
    const rowIndex = this._dataController.getRowIndexByKey(key);
    // @ts-expect-error
    const $row = (0, _renderer.default)(this.getRow(rowIndex));
    return this.scrollToElementVertically($row);
  }
  scrollToElementVertically($row) {
    const scrollable = this.getScrollable();
    if (scrollable && $row.length) {
      const position = scrollable.getScrollElementPosition($row, 'vertical');
      return this.scrollTopPosition(position);
    }
    // @ts-expect-error
    return new _deferred.Deferred().resolve();
  }
  scrollTopPosition(scrollTop) {
    // @ts-expect-error
    const d = new _deferred.Deferred();
    const scrollable = this.getScrollable();
    if (scrollable) {
      const currentScrollTop = scrollable.scrollTop();
      const scrollHandler = () => {
        scrollable.off('scroll', scrollHandler);
        d.resolve();
      };
      if (scrollTop !== currentScrollTop) {
        scrollable.on('scroll', scrollHandler);
        this._dataController.resetFilterApplying();
        scrollable.scrollTo({
          top: scrollTop
        });
        return d.promise();
      }
    }
    return d.resolve();
  }
};
const focusModule = exports.focusModule = {
  defaultOptions() {
    return {
      focusedRowEnabled: false,
      autoNavigateToFocusedRow: true,
      focusedRowKey: null,
      focusedRowIndex: -1,
      focusedColumnIndex: -1
    };
  },
  controllers: {
    focus: FocusController
  },
  extenders: {
    controllers: {
      keyboardNavigation,
      editorFactory,
      columns,
      data,
      editing
    },
    views: {
      rowsView
    }
  }
};
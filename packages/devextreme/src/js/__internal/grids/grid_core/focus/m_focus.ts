import $ from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import { Deferred, when } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { isBoolean, isDefined } from '@js/core/utils/type';

import { isNewRowTempKey } from '../editing/m_editing_utils';
import core from '../m_modules';
import gridCoreUtils from '../m_utils';
import { UiGridCoreFocusUtils } from './m_focus_utils';

const ROW_FOCUSED_CLASS = 'dx-row-focused';
const FOCUSED_ROW_SELECTOR = `.dx-row.${ROW_FOCUSED_CLASS}`;
const TABLE_POSTFIX_CLASS = 'table';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';

const FocusController = core.ViewController.inherit((function () {
  /**
     * @type {Partial<import('./ui.grid_core.focus').FocusController>}
     */
  const members = {
    init() {
      this._dataController = this.getController('data');
      this._keyboardController = this.getController('keyboardNavigation');
      this.component._optionsByReference.focusedRowKey = true;
    },

    optionChanged(args) {
      const { name, value, previousValue } = args;

      switch (name) {
        case 'focusedRowIndex':
          this._focusRowByIndex(value);
          this._keyboardController._fireFocusedRowChanged();
          args.handled = true;
          break;
        case 'focusedRowKey':
          if (Array.isArray(value) && JSON.stringify(value) === JSON.stringify(previousValue)) {
            return;
          }

          this._focusRowByKey(value);
          this._keyboardController._fireFocusedRowChanged();
          args.handled = true;
          break;

        case 'focusedColumnIndex':
        case 'focusedRowEnabled':
        case 'autoNavigateToFocusedRow':
          args.handled = true;
          break;

        default:
          this.callBase(args);
          break;
      }
    },

    isAutoNavigateToFocusedRow() {
      return this.option('scrolling.mode') !== 'infinite' && this.option('autoNavigateToFocusedRow');
    },

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
    },
    _focusRowByIndexCore(index, operationTypes) {
      const dataController = this.getController('data');
      const pageSize = dataController.pageSize();
      const setKeyByIndex = () => {
        if (this._isValidFocusedRowIndex(index)) {
          let rowIndex = index - dataController.getRowIndexOffset(true);

          if (!operationTypes || operationTypes.paging && !operationTypes.filtering) {
            const lastItemIndex = dataController._getLastItemIndex();
            rowIndex = Math.min(rowIndex, lastItemIndex);
          }

          const focusedRowKey = dataController.getKeyByRowIndex(rowIndex, true);

          if (isDefined(focusedRowKey) && !this.isRowFocused(focusedRowKey)) {
            this.option('focusedRowKey', focusedRowKey);
          }
        }
      };

      if (pageSize >= 0) {
        if (!this._isLocalRowIndex(index)) {
          const pageIndex = Math.floor(index / dataController.pageSize());
          when(dataController.pageIndex(pageIndex), dataController.waitReady()).done(() => {
            setKeyByIndex();
          });
        } else {
          setKeyByIndex();
        }
      }
    },
    _isLocalRowIndex(index) {
      const dataController = this.getController('data');
      const isVirtualScrolling = this.getController('keyboardNavigation')._isVirtualScrolling();

      if (isVirtualScrolling) {
        const pageIndex = Math.floor(index / dataController.pageSize());
        const virtualItems = dataController.virtualItemsCount();
        const virtualItemsBegin = virtualItems ? virtualItems.begin : -1;
        const visibleRowsCount = dataController.getVisibleRows().length + dataController.getRowIndexOffset();
        const visiblePagesCount = Math.ceil(visibleRowsCount / dataController.pageSize());

        return virtualItemsBegin <= index && visiblePagesCount > pageIndex;
      }

      return true;
    },
    _setFocusedRowKeyByIndex(index) {
      const dataController = this.getController('data');
      if (this._isValidFocusedRowIndex(index)) {
        const rowIndex = Math.min(index - dataController.getRowIndexOffset(), dataController.items().length - 1);
        const focusedRowKey = dataController.getKeyByRowIndex(rowIndex);

        if (isDefined(focusedRowKey) && !this.isRowFocused(focusedRowKey)) {
          this.option('focusedRowKey', focusedRowKey);
        }
      }
    },

    _focusRowByKey(key) {
      if (!isDefined(key)) {
        this._resetFocusedRow();
      } else {
        this._navigateToRow(key, true);
      }
    },

    _resetFocusedRow() {
      const focusedRowKey = this.option('focusedRowKey');
      const isFocusedRowKeyDefined = isDefined(focusedRowKey);

      if (!isFocusedRowKeyDefined && this.option('focusedRowIndex') < 0) {
        return;
      }

      const keyboardController = this.getController('keyboardNavigation');

      if (isFocusedRowKeyDefined) {
        this.option('focusedRowKey', null);
      }
      keyboardController.setFocusedRowIndex(-1);
      this.option('focusedRowIndex', -1);
      this.getController('data').updateItems({
        changeType: 'updateFocusedRow',
        focusedRowKey: null,
      });

      keyboardController._fireFocusedRowChanged(undefined, -1);
    },

    _isValidFocusedRowIndex(rowIndex) {
      const dataController = this.getController('data');
      const row = dataController.getVisibleRows()[rowIndex];

      return !row || row.rowType === 'data' || row.rowType === 'group';
    },

    publicMethods() {
      return ['navigateToRow', 'isRowFocused'];
    },

    navigateToRow(key) {
      if (!this.isAutoNavigateToFocusedRow()) {
        this.option('focusedRowIndex', -1);
      }
      return this._navigateToRow(key);
    },
    _navigateToRow(key, needFocusRow) {
      const that = this;
      const dataController = that.getController('data');
      const isAutoNavigate = that.isAutoNavigateToFocusedRow();
      // @ts-expect-error
      const d = new Deferred();

      if (key === undefined || !dataController.dataSource()) {
        return d.reject().promise();
      }

      const rowIndexByKey = that.getFocusedRowIndexByKey(key);

      if (!isAutoNavigate && needFocusRow || rowIndexByKey >= 0) {
        that._navigateTo(key, d, needFocusRow);
      } else {
        dataController.getPageIndexByKey(key).done((pageIndex) => {
          if (pageIndex < 0) {
            d.resolve(-1);
            return;
          }
          if (pageIndex === dataController.pageIndex()) {
            dataController.reload().done(() => {
              if (that.isRowFocused(key) && dataController.getRowIndexByKey(key) >= 0) {
                d.resolve(that.getFocusedRowIndexByKey(key));
              } else {
                that._navigateTo(key, d, needFocusRow);
              }
            }).fail(d.reject);
          } else {
            dataController.pageIndex(pageIndex).done(() => {
              that._navigateTo(key, d, needFocusRow);
            }).fail(d.reject);
          }
        }).fail(d.reject);
      }

      return d.promise();
    },
    _navigateTo(key, deferred, needFocusRow) {
      const visibleRowIndex = this.getController('data').getRowIndexByKey(key);
      const isVirtualRowRenderingMode = gridCoreUtils.isVirtualRowRendering(this);
      const isAutoNavigate = this.isAutoNavigateToFocusedRow();

      if (isAutoNavigate && isVirtualRowRenderingMode && visibleRowIndex < 0) {
        this._navigateToVirtualRow(key, deferred, needFocusRow);
      } else {
        this._navigateToVisibleRow(key, deferred, needFocusRow);
      }
    },
    _navigateToVisibleRow(key, deferred, needFocusRow) {
      if (needFocusRow) {
        this._triggerUpdateFocusedRow(key, deferred);
      } else {
        const focusedRowIndex = this.getFocusedRowIndexByKey(key);
        this.getView('rowsView').scrollToRowElement(key, deferred).done(() => {
          deferred.resolve(focusedRowIndex);
        });
      }
    },
    _navigateToVirtualRow(key, deferred, needFocusRow) {
      const dataController = this.getController('data');
      const rowsScrollController = dataController._rowsScrollController;
      const rowIndex = gridCoreUtils.getIndexByKey(key, dataController.items(true));
      const scrollable = this.getView('rowsView').getScrollable();

      if (rowsScrollController && scrollable && rowIndex >= 0) {
        const focusedRowIndex = rowIndex + dataController.getRowIndexOffset(true);
        const offset = rowsScrollController.getItemOffset(focusedRowIndex);

        const triggerUpdateFocusedRow = () => {
          if (dataController.totalCount() && !dataController.items().length) {
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

        this.getView('rowsView').scrollTopPosition(offset);
      } else {
        deferred.resolve(-1);
      }
    },

    _triggerUpdateFocusedRow(key, deferred) {
      const dataController = this.getController('data');
      const focusedRowIndex = this.getFocusedRowIndexByKey(key);

      if (this._isValidFocusedRowIndex(focusedRowIndex)) {
        let d;

        if (this.option('focusedRowEnabled')) {
          dataController.updateItems({
            changeType: 'updateFocusedRow',
            focusedRowKey: key,
          });
        } else {
          d = this.getView('rowsView').scrollToRowElement(key);
        }

        when(d).done(() => {
          this.getController('keyboardNavigation').setFocusedRowIndex(focusedRowIndex);

          deferred && deferred.resolve(focusedRowIndex);
        });
      } else {
        deferred && deferred.resolve(-1);
      }
    },

    getFocusedRowIndexByKey(key) {
      const dataController = this.getController('data');
      const loadedRowIndex = dataController.getRowIndexByKey(key, true);
      return loadedRowIndex >= 0 ? loadedRowIndex + dataController.getRowIndexOffset(true) : -1;
    },

    _focusRowByKeyOrIndex() {
      const focusedRowKey = this.option('focusedRowKey');
      let currentFocusedRowIndex = this.option('focusedRowIndex');
      const keyboardController = this.getController('keyboardNavigation');
      const dataController = this.getController('data');

      if (isDefined(focusedRowKey)) {
        const visibleRowIndex = dataController.getRowIndexByKey(focusedRowKey);
        if (visibleRowIndex >= 0) {
          if (keyboardController._isVirtualScrolling()) {
            currentFocusedRowIndex = visibleRowIndex + dataController.getRowIndexOffset();
          }
          keyboardController.setFocusedRowIndex(currentFocusedRowIndex);
          this._triggerUpdateFocusedRow(focusedRowKey);
        } else {
          this._navigateToRow(focusedRowKey, true).done((focusedRowIndex) => {
            if (currentFocusedRowIndex >= 0 && focusedRowIndex < 0) {
              this._focusRowByIndex();
            } else if (currentFocusedRowIndex < 0 && focusedRowIndex >= 0) {
              keyboardController.setFocusedRowIndex(focusedRowIndex);
            }
          });
        }
      } else if (currentFocusedRowIndex >= 0) {
        this.getController('focus')._focusRowByIndex(currentFocusedRowIndex);
      }
    },

    isRowFocused(key) {
      const focusedRowKey = this.option('focusedRowKey');

      if (isDefined(focusedRowKey)) {
        return equalByValue(key, this.option('focusedRowKey'));
      }

      return undefined;
    },

    updateFocusedRow({ focusedRowKey }) {
      const that = this;
      const focusedRowIndex = that._dataController.getRowIndexByKey(focusedRowKey);
      const rowsView = that.getView('rowsView');
      let $tableElement;

      let $mainRow;

      each(rowsView.getTableElements(), (index, element) => {
        const isMainTable = index === 0;
        $tableElement = $(element);

        that._clearPreviousFocusedRow($tableElement, focusedRowIndex);

        const $row = that._prepareFocusedRow({
          changedItem: that._dataController.getVisibleRows()[focusedRowIndex],
          $tableElement,
          focusedRowIndex,
        });

        if (isMainTable) {
          $mainRow = $row;
        }
      });

      $mainRow && rowsView.scrollToElementVertically($mainRow);
    },
    _clearPreviousFocusedRow($tableElement, focusedRowIndex) {
      const isNotMasterDetailFocusedRow = (_, focusedRow) => {
        const $focusedRowTable = $(focusedRow).closest(`.${this.addWidgetPrefix(TABLE_POSTFIX_CLASS)}`);
        return $tableElement.is($focusedRowTable);
      };

      const $prevRowFocusedElement = $tableElement
        .find(FOCUSED_ROW_SELECTOR)
        .filter(isNotMasterDetailFocusedRow);

      $prevRowFocusedElement
        .removeClass(ROW_FOCUSED_CLASS)
        .removeClass(CELL_FOCUS_DISABLED_CLASS)
        .removeAttr('tabindex');
      $prevRowFocusedElement.children('td').removeAttr('tabindex');
      if (focusedRowIndex !== 0) {
        const $firstRow = $(this.getView('rowsView').getRowElement(0));
        $firstRow.removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr('tabIndex');
      }
    },

    _prepareFocusedRow(options) {
      let $row;
      const { changedItem } = options;

      if (changedItem && (changedItem.rowType === 'data' || changedItem.rowType === 'group')) {
        const { focusedRowIndex } = options;
        const { $tableElement } = options;
        const tabIndex = this.option('tabindex') || 0;
        const rowsView = this.getView('rowsView');

        $row = $(rowsView._getRowElements($tableElement).eq(focusedRowIndex));
        $row.addClass(ROW_FOCUSED_CLASS).attr('tabindex', tabIndex);
      }

      return $row;
    },
  };

  return members;
})());

/**
 * @type {import('./ui.grid_core.modules').Module}
 */
export const focusModule = {
  defaultOptions() {
    return {
      focusedRowEnabled: false,

      autoNavigateToFocusedRow: true,

      focusedRowKey: null,

      focusedRowIndex: -1,

      focusedColumnIndex: -1,
    };
  },

  controllers: {
    focus: FocusController,
  },

  extenders: {
    controllers: {
      keyboardNavigation: {
        init() {
          const rowIndex = this.option('focusedRowIndex');
          const columnIndex = this.option('focusedColumnIndex');

          this.createAction('onFocusedRowChanging', { excludeValidators: ['disabled', 'readOnly'] });
          this.createAction('onFocusedRowChanged', { excludeValidators: ['disabled', 'readOnly'] });

          this.createAction('onFocusedCellChanging', { excludeValidators: ['disabled', 'readOnly'] });
          this.createAction('onFocusedCellChanged', { excludeValidators: ['disabled', 'readOnly'] });

          this.callBase();

          this.setRowFocusType();

          this._focusedCellPosition = {};
          if (isDefined(rowIndex) && rowIndex >= 0) {
            this._focusedCellPosition.rowIndex = rowIndex;
          }
          if (isDefined(columnIndex) && columnIndex >= 0) {
            this._focusedCellPosition.columnIndex = columnIndex;
          }
        },

        setFocusedRowIndex(rowIndex) {
          this.callBase(rowIndex);
          this.option('focusedRowIndex', rowIndex);
        },

        setFocusedColumnIndex(columnIndex) {
          this.callBase(columnIndex);
          this.option('focusedColumnIndex', columnIndex);
        },

        _escapeKeyHandler(eventArgs, isEditing) {
          if (isEditing || !this.option('focusedRowEnabled')) {
            this.callBase(eventArgs, isEditing);
            return;
          }
          if (this.isCellFocusType()) {
            this.setRowFocusType();
            this._focus(this._getCellElementFromTarget(eventArgs.originalEvent.target), true);
          }
        },

        _updateFocusedCellPosition($cell, direction) {
          const position = this.callBase($cell, direction);

          if (position && position.columnIndex >= 0) {
            this._fireFocusedCellChanged($cell);
          }
        },
      },

      editorFactory: {
        renderFocusOverlay($element, isHideBorder) {
          const keyboardController = this.getController('keyboardNavigation');
          const focusedRowEnabled = this.option('focusedRowEnabled');
          const editingController = this.getController('editing');
          let $cell;

          if (!focusedRowEnabled || !keyboardController?.isRowFocusType() || editingController.isEditing()) {
            this.callBase($element, isHideBorder);
          } else if (focusedRowEnabled) {
            const isRowElement = keyboardController._getElementType($element) === 'row';

            if (isRowElement && !$element.hasClass(ROW_FOCUSED_CLASS)) {
              $cell = keyboardController.getFirstValidCellInRow($element);
              keyboardController.focus($cell);
            }
          }
        },
      },

      columns: {
        getSortDataSourceParameters(_, sortByKey) {
          let result = this.callBase.apply(this, arguments);
          const dataController = this.getController('data');
          const dataSource = dataController._dataSource;
          const store = dataController.store();
          let key = store && store.key();
          const remoteOperations = dataSource && dataSource.remoteOperations() || {};
          const isLocalOperations = Object.keys(remoteOperations).every((operationName) => !remoteOperations[operationName]);

          if (key && (this.option('focusedRowEnabled') && this.getController('focus').isAutoNavigateToFocusedRow() !== false || sortByKey)) {
            key = Array.isArray(key) ? key : [key];
            const notSortedKeys = key.filter((key) => !this.columnOption(key, 'sortOrder'));

            if (notSortedKeys.length) {
              result = result || [];
              if (isLocalOperations) {
                result.push({ selector: dataSource.getDataIndexGetter(), desc: false });
              } else {
                notSortedKeys.forEach((notSortedKey) => result.push({ selector: notSortedKey, desc: false }));
              }
            }
          }

          return result;
        },
      },

      data: {
        _applyChange(change) {
          if (change && change.changeType === 'updateFocusedRow') return;

          return this.callBase.apply(this, arguments);
        },

        _fireChanged(e) {
          this.callBase(e);

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
        },

        _updatePageIndexes() {
          const prevRenderingPageIndex = this._lastRenderingPageIndex || 0;
          const renderingPageIndex = this._rowsScrollController ? this._rowsScrollController.pageIndex() : 0;

          this._lastRenderingPageIndex = renderingPageIndex;
          this._isPagingByRendering = renderingPageIndex !== prevRenderingPageIndex;
        },

        isPagingByRendering() {
          return this._isPagingByRendering;
        },

        _updateFocusedRow(e) {
          const operationTypes = e.operationTypes || {};
          const focusController = this.getController('focus');
          const {
            reload, fullReload, pageIndex, paging,
          } = operationTypes;
          const keyboardController = this.getController('keyboardNavigation');
          const isVirtualScrolling = keyboardController._isVirtualScrolling();
          const pagingWithoutVirtualScrolling = paging && !isVirtualScrolling;
          const focusedRowKey = this.option('focusedRowKey');
          const isAutoNavigate = focusController.isAutoNavigateToFocusedRow();
          const isReload = reload && pageIndex === false;
          if (isReload && !fullReload && isDefined(focusedRowKey)) {
            focusController._navigateToRow(focusedRowKey, true)
              .done((focusedRowIndex) => {
                if (focusedRowIndex < 0) {
                  focusController._focusRowByIndex(undefined, operationTypes);
                }
              });
          } else if (pagingWithoutVirtualScrolling && isAutoNavigate) {
            const rowIndexByKey = this.getRowIndexByKey(focusedRowKey);
            const focusedRowIndex = this.option('focusedRowIndex');
            const isValidRowIndexByKey = rowIndexByKey >= 0;
            const isValidFocusedRowIndex = focusedRowIndex >= 0;
            const isSameRowIndex = focusedRowIndex === rowIndexByKey;
            if (isValidFocusedRowIndex && (isSameRowIndex || !isValidRowIndexByKey)) {
              focusController._focusRowByIndex(focusedRowIndex, operationTypes);
            }
          } else if (
            pagingWithoutVirtualScrolling
                        && !isAutoNavigate
                        && (this.getRowIndexByKey(focusedRowKey) < 0)
          ) {
            this.option('focusedRowIndex', -1);
          } else if (operationTypes.fullReload) {
            focusController._focusRowByKeyOrIndex();
          }
        },

        getPageIndexByKey(key) {
          const that = this;
          // @ts-expect-error
          const d = new Deferred();

          that.getGlobalRowIndexByKey(key).done((globalIndex) => {
            d.resolve(globalIndex >= 0 ? Math.floor(globalIndex / that.pageSize()) : -1);
          }).fail(d.reject);

          return d.promise();
        },
        getGlobalRowIndexByKey(key) {
          if (this._dataSource.group()) {
            return this._calculateGlobalRowIndexByGroupedData(key);
          }
          return this._calculateGlobalRowIndexByFlatData(key);
        },
        _calculateGlobalRowIndexByFlatData(key, groupFilter, useGroup) {
          const that = this;
          // @ts-expect-error
          const deferred = new Deferred();
          const dataSource = that._dataSource;

          if (Array.isArray(key) || isNewRowTempKey(key)) {
            return deferred.resolve(-1).promise();
          }

          let filter = that._generateFilterByKey(key);

          dataSource.load({
            filter: that._concatWithCombinedFilter(filter),
            skip: 0,
            take: 1,
          }).done((data) => {
            if (data.length > 0) {
              filter = that._generateOperationFilterByKey(key, data[0], useGroup);
              dataSource.load({
                filter: that._concatWithCombinedFilter(filter, groupFilter),
                skip: 0,
                take: 1,
                requireTotalCount: true,
              }).done((_, extra) => {
                deferred.resolve(extra.totalCount);
              });
            } else {
              deferred.resolve(-1);
            }
          });

          return deferred.promise();
        },
        _concatWithCombinedFilter(filter, groupFilter) {
          const combinedFilter = this.getCombinedFilter();
          return gridCoreUtils.combineFilters([filter, combinedFilter, groupFilter]);
        },
        _generateBooleanFilter(selector, value, sortInfo) {
          const { desc } = sortInfo;

          switch (true) {
            case value === false && desc:
              return [selector, '=', true];
            case value === false && !desc:
              return [selector, '=', null];
            case value === true && !desc:
            case !isBoolean(value) && desc:
              return [selector, '<>', value];
            default:
              return undefined;
          }
        },
        // TODO Vinogradov: Move this method implementation to the UiGridCoreFocusUtils
        // and cover with unit tests.
        _generateOperationFilterByKey(key, rowData, useGroup) {
          const that = this;
          const dateSerializationFormat = that.option('dateSerializationFormat');
          const isRemoteFiltering = that._dataSource.remoteOperations().filtering;

          let filter = that._generateFilterByKey(key, '<');
          let sort = that._columnsController.getSortDataSourceParameters(!isRemoteFiltering, true);

          if (useGroup) {
            const group = that._columnsController.getGroupDataSourceParameters(!isRemoteFiltering);
            if (group) {
              sort = sort ? group.concat(sort) : group;
            }
          }

          if (sort) {
            sort.slice().reverse().forEach((sortInfo) => {
              const { selector, desc, compare } = sortInfo;
              const { getter, rawValue, safeValue } = UiGridCoreFocusUtils.getSortFilterValue(
                sortInfo,
                rowData,
                {
                  isRemoteFiltering,
                  dateSerializationFormat,
                  getSelector: (selector) => that._columnsController.columnOption(selector, 'selector'),
                },
              );

              filter = [[selector, '=', safeValue], 'and', filter];

              if (rawValue === null || isBoolean(rawValue)) {
                const booleanFilter = that._generateBooleanFilter(selector, safeValue, desc);

                if (booleanFilter) {
                  filter = [booleanFilter, 'or', filter];
                }
              } else {
                const filterOperation = desc ? '>' : '<';

                let sortFilter;
                if (compare) {
                  sortFilter = (data) => {
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
        },
        _generateFilterByKey(key, operation) {
          const dataSourceKey = this._dataSource.key();
          let filter: any = [];

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
        },

        _getLastItemIndex() {
          return this.items(true).length - 1;
        },
      },

      editing: {
        _deleteRowCore(rowIndex) {
          const deferred = this.callBase.apply(this, arguments);
          const dataController = this.getController('data');
          const rowKey = dataController.getKeyByRowIndex(rowIndex);

          deferred.done(() => {
            const rowIndex = dataController.getRowIndexByKey(rowKey);
            const visibleRows = dataController.getVisibleRows();

            if (rowIndex === -1 && !visibleRows.length) {
              this.getController('focus')._resetFocusedRow();
            }
          });
        },
      },
    },

    views: {
      rowsView: {
        _createRow(row) {
          const $row = this.callBase.apply(this, arguments);

          if (this.option('focusedRowEnabled') && row) {
            if (this.getController('focus').isRowFocused(row.key)) {
              $row.addClass(ROW_FOCUSED_CLASS);
            }
          }

          return $row;
        },

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _checkRowKeys(options) {
          this.callBase.apply(this, arguments);

          if (this.option('focusedRowEnabled') && this.option('dataSource')) {
            const store = this._dataController.store();
            if (store && !store.key()) {
              this._dataController.fireError('E1042', 'Row focusing');
            }
          }
        },

        _update(change) {
          if (change.changeType === 'updateFocusedRow') {
            if (this.option('focusedRowEnabled')) {
              this.getController('focus').updateFocusedRow(change);
            }
          } else {
            this.callBase(change);
          }
        },

        updateFocusElementTabIndex($cellElements, preventScroll) {
          if (this.option('focusedRowEnabled')) {
            this._setFocusedRowElementTabIndex(preventScroll);
          } else {
            this.callBase($cellElements);
          }
        },
        _setFocusedRowElementTabIndex(preventScroll) {
          const focusedRowKey = this.option('focusedRowKey');
          const tabIndex = this.option('tabIndex') || 0;
          const dataController = this._dataController;
          const columnsController = this._columnsController;
          let rowIndex = dataController.getRowIndexByKey(focusedRowKey);
          let columnIndex = this.option('focusedColumnIndex');
          const $row = this._findRowElementForTabIndex();

          if (!isDefined(this._scrollToFocusOnResize)) {
            this._scrollToFocusOnResize = () => {
              this.scrollToElementVertically(this._findRowElementForTabIndex());
              this.resizeCompleted.remove(this._scrollToFocusOnResize);
            };
          }

          $row.attr('tabIndex', tabIndex);

          if (rowIndex >= 0 && !preventScroll) {
            if (columnIndex < 0) {
              columnIndex = 0;
            }

            rowIndex += dataController.getRowIndexOffset();
            columnIndex += columnsController.getColumnIndexOffset();
            this.getController('keyboardNavigation').setFocusedCellPosition(rowIndex, columnIndex);

            if (this.getController('focus').isAutoNavigateToFocusedRow()) {
              const dataSource = dataController.dataSource();
              const operationTypes = dataSource && dataSource.operationTypes();
              if (operationTypes && !operationTypes.paging && !dataController.isPagingByRendering()) {
                this.resizeCompleted.remove(this._scrollToFocusOnResize);
                this.resizeCompleted.add(this._scrollToFocusOnResize);
              }
            }
          }
        },
        _findRowElementForTabIndex() {
          const focusedRowKey = this.option('focusedRowKey');
          const rowIndex = this._dataController.getRowIndexByKey(focusedRowKey);
          return $(this.getRowElement(rowIndex >= 0 ? rowIndex : 0));
        },

        scrollToRowElement(key) {
          const rowIndex = this.getController('data').getRowIndexByKey(key);
          const $row = $(this.getRow(rowIndex));

          return this.scrollToElementVertically($row);
        },

        scrollToElementVertically($row) {
          const scrollable = this.getScrollable();

          if (scrollable && $row.length) {
            const position = scrollable.getScrollElementPosition($row, 'vertical');

            return this.scrollTopPosition(position);
          }

          // @ts-expect-error
          return new Deferred().resolve();
        },

        scrollTopPosition(scrollTop) {
          // @ts-expect-error
          const d = new Deferred();
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
              scrollable.scrollTo({ top: scrollTop });

              return d.promise();
            }
          }

          return d.resolve();
        },
      },
    },
  },
};

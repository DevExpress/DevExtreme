/* eslint-disable max-classes-per-file */
import type { SearchOperation } from '@js/common/data';
import type { ScalarFilterValue } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Callback } from '@js/core/utils/callbacks';
import { equalByValue } from '@js/core/utils/common';
import { Deferred, type DeferredObj, when } from '@js/core/utils/deferred';
import { isBoolean, isDefined } from '@js/core/utils/type';
import type { StoreKey } from '@ts/data/abstract_store';
import type { KeyboardKeyDownEvent } from '@ts/events/core/keyboard_processor';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/columns_controller';
import type { ColumnDataSourceParameter } from '@ts/grids/grid_core/columns_controller/types';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataChange, ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type { OperationTypes, RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { EditingController } from '@ts/grids/grid_core/editing/editing';
import { isNewRowTempKey } from '@ts/grids/grid_core/editing/editing_utils';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/editor_factory';
import type {
  BinaryDataFilterExpression,
  DataFilter,
  DataFilterExpression,
  DataFilterPredicate,
  DataFilterSelector,
  FilterCombiner,
} from '@ts/grids/grid_core/filter/types';
import { combineFilters } from '@ts/grids/grid_core/filter/utils';
import type { KeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/keyboard_navigation';
import type { KeyboardNavigationRowsViewExtension, NavigationDirection } from '@ts/grids/grid_core/keyboard_navigation/types';
import core from '@ts/grids/grid_core/modules/modules';
import type { ModuleType, OptionChanged, RowKey } from '@ts/grids/grid_core/types';
import gridCoreUtils from '@ts/grids/grid_core/utils';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import type { CellPosition, ViewDataChange, ViewRow } from '@ts/grids/grid_core/views/types';
import type { VirtualScrollingDataControllerExtension } from '@ts/grids/grid_core/virtual_scrolling';

import { UiGridCoreFocusUtils } from './focus_utils';
import type {
  FocusDataController,
  FocusDataControllerExtension,
  FocusDataSourceController,
  FocusRowsView,
  FocusRowsViewExtension,
} from './types';

const ROW_FOCUSED_CLASS = 'dx-row-focused';
const FOCUSED_ROW_SELECTOR = `.${VIEW_CLASSES.row}.${ROW_FOCUSED_CLASS}`;
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';

export class FocusController extends core.ViewController {
  // TODO getController
  //  This controller's method used in the data_controler (and maybe others) init methods
  //  And this controller's fields are empty when methods already called
  //  Therefore, as a temporary solution this private getters exist here
  private getKeyboardController(): KeyboardNavigationController {
    return this.getController('keyboardNavigation');
  }

  private getDataController(): FocusDataController {
    return this.getController('data') as FocusDataController;
  }

  private getDataSourceController(): FocusDataSourceController {
    return this.getController('dataSource') as FocusDataSourceController;
  }

  private getRowsView(): FocusRowsView {
    return this.getView('rowsView') as FocusRowsView;
  }

  public init(): void {
    this.component._optionsByReference.focusedRowKey = true;

    const dataController = this.getDataController();
    dataController.afterChanged.remove(this.handleDataChanged);
    dataController.afterChanged.add(this.handleDataChanged);

    const lastChange = dataController.getLastChange();
    if (lastChange) {
      this.handleDataChanged(lastChange);
    }
  }

  public handleDataChanged = (e: DataChange): void => {
    const dataController = this.getDataController();
    const dataSourceController = this.getDataSourceController();
    const forceUpdateFocusedRow = dataSourceController.consumeDataPushed();

    if (!this.option('focusedRowEnabled') || !dataSourceController.hasAdapter()) {
      return;
    }

    const isPartialUpdate = e.changeType === 'update' && e.repaintChangesOnly;
    const isPartialUpdateWithDeleting = isPartialUpdate && e.changeTypes?.includes('remove');
    const isRefreshWithItems = e.changeType === 'refresh' && !!e.items?.length;
    const isAppendOrPrepend = e.changeType === 'append' || e.changeType === 'prepend';

    if (forceUpdateFocusedRow && dataController.isEmpty()) {
      this._resetFocusedRow();
    } else if (isRefreshWithItems || isPartialUpdateWithDeleting) {
      dataController._updatePageIndexes();
      this.updateFocusedRowIfNeeded(e, forceUpdateFocusedRow);
    } else if (isAppendOrPrepend) {
      dataController._updatePageIndexes();
    } else if (isPartialUpdate) {
      this.updateFocusedRowIfNeeded(e, forceUpdateFocusedRow);
      this.resetStaleFocusedRowAfterPartialUpdate(e);
    }
  };

  private resetStaleFocusedRowAfterPartialUpdate(e: { rowIndices?: number[] }): void {
    const focusedRowKey = this.option('focusedRowKey');

    if (!isDefined(focusedRowKey)) {
      return;
    }

    const focusedRowIndex = this.getDataController().getRowIndexByKey(focusedRowKey);
    const isFocusedRowVisible = focusedRowIndex >= 0;
    const isFocusedRowInChange = !!e.rowIndices?.includes(focusedRowIndex);

    if (isFocusedRowVisible && isFocusedRowInChange) {
      this.updateFocusedRow({ focusedRowKey, preventScroll: true });
    }
  }

  private updateFocusedRowIfNeeded(e: DataChange, forceUpdate = false): void {
    const operationTypes = e.operationTypes ?? {};
    const {
      reload, fullReload, pageIndex, paging,
    } = operationTypes;
    const isVirtualScrolling = this.getKeyboardController().isVirtualScrolling();
    const pagingWithoutVirtualScrolling = paging && !isVirtualScrolling;
    const focusedRowKey = this.option('focusedRowKey');
    const isAutoNavigate = this.isAutoNavigateToFocusedRow();
    const isReload = reload && pageIndex === false;
    const rowIndexByKey = this.getDataController().getRowIndexByKey(focusedRowKey);

    switch (true) {
      case forceUpdate: {
        this._focusRowByKeyOrIndex();
        break;
      }
      case isReload && !fullReload && isDefined(focusedRowKey): {
        this._navigateToRow(focusedRowKey, true)
          .done((focusedRowIndex) => {
            if (focusedRowIndex < 0) {
              this._focusRowByIndex(undefined, operationTypes);
            }
          });
        break;
      }
      case pagingWithoutVirtualScrolling && isAutoNavigate: {
        const focusedRowIndex = this.option('focusedRowIndex');
        const isValidRowIndexByKey = rowIndexByKey >= 0;
        const isValidFocusedRowIndex = isDefined(focusedRowIndex) && focusedRowIndex >= 0;
        const isSameRowIndex = focusedRowIndex === rowIndexByKey;

        if (isValidFocusedRowIndex && (isSameRowIndex || !isValidRowIndexByKey)) {
          this._focusRowByIndex(focusedRowIndex, operationTypes);
        }
        break;
      }
      case pagingWithoutVirtualScrolling && !isAutoNavigate && (rowIndexByKey < 0): {
        this.option('focusedRowIndex', -1);
        break;
      }
      case operationTypes.fullReload: {
        this._focusRowByKeyOrIndex();
        break;
      }
      default: {
        break;
      }
    }
  }

  public optionChanged(args: OptionChanged): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'focusedRowIndex':
        this._focusRowByIndex(value);
        this.getKeyboardController().fireFocusedRowChanged();
        args.handled = true;
        break;
      case 'focusedRowKey':
        if (Array.isArray(value) && JSON.stringify(value) === JSON.stringify(previousValue)) {
          return;
        }

        this._focusRowByKey(value).done(() => {
          this.getKeyboardController().fireFocusedRowChanged();
        });
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

  public publicMethods(): string[] {
    return ['navigateToRow', 'isRowFocused'];
  }

  public isAutoNavigateToFocusedRow(): boolean | undefined {
    return this.option('scrolling.mode') !== 'infinite' && this.option('autoNavigateToFocusedRow');
  }

  public _focusRowByIndex(index?: number, operationTypes?: OperationTypes | null): void {
    if (!this.option('focusedRowEnabled')) {
      return;
    }

    const currentIndex = index ?? this.option('focusedRowIndex');

    if (!isDefined(currentIndex)) {
      return;
    }

    if (currentIndex < 0) {
      if (this.isAutoNavigateToFocusedRow()) {
        this._resetFocusedRow();
      }
    } else {
      this._focusRowByIndexCore(currentIndex, operationTypes);
    }
  }

  private _focusRowByIndexCore(index: number, operationTypes?: OperationTypes | null): void {
    const pageSize = this.getDataController().pageSize();
    const setKeyByIndex = (): void => {
      if (this._isValidFocusedRowIndex(index)) {
        let rowIndex = index - this.getDataController().getRowIndexOffset(true);

        if (!operationTypes || (operationTypes.paging && !operationTypes.filtering)) {
          const lastItemIndex = this.getDataController()._getLastItemIndex();
          rowIndex = Math.min(rowIndex, lastItemIndex);
        }

        const focusedRowKey = this.getDataController().getKeyByRowIndex(rowIndex, true);

        if (isDefined(focusedRowKey) && !this.isRowFocused(focusedRowKey)) {
          this.option('focusedRowKey', focusedRowKey);
        }
      }
    };

    if (pageSize >= 0) {
      if (!this._isLocalRowIndex(index)) {
        const pageIndex = Math.floor(index / this.getDataController().pageSize());
        when(
          this.getDataController().pageIndex(pageIndex),
          this.getDataController().waitReady(),
        ).done(() => {
          setKeyByIndex();
        });
      } else {
        setKeyByIndex();
      }
    }
  }

  private _isLocalRowIndex(index: number): boolean {
    const isVirtualScrolling = this.getKeyboardController().isVirtualScrolling();

    if (isVirtualScrolling) {
      const pageIndex = Math.floor(index / this.getDataController().pageSize());
      const virtualItems = this.getDataController().virtualItemsCount?.();
      const virtualItemsBegin = virtualItems ? virtualItems.begin : -1;
      const visibleRowsCount = this.getDataController().getVisibleRows().length
        + this.getDataController().getRowIndexOffset();
      const visiblePagesCount = Math.ceil(visibleRowsCount / this.getDataController().pageSize());

      return virtualItemsBegin <= index && visiblePagesCount > pageIndex;
    }

    return true;
  }

  private _focusRowByKey(
    key: RowKey,
  ): DeferredObj<number | unknown> {
    if (!isDefined(key)) {
      this._resetFocusedRow();
      return Deferred().resolve();
    }
    return this._navigateToRow(key, true);
  }

  public _resetFocusedRow(): void {
    const focusedRowKey = this.option('focusedRowKey');
    const isFocusedRowKeyDefined = isDefined(focusedRowKey);
    const focusedRowIndex = this.option('focusedRowIndex');

    if (!isFocusedRowKeyDefined && isDefined(focusedRowIndex) && focusedRowIndex < 0) {
      return;
    }

    if (isFocusedRowKeyDefined) {
      this.option('focusedRowKey', null);
    }
    this.getKeyboardController().setFocusedRowIndex(-1);
    this.option('focusedRowIndex', -1);
    this.getDataController().updateItems({
      changeType: 'updateFocusedRow',
      focusedRowKey: null,
    });

    this.getKeyboardController().fireFocusedRowChanged();
  }

  private _isValidFocusedRowIndex(rowIndex: number): boolean {
    const row = this.getDataController().getVisibleRows()[rowIndex];

    return !row || row.rowType === 'data' || row.rowType === 'group';
  }

  public navigateToRow(key: RowKey): DeferredObj<number> {
    if (!this.isAutoNavigateToFocusedRow()) {
      this.option('focusedRowIndex', -1);
    }
    return this._navigateToRow(key, false);
  }

  public _navigateToRow(
    key: RowKey,
    needFocusRow: boolean,
  ): DeferredObj<number> {
    const isAutoNavigate = this.isAutoNavigateToFocusedRow();
    const d = Deferred<number>();
    const rowsView = this.getView('rowsView');

    if (key === undefined || !this.getDataSourceController().hasAdapter()) {
      // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
      return d.reject().promise();
    }

    const rowIndexByKey = this.getFocusedRowIndexByKey(key);

    if ((!isAutoNavigate && needFocusRow) || rowIndexByKey >= 0) {
      this._navigateTo(key, d, needFocusRow);
    } else {
      this.getDataController().getPageIndexByKey(key).done((pageIndex) => {
        if (pageIndex < 0) {
          d.resolve(-1);
          return;
        }
        if (pageIndex === this.getDataController().pageIndex()) {
          this.getDataController().reload().done(() => {
            if (this.isRowFocused(key) && this.getDataController().getRowIndexByKey(key) >= 0) {
              d.resolve(this.getFocusedRowIndexByKey(key));
            } else {
              this._navigateTo(key, d, needFocusRow);
            }
          // @ts-expect-error fail() gets the error, but is typed with the resolve value
          // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
          }).fail(d.reject);
        } else {
          this.getDataController().pageIndex(pageIndex).done(() => {
            rowsView.waitAsyncTemplates(true).done(() => {
              this._navigateTo(key, d, needFocusRow);
            });
          // @ts-expect-error fail() gets the error, but is typed with the resolve value
          // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
          }).fail(d.reject);
        }
      // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
      }).fail(d.reject);
    }

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return d.promise();
  }

  private _navigateTo(key: RowKey, deferred: DeferredObj<number>, needFocusRow: boolean): void {
    const visibleRowIndex = this.getDataController().getRowIndexByKey(key);
    const isVirtualRowRenderingMode = gridCoreUtils.isVirtualRowRendering(this);
    const isAutoNavigate = this.isAutoNavigateToFocusedRow();

    if (isAutoNavigate && isVirtualRowRenderingMode && visibleRowIndex < 0) {
      this._navigateToVirtualRow(key, deferred, needFocusRow);
    } else {
      this._navigateToVisibleRow(key, deferred, needFocusRow);
    }
  }

  private _navigateToVisibleRow(
    key: RowKey,
    deferred: DeferredObj<number>,
    needFocusRow: boolean,
  ): void {
    if (needFocusRow) {
      this._triggerUpdateFocusedRow(key, deferred);
    } else {
      const focusedRowIndex = this.getFocusedRowIndexByKey(key);
      this.getRowsView().scrollToRowElement(key).done(() => {
        deferred.resolve(focusedRowIndex);
      });
    }
  }

  private _navigateToVirtualRow(
    key: RowKey,
    deferred: DeferredObj<number>,
    needFocusRow: boolean,
  ): void {
    const rowsScrollController = this.getDataController()._rowsScrollController;
    const rowIndex = gridCoreUtils.getIndexByKey(key, this.getDataController().items(true));
    const scrollable = this.getView('rowsView').getScrollable();

    if (rowsScrollController && scrollable && rowIndex >= 0) {
      const focusedRowIndex = rowIndex + this.getDataController().getRowIndexOffset(true);
      const offset = rowsScrollController.getItemOffset(focusedRowIndex);

      const triggerUpdateFocusedRow = (): void => {
        if (
          this.getDataSourceController().totalCount()
          && !this.getDataController().items().length
        ) {
          return;
        }
        this.component.off('contentReady', triggerUpdateFocusedRow);

        if (!needFocusRow) {
          deferred.resolve(focusedRowIndex);
        } else if (this.isRowFocused(key)) {
          this._triggerUpdateFocusedRow(key, deferred);
        } else {
          deferred.reject();
        }
      };
      this.component.on('contentReady', triggerUpdateFocusedRow);

      this.getRowsView().scrollTopPosition(offset);
    } else {
      deferred.resolve(-1);
    }
  }

  private _triggerUpdateFocusedRow(key: RowKey, deferred?: DeferredObj<number>): void {
    const focusedRowIndex = this.getFocusedRowIndexByKey(key);

    if (this._isValidFocusedRowIndex(focusedRowIndex)) {
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in branches
      let d: DeferredObj<unknown> | undefined;

      if (this.option('focusedRowEnabled')) {
        this.getDataController().updateItems({
          changeType: 'updateFocusedRow',
          focusedRowKey: key,
        });
      } else {
        // TODO getView
        d = this.getRowsView().scrollToRowElement(key);
      }

      when(d).done(() => {
        this.getKeyboardController().setFocusedRowIndex(focusedRowIndex);

        deferred?.resolve(focusedRowIndex);
      });
    } else {
      deferred?.resolve(-1);
    }
  }

  public getFocusedRowIndexByKey(key: RowKey): number {
    const loadedRowIndex = this.getDataController().getRowIndexByKey(key, true);
    return loadedRowIndex >= 0
      ? loadedRowIndex + this.getDataController().getRowIndexOffset(true)
      : -1;
  }

  public _focusRowByKeyOrIndex(): void {
    const focusedRowKey = this.option('focusedRowKey');
    let currentFocusedRowIndex = this.option('focusedRowIndex');

    if (isDefined(focusedRowKey)) {
      const visibleRowIndex = this.getDataController().getRowIndexByKey(focusedRowKey);
      if (visibleRowIndex >= 0) {
        if (this.getKeyboardController().isVirtualScrolling()) {
          currentFocusedRowIndex = visibleRowIndex + this.getDataController().getRowIndexOffset();
        }
        this.getKeyboardController().setFocusedRowIndex(currentFocusedRowIndex);
        this._triggerUpdateFocusedRow(focusedRowKey);
      } else {
        this._navigateToRow(focusedRowKey, true).done((focusedRowIndex) => {
          if (!isDefined(currentFocusedRowIndex)) {
            return;
          }
          if (currentFocusedRowIndex >= 0 && focusedRowIndex < 0) {
            this._focusRowByIndex();
          } else if (currentFocusedRowIndex < 0 && focusedRowIndex >= 0) {
            this.getKeyboardController().setFocusedRowIndex(focusedRowIndex);
          }
        });
      }
    } else if (isDefined(currentFocusedRowIndex) && currentFocusedRowIndex >= 0) {
      this._focusRowByIndex(currentFocusedRowIndex);
    }
  }

  public isRowFocused(key: RowKey): boolean {
    const focusedRowKey = this.option('focusedRowKey');

    return isDefined(focusedRowKey) && equalByValue(key, focusedRowKey);
  }

  public updateFocusedRow(e: { focusedRowKey?: RowKey; preventScroll?: boolean }): void {
    const focusedRowIndex = this.getDataController().getRowIndexByKey(e.focusedRowKey);
    const rowsView = this.getRowsView();

    const $focusedRows = rowsView.getTableElements().toArray().map((tableElement) => {
      this._clearPreviousFocusedRow($(tableElement), focusedRowIndex);

      return this._prepareFocusedRow({
        changedItem: this.getDataController().getVisibleRows()[focusedRowIndex],
        $tableElement: $(tableElement),
        focusedRowIndex,
      });
    });
    const $mainRow = $focusedRows[0];

    if (!e.preventScroll && $mainRow) {
      rowsView.scrollToElementVertically($mainRow);
    }
  }

  private _clearPreviousFocusedRow($tableElement: dxElementWrapper, focusedRowIndex: number): void {
    const isNotMasterDetailFocusedRow = (_: number, focusedRow: Element): boolean => {
      const $focusedRowTable = $(focusedRow).closest(`.${this.addWidgetPrefix(VIEW_CLASSES.table)}`);
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
  }

  private _prepareFocusedRow(options: {
    changedItem?: ProcessedItem;
    $tableElement: dxElementWrapper;
    focusedRowIndex: number;
  }): dxElementWrapper | undefined {
    const { changedItem, $tableElement, focusedRowIndex } = options;

    if (changedItem?.rowType !== 'data' && changedItem?.rowType !== 'group') {
      return undefined;
    }

    const tabIndex = this.option('tabindex') || 0;
    const rowsView = this.getView('rowsView');
    const $row = $(rowsView._getRowElements($tableElement).eq(focusedRowIndex));

    $row.addClass(ROW_FOCUSED_CLASS).attr('tabindex', tabIndex);

    return $row;
  }
}

export const keyboardNavigation = (
  Base: ModuleType<KeyboardNavigationController>,
): ModuleType<KeyboardNavigationController> => class FocusKeyboardNavigationExtender extends Base {
  public init(): void {
    const rowIndex = this.option('focusedRowIndex');
    const columnIndex = this.option('focusedColumnIndex');

    this.createAction('onFocusedRowChanging', { excludeValidators: ['disabled', 'readOnly'] });
    this.createAction('onFocusedRowChanged', { excludeValidators: ['disabled', 'readOnly'] });

    this.createAction('onFocusedCellChanging', { excludeValidators: ['disabled', 'readOnly'] });
    this.createAction('onFocusedCellChanged', { excludeValidators: ['disabled', 'readOnly'] });

    super.init();

    this.setRowFocusType();

    this._focusedCellPosition = {};
    if (isDefined(rowIndex) && rowIndex >= 0) {
      this._focusedCellPosition.rowIndex = rowIndex;
    }
    if (isDefined(columnIndex) && columnIndex >= 0) {
      this._focusedCellPosition.columnIndex = columnIndex;
    }
  }

  public setFocusedRowIndex(rowIndex: number | undefined): void {
    super.setFocusedRowIndex(rowIndex);
    this.option('focusedRowIndex', rowIndex);
  }

  protected setFocusedColumnIndex(columnIndex: number | undefined): void {
    super.setFocusedColumnIndex(columnIndex);
    this.option('focusedColumnIndex', columnIndex);
  }

  protected _escapeKeyHandler(eventArgs: KeyboardKeyDownEvent, isEditing: boolean): boolean {
    if (isEditing || !this.option('focusedRowEnabled')) {
      return super._escapeKeyHandler(eventArgs, isEditing);
    }
    if (this.isCellFocusType()) {
      this.setRowFocusType();
      this.applyFocus(this.getCellElementFromTarget(eventArgs.originalEvent.target), true);

      return true;
    }

    return false;
  }

  protected _updateFocusedCellPosition(
    $cell: dxElementWrapper,
    direction?: NavigationDirection,
  ): CellPosition | undefined {
    const position = super._updateFocusedCellPosition($cell, direction);

    if (position && position.columnIndex >= 0) {
      this._fireFocusedCellChanged($cell);
    }

    return position;
  }
};

export const focusEditorFactoryViewControllerExtender = (
  Base: ModuleType<EditorFactory>,
): ModuleType<EditorFactory> => class FocusEditorFactoryExtender extends Base {
  protected keyboardNavigationController!: KeyboardNavigationController;

  public init(): void {
    this.keyboardNavigationController = this.getController('keyboardNavigation');
    super.init();
  }

  protected renderFocusOverlay($element: dxElementWrapper, isHideBorder?: boolean): void {
    const focusedRowEnabled = this.option('focusedRowEnabled');

    if (
      !focusedRowEnabled
      || !this.keyboardNavigationController.isRowFocusType()
      || this._editingController.isEditing()
      || this._columnHeadersView.isFilterRowCell($element)
    ) {
      super.renderFocusOverlay($element, isHideBorder);
    } else if (focusedRowEnabled) {
      const isRowElement = this.keyboardNavigationController.getElementType($element) === 'row';

      if (isRowElement && !$element.hasClass(ROW_FOCUSED_CLASS)) {
        const $cell = this.keyboardNavigationController.getFirstValidCellInRow($element);
        this.keyboardNavigationController.focus($cell);
      }
    }
  }
};

export const columns = (
  Base: ModuleType<ColumnsController>,
): ModuleType<ColumnsController> => class FocusColumnsExtender extends Base {
  protected focusController!: FocusController;

  protected dataSourceController!: DataSourceController;

  public init(isApplyingUserState?: boolean): void {
    this.focusController = this.getController('focus');
    this.dataSourceController = this.getController('dataSource');

    super.init(isApplyingUserState);
  }

  public getSortDataSourceParameters(
    useLocalSelector?: boolean,
    sortByKey?: boolean,
  ): ColumnDataSourceParameter[] | null {
    const columnSortParameters = super.getSortDataSourceParameters(useLocalSelector, sortByKey);
    const key = this.dataSourceController.store()?.key();
    const sortByKeyForFocus = this.option('focusedRowEnabled')
      && this.focusController.isAutoNavigateToFocusedRow() !== false;

    if (!key || (!sortByKeyForFocus && !sortByKey)) {
      return columnSortParameters;
    }

    const keyFields = Array.isArray(key) ? key : [key];
    const notSortedKeys = keyFields.filter((keyField) => !this.columnOption(keyField, 'sortOrder'));

    if (!notSortedKeys.length) {
      return columnSortParameters;
    }

    const remoteOperations = this.dataSourceController.remoteOperations();
    const isLocalOperations = Object.values(remoteOperations).every((isRemote) => !isRemote);
    const keySortParameters: ColumnDataSourceParameter[] = isLocalOperations
      ? [{ selector: this.dataSourceController.getDataIndexGetter(), desc: false }]
      : notSortedKeys.map((selector) => ({ selector, desc: false }));

    return [...columnSortParameters ?? [], ...keySortParameters];
  }
};

export const focusDataControllerExtender = <
  TBase extends ModuleType<DataController & Partial<VirtualScrollingDataControllerExtension>>,
>(
  Base: TBase,
): TBase & ModuleType<
  DataController & FocusDataControllerExtension
> => class FocusDataControllerExtender extends Base {
  private _lastRenderingPageIndex = 0;

  private _isPagingByRendering = false;

  private lastChange?: DataChange;

  public afterChanged!: Callback<[DataChange]>;

  protected callbackNames(): string[] {
    return [...super.callbackNames(), 'afterChanged'];
  }

  protected _applyChange(change: DataChange): void {
    if (change?.changeType === 'updateFocusedRow') {
      return;
    }

    super._applyChange(change);
  }

  protected _endUpdateCore(): void {
    const focusedRowChanges = this.changes.filter((change) => change.changeType === 'updateFocusedRow');
    const hasOnlyFocusOrSelectionChanges = this.changes.every(
      (change) => change.changeType === 'updateFocusedRow' || change.changeType === 'updateSelection',
    );

    if (focusedRowChanges.length && hasOnlyFocusOrSelectionChanges) {
      this.changes = this.changes.filter((change) => change.changeType !== 'updateFocusedRow');
      this.updateItems(focusedRowChanges.at(-1));
    }

    super._endUpdateCore();
  }

  protected _fireChanged(e: DataChange): void {
    super._fireChanged(e);
    this.lastChange = e;
    this.afterChanged.fire(e);
  }

  public getLastChange(): DataChange | undefined {
    return this.lastChange;
  }

  public _updatePageIndexes(): void {
    const prevRenderingPageIndex = this._lastRenderingPageIndex;
    const renderingPageIndex = this._rowsScrollController
      ? this._rowsScrollController.pageIndex()
      : 0;

    this._lastRenderingPageIndex = renderingPageIndex;
    this._isPagingByRendering = renderingPageIndex !== prevRenderingPageIndex;
  }

  public isPagingByRendering(): boolean {
    return this._isPagingByRendering;
  }

  /**
   * @extended: TreeList's focus
   */
  public getPageIndexByKey(key: RowKey): DeferredObj<number> {
    const d = Deferred<number>();

    this.getGlobalRowIndexByKey(key).done((globalIndex) => {
      d.resolve(globalIndex >= 0 ? Math.floor(globalIndex / this.pageSize()) : -1);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignores the result
    }).fail(d.reject);

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return d.promise();
  }

  /**
   * @extended: DataGrid's focus
   */
  public getGlobalRowIndexByKey(key: RowKey): DeferredObj<number> {
    return this._calculateGlobalRowIndexByFlatData(key);
  }

  public _calculateGlobalRowIndexByFlatData(
    key: RowKey,
    groupFilter?: DataFilter,
    useGroup?: boolean,
  ): DeferredObj<number> {
    const deferred = Deferred<number>();
    const dataSourceAdapter = this.dataSourceController.getAdapter();

    if (!dataSourceAdapter || Array.isArray(key) || isNewRowTempKey(key)) {
      // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
      return deferred.resolve(-1).promise();
    }

    let filter = this._generateFilterByKey(key);

    dataSourceAdapter.customLoader.load({
      filter: this._concatWithCombinedFilter(filter),
      skip: 0,
      take: 1,
    }).done(({ data }) => {
      if (this.dataSourceController.getAdapter() !== dataSourceAdapter) {
        deferred.resolve(-1);
        return;
      }
      if (data.length > 0) {
        filter = this._generateOperationFilterByKey(key, data[0], useGroup);

        dataSourceAdapter.customLoader.load({
          filter: this._concatWithCombinedFilter(filter, groupFilter),
          skip: 0,
          take: 1,
          requireTotalCount: true,
        }).done(({ extra }) => {
          if (this.dataSourceController.getAdapter() !== dataSourceAdapter) {
            deferred.resolve(-1);
            return;
          }
          // @ts-expect-error extra.totalCount is loaded with requireTotalCount
          deferred.resolve(extra.totalCount);
        });
      } else {
        deferred.resolve(-1);
      }
    });

    // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value at runtime
    return deferred.promise();
  }

  public _concatWithCombinedFilter(filter: DataFilter, groupFilter?: DataFilter): DataFilter {
    const combinedFilter = this.getCombinedFilter();
    return combineFilters([filter, combinedFilter, groupFilter]);
  }

  private _generateBooleanFilter(
    selector: DataFilterSelector,
    value: ScalarFilterValue,
    desc: boolean,
  ): BinaryDataFilterExpression | undefined {
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
  }

  // TODO Vinogradov: Move this method implementation to the UiGridCoreFocusUtils
  // and cover with unit tests.
  private _generateOperationFilterByKey(
    key: RowKey,
    rowData: RawItemData,
    useGroup?: boolean,
  ): DataFilterExpression {
    const dateSerializationFormat = this.option('dateSerializationFormat');
    const remoteOperations = this.dataSourceController.remoteOperations();
    const isRemoteFiltering = Boolean(remoteOperations.filtering);
    const isRemoteSorting = Boolean(remoteOperations.sorting);

    let filter = this._generateFilterByKey(key, '<');
    let sort = this._columnsController.getSortDataSourceParameters(!isRemoteFiltering, true);

    if (useGroup) {
      const group = this._columnsController.getGroupDataSourceParameters(!isRemoteFiltering);
      if (group) {
        sort = sort ? group.concat(sort) : group;
      }
    }

    if (sort) {
      sort.slice().reverse().forEach((sortInfo) => {
        const { selector, desc, compare } = sortInfo;

        if (!selector) {
          return;
        }

        const { getter, rawValue, safeValue } = UiGridCoreFocusUtils.getSortFilterValue(
          // @ts-expect-error column selectors can be undefined; focus requires a selector
          sortInfo,
          rowData,
          {
            isRemoteFiltering,
            dateSerializationFormat,
            getSelector: (name) => this._columnsController.columnOption(name, 'selector'),
          },
        );

        filter = [[selector, '=', safeValue], 'and', filter];

        if (rawValue === null || isBoolean(rawValue)) {
          const booleanFilter = this._generateBooleanFilter(selector, safeValue, desc);

          if (booleanFilter) {
            filter = [booleanFilter, 'or', filter];
          }
        } else {
          const filterOperation = desc ? '>' : '<';

          // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in branches
          let sortFilter: DataFilterExpression | DataFilterPredicate;
          if (compare && !isRemoteSorting) {
            sortFilter = (data: RawItemData): boolean => {
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

  public _generateFilterByKey(key: RowKey, operation?: SearchOperation): DataFilterExpression {
    // @ts-expect-error focus needs a store key (E1042)
    const dataSourceKey: StoreKey = this.dataSourceController.getAdapter()?.key();
    const filterOperation = operation ?? '=';

    if (!Array.isArray(dataSourceKey)) {
      // @ts-expect-error row keys are untyped
      return [dataSourceKey, filterOperation, key];
    }

    const filter: (DataFilterExpression | FilterCombiner)[] = [];

    for (const keyField of dataSourceKey) {
      // @ts-expect-error row keys are untyped; a compound key is an object
      const keyPart: ScalarFilterValue = key[keyField];
      if (keyPart) {
        if (filter.length > 0) {
          filter.push('and');
        }
        filter.push([keyField, filterOperation, keyPart]);
      }
    }

    // @ts-expect-error a group built by push may be empty
    return filter;
  }

  public _getLastItemIndex(): number {
    return this.items(true).length - 1;
  }
};

export const editing = (
  Base: ModuleType<EditingController>,
): ModuleType<EditingController> => class FocusEditingControllerExtender extends Base {
  protected _deleteRowCore(rowIndex: number): DeferredObj<unknown> {
    const deferred = super._deleteRowCore(rowIndex);
    const rowKey = this._dataController.getKeyByRowIndex(rowIndex);

    deferred.done(() => {
      const currentRowIndex = this._dataController.getRowIndexByKey(rowKey);
      const visibleRows = this._dataController.getVisibleRows();

      if (currentRowIndex === -1 && !visibleRows.length) {
        this._focusController._resetFocusedRow();
      }
    });

    return deferred;
  }
};

export const rowsView = (
  Base: ModuleType<RowsView & KeyboardNavigationRowsViewExtension>,
): ModuleType<RowsView & FocusRowsViewExtension> => class RowsViewFocusController extends Base {
  protected declare _dataController: FocusDataController;

  private _scrollToFocusOnResize?: () => void;

  protected _createRow(row?: ViewRow, tag?: string): dxElementWrapper {
    const $row = super._createRow(row, tag);

    if (this.option('focusedRowEnabled') && row) {
      if (this._focusController.isRowFocused(row.key)) {
        $row.addClass(ROW_FOCUSED_CLASS);
      }
    }

    return $row;
  }

  protected _checkRowKeys(options?: ViewDataChange): void {
    super._checkRowKeys(options);

    if (this.option('focusedRowEnabled') && this.option('dataSource')) {
      const store = this.dataSourceController.store();
      if (store && !store.key()) {
        this._dataController.fireError('E1042', 'Row focusing');
      }
    }
  }

  protected _update(change: DataChange): void {
    if (change.changeType === 'updateFocusedRow') {
      if (this.option('focusedRowEnabled')) {
        this._focusController.updateFocusedRow(change);
      }
    } else {
      super._update(change);
    }
  }

  public updateFocusElementTabIndex(
    $cellElements: dxElementWrapper,
    preventScroll?: boolean,
  ): void {
    if (this.option('focusedRowEnabled')) {
      this._setFocusedRowElementTabIndex(preventScroll);
    } else {
      super.updateFocusElementTabIndex($cellElements);
    }
  }

  private _setFocusedRowElementTabIndex(preventScroll?: boolean): void {
    const focusedRowKey = this.option('focusedRowKey');
    const tabIndex = this.option('tabIndex') ?? 0;
    const columnsController = this._columnsController;
    let rowIndex = this._dataController.getRowIndexByKey(focusedRowKey);
    let columnIndex = Number(this.option('focusedColumnIndex'));
    const $row = this._findRowElementForTabIndex();

    const operationTypes = this.dataSourceController.operationTypes();
    const isPaging = !operationTypes || operationTypes.paging;

    if (!isDefined(this._scrollToFocusOnResize)) {
      this._scrollToFocusOnResize = (): void => {
        this.scrollToElementVertically(this._findRowElementForTabIndex());
        if (this._scrollToFocusOnResize) {
          this.resizeCompleted.remove(this._scrollToFocusOnResize);
        }
      };
    }

    $row.attr('tabIndex', tabIndex);
    const focusedRowIndex = this.option('focusedRowIndex');
    const rowIndexOffset = this._dataController.getRowIndexOffset(true);
    const isAfterOffset = isDefined(focusedRowIndex) && focusedRowIndex - rowIndexOffset >= 0;

    if (!isPaging && rowIndex < 0 && isAfterOffset) {
      this._focusController.updateFocusedRow({
        focusedRowKey,
        preventScroll,
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
        if (!isPaging && !this._dataController.isPagingByRendering()) {
          this.resizeCompleted.remove(this._scrollToFocusOnResize);
          this.resizeCompleted.add(this._scrollToFocusOnResize);
        }
      }
    }
  }

  private _findRowElementForTabIndex(): dxElementWrapper {
    const focusedRowKey = this.option('focusedRowKey');
    const rowIndex = this._dataController.getRowIndexByKey(focusedRowKey);
    return $(this.getRowElement(rowIndex >= 0 ? rowIndex : 0));
  }

  public scrollToRowElement(key: RowKey): DeferredObj<unknown> {
    const rowIndex = this._dataController.getRowIndexByKey(key);
    const $row = $(this.getRow(rowIndex));

    return this.scrollToElementVertically($row);
  }

  public scrollToElementVertically($row: dxElementWrapper): DeferredObj<unknown> {
    const scrollable = this.getScrollable();

    if (scrollable && $row.length) {
      const position = scrollable.getScrollElementPosition($row, 'vertical');

      return this.scrollTopPosition(position);
    }

    return Deferred<unknown>().resolve();
  }

  public scrollTopPosition(scrollTop: number): DeferredObj<unknown> {
    const d = Deferred<unknown>();
    const scrollable = this.getScrollable();

    if (scrollable) {
      const currentScrollTop = scrollable.scrollTop();
      const scrollHandler = (): void => {
        scrollable.off('scroll', scrollHandler);
        d.resolve();
      };

      if (scrollTop !== currentScrollTop) {
        scrollable.on('scroll', scrollHandler);
        this._dataController.resetFilterApplying();
        scrollable.scrollTo({ top: scrollTop });

        // @ts-expect-error promise() is typed as Promise but returns a Deferred-like value
        return d.promise();
      }
    }

    return d.resolve();
  }
};

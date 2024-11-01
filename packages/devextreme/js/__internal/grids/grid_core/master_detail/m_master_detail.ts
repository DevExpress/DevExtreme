/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
// @ts-expect-error
import { grep } from '@js/core/utils/common';
import { Deferred, when } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { getHeight, getWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import type { ColumnsController } from '@ts/grids/grid_core/columns_controller/m_columns_controller';
import type { DataController } from '@ts/grids/grid_core/data_controller/m_data_controller';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import type { ResizingController } from '@ts/grids/grid_core/views/m_grid_view';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import gridCoreUtils from '../m_utils';

const MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
const MASTER_DETAIL_ROW_CLASS = 'dx-master-detail-row';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const ROW_LINES_CLASS = 'dx-row-lines';

const columns = (Base: ModuleType<ColumnsController>) => class ColumnsMasterDetailExtender extends Base {
  protected _getExpandColumnsCore() {
    const expandColumns = super._getExpandColumnsCore();

    if (this.option('masterDetail.enabled')) {
      expandColumns.push({
        type: 'detailExpand',
        cellTemplate: gridCoreUtils.getExpandCellTemplate(),
      });
    }
    return expandColumns;
  }
};

const initMasterDetail = function (that) {
  that._expandedItems = [];
  that._isExpandAll = that.option('masterDetail.autoExpandAll');
};

export const dataMasterDetailExtenderMixin = (Base: ModuleType<DataController>) => class DataMasterDetailExtender extends Base {
  private _isExpandAll: any;

  private _expandedItems: any;

  public init() {
    const that = this;

    initMasterDetail(that);
    super.init();
  }

  private expandAll(groupIndex) {
    const that = this;

    if (groupIndex < 0) {
      that._isExpandAll = true;
      that._expandedItems = [];
      that.updateItems();
    } else {
      // @ts-expect-error
      super.expandAll.apply(that, arguments);
    }
  }

  private collapseAll(groupIndex) {
    const that = this;

    if (groupIndex < 0) {
      that._isExpandAll = false;
      that._expandedItems = [];
      that.updateItems();
    } else {
      // @ts-expect-error
      super.collapseAll.apply(that, arguments);
    }
  }

  protected isRowExpandedHack() {
    // @ts-expect-error
    return super.isRowExpanded.apply(this, arguments);
  }

  protected isRowExpanded(key) {
    const that = this;
    const expandIndex = gridCoreUtils.getIndexByKey(key, that._expandedItems);

    if (Array.isArray(key)) {
      // @ts-expect-error
      return super.isRowExpanded.apply(that, arguments);
    }
    return !!(that._isExpandAll ^ (expandIndex >= 0 && that._expandedItems[expandIndex].visible));
  }

  private _getRowIndicesForExpand(key) {
    const rowIndex = this.getRowIndexByKey(key);

    return [rowIndex, rowIndex + 1];
  }

  private _changeRowExpandCore(key) {
    const that = this;

    let result;
    if (Array.isArray(key)) {
      // @ts-expect-error
      result = super._changeRowExpandCore.apply(that, arguments);
    } else {
      const expandIndex = gridCoreUtils.getIndexByKey(key, that._expandedItems);
      if (expandIndex >= 0) {
        const { visible } = that._expandedItems[expandIndex];

        that._expandedItems[expandIndex].visible = !visible;
      } else {
        that._expandedItems.push({ key, visible: true });
      }

      that.updateItems({
        changeType: 'update',
        rowIndices: that._getRowIndicesForExpand(key),
      });

      // @ts-expect-error
      result = new Deferred().resolve();
    }

    return result;
  }

  private _processDataItemHack() {
    return super._processDataItem.apply(this, arguments as any);
  }

  protected _processDataItem(data, options) {
    const that = this;
    const dataItem = super._processDataItem.apply(that, arguments as any);

    dataItem.isExpanded = that.isRowExpanded(dataItem.key);

    if (options.detailColumnIndex === undefined) {
      options.detailColumnIndex = -1;
      each(options.visibleColumns, (index, column) => {
        if (column.command === 'expand' && !isDefined(column.groupIndex)) {
          options.detailColumnIndex = index;
          return false;
        }

        return undefined;
      });
    }
    if (options.detailColumnIndex >= 0) {
      dataItem.values[options.detailColumnIndex] = dataItem.isExpanded;
    }
    return dataItem;
  }

  protected _processItemsHack() {
    return super._processItems.apply(this, arguments as any);
  }

  protected _processItems(items, change) {
    const that = this;
    const { changeType } = change;
    const result: any[] = [];

    items = super._processItems.apply(that, arguments as any);

    if (changeType === 'loadingAll') {
      return items;
    }

    if (changeType === 'refresh') {
      that._expandedItems = grep(that._expandedItems, (item) => item.visible);
    }

    each(items, (index, item) => {
      result.push(item);
      const expandIndex = gridCoreUtils.getIndexByKey(item.key, that._expandedItems);

      if (item.rowType === 'data' && (item.isExpanded || expandIndex >= 0) && !item.isNewRow) {
        result.push({
          visible: item.isExpanded,
          rowType: 'detail',
          key: item.key,
          data: item.data,
          values: [],
        });
      }
    });

    return result;
  }

  public optionChanged(args) {
    const that = this;
    let isEnabledChanged;
    let isAutoExpandAllChanged;

    if (args.name === 'masterDetail') {
      args.name = 'dataSource';

      // eslint-disable-next-line default-case
      switch (args.fullName) {
        case 'masterDetail': {
          const value = args.value || {};
          const previousValue = args.previousValue || {};
          isEnabledChanged = value.enabled !== previousValue.enabled;
          isAutoExpandAllChanged = value.autoExpandAll !== previousValue.autoExpandAll;
          break;
        }
        case 'masterDetail.template': {
          initMasterDetail(that);
          break;
        }
        case 'masterDetail.enabled':
          isEnabledChanged = true;
          break;

        case 'masterDetail.autoExpandAll':
          isAutoExpandAllChanged = true;
          break;
      }
      if (isEnabledChanged || isAutoExpandAllChanged) {
        initMasterDetail(that);
      }
    }
    super.optionChanged(args);
  }
};

const resizing = (Base: ModuleType<ResizingController>) => class ResizingMasterDetailExtender extends Base {
  public fireContentReadyAction() {
    super.fireContentReadyAction.apply(this, arguments as any);

    this._updateParentDataGrids(this.component.$element());
  }

  private _updateParentDataGrids($element) {
    const $masterDetailRow = $element.closest(`.${MASTER_DETAIL_ROW_CLASS}`);

    if ($masterDetailRow.length) {
      when(this._updateMasterDataGrid($masterDetailRow, $element)).done(() => {
        this._updateParentDataGrids($masterDetailRow.parent());
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _updateMasterDataGrid($masterDetailRow, $detailElement) {
    const masterRowOptions = $($masterDetailRow).data('options');
    const masterDataGrid = $($masterDetailRow).closest(`.${this.getWidgetContainerClass()}`).parent().data('dxDataGrid');

    if (masterRowOptions && masterDataGrid) {
      return this._updateMasterDataGridCore(masterDataGrid, masterRowOptions);
    }

    return undefined;
  }

  private _updateMasterDataGridCore(masterDataGrid, masterRowOptions) {
    const d = Deferred();

    if (masterDataGrid.getView('rowsView')?.isFixedColumns?.()) {
      // @ts-expect-error
      this._updateFixedMasterDetailGrids(masterDataGrid, masterRowOptions.rowIndex, $(masterRowOptions.rowElement)).done(d.resolve);
    } else {
      if (masterDataGrid.option('scrolling.useNative') === true) {
        masterDataGrid.updateDimensions().done(() => d.resolve(true));
        return;
      }

      const scrollable = masterDataGrid.getScrollable();

      if (scrollable) {
        // T607490
        scrollable?.update().done(() => d.resolve());
      } else {
        d.resolve();
      }
    }

    return d.promise();
  }

  private _updateFixedMasterDetailGrids(masterDataGrid, masterRowIndex, $detailElement) {
    const d = Deferred();
    const $rows = $(masterDataGrid.getRowElement(masterRowIndex));
    const $tables = $(masterDataGrid.getView('rowsView').getTableElements());
    const rowsNotEqual = $rows?.length === 2 && getHeight($rows.eq(0)) !== getHeight($rows.eq(1));
    const tablesNotEqual = $tables?.length === 2 && getHeight($tables.eq(0)) !== getHeight($tables.eq(1));

    if (rowsNotEqual || tablesNotEqual) {
      const detailElementWidth = getWidth($detailElement);
      masterDataGrid.updateDimensions().done(() => {
        const isDetailHorizontalScrollCanBeShown = this.option('columnAutoWidth') && masterDataGrid.option('scrolling.useNative') === true;
        const isDetailGridWidthChanged = isDetailHorizontalScrollCanBeShown && detailElementWidth !== getWidth($detailElement);

        if (isDetailHorizontalScrollCanBeShown && isDetailGridWidthChanged) {
          this.updateDimensions().done(() => d.resolve(true));
        } else {
          d.resolve(true);
        }
      });

      return d.promise();
    }

    return Deferred().resolve();
  }

  protected _toggleBestFitMode(isBestFit) {
    super._toggleBestFitMode.apply(this, arguments as any);
    if (this.option('masterDetail.template')) {
      const $rowsTable = this._rowsView.getTableElement();
      if ($rowsTable) {
        $rowsTable
          .find('.dx-master-detail-cell')
          .css('maxWidth', isBestFit ? 0 : '');
      }
    }
  }
};

const rowsView = (Base: ModuleType<RowsView>) => class RowsViewMasterDetailExtender extends Base {
  protected _getCellTemplate(options) {
    const that = this;
    const { column } = options;
    const editingController = this._editingController;
    const isEditRow = editingController && editingController.isEditRow(options.rowIndex);
    let template;

    if (column.command === 'detail' && !isEditRow) {
      template = that.option('masterDetail.template') || { allowRenderToDetachedContainer: false, render: that._getDefaultTemplate(column) };
    } else {
      template = super._getCellTemplate.apply(that, arguments as any);
    }

    return template;
  }

  protected _isDetailRow(row) {
    return row && row.rowType && row.rowType.indexOf('detail') === 0;
  }

  protected _createRow(row) {
    const $row = super._createRow.apply(this, arguments as any);

    if (row && this._isDetailRow(row)) {
      this.option('showRowLines') && $row.addClass(ROW_LINES_CLASS);
      $row.addClass(MASTER_DETAIL_ROW_CLASS);

      if (isDefined(row.visible)) {
        $row.toggle(row.visible);
      }
    }
    return $row;
  }

  protected _renderCells($row, options) {
    const { row } = options;

    if (row.rowType && this._isDetailRow(row)) {
      if (this._needRenderCell(0, options.columnIndices)) {
        this._renderMasterDetailCell($row, row, options);
      }
    } else {
      super._renderCells.apply(this, arguments as any);
    }
  }
  protected _renderMasterDetailCell($row, row, options): dxElementWrapper {
    const visibleColumns = this._columnsController.getVisibleColumns();

    const $detailCell = this._renderCell($row, {
      value: null,
      row,
      rowIndex: row.rowIndex,
      column: { command: 'detail' },
      columnIndex: 0,
      change: options.change,
    });

    $detailCell
      .addClass(CELL_FOCUS_DISABLED_CLASS)
      .addClass(MASTER_DETAIL_CELL_CLASS)
      .attr('colSpan', visibleColumns.length);

    const isEditForm = row.isEditing;

    if (!isEditForm) {
      $detailCell.attr('aria-roledescription', messageLocalization.format('dxDataGrid-masterDetail'));
    }

    return $detailCell;
  }
};

export const masterDetailModule = {
  defaultOptions() {
    return {
      masterDetail: {
        enabled: false,
        autoExpandAll: false,
        template: null,
      },
    };
  },
  extenders: {
    controllers: {
      columns,
      data: dataMasterDetailExtenderMixin,
      resizing,
    },
    views: {
      rowsView,
    },
  },
};

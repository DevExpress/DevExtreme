/* eslint-disable max-classes-per-file */
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, isCommandKeyPressed } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import type { ColumnHeadersView } from '@ts/grids/grid_core/column_headers/m_column_headers';
import type { HeaderPanel } from '@ts/grids/grid_core/header_panel/header_panel';
import type { InternalGridOptions, ModuleType, OptionChanged } from '@ts/grids/grid_core/types';

import type { Column, ColumnsChanges } from '../columns_controller/types';
import type { CellRenderOptions, ViewCellOptions, ViewRow } from '../views/types';
import sortingMixin from './m_sorting_mixin';
import type { HeaderActionEvent, SortingColumn } from './types';

const COLUMN_HEADERS_VIEW_NAMESPACE = 'dxDataGridColumnHeadersView';

// TODO getController
const columnHeadersView = (
  Base: ModuleType<ColumnHeadersView>,
): ModuleType<ColumnHeadersView> => class ColumnHeadersViewSortingExtender
  extends sortingMixin(Base) {
  public optionChanged(args: OptionChanged): void {
    switch (args.name) {
      case 'sorting':
        this._invalidate();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  protected _createRow(row: ViewRow): dxElementWrapper {
    const $row = super._createRow(row);

    if (row.rowType === 'header') {
      eventsEngine.on($row, addNamespace(clickEventName, COLUMN_HEADERS_VIEW_NAMESPACE), 'td', this.createAction((e) => {
        this._processHeaderAction(e.event, $row);
      }));
    }

    return $row;
  }

  protected _processHeaderAction(
    event: HeaderActionEvent,
    $row: dxElementWrapper,
  ): void {
    if ($(event.currentTarget).parent().get(0) !== $row.get(0)) {
      return;
    }
    let keyName: 'shift' | 'ctrl' | null = null;
    const $cellElementFromEvent = $(event.currentTarget);
    const rowIndex = $cellElementFromEvent.parent().index();
    const cellElements: Element[] = [].slice.call(this.getCellElements(rowIndex));
    const columnIndex = cellElements.indexOf($cellElementFromEvent.get(0));
    const visibleColumns = this._columnsController.getVisibleColumns(rowIndex);
    const column = visibleColumns[columnIndex];
    const editingController = this.getController('editing');
    const editingMode = this.option('editing.mode');
    const isCellEditing = editingController?.isEditing() && (editingMode === 'batch' || editingMode === 'cell');

    if (isCellEditing || !this._isSortableElement($(event.target))) {
      return;
    }

    if (column && !isDefined(column.groupIndex) && !column.command) {
      if (event.shiftKey) {
        keyName = 'shift';
      } else if (isCommandKeyPressed(event)) {
        keyName = 'ctrl';
      }
      setTimeout(() => {
        if (isDefined(column.index)) {
          this._columnsController.changeSortOrder(column.index, keyName);
        }
      });
    }
  }

  protected _renderCellContent(
    $cell: dxElementWrapper,
    options: ViewCellOptions,
    renderOptions: CellRenderOptions,
  ): void {
    const { column } = options;

    if (!column.command && options.rowType === 'header') {
      this._applyColumnState({
        name: 'sort',
        rootElement: $cell,
        column,
        showColumnLines: this.option('showColumnLines'),
      });
    }

    super._renderCellContent($cell, options, renderOptions);
  }

  protected _columnOptionChanged(e: ColumnsChanges): void {
    const { changeTypes } = e;

    if (changeTypes.length === 1 && changeTypes.sorting) {
      this._updateIndicators('sort');
      return;
    }

    super._columnOptionChanged(e);
  }
};

const headerPanel = (
  Base: ModuleType<HeaderPanel>,
): ModuleType<HeaderPanel> => class HeaderPanelSortingExtender extends sortingMixin(Base) {
  public optionChanged(args: OptionChanged): void {
    switch (args.name) {
      case 'sorting':
        this._invalidate();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }

  protected _createGroupPanelItem(
    $rootElement: dxElementWrapper,
    groupColumn: Column,
  ): dxElementWrapper {
    // @ts-expect-error _createGroupPanelItem is defined by DataGrid grouping
    const $item: dxElementWrapper = super._createGroupPanelItem($rootElement, groupColumn);

    eventsEngine.on($item, addNamespace(clickEventName, 'dxDataGridHeaderPanel'), this.createAction(() => {
      if (isDefined(groupColumn.index)) {
        this._processGroupItemAction(groupColumn.index);
      }
    }));

    const sortColumn: SortingColumn = {
      alignment: this.option('rtlEnabled') ? 'right' : 'left',
      allowSorting: groupColumn.allowSorting,
      sortOrder: groupColumn.sortOrder === 'desc' ? 'desc' : 'asc',
      isGrouped: true,
    };

    this._applyColumnState({
      name: 'sort',
      rootElement: $item,
      column: sortColumn,
      showColumnLines: true,
    });

    return $item;
  }

  private _processGroupItemAction(groupColumnIndex: number): void {
    setTimeout(() => this.getController('columns').changeSortOrder(groupColumnIndex));
  }
};

export const sortingModule = {
  defaultOptions(): InternalGridOptions {
    return {
      sorting: {
        mode: 'single',
        ascendingText: messageLocalization.format('dxDataGrid-sortingAscendingText'),
        descendingText: messageLocalization.format('dxDataGrid-sortingDescendingText'),
        clearText: messageLocalization.format('dxDataGrid-sortingClearText'),
        showSortIndexes: true,
      },
    };
  },
  extenders: {
    views: {
      columnHeadersView,
      headerPanel,
    },
  },
};

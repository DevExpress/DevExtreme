import type { ChangedOptionInfo } from '@js/common/core/events';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { deferUpdate } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getWidth, setWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import type { DragTemplateData } from '@js/ui/sortable';
import { WIDGET_CLASS } from '@ts/core/widget/widget';
import type { DragElementShownArgs, DragEventArgs, ElementOffsetOptions } from '@ts/draggable.types';
/** @architectureLeak data_grid/summary: footer rows are not draggable */
import { DATAGRID_FOOTER_ROW_CLASS } from '@ts/grids/data_grid/summary/const';
import type { ColumnFixingRowsViewExtension } from '@ts/grids/grid_core/column_fixing/types';
import { CLASSES as COLUMN_HEADERS_CLASSES } from '@ts/grids/grid_core/column_headers/const';
import type { DataChange, ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import { CLASSES as GRID_VIEW_CLASSES } from '@ts/grids/grid_core/grid_view/const';
import type {
  InternalGrid,
  InternalGridOptions,
  ModuleType,
  OptionChanged,
} from '@ts/grids/grid_core/types';
import gridCoreUtils from '@ts/grids/grid_core/utils';
import { CLASSES as VIEW_CLASSES } from '@ts/grids/grid_core/views/const';
import type { RowsView } from '@ts/grids/grid_core/views/rows_view';
import { VIRTUAL_ROW_CLASS } from '@ts/grids/grid_core/virtual_scrolling/const';
import Sortable from '@ts/sortable';
import { SCROLLABLE_CONTAINER_CLASS } from '@ts/ui/scroll_view/consts';

import { ATTRIBUTES, CLASSES } from './const';
import { GridCoreRowDraggingDom } from './dom';
import type {
  DraggableGridOptions,
  HandleCellTemplate,
  RowDraggingAddEvent,
  RowDraggingEndEvent,
  RowDraggingOptions,
  RowDraggingStartEvent,
} from './types';

const rowsView = (
  Base: ModuleType<RowsView & ColumnFixingRowsViewExtension>,
): ModuleType<
  RowsView & ColumnFixingRowsViewExtension
> => class RowsViewRowDraggingExtender extends Base {
  private _sortable?: Sortable;

  private _sortableFixed?: Sortable;

  private _previousOffset?: number;

  public init(): void {
    super.init();
    this._updateHandleColumn();
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name === 'rowDragging') {
      this._updateHandleColumn();
      this._invalidate(true, true);
      args.handled = true;
    }

    super.optionChanged(args);
  }

  private _allowReordering(): boolean {
    const rowDragging = this.option('rowDragging');

    return !!rowDragging?.allowReordering
      || !!rowDragging?.allowDropInsideItem
      || !!rowDragging?.group;
  }

  private _updateHandleColumn(): void {
    const rowDragging = this.option('rowDragging');
    const allowReordering = this._allowReordering();
    const isHandleColumnVisible = allowReordering && rowDragging?.showDragIcons;

    this._columnsController?.addCommandColumn({
      type: 'drag',
      command: 'drag',
      visibleIndex: -2,
      alignment: 'center',
      elementAttr: [{ name: ATTRIBUTES.dragCell, value: '' }],
      cssClass: CLASSES.commandDrag,
      width: 'auto',
      cellTemplate: this._getHandleTemplate(),
      visible: isHandleColumnVisible,
    });

    this._columnsController?.columnOption('type:drag', 'visible', isHandleColumnVisible);
  }

  private getSortable(): Sortable | undefined {
    return this._isFixedTableRendering ? this._sortableFixed : this._sortable;
  }

  private setSortable(sortable: Sortable): void {
    if (this._isFixedTableRendering) {
      this._sortableFixed = sortable;
    } else {
      this._sortable = sortable;
    }
  }

  protected _renderContent(
    contentElement: dxElementWrapper,
    tableElement: dxElementWrapper,
    isFixedTable?: boolean,
  ): dxElementWrapper | undefined {
    // @ts-expect-error the rowDragging option has a default value
    const rowDragging: RowDraggingOptions = this.option('rowDragging');
    const allowReordering = this._allowReordering();
    const $content = super._renderContent(
      contentElement,
      tableElement,
      isFixedTable,
    );

    if (!$content) {
      return undefined;
    }

    const isFixedSortable = this._isFixedTableRendering;
    const togglePointerEventsStyle = (toggle: boolean): void => {
      // T929503
      this._sortableFixed?.$element().css('pointerEvents', toggle ? 'auto' : '');
    };

    const rowSelector = `.${VIEW_CLASSES.row}:not(.${VIEW_CLASSES.freeSpaceRow}):not(.${VIRTUAL_ROW_CLASS}):not(.${COLUMN_HEADERS_CLASSES.headerRow}):not(.${DATAGRID_FOOTER_ROW_CLASS})`;
    const filter = this.option('dataRowTemplate')
      ? `> table > tbody${rowSelector}`
      : `> table > tbody > ${rowSelector}`;

    if ((allowReordering || this.getSortable()) && $content.length) {
      // @ts-expect-error rowDragging handlers are typed for the grid's event args
      this.setSortable(this._createComponent($content, Sortable, extend({
        component: this.component,
        contentTemplate: null,
        filter,
        cursorOffset: (options: ElementOffsetOptions) => {
          const { event } = options;
          const rowsViewOffset = $(this.element()).offset();

          return {
            // @ts-expect-error offset() is typed as possibly undefined
            x: event.pageX - rowsViewOffset.left,
          };
        },
        onDraggableElementShown: (e: DragElementShownArgs) => {
          if (rowDragging.dragTemplate) {
            return;
          }

          const gridInstance = $(e.dragElement).children(`.${WIDGET_CLASS}`).data(this.component.NAME);

          this._synchronizeScrollLeftPosition(gridInstance);
        },
        dragTemplate: this._getDraggableRowTemplate(),
        handle: rowDragging.showDragIcons && `.${CLASSES.commandDrag}`,
        dropFeedbackMode: 'indicate' as const,
      }, rowDragging, {
        onDragStart: (e: RowDraggingStartEvent) => {
          // TODO getController
          this.getController('keyboardNavigation')?._resetFocusedCell();
          const row = e.component.getVisibleRows()[e.fromIndex];
          e.itemData = row?.data;

          const isDataRow = row?.rowType === 'data';

          e.cancel = !allowReordering || !isDataRow;

          rowDragging.onDragStart?.(e);
        },
        onDragEnter: (e: DragEventArgs) => {
          if (e.fromComponent !== e.toComponent) {
            togglePointerEventsStyle(true);
          }
        },
        onDragLeave: () => {
          togglePointerEventsStyle(false);
        },
        onDragEnd: (e: RowDraggingEndEvent) => {
          togglePointerEventsStyle(false);
          rowDragging.onDragEnd?.(e);
        },
        onAdd: (e: RowDraggingAddEvent) => {
          togglePointerEventsStyle(false);
          rowDragging.onAdd?.(e);
        },
        dropFeedbackMode: rowDragging.dropFeedbackMode,
        onOptionChanged: (e: ChangedOptionInfo) => {
          const isIndexOption = e.name === 'fromIndex' || e.name === 'toIndex';
          if (this._sortableFixed && isIndexOption) {
            if (isFixedSortable) {
              // @ts-expect-error both sortables exist once the fixed one does
              this._sortable.option(e.name, e.value);
            } else {
              this._sortableFixed.option(e.name, e.value);
            }
          }
        },
      })));

      $content.toggleClass(SCROLLABLE_CONTAINER_CLASS, this._isFixedTableRendering);
      $content.toggleClass(
        CLASSES.sortableWithoutHandle,
        allowReordering && !rowDragging.showDragIcons,
      );
    }

    return $content;
  }

  protected _renderCore(e?: DataChange): DeferredObj<unknown> {
    const deferred = super._renderCore(e);

    if (e?.changeType === 'update'
        && e.repaintChangesOnly
        && gridCoreUtils.isVirtualRowRendering(this)) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget update
      deferUpdate(() => {
        this._updateSortable();
      });
    }

    return deferred;
  }

  private _updateSortable(): void {
    const offset = this._dataController.getRowIndexOffset();

    [this._sortable, this._sortableFixed].forEach((sortable) => {
      const toIndex = sortable?.option('toIndex');

      if (isDefined(toIndex) && isDefined(this._previousOffset)) {
        const offsetDiff = offset - this._previousOffset;
        sortable?.option('toIndex', toIndex - offsetDiff);
      }
      sortable?.option('offset', offset);
      sortable?.update();
    });

    this._previousOffset = offset;
  }

  protected _resizeCore(): void {
    super._resizeCore();
    this._updateSortable();
  }

  private _getDraggableGridOptions(options: ProcessedItem): DraggableGridOptions {
    const gridOptions = this.option();
    const columns = this.getColumns();
    const $rowElement = isDefined(options.rowIndex)
      ? $(this.getRowElement(options.rowIndex))
      : $();

    return {
      dataSource: [{ id: 1, parentId: 0 }],
      showBorders: true,
      showColumnHeaders: false,
      scrolling: {
        useNative: false,
        showScrollbar: 'never',
      },
      pager: {
        visible: false,
      },
      loadingTimeout: null,
      columnFixing: gridOptions.columnFixing,
      columnAutoWidth: gridOptions.columnAutoWidth,
      showColumnLines: gridOptions.showColumnLines,
      columns: columns.map((column) => ({
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- 0 falls back
        width: column.width || column.visibleWidth,
        fixed: column.fixed,
        fixedPosition: column.fixedPosition,
      })),
      isDragging: true,
      onRowPrepared: (e): void => {
        const draggableRowsView = e.component.getView('rowsView') as RowsView & ColumnFixingRowsViewExtension;
        const tableIndex = draggableRowsView._isFixedTableRendering ? 1 : 0;

        $(e.rowElement).replaceWith($rowElement.eq(tableIndex).clone());
      },
    };
  }

  private _synchronizeScrollLeftPosition(gridInstance: InternalGrid | undefined): void {
    const scrollable = gridInstance?.getScrollable();

    scrollable?.scrollTo({ left: this._scrollLeft });
  }

  private _getDraggableRowTemplate(): (options: DragTemplateData) => dxElementWrapper {
    return (options) => {
      const $rootElement = this.component.$element();
      const $dataGridContainer = $('<div>');
      setWidth($dataGridContainer, getWidth($rootElement.get(0)));
      const items = this._dataController.items();
      const row = items?.[options.fromIndex];
      const gridOptions = this._getDraggableGridOptions(row);

      // @ts-expect-error _createComponent() is typed for a class, the grid passes its name
      this._createComponent($dataGridContainer, this.component.NAME, gridOptions);
      $dataGridContainer
        .find(`.${GRID_VIEW_CLASSES.gridBaseContainer}`)
        .children(`:not(.${this.addWidgetPrefix(VIEW_CLASSES.rowsView)})`)
        .hide();

      $dataGridContainer.addClass(this.addWidgetPrefix(CLASSES.dragView));

      return $dataGridContainer;
    };
  }

  private _getHandleTemplate(): HandleCellTemplate {
    return GridCoreRowDraggingDom.createHandleTemplateFunc(
      (string) => this.addWidgetPrefix(string),
    );
  }
};

export const rowDraggingModule = {
  defaultOptions(): Pick<InternalGridOptions, 'rowDragging'> {
    return {
      rowDragging: {
        showDragIcons: true,
        dropFeedbackMode: 'indicate',
        allowReordering: false,
        allowDropInsideItem: false,
      },
    };
  },
  extenders: {
    views: {
      rowsView,
    },
  },
};

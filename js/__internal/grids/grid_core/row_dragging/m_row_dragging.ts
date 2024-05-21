import $ from '@js/core/../core/renderer';
import { extend } from '@js/core/../core/utils/extend';
import { deferUpdate } from '@js/core/utils/common';
import { getWidth, setWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import Sortable from '@js/ui/sortable';
import type { ModuleType } from '@ts/grids/grid_core/m_types';
import type { RowsView } from '@ts/grids/grid_core/views/m_rows_view';

import gridCoreUtils from '../m_utils';
import { ATTRIBUTES, CLASSES } from './const';
import { GridCoreRowDraggingDom } from './dom';

const rowsView = (Base: ModuleType<RowsView>) => class RowsViewRowDraggingExtender extends Base {
  public init() {
    super.init.apply(this, arguments as any);
    this._updateHandleColumn();
  }

  public optionChanged(args) {
    if (args.name === 'rowDragging') {
      this._updateHandleColumn();
      this._invalidate(true, true);
      args.handled = true;
    }

    super.optionChanged.apply(this, arguments as any);
  }

  private _allowReordering() {
    const rowDragging = this.option('rowDragging');

    return !!(rowDragging && (rowDragging.allowReordering || rowDragging.allowDropInsideItem || rowDragging.group));
  }

  private _updateHandleColumn() {
    const rowDragging: any = this.option('rowDragging');
    const allowReordering = this._allowReordering();
    const columnsController = this._columnsController;
    const isHandleColumnVisible = allowReordering && rowDragging.showDragIcons;

    columnsController?.addCommandColumn({
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

    columnsController?.columnOption('type:drag', 'visible', isHandleColumnVisible);
  }

  protected _renderContent() {
    const rowDragging: any = this.option('rowDragging');
    const allowReordering = this._allowReordering();
    const $content = super._renderContent.apply(this, arguments as any);
    // @ts-expect-error
    const isFixedTableRendering = this._isFixedTableRendering;
    const sortableName = '_sortable';
    const sortableFixedName = '_sortableFixed';
    const currentSortableName = isFixedTableRendering ? sortableFixedName : sortableName;
    const anotherSortableName = isFixedTableRendering ? sortableName : sortableFixedName;
    const togglePointerEventsStyle = (toggle) => {
      // T929503
      this[sortableFixedName]?.$element().css('pointerEvents', toggle ? 'auto' : '');
    };

    const rowSelector = '.dx-row:not(.dx-freespace-row):not(.dx-virtual-row):not(.dx-header-row):not(.dx-footer-row)';
    const filter = this.option('dataRowTemplate')
      ? `> table > tbody${rowSelector}`
      : `> table > tbody > ${rowSelector}`;

    if ((allowReordering || this[currentSortableName]) && $content.length) {
      this[currentSortableName] = this._createComponent($content, Sortable, extend({
        component: this.component,
        contentTemplate: null,
        filter,
        cursorOffset: (options) => {
          const { event } = options;
          const rowsViewOffset = $(this.element()).offset();

          return {
            // @ts-expect-error
            x: event.pageX - rowsViewOffset.left,
          };
        },
        onDraggableElementShown: (e) => {
          if (rowDragging.dragTemplate) {
            return;
          }

          const $dragElement = $(e.dragElement);
          const gridInstance = $dragElement.children('.dx-widget').data(this.component.NAME);

          this._synchronizeScrollLeftPosition(gridInstance);
        },
        dragTemplate: this._getDraggableRowTemplate(),
        handle: rowDragging.showDragIcons && `.${CLASSES.commandDrag}`,
        dropFeedbackMode: 'indicate',
      }, rowDragging, {
        onDragStart: (e) => {
          // TODO getController
          this.getController('keyboardNavigation')?._resetFocusedCell();

          const row = e.component.getVisibleRows()[e.fromIndex];
          e.itemData = row && row.data;

          const isDataRow = row && row.rowType === 'data';

          e.cancel = !allowReordering || !isDataRow;

          rowDragging.onDragStart?.(e);
        },
        onDragEnter: () => {
          togglePointerEventsStyle(true);
        },
        onDragLeave: () => {
          togglePointerEventsStyle(false);
        },
        onDragEnd: (e) => {
          togglePointerEventsStyle(false);
          rowDragging.onDragEnd?.(e);
        },
        onAdd: (e) => {
          togglePointerEventsStyle(false);
          rowDragging.onAdd?.(e);
        },
        dropFeedbackMode: rowDragging.dropFeedbackMode,
        onOptionChanged: (e) => {
          const hasFixedSortable = this[sortableFixedName];
          if (hasFixedSortable) {
            if (e.name === 'fromIndex' || e.name === 'toIndex') {
              this[anotherSortableName].option(e.name, e.value);
            }
          }
        },
      }));

      $content.toggleClass('dx-scrollable-container', isFixedTableRendering);
      $content.toggleClass(CLASSES.sortableWithoutHandle, allowReordering && !rowDragging.showDragIcons);
    }

    return $content;
  }

  protected _renderCore(e) {
    super._renderCore.apply(this, arguments as any);

    if (e && e.changeType === 'update'
        && e.repaintChangesOnly
        && gridCoreUtils.isVirtualRowRendering(this)) {
      deferUpdate(() => {
        this._updateSortable();
      });
    }
  }

  private _updateSortable() {
    const offset = this._dataController.getRowIndexOffset();
    // @ts-expect-error
    const offsetDiff = offset - this._previousOffset;

    // @ts-expect-error
    [this._sortable, this._sortableFixed].forEach((sortable) => {
      const toIndex = sortable?.option('toIndex');

      // @ts-expect-error
      if (isDefined(toIndex) && isDefined(this._previousOffset)) {
        sortable?.option('toIndex', toIndex - offsetDiff);
      }
      sortable?.option('offset', offset);
      sortable?.update();
    });

    // @ts-expect-error
    this._previousOffset = offset;
  }

  protected _resizeCore() {
    super._resizeCore.apply(this, arguments as any);
    this._updateSortable();
  }

  private _getDraggableGridOptions(options) {
    const gridOptions = this.option();
    const columns = this.getColumns();
    const $rowElement = $(this.getRowElement(options.rowIndex));

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
        width: column.width || column.visibleWidth,
        fixed: column.fixed,
        fixedPosition: column.fixedPosition,
      })),
      onRowPrepared: (e) => {
        const rowsView = e.component.getView('rowsView');
        $(e.rowElement).replaceWith($rowElement.eq(rowsView._isFixedTableRendering ? 1 : 0).clone());
      },
    };
  }

  private _synchronizeScrollLeftPosition(gridInstance) {
    const scrollable = gridInstance?.getScrollable();

    scrollable?.scrollTo({ x: this._scrollLeft });
  }

  private _getDraggableRowTemplate() {
    return (options) => {
      const $rootElement = this.component.$element();
      const $dataGridContainer = $('<div>');
      setWidth($dataGridContainer, getWidth($rootElement));
      const items = this._dataController.items();
      const row = items && items[options.fromIndex];
      const gridOptions = this._getDraggableGridOptions(row);

      // @ts-expect-error
      this._createComponent($dataGridContainer, this.component.NAME, gridOptions);
      $dataGridContainer
        .find('.dx-gridbase-container')
        .children(`:not(.${this.addWidgetPrefix(CLASSES.rowsView)})`)
        .hide();

      return $dataGridContainer;
    };
  }

  private _getHandleTemplate() {
    return GridCoreRowDraggingDom.createHandleTemplateFunc(
      (string) => this.addWidgetPrefix(string),
    );
  }
};

export const rowDraggingModule = {
  defaultOptions() {
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

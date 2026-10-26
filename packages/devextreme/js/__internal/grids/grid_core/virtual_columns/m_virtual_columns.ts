/* eslint-disable max-classes-per-file */
import type { dxElementWrapper } from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import type { DeferredObj } from '@js/core/utils/deferred';
import { getHeight, getOuterWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { DataChange } from '@ts/grids/grid_core/data_controller/types';
import type { ResizingController } from '@ts/grids/grid_core/grid_view/grid_view';

import type { ColumnsController } from '../columns_controller/columns_controller';
import type { Column } from '../columns_controller/types';
import type { ModuleType } from '../types';
import gridCoreUtils from '../utils';
import type { ColumnsView } from '../views/columns_view';
import type { RowsView } from '../views/rows_view';
import type { RowsViewScrollEvent } from '../views/types';
import { createColumnsInfo } from './m_virtual_columns_core';
import type { VirtualColumnsController, VirtualColumnsOptions } from './types';

const baseView = <T extends ModuleType<ColumnsView>>(
  Base: T,
): T => class BaseViewVirtualColumnsExtender extends Base {
  protected _needToSetCellWidths(): boolean | undefined {
    let result = super._needToSetCellWidths();

    if (!result && this._columnsController.isVirtualMode()) {
      const columns = this._columnsController.getColumns();

      result = columns.some((column) => column.width === 'auto');
    }

    return result;
  }
};

const rowsView = (
  Base: ModuleType<RowsView>,
): ModuleType<RowsView> => class VirtualColumnsRowsViewExtender extends baseView(Base) {
  protected declare _columnsController: VirtualColumnsController;

  protected _resizeCore(): void {
    super._resizeCore();
    this._columnsController.resize();
  }

  protected _handleScroll(e: RowsViewScrollEvent): void {
    const left = this.normalizeScrollLeft(e.scrollOffset.left);

    this._scrollLeft = e.scrollOffset.left;

    super._handleScroll(e);

    this._columnsController.setScrollPosition(left, e.event);
  }

  protected _renderCore(e?: DataChange): DeferredObj<unknown> {
    if (e && 'virtualColumnsScrolling' in e && e.virtualColumnsScrolling) {
      // @ts-expect-error _findContentElement() is typed as possibly undefined
      const $contentElement: dxElementWrapper = this._findContentElement();
      const fixedColumns = this._columnsController?.getFixedColumns();
      const useNativeScrolling = this._scrollable?.option('useNative');
      const legacyMode = this.option('columnFixing.legacyMode');

      if (fixedColumns?.length) {
        // TODO: remove the condition when legacyMode is removed
        if (legacyMode && !useNativeScrolling) {
          $contentElement.css({ minHeight: gridCoreUtils.getContentHeightLimit(browser) });
        } else {
          $contentElement.css({ minHeight: getHeight($contentElement) });
        }

        const resizeCompletedHandler = (): void => {
          this.resizeCompleted.remove(resizeCompletedHandler);
          $contentElement.css({ minHeight: '' });
        };

        this.resizeCompleted.add(resizeCompletedHandler);
      }
    }

    return super._renderCore(e);
  }
};

const columns = (
  Base: ModuleType<ColumnsController>,
): ModuleType<VirtualColumnsController> => class VirtualColumnsControllerExtender extends Base {
  private _beginPageIndex?: number | null;

  private _endPageIndex?: number | null;

  private _position!: number;

  private _virtualVisibleColumns!: Record<string, Column[]>;

  private _renderTime?: number;

  private _changedTimeout?: ReturnType<typeof setTimeout>;

  private _resizingController!: ResizingController;

  public init(...args: Parameters<ColumnsController['init']>): void {
    super.init(...args);

    this._resizingController = this.getController('resizing');

    this._beginPageIndex = null;
    this._endPageIndex = null;
    this._position ??= 0;
    this._virtualVisibleColumns = {};
  }

  public dispose(): void {
    clearTimeout(this._changedTimeout);
    super.dispose();
  }

  public resetColumnsCache(): void {
    super.resetColumnsCache();
    this._virtualVisibleColumns = {};
  }

  private getBeginPageIndex(position: number): number {
    const visibleColumns = this.getVisibleColumns(undefined, true);
    const widths = gridCoreUtils.getColumnWidths(visibleColumns);
    let currentPosition = 0;

    for (let index = 0; index < widths.length; index += 1) {
      if (currentPosition >= position) {
        return Math.floor(index / this.getColumnPageSize());
      }
      currentPosition += widths[index];
    }

    return 0;
  }

  private getTotalWidth(): number {
    const width = this.option('width');
    if (typeof width === 'number') {
      return width;
    }
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- 0 falls back
    return this._resizingController._lastWidth || getOuterWidth(this.component.$element().get(0));
  }

  private getEndPageIndex(position: number): number {
    const visibleColumns = this.getVisibleColumns(undefined, true);
    const widths = gridCoreUtils.getColumnWidths(visibleColumns);
    const endPosition = position + this.getTotalWidth();
    let currentPosition = 0;

    for (let index = 0; index < widths.length; index += 1) {
      if (currentPosition >= endPosition) {
        return Math.ceil(index / this.getColumnPageSize());
      }
      currentPosition += widths[index];
    }

    return Math.ceil(widths.length / this.getColumnPageSize());
  }

  private getColumnPageSize(): number {
    return this.option('scrolling.columnPageSize');
  }

  private _fireColumnsChanged(event?: unknown): void {
    const date = new Date();
    this.columnsChanged.fire({
      optionNames: { all: true, length: 1 },
      changeTypes: {
        columns: true, virtualColumnsScrolling: true, length: 2, event,
      },
    });
    this._renderTime = new Date().getTime() - date.getTime();
  }

  private getScrollingTimeout(): number {
    const renderingThreshold = this.option('scrolling.columnRenderingThreshold');
    const renderAsync = this.option('scrolling.renderAsync');
    let scrollingTimeout = 0;

    if ((!isDefined(renderAsync) && Number(this._renderTime) > renderingThreshold) || renderAsync) {
      scrollingTimeout = this.option('scrolling.timeout');
    }

    return scrollingTimeout;
  }

  public resize(): void {
    this._setScrollPositionCore(this._position);
  }

  private _setScrollPositionCore(position: number, event?: unknown): void {
    const needColumnsChanged = this.isNeedToRenderVirtualColumns(position);

    if (needColumnsChanged) {
      this._position = position;
      this._beginPageIndex = this.getBeginPageIndex(position);
      this._endPageIndex = this.getEndPageIndex(position);
      this._fireColumnsChanged(event);
    }
  }

  public isNeedToRenderVirtualColumns(scrollPosition: number): boolean {
    if (this.isVirtualMode()) {
      if (scrollPosition < this._position) {
        return Number(this._beginPageIndex) > this.getBeginPageIndex(scrollPosition);
      }

      return Number(this._endPageIndex) < this.getEndPageIndex(scrollPosition);
    }

    return false;
  }

  public getFixedColumns(rowIndex?: number | null, isBase?: boolean): Column[] {
    const fixedColumns = super.getFixedColumns(rowIndex);
    if (this.isVirtualMode() && !isBase && fixedColumns.length) {
      const transparentColumnIndex = fixedColumns.map((c) => c.command).indexOf('transparent');
      fixedColumns[transparentColumnIndex].colspan = this.getVisibleColumns().length
        - super.getFixedColumns().length + 1;
      return fixedColumns;
    }

    return fixedColumns;
  }

  protected _compileVisibleColumns(rowIndex?: number | null, isBase?: boolean): Column[] {
    if (isBase || !this.isVirtualMode() || !this._shouldReturnVisibleColumns()) {
      return super._compileVisibleColumns(rowIndex);
    }

    if (
      this._columns?.length
      && !isDefined(this._beginPageIndex)
      && !isDefined(this._endPageIndex)
    ) {
      this._beginPageIndex = this.getBeginPageIndex(this._position);
      this._endPageIndex = this.getEndPageIndex(this._position);
    }

    const beginPageIndex = this._beginPageIndex;
    const endPageIndex = this._endPageIndex;
    const visibleColumnsHash = `${rowIndex}-${beginPageIndex}-${endPageIndex}`;

    if (this._virtualVisibleColumns[visibleColumnsHash]) {
      return this._virtualVisibleColumns[visibleColumnsHash];
    }

    let visibleColumns = super._compileVisibleColumns();
    const rowCount = this.getRowCount();
    const pageSize = this.getColumnPageSize();
    let startIndex = Number(beginPageIndex) * pageSize;
    let endIndex = Number(endPageIndex) * pageSize;
    const fixedColumns = this.getFixedColumns(undefined, true);
    const transparentColumnIndex = fixedColumns.map((c) => c.command).indexOf('transparent');

    const beginFixedColumnCount = fixedColumns.length ? transparentColumnIndex : 0;
    let beginFixedColumns = visibleColumns.slice(0, beginFixedColumnCount);
    const beginColumns = visibleColumns.slice(beginFixedColumnCount, startIndex);
    const beginWidth = gridCoreUtils.getColumnWidths(beginColumns).reduce((a, b) => a + b, 0);

    if (!beginWidth) {
      startIndex = 0;
    }

    const endFixedColumnCount = fixedColumns.length
      ? fixedColumns.length - transparentColumnIndex - 1
      : 0;
    let endFixedColumns = visibleColumns.slice(visibleColumns.length - endFixedColumnCount);
    const endColumns = visibleColumns.slice(endIndex, visibleColumns.length - endFixedColumnCount);
    const endWidth = gridCoreUtils.getColumnWidths(endColumns).reduce((a, b) => a + b, 0);

    if (!endWidth) {
      endIndex = visibleColumns.length;
    }

    if (rowCount > 1 && typeof rowIndex === 'number') {
      const columnsInfo: Column[][] = [];
      for (let i = 0; i <= rowCount; i += 1) {
        columnsInfo.push(super._compileVisibleColumns(i));
      }
      beginFixedColumns = createColumnsInfo(
        columnsInfo,
        0,
        beginFixedColumns.length,
      )[rowIndex] || [];
      endFixedColumns = createColumnsInfo(
        columnsInfo,
        visibleColumns.length - endFixedColumns.length,
        visibleColumns.length,
      )[rowIndex] || [];
      visibleColumns = createColumnsInfo(columnsInfo, startIndex, endIndex)[rowIndex] || [];
    } else {
      visibleColumns = visibleColumns.slice(startIndex, endIndex);
    }

    if (beginWidth) {
      visibleColumns.unshift({ command: 'virtual', type: 'virtual', width: beginWidth });
      visibleColumns = beginFixedColumns.concat(visibleColumns);
    }

    if (endWidth) {
      visibleColumns.push({ command: 'virtual', type: 'virtual', width: endWidth });
      visibleColumns = visibleColumns.concat(endFixedColumns);
    }

    this._virtualVisibleColumns[visibleColumnsHash] = visibleColumns;

    return visibleColumns;
  }

  public getColumnIndexOffset(): number {
    let offset = 0;
    const beginPageIndex = Number(this._beginPageIndex);
    if (beginPageIndex > 0) {
      const fixedColumns = this.getFixedColumns();
      const transparentColumnIndex = fixedColumns.map((c) => c.command).indexOf('transparent');
      const leftFixedColumnCount = transparentColumnIndex >= 0 ? transparentColumnIndex : 0;
      offset = beginPageIndex * this.getColumnPageSize() - leftFixedColumnCount - 1;
    }
    return offset > 0 ? offset : 0;
  }

  public isVirtualMode(): boolean {
    return hasWindow() && this.option('scrolling.columnRenderingMode') === 'virtual';
  }

  public setScrollPosition(position: number, event?: unknown): void {
    const scrollingTimeout = this.getScrollingTimeout();

    if (scrollingTimeout > 0) {
      clearTimeout(this._changedTimeout);

      this._changedTimeout = setTimeout(() => {
        this._setScrollPositionCore(position, event);
      }, scrollingTimeout);
    } else {
      this._setScrollPositionCore(position, event);
    }
  }
};

export const virtualColumnsModule = {
  defaultOptions(): VirtualColumnsOptions {
    return {
      scrolling: {
        columnRenderingMode: 'standard',
        columnPageSize: 5,
        columnRenderingThreshold: 300,
      },
    };
  },
  extenders: {
    controllers: {
      columns,
    },
    views: {
      rowsView,
    },
  },
};

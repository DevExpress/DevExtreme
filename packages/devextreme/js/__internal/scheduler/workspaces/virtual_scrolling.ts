/* eslint-disable max-classes-per-file */
import type { ScrollDirection, ScrollMode } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { ScrollOffset } from '@ts/core/utils/scroll';

import type { CellPositionData, ViewCellData } from '../types';
import type SchedulerWorkSpace from './m_work_space';

const DEFAULT_CELL_HEIGHT = 50;
const MIN_CELL_WIDTH = 1;
const MIN_SCROLL_OFFSET = 10;
const VIRTUAL_APPOINTMENTS_RENDER_TIMEOUT = 15;
const DOCUMENT_SCROLL_EVENT_NAMESPACE = addNamespace(
  'scroll',
  'dxSchedulerVirtualScrolling',
);
const MAX_CELLS_PER_VIRTUAL_CELL_COUNT = 1000;

interface ScrollingConfig {
  mode: ScrollMode;
  orientation?: ScrollDirection;
  outlineCount?: number;
}

export interface VirtualScrollingDispatcherOptions {
  getCellHeight: () => number;
  getCellWidth: () => number;
  getCellMinWidth: () => number;
  isRTL: () => boolean;
  getSchedulerHeight: () => number | string | undefined;
  getSchedulerWidth: () => number | string | undefined;
  getViewHeight: () => number;
  getViewWidth: () => number;
  getWindowHeight: () => number;
  getWindowWidth: () => number;
  getScrolling: () => ScrollingConfig;
  getScrollableOuterWidth: () => number;
  createAction: (action: () => void) => () => void;
  updateRender?: () => void;
  updateGrid?: () => void;
  getGroupCount: () => number;
  isVerticalGrouping: () => boolean;
  getTotalRowCount: (groupCount: number, isVerticalGrouping: boolean) => number;
  getTotalCellCount: (groupCount: number, isVerticalGrouping: boolean) => number;
}

interface VirtualScrollingState {
  prevPosition: number;
  startIndex: number;
  itemCount: number;
  virtualItemCountBefore: number;
  virtualItemCountAfter: number;
  outlineCountBefore: number;
  outlineCountAfter: number;
  virtualItemSizeBefore: number;
  virtualItemSizeAfter: number;
  outlineSizeBefore: number;
  outlineSizeAfter: number;
}

interface VirtualScrollingBaseOptions extends VirtualScrollingDispatcherOptions {
  itemSize: number;
  viewportSize: number;
  outlineCount?: number;
}

type VerticalVirtualScrollingOptions = VirtualScrollingDispatcherOptions & {
  viewportHeight: number;
  rowHeight: number;
  outlineCount?: number;
};

type HorizontalVirtualScrollingOptions = VirtualScrollingDispatcherOptions & {
  viewportWidth: number;
  cellWidth: number;
  outlineCount?: number;
};

interface VerticalRenderState {
  topVirtualRowHeight: number;
  bottomVirtualRowHeight: number;
  startRowIndex: number;
  rowCount: number;
  startIndex: number;
}

interface HorizontalRenderState {
  leftVirtualCellWidth: number;
  rightVirtualCellWidth: number;
  startCellIndex: number;
  cellCount: number;
  cellWidth: number;
}

type CombinedRenderState = Partial<VerticalRenderState & HorizontalRenderState>;

abstract class VirtualScrollingBase {
  private stateValue: VirtualScrollingState = this.defaultState;

  viewportSize: number = this.options.viewportSize;

  private itemSizeValue: number = this.options.itemSize;

  private positionValue = -1;

  private itemSizeChanged = false;

  constructor(public options: VirtualScrollingBaseOptions) {
    this.updateState(0);
  }

  get itemSize(): number { return this.itemSizeValue; }

  set itemSize(value: number) {
    this.itemSizeChanged = this.itemSizeValue !== value;
    this.itemSizeValue = value;
  }

  get state(): VirtualScrollingState { return this.stateValue; }

  set state(value: VirtualScrollingState) { this.stateValue = value; }

  get startIndex(): number { return this.state.startIndex; }

  get pageSize(): number {
    return Math.ceil(this.viewportSize / this.itemSize);
  }

  get outlineCount(): number {
    return this.options.outlineCount ?? Math.floor(this.pageSize / 2);
  }

  get groupCount(): number { return this.options.getGroupCount(); }

  get isVerticalGrouping(): boolean { return this.options.isVerticalGrouping(); }

  get defaultState(): VirtualScrollingState {
    return {
      prevPosition: 0,
      startIndex: -1,
      itemCount: 0,
      virtualItemCountBefore: 0,
      virtualItemCountAfter: 0,
      outlineCountBefore: 0,
      outlineCountAfter: 0,
      virtualItemSizeBefore: 0,
      virtualItemSizeAfter: 0,
      outlineSizeBefore: 0,
      outlineSizeAfter: 0,
    };
  }

  get maxScrollPosition(): number {
    return this.getTotalItemCount() * this.itemSize - this.viewportSize;
  }

  get position(): number { return this.positionValue; }

  set position(value: number) { this.positionValue = value; }

  needUpdateState(position: number): boolean {
    const {
      prevPosition,
      startIndex,
    } = this.state;
    const isFirstInitialization = startIndex < 0;

    if (isFirstInitialization) {
      return true;
    }

    let isStartIndexChanged = false;

    if (this.validateAndSavePosition(position)) {
      if (position === 0 || position === this.maxScrollPosition) {
        return true;
      }

      const currentPosition = prevPosition;
      const currentItemsCount = Math.floor(currentPosition / this.itemSize);
      const itemsCount = Math.floor(position / this.itemSize);

      isStartIndexChanged = Math.abs(currentItemsCount - itemsCount) >= this.outlineCount;
    }

    return isStartIndexChanged;
  }

  private validateAndSavePosition(position: number): boolean {
    if (!isDefined(position)) {
      return false;
    }

    const result = this.position !== position;

    this.position = position;

    return result;
  }

  private correctPosition(position: number): number {
    if (position < 0) {
      return -1;
    }

    return Math.max(0, Math.min(position, this.maxScrollPosition));
  }

  updateState(rawPosition: number, isForce?: boolean): boolean {
    const position = this.correctPosition(rawPosition);

    if (!this.needUpdateState(position) && !isForce) {
      return false;
    }

    const itemsInfoBefore = this.calcItemInfoBefore(position);
    const itemsDeltaBefore = this.calcItemDeltaBefore(itemsInfoBefore);

    const {
      outlineCountAfter,
      virtualItemCountAfter,
      itemCountWithAfter,
    } = this.calcItemInfoAfter(itemsDeltaBefore);

    const {
      virtualItemCountBefore,
      outlineCountBefore,
    } = itemsInfoBefore;

    const itemCount = outlineCountBefore + itemCountWithAfter + outlineCountAfter;

    const itemCountBefore = Math.floor(position / this.itemSize);

    this.state.prevPosition = itemCountBefore * this.itemSize;
    this.state.startIndex = itemCountBefore - outlineCountBefore;
    this.state.virtualItemCountBefore = virtualItemCountBefore;
    this.state.outlineCountBefore = outlineCountBefore;
    this.state.itemCount = itemCount;
    this.state.outlineCountAfter = outlineCountAfter;
    this.state.virtualItemCountAfter = virtualItemCountAfter;

    this.updateStateCore();

    return true;
  }

  reinitState(itemSize: number, isForceUpdate: boolean): void {
    const { position } = this;

    this.itemSize = itemSize;

    this.updateState(0, isForceUpdate);
    if (position > 0) {
      this.updateState(position, isForceUpdate);
    }
  }

  private calcItemInfoBefore(
    position: number,
  ): { virtualItemCountBefore: number; outlineCountBefore: number } {
    let virtualItemCountBefore = Math.floor(position / this.itemSize);

    const outlineCountBefore = Math.min(virtualItemCountBefore, this.outlineCount);

    virtualItemCountBefore -= outlineCountBefore;

    return {
      virtualItemCountBefore,
      outlineCountBefore,
    };
  }

  private calcItemDeltaBefore(
    itemInfoBefore: { virtualItemCountBefore: number; outlineCountBefore: number },
  ): number {
    const {
      virtualItemCountBefore,
      outlineCountBefore,
    } = itemInfoBefore;

    const totalItemCount = this.getTotalItemCount();

    return totalItemCount - virtualItemCountBefore - outlineCountBefore;
  }

  abstract getTotalItemCount(): number;

  abstract getRenderState(): VerticalRenderState | HorizontalRenderState;

  private calcItemInfoAfter(
    itemsDeltaBefore: number,
  ): { virtualItemCountAfter: number; outlineCountAfter: number; itemCountWithAfter: number } {
    const itemCountWithAfter = itemsDeltaBefore >= this.pageSize
      ? this.pageSize
      : itemsDeltaBefore;

    let virtualItemCountAfter = itemsDeltaBefore - itemCountWithAfter;

    const outlineCountAfter = virtualItemCountAfter > 0
      ? Math.min(virtualItemCountAfter, this.outlineCount)
      : 0;

    if (virtualItemCountAfter > 0) {
      virtualItemCountAfter -= outlineCountAfter;
    }

    return {
      virtualItemCountAfter,
      outlineCountAfter,
      itemCountWithAfter,
    };
  }

  private updateStateCore(): void {
    const { state } = this;

    const { virtualItemCountBefore } = state;
    const { virtualItemCountAfter } = state;
    const { outlineCountBefore } = state;
    const { outlineCountAfter } = state;

    const prevVirtualItemSizeBefore = state.virtualItemSizeBefore;
    const prevVirtualItemSizeAfter = state.virtualItemSizeAfter;
    const prevOutlineSizeBefore = state.outlineSizeBefore;
    const prevOutlineSizeAfter = state.outlineSizeAfter;

    const virtualItemSizeBefore = this.itemSize * virtualItemCountBefore;
    const virtualItemSizeAfter = this.itemSize * virtualItemCountAfter;
    const outlineSizeBefore = this.itemSize * outlineCountBefore;
    const outlineSizeAfter = this.itemSize * outlineCountAfter;

    const prevVirtualSizeBefore = prevVirtualItemSizeBefore + prevOutlineSizeBefore;
    const virtualSizeBefore = virtualItemSizeBefore + outlineSizeBefore;
    const prevVirtualSizeAfter = prevVirtualItemSizeAfter + prevOutlineSizeAfter;
    const virtualSizeAfter = virtualItemSizeAfter + outlineSizeAfter;

    const isAppend = prevVirtualSizeBefore < virtualSizeBefore;
    const isPrepend = prevVirtualSizeAfter < virtualSizeAfter;

    const needAddItems = this.itemSizeChanged || isAppend || isPrepend;
    if (needAddItems) {
      this.updateStateVirtualItems(virtualItemSizeBefore, virtualItemSizeAfter);
    }
  }

  protected updateStateVirtualItems(
    virtualItemSizeBefore: number,
    virtualItemSizeAfter: number,
  ): void {
    const { state } = this;

    state.virtualItemSizeBefore = virtualItemSizeBefore;
    state.virtualItemSizeAfter = virtualItemSizeAfter;
  }
}

class VerticalVirtualScrolling extends VirtualScrollingBase {
  constructor(options: VerticalVirtualScrollingOptions) {
    super({
      ...options,
      itemSize: options.rowHeight,
      viewportSize: options.viewportHeight,
    });
  }

  get prevTopPosition(): number { return this.state.prevPosition; }

  get rowCount(): number { return this.state.itemCount; }

  get topVirtualRowCount(): number { return this.state.virtualItemCountBefore; }

  get bottomVirtualRowCount(): number { return this.state.virtualItemCountAfter; }

  getTotalItemCount(): number {
    return this.options.getTotalRowCount(this.groupCount, this.isVerticalGrouping);
  }

  getRenderState(): VerticalRenderState {
    return {
      topVirtualRowHeight: this.state.virtualItemSizeBefore,
      bottomVirtualRowHeight: this.state.virtualItemSizeAfter,
      startRowIndex: this.state.startIndex,
      rowCount: this.state.itemCount,
      startIndex: this.state.startIndex,
    };
  }
}

class HorizontalVirtualScrolling extends VirtualScrollingBase {
  constructor(options: HorizontalVirtualScrollingOptions) {
    super({
      ...options,
      itemSize: options.cellWidth,
      viewportSize: options.viewportWidth,
    });
  }

  get isRTL(): boolean { return this.options.isRTL(); }

  getTotalItemCount(): number {
    return this.options.getTotalCellCount(this.groupCount, this.isVerticalGrouping);
  }

  getRenderState(): HorizontalRenderState {
    return {
      leftVirtualCellWidth: this.state.virtualItemSizeBefore,
      rightVirtualCellWidth: this.state.virtualItemSizeAfter,
      startCellIndex: this.state.startIndex,
      cellCount: this.state.itemCount,
      cellWidth: this.itemSize,
    };
  }

  protected updateStateVirtualItems(
    virtualItemSizeBefore: number,
    virtualItemSizeAfter: number,
  ): void {
    if (!this.isRTL) {
      super.updateStateVirtualItems(virtualItemSizeBefore, virtualItemSizeAfter);
    } else {
      const { state } = this;

      state.virtualItemSizeAfter = virtualItemSizeBefore;
      state.virtualItemSizeBefore = virtualItemSizeAfter;
      state.startIndex = this.getTotalItemCount() - this.startIndex - this.state.itemCount;
    }
  }
}

export class VirtualScrollingDispatcher {
  private rowHeightValue: number;

  private cellWidthValue: number;

  private verticalVirtualScrollingValue: VerticalVirtualScrolling | undefined;

  private horizontalVirtualScrollingValue: HorizontalVirtualScrolling | undefined;

  private onScrollHandler: (() => void) | undefined;

  constructor(public options: VirtualScrollingDispatcherOptions) {
    this.rowHeightValue = this.getCellHeight();
    this.cellWidthValue = this.getCellWidth();

    this.createVirtualScrollingBase();
  }

  get isRTL(): boolean { return this.options.isRTL(); }

  get verticalVirtualScrolling(): VerticalVirtualScrolling | undefined {
    return this.verticalVirtualScrollingValue;
  }

  set verticalVirtualScrolling(value: VerticalVirtualScrolling | undefined) {
    this.verticalVirtualScrollingValue = value;
  }

  get horizontalVirtualScrolling(): HorizontalVirtualScrolling | undefined {
    return this.horizontalVirtualScrollingValue;
  }

  set horizontalVirtualScrolling(value: HorizontalVirtualScrolling | undefined) {
    this.horizontalVirtualScrollingValue = value;
  }

  get document(): Document { return domAdapter.getDocument(); }

  get height(): number | string | undefined {
    return this.options.getSchedulerHeight();
  }

  get width(): number | string | undefined {
    return this.options.getSchedulerWidth();
  }

  get rowHeight(): number { return this.rowHeightValue; }

  set rowHeight(value: number) { this.rowHeightValue = value; }

  get outlineCount(): number | undefined { return this.options.getScrolling().outlineCount; }

  get cellWidth(): number { return this.cellWidthValue; }

  set cellWidth(value: number) { this.cellWidthValue = value; }

  get viewportWidth(): number {
    const schedulerWidth = this.width;
    const width = schedulerWidth ? this.options.getViewWidth() : 0;

    return width > 0
      ? width
      : this.options.getWindowWidth();
  }

  get viewportHeight(): number {
    const schedulerHeight = this.height;
    const height = schedulerHeight ? this.options.getViewHeight() : 0;

    return height > 0
      ? height
      : this.options.getWindowHeight();
  }

  get cellCountInsideTopVirtualRow(): number {
    return this.verticalScrollingState?.virtualItemCountBefore ?? 0;
  }

  get cellCountInsideLeftVirtualCell(): number {
    return this.horizontalScrollingState?.virtualItemCountBefore ?? 0;
  }

  get cellCountInsideRightVirtualCell(): number {
    return this.horizontalScrollingState?.virtualItemCountAfter ?? 0;
  }

  get topVirtualRowsCount(): number {
    return this.cellCountInsideTopVirtualRow > 0
      ? 1
      : 0;
  }

  get leftVirtualCellsCount(): number {
    const virtualItemsCount = !this.isRTL
      ? this.cellCountInsideLeftVirtualCell
      : this.cellCountInsideRightVirtualCell;

    return Math.ceil(virtualItemsCount / MAX_CELLS_PER_VIRTUAL_CELL_COUNT);
  }

  get virtualRowOffset(): number {
    return this.verticalScrollingState?.virtualItemSizeBefore ?? 0;
  }

  get virtualCellOffset(): number {
    return this.horizontalScrollingState?.virtualItemSizeBefore ?? 0;
  }

  get scrollingState(): {
    vertical: VirtualScrollingState | undefined;
    horizontal: VirtualScrollingState | undefined;
  } {
    return {
      vertical: this.verticalVirtualScrolling?.state,
      horizontal: this.horizontalVirtualScrolling?.state,
    };
  }

  get verticalScrollingState(): VirtualScrollingState | undefined {
    return this.scrollingState.vertical;
  }

  get horizontalScrollingState(): VirtualScrollingState | undefined {
    return this.scrollingState.horizontal;
  }

  get verticalScrollingAllowed(): boolean {
    const { mode, orientation = 'both' } = this.options.getScrolling();

    return mode === 'virtual' && (orientation === 'vertical' || orientation === 'both');
  }

  get horizontalScrollingAllowed(): boolean {
    const { mode, orientation = 'both' } = this.options.getScrolling();

    return mode === 'virtual' && (orientation === 'horizontal' || orientation === 'both');
  }

  setViewOptions(options: VirtualScrollingDispatcherOptions): void {
    this.options = options;

    if (this.verticalVirtualScrolling) {
      this.verticalVirtualScrolling.options = {
        ...options,
        itemSize: this.rowHeight,
        viewportSize: this.viewportHeight,
        outlineCount: this.outlineCount,
      };
      this.verticalVirtualScrolling.itemSize = this.rowHeight;
      this.verticalVirtualScrolling.viewportSize = this.viewportHeight;
    }
    if (this.horizontalVirtualScrolling) {
      this.horizontalVirtualScrolling.options = {
        ...options,
        itemSize: this.cellWidth,
        viewportSize: this.viewportWidth,
        outlineCount: this.outlineCount,
      };
      this.horizontalVirtualScrolling.itemSize = this.cellWidth;
      this.horizontalVirtualScrolling.viewportSize = this.viewportWidth;
    }
  }

  getRenderState(): CombinedRenderState {
    const verticalRenderState = this.verticalVirtualScrolling?.getRenderState() ?? {};
    const horizontalRenderState = this.horizontalVirtualScrolling?.getRenderState() ?? {};

    return {
      ...verticalRenderState,
      ...horizontalRenderState,
    };
  }

  getCellHeight(): number {
    const cellHeight = this.options.getCellHeight();
    const result = cellHeight > 0
      ? cellHeight
      : DEFAULT_CELL_HEIGHT;

    return Math.floor(result);
  }

  getCellWidth(): number {
    let cellWidth = this.options.getCellWidth();
    const minCellWidth = this.options.getCellMinWidth();

    if (!cellWidth || cellWidth < minCellWidth) {
      cellWidth = minCellWidth;
    }

    const result = cellWidth > 0
      ? cellWidth
      : MIN_CELL_WIDTH;

    return Math.floor(result);
  }

  calculateCoordinatesByDataAndPosition(
    cellData: ViewCellData,
    position: CellPositionData,
    date: Date,
    isCalculateTime: boolean,
    isVerticalDirectionView: boolean,
  ): { top: number; left: number } {
    const {
      rowIndex, columnIndex,
    } = position;
    const {
      startDate, endDate, allDay,
    } = cellData;

    const timeToScroll = date.getTime();
    const cellStartTime = startDate.getTime();
    const cellEndTime = endDate.getTime();

    const scrollInCell = allDay || !isCalculateTime
      ? 0
      : (timeToScroll - cellStartTime) / (cellEndTime - cellStartTime);

    const cellWidth = this.getCellWidth();
    const rowHeight = this.getCellHeight();

    const top = isVerticalDirectionView
      ? (rowIndex + scrollInCell) * rowHeight
      : rowIndex * rowHeight;

    let left = isVerticalDirectionView
      ? columnIndex * cellWidth
      : (columnIndex + scrollInCell) * cellWidth;

    if (this.isRTL) {
      left = this.options.getScrollableOuterWidth() - left;
    }

    return { top, left };
  }

  dispose(): void {
    if (this.onScrollHandler) {
      eventsEngine.off(
        this.document,
        DOCUMENT_SCROLL_EVENT_NAMESPACE,
        this.onScrollHandler,
      );
    }
  }

  createVirtualScrolling(): void {
    const isVerticalVirtualScrollingCreated = Boolean(this.verticalVirtualScrolling);
    const isHorizontalVirtualScrollingCreated = Boolean(this.horizontalVirtualScrolling);

    if (this.verticalScrollingAllowed !== isVerticalVirtualScrollingCreated
            || this.horizontalScrollingAllowed !== isHorizontalVirtualScrollingCreated) {
      this.rowHeightValue = this.getCellHeight();
      this.cellWidthValue = this.getCellWidth();
      this.createVirtualScrollingBase();
    }
  }

  private createVirtualScrollingBase(): void {
    if (this.verticalScrollingAllowed) {
      this.verticalVirtualScrolling = new VerticalVirtualScrolling({
        ...this.options,
        viewportHeight: this.viewportHeight,
        rowHeight: this.rowHeight,
        outlineCount: this.outlineCount,
      });
    }

    if (this.horizontalScrollingAllowed) {
      this.horizontalVirtualScrolling = new HorizontalVirtualScrolling({
        ...this.options,
        viewportWidth: this.viewportWidth,
        cellWidth: this.cellWidth,
        outlineCount: this.outlineCount,
      });
    }
  }

  isAttachWindowScrollEvent(): boolean {
    return (this.horizontalScrollingAllowed || this.verticalScrollingAllowed) && !this.height;
  }

  attachScrollableEvents(): void {
    if (this.isAttachWindowScrollEvent()) {
      this.attachWindowScroll();
    }
  }

  private attachWindowScroll(): void {
    const window = getWindow();

    this.onScrollHandler = this.options.createAction(() => {
      const {
        scrollX,
        scrollY,
      } = window;

      if (scrollX >= MIN_SCROLL_OFFSET || scrollY >= MIN_SCROLL_OFFSET) {
        this.handleOnScrollEvent({
          left: scrollX,
          top: scrollY,
        });
      }
    });

    eventsEngine.on(
      this.document,
      DOCUMENT_SCROLL_EVENT_NAMESPACE,
      this.onScrollHandler,
    );
  }

  handleOnScrollEvent(scrollPosition: ScrollOffset | undefined): void {
    if (scrollPosition) {
      const {
        left,
        top,
      } = scrollPosition;

      const verticalStateChanged = isDefined(top)
        && this.verticalVirtualScrolling?.updateState(top);
      const horizontalStateChanged = isDefined(left)
        && this.horizontalVirtualScrolling?.updateState(left);

      if (verticalStateChanged || horizontalStateChanged) {
        this.options.updateRender?.();
      }
    }
  }

  updateDimensions(isForce = false): void {
    const cellHeight = this.getCellHeight();
    const needUpdateVertical = this.verticalScrollingAllowed && cellHeight !== this.rowHeight;
    if ((needUpdateVertical || isForce) && this.verticalVirtualScrolling) {
      this.rowHeight = cellHeight;

      this.verticalVirtualScrolling.viewportSize = this.viewportHeight;
      this.verticalVirtualScrolling.reinitState(cellHeight, isForce);
    }

    const cellWidth = this.getCellWidth();
    const needUpdateHorizontal = this.horizontalScrollingAllowed && cellWidth !== this.cellWidth;
    if ((needUpdateHorizontal || isForce) && this.horizontalVirtualScrolling) {
      this.cellWidth = cellWidth;

      this.horizontalVirtualScrolling.viewportSize = this.viewportWidth;
      this.horizontalVirtualScrolling.reinitState(cellWidth, isForce);
    }

    if (needUpdateVertical || needUpdateHorizontal) {
      this.options.updateGrid?.();
    }
  }
}

// We do not need this class in renovation
export class VirtualScrollingRenderer {
  private renderAppointmentTimeoutID: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly workspaceValue: SchedulerWorkSpace) {
  }

  getRenderTimeout(): number {
    return VIRTUAL_APPOINTMENTS_RENDER_TIMEOUT;
  }

  get workspace(): SchedulerWorkSpace { return this.workspaceValue; }

  updateRender(): void {
    this._renderGrid();
    this.renderAppointments();
  }

  // TODO: make private once external usage in m_work_space.ts is removed
  _renderGrid(): void {
    this.workspace.renderWorkSpace({
      generateNewData: false,
      renderComponents: {
        header: true,
        timePanel: true,
        dateTable: true,
        allDayPanel: true,
      },
    });
  }

  private renderAppointments(): void {
    const renderTimeout = this.getRenderTimeout();

    if (renderTimeout >= 0) {
      clearTimeout(this.renderAppointmentTimeoutID ?? undefined);

      // eslint-disable-next-line no-restricted-globals
      this.renderAppointmentTimeoutID = setTimeout(
        () => this.workspace.renderAppointments(),
        renderTimeout,
      );
    } else {
      this.workspace.renderAppointments();
    }
  }
}

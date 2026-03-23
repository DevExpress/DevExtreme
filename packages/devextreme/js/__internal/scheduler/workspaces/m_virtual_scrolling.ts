/* eslint-disable max-classes-per-file */
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';

const DEFAULT_CELL_HEIGHT = 50;
const MIN_CELL_WIDTH = 1;
const MIN_SCROLL_OFFSET = 10;
const VIRTUAL_APPOINTMENTS_RENDER_TIMEOUT = 15;
const DOCUMENT_SCROLL_EVENT_NAMESPACE = addNamespace('scroll', 'dxSchedulerVirtualScrolling');
const MAX_CELLS_PER_VIRTUAL_CELL_COUNT = 1000;

const scrollingOrientations = {
  vertical: 'vertical',
  horizontal: 'horizontal',
  both: 'both',
  none: 'none',
};
const DefaultScrollingOrientation = scrollingOrientations.both;

export class VirtualScrollingDispatcher {
  private rowHeightValue: any;

  private cellWidthValue: any;

  private verticalVirtualScrollingValue: any;

  private horizontalVirtualScrollingValue: any;

  private onScrollHandler: any;

  constructor(public options?: any) {
    if (options) {
      this.rowHeightValue = this.getCellHeight();
      this.cellWidthValue = this.getCellWidth();

      this.createVirtualScrollingBase();
    }
  }

  get isRTL() { return this.options.isRTL(); }

  get verticalVirtualScrolling() { return this.verticalVirtualScrollingValue; }

  set verticalVirtualScrolling(value) { this.verticalVirtualScrollingValue = value; }

  get horizontalVirtualScrolling() { return this.horizontalVirtualScrollingValue; }

  set horizontalVirtualScrolling(value) { this.horizontalVirtualScrollingValue = value; }

  get document() { return domAdapter.getDocument(); }

  get height() {
    return this.options.getSchedulerHeight();
  }

  get width() {
    return this.options.getSchedulerWidth();
  }

  get rowHeight() { return this.rowHeightValue; }

  set rowHeight(value) { this.rowHeightValue = value; }

  get outlineCount() { return this.options.getScrolling().outlineCount; }

  get cellWidth() { return this.cellWidthValue; }

  set cellWidth(value) { this.cellWidthValue = value; }

  get viewportWidth() {
    const width = this.width && this.options.getViewWidth();

    return width > 0
      ? width
      : this.options.getWindowWidth();
  }

  get viewportHeight() {
    const height = this.height && this.options.getViewHeight();

    return height > 0
      ? height
      : this.options.getWindowHeight();
  }

  get cellCountInsideTopVirtualRow() { return this.verticalScrollingState?.virtualItemCountBefore || 0; }

  get cellCountInsideLeftVirtualCell() { return this.horizontalScrollingState?.virtualItemCountBefore || 0; }

  get cellCountInsideRightVirtualCell() { return this.horizontalScrollingState?.virtualItemCountAfter || 0; }

  get topVirtualRowsCount() {
    return this.cellCountInsideTopVirtualRow > 0
      ? 1
      : 0;
  }

  get leftVirtualCellsCount() {
    const virtualItemsCount = !this.isRTL
      ? this.cellCountInsideLeftVirtualCell
      : this.cellCountInsideRightVirtualCell;

    return Math.ceil(virtualItemsCount / MAX_CELLS_PER_VIRTUAL_CELL_COUNT);
  }

  get virtualRowOffset() {
    return this.verticalScrollingState?.virtualItemSizeBefore || 0;
  }

  get virtualCellOffset() {
    return this.horizontalScrollingState?.virtualItemSizeBefore || 0;
  }

  get scrollingState() {
    return {
      vertical: this.verticalVirtualScrolling?.state,
      horizontal: this.horizontalVirtualScrolling?.state,
    };
  }

  get verticalScrollingState() { return this.scrollingState.vertical; }

  get horizontalScrollingState() { return this.scrollingState.horizontal; }

  get scrollingOrientation() {
    const scrolling = this.options.getScrolling();

    if (scrolling.mode === 'standard') {
      return scrollingOrientations.none;
    }

    return scrolling.orientation || DefaultScrollingOrientation;
  }

  get verticalScrollingAllowed() {
    return this.scrollingOrientation === scrollingOrientations.vertical
            || this.scrollingOrientation === scrollingOrientations.both;
  }

  get horizontalScrollingAllowed() {
    return this.scrollingOrientation === scrollingOrientations.horizontal
            || this.scrollingOrientation === scrollingOrientations.both;
  }

  setViewOptions(options) {
    this.options = options;

    if (this.verticalVirtualScrolling) {
      this.verticalVirtualScrolling.options = options;
      this.verticalVirtualScrolling.itemSize = this.rowHeight;
      this.verticalVirtualScrolling.viewportSize = this.viewportHeight;
    }
    if (this.horizontalVirtualScrolling) {
      this.horizontalVirtualScrolling.options = options;
      this.verticalVirtualScrolling.itemSize = this.cellWidth;
      this.verticalVirtualScrolling.viewportSize = this.viewportWidth;
    }
  }

  getRenderState() {
    const verticalRenderState = this.verticalVirtualScrolling?.getRenderState() || {};
    const horizontalRenderState = this.horizontalVirtualScrolling?.getRenderState() || {};

    return {
      ...verticalRenderState,
      ...horizontalRenderState,
    };
  }

  getCellHeight() {
    const cellHeight = this.options.getCellHeight();
    const result = cellHeight > 0
      ? cellHeight
      : DEFAULT_CELL_HEIGHT;

    return Math.floor(result);
  }

  getCellWidth() {
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

  calculateCoordinatesByDataAndPosition(cellData, position, date, isCalculateTime, isVerticalDirectionView) {
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

  dispose() {
    if (this.onScrollHandler) {
      eventsEngine.off(this.document, DOCUMENT_SCROLL_EVENT_NAMESPACE, this.onScrollHandler);
    }
  }

  createVirtualScrolling() {
    const isVerticalVirtualScrollingCreated = Boolean(this.verticalVirtualScrolling);
    const isHorizontalVirtualScrollingCreated = Boolean(this.horizontalVirtualScrolling);

    if (this.verticalScrollingAllowed !== isVerticalVirtualScrollingCreated
            || this.horizontalScrollingAllowed !== isHorizontalVirtualScrollingCreated) {
      this.rowHeightValue = this.getCellHeight();
      this.cellWidthValue = this.getCellWidth();
      this.createVirtualScrollingBase();
    }
  }

  private createVirtualScrollingBase() {
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

  isAttachWindowScrollEvent() {
    return (this.horizontalScrollingAllowed || this.verticalScrollingAllowed) && !this.height;
  }

  attachScrollableEvents() {
    if (this.isAttachWindowScrollEvent()) {
      this.attachWindowScroll();
    }
  }

  private attachWindowScroll() {
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

    eventsEngine.on(this.document, DOCUMENT_SCROLL_EVENT_NAMESPACE, this.onScrollHandler);
  }

  handleOnScrollEvent(scrollPosition) {
    if (scrollPosition) {
      const {
        left,
        top,
      } = scrollPosition;

      const verticalStateChanged = isDefined(top) && this.verticalVirtualScrolling?.updateState(top);
      const horizontalStateChanged = isDefined(left) && this.horizontalVirtualScrolling?.updateState(left);

      if (verticalStateChanged || horizontalStateChanged) {
        this.options.updateRender?.();
      }
    }
  }

  updateDimensions(isForce) {
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

class VirtualScrollingBase {
  private stateValue = this.defaultState;

  viewportSize = this.options.viewportSize;

  private itemSizeValue = this.options.itemSize;

  private positionValue = -1;

  private itemSizeChanged = false;

  constructor(public options: any) {
    this.updateState(0);
  }

  get itemSize() { return this.itemSizeValue; }

  set itemSize(value) {
    this.itemSizeChanged = this.itemSizeValue !== value;
    this.itemSizeValue = value;
  }

  get state() { return this.stateValue; }

  set state(value) { this.stateValue = value; }

  get startIndex() { return this.state.startIndex; }

  get pageSize() {
    return Math.ceil(this.viewportSize / this.itemSize);
  }

  get outlineCount() {
    return isDefined(this.options.outlineCount)
      ? this.options.outlineCount
      : Math.floor(this.pageSize / 2);
  }

  get groupCount() { return this.options.getGroupCount(); }

  get isVerticalGrouping() { return this.options.isVerticalGrouping(); }

  get defaultState() {
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

  get maxScrollPosition() {
    return this.getTotalItemCount() * this.itemSize - this.viewportSize;
  }

  get position() { return this.positionValue; }

  set position(value) { this.positionValue = value; }

  needUpdateState(position) {
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

  private validateAndSavePosition(position) {
    if (!isDefined(position)) {
      return false;
    }

    const result = this.position !== position;

    this.position = position;

    return result;
  }

  private correctPosition(position) {
    return position >= 0
      ? Math.min(position, this.maxScrollPosition)
      : -1;
  }

  updateState(position, isForce?: any) {
    position = this.correctPosition(position);

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

  reinitState(itemSize, isForceUpdate) {
    const { position } = this;

    this.itemSize = itemSize;

    this.updateState(0, isForceUpdate);
    if (position > 0) {
      this.updateState(position, isForceUpdate);
    }
  }

  private calcItemInfoBefore(position) {
    let virtualItemCountBefore = Math.floor(position / this.itemSize);

    const outlineCountBefore = Math.min(virtualItemCountBefore, this.outlineCount);

    virtualItemCountBefore -= outlineCountBefore;

    return {
      virtualItemCountBefore,
      outlineCountBefore,
    };
  }

  private calcItemDeltaBefore(itemInfoBefore) {
    const {
      virtualItemCountBefore,
      outlineCountBefore,
    } = itemInfoBefore;

    const totalItemCount = this.getTotalItemCount();

    return totalItemCount - virtualItemCountBefore - outlineCountBefore;
  }

  getTotalItemCount(): any {
    throw 'getTotalItemCount method should be implemented';
  }

  getRenderState(): any {
    throw 'getRenderState method should be implemented';
  }

  private calcItemInfoAfter(itemsDeltaBefore) {
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

  private updateStateCore() {
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
      this._updateStateVirtualItems(virtualItemSizeBefore, virtualItemSizeAfter);
    }
  }

  _updateStateVirtualItems(virtualItemSizeBefore, virtualItemSizeAfter) {
    const { state } = this;

    state.virtualItemSizeBefore = virtualItemSizeBefore;
    state.virtualItemSizeAfter = virtualItemSizeAfter;
  }
}

class VerticalVirtualScrolling extends VirtualScrollingBase {
  constructor(options) {
    super({
      ...options,
      itemSize: options.rowHeight,
      viewportSize: options.viewportHeight,
    });
  }

  get prevTopPosition() { return this.state.prevPosition; }

  get rowCount() { return this.state.itemCount; }

  get topVirtualRowCount() { return this.state.virtualItemCountBefore; }

  get bottomVirtualRowCount() { return this.state.virtualItemCountAfter; }

  getTotalItemCount() {
    return this.options.getTotalRowCount(this.groupCount, this.isVerticalGrouping);
  }

  getRenderState() {
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
  constructor(options) {
    super({
      ...options,
      itemSize: options.cellWidth,
      viewportSize: options.viewportWidth,
    });
  }

  get isRTL() { return this.options.isRTL(); }

  getTotalItemCount() {
    return this.options.getTotalCellCount(this.groupCount, this.isVerticalGrouping);
  }

  getRenderState() {
    return {
      leftVirtualCellWidth: this.state.virtualItemSizeBefore,
      rightVirtualCellWidth: this.state.virtualItemSizeAfter,
      startCellIndex: this.state.startIndex,
      cellCount: this.state.itemCount,
      cellWidth: this.itemSize,
    };
  }

  _updateStateVirtualItems(virtualItemSizeBefore, virtualItemSizeAfter) {
    if (!this.isRTL) {
      super._updateStateVirtualItems(virtualItemSizeBefore, virtualItemSizeAfter);
    } else {
      const { state } = this;

      state.virtualItemSizeAfter = virtualItemSizeBefore;
      state.virtualItemSizeBefore = virtualItemSizeAfter;
      state.startIndex = this.getTotalItemCount() - this.startIndex - this.state.itemCount;
    }
  }
}

// We do not need this class in renovation
export class VirtualScrollingRenderer {
  private renderAppointmentTimeoutID: any = null;

  constructor(private readonly workspaceValue: any) {
  }

  getRenderTimeout() {
    return VIRTUAL_APPOINTMENTS_RENDER_TIMEOUT;
  }

  get workspace() { return this.workspaceValue; }

  updateRender() {
    this._renderGrid();
    this.renderAppointments();
  }

  // TODO: make private once external usage in m_work_space.ts is removed
  _renderGrid() {
    this.workspace.renderWorkSpace(false);
  }

  private renderAppointments() {
    const renderTimeout = this.getRenderTimeout();

    if (renderTimeout >= 0) {
      clearTimeout(this.renderAppointmentTimeoutID);

      this.renderAppointmentTimeoutID = setTimeout(
        () => this.workspace.updateAppointments(),
        renderTimeout,
      );
    } else {
      this.workspace.updateAppointments();
    }
  }
}

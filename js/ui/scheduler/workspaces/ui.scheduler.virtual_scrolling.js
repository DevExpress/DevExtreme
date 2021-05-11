import domAdapter from '../../../core/dom_adapter';
import eventsEngine from '../../../events/core/events_engine';
import { getWindow } from '../../../core/utils/window';
import { addNamespace } from '../../../events/utils/index';
import { isDefined } from '../../../core/utils/type';

const DEFAULT_CELL_HEIGHT = 50;
const MIN_CELL_WIDTH = 1;
const MIN_SCROLL_OFFSET = 10;
const VIRTUAL_APPOINTMENTS_RENDER_TIMEOUT = 15;
const DOCUMENT_SCROLL_EVENT_NAMESPACE = addNamespace('scroll', 'dxSchedulerVirtualScrolling');

const scrollingOrientations = {
    vertical: 'vertical',
    horizontal: 'horizontal',
    both: 'both'
};
const DefaultScrollingOrientation = scrollingOrientations.both;

export default class VirtualScrollingDispatcher {
    constructor(workspace) {
        this._workspace = workspace;
        this._rowHeight = this.getCellHeight();
        this._cellWidth = this.getCellWidth();
        this._renderer = new Renderer(this.workspace);

        this._createVirtualScrolling();
        this._attachScrollableEvents();
    }

    get workspace() { return this._workspace; }
    get isRTL() { return this.workspace._isRTL(); }

    get renderer() { return this._renderer; }

    get isVirtualScrolling() { return this.workspace.isVirtualScrolling(); }

    get verticalVirtualScrolling() { return this._verticalVirtualScrolling; }
    set verticalVirtualScrolling(value) { this._verticalVirtualScrolling = value; }

    get horizontalVirtualScrolling() { return this._horizontalVirtualScrolling; }
    set horizontalVirtualScrolling(value) { this._horizontalVirtualScrolling = value; }

    get document() { return domAdapter.getDocument(); }

    get height() {
        return this.workspace.invoke('getOption', 'height');
    }

    get width() {
        return this.workspace.invoke('getOption', 'width');
    }

    get rowHeight() { return this._rowHeight; }
    set rowHeight(value) { this._rowHeight = value; }

    get viewportHeight() {
        return this.height
            ? this.workspace.$element().height()
            : getWindow().innerHeight;
    }

    get cellWidth() { return this._cellWidth; }
    set cellWidth(value) { this._cellWidth = value; }

    get viewportWidth() {
        return this.width
            ? this.workspace.$element().width()
            : getWindow().innerWidth;
    }

    get topVirtualRowsCount() {
        return this.verticalScrollingState?.virtualItemCountBefore > 0
            ? 1
            : 0;
    }

    get leftVirtualCellsCount() {
        const virtualItemsCount = !this.isRTL
            ? this.horizontalScrollingState?.virtualItemCountBefore
            : this.horizontalScrollingState?.virtualItemCountAfter;

        return virtualItemsCount > 0
            ? 1
            : 0;
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
            horizontal: this.horizontalVirtualScrolling?.state
        };
    }
    get verticalScrollingState() { return this.scrollingState.vertical; }
    get horizontalScrollingState() { return this.scrollingState.horizontal; }

    get scrollingOrientation() {
        return this.workspace.option('scrolling.orientation') || DefaultScrollingOrientation;
    }

    get verticalScrollingAllowed() {
        return this.scrollingOrientation === scrollingOrientations.vertical ||
            this.scrollingOrientation === scrollingOrientations.both;
    }

    get horizontalScrollingAllowed() {
        return this.scrollingOrientation === scrollingOrientations.horizontal ||
            this.scrollingOrientation === scrollingOrientations.both;
    }

    getRenderState() {
        const verticalRenderState = this.verticalVirtualScrolling?.getRenderState() || {};
        const horizontalRenderState = this.horizontalVirtualScrolling?.getRenderState() || {};

        return {
            ...verticalRenderState,
            ...horizontalRenderState
        };
    }

    getCellHeight() {
        const cellHeight = this.workspace.getCellHeight(false);
        const result = cellHeight > 0
            ? cellHeight
            : DEFAULT_CELL_HEIGHT;

        return Math.floor(result);
    }

    getCellWidth() {
        const cellWidth = this.workspace.getCellWidth() ||
            this.workspace.getCellMinWidth();
        const result = cellWidth > 0
            ? cellWidth
            : MIN_CELL_WIDTH;

        return Math.floor(result);
    }

    calculateCoordinatesByDataAndPosition(cellData, position, date, isCalculateTime, isVerticalDirectionView) {
        const { _workspace: workSpace } = this;
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

        if(workSpace.option('rtlEnabled')) {
            left = workSpace.getScrollableOuterWidth() - left;
        }

        return { top, left };
    }

    dispose() {
        if(this._onScrollHandler) {
            eventsEngine.off(this.document, DOCUMENT_SCROLL_EVENT_NAMESPACE, this._onScrollHandler);
        }
    }

    _createVirtualScrolling() {
        if(this.verticalScrollingAllowed) {
            this.verticalVirtualScrolling = new VerticalVirtualScrolling({
                workspace: this.workspace,
                viewportHeight: this.viewportHeight,
                rowHeight: this.rowHeight
            });
        }

        if(this.horizontalScrollingAllowed) {
            this.horizontalVirtualScrolling = new HorizontalVirtualScrolling({
                workspace: this.workspace,
                viewportWidth: this.viewportWidth,
                cellWidth: this.cellWidth
            });
        }
    }

    _attachScrollableEvents() {
        if(this.horizontalScrollingAllowed || this.verticalScrollingAllowed) {
            if(this.height || this.horizontalScrollingAllowed) {
                this._attachScrollableScroll();
            }
            if(!this.height) {
                this._attachWindowScroll();
            }
        }
    }

    _attachScrollableScroll() {
        const scrollable = this.workspace.getScrollable();
        const currentOnScroll = scrollable.option('onScroll');

        scrollable.option('onScroll', e => {

            currentOnScroll?.apply(scrollable, [e]);

            this._process(e?.scrollOffset);
        });
    }

    _attachWindowScroll() {
        const window = getWindow();

        this._onScrollHandler = this.workspace._createAction(() => {
            const {
                scrollX,
                scrollY
            } = window;

            if(scrollX >= MIN_SCROLL_OFFSET || scrollY >= MIN_SCROLL_OFFSET) {
                this._process({
                    left: scrollX,
                    top: scrollY,
                });
            }
        });

        eventsEngine.on(this.document, DOCUMENT_SCROLL_EVENT_NAMESPACE, this._onScrollHandler);
    }

    _process(scrollPosition) {
        if(scrollPosition) {
            const {
                left,
                top
            } = scrollPosition;

            const verticalStateChanged = isDefined(top) && this.verticalVirtualScrolling?.updateState(top);
            const horizontalStateChanged = isDefined(left) && this.horizontalVirtualScrolling?.updateState(left);

            if(verticalStateChanged || horizontalStateChanged) {
                this.renderer.updateRender();
            }
        }
    }

    updateDimensions(isForce) {
        const cellHeight = this.getCellHeight(false);
        const needUpdateVertical = this.verticalScrollingAllowed && cellHeight !== this.rowHeight;
        if(needUpdateVertical || isForce) {
            this.rowHeight = cellHeight;

            this.verticalVirtualScrolling?.reinitState(cellHeight, isForce);
        }

        const cellWidth = this.getCellWidth();
        const needUpdateHorizontal = this.horizontalScrollingAllowed && cellWidth !== this.cellWidth;
        if(needUpdateHorizontal || isForce) {
            this.cellWidth = cellWidth;

            this.horizontalVirtualScrolling?.reinitState(cellWidth, isForce);
        }

        if(needUpdateVertical || needUpdateHorizontal) {
            this.renderer._renderGrid();
        }
    }
}

class VirtualScrollingBase {
    constructor(options) {
        this._workspace = options.workspace;
        this._state = this.defaultState;
        this._viewportSize = options.viewportSize;
        this._itemSize = options.itemSize;
        this._position = -1;
        this._itemSizeChanged = false;

        this.updateState(0);
    }

    get viewportSize() { return this._viewportSize; }
    get itemSize() { return this._itemSize; }
    set itemSize(value) {
        this._itemSizeChanged = this._itemSize !== value;
        this._itemSize = value;
    }
    get state() { return this._state; }
    set state(value) { this._state = value; }

    get startIndex() { return this.state.startIndex; }

    get pageSize() {
        return Math.ceil(this.viewportSize / this.itemSize);
    }

    get outlineCount() {
        return Math.floor(this.pageSize / 2);
    }

    get workspace() { return this._workspace; }
    get groupCount() { return this.workspace._getGroupCount(); }
    get isVerticalGrouping() { return this.workspace._isVerticalGroupedWorkSpace(); }

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
            outlineSizeAfter: 0
        };
    }

    get maxScrollPosition() {
        return this.getTotalItemCount() * this.itemSize - this.viewportSize;
    }

    get position() { return this._position; }
    set position(value) { this._position = value; }

    needUpdateState(position) {
        const {
            prevPosition,
            startIndex
        } = this.state;
        const isFirstInitialization = startIndex < 0;

        if(isFirstInitialization) {
            return true;
        }

        let isStartIndexChanged = false;

        if(this._validateAndSavePosition(position)) {

            if(position === 0 || position === this.maxScrollPosition) {
                return true;
            }

            const currentPosition = prevPosition;
            const currentItemsCount = Math.floor(currentPosition / this.itemSize);
            const itemsCount = Math.floor(position / this.itemSize);

            isStartIndexChanged = Math.abs(currentItemsCount - itemsCount) >= this.outlineCount;
        }

        return isStartIndexChanged;
    }

    _validateAndSavePosition(position) {
        if(!isDefined(position)) {
            return false;
        }

        const result = this.position !== position;

        this.position = position;

        return result;
    }

    _correctPosition(position) {
        return position >= 0
            ? Math.min(position, this.maxScrollPosition)
            : -1;
    }

    updateState(position, isForce) {
        position = this._correctPosition(position);

        if(!this.needUpdateState(position) && !isForce) {
            return false;
        }

        const itemsInfoBefore = this._calcItemInfoBefore(position);
        const itemsDeltaBefore = this._calcItemDeltaBefore(itemsInfoBefore);

        const {
            outlineCountAfter,
            virtualItemCountAfter,
            itemCountWithAfter
        } = this._calcItemInfoAfter(itemsDeltaBefore);

        const {
            virtualItemCountBefore,
            outlineCountBefore
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

        this._updateStateCore();

        return true;
    }

    reinitState(itemSize, isForceUpdate) {
        const { position } = this;

        this.itemSize = itemSize;

        this.updateState(0, isForceUpdate);
        if(position > 0) {
            this.updateState(position, isForceUpdate);
        }
    }

    _calcItemInfoBefore(position) {
        let virtualItemCountBefore = Math.floor(position / this.itemSize);

        const outlineCountBefore = Math.min(virtualItemCountBefore, this.outlineCount);

        virtualItemCountBefore -= outlineCountBefore;

        return {
            virtualItemCountBefore,
            outlineCountBefore
        };
    }

    _calcItemDeltaBefore(itemInfoBefore) {
        const {
            virtualItemCountBefore,
            outlineCountBefore
        } = itemInfoBefore;

        const totalItemCount = this.getTotalItemCount();

        return totalItemCount - virtualItemCountBefore - outlineCountBefore;
    }

    getTotalItemCount() {
        throw 'getTotalItemCount method should be implemented';
    }

    getRenderState() {
        throw 'getRenderState method should be implemented';
    }

    _calcItemInfoAfter(itemsDeltaBefore) {
        const itemCountWithAfter = itemsDeltaBefore >= this.pageSize
            ? this.pageSize
            : itemsDeltaBefore;

        let virtualItemCountAfter = itemsDeltaBefore - itemCountWithAfter;

        const outlineCountAfter = virtualItemCountAfter > 0
            ? Math.min(virtualItemCountAfter, this.outlineCount)
            : 0;

        if(virtualItemCountAfter > 0) {
            virtualItemCountAfter -= outlineCountAfter;
        }

        return {
            virtualItemCountAfter,
            outlineCountAfter,
            itemCountWithAfter
        };
    }

    _updateStateCore() {
        const { state } = this;

        const virtualItemCountBefore = state.virtualItemCountBefore;
        const virtualItemCountAfter = state.virtualItemCountAfter;
        const outlineCountBefore = state.outlineCountBefore;
        const outlineCountAfter = state.outlineCountAfter;

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

        const needAddItems = this._itemSizeChanged || isAppend || isPrepend;
        if(needAddItems) {
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
            workspace: options.workspace,
            viewportSize: options.viewportHeight,
            itemSize: options.rowHeight
        });
    }

    get prevTopPosition() { return this.state.prevPosition; }
    get rowCount() { return this.state.itemCount; }
    get topVirtualRowCount() { return this.state.virtualItemCountBefore; }
    get bottomVirtualRowCount() { return this.state.virtualItemCountAfter; }

    getTotalItemCount() {
        return this.workspace._getTotalRowCount(this.groupCount, this.isVerticalGrouping);
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
            workspace: options.workspace,
            viewportSize: options.viewportWidth,
            itemSize: options.cellWidth
        });
    }

    get isRTL() { return this.workspace._isRTL(); }

    getTotalItemCount() {
        return this.workspace._getTotalCellCount(this.groupCount, this.isVerticalGrouping);
    }

    getRenderState() {
        return {
            leftVirtualCellWidth: this.state.virtualItemSizeBefore,
            rightVirtualCellWidth: this.state.virtualItemSizeAfter,
            startCellIndex: this.state.startIndex,
            cellCount: this.state.itemCount,
            cellWidth: this.itemSize
        };
    }

    _updateStateVirtualItems(virtualItemSizeBefore, virtualItemSizeAfter) {
        if(!this.isRTL) {
            super._updateStateVirtualItems(virtualItemSizeBefore, virtualItemSizeAfter);
        } else {
            const { state } = this;

            state.virtualItemSizeAfter = virtualItemSizeBefore;
            state.virtualItemSizeBefore = virtualItemSizeAfter;
            state.startIndex = this.getTotalItemCount() - this.startIndex - this.state.itemCount;
        }
    }
}

class Renderer {
    constructor(workspace) {
        this._workspace = workspace;
        this._renderAppointmentTimeout = null;
    }

    getRenderTimeout() {
        return VIRTUAL_APPOINTMENTS_RENDER_TIMEOUT;
    }

    get workspace() { return this._workspace; }

    updateRender() {
        this._renderGrid();
        this._renderAppointments();
    }

    _renderGrid() {
        this.workspace.renderRWorkspace(false);
    }

    _renderAppointments() {
        const renderTimeout = this.getRenderTimeout();

        if(renderTimeout >= 0) {

            clearTimeout(this._renderAppointmentTimeout);

            this._renderAppointmentTimeout = setTimeout(
                () => this.workspace.updateAppointments(),
                renderTimeout
            );
        } else {
            this.workspace.updateAppointments();
        }
    }
}

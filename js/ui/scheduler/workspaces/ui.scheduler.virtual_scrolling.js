import domAdapter from '../../../core/dom_adapter';
import eventsEngine from '../../../events/core/events_engine';
import { getWindow } from '../../../core/utils/window';
import { addNamespace } from '../../../events/utils/index';

const ROW_HEIGHT = 50;
const MIN_SCROLL_OFFSET = 10;
const VIRTUAL_APPOINTMENTS_RENDER_TIMEOUT = 15;
const DOCUMENT_SCROLL_EVENT_NAMESPACE = addNamespace('scroll', 'dxSchedulerVirtualScrolling');

export default class VirtualScrollingDispatcher {
    constructor(workspace) {
        this._workspace = workspace;
        this._rowHeight = ROW_HEIGHT;
        this._renderer = new Renderer(this.workspace);

        this._createVirtualScrolling();
        this._attachScrollableEvents();
    }

    get workspace() { return this._workspace; }

    get renderer() { return this._renderer; }

    get isVirtualScrolling() { return this.workspace.isVirtualScrolling(); }

    get minScrollOffset() { return MIN_SCROLL_OFFSET; }

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

    get cellWidth() { return this.workspace.getCellWidth(); }

    get viewportWidth() {
        return this.width
            ? this.workspace.$element().width()
            : getWindow().innerWidth;
    }

    get topVirtualRowsCount() {
        const { topVirtualRowHeight } = this.state;

        return topVirtualRowHeight > 0
            ? 1
            : 0;
    }

    get scrollingState() {
        return {
            vertical: this.verticalVirtualScrolling.state,
            horizontal: this.horizontalVirtualScrolling.state
        };
    }
    get verticalScrollingState() { return this.scrollingState.vertical; }
    get horizontalScrollingState() { return this.scrollingState.horizontal; }

    getState() {
        return {
            vertical: this.verticalVirtualScrolling.state,
            horizontal: this.horizontalVirtualScrolling.state
        };
    }

    calculateCoordinatesByDataAndPosition(cellData, position, date) {
        return this.verticalVirtualScrolling.calculateCoordinatesByDataAndPosition(cellData, position, date);
    }

    dispose() {
        if(this._onScrollHandler) {
            eventsEngine.off(this.document, DOCUMENT_SCROLL_EVENT_NAMESPACE, this._onScrollHandler);
        }
    }

    _createVirtualScrolling() {
        this.verticalVirtualScrolling = new VerticalVirtualScrolling({
            workspace: this.workspace,
            viewportHeight: this.viewportHeight,
            rowHeight: this.rowHeight
        });

        this.horizontalVirtualScrolling = new HorizontalVirtualScrolling({
            workspace: this.workspace,
            viewportWidth: this.viewportWidth,
            cellWidth: this.cellWidth
        });
    }

    _attachScrollableEvents() {
        if(this.height || this.width) {
            this._attachScrollableScroll();
        }
        if(!this.height || !this.width) {
            this._attachWindowScroll();
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

            if(scrollX >= this.minScrollOffset || scrollY >= this.minScrollOffset) {
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

            this.verticalVirtualScrolling.updateState(top);
            this.horizontalVirtualScrolling.updateState(left);

            this.renderer.updateRender();
        }
    }

    updateDimensions() {
        const cellHeight = this.workspace.getCellHeight(false);
        if(cellHeight !== this.rowHeight) {
            this.rowHeight = cellHeight;

            this._createVirtualScrolling();

            this.renderer._renderDateTable();
        }
    }
}

class VirtualScrollingBase {
    constructor(options) {
        this._workspace = options.workspace;
        this._state = this.defaultState;
        this._viewportSize = options.viewportSize;
        this._itemSize = options.itemSize;

        this.updateState(0);
    }

    get viewportSize() { return this._viewportSize; }
    get itemSize() { return this._itemSize; }
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

    needUpdateState(position) {
        const {
            prevPosition,
            startIndex
        } = this.state;
        const isFirstInitialization = startIndex < 0;

        if(!isFirstInitialization && (position === 0 || position === this.maxScrollPosition)) {
            return true;
        }

        const currentPosition = prevPosition;
        const currentItemsCount = Math.floor(currentPosition / this.itemSize);
        const itemsCount = Math.floor(position / this.itemSize);
        const isStartIndexChanged = Math.abs(currentItemsCount - itemsCount) >= this.outlineCount;

        return isFirstInitialization || isStartIndexChanged;
    }

    _correctPosition(position) {
        if(position < 0) {
            return 0;
        }

        return Math.min(position, this.maxScrollPosition);
    }

    updateState(position) {
        position = this._correctPosition(position);

        if(!this.needUpdateState(position)) {
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

        const itemCountAfter = Math.floor(position / this.itemSize);

        this.state.prevPosition = itemCountAfter * this.itemSize;
        this.state.startIndex = itemCountAfter - outlineCountBefore;
        this.state.virtualItemCountBefore = virtualItemCountBefore;
        this.state.outlineCountBefore = outlineCountBefore;
        this.state.itemCount = itemCount;
        this.state.outlineCountAfter = outlineCountAfter;
        this.state.virtualItemCountAfter = virtualItemCountAfter;

        this._updateStateCore();

        return true;
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
        throw 'This method should be implemented';
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
        const needAddItems = isAppend || isPrepend;

        if(needAddItems) {
            state.virtualItemSizeBefore = virtualItemSizeBefore;
            state.virtualItemSizeAfter = virtualItemSizeAfter;
        }
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
}

class HorizontalVirtualScrolling extends VirtualScrollingBase {
    constructor(options) {
        super({
            workspace: options.workspace,
            viewportSize: options.viewportWidth,
            itemSize: options.cellWidth
        });
    }

    getTotalItemCount() {
        return this.workspace._getTotalCellCount(this.groupCount, this.isVerticalGrouping);
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
        this._renderDateTable();
        this._renderAppointments();
    }

    _renderDateTable() {
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

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
        this._verticalVirtualScrolling = null;
        this._horizontalVirtualScrolling = null;
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

    get rowHeight() { return this._rowHeight; }
    set rowHeight(value) { this._rowHeight = value; }

    get viewportHeight() {
        return this.height
            ? this.workspace.$element().height()
            : getWindow().innerHeight;
    }

    get topVirtualRowsCount() {
        const { topVirtualRowHeight } = this.getState();

        return topVirtualRowHeight > 0 ? 1 : 0;
    }


    getState() { // TODO - separate state
        return this.verticalVirtualScrolling.getState();
    }

    calculateCoordinatesByDataAndPosition(cellData, position, date) { // TODO -> strategies
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
    }

    _attachScrollableEvents() {
        this.height
            ? this._attachScrollableScroll()
            : this._attachWindowScroll();
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
            this.verticalVirtualScrolling.updateState(scrollPosition);

            // TODO
            // this.horizontalVirtualScrolling.updateState(scrollPosition);

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

class VerticalVirtualScrolling {
    constructor(options) {
        this._workspace = options.workspace;
        this._viewportHeight = options.viewportHeight;
        this._rowHeight = options.rowHeight;

        this._init();
    }

    // TODO get rid of the workspace
    getWorkspace() {
        return this._workspace;
    }

    get viewportHeight() { return this._viewportHeight; }

    get rowHeight() { return this._rowHeight; }

    getState() {
        return this._state;
    }

    _getPageSize() {
        return Math.ceil(this.viewportHeight / this.rowHeight);
    }

    _getOutlineCount() {
        return Math.floor(this._getPageSize() / 2);
    }

    _init() {
        const scrollPosition = {
            top: 0,
            left: 0
        };

        this._state = {
            pageSize: this._getPageSize(),
            prevScrollPosition: scrollPosition,
            startIndex: -1,
            rowCount: 0,
            topVirtualRowCount: 0,
            bottomVirtualRowCount: 0,
            topOutlineCount: 0,
            bottomOutlineCount: 0,
            topVirtualRowHeight: 0,
            bottomVirtualRowHeight: 0,
            topOutlineHeight: 0,
            bottomOutlineHeight: 0
        };

        this.updateState(scrollPosition);
    }

    needUpdateState(scrollPosition) {
        const state = this.getState();
        const top = scrollPosition.top;
        const currentTopPosition = state.prevScrollPosition.top;
        const currentTopRowsCount = Math.floor(currentTopPosition / this.rowHeight);
        const isFirstInitialization = state.startIndex < 0;
        const topRowsCount = Math.floor(top / this.rowHeight);
        const isStartIndexChanged = Math.abs(currentTopRowsCount - topRowsCount) > this._getOutlineCount();

        return isFirstInitialization || isStartIndexChanged;
    }

    updateState(scrollPosition) {
        if(!this.needUpdateState(scrollPosition)) {
            return false;
        }

        const topRowsInfo = this._calcTopRowsInfo(scrollPosition);
        const topRowsDelta = this._calcTopRowsDelta(topRowsInfo);
        const {
            bottomOutlineCount,
            bottomVirtualRowCount,
            rowCountWithBottom
        } = this._calcBottomRowsInfo(topRowsDelta);

        const {
            topVirtualRowCount,
            topOutlineCount
        } = topRowsInfo;

        const rowCount = topOutlineCount + rowCountWithBottom + bottomOutlineCount;

        const { top } = scrollPosition;
        const topRowsCount = Math.floor(top / this.rowHeight);

        const state = this.getState();

        state.prevScrollPosition = scrollPosition;
        state.startIndex = topRowsCount - topOutlineCount;
        state.topVirtualRowCount = topVirtualRowCount;
        state.topOutlineCount = topOutlineCount;
        state.rowCount = rowCount;
        state.bottomOutlineCount = bottomOutlineCount;
        state.bottomVirtualRowCount = bottomVirtualRowCount;

        this._updateStateCore();

        return true;
    }

    calculateCoordinatesByDataAndPosition(cellData, position, date) {
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

        const scrollInCell = allDay
            ? 0
            : (timeToScroll - cellStartTime) / (cellEndTime - cellStartTime);

        const cellWidth = workSpace.getCellWidth();

        const top = (rowIndex + scrollInCell) * this.rowHeight;
        let left = cellWidth * columnIndex;

        if(workSpace.option('rtlEnabled')) {
            left = workSpace.getScrollableOuterWidth() - left;
        }

        return { top, left };
    }

    _calcTopRowsInfo(scrollPosition) {
        const { top } = scrollPosition;
        let topVirtualRowCount = Math.floor(top / this.rowHeight);
        const topOutlineCount = Math.min(topVirtualRowCount, this._getOutlineCount());

        topVirtualRowCount -= topOutlineCount;

        return {
            topVirtualRowCount,
            topOutlineCount
        };
    }

    _calcTopRowsDelta(topRowsInfo) {
        const {
            topVirtualRowCount,
            topOutlineCount
        } = topRowsInfo;

        const workspace = this.getWorkspace();
        const groupCount = workspace._getGroupCount();
        const isVerticalGrouping = workspace._isVerticalGroupedWorkSpace();
        const totalRowCount = workspace._getTotalRowCount(groupCount, isVerticalGrouping);

        return totalRowCount - topVirtualRowCount - topOutlineCount;
    }

    _calcBottomRowsInfo(topRowsDelta) {
        const { pageSize } = this.getState();
        const rowCountWithBottom = topRowsDelta >= pageSize
            ? pageSize
            : topRowsDelta;

        let bottomVirtualRowCount = topRowsDelta - rowCountWithBottom;

        const bottomOutlineCount = bottomVirtualRowCount > 0
            ? Math.min(bottomVirtualRowCount, this._getOutlineCount())
            : 0;

        if(bottomVirtualRowCount > 0) {
            bottomVirtualRowCount -= bottomOutlineCount;
        }

        return {
            bottomVirtualRowCount,
            bottomOutlineCount,
            rowCountWithBottom
        };
    }

    _updateStateCore() {
        const state = this.getState();
        const topVirtualRowCount = state.topVirtualRowCount;
        const bottomVirtualRowCount = state.bottomVirtualRowCount;
        const topOutlineCount = state.topOutlineCount;
        const bottomOutlineCount = state.bottomOutlineCount;

        const prevTopVirtualRowHeight = state.topVirtualRowHeight;
        const prevBottomVirtualRowHeight = state.bottomVirtualRowHeight;
        const prevTopOutlineHeight = state.topOutlineHeight;
        const prevBottomOutlineHeight = state.bottomOutlineHeight;

        const topVirtualRowHeight = this.rowHeight * topVirtualRowCount;
        const bottomVirtualRowHeight = this.rowHeight * bottomVirtualRowCount;
        const topOutlineHeight = this.rowHeight * topOutlineCount;
        const bottomOutlineHeight = this.rowHeight * bottomOutlineCount;

        const prevTopVirtualHeight = prevTopVirtualRowHeight + prevTopOutlineHeight;
        const topVirtualHeight = topVirtualRowHeight + topOutlineHeight;
        const prevBottomVirtualHeight = prevBottomVirtualRowHeight + prevBottomOutlineHeight;
        const bottomVirtualHeight = bottomVirtualRowHeight + bottomOutlineHeight;

        const isAppend = prevTopVirtualHeight < topVirtualHeight;
        const isPrepend = prevBottomVirtualHeight < bottomVirtualHeight;
        const needAddRows = isAppend || isPrepend;

        if(needAddRows) {
            state.topVirtualRowHeight = topVirtualRowHeight;
            state.bottomVirtualRowHeight = bottomVirtualRowHeight;
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
        this._renderDateTable();
        this._renderAppointments();
    }

    _renderDateTable() {
        this.workspace.renderRWorkspace(false);
    }

    _renderAppointments() {
        const { workspace } = this;
        const renderTimeout = this.getRenderTimeout();

        if(renderTimeout >= 0) {

            clearTimeout(this._renderAppointmentTimeout);

            this._renderAppointmentTimeout = setTimeout(
                () => workspace.updateAppointments(),
                renderTimeout
            );
        } else {
            workspace.updateAppointments();
        }
    }
}

const ROW_HEIGHT = 50;
const VIRTUAL_APPOINTMENTS_RENDER_TIMEOUT = 75;

export default class VirtualScrolling {
    constructor(workspace, viewportHeight, scrollable) {
        this._workspace = workspace;
        this._viewportHeight = viewportHeight;
        this._scrollable = scrollable;
        this._renderAppointmentTimeout = null;

        this._init();
    }

    // TODO get rid of the workspace
    getWorkspace() {
        return this._workspace;
    }

    getViewportHeight() {
        return this._viewportHeight;
    }

    getScrollable() {
        return this._scrollable;
    }

    getRowHeight() {
        return ROW_HEIGHT;
    }

    getState() {
        return this._state;
    }

    _getPageSize() {
        return Math.ceil(this.getViewportHeight() / this.getRowHeight());
    }

    _getOutlineCount() {
        return Math.floor(this._getPageSize() / 2);
    }

    _getRenderTimeout() {
        return VIRTUAL_APPOINTMENTS_RENDER_TIMEOUT;
    }

    _init() {
        const scrollOffset = {
            top: 0,
            left: 0
        };

        this._state = {
            pageSize: this._getPageSize(),
            scrollOffset: scrollOffset,
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

        this._updateState(scrollOffset);

        this._attachScrollableEvent();
    }

    _attachScrollableEvent() {
        const scrollable = this.getScrollable();
        const onScroll = scrollable.option('onScroll');
        scrollable.option('onScroll', e => {

            onScroll?.apply(scrollable, [e]);

            const scrollOffset = e?.scrollOffset;
            if(scrollOffset && this._updateState(scrollOffset)) {
                this._updateRender();
            }
        });
    }

    _updateRender() { // TODO move to the render part (Workspace)
        const workspace = this.getWorkspace();
        const renderTimeout = this._getRenderTimeout();

        workspace.renderRWorkspace(false);

        if(renderTimeout >= 0) {

            clearTimeout(this._renderAppointmentTimeout);

            this._renderAppointmentTimeout = setTimeout(
                () => workspace.invoke('renderAppointments'),
                renderTimeout
            );
        } else {
            workspace.invoke('renderAppointments');
        }
    }

    _updateState(scrollOffset) {
        const state = this.getState();
        const top = scrollOffset.top;
        const currentStartIndex = state.startIndex;
        const rowHeight = this.getRowHeight();

        state.scrollOffset = scrollOffset;
        state.startIndex = Math.floor(top / rowHeight);

        if(currentStartIndex !== state.startIndex) {
            const topRowsInfo = this._calcTopRowsInfo(scrollOffset);
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

            state.startIndex -= topOutlineCount;
            state.topVirtualRowCount = topVirtualRowCount;
            state.topOutlineCount = topOutlineCount;
            state.rowCount = rowCount;
            state.bottomOutlineCount = bottomOutlineCount;
            state.bottomVirtualRowCount = bottomVirtualRowCount;

            this._updateStateCore();

            return true;
        }

        return false;
    }

    _calcTopRowsInfo(scrollOffset) {
        const { top } = scrollOffset;
        const rowHeight = this.getRowHeight();
        let topVirtualRowCount = Math.floor(top / rowHeight);
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
        const rowHeight = this.getRowHeight();
        const topVirtualRowCount = state.topVirtualRowCount;
        const bottomVirtualRowCount = state.bottomVirtualRowCount;
        const topOutlineCount = state.topOutlineCount;
        const bottomOutlineCount = state.bottomOutlineCount;

        const prevTopVirtualRowHeight = state.topVirtualRowHeight;
        const prevBottomVirtualRowHeight = state.bottomVirtualRowHeight;
        const prevTopOutlineHeight = state.topOutlineHeight;
        const prevBottomOutlineHeight = state.bottomOutlineHeight;

        const topVirtualRowHeight = rowHeight * topVirtualRowCount;
        const bottomVirtualRowHeight = rowHeight * bottomVirtualRowCount;
        const topOutlineHeight = rowHeight * topOutlineCount;
        const bottomOutlineHeight = rowHeight * bottomOutlineCount;

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

    dispose() {
    }
}

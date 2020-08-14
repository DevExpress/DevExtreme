const ROW_HEIGHT = 50;

export default class VirtualScrolling {
    constructor(workspace, viewportHeight, scrollable) {
        this._workspace = workspace;
        this._viewportHeight = viewportHeight;
        this._scrollable = scrollable;

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

    _init() {
        const pageSize = Math.ceil(this.getViewportHeight() / this.getRowHeight());
        const scrollOffset = {
            top: 0,
            left: 0
        };

        this._state = {
            pageSize: pageSize,
            scrollOffset: scrollOffset,
            startIndex: -1,
            rowCount: 0,
            topVirtualRowCount: 0,
            bottomVirtualRowCount: 0,
            topVirtualRowHeight: 0,
            bottomVirtualRowHeight: 0,
        };

        this._updateState(scrollOffset);

        this._attachScrollableEvent();
    }

    _attachScrollableEvent() {
        const scrollable = this.getScrollable();
        const onScroll = scrollable.option('onScroll');
        scrollable.option('onScroll', e => {
            if(onScroll) {
                onScroll.apply(scrollable, [e]);
            }

            const scrollOffset = e?.scrollOffset;
            if(scrollOffset && this._updateState(scrollOffset)) {
                this.getWorkspace().renderRWorkspace();
            }
        });
    }

    _updateState(scrollOffset) {
        const workspace = this.getWorkspace();
        const state = this.getState();
        const top = scrollOffset.top;
        const currentStartIndex = state.startIndex;
        const rowHeight = this.getRowHeight();

        state.scrollOffset = scrollOffset;
        state.startIndex = Math.floor(top / rowHeight);

        if(currentStartIndex !== state.startIndex) {
            const pageSize = state.pageSize;
            const groupCount = workspace._getGroupCount();

            const topVirtualRowCount = Math.floor(top / rowHeight);
            const totalRowCount = workspace._getTotalRowCount(groupCount);
            const deltaRowCount = totalRowCount - topVirtualRowCount;
            const rowCount = deltaRowCount >= pageSize ? pageSize : deltaRowCount;

            let bottomVirtualRowCount = totalRowCount - topVirtualRowCount - rowCount;
            if(workspace.isGroupedAllDayPanel()) {
                bottomVirtualRowCount -= 1;
            }

            state.topVirtualRowCount = topVirtualRowCount;
            state.rowCount = rowCount;
            state.bottomVirtualRowCount = bottomVirtualRowCount;

            this._updateStateCore();

            return true;
        }

        return false;
    }

    _updateStateCore() {
        const state = this.getState();
        const rowHeight = this.getRowHeight();
        const topVirtualRowCount = state.topVirtualRowCount;
        const bottomVirtualRowCount = state.bottomVirtualRowCount;

        const prevTopVirtualRowHeight = state.topVirtualRowHeight;
        const prevBottomVirtualRowHeight = state.bottomVirtualRowHeight;
        const topVirtualRowHeight = rowHeight * topVirtualRowCount;
        const bottomVirtualRowHeight = rowHeight * bottomVirtualRowCount;

        const isAppend = prevTopVirtualRowHeight < topVirtualRowHeight;
        const isPrepend = prevBottomVirtualRowHeight < bottomVirtualRowHeight;
        const needAddRows = isAppend || isPrepend;

        if(needAddRows) {
            state.topVirtualRowHeight = topVirtualRowHeight;
            state.bottomVirtualRowHeight = bottomVirtualRowHeight;
        }
    }

    dispose() {
    }
}

import { getOuterWidth, getWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';

import { createColumnsInfo } from './m_virtual_columns_core';

const DEFAULT_COLUMN_WIDTH = 50;

const VirtualScrollingRowsViewExtender = {
  _resizeCore() {
    this.callBase.apply(this, arguments);
    this._columnsController.resize();
  },

  _handleScroll(e) {
    const that = this;
    const scrollable = this.getScrollable();
    let { left } = e.scrollOffset;

    that.callBase.apply(that, arguments);

    if (that.option('rtlEnabled') && scrollable) {
      left = getWidth(scrollable.$content()) - getWidth(scrollable.$element()) - left;
    }

    that._columnsController.setScrollPosition(left);
  },
};

const HeaderViewExtender = {
  _renderCore() {
    const deferred = this.callBase.apply(this, arguments);

    if (this._columnsController.isVirtualMode()) {
      this._updateScrollLeftPosition();
    }
    return deferred;
  },
};

const ColumnsControllerExtender = (function () {
  const getWidths = function (columns) {
    return columns.map((column) => column.visibleWidth || parseFloat(column.width) || DEFAULT_COLUMN_WIDTH);
  };

  const members = {
    init() {
      const that = this;
      that.callBase.apply(this, arguments);

      that._beginPageIndex = null;
      that._endPageIndex = null;
      that._position = 0;
      that._virtualVisibleColumns = {};
    },
    resetColumnsCache() {
      this.callBase();
      this._virtualVisibleColumns = {};
    },
    getBeginPageIndex(position) {
      const visibleColumns = this.getVisibleColumns(undefined, true);
      const widths = getWidths(visibleColumns);
      let currentPosition = 0;

      for (let index = 0; index < widths.length; index++) {
        if (currentPosition >= position) {
          return Math.floor(index / this.getColumnPageSize());
        }
        currentPosition += widths[index];
      }

      return 0;
    },
    getTotalWidth() {
      const width = this.option('width');
      if (typeof width === 'number') {
        return width;
      }
      return this.getController('resizing')._lastWidth || getOuterWidth(this.component.$element());
    },
    getEndPageIndex(position) {
      const visibleColumns = this.getVisibleColumns(undefined, true);
      const widths = getWidths(visibleColumns);
      let currentPosition = 0;

      position += this.getTotalWidth();

      for (let index = 0; index < widths.length; index++) {
        if (currentPosition >= position) {
          return Math.ceil(index / this.getColumnPageSize());
        }
        currentPosition += widths[index];
      }

      return Math.ceil(widths.length / this.getColumnPageSize());
    },
    getColumnPageSize() {
      return this.option('scrolling.columnPageSize');
    },
    _fireColumnsChanged() {
      const date: any = new Date();
      this.columnsChanged.fire({
        optionNames: { all: true, length: 1 },
        changeTypes: { columns: true, virtualColumnsScrolling: true, length: 2 },
      });
      this._renderTime = (new Date()) as any - date;
    },
    getScrollingTimeout() {
      const renderingThreshold = this.option('scrolling.columnRenderingThreshold');
      const renderAsync = this.option('scrolling.renderAsync');
      let scrollingTimeout = 0;

      if ((!isDefined(renderAsync) && this._renderTime > renderingThreshold) || renderAsync) {
        scrollingTimeout = this.option('scrolling.timeout');
      }

      return scrollingTimeout;
    },
    setScrollPosition(position) {
      const scrollingTimeout = this.getScrollingTimeout();

      if (scrollingTimeout > 0) {
        clearTimeout(this._changedTimeout);

        this._changedTimeout = setTimeout(() => {
          this._setScrollPositionCore(position);
        }, scrollingTimeout);
      } else {
        this._setScrollPositionCore(position);
      }
    },
    isVirtualMode() {
      return hasWindow() && this.option('scrolling.columnRenderingMode') === 'virtual';
    },
    resize() {
      this._setScrollPositionCore(this._position);
    },
    _setScrollPositionCore(position) {
      const that = this;

      if (that.isVirtualMode()) {
        const beginPageIndex = that.getBeginPageIndex(position);
        const endPageIndex = that.getEndPageIndex(position);
        const needColumnsChanged = position < that._position ? that._beginPageIndex > beginPageIndex : that._endPageIndex < endPageIndex;

        that._position = position;
        if (needColumnsChanged) {
          that._beginPageIndex = beginPageIndex;
          that._endPageIndex = endPageIndex;
          that._fireColumnsChanged();
        }
      }
    },
    getFixedColumns(rowIndex, isBase) {
      const fixedColumns = this.callBase(rowIndex);
      if (this.isVirtualMode() && !isBase && fixedColumns.length) {
        const transparentColumnIndex = fixedColumns.map((c) => c.command).indexOf('transparent');
        fixedColumns[transparentColumnIndex].colspan = this.getVisibleColumns().length - this.callBase().length + 1;
        return fixedColumns;
      }

      return fixedColumns;
    },
    _compileVisibleColumns(rowIndex, isBase) {
      if (isBase || !this.isVirtualMode() || !this._shouldReturnVisibleColumns()) {
        return this.callBase(rowIndex);
      }

      if (this._columns?.length && !isDefined(this._beginPageIndex) && !isDefined(this._endPageIndex)) {
        this._beginPageIndex = this.getBeginPageIndex(this._position);
        this._endPageIndex = this.getEndPageIndex(this._position);
      }

      const beginPageIndex = this._beginPageIndex;
      const endPageIndex = this._endPageIndex;
      const visibleColumnsHash = `${rowIndex}-${beginPageIndex}-${endPageIndex}`;

      if (this._virtualVisibleColumns[visibleColumnsHash]) {
        return this._virtualVisibleColumns[visibleColumnsHash];
      }

      let visibleColumns = this.callBase();
      const rowCount = this.getRowCount();
      const pageSize = this.getColumnPageSize();
      let startIndex = beginPageIndex * pageSize;
      let endIndex = endPageIndex * pageSize;
      const fixedColumns = this.getFixedColumns(undefined, true);
      const transparentColumnIndex = fixedColumns.map((c) => c.command).indexOf('transparent');

      const beginFixedColumnCount = fixedColumns.length ? transparentColumnIndex : 0;
      let beginFixedColumns = visibleColumns.slice(0, beginFixedColumnCount);
      const beginColumns = visibleColumns.slice(beginFixedColumnCount, startIndex);
      const beginWidth = getWidths(beginColumns).reduce((a, b) => a + b, 0);

      if (!beginWidth) {
        startIndex = 0;
      }

      const endFixedColumnCount = fixedColumns.length ? fixedColumns.length - transparentColumnIndex - 1 : 0;
      let endFixedColumns = visibleColumns.slice(visibleColumns.length - endFixedColumnCount);
      const endColumns = visibleColumns.slice(endIndex, visibleColumns.length - endFixedColumnCount);
      const endWidth = getWidths(endColumns).reduce((a, b) => a + b, 0);

      if (!endWidth) {
        endIndex = visibleColumns.length;
      }

      if (rowCount > 1 && typeof rowIndex === 'number') {
        const columnsInfo: any = [];
        for (let i = 0; i <= rowCount; i++) {
          columnsInfo.push(this.callBase(i));
        }
        beginFixedColumns = createColumnsInfo(columnsInfo, 0, beginFixedColumns.length)[rowIndex] || [];
        endFixedColumns = createColumnsInfo(columnsInfo, visibleColumns.length - endFixedColumns.length, visibleColumns.length)[rowIndex] || [];
        visibleColumns = createColumnsInfo(columnsInfo, startIndex, endIndex)[rowIndex] || [];
      } else {
        visibleColumns = visibleColumns.slice(startIndex, endIndex);
      }

      if (beginWidth) {
        visibleColumns.unshift({ command: 'virtual', width: beginWidth });
        visibleColumns = beginFixedColumns.concat(visibleColumns);
      }

      if (endWidth) {
        visibleColumns.push({ command: 'virtual', width: endWidth });
        visibleColumns = visibleColumns.concat(endFixedColumns);
      }

      this._virtualVisibleColumns[visibleColumnsHash] = visibleColumns;

      return visibleColumns;
    },
    getColumnIndexOffset() {
      let offset = 0;
      if (this._beginPageIndex > 0) {
        const fixedColumns = this.getFixedColumns();
        const transparentColumnIndex = fixedColumns.map((c) => c.command).indexOf('transparent');
        const leftFixedColumnCount = transparentColumnIndex >= 0 ? transparentColumnIndex : 0;
        offset = this._beginPageIndex * this.getColumnPageSize() - leftFixedColumnCount - 1;
      }
      return offset > 0 ? offset : 0;
    },
    dispose() {
      clearTimeout(this._changedTimeout);
      this.callBase.apply(this, arguments);
    },
  };

  return members;
}());

export const virtualColumnsModule = {
  defaultOptions() {
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
      columns: ColumnsControllerExtender,
    },
    views: {
      columnHeadersView: HeaderViewExtender,
      rowsView: VirtualScrollingRowsViewExtender,
    },
  },
};

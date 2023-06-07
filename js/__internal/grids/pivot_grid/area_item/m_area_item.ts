import Class from '@js/core/class';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import { setWidth } from '@js/core/utils/size';
import { setStyle } from '@js/core/utils/style';
import { isDefined } from '@js/core/utils/type';

// TODO: Move this function to the __internal scope
import { getMemoizeScrollTo } from '../../../../renovation/ui/common/utils/scroll/getMemoizeScrollTo';

const PIVOTGRID_EXPAND_CLASS = 'dx-expand';

const getRealElementWidth = function (element) {
  let width = 0;

  const { offsetWidth } = element;

  if (element.getBoundingClientRect) {
    const clientRect = getBoundingRect(element);
    width = clientRect.width;

    if (!width) {
      width = clientRect.right - clientRect.left;
    }
    if (width <= offsetWidth - 1) {
      width = offsetWidth;
    }
  }

  return width > 0 ? width : offsetWidth;
};

function getFakeTableOffset(scrollPos, elementOffset, tableSize, viewPortSize) {
  let offset = 0;
  let halfTableCount = 0;
  const halfTableSize = tableSize / 2;

  if (scrollPos + viewPortSize - (elementOffset + tableSize) > 1) {
    if (scrollPos >= elementOffset + tableSize + halfTableSize) {
      halfTableCount = parseInt(
        ((scrollPos - (elementOffset + tableSize)) / halfTableSize) as any,
        10,
      );
    }

    offset = elementOffset + tableSize + halfTableSize * halfTableCount;
  } else if (scrollPos < elementOffset) {
    if (scrollPos <= elementOffset - halfTableSize) {
      halfTableCount = parseInt(
        ((scrollPos - (elementOffset - halfTableSize)) / halfTableSize) as any,
        10,
      );
    }

    offset = elementOffset - (tableSize - halfTableSize * halfTableCount);
  } else {
    offset = elementOffset;
  }

  return offset;
}

const AreaItem = Class.inherit({
  ctor(component) {
    this.component = component;
  },

  option() {
    return this.component.option.apply(this.component, arguments);
  },

  _getRowElement(index) {
    const that = this;
    if (that._tableElement && that._tableElement.length > 0) {
      return that._tableElement[0].rows[index];
    }
    return null;
  },

  _createGroupElement() {
    return $('<div>');
  },

  _createTableElement() {
    return $('<table>');
  },

  _getCellText(cell, encodeHtml) {
    let cellText = cell.isWhiteSpace ? '&nbsp' : cell.text || '&nbsp';

    if (encodeHtml && (cellText.indexOf('<') !== -1 || cellText.indexOf('>') !== -1)) {
      cellText = ($('<div>') as any).text(cellText).html();
    }

    return cellText;
  },

  _getRowClassNames() {

  },

  _applyCustomStyles(options) {
    if (options.cell.width) {
      options.cssArray.push(`min-width:${options.cell.width}px`);
    }
    if (options.cell.sorted) {
      options.classArray.push('dx-pivotgrid-sorted');
    }
  },

  _getMainElementMarkup() {
    return domAdapter.createElement('tbody');
  },

  _getCloseMainElementMarkup() {
    return '</tbody>';
  },

  _renderTableContent(tableElement, data) {
    const that = this;
    const rowsCount = data.length;
    let row;
    let cell;
    let i;
    let j;
    let rowElement;
    let cellElement;
    let cellText;
    const rtlEnabled = that.option('rtlEnabled');
    const encodeHtml = that.option('encodeHtml');
    let rowClassNames;

    tableElement.data('area', that._getAreaName());
    tableElement.data('data', data);

    tableElement.css('width', '');

    const tbody = this._getMainElementMarkup();

    for (i = 0; i < rowsCount; i += 1) {
      row = data[i];
      rowClassNames = [];

      const tr = domAdapter.createElement('tr');

      for (j = 0; j < row.length; j += 1) {
        cell = row[j];

        this._getRowClassNames(i, cell, rowClassNames);

        const td = domAdapter.createElement('td');

        if (cell) {
          cell.rowspan && td.setAttribute('rowspan', cell.rowspan || 1);
          cell.colspan && td.setAttribute('colspan', cell.colspan || 1);

          const styleOptions = {
            cellElement,
            cell,
            cellsCount: row.length,
            cellIndex: j,
            rowElement,
            rowIndex: i,
            rowsCount,
            rtlEnabled,
            classArray: [],
            cssArray: [],
          };

          that._applyCustomStyles(styleOptions);

          if (styleOptions.cssArray.length) {
            setStyle(td, styleOptions.cssArray.join(';'));
          }

          if (styleOptions.classArray.length) {
            td.setAttribute('class', styleOptions.classArray.join(' '));
          }

          if (isDefined(cell.expanded)) {
            const div = domAdapter.createElement('div');
            div.classList.add('dx-expand-icon-container');
            const span = domAdapter.createElement('span');
            span.classList.add(PIVOTGRID_EXPAND_CLASS);
            div.appendChild(span);
            td.appendChild(div);
          }

          cellText = this._getCellText(cell, encodeHtml);
        } else {
          cellText = '';
        }

        const span = domAdapter.createElement('span');

        if (isDefined(cell.wordWrapEnabled)) {
          span.style.whiteSpace = cell.wordWrapEnabled ? 'normal' : 'nowrap';
        }

        span.innerHTML = cellText;
        td.appendChild(span);

        if (cell.sorted) {
          const span = domAdapter.createElement('span');
          span.classList.add('dx-icon-sorted');
          td.appendChild(span);
        }

        tr.appendChild(td);
      }

      if (rowClassNames.length) {
        tr.setAttribute('class', rowClassNames.join(' '));
      }
      tbody.appendChild(tr);
    }

    tableElement.append(tbody);

    this._triggerOnCellPrepared(tableElement, data);
  },

  _triggerOnCellPrepared(tableElement, data) {
    const that = this;
    const rowElements = tableElement.find('tr');
    const areaName = that._getAreaName();
    const onCellPrepared = that.option('onCellPrepared');
    const hasEvent = that.component._eventsStrategy.hasEvent('cellPrepared');
    let rowElement;
    let $cellElement;
    let onCellPreparedArgs;
    const defaultActionArgs = this.component._defaultActionArgs();
    let row;
    let cell;
    let rowIndex;
    let columnIndex;

    if (onCellPrepared || hasEvent) {
      for (rowIndex = 0; rowIndex < data.length; rowIndex += 1) {
        row = data[rowIndex];
        rowElement = rowElements.eq(rowIndex);

        for (columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
          cell = row[columnIndex];
          $cellElement = rowElement.children().eq(columnIndex);
          onCellPreparedArgs = {
            area: areaName,
            rowIndex,
            columnIndex,
            cellElement: getPublicElement($cellElement),
            cell,
          };
          if (hasEvent) {
            that.component._trigger('onCellPrepared', onCellPreparedArgs);
          } else {
            onCellPrepared(extend(onCellPreparedArgs, defaultActionArgs));
          }
        }
      }
    }
  },

  _getRowHeight(index) {
    const row = this._getRowElement(index);
    let height = 0;

    const { offsetHeight } = row;

    if (row && row.lastChild) {
      if (row.getBoundingClientRect) {
        const clientRect = getBoundingRect(row);
        height = clientRect.height;

        if (height <= offsetHeight - 1) {
          height = offsetHeight;
        }
      }

      return height > 0 ? height : offsetHeight;
    }
    return 0;
  },

  _setRowHeight(index, value) {
    const row = this._getRowElement(index);
    if (row) {
      row.style.height = `${value}px`;
    }
  },

  getRowsLength() {
    const that = this;
    if (that._tableElement && that._tableElement.length > 0) {
      return that._tableElement[0].rows.length;
    }
    return 0;
  },

  getRowsHeight() {
    const that = this;
    const result: any = [];
    const rowsLength = that.getRowsLength();

    for (let i = 0; i < rowsLength; i += 1) {
      result.push(that._getRowHeight(i));
    }
    return result;
  },

  setRowsHeight(values) {
    const that = this;
    let totalHeight = 0;
    const valuesLength = values.length;

    for (let i = 0; i < valuesLength; i += 1) {
      totalHeight += values[i];
      that._setRowHeight(i, values[i]);
    }

    this._tableHeight = totalHeight;
    this._tableElement[0].style.height = `${totalHeight}px`;
  },

  getColumnsWidth() {
    const rowsLength = this.getRowsLength();
    let rowIndex;
    let row;
    let i;
    let columnIndex;
    const processedCells = [];
    const result = [];
    const fillCells = function (cells, rowIndex, columnIndex, rowSpan, colSpan) {
      let rowOffset;
      let columnOffset;
      for (rowOffset = 0; rowOffset < rowSpan; rowOffset += 1) {
        for (columnOffset = 0; columnOffset < colSpan; columnOffset += 1) {
          cells[rowIndex + rowOffset] = cells[rowIndex + rowOffset] || [];
          cells[rowIndex + rowOffset][columnIndex + columnOffset] = true;
        }
      }
    };

    if (rowsLength) {
      for (rowIndex = 0; rowIndex < rowsLength; rowIndex += 1) {
        processedCells[rowIndex] = processedCells[rowIndex] || [];
        row = this._getRowElement(rowIndex);
        for (i = 0; i < row.cells.length; i += 1) {
          for (columnIndex = 0; processedCells[rowIndex][columnIndex]; columnIndex += 1);
          fillCells(
            processedCells,
            rowIndex,
            columnIndex,
            row.cells[i].rowSpan,
            row.cells[i].colSpan,
          );
          if (row.cells[i].colSpan === 1) {
            result[columnIndex] = result[columnIndex] || getRealElementWidth(row.cells[i]);
          }
        }
      }
    }
    return result;
  },

  setColumnsWidth(values) {
    let i;
    const tableElement = this._tableElement[0];
    this._colgroupElement.html('');
    const columnsCount = this.getColumnsCount();
    const columnWidth: any = [];

    for (i = 0; i < columnsCount; i += 1) {
      columnWidth.push(values[i] || 0);
    }

    for (i = columnsCount; i < values.length && values; i += 1) {
      columnWidth[columnsCount - 1] += values[i];
    }

    for (i = 0; i < columnsCount; i += 1) {
      const col = domAdapter.createElement('col');
      col.style.width = `${columnWidth[i]}px`;
      this._colgroupElement.append(col);
    }
    this._tableWidth = columnWidth.reduce((sum, width) => sum + width, 0);

    tableElement.style.width = `${this._tableWidth}px`;
    tableElement.style.tableLayout = 'fixed';
  },

  resetColumnsWidth() {
    setWidth(this._colgroupElement.find('col'), 'auto');
    this._tableElement.css({
      width: '',
      tableLayout: '',
    });
  },

  setGroupWidth(value) {
    this._getScrollable().option('width', value);
  },

  setGroupHeight(value) {
    this._getScrollable().option('height', value);
  },

  getGroupHeight() {
    return this._getGroupElementSize('height');
  },

  getGroupWidth() {
    return this._getGroupElementSize('width');
  },

  _getGroupElementSize(dimension) {
    const size = this.groupElement()[0].style[dimension];

    if (size.indexOf('px') > 0) {
      return parseFloat(size);
    }

    return null;
  },

  groupElement() {
    return this._groupElement;
  },

  tableElement() {
    return this._tableElement;
  },

  element() {
    return this._rootElement;
  },

  headElement() {
    return this._tableElement.find('thead');
  },

  _setTableCss(styles) {
    if (this.option('rtlEnabled')) {
      styles.right = styles.left;
      delete styles.left;
    }

    this.tableElement().css(styles);
  },

  setVirtualContentParams(params) {
    this._virtualContent.css({
      width: params.width,
      height: params.height,
    });

    const scrollable = this._getScrollable();

    if (scrollable?.isRenovated()) {
      this._getScrollable().option('classes', 'dx-virtual-mode');
    } else {
      this.groupElement().addClass('dx-virtual-mode');
    }
  },

  disableVirtualMode() {
    const scrollable = this._getScrollable();

    if (scrollable?.isRenovated()) {
      this._getScrollable().option('classes', '');
    } else {
      this.groupElement().removeClass('dx-virtual-mode');
    }
  },

  _renderVirtualContent() {
    const that = this;
    if (!that._virtualContent && that.option('scrolling.mode') === 'virtual') {
      that._virtualContent = $('<div>').addClass('dx-virtual-content').insertBefore(that._tableElement);
    }
  },

  reset() {
    const that = this;
    const tableElement = that._tableElement[0];

    that._fakeTable && that._fakeTable.detach();
    that._fakeTable = null;

    that.disableVirtualMode();
    that.setGroupWidth('100%');
    that.setGroupHeight('auto');

    that.resetColumnsWidth();

    if (tableElement) {
      for (let i = 0; i < tableElement.rows.length; i += 1) {
        tableElement.rows[i].style.height = '';
      }
      tableElement.style.height = '';
      tableElement.style.width = '100%';
    }
  },

  _updateFakeTableVisibility() {
    const that = this;
    const tableElement = that.tableElement()[0];
    const horizontalOffsetName = that.option('rtlEnabled') ? 'right' : 'left';
    const fakeTableElement = that._fakeTable[0];

    if (
      tableElement.style.top === fakeTableElement.style.top
      && fakeTableElement.style[horizontalOffsetName] === tableElement.style[horizontalOffsetName]
    ) {
      that._fakeTable.addClass('dx-hidden');
    } else {
      that._fakeTable.removeClass('dx-hidden');
    }
  },

  _moveFakeTableHorizontally(scrollPos) {
    const that: any = this;
    const rtlEnabled = that.option('rtlEnabled');
    const offsetStyleName = rtlEnabled ? 'right' : 'left';
    const tableElementOffset = parseFloat(that.tableElement()[0].style[offsetStyleName]);
    const offset = getFakeTableOffset(
      scrollPos,
      tableElementOffset,
      that._tableWidth,
      that.getGroupWidth(),
    );
    if (parseFloat(that._fakeTable[0].style[offsetStyleName]) !== offset) {
      that._fakeTable[0].style[offsetStyleName] = `${offset}px`;
    }
  },

  _moveFakeTableTop(scrollPos) {
    const that = this;
    const tableElementOffsetTop = parseFloat(that.tableElement()[0].style.top);
    const offsetTop = getFakeTableOffset(
      scrollPos,
      tableElementOffsetTop,
      that._tableHeight,
      that.getGroupHeight(),
    );

    if (parseFloat(that._fakeTable[0].style.top) !== offsetTop) {
      that._fakeTable[0].style.top = `${offsetTop}px`;
    }
  },

  _moveFakeTable() {
    this._updateFakeTableVisibility();
  },

  _createFakeTable() {
    const that = this;

    if (!that._fakeTable) {
      that._fakeTable = that.tableElement()
        .clone()
        .addClass('dx-pivot-grid-fake-table')
        .appendTo(that._virtualContent);
    }
  },

  render(rootElement, data) {
    const that = this;

    if (that._tableElement) {
      try {
        that._tableElement[0].innerHTML = '';
      } catch (e) {
        that._tableElement.empty();
      }
      that._tableElement.attr('style', '');
    } else {
      that._groupElement = that._createGroupElement();
      that._tableElement = that._createTableElement();

      that._tableElement.appendTo(that._groupElement);
      that._groupElement.appendTo(rootElement);
      that._rootElement = rootElement;
    }

    that._colgroupElement = $('<colgroup>').appendTo(that._tableElement);
    that._renderTableContent(that._tableElement, data);

    that._renderVirtualContent();
  },

  _getScrollable() {
    return this.groupElement().data('dxScrollable');
  },

  _getMemoizeScrollTo() {
    this._memoizeScrollTo = this._memoizeScrollTo
      ?? getMemoizeScrollTo(() => this._getScrollable());
    return this._memoizeScrollTo;
  },

  _getMaxLeftOffset(scrollable) {
    const containerElement = $(scrollable.container()).get(0);

    return containerElement.scrollWidth - containerElement.clientWidth;
  },

  on(eventName, handler) {
    const that = this;
    const scrollable = that._getScrollable();

    if (scrollable) {
      scrollable.on(eventName, (e) => {
        if (that.option('rtlEnabled') && isDefined(e.scrollOffset.left)) {
          e.scrollOffset.left = that._getMaxLeftOffset(scrollable) - e.scrollOffset.left;
        }
        handler(e);
      });
    }
    return this;
  },

  off(eventName) {
    const scrollable = this._getScrollable();
    if (scrollable) {
      scrollable.off(eventName);
    }
    return this;
  },
  scrollTo(pos, force = false) {
    const scrollable = this._getScrollable();
    if (!scrollable) {
      return;
    }

    const rtlEnabled = this.option('rtlEnabled');
    const areaName = this._getAreaName();
    const scrollablePos = {
      ...pos,
      left: rtlEnabled && (areaName === 'column' || areaName === 'data')
        ? this._getMaxLeftOffset(scrollable) - pos.left
        : pos.left,
    };

    const memoizeScrollTo = this._getMemoizeScrollTo();
    memoizeScrollTo(scrollablePos, force);

    if (this._virtualContent) {
      this._createFakeTable();
      this._moveFakeTable(pos);
    }
  },

  updateScrollable() {
    const scrollable = this._getScrollable();
    if (scrollable) {
      return scrollable.update();
    }

    return undefined;
  },

  getColumnsCount() {
    let columnCount = 0;
    const row = this._getRowElement(0);
    let cells;

    if (row) {
      cells = row.cells;
      // eslint-disable-next-line no-plusplus
      for (let i = 0, len = cells.length; i < len; ++i) {
        columnCount += cells[i].colSpan;
      }
    }

    return columnCount;
  },

  getData() {
    const tableElement = this._tableElement;
    return tableElement ? tableElement.data('data') : [];
  },
});

export default { AreaItem, getRealElementWidth };
export { AreaItem, getRealElementWidth };

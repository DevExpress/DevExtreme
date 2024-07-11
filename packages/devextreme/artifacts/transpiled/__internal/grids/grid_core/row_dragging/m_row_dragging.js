"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rowDraggingModule = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/../core/renderer"));
var _extend = require("../../../../core/../core/utils/extend");
var _common = require("../../../../core/utils/common");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _sortable = _interopRequireDefault(require("../../../../ui/sortable"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _const = require("./const");
var _dom = require("./dom");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const rowsView = Base => class RowsViewRowDraggingExtender extends Base {
  init() {
    super.init.apply(this, arguments);
    this._updateHandleColumn();
  }
  optionChanged(args) {
    if (args.name === 'rowDragging') {
      this._updateHandleColumn();
      this._invalidate(true, true);
      args.handled = true;
    }
    super.optionChanged.apply(this, arguments);
  }
  _allowReordering() {
    const rowDragging = this.option('rowDragging');
    return !!(rowDragging && (rowDragging.allowReordering || rowDragging.allowDropInsideItem || rowDragging.group));
  }
  _updateHandleColumn() {
    const rowDragging = this.option('rowDragging');
    const allowReordering = this._allowReordering();
    const columnsController = this._columnsController;
    const isHandleColumnVisible = allowReordering && rowDragging.showDragIcons;
    columnsController === null || columnsController === void 0 || columnsController.addCommandColumn({
      type: 'drag',
      command: 'drag',
      visibleIndex: -2,
      alignment: 'center',
      elementAttr: [{
        name: _const.ATTRIBUTES.dragCell,
        value: ''
      }],
      cssClass: _const.CLASSES.commandDrag,
      width: 'auto',
      cellTemplate: this._getHandleTemplate(),
      visible: isHandleColumnVisible
    });
    columnsController === null || columnsController === void 0 || columnsController.columnOption('type:drag', 'visible', isHandleColumnVisible);
  }
  _renderContent() {
    const rowDragging = this.option('rowDragging');
    const allowReordering = this._allowReordering();
    const $content = super._renderContent.apply(this, arguments);
    // @ts-expect-error
    const isFixedTableRendering = this._isFixedTableRendering;
    const sortableName = '_sortable';
    const sortableFixedName = '_sortableFixed';
    const currentSortableName = isFixedTableRendering ? sortableFixedName : sortableName;
    const anotherSortableName = isFixedTableRendering ? sortableName : sortableFixedName;
    const togglePointerEventsStyle = toggle => {
      var _this$sortableFixedNa;
      // T929503
      (_this$sortableFixedNa = this[sortableFixedName]) === null || _this$sortableFixedNa === void 0 || _this$sortableFixedNa.$element().css('pointerEvents', toggle ? 'auto' : '');
    };
    const rowSelector = '.dx-row:not(.dx-freespace-row):not(.dx-virtual-row):not(.dx-header-row):not(.dx-footer-row)';
    const filter = this.option('dataRowTemplate') ? `> table > tbody${rowSelector}` : `> table > tbody > ${rowSelector}`;
    if ((allowReordering || this[currentSortableName]) && $content.length) {
      this[currentSortableName] = this._createComponent($content, _sortable.default, (0, _extend.extend)({
        component: this.component,
        contentTemplate: null,
        filter,
        cursorOffset: options => {
          const {
            event
          } = options;
          const rowsViewOffset = (0, _renderer.default)(this.element()).offset();
          return {
            // @ts-expect-error
            x: event.pageX - rowsViewOffset.left
          };
        },
        onDraggableElementShown: e => {
          if (rowDragging.dragTemplate) {
            return;
          }
          const $dragElement = (0, _renderer.default)(e.dragElement);
          const gridInstance = $dragElement.children('.dx-widget').data(this.component.NAME);
          this._synchronizeScrollLeftPosition(gridInstance);
        },
        dragTemplate: this._getDraggableRowTemplate(),
        handle: rowDragging.showDragIcons && `.${_const.CLASSES.commandDrag}`,
        dropFeedbackMode: 'indicate'
      }, rowDragging, {
        onDragStart: e => {
          var _this$getController, _rowDragging$onDragSt;
          // TODO getController
          (_this$getController = this.getController('keyboardNavigation')) === null || _this$getController === void 0 || _this$getController._resetFocusedCell();
          const row = e.component.getVisibleRows()[e.fromIndex];
          e.itemData = row && row.data;
          const isDataRow = row && row.rowType === 'data';
          e.cancel = !allowReordering || !isDataRow;
          (_rowDragging$onDragSt = rowDragging.onDragStart) === null || _rowDragging$onDragSt === void 0 || _rowDragging$onDragSt.call(rowDragging, e);
        },
        onDragEnter: e => {
          if (e.fromComponent !== e.toComponent) {
            togglePointerEventsStyle(true);
          }
        },
        onDragLeave: () => {
          togglePointerEventsStyle(false);
        },
        onDragEnd: e => {
          var _rowDragging$onDragEn;
          togglePointerEventsStyle(false);
          (_rowDragging$onDragEn = rowDragging.onDragEnd) === null || _rowDragging$onDragEn === void 0 || _rowDragging$onDragEn.call(rowDragging, e);
        },
        onAdd: e => {
          var _rowDragging$onAdd;
          togglePointerEventsStyle(false);
          (_rowDragging$onAdd = rowDragging.onAdd) === null || _rowDragging$onAdd === void 0 || _rowDragging$onAdd.call(rowDragging, e);
        },
        dropFeedbackMode: rowDragging.dropFeedbackMode,
        onOptionChanged: e => {
          const hasFixedSortable = this[sortableFixedName];
          if (hasFixedSortable) {
            if (e.name === 'fromIndex' || e.name === 'toIndex') {
              this[anotherSortableName].option(e.name, e.value);
            }
          }
        }
      }));
      $content.toggleClass('dx-scrollable-container', isFixedTableRendering);
      $content.toggleClass(_const.CLASSES.sortableWithoutHandle, allowReordering && !rowDragging.showDragIcons);
    }
    return $content;
  }
  _renderCore(e) {
    super._renderCore.apply(this, arguments);
    if (e && e.changeType === 'update' && e.repaintChangesOnly && _m_utils.default.isVirtualRowRendering(this)) {
      (0, _common.deferUpdate)(() => {
        this._updateSortable();
      });
    }
  }
  _updateSortable() {
    const offset = this._dataController.getRowIndexOffset();
    // @ts-expect-error
    const offsetDiff = offset - this._previousOffset;
    // @ts-expect-error
    [this._sortable, this._sortableFixed].forEach(sortable => {
      const toIndex = sortable === null || sortable === void 0 ? void 0 : sortable.option('toIndex');
      // @ts-expect-error
      if ((0, _type.isDefined)(toIndex) && (0, _type.isDefined)(this._previousOffset)) {
        sortable === null || sortable === void 0 || sortable.option('toIndex', toIndex - offsetDiff);
      }
      sortable === null || sortable === void 0 || sortable.option('offset', offset);
      sortable === null || sortable === void 0 || sortable.update();
    });
    // @ts-expect-error
    this._previousOffset = offset;
  }
  _resizeCore() {
    super._resizeCore.apply(this, arguments);
    this._updateSortable();
  }
  _getDraggableGridOptions(options) {
    const gridOptions = this.option();
    const columns = this.getColumns();
    const $rowElement = (0, _renderer.default)(this.getRowElement(options.rowIndex));
    return {
      dataSource: [{
        id: 1,
        parentId: 0
      }],
      showBorders: true,
      showColumnHeaders: false,
      scrolling: {
        useNative: false,
        showScrollbar: 'never'
      },
      pager: {
        visible: false
      },
      loadingTimeout: null,
      columnFixing: gridOptions.columnFixing,
      columnAutoWidth: gridOptions.columnAutoWidth,
      showColumnLines: gridOptions.showColumnLines,
      columns: columns.map(column => ({
        width: column.width || column.visibleWidth,
        fixed: column.fixed,
        fixedPosition: column.fixedPosition
      })),
      onRowPrepared: e => {
        const rowsView = e.component.getView('rowsView');
        (0, _renderer.default)(e.rowElement).replaceWith($rowElement.eq(rowsView._isFixedTableRendering ? 1 : 0).clone());
      }
    };
  }
  _synchronizeScrollLeftPosition(gridInstance) {
    const scrollable = gridInstance === null || gridInstance === void 0 ? void 0 : gridInstance.getScrollable();
    scrollable === null || scrollable === void 0 || scrollable.scrollTo({
      x: this._scrollLeft
    });
  }
  _getDraggableRowTemplate() {
    return options => {
      const $rootElement = this.component.$element();
      const $dataGridContainer = (0, _renderer.default)('<div>');
      (0, _size.setWidth)($dataGridContainer, (0, _size.getWidth)($rootElement));
      const items = this._dataController.items();
      const row = items && items[options.fromIndex];
      const gridOptions = this._getDraggableGridOptions(row);
      // @ts-expect-error
      this._createComponent($dataGridContainer, this.component.NAME, gridOptions);
      $dataGridContainer.find('.dx-gridbase-container').children(`:not(.${this.addWidgetPrefix(_const.CLASSES.rowsView)})`).hide();
      $dataGridContainer.addClass(this.addWidgetPrefix(_const.CLASSES.dragView));
      return $dataGridContainer;
    };
  }
  _getHandleTemplate() {
    return _dom.GridCoreRowDraggingDom.createHandleTemplateFunc(string => this.addWidgetPrefix(string));
  }
};
const rowDraggingModule = exports.rowDraggingModule = {
  defaultOptions() {
    return {
      rowDragging: {
        showDragIcons: true,
        dropFeedbackMode: 'indicate',
        allowReordering: false,
        allowDropInsideItem: false
      }
    };
  },
  extenders: {
    views: {
      rowsView
    }
  }
};
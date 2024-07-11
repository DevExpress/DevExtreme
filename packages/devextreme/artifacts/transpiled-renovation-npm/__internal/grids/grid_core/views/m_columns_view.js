"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeWidth = exports.ColumnsView = void 0;
var _dom_adapter = _interopRequireDefault(require("../../../../core/dom_adapter"));
var _element = require("../../../../core/element");
var _element_data = require("../../../../core/element_data");
var _guid = _interopRequireDefault(require("../../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _browser = _interopRequireDefault(require("../../../../core/utils/browser"));
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var iteratorUtils = _interopRequireWildcard(require("../../../../core/utils/iterator"));
var _position = require("../../../../core/utils/position");
var _size = require("../../../../core/utils/size");
var _style = require("../../../../core/utils/style");
var _support = require("../../../../core/utils/support");
var _type = require("../../../../core/utils/type");
var _window = require("../../../../core/utils/window");
var _click = require("../../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _double_click = require("../../../../events/double_click");
var _pointer = _interopRequireDefault(require("../../../../events/pointer"));
var _remove = require("../../../../events/remove");
var _m_column_state_mixin = require("../../../grids/grid_core/column_state_mixin/m_column_state_mixin");
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable @typescript-eslint/no-unused-vars */

const SCROLL_CONTAINER_CLASS = 'scroll-container';
const SCROLLABLE_SIMULATED_CLASS = 'scrollable-simulated';
const GROUP_SPACE_CLASS = 'group-space';
const CONTENT_CLASS = 'content';
const TABLE_CLASS = 'table';
const TABLE_FIXED_CLASS = 'table-fixed';
const CONTENT_FIXED_CLASS = 'content-fixed';
const ROW_CLASS = 'dx-row';
const GROUP_ROW_CLASS = 'dx-group-row';
const GROUP_CELL_CLASS = 'dx-group-cell';
const DETAIL_ROW_CLASS = 'dx-master-detail-row';
const FILTER_ROW_CLASS = 'filter-row';
const ERROR_ROW_CLASS = 'dx-error-row';
const CELL_UPDATED_ANIMATION_CLASS = 'cell-updated-animation';
const HIDDEN_COLUMNS_WIDTH = '0.0001px';
const CELL_HINT_VISIBLE = 'dxCellHintVisible';
const FORM_FIELD_ITEM_CONTENT_CLASS = 'dx-field-item-content';
const appendElementTemplate = {
  render(options) {
    options.container.append(options.content);
  }
};
const subscribeToRowEvents = function (that, $table) {
  let touchTarget;
  let touchCurrentTarget;
  let timeoutId;
  function clearTouchTargets(timeout) {
    return setTimeout(() => {
      touchTarget = touchCurrentTarget = null;
    }, timeout);
  }
  _events_engine.default.on($table, 'touchstart touchend', '.dx-row', e => {
    clearTimeout(timeoutId);
    if (e.type === 'touchstart') {
      touchTarget = e.target;
      touchCurrentTarget = e.currentTarget;
      timeoutId = clearTouchTargets(1000);
    } else {
      timeoutId = clearTouchTargets();
    }
  });
  _events_engine.default.on($table, [_click.name, _double_click.name, _pointer.default.down].join(' '), '.dx-row', that.createAction(e => {
    const {
      event
    } = e;
    if (touchTarget) {
      event.target = touchTarget;
      event.currentTarget = touchCurrentTarget;
    }
    if (!(0, _renderer.default)(event.target).closest('a').length) {
      e.rowIndex = that.getRowIndex(event.currentTarget);
      if (e.rowIndex >= 0) {
        e.rowElement = (0, _element.getPublicElement)((0, _renderer.default)(event.currentTarget));
        e.columns = that.getColumns();
        if (event.type === _pointer.default.down) {
          that._rowPointerDown(e);
        } else if (event.type === _click.name) {
          that._rowClick(e);
        } else {
          that._rowDblClick(e);
        }
      }
    }
  }));
};
const getWidthStyle = function (width) {
  if (width === 'auto') return '';
  return (0, _type.isNumeric)(width) ? `${width}px` : width;
};
const setCellWidth = function (cell, column, width) {
  cell.style.width = cell.style.maxWidth = column.width === 'auto' ? '' : width;
};
const copyAttributes = function (element, newElement) {
  if (!element || !newElement) return;
  const oldAttributes = element.attributes;
  const newAttributes = newElement.attributes;
  let i;
  for (i = 0; i < oldAttributes.length; i++) {
    const name = oldAttributes[i].nodeName;
    if (!newElement.hasAttribute(name)) {
      element.removeAttribute(name);
    }
  }
  for (i = 0; i < newAttributes.length; i++) {
    element.setAttribute(newAttributes[i].nodeName, newAttributes[i].nodeValue);
  }
};
const removeHandler = function (templateDeferred) {
  templateDeferred.resolve();
};
const normalizeWidth = width => {
  if (typeof width === 'number') {
    return `${width.toFixed(3)}px`;
  }
  if (width === 'adaptiveHidden') {
    return HIDDEN_COLUMNS_WIDTH;
  }
  return width;
};
exports.normalizeWidth = normalizeWidth;
class ColumnsView extends (0, _m_column_state_mixin.ColumnStateMixin)(_m_modules.default.View) {
  init() {
    this._scrollLeft = -1;
    this._columnsController = this.getController('columns');
    this._dataController = this.getController('data');
    this._adaptiveColumnsController = this.getController('adaptiveColumns');
    this._columnChooserController = this.getController('columnChooser');
    this._editorFactoryController = this.getController('editorFactory');
    this._selectionController = this.getController('selection');
    this._columnChooserView = this.getView('columnChooserView');
    this._delayedTemplates = [];
    this._templateDeferreds = new Set();
    this._templatesCache = {};
    this._templateTimeouts = new Set();
    this.createAction('onCellClick');
    this.createAction('onRowClick');
    this.createAction('onCellDblClick');
    this.createAction('onRowDblClick');
    this.createAction('onCellHoverChanged', {
      excludeValidators: ['disabled', 'readOnly']
    });
    this.createAction('onCellPrepared', {
      excludeValidators: ['disabled', 'readOnly'],
      category: 'rendering'
    });
    this.createAction('onRowPrepared', {
      excludeValidators: ['disabled', 'readOnly'],
      category: 'rendering',
      afterExecute: e => {
        this._afterRowPrepared(e);
      }
    });
    this._columnsController.columnsChanged.add(this._columnOptionChanged.bind(this));
    this._dataController && this._dataController.changed.add(this._handleDataChanged.bind(this));
  }
  dispose() {
    if ((0, _window.hasWindow)()) {
      var _this$_templateTimeou, _this$_templateTimeou2;
      const window = (0, _window.getWindow)();
      (_this$_templateTimeou = this._templateTimeouts) === null || _this$_templateTimeou === void 0 || _this$_templateTimeou.forEach(templateTimeout => window.clearTimeout(templateTimeout));
      (_this$_templateTimeou2 = this._templateTimeouts) === null || _this$_templateTimeou2 === void 0 || _this$_templateTimeou2.clear();
    }
  }
  optionChanged(args) {
    super.optionChanged(args);
    // eslint-disable-next-line default-case
    switch (args.name) {
      case 'cellHintEnabled':
      case 'onCellPrepared':
      case 'onRowPrepared':
      case 'onCellHoverChanged':
        this._invalidate(true, true);
        args.handled = true;
        break;
      case 'keyboardNavigation':
        if (args.fullName === 'keyboardNavigation.enabled') {
          this._invalidate(true, true);
        }
        args.handled = true;
        break;
    }
  }
  _createScrollableOptions() {
    const that = this;
    const scrollingOptions = that.option('scrolling');
    let useNativeScrolling = that.option('scrolling.useNative');
    const options = (0, _extend.extend)({}, scrollingOptions, {
      direction: 'both',
      bounceEnabled: false,
      useKeyboard: false
    });
    // TODO jsdmitry: This condition is for unit tests and testing scrollable
    if (useNativeScrolling === undefined) {
      useNativeScrolling = true;
    }
    if (useNativeScrolling === 'auto') {
      delete options.useNative;
      delete options.useSimulatedScrollbar;
    } else {
      options.useNative = !!useNativeScrolling;
      options.useSimulatedScrollbar = !useNativeScrolling;
    }
    return options;
  }
  _updateCell($cell, parameters) {
    if (parameters.rowType) {
      this._cellPrepared($cell, parameters);
    }
  }
  _needToSetCellWidths() {
    return this.option('columnAutoWidth');
  }
  /**
   * @extended: column_fixing, editing
   */
  _createCell(options) {
    const {
      column
    } = options;
    const alignment = column.alignment || (0, _position.getDefaultAlignment)(this.option('rtlEnabled'));
    const needToSetCellWidths = this._needToSetCellWidths();
    const cell = _dom_adapter.default.createElement('td');
    cell.style.textAlign = alignment;
    const $cell = (0, _renderer.default)(cell);
    if (options.rowType === 'data' && column.headerId && !column.type) {
      if (this.component.option('showColumnHeaders')) {
        this.setAria('describedby', column.headerId, $cell);
      }
    }
    if (column.cssClass) {
      $cell.addClass(column.cssClass);
    }
    if (Array.isArray(column.elementAttr)) {
      column.elementAttr.forEach(_ref => {
        let {
          name,
          value
        } = _ref;
        $cell.attr(name, value);
      });
    }
    if (column.command === 'expand') {
      $cell.addClass(column.cssClass);
      $cell.addClass(this.addWidgetPrefix(GROUP_SPACE_CLASS));
    }
    if (column.colspan > 1) {
      $cell.attr('colSpan', column.colspan);
    } else if (!column.isBand && column.visibleWidth !== 'auto' && needToSetCellWidths) {
      if (column.width || column.minWidth) {
        cell.style.minWidth = getWidthStyle(column.minWidth || column.width);
      }
      if (column.width) {
        setCellWidth(cell, column, getWidthStyle(column.width));
      }
    }
    return $cell;
  }
  /**
   * @extended: selection
   */
  _createRow(rowObject, tagName) {
    tagName = tagName || 'tr';
    const $element = (0, _renderer.default)(`<${tagName}>`).addClass(ROW_CLASS);
    if (tagName === 'tr') {
      this.setAria('role', 'row', $element);
    }
    return $element;
  }
  _isAltRow(row) {
    return row && row.dataIndex % 2 === 1;
  }
  /**
   * @extended: selection
   */
  _createTable(columns, isAppend) {
    const $table = (0, _renderer.default)('<table>').addClass(this.addWidgetPrefix(TABLE_CLASS)).addClass(this.addWidgetPrefix(TABLE_FIXED_CLASS));
    if (columns && !isAppend) {
      $table.attr('id', `dx-${new _guid.default()}`).append(this._createColGroup(columns));
      if (_browser.default.safari) {
        // T198380, T809552
        // @ts-expect-error
        $table.append((0, _renderer.default)('<thead>').append('<tr>'));
      }
      this.setAria('role', 'presentation', $table);
    } else {
      this.setAria('hidden', true, $table);
    }
    this.setAria('role', 'presentation', (0, _renderer.default)('<tbody>').appendTo($table));
    if (isAppend) {
      return $table;
    }
    // T138469
    if (_browser.default.mozilla) {
      _events_engine.default.on($table, 'mousedown', 'td', e => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      });
    }
    if (this.option('cellHintEnabled')) {
      _events_engine.default.on($table, 'mousemove', '.dx-row > td', this.createAction(args => {
        const e = args.event;
        const $element = (0, _renderer.default)(e.target);
        const $cell = (0, _renderer.default)(e.currentTarget);
        const $row = $cell.parent();
        const visibleColumns = this._columnsController.getVisibleColumns();
        const rowOptions = $row.data('options');
        const columnIndex = $cell.index();
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        const cellOptions = rowOptions && rowOptions.cells && rowOptions.cells[columnIndex];
        const column = cellOptions ? cellOptions.column : visibleColumns[columnIndex];
        const isHeaderRow = $row.hasClass('dx-header-row');
        const isDataRow = $row.hasClass('dx-data-row');
        const isMasterDetailRow = $row.hasClass(DETAIL_ROW_CLASS);
        const isGroupRow = $row.hasClass(GROUP_ROW_CLASS);
        const isFilterRow = $row.hasClass(this.addWidgetPrefix(FILTER_ROW_CLASS));
        const isDataRowWithTemplate = isDataRow && (!column || column.cellTemplate);
        const isEditorShown = isDataRow && cellOptions && (rowOptions.isEditing || cellOptions.isEditing || (column === null || column === void 0 ? void 0 : column.showEditorAlways));
        const isHeaderRowWithTemplate = isHeaderRow && (!column || column.headerCellTemplate);
        const isGroupCellWithTemplate = isGroupRow && (!column || column.groupIndex && column.groupCellTemplate);
        const shouldShowHint = !isMasterDetailRow && !isFilterRow && !isEditorShown && !isDataRowWithTemplate && !isHeaderRowWithTemplate && !isGroupCellWithTemplate;
        if (shouldShowHint) {
          if ($element.data(CELL_HINT_VISIBLE)) {
            $element.removeAttr('title');
            $element.data(CELL_HINT_VISIBLE, false);
          }
          const difference = $element[0].scrollWidth - $element[0].clientWidth;
          if (difference > 0 && !(0, _type.isDefined)($element.attr('title'))) {
            $element.attr('title', $element.text());
            $element.data(CELL_HINT_VISIBLE, true);
          }
        }
      }));
    }
    const getOptions = event => {
      const $cell = (0, _renderer.default)(event.currentTarget);
      const $fieldItemContent = (0, _renderer.default)(event.target).closest(`.${FORM_FIELD_ITEM_CONTENT_CLASS}`);
      const $row = $cell.parent();
      const rowOptions = $row.data('options');
      const options = rowOptions && rowOptions.cells && rowOptions.cells[$cell.index()];
      if (!$cell.closest('table').is(event.delegateTarget)) return;
      const resultOptions = (0, _extend.extend)({}, options, {
        cellElement: (0, _element.getPublicElement)($cell),
        event,
        eventType: event.type
      });
      resultOptions.rowIndex = this.getRowIndex($row);
      if ($fieldItemContent.length) {
        const formItemOptions = $fieldItemContent.data('dx-form-item');
        if (formItemOptions.column) {
          resultOptions.column = formItemOptions.column;
          resultOptions.columnIndex = this._columnsController.getVisibleIndex(resultOptions.column.index);
        }
      }
      return resultOptions;
    };
    _events_engine.default.on($table, 'mouseover', '.dx-row > td', e => {
      const options = getOptions(e);
      options && this.executeAction('onCellHoverChanged', options);
    });
    _events_engine.default.on($table, 'mouseout', '.dx-row > td', e => {
      const options = getOptions(e);
      options && this.executeAction('onCellHoverChanged', options);
    });
    _events_engine.default.on($table, _click.name, '.dx-row > td', e => {
      const options = getOptions(e);
      options && this.executeAction('onCellClick', options);
    });
    _events_engine.default.on($table, _double_click.name, '.dx-row > td', e => {
      const options = getOptions(e);
      options && this.executeAction('onCellDblClick', options);
    });
    subscribeToRowEvents(this, $table);
    return $table;
  }
  /**
   * @extended: editing
   */
  _rowPointerDown(e) {}
  _rowClick() {}
  _rowDblClick() {}
  _createColGroup(columns) {
    const colgroupElement = (0, _renderer.default)('<colgroup>');
    for (let i = 0; i < columns.length; i++) {
      const colspan = columns[i].colspan || 1;
      for (let j = 0; j < colspan; j++) {
        colgroupElement.append(this._createCol(columns[i]));
      }
    }
    return colgroupElement;
  }
  /**
   * @extended: column_fixing
   */
  _createCol(column) {
    let width = column.visibleWidth || column.width;
    if (width === 'adaptiveHidden') {
      width = HIDDEN_COLUMNS_WIDTH;
    }
    const col = (0, _renderer.default)('<col>');
    (0, _style.setWidth)(col, width);
    return col;
  }
  /**
   * @extended: keyboard_navigation, virtual_scrolling
   */
  renderDelayedTemplates(change) {
    const delayedTemplates = this._delayedTemplates;
    const syncTemplates = delayedTemplates.filter(template => !template.async);
    const asyncTemplates = delayedTemplates.filter(template => template.async);
    this._delayedTemplates = [];
    this._renderDelayedTemplatesCore(syncTemplates, false, change);
    this._renderDelayedTemplatesCoreAsync(asyncTemplates);
  }
  _renderDelayedTemplatesCoreAsync(templates) {
    if (templates.length) {
      const templateTimeout = (0, _window.getWindow)().setTimeout(() => {
        this._templateTimeouts.delete(templateTimeout);
        this._renderDelayedTemplatesCore(templates, true);
      });
      this._templateTimeouts.add(templateTimeout);
    }
  }
  _renderDelayedTemplatesCore(templates, isAsync, change) {
    const date = new Date();
    while (templates.length) {
      const templateParameters = templates.shift();
      const {
        options
      } = templateParameters;
      // @ts-expect-error
      const doc = _dom_adapter.default.getRootNode((0, _renderer.default)(options.container).get(0));
      const needWaitAsyncTemplates = this.needWaitAsyncTemplates();
      // @ts-expect-error
      if (!isAsync || (0, _renderer.default)(options.container).closest(doc).length || needWaitAsyncTemplates) {
        if (change) {
          options.change = change;
        }
        templateParameters.template.render(options);
      }
      // @ts-expect-error
      if (isAsync && new Date() - date > 30) {
        this._renderDelayedTemplatesCoreAsync(templates);
        break;
      }
    }
    if (!templates.length && this._delayedTemplates.length) {
      this.renderDelayedTemplates();
    }
  }
  _processTemplate(template, options) {
    const that = this;
    let renderingTemplate;
    if (template && template.render && !(0, _type.isRenderer)(template)) {
      renderingTemplate = {
        allowRenderToDetachedContainer: template.allowRenderToDetachedContainer,
        render(options) {
          template.render(options.container, options.model, options.change);
          options.deferred && options.deferred.resolve();
        }
      };
    } else if ((0, _type.isFunction)(template)) {
      renderingTemplate = {
        render(options) {
          const renderedTemplate = template((0, _element.getPublicElement)(options.container), options.model, options.change);
          if (renderedTemplate && (renderedTemplate.nodeType || (0, _type.isRenderer)(renderedTemplate))) {
            options.container.append(renderedTemplate);
          }
          options.deferred && options.deferred.resolve();
        }
      };
    } else {
      const templateID = (0, _type.isString)(template) ? template : (0, _renderer.default)(template).attr('id');
      if (!templateID) {
        renderingTemplate = that.getTemplate(template);
      } else {
        if (!that._templatesCache[templateID]) {
          that._templatesCache[templateID] = that.getTemplate(template);
        }
        renderingTemplate = that._templatesCache[templateID];
      }
    }
    return renderingTemplate;
  }
  renderTemplate(container, template, options, allowRenderToDetachedContainer, change) {
    const renderingTemplate = this._processTemplate(template, options);
    const {
      column
    } = options;
    const isDataRow = options.rowType === 'data';
    // @ts-expect-error
    const templateDeferred = new _deferred.Deferred();
    const templateOptions = {
      container,
      model: options,
      deferred: templateDeferred,
      onRendered: () => {
        if (this.isDisposed()) {
          templateDeferred.reject();
        } else {
          templateDeferred.resolve();
        }
      }
    };
    if (renderingTemplate) {
      options.component = this.component;
      const columnAsync = column && (column.renderAsync && isDataRow || this.option('renderAsync') && (column.renderAsync !== false && (column.command || column.showEditorAlways) && isDataRow || options.rowType === 'filter'));
      const async = options.renderAsync ?? columnAsync;
      if ((renderingTemplate.allowRenderToDetachedContainer || allowRenderToDetachedContainer) && !async) {
        renderingTemplate.render(templateOptions);
      } else {
        this._delayedTemplates.push({
          template: renderingTemplate,
          options: templateOptions,
          async
        });
      }
      this._templateDeferreds.add(templateDeferred);
      _events_engine.default.on(container, _remove.removeEvent, removeHandler.bind(null, templateDeferred));
    } else {
      templateDeferred.reject();
    }
    return templateDeferred.promise().always(() => {
      this._templateDeferreds.delete(templateDeferred);
    });
  }
  _getBodies(tableElement) {
    return (0, _renderer.default)(tableElement).children('tbody').not('.dx-header').not('.dx-footer');
  }
  _needWrapRow($tableElement) {
    var _this$_getBodies;
    const hasRowTemplate = !!this.option().rowTemplate;
    return hasRowTemplate && !!((_this$_getBodies = this._getBodies($tableElement)) !== null && _this$_getBodies !== void 0 && _this$_getBodies.filter(`.${ROW_CLASS}`).length);
  }
  _wrapRowIfNeed($table, $row, isRefreshing) {
    const $tableElement = isRefreshing ? $table || this._tableElement : this._tableElement || $table;
    const needWrapRow = this._needWrapRow($tableElement);
    if (needWrapRow) {
      const $tbody = (0, _renderer.default)('<tbody>').addClass($row.attr('class'));
      this.setAria('role', 'presentation', $tbody);
      return $tbody.append($row);
    }
    return $row;
  }
  _appendRow($table, $row, appendTemplate) {
    appendTemplate = appendTemplate || appendElementTemplate;
    appendTemplate.render({
      content: $row,
      container: $table
    });
  }
  /**
   * @extended: column_fixing, filter_row, row_dragging, virtual_columns
   */
  _resizeCore() {
    const scrollLeft = this._scrollLeft;
    if (scrollLeft >= 0) {
      this._scrollLeft = 0;
      this.scrollTo({
        left: scrollLeft
      });
    }
  }
  /**
   * @extended: column_fixing, header_panel, virtual_column
   */
  _renderCore(e) {
    const $root = this.element().parent();
    if (!$root || $root.parent().length) {
      this.renderDelayedTemplates(e);
    }
  }
  /**
   * @extended: column_fixing
   */
  _renderTable(options) {
    options = options || {};
    options.columns = this._columnsController.getVisibleColumns();
    const changeType = options.change && options.change.changeType;
    const $table = this._createTable(options.columns, changeType === 'append' || changeType === 'prepend' || changeType === 'update');
    this._renderRows($table, options);
    return $table;
  }
  _renderRows($table, options) {
    const that = this;
    const rows = that._getRows(options.change);
    const columnIndices = options.change && options.change.columnIndices || [];
    const changeTypes = options.change && options.change.changeTypes || [];
    for (let i = 0; i < rows.length; i++) {
      that._renderRow($table, (0, _extend.extend)({
        row: rows[i],
        columnIndices: columnIndices[i],
        changeType: changeTypes[i]
      }, options));
    }
  }
  /**
   * @extended: column_fixing
   */
  _renderRow($table, options) {
    if (!options.columnIndices) {
      options.row.cells = [];
    }
    const $row = this._createRow(options.row);
    const $wrappedRow = this._wrapRowIfNeed($table, $row);
    if (options.changeType !== 'remove') {
      this._renderCells($row, options);
    }
    this._appendRow($table, $wrappedRow);
    const rowOptions = (0, _extend.extend)({
      columns: options.columns
    }, options.row);
    this._addWatchMethod(rowOptions, options.row);
    this._rowPrepared($wrappedRow, rowOptions, options.row);
  }
  _needRenderCell(columnIndex, columnIndices) {
    return !columnIndices || columnIndices.indexOf(columnIndex) >= 0;
  }
  _renderCells($row, options) {
    const that = this;
    let columnIndex = 0;
    const {
      row
    } = options;
    const {
      columns
    } = options;
    for (let i = 0; i < columns.length; i++) {
      if (this._needRenderCell(i, options.columnIndices)) {
        that._renderCell($row, (0, _extend.extend)({
          column: columns[i],
          columnIndex,
          value: row.values && row.values[columnIndex],
          oldValue: row.oldValues && row.oldValues[columnIndex]
        }, options));
      }
      if (columns[i].colspan > 1) {
        columnIndex += columns[i].colspan;
      } else {
        columnIndex++;
      }
    }
  }
  _updateCells($rowElement, $newRowElement, columnIndices) {
    const $cells = $rowElement.children();
    const $newCells = $newRowElement.children();
    const highlightChanges = this.option('highlightChanges');
    const cellUpdatedClass = this.addWidgetPrefix(CELL_UPDATED_ANIMATION_CLASS);
    columnIndices.forEach((columnIndex, index) => {
      const $cell = $cells.eq(columnIndex);
      const $newCell = $newCells.eq(index);
      $cell.replaceWith($newCell);
      if (highlightChanges && !$newCell.hasClass('dx-command-expand')) {
        $newCell.addClass(cellUpdatedClass);
      }
    });
    copyAttributes($rowElement.get(0), $newRowElement.get(0));
  }
  /**
   * @extended: editing
   */
  _setCellAriaAttributes($cell, cellOptions) {
    if (cellOptions.rowType !== 'freeSpace') {
      this.setAria('role', 'gridcell', $cell);
      const columnIndexOffset = this._columnsController.getColumnIndexOffset();
      const ariaColIndex = cellOptions.columnIndex + columnIndexOffset + 1;
      this.setAria('colindex', ariaColIndex, $cell);
    }
  }
  _renderCell($row, options) {
    const cellOptions = this._getCellOptions(options);
    if (options.columnIndices) {
      if (options.row.cells) {
        const cellIndex = options.row.cells.findIndex(cell => cell.columnIndex === cellOptions.columnIndex);
        options.row.cells[cellIndex] = cellOptions;
      }
    } else {
      options.row.cells.push(cellOptions);
    }
    const $cell = this._createCell(cellOptions);
    this._setCellAriaAttributes($cell, cellOptions);
    this._renderCellContent($cell, cellOptions, options);
    $row.get(0).appendChild($cell.get(0));
    return $cell;
  }
  /**
   * @extended: column_fixing, editing_form_based, filter_row, header_filter
   */
  _renderCellContent($cell, options, renderOptions) {
    const template = this._getCellTemplate(options);
    (0, _deferred.when)(!template || this.renderTemplate($cell, template, options, undefined, renderOptions.change)).done(() => {
      this._updateCell($cell, options);
    });
  }
  _getCellTemplate(options) {}
  _getRows(change) {
    return [];
  }
  _getCellOptions(options) {
    const cellOptions = {
      column: options.column,
      columnIndex: options.columnIndex,
      rowType: options.row.rowType,
      isAltRow: this._isAltRow(options.row)
    };
    this._addWatchMethod(cellOptions);
    return cellOptions;
  }
  _addWatchMethod(options, source) {
    if (!this.option('repaintChangesOnly')) return;
    const watchers = [];
    source = source || options;
    source.watch = source.watch || function (getter, updateValueFunc, updateRowFunc) {
      let oldValue = getter(source.data);
      const watcher = function (row) {
        if (row && updateRowFunc) {
          updateRowFunc(row);
        }
        const newValue = getter(source.data);
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          if (row) {
            updateValueFunc(newValue);
          }
          oldValue = newValue;
        }
      };
      watchers.push(watcher);
      const stopWatch = function () {
        const index = watchers.indexOf(watcher);
        if (index >= 0) {
          watchers.splice(index, 1);
        }
      };
      return stopWatch;
    };
    source.update = source.update || function (row, keepRow) {
      if (row) {
        this.data = options.data = row.data;
        this.rowIndex = options.rowIndex = row.rowIndex;
        this.dataIndex = options.dataIndex = row.dataIndex;
        this.isExpanded = options.isExpanded = row.isExpanded;
        if (options.row && !keepRow) {
          options.row = row;
        }
      }
      watchers.forEach(watcher => {
        watcher(row);
      });
    };
    if (source !== options) {
      options.watch = source.watch.bind(source);
    }
    return options;
  }
  /**
   * @extended: adaptivity, editing, validating
   */
  _cellPrepared(cell, options) {
    options.cellElement = (0, _element.getPublicElement)((0, _renderer.default)(cell));
    this.executeAction('onCellPrepared', options);
  }
  _rowPrepared($row, options, row) {
    (0, _element_data.data)($row.get(0), 'options', options);
    options.rowElement = (0, _element.getPublicElement)($row);
    this.executeAction('onRowPrepared', options);
  }
  _columnOptionChanged(e) {
    const {
      optionNames
    } = e;
    if (_m_utils.default.checkChanges(optionNames, ['width', 'visibleWidth'])) {
      const visibleColumns = this._columnsController.getVisibleColumns();
      const widths = visibleColumns.map(column => column.visibleWidth || column.width);
      this.setColumnWidths({
        widths,
        optionNames
      });
      return;
    }
    if (!this._requireReady) {
      this.render();
    }
  }
  /**
   * @extended: column_fixing, editing
   */
  getCellIndex($cell, rowIndex) {
    const cellIndex = $cell.length ? $cell[0].cellIndex : -1;
    return cellIndex;
  }
  /**
   * @extended: column_fixing
   */
  getTableElements() {
    // @ts-expect-error
    return this._tableElement || (0, _renderer.default)();
  }
  /**
   * @extended: column_fixing
   */
  getTableElement(isFixedTableRendering) {
    return this._tableElement;
  }
  /**
   * @extended: column_fixing
   */
  setTableElement(tableElement, isFixedTableRendering) {
    this._tableElement = tableElement;
  }
  _afterRowPrepared(e) {}
  /**
   * @extended: header_panel
   */
  _handleDataChanged(e) {}
  callbackNames() {
    return ['scrollChanged'];
  }
  _updateScrollLeftPosition() {
    const scrollLeft = this._scrollLeft;
    if (scrollLeft >= 0) {
      this._scrollLeft = 0;
      this.scrollTo({
        left: scrollLeft
      });
    }
  }
  scrollTo(pos) {
    const $element = this.element();
    const $scrollContainer = $element && $element.children(`.${this.addWidgetPrefix(SCROLL_CONTAINER_CLASS)}`).not(`.${this.addWidgetPrefix(CONTENT_FIXED_CLASS)}`);
    if ((0, _type.isDefined)(pos) && (0, _type.isDefined)(pos.left) && this._scrollLeft !== pos.left) {
      this._scrollLeft = pos.left;
      $scrollContainer && $scrollContainer.scrollLeft(pos.left);
    }
  }
  /**
   * @extended: column_fixing
   */
  _getContent(isFixedTableRendering) {
    var _this$_tableElement;
    return (_this$_tableElement = this._tableElement) === null || _this$_tableElement === void 0 ? void 0 : _this$_tableElement.parent();
  }
  _removeContent(isFixedTableRendering) {
    const $scrollContainer = this._getContent(isFixedTableRendering);
    if ($scrollContainer !== null && $scrollContainer !== void 0 && $scrollContainer.length) {
      $scrollContainer.remove();
    }
  }
  /**
   * @extended: column_fixing
   */
  _wrapTableInScrollContainer($table, isFixedTableRendering) {
    const $scrollContainer = (0, _renderer.default)('<div>');
    const useNative = this.option('scrolling.useNative');
    if (useNative === false || useNative === 'auto' && !_support.nativeScrolling) {
      $scrollContainer.addClass(this.addWidgetPrefix(SCROLLABLE_SIMULATED_CLASS));
    }
    _events_engine.default.on($scrollContainer, 'scroll', () => {
      const scrollLeft = $scrollContainer.scrollLeft();
      if (scrollLeft !== this._scrollLeft) {
        this.scrollChanged.fire({
          left: scrollLeft
        }, this.name);
      }
    });
    $scrollContainer.addClass(this.addWidgetPrefix(CONTENT_CLASS)).addClass(this.addWidgetPrefix(SCROLL_CONTAINER_CLASS)).append($table).appendTo(this.element());
    this.setAria('role', 'presentation', $scrollContainer);
    return $scrollContainer;
  }
  needWaitAsyncTemplates() {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
    return this.option('templatesRenderAsynchronously') && this.option('renderAsync') === false;
  }
  waitAsyncTemplates() {
    let forceWaiting = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    // @ts-expect-error
    const result = new _deferred.Deferred();
    const needWaitAsyncTemplates = forceWaiting || this.needWaitAsyncTemplates();
    if (!needWaitAsyncTemplates) {
      return result.resolve();
    }
    const waitTemplatesRecursion = () => _deferred.when.apply(this, Array.from(this._templateDeferreds)).done(() => {
      if (this.isDisposed()) {
        result.reject();
      } else if (this._templateDeferreds.size > 0) {
        waitTemplatesRecursion();
      } else {
        result.resolve();
      }
    }).fail(result.reject);
    waitTemplatesRecursion();
    return result.promise();
  }
  _updateContent($newTableElement, change, isFixedTableRendering) {
    return this.waitAsyncTemplates().done(() => {
      this._removeContent(isFixedTableRendering);
      this.setTableElement($newTableElement, isFixedTableRendering);
      this._wrapTableInScrollContainer($newTableElement, isFixedTableRendering);
    });
  }
  _findContentElement(isFixedTableRendering) {}
  _getWidths($cellElements) {
    if (!$cellElements) {
      return [];
    }
    const result = [];
    const cellElements = $cellElements.toArray();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    cellElements.forEach(cell => {
      let width = cell.offsetWidth;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      if (cell.getBoundingClientRect) {
        const rect = (0, _position.getBoundingRect)(cell);
        if (rect.width > cell.offsetWidth - 1) {
          width = rect.width;
        }
      }
      result.push(width);
    });
    return result;
  }
  /**
   * @extended: column_fixing
   */
  getColumnWidths($tableElement) {
    (this.option('forceApplyBindings') || _common.noop)();
    $tableElement = $tableElement ?? this.getTableElement();
    if ($tableElement) {
      const $rows = $tableElement.children('tbody:not(.dx-header)').children();
      for (let i = 0; i < $rows.length; i++) {
        const $row = $rows.eq(i);
        const isGroupRow = $row.hasClass(GROUP_ROW_CLASS);
        const isDetailRow = $row.hasClass(DETAIL_ROW_CLASS);
        const isErrorRow = $row.hasClass(ERROR_ROW_CLASS);
        const isRowVisible = $row.get(0).style.display !== 'none' && !$row.hasClass('dx-state-invisible');
        const isRelevantRow = !isGroupRow && !isDetailRow && !isErrorRow;
        if (isRowVisible && isRelevantRow) {
          const $cells = $row.children('td');
          const result = this._getWidths($cells);
          return result;
        }
      }
    }
    return [];
  }
  getVisibleColumnIndex(columnIndex, rowIndex) {
    return columnIndex;
  }
  setColumnWidths(_ref2) {
    let {
      widths,
      optionNames
    } = _ref2;
    const $tableElement = this.getTableElement();
    if (!($tableElement !== null && $tableElement !== void 0 && $tableElement.length) || !widths) {
      return;
    }
    const columns = this.getColumns();
    const needToSetCellWidths = this._needToSetCellWidths();
    const $cols = $tableElement.children('colgroup').children('col');
    $cols.toArray().forEach(col => col.removeAttribute('style'));
    columns.forEach((column, columnIndex) => {
      /*
      Probably we do not need this if statement. It seems like there is no point to set
      min-width, width and max-width for each cell, beacuse below width for cols in colgroup is set.
      Style for cols applies to all td elements.
              Also check _createCell method because min-width, width and max-width are also set there.
      */
      if (needToSetCellWidths && column.width && !column.command) {
        const width = getWidthStyle(column.visibleWidth || column.width);
        const minWidth = getWidthStyle(column.minWidth || width);
        const $rows = $tableElement.children().children('.dx-row').not(`.${DETAIL_ROW_CLASS}`);
        for (let rowIndex = 0; rowIndex < $rows.length; rowIndex++) {
          const visibleIndex = this.getVisibleColumnIndex(columnIndex, rowIndex);
          if (visibleIndex >= 0) {
            const $row = $rows.eq(rowIndex);
            const $cell = $row.hasClass(GROUP_ROW_CLASS) ? $row.find(`td[aria-colindex='${visibleIndex + 1}']:not(.${GROUP_CELL_CLASS})`) : $row.find('td').eq(visibleIndex);
            if ($cell.length) {
              const cell = $cell.get(0);
              setCellWidth(cell, column, width);
              cell.style.minWidth = minWidth;
            }
          }
        }
      }
      const colWidth = normalizeWidth(widths[columnIndex]);
      if ((0, _type.isDefined)(colWidth)) {
        (0, _style.setWidth)($cols.eq(columnIndex), colWidth);
      }
    });
  }
  /**
   * @extended: editing_form_based
   */
  getCellElements(rowIndex) {
    return this._getCellElementsCore(rowIndex);
  }
  _getCellElementsCore(rowIndex) {
    if (rowIndex < 0) {
      return undefined;
    }
    const $row = this._getRowElements().eq(rowIndex);
    return $row.children();
  }
  /**
   * @extended: adaptivity
   */
  _getCellElement(rowIndex, columnIdentifier) {
    const $cells = this.getCellElements(rowIndex);
    const columnVisibleIndex = this._getVisibleColumnIndex($cells, rowIndex, columnIdentifier);
    if (!($cells !== null && $cells !== void 0 && $cells.length) || columnVisibleIndex < 0) {
      return undefined;
    }
    const $cell = $cells.eq(columnVisibleIndex);
    return $cell.length > 0 ? $cell : undefined;
  }
  _getRowElement(rowIndex) {
    const that = this;
    // @ts-expect-error
    let $rowElement = (0, _renderer.default)();
    const $tableElements = that.getTableElements();
    iteratorUtils.each($tableElements, (_, tableElement) => {
      $rowElement = $rowElement.add(that._getRowElements((0, _renderer.default)(tableElement)).eq(rowIndex));
    });
    if ($rowElement.length) {
      return $rowElement;
    }
    return undefined;
  }
  getCellElement(rowIndex, columnIdentifier) {
    const $cell = this._getCellElement(rowIndex, columnIdentifier);
    if ($cell) {
      return (0, _element.getPublicElement)($cell);
    }
    return undefined;
  }
  getRowElement(rowIndex) {
    const $rows = this._getRowElement(rowIndex);
    let elements = [];
    // @ts-expect-error
    if ($rows && !(0, _element.getPublicElement)($rows).get) {
      for (let i = 0; i < $rows.length; i++) {
        elements.push($rows[i]);
      }
    } else {
      elements = $rows;
    }
    return elements;
  }
  /**
   * @extended: editing_form_based
   */
  _getVisibleColumnIndex($cells, rowIndex, columnIdentifier) {
    if ((0, _type.isString)(columnIdentifier)) {
      const columnIndex = this._columnsController.columnOption(columnIdentifier, 'index');
      return this._columnsController.getVisibleIndex(columnIndex);
    }
    return columnIdentifier;
  }
  getColumnElements() {}
  getColumns(rowIndex, $tableElement) {
    return this._columnsController.getVisibleColumns(rowIndex);
  }
  /**
   * @extended: adaptivity
   */
  getCell(cellPosition, rows, cells) {
    const $rows = rows || this._getRowElements();
    let $cells;
    if ($rows.length > 0 && cellPosition.rowIndex >= 0) {
      var _$cells;
      if (this.option('scrolling.mode') !== 'virtual' && this.option('scrolling.rowRenderingMode') !== 'virtual') {
        cellPosition.rowIndex = cellPosition.rowIndex < $rows.length ? cellPosition.rowIndex : $rows.length - 1;
      }
      $cells = cells || this.getCellElements(cellPosition.rowIndex);
      if (((_$cells = $cells) === null || _$cells === void 0 ? void 0 : _$cells.length) > 0) {
        return $cells.eq($cells.length > cellPosition.columnIndex ? cellPosition.columnIndex : $cells.length - 1);
      }
    }
  }
  getRowsCount() {
    const tableElement = this.getTableElement();
    if (tableElement && tableElement.length === 1) {
      return tableElement[0].rows.length;
    }
    return 0;
  }
  _getRowElementsCore(tableElement) {
    tableElement = tableElement || this.getTableElement();
    if (tableElement) {
      const hasRowTemplate = this.option().rowTemplate || this.option('dataRowTemplate');
      const tBodies = hasRowTemplate && tableElement.find(`> tbody.${ROW_CLASS}`);
      // eslint-disable-next-line no-useless-concat
      return tBodies && tBodies.length ? tBodies : tableElement.find('> tbody > ' + `.${ROW_CLASS}, > .${ROW_CLASS}`);
    }
    // @ts-expect-error
    return (0, _renderer.default)();
  }
  _getRowElements(tableElement) {
    return this._getRowElementsCore(tableElement);
  }
  /**
   * @extended: column_fixing
   */
  getRowIndex($row) {
    return this._getRowElements().index($row);
  }
  getBoundingRect() {}
  getName() {}
  /**
   * @extended: column_fixing
   */
  setScrollerSpacing(width) {
    const that = this;
    const $element = that.element();
    const rtlEnabled = that.option('rtlEnabled');
    $element && $element.css({
      paddingLeft: rtlEnabled ? width : '',
      paddingRight: !rtlEnabled ? width : ''
    });
  }
  isScrollbarVisible(isHorizontal) {
    const $element = this.element();
    const $tableElement = this._tableElement;
    if ($element && $tableElement) {
      return isHorizontal ? (0, _size.getOuterWidth)($tableElement) - (0, _size.getWidth)($element) > 0 : (0, _size.getOuterHeight)($tableElement) - (0, _size.getHeight)($element) > 0;
    }
    return false;
  }
  isDisposed() {
    var _this$component;
    return (_this$component = this.component) === null || _this$component === void 0 ? void 0 : _this$component._disposed;
  }
}
exports.ColumnsView = ColumnsView;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchModule = void 0;
var _dom_adapter = _interopRequireDefault(require("../../../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _data = require("../../../../core/utils/data");
var _query = _interopRequireDefault(require("../../../../data/query"));
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/method-signature-style */

// @ts-expect-error

const SEARCH_PANEL_CLASS = 'search-panel';
const SEARCH_TEXT_CLASS = 'search-text';
const HEADER_PANEL_CLASS = 'header-panel';
const FILTERING_TIMEOUT = 700;
function allowSearch(column) {
  return !!(column.allowSearch ?? column.allowFiltering);
}
function parseValue(column, text) {
  const {
    lookup
  } = column;
  if (!column.parseValue) {
    return text;
  }
  if (lookup) {
    return column.parseValue.call(lookup, text);
  }
  return column.parseValue(text);
}
const dataController = base => class SearchDataControllerExtender extends base {
  optionChanged(args) {
    switch (args.fullName) {
      case 'searchPanel.text':
      case 'searchPanel':
        this._applyFilter();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
  publicMethods() {
    return super.publicMethods().concat(['searchByText']);
  }
  _calculateAdditionalFilter() {
    const filter = super._calculateAdditionalFilter();
    const searchFilter = this.calculateSearchFilter(this.option('searchPanel.text'));
    return _m_utils.default.combineFilters([filter, searchFilter]);
  }
  searchByText(text) {
    this.option('searchPanel.text', text);
  }
  calculateSearchFilter(text) {
    let i;
    let column;
    const columns = this._columnsController.getColumns();
    const searchVisibleColumnsOnly = this.option('searchPanel.searchVisibleColumnsOnly');
    let lookup;
    const filters = [];
    if (!text) return null;
    function onQueryDone(items) {
      const valueGetter = (0, _data.compileGetter)(lookup.valueExpr);
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < items.length; i++) {
        // @ts-expect-error
        const value = valueGetter(items[i]);
        filters.push(column.createFilterExpression(value, null, 'search'));
      }
    }
    for (i = 0; i < columns.length; i++) {
      column = columns[i];
      if (searchVisibleColumnsOnly && !column.visible) continue;
      if (allowSearch(column) && column.calculateFilterExpression) {
        lookup = column.lookup;
        const filterValue = parseValue(column, text);
        if (lookup && lookup.items) {
          // @ts-expect-error
          (0, _query.default)(lookup.items).filter(column.createFilterExpression.call({
            dataField: lookup.displayExpr,
            dataType: lookup.dataType,
            calculateFilterExpression: column.calculateFilterExpression
          }, filterValue, null, 'search')).enumerate().done(onQueryDone);
        } else if (filterValue !== undefined) {
          filters.push(column.createFilterExpression(filterValue, null, 'search'));
        }
      }
    }
    if (filters.length === 0) {
      return ['!'];
    }
    return _m_utils.default.combineFilters(filters, 'or');
  }
};
const headerPanel = Base => class SearchHeaderPanelExtender extends Base {
  optionChanged(args) {
    if (args.name === 'searchPanel') {
      if (args.fullName === 'searchPanel.text') {
        const editor = this.getSearchTextEditor();
        if (editor) {
          editor.option('value', args.value);
        }
      } else {
        this._invalidate();
      }
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }
  _getToolbarItems() {
    const items = super._getToolbarItems();
    return this._prepareSearchItem(items);
  }
  _prepareSearchItem(items) {
    const that = this;
    const dataController = this._dataController;
    const searchPanelOptions = this.option('searchPanel');
    if (searchPanelOptions && searchPanelOptions.visible) {
      const toolbarItem = {
        template(data, index, container) {
          const $search = (0, _renderer.default)('<div>').addClass(that.addWidgetPrefix(SEARCH_PANEL_CLASS)).appendTo(container);
          that._editorFactoryController.createEditor($search, {
            width: searchPanelOptions.width,
            placeholder: searchPanelOptions.placeholder,
            parentType: 'searchPanel',
            value: that.option('searchPanel.text'),
            updateValueTimeout: FILTERING_TIMEOUT,
            setValue(value) {
              // @ts-expect-error
              dataController.searchByText(value);
            },
            editorOptions: {
              inputAttr: {
                'aria-label': _message.default.format(`${that.component.NAME}-ariaSearchInGrid`)
              }
            }
          });
          that.resize();
        },
        name: 'searchPanel',
        location: 'after',
        locateInMenu: 'never',
        sortIndex: 40
      };
      items.push(toolbarItem);
    }
    return items;
  }
  getSearchTextEditor() {
    const that = this;
    const $element = that.element();
    const $searchPanel = $element.find(`.${that.addWidgetPrefix(SEARCH_PANEL_CLASS)}`).filter(function () {
      return (0, _renderer.default)(this).closest(`.${that.addWidgetPrefix(HEADER_PANEL_CLASS)}`).is($element);
    });
    if ($searchPanel.length) {
      return $searchPanel.dxTextBox('instance');
    }
    return null;
  }
  isVisible() {
    const searchPanelOptions = this.option('searchPanel');
    return super.isVisible() || !!(searchPanelOptions !== null && searchPanelOptions !== void 0 && searchPanelOptions.visible);
  }
};
const rowsView = Base => class SearchRowsViewExtender extends Base {
  init() {
    super.init.apply(this, arguments);
    this._searchParams = [];
    this._dataController = this.getController('data');
  }
  dispose() {
    clearTimeout(this._highlightTimer);
    super.dispose();
  }
  _getFormattedSearchText(column, searchText) {
    const value = parseValue(column, searchText);
    const formatOptions = _m_utils.default.getFormatOptionsByColumn(column, 'search');
    return _m_utils.default.formatValue(value, formatOptions);
  }
  _getStringNormalizer() {
    var _this$_dataController, _this$_dataController2, _dataSource$loadOptio;
    const isCaseSensitive = this.option('searchPanel.highlightCaseSensitive');
    const dataSource = (_this$_dataController = this._dataController) === null || _this$_dataController === void 0 || (_this$_dataController2 = _this$_dataController.getDataSource) === null || _this$_dataController2 === void 0 ? void 0 : _this$_dataController2.call(_this$_dataController);
    const langParams = dataSource === null || dataSource === void 0 || (_dataSource$loadOptio = dataSource.loadOptions) === null || _dataSource$loadOptio === void 0 || (_dataSource$loadOptio = _dataSource$loadOptio.call(dataSource)) === null || _dataSource$loadOptio === void 0 ? void 0 : _dataSource$loadOptio.langParams;
    return str => (0, _data.toComparable)(str, isCaseSensitive, langParams);
  }
  _findHighlightingTextNodes(column, cellElement, searchText) {
    var _$items;
    const that = this;
    let $parent = cellElement.parent();
    let $items;
    const stringNormalizer = this._getStringNormalizer();
    const normalizedSearchText = stringNormalizer(searchText);
    const resultTextNodes = [];
    if (!$parent.length) {
      $parent = (0, _renderer.default)('<div>').append(cellElement);
    } else if (column) {
      if (column.groupIndex >= 0 && !column.showWhenGrouped) {
        $items = cellElement;
      } else {
        const columnIndex = that._columnsController.getVisibleIndex(column.index);
        $items = $parent.children('td').eq(columnIndex).find('*');
      }
    }
    $items = (_$items = $items) !== null && _$items !== void 0 && _$items.length ? $items : $parent.find('*');
    $items.each((_, element) => {
      const $contents = (0, _renderer.default)(element).contents();
      for (let i = 0; i < $contents.length; i++) {
        const node = $contents.get(i);
        if (node.nodeType === 3) {
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          const normalizedText = stringNormalizer(node.textContent ?? node.nodeValue ?? '');
          if (normalizedText.includes(normalizedSearchText)) {
            resultTextNodes.push(node);
          }
        }
      }
    });
    return resultTextNodes;
  }
  _highlightSearchTextCore($textNode, searchText) {
    const that = this;
    const $searchTextSpan = (0, _renderer.default)('<span>').addClass(that.addWidgetPrefix(SEARCH_TEXT_CLASS));
    const text = $textNode.text();
    const firstContentElement = $textNode[0];
    const stringNormalizer = this._getStringNormalizer();
    const index = stringNormalizer(text).indexOf(stringNormalizer(searchText));
    if (index >= 0) {
      if (firstContentElement.textContent) {
        firstContentElement.textContent = text.substr(0, index);
      } else {
        firstContentElement.nodeValue = text.substr(0, index);
      }
      $textNode.after($searchTextSpan.text(text.substr(index, searchText.length)));
      // @ts-expect-error
      $textNode = (0, _renderer.default)(_dom_adapter.default.createTextNode(text.substr(index + searchText.length))).insertAfter($searchTextSpan);
      return that._highlightSearchTextCore($textNode, searchText);
    }
  }
  _highlightSearchText(cellElement, isEquals, column) {
    const that = this;
    const stringNormalizer = this._getStringNormalizer();
    let searchText = that.option('searchPanel.text');
    if (isEquals && column) {
      searchText = searchText && that._getFormattedSearchText(column, searchText);
    }
    if (searchText && that.option('searchPanel.highlightSearchText')) {
      const textNodes = that._findHighlightingTextNodes(column, cellElement, searchText);
      textNodes.forEach(textNode => {
        if (isEquals) {
          if (stringNormalizer((0, _renderer.default)(textNode).text()) === stringNormalizer(searchText ?? '')) {
            (0, _renderer.default)(textNode).replaceWith((0, _renderer.default)('<span>').addClass(that.addWidgetPrefix(SEARCH_TEXT_CLASS)).text((0, _renderer.default)(textNode).text()));
          }
        } else {
          that._highlightSearchTextCore((0, _renderer.default)(textNode), searchText);
        }
      });
    }
  }
  _renderCore() {
    const deferred = super._renderCore.apply(this, arguments);
    // T103538
    if (this.option().rowTemplate || this.option('dataRowTemplate')) {
      if (this.option('templatesRenderAsynchronously')) {
        clearTimeout(this._highlightTimer);
        this._highlightTimer = setTimeout(() => {
          this._highlightSearchText(this.getTableElement());
        });
      } else {
        this._highlightSearchText(this.getTableElement());
      }
    }
    return deferred;
  }
  _updateCell($cell, parameters) {
    const {
      column
    } = parameters;
    const dataType = column.lookup && column.lookup.dataType || column.dataType;
    const isEquals = dataType !== 'string';
    if (allowSearch(column) && !parameters.isOnForm) {
      if (this.option('templatesRenderAsynchronously')) {
        if (!this._searchParams.length) {
          clearTimeout(this._highlightTimer);
          this._highlightTimer = setTimeout(() => {
            this._searchParams.forEach(params => {
              this._highlightSearchText.apply(this, params);
            });
            this._searchParams = [];
          });
        }
        this._searchParams.push([$cell, isEquals, column]);
      } else {
        this._highlightSearchText($cell, isEquals, column);
      }
    }
    super._updateCell($cell, parameters);
  }
};
const searchModule = exports.searchModule = {
  defaultOptions() {
    return {
      searchPanel: {
        visible: false,
        width: 160,
        placeholder: _message.default.format('dxDataGrid-searchPanelPlaceholder'),
        highlightSearchText: true,
        highlightCaseSensitive: false,
        text: '',
        searchVisibleColumnsOnly: false
      }
    };
  },
  extenders: {
    controllers: {
      data: dataController
    },
    views: {
      headerPanel,
      rowsView
    }
  }
};
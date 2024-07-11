"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _extend = require("../../../core/utils/extend");
var _text_box = _interopRequireDefault(require("../../../ui/text_box"));
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.search_box_mixin"));
var _m_tree_view = _interopRequireDefault(require("./m_tree_view.base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error
_ui.default.setEditorClass(_text_box.default);
const WIDGET_CLASS = 'dx-treeview';
const NODE_CONTAINER_CLASS = `${WIDGET_CLASS}-node-container`;
const TreeViewSearch = _m_tree_view.default.inherit(_ui.default).inherit({
  _addWidgetPrefix(className) {
    return `${WIDGET_CLASS}-${className}`;
  },
  _optionChanged(args) {
    switch (args.name) {
      case 'searchValue':
        if (this._showCheckboxes() && this._isRecursiveSelection()) {
          this._removeSelection();
        }
        this._initDataAdapter();
        this._updateSearch();
        this._repaintContainer();
        this.option('focusedElement', null);
        break;
      case 'searchExpr':
        this._initDataAdapter();
        this.repaint();
        break;
      case 'searchMode':
        this.option('expandNodesRecursive') ? this._updateDataAdapter() : this._initDataAdapter();
        this.repaint();
        break;
      default:
        this.callBase(args);
    }
  },
  _updateDataAdapter() {
    this._setOptionWithoutOptionChange('expandNodesRecursive', false);
    this._initDataAdapter();
    this._setOptionWithoutOptionChange('expandNodesRecursive', true);
  },
  _getDataAdapterOptions() {
    return (0, _extend.extend)(this.callBase(), {
      searchValue: this.option('searchValue'),
      searchMode: this.option('searchMode') || 'contains',
      searchExpr: this.option('searchExpr')
    });
  },
  _getNodeContainer() {
    return this.$element().find(`.${NODE_CONTAINER_CLASS}`).first();
  },
  _updateSearch() {
    if (this._searchEditor) {
      const editorOptions = this._getSearchEditorOptions();
      this._searchEditor.option(editorOptions);
    }
  },
  _repaintContainer() {
    const $container = this._getNodeContainer();
    let rootNodes;
    if ($container.length) {
      $container.empty();
      rootNodes = this._dataAdapter.getRootNodes();
      this._renderEmptyMessage(rootNodes);
      this._renderItems($container, rootNodes);
      this._fireContentReadyAction();
    }
  },
  _focusTarget() {
    return this._itemContainer(this.option('searchEnabled'));
  },
  _cleanItemContainer() {
    this.$element().empty();
  },
  _itemContainer(isSearchMode, selectAllEnabled) {
    selectAllEnabled ?? (selectAllEnabled = this._selectAllEnabled());
    if (selectAllEnabled) {
      return this._getNodeContainer();
    }
    if (this._scrollable && isSearchMode) {
      return (0, _renderer.default)(this._scrollable.content());
    }
    return this.callBase();
  },
  _addWidgetClass() {
    this.$element().addClass(this._widgetClass());
  },
  _clean() {
    this.callBase();
    this._removeSearchBox();
  }
});
(0, _component_registrator.default)('dxTreeView', TreeViewSearch);
var _default = exports.default = TreeViewSearch;
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import TextBox from '@js/ui/text_box';
import searchBoxMixin from '@js/ui/widget/ui.search_box_mixin';

import TreeViewBase from './m_tree_view.base';

// @ts-expect-error
searchBoxMixin.setEditorClass(TextBox);

const WIDGET_CLASS = 'dx-treeview';
const NODE_CONTAINER_CLASS = `${WIDGET_CLASS}-node-container`;

const TreeViewSearch = TreeViewBase.inherit(searchBoxMixin).inherit({
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
    return extend(this.callBase(), {
      searchValue: this.option('searchValue'),
      searchMode: this.option('searchMode') || 'contains',
      searchExpr: this.option('searchExpr'),
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
    selectAllEnabled ??= this._selectAllEnabled();

    if (selectAllEnabled) {
      return this._getNodeContainer();
    }

    if (this._scrollable && isSearchMode) {
      return $(this._scrollable.content());
    }

    return this.callBase();
  },

  _addWidgetClass() {
    this.$element().addClass(this._widgetClass());
  },

  _clean() {
    this.callBase();
    this._removeSearchBox();
  },
});

registerComponent('dxTreeView', TreeViewSearch);

export default TreeViewSearch;

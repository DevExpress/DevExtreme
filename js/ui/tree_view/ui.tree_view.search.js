import $ from '../../core/renderer';
import registerComponent from '../../core/component_registrator';
import searchBoxMixin from '../widget/ui.search_box_mixin';
import { extend } from '../../core/utils/extend';
import TreeViewBase from './ui.tree_view.base';

const WIDGET_CLASS = 'dx-treeview';
const NODE_CONTAINER_CLASS = `${WIDGET_CLASS}-node-container`;

const TreeViewSearch = TreeViewBase.inherit(searchBoxMixin).inherit({
    _addWidgetPrefix: function(className) {
        return `${WIDGET_CLASS}-${className}`;
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'searchValue':
                if(this._showCheckboxes() && this._isRecursiveSelection()) {
                    this._removeSelection();
                }

                this._initDataAdapter();
                this._updateSearch();
                this._repaintContainer();
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

    _updateDataAdapter: function() {
        this._setOptionSilent('expandNodesRecursive', false);

        this._initDataAdapter();

        this._setOptionSilent('expandNodesRecursive', true);
    },

    _getDataAdapterOptions: function() {
        return extend(this.callBase(), {
            searchValue: this.option('searchValue'),
            searchMode: this.option('searchMode') || 'contains',
            searchExpr: this.option('searchExpr')
        });
    },

    _updateSearch: function() {
        if(this._searchEditor) {
            const editorOptions = this._getSearchEditorOptions();
            this._searchEditor.option(editorOptions);
        }
    },

    _repaintContainer: function() {
        const $container = this.$element().find(`.${NODE_CONTAINER_CLASS}`).first();
        let rootNodes;

        if($container.length) {
            $container.empty();
            rootNodes = this._dataAdapter.getRootNodes();
            this._renderEmptyMessage(rootNodes);
            this._renderItems($container, rootNodes);
            this._fireContentReadyAction();
        }
    },

    _itemContainer: function(isSearchMode) {
        if(this._scrollableContainer && isSearchMode) {
            return $(this._scrollableContainer.content());
        }

        return this.callBase();
    },

    _addWidgetClass: function() {
        this.$element().addClass(this._widgetClass());
    },

    _clean: function() {
        this.callBase();
        this._removeSearchBox();
    }
});

registerComponent('dxTreeView', TreeViewSearch);

module.exports = TreeViewSearch;

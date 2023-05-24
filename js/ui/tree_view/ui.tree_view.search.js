import $ from '../../core/renderer';
import registerComponent from '../../core/component_registrator';
import searchBoxMixin from '../widget/ui.search_box_mixin';
import TextBox from '../text_box';
import { extend } from '../../core/utils/extend';
import TreeViewBase from './ui.tree_view.base';

searchBoxMixin.setEditorClass(TextBox);

// STYLE treeView

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

    _updateDataAdapter: function() {
        this._setOptionWithoutOptionChange('expandNodesRecursive', false);

        this._initDataAdapter();

        this._setOptionWithoutOptionChange('expandNodesRecursive', true);
    },

    _getDataAdapterOptions: function() {
        return extend(this.callBase(), {
            searchValue: this.option('searchValue'),
            searchMode: this.option('searchMode') || 'contains',
            searchExpr: this.option('searchExpr')
        });
    },

    _getNodeContainer: function() {
        return this.$element().find(`.${NODE_CONTAINER_CLASS}`).first();
    },

    _updateSearch: function() {
        if(this._searchEditor) {
            const editorOptions = this._getSearchEditorOptions();
            this._searchEditor.option(editorOptions);
        }
    },

    _repaintContainer: function() {
        const $container = this._getNodeContainer();
        let rootNodes;

        if($container.length) {
            $container.empty();
            rootNodes = this._dataAdapter.getRootNodes();
            this._renderEmptyMessage(rootNodes);
            this._renderItems($container, rootNodes);
            this._fireContentReadyAction();
        }
    },

    _focusTarget: function() {
        return this._itemContainer(this.option('searchEnabled'));
    },

    _cleanItemContainer: function() {
        this.$element().empty();
    },

    _itemContainer: function(isSearchMode) {
        if(this._selectAllEnabled()) {
            return this._getNodeContainer();
        }

        if(this._scrollable && isSearchMode) {
            return $(this._scrollable.content());
        }

        return this.callBase();
    },

    _addWidgetClass: function() {
        this.$element().addClass(this._widgetClass());
    },

    _cleanAria: function() {
        const $element = this.$element();
        this.setAria({
            'role': null,
            'activedescendant': null
        }, $element);
        $element.attr('tabIndex', null);
    },

    _clean: function() {
        this._cleanAria();
        this.callBase();
        this._removeSearchBox();
    }
});

registerComponent('dxTreeView', TreeViewSearch);

export default TreeViewSearch;

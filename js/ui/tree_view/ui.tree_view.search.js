import registerComponent from "../../core/component_registrator";
import searchBoxMixin from "../widget/ui.search_box_mixin";
import { extend } from "../../core/utils/extend";
import TreeViewBase from "./ui.tree_view.base";

const NODE_CONTAINER_CLASS = "dx-treeview-node-container";

class TreeViewSearch extends TreeViewBase.include(searchBoxMixin) {
    _addWidgetPrefix(className) {
        return "dx-treeview-" + className;
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), this._searchBoxMixinDefaultOptions());
    }

    _optionChanged(args) {
        this._searchBoxMixinOptionChanged(args);

        switch(args.name) {
            case "searchValue":
                if(this._showCheckboxes() && this._isRecursiveSelection()) {
                    this._removeSelection();
                }
                this._initDataAdapter();
                this._updateSearch();
                this._repaintContainer();
                break;
            case "searchExpr":
                this._initDataAdapter();
                this.repaint();
                break;
            case "searchMode":
                this.option("expandNodesRecursive") ? this._updateDataAdapter() : this._initDataAdapter();
                this.repaint();
                break;
            default:
                super._optionChanged(args);
        }
    }

    _initMarkup() {
        this._searchBoxMixinInitMarkup();

        super._initMarkup();
    }

    _updateDataAdapter() {
        this._setOptionSilent("expandNodesRecursive", false);

        this._initDataAdapter();

        this._setOptionSilent("expandNodesRecursive", true);
    }

    _getDataAdapterOptions() {
        return extend(super._getDataAdapterOptions(), {
            searchValue: this.option("searchValue"),
            searchMode: this.option("searchMode") || "contains",
            searchExpr: this.option("searchExpr")
        });
    }

    _updateSearch() {
        if(this._searchEditor) {
            var editorOptions = this._getSearchEditorOptions();
            this._searchEditor.option(editorOptions);
        }
    }

    _repaintContainer() {
        var $container = this.$element().find("." + NODE_CONTAINER_CLASS).first(),
            rootNodes;

        if($container.length) {
            $container.empty();
            rootNodes = this._dataAdapter.getRootNodes();
            this._renderEmptyMessage(rootNodes);
            this._renderItems($container, rootNodes);
            this._fireContentReadyAction();
        }
    }

    _focusTarget() {
        if(this.option("searchEnabled")) {
            return this._scrollableContainer.$element();
        }

        return super._focusTarget();
    }

    _getAreaTarget() {
        return this._searchBoxMixinGetAriaTarget();
    }

    _updateFocusState(e, isFocused) {
        this._searchBoxMixinUpdateFocusState(isFocused);

        super._updateFocusState(e, isFocused);
    }

    focus() {
        if(!this.option("focusedElement") && this.option("searchEnabled")) {
            this._searchEditor && this._searchEditor.focus();
            return;
        }

        super.focus();
    }

    _addWidgetClass() {
        this.$element().addClass(this._widgetClass());
    }

    _clean() {
        super._clean();
        this._removeSearchBox();
    }

    _refresh() {
        if(this._valueChangeDeferred) {
            this._valueChangeDeferred.resolve();
        }

        super._refresh();
    }
}

registerComponent("dxTreeView", TreeViewSearch);
module.exports = TreeViewSearch;

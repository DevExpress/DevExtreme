"use strict";

var registerComponent = require("../../core/component_registrator"),
    searchBoxMixin = require("../widget/ui.search_box_mixin"),
    extend = require("../../core/utils/extend").extend,
    TreeViewBase = require("./ui.tree_view.base");

var NODE_CONTAINER_CLASS = "dx-treeview-node-container";

var TreeViewSearch = TreeViewBase.inherit(extend({}, searchBoxMixin, { _dataSourceOptions: function() {} })).inherit({
    _addWidgetPrefix: function(className) {
        return "dx-treeview-" + className;
    },

    _optionChanged: function(args) {
        var name = args.name,
            value = args.value,
            previousValue = args.previousValue;

        switch(name) {
            case "searchValue":
                if((!value.length || (value < previousValue)) && this.option("showCheckBoxesMode") !== "none") {
                    this._removeSelection();
                }

                this._initDataAdapter();
                this._updateSearch();
                this._repaintContainer();
                break;
            case "searchExpr":
            case "searchMode":
                this._initDataAdapter();
                this.repaint();
                break;
            default:
                this.callBase(args);
        }
    },

    _getDataAdapterOptions: function() {
        return extend(this.callBase(), {
            searchValue: this.option("searchValue"),
            searchMode: this.option("searchMode"),
            searchExpr: this.option("searchExpr")
        });
    },

    _updateSearch: function() {
        if(this._searchEditor) {
            var editorOptions = this._getSearchEditorOptions();
            this._searchEditor.option(editorOptions);
        }
    },

    _repaintContainer: function() {
        var $container = this.$element().find("." + NODE_CONTAINER_CLASS).first();

        if($container) {
            $container.empty();
            this._renderItems($container, this._dataAdapter.getRootNodes());
            this._fireContentReadyAction();
        }
    },

    _focusTarget: function() {
        if(this.option("searchEnabled")) {
            return this._scrollableContainer.$element();
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

registerComponent("dxTreeView", TreeViewSearch);

module.exports = TreeViewSearch;

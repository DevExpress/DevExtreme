"use strict";

var $ = require("../../core/renderer"),
    registerComponent = require("../../core/component_registrator"),
    messageLocalization = require("../../localization/message"),
    extend = require("../../core/utils/extend").extend,
    TextBox = require("../text_box"),
    TreeViewBase = require("./ui.tree_view.base");

var NODE_CONTAINER_CLASS = "dx-treeview-node-container",
    TREEVIEW_SEARCH_CLASS = "dx-treeview-search",
    TREEVIEW_WITH_SEARCH_CLASS = "dx-treeview-with-search";


var TreeViewSearch = TreeViewBase.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTreeViewOptions_searchEnabled
            * @publicName searchEnabled
            * @type boolean
            * @default false
            */
            searchEnabled: false,

            /**
            * @name dxTreeViewOptions_searchValue
            * @type String
            * @publicName searchValue
            * @default ""
            */
            searchValue: "",

            /**
            * @name dxTreeViewOptions_searchMode
            * @publicName searchMode
            * @type string
            * @default 'contains'
            * @acceptValues "contains"|"startswith"
            */
            searchMode: "contains",

            /**
            * @name dxTreeViewOptions_searchExpr
            * @publicName searchExpr
            * @type getter|array
            * @default null
            */
            searchExpr: null,

            /**
             * @name dxTreeViewOptions_searchEditorOptions
             * @publicName searchEditorOptions
             * @type dxTextBoxOptions
             * @default {}
             */
            searchEditorOptions: {}
        });
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
            case "searchEnabled":
            case "searchEditorOptions":
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

    _render: function() {
        this._renderSearch();
        this.callBase();
    },

    _renderSearch: function() {
        var that = this,
            editorOptions,
            $element = that.element(),
            searchEnabled = that.option("searchEnabled");

        if(!searchEnabled) {
            $element.removeClass(TREEVIEW_WITH_SEARCH_CLASS);
            that._$searchEditorElement && that._$searchEditorElement.remove();
            delete that._$searchEditorElement;
            delete that._searchEditor;
            return;
        }

        editorOptions = that._getSearchEditorOptions();
        $element.addClass(TREEVIEW_WITH_SEARCH_CLASS);
        that._$searchEditorElement = $("<div>").addClass(TREEVIEW_SEARCH_CLASS).prependTo($element);
        that._searchEditor = that._createComponent(that._$searchEditorElement, TextBox, editorOptions);
    },

    _getSearchEditorOptions: function() {
        var that = this,
            userEditorOptions = that.option("searchEditorOptions");

        return extend({
            mode: "search",
            placeholder: messageLocalization.format("Search"),
            tabIndex: that.option("tabIndex"),
            value: that.option("searchValue"),
            valueChangeEvent: "keyup",
            onValueChanged: function(e) {
                that.option("searchValue", e.value);
            }
        }, userEditorOptions);
    },

    _updateSearch: function() {
        if(this._searchEditor) {
            var editorOptions = this._getSearchEditorOptions();
            this._searchEditor.option(editorOptions);
        }
    },

    _repaintContainer: function() {
        var $container = this.element().find("." + NODE_CONTAINER_CLASS).first();

        if($container) {
            $container.empty();
            this._renderItems($container, this._dataAdapter.getRootNodes());
        }
    },

    _focusTarget: function() {
        if(this.option("searchEnabled")) {
            return this._scrollableContainer.element();
        }

        return this.callBase();
    },

    _getAriaTarget: function() {
        return this.element();
    },

    _addWidgetClass: function() {
        this.element().addClass(this._widgetClass());
    },

    _updateFocusState: function(e, isFocused) {
        if(this.option("searchEnabled")) {
            this._toggleFocusClass(isFocused, this.element());
        }
        this.callBase(e, isFocused);
    },

    focus: function() {
        if(!this.option("focusedElement") && this.option("searchEnabled")) {
            this._searchEditor && this._searchEditor.focus();
            return;
        }

        this.callBase();
    }
});

registerComponent("dxTreeView", TreeViewSearch);

module.exports = TreeViewSearch;

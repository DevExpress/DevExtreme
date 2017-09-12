"use strict";

var $ = require("../../core/renderer"),
    extend = require("../../core/utils/extend").extend,
    ListEdit = require("./ui.list.edit"),
    messageLocalization = require("../../localization/message"),
    TextBox = require("../text_box"),
    errors = require("../widget/ui.errors");

var LIST_SEARCH_CLASS = "dx-list-search",
    LIST_WITH_SEARCH_CLASS = "dx-list-with-search";

/**
* @name dxList
* @publicName dxList
* @type object
* @inherits CollectionWidget
* @groupName Collection Widgets
*/

var ListSearch = ListEdit.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxListOptions_searchMode
            * @publicName searchMode
            * @type string
            * @default 'contains'
            * @acceptValues "contains"|"startswith"
            */
            searchMode: "contains",

            /**
            * @name dxListOptions_searchExpr
            * @publicName searchExpr
            * @type getter|array
            * @default null
            */
            searchExpr: null,

            /**
            * @name dxListOptions_searchValue
            * @type String
            * @publicName searchValue
            * @default ""
            */
            searchValue: "",

            /**
            * @name dxListOptions_searchEnabled
            * @publicName searchEnabled
            * @type boolean
            * @default false
            */
            searchEnabled: false,

            /**
             * @name dxListOptions_searchEditorOptions
             * @publicName searchEditorOptions
             * @type TextBox options
             * @default {}
             */
            searchEditorOptions: {}
        });
    },

    _dataSourceOptions: function() {
        return extend(this.callBase(), {
            searchValue: this.option("searchValue"),
            searchOperation: this.option("searchMode"),
            searchExpr: this.option("searchExpr")
        });
    },

    _render: function() {
        this._renderSearch();
        this.callBase();
    },

    _renderSearch: function() {
        var editorOptions,
            $element = this.element(),
            searchEnabled = this.option("searchEnabled");

        if(!searchEnabled) {
            $element.removeClass(LIST_WITH_SEARCH_CLASS);
            this._$searchEditorElement && this._$searchEditorElement.remove();
            delete this._$searchEditorElement;
            delete this._searchEditor;
            return;
        }

        editorOptions = this._getSearchEditorOptions();

        if(this._searchEditor) {
            this._searchEditor.option(editorOptions);
        } else {
            $element.addClass(LIST_WITH_SEARCH_CLASS);
            this._$searchEditorElement = $("<div>").addClass(LIST_SEARCH_CLASS).prependTo($element);
            this._searchEditor = this._createComponent(this._$searchEditorElement, TextBox, editorOptions);
        }
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

    _getAriaTarget: function() {
        return this.element();
    },

    _focusTarget: function() {
        if(this.option("searchEnabled")) {
            return this._itemContainer();
        }

        return this.callBase();
    },

    _updateFocusState: function(e, isFocused) {
        if(this.option("searchEnabled")) {
            this._toggleFocusClass(isFocused, this.element());
        }
        this.callBase(e, isFocused);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "searchEnabled":
            case "searchEditorOptions":
                this._invalidate();
                break;
            case "searchExpr":
            case "searchMode":
            case "searchValue":
                if(!this._dataSource) {
                    errors.log("W1009");
                    return;
                }
                this._dataSource[args.name === "searchMode" ? "searchOperation" : args.name](args.value);
                this._dataSource.load();
                break;
            default:
                this.callBase(args);
        }
    },

    focus: function() {
        if(!this.option("focusedElement") && this.option("searchEnabled")) {
            this._searchEditor && this._searchEditor.focus();
            return;
        }

        this.callBase();
    }
});

module.exports = ListSearch;

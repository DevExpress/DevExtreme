"use strict";

var $ = require("../../core/renderer"),
    registerComponent = require("../../core/component_registrator"),
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    Widget = require("../widget/ui.widget"),
    treeListCore = require("./ui.tree_list.core"),
    callModuleItemsMethod = treeListCore.callModuleItemsMethod;

var DATAGRID_ROW_SELECTOR = ".dx-row",
    TREELIST_CLASS = "dx-treelist";

require("./ui.tree_list.column_headers");
require("./ui.tree_list.columns_controller");
require("./ui.tree_list.data_controller");
require("./ui.tree_list.sorting");
require("./ui.tree_list.rows");
require("./ui.tree_list.context_menu");
require("./ui.tree_list.error_handling");
require("./ui.tree_list.grid_view");
require("./ui.tree_list.header_panel");

treeListCore.registerModulesOrder([
    "stateStoring",
    "columns",
    "selection",
    "editorFactory",
    "columnChooser",
    "editing",
    "grouping",
    "masterDetail",
    "validating",
    "adaptivity",
    "data",
    "virtualScrolling",
    "columnHeaders",
    "filterRow",
    "headerPanel",
    "headerFilter",
    "sorting",
    "search",
    "rows",
    "pager",
    "columnsResizingReordering",
    "contextMenu",
    "keyboardNavigation",
    "errorHandling",
    "summary",
    "columnFixing",
    "export",
    "gridView"]);

/**
* @name dxTreeListOptions_onContentReady
* @publicName onContentReady
* @extends Action
* @hidden false
* @action
*/

var TreeList = Widget.inherit({
    _activeStateUnit: DATAGRID_ROW_SELECTOR,

    _getDefaultOptions: function() {
        var that = this,
            result = that.callBase();

        $.each(treeListCore.modules, function() {
            if(typeUtils.isFunction(this.defaultOptions)) {
                extend(true, result, this.defaultOptions());
            }
        });
        return result;
    },

    _init: function() {
        var that = this;

        that.callBase();

        treeListCore.processModules(that, treeListCore);

        callModuleItemsMethod(that, "init");
    },

    _clean: commonUtils.noop,

    _optionChanged: function(args) {
        var that = this;

        callModuleItemsMethod(that, "optionChanged", [args]);
        if(!args.handled) {
            that.callBase(args);
        }
    },

    _dimensionChanged: function() {
        this.updateDimensions(true);
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this.updateDimensions();
        }
    },

    _renderContentImpl: function() {
        var $element = this.element().addClass(TREELIST_CLASS);

        this.getView("gridView").render($element);
    },

    _renderContent: function() {
        var that = this;

        commonUtils.deferRender(function() {
            that._renderContentImpl();
        });
    },

    _dispose: function() {
        var that = this;
        that.callBase();

        callModuleItemsMethod(that, "dispose");
    },

    isReady: function() {
        return this.getController("data").isReady();
    },

    beginUpdate: function() {
        var that = this;

        that.callBase();
        callModuleItemsMethod(that, "beginUpdate");
    },

    endUpdate: function() {
        var that = this;

        callModuleItemsMethod(that, "endUpdate");
        that.callBase();
    },

    getController: function(name) {
        return this._controllers[name];
    },

    getView: function(name) {
        return this._views[name];
    },

    focus: function(element) {
        this.callBase();

        if(typeUtils.isDefined(element)) {
            this.getController("keyboardNavigation").focus(element);
        }
    }
});

TreeList.registerModule = treeListCore.registerModule.bind(treeListCore);

registerComponent("dxTreeList", TreeList);

module.exports = TreeList;

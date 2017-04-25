"use strict";

var $ = require("../../core/renderer"),
    registerComponent = require("../../core/component_registrator"),
    commonUtils = require("../../core/utils/common"),
    extend = require("../../core/utils/extend").extend,
    logger = require("../../core/utils/console").logger,
    browser = require("../../core/utils/browser"),
    Widget = require("../widget/ui.widget"),
    gridCore = require("./ui.data_grid.core"),
    callModuleItemsMethod = gridCore.callModuleItemsMethod;

var DATAGRID_ROW_SELECTOR = ".dx-row",
    DATAGRID_DEPRECATED_TEMPLATE_WARNING = "Specifying grid templates with the name of a jQuery selector is now deprecated. Instead, use the jQuery object that references this selector.";

require("./ui.data_grid.column_headers");
require("./ui.data_grid.columns_controller");
require("./ui.data_grid.data_controller");
require("./ui.data_grid.sorting");
require("./ui.data_grid.rows");
require("./ui.data_grid.context_menu");
require("./ui.data_grid.error_handling");
require("./ui.data_grid.grid_view");
require("./ui.data_grid.header_panel");

gridCore.registerModulesOrder([
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
* @name dxDataGridOptions_onContentReady
* @publicName onContentReady
* @extends Action
* @hidden false
* @action
* @extend_doc
*/

var DataGrid = Widget.inherit({
    _activeStateUnit: DATAGRID_ROW_SELECTOR,

    _getDefaultOptions: function() {
        var that = this,
            result = that.callBase();

        $.each(gridCore.modules, function() {
            if(commonUtils.isFunction(this.defaultOptions)) {
                extend(true, result, this.defaultOptions());
            }
        });
        return result;
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            /**
            * @name dxDataGridOptions_editing_editMode
            * @publicName editMode
            * @deprecated GridBaseOptions_editing_mode
            * @extend_doc
            */
            "editing.editMode": { since: "15.2", alias: "editing.mode" },
            /**
            * @name dxDataGridOptions_editing_editEnabled
            * @publicName editEnabled
            * @deprecated GridBaseOptions_editing_allowUpdating
            * @extend_doc
            */
            "editing.editEnabled": { since: "15.2", alias: "editing.allowUpdating" },
            /**
            * @name dxDataGridOptions_editing_insertEnabled
            * @publicName insertEnabled
            * @deprecated GridBaseOptions_editing_allowAdding
            * @extend_doc
            */
            "editing.insertEnabled": { since: "15.2", alias: "editing.allowAdding" },
            /**
            * @name dxDataGridOptions_editing_removeEnabled
            * @publicName removeEnabled
            * @deprecated GridBaseOptions_editing_allowDeleting
            * @extend_doc
            */
            "editing.removeEnabled": { since: "15.2", alias: "editing.allowDeleting" },
            /**
            * @name dxDataGridOptions_grouping_groupContinuedMessage
            * @publicName groupContinuedMessage
            * @deprecated dxDataGridOptions_grouping_texts_groupContinuedMessage
            * @extend_doc
            */
            "grouping.groupContinuedMessage": { since: "16.1", alias: "grouping.texts.groupContinuedMessage" },
            /**
            * @name dxDataGridOptions_grouping_groupContinuesMessage
            * @publicName groupContinuesMessage
            * @deprecated dxDataGridOptions_grouping_texts_groupContinuesMessage
            * @extend_doc
            */
            "grouping.groupContinuesMessage": { since: "16.1", alias: "grouping.texts.groupContinuesMessage" },
            /**
            * @name dxDataGridOptions_export_texts_excelFormat
            * @publicName excelFormat
            * @deprecated dxDataGridOptions_export_texts_exportAll
            * @extend_doc
            */
            "export.texts.excelFormat": { since: "16.1", alias: "export.texts.exportAll" },
            /**
            * @name dxDataGridOptions_export_texts_exportToExcel
            * @publicName exportToExcel
            * @deprecated dxDataGridOptions_export_texts_exportAll
            * @extend_doc
            */
            "export.texts.exportToExcel": { since: "16.1", alias: "export.texts.exportAll" },
            /**
            * @name dxDataGridOptions_export_texts_selectedRows
            * @publicName selectedRows
            * @deprecated dxDataGridOptions_export_texts_exportSelectedRows
            * @extend_doc
            */
            "export.texts.selectedRows": { since: "16.1", alias: "export.texts.exportSelectedRows" },

            "filterRow.operationDescriptions.>": { since: "16.2", alias: "filterRow.operationDescriptions.greaterThan" },
            "filterRow.operationDescriptions.<": { since: "16.2", alias: "filterRow.operationDescriptions.lessThan" },
            "filterRow.operationDescriptions.=": { since: "16.2", alias: "filterRow.operationDescriptions.equal" },
            "filterRow.operationDescriptions.<>": { since: "16.2", alias: "filterRow.operationDescriptions.notEqual" },
            "filterRow.operationDescriptions.<=": { since: "16.2", alias: "filterRow.operationDescriptions.lessThanOrEqual" },
            "filterRow.operationDescriptions.>=": { since: "16.2", alias: "filterRow.operationDescriptions.greaterThanOrEqual" },
            "filterRow.operationDescriptions.startswith": { since: "16.2", alias: "filterRow.operationDescriptions.startsWith" },
            "filterRow.operationDescriptions.notcontains": { since: "16.2", alias: "filterRow.operationDescriptions.notContains" },
            "filterRow.operationDescriptions.endswith": { since: "16.2", alias: "filterRow.operationDescriptions.endsWith" }
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: { platform: "ios" },
                options: {
                    /**
                    * @name GridBaseOptions_showRowLines
                    * @publicName showRowLines
                    * @type boolean
                    * @custom_default_for_ios true
                    */
                    showRowLines: true
                }
            },
            {
                device: function() {
                    return browser.webkit;
                },
                options: {
                    loadingTimeout: 30,
                    loadPanel: {
                        animation: {
                            show: {
                                easing: "cubic-bezier(1, 0, 1, 0)",
                                duration: 500,
                                from: { opacity: 0 },
                                to: { opacity: 1 }
                            }
                        }
                    }
                }
            },
            {
                device: function(device) {
                    return device.deviceType !== "desktop";
                },
                options: {
                    grouping: {
                        expandMode: "rowClick"
                    }
                }
            }
        ]);
    },

    _init: function() {
        var that = this;

        that.callBase();

        gridCore.processModules(that, gridCore);

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
        this.getView("gridView").render(this.element());
    },

    _renderContent: function() {
        var that = this;

        commonUtils.deferRender(function() {
            that._renderContentImpl();
        });
    },

    _getTemplate: function(templateName) {
        var template = templateName;

        if(commonUtils.isString(template) && template[0] === "#") {
            template = $(templateName);
            logger.warn(DATAGRID_DEPRECATED_TEMPLATE_WARNING);
        }

        return this.callBase(template);
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

        if(commonUtils.isDefined(element)) {
            this.getController("keyboardNavigation").focus(element);
        }
    }
});

DataGrid.registerModule = gridCore.registerModule.bind(gridCore);

registerComponent("dxDataGrid", DataGrid);

module.exports = DataGrid;

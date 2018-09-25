var $ = require("../../core/renderer"),
    registerComponent = require("../../core/component_registrator"),
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    each = require("../../core/utils/iterator").each,
    extend = require("../../core/utils/extend").extend,
    logger = require("../../core/utils/console").logger,
    browser = require("../../core/utils/browser"),
    Widget = require("../widget/ui.widget"),
    gridCore = require("./ui.data_grid.core"),
    themes = require("../themes"),
    callModuleItemsMethod = gridCore.callModuleItemsMethod;

var DATAGRID_ROW_SELECTOR = ".dx-row",
    DATAGRID_DEPRECATED_TEMPLATE_WARNING = "Specifying grid templates with the jQuery selector name is now deprecated. Use the DOM Node or the jQuery object that references this selector instead.";

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
    "grouping",
    "editing",
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

var DataGrid = Widget.inherit({
    _activeStateUnit: DATAGRID_ROW_SELECTOR,

    _getDefaultOptions: function() {
        var that = this,
            result = that.callBase();

        each(gridCore.modules, function() {
            if(typeUtils.isFunction(this.defaultOptions)) {
                extend(true, result, this.defaultOptions());
            }
        });
        return result;
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: { platform: "ios" },
                options: {
                    /**
                    * @name GridBaseOptions.showRowLines
                    * @type boolean
                    * @default true @for iOS
                    */
                    showRowLines: true
                }
            },
            {
                device: function() {
                    return themes.isMaterial();
                },
                options: {
                    /**
                    * @name GridBaseOptions.showRowLines
                    * @type boolean
                    * @default true @for Material
                    */
                    showRowLines: true,
                    /**
                    * @name GridBaseOptions.showColumnLines
                    * @type boolean
                    * @default false @for Material
                    */
                    showColumnLines: false,
                    /**
                     * @name GridBaseOptions.headerFilter.height
                     * @type number
                     * @default 315 @for Material
                     */
                    headerFilter: {
                        height: 315
                    },
                    /**
                     * @name GridBaseOptions.editing.useIcons
                     * @type boolean
                     * @default true @for Material
                     */
                    editing: {
                        useIcons: true
                    }
                }
            },
            {
                device: function() {
                    return browser.webkit;
                },
                options: {
                    loadingTimeout: 30, // T344031
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

    _initMarkup: function() {
        this.callBase.apply(this, arguments);
        this.getView("gridView").render(this.$element());
    },

    _renderContentImpl: function() {
        this.getView("gridView").update();
    },

    _renderContent: function() {
        var that = this;

        commonUtils.deferRender(function() {
            that._renderContentImpl();
        });
    },

    _getTemplate: function(templateName) {
        var template = templateName;

        if(typeUtils.isString(template) && template[0] === "#") {
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

        if(typeUtils.isDefined(element)) {
            this.getController("keyboardNavigation").focus(element);
        }
    }
});

DataGrid.registerModule = gridCore.registerModule.bind(gridCore);

registerComponent("dxDataGrid", DataGrid);

module.exports = DataGrid;

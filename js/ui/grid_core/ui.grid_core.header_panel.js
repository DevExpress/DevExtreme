"use strict";

var $ = require("../../core/renderer"),
    Toolbar = require("../toolbar"),
    columnsView = require("./ui.grid_core.columns_view"),
    commonUtils = require("../../core/utils/common"),
    domUtils = require("../../core/utils/dom");

require("../drop_down_menu");
var HEADER_PANEL_CLASS = "header-panel",
    TOOLBAR_BUTTON_CLASS = "toolbar-button";

var HeaderPanel = columnsView.ColumnsView.inherit({
    _getToolbarItems: function() {
        return [];
    },

    _getButtonContainer: function() {
        return $("<div />").addClass(this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS));
    },

    _getToolbarButtonClass: function(specificClass) {
        var secondClass = specificClass ? " " + specificClass : "";

        return this.addWidgetPrefix(TOOLBAR_BUTTON_CLASS) + secondClass;
    },

    _getToolbarOptions: function() {
        var toolbarItems,
            options = {
                toolbarOptions: {
                    items: this._getToolbarItems(),
                    onItemRendered: function(e) {
                        var itemRenderedCallback = e.itemData.onItemRendered;

                        if(itemRenderedCallback) {
                            itemRenderedCallback(e);
                        }
                    }
                }
            };

        this.executeAction("onToolbarPreparing", options);

        if(options.toolbarOptions && !commonUtils.isDefined(options.toolbarOptions.visible)) {
            toolbarItems = options.toolbarOptions.items;
            options.toolbarOptions.visible = !!(toolbarItems && toolbarItems.length);
        }

        return options.toolbarOptions;
    },

    _renderCore: function() {
        if(!this._toolbar) {
            this.element().addClass(this.addWidgetPrefix(HEADER_PANEL_CLASS));
            this._toolbar = this._createComponent($("<div />").appendTo(this.element()), Toolbar, this._toolbarOptions);
        } else {
            this._toolbar.option(this._toolbarOptions);
        }
    },

    _columnOptionChanged: commonUtils.noop,

    init: function() {
        this.callBase();
        this.createAction("onToolbarPreparing", { excludeValidators: ["designMode", "disabled", "readOnly"] });
    },

    render: function() {
        this._toolbarOptions = this._getToolbarOptions();
        this.callBase.apply(this, arguments);
    },

    toolbarWidgetOption: function(name, optionName, optionValue) {
        var toolbarInstance = this._toolbar;

        if(toolbarInstance) {
            var items = toolbarInstance.option("items") || [],
                item = items.filter(function(item) {
                    return item.name === name;
                })[0];

            if(item) {
                var $widget = toolbarInstance._findItemElementByItem(item).children().children(),
                    dxComponents = $widget.data("dxComponents"),
                    widget = dxComponents && dxComponents[0] && $widget.data(dxComponents[0]);

                if(widget) {
                    widget.option(optionName, optionValue);
                }
            }
        }
    },

    getHeaderPanel: function() {
        return this.element();
    },

    getHeight: function() {
        return this.getElementHeight();
    },

    optionChanged: function(args) {
        if(args.name === "onToolbarPreparing") {
            this._invalidate();
            args.handled = true;
        }
        this.callBase(args);
    },

    isVisible: function() {
        return this._toolbarOptions && this._toolbarOptions.visible;
    },

    allowDragging: commonUtils.noop
});

module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions_onToolbarPreparing
             * @publicName onToolbarPreparing
             * @type function(e)
             * @type_function_param1 e:object
             * @type_function_param1_field4 toolbarOptions:Object
             * @extends Action
             * @action
             */
        };
    },
    views: {
        headerPanel: HeaderPanel
    },
    extenders: {
        controllers: {
            resizing: {
                _updateDimensionsCore: function() {
                    this.callBase.apply(this, arguments);

                    var $headerPanelElement = this.getView("headerPanel").element();

                    if($headerPanelElement) {
                        domUtils.triggerResizeEvent($headerPanelElement);
                    }
                }
            }
        }
    }
};

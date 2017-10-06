"use strict";

var $ = require("../../core/renderer"),
    getPublicElement = require("../../core/utils/dom").getPublicElement,
    noop = require("../../core/utils/common").noop,
    each = require("../../core/utils/iterator").each,
    modules = require("./ui.grid_core.modules"),
    ContextMenu = require("../context_menu");

var CONTEXT_MENU = "dx-context-menu",

    viewName = {
        "columnHeadersView": "header",
        "rowsView": "content",
        "footerView": "footer",
        "headerPanel": "headerPanel"
    },
    VIEW_NAMES = ["columnHeadersView", "rowsView", "footerView", "headerPanel"];

var ContextMenuController = modules.ViewController.inherit({
    init: function() {
        this.createAction("onContextMenuPreparing");
    },

    getContextMenuItems: function(jQueryEvent) {
        if(!jQueryEvent) {
            return false;
        }

        var that = this,
            $targetElement = $(jQueryEvent.target),
            view,
            options,
            rowIndex,
            columnIndex,
            rowOptions,
            $element,
            $targetRowElement,
            $targetCellElement,
            menuItems;

        each(VIEW_NAMES, function() {
            view = that.getView(this);
            $element = view && view.element();

            if($element && ($element.is($targetElement) || $element.find($targetElement).length)) {
                $targetCellElement = $targetElement.closest("td");
                $targetRowElement = $targetCellElement.closest(".dx-row");
                rowIndex = view.getRowIndex($targetRowElement);
                columnIndex = $targetCellElement[0] && $targetCellElement[0].cellIndex;
                rowOptions = $targetRowElement.data("options");
                options = {
                    jQueryEvent: jQueryEvent,
                    targetElement: getPublicElement($targetElement),
                    target: viewName[this],
                    rowIndex: rowIndex,
                    row: view._getRows()[rowIndex],
                    columnIndex: columnIndex,
                    column: rowOptions && rowOptions.cells[columnIndex].column
                };

                options.items = view.getContextMenuItems && view.getContextMenuItems(options);

                that.executeAction("onContextMenuPreparing", options);
                that._contextMenuPrepared(options);
                menuItems = options.items;

                if(menuItems) {
                    return false;
                }
            }
        });

        return menuItems;
    },
    _contextMenuPrepared: noop
});

var ContextMenuView = modules.View.inherit({
    _renderCore: function() {
        var that = this;

        this._createComponent(that.element().addClass(CONTEXT_MENU),
            ContextMenu, {
                onPositioning: function(actionArgs) {
                    var event = actionArgs.jQueryEvent,
                        contextMenuInstance = actionArgs.component,
                        items = that.getController("contextMenu").getContextMenuItems(event);

                    if(items) {
                        contextMenuInstance.option("items", items);
                        event.stopPropagation();
                    } else {
                        actionArgs.cancel = true;
                    }
                },
                onItemClick: function(params) {
                    params.itemData.onItemClick && params.itemData.onItemClick(params);
                },

                cssClass: that.getWidgetContainerClass(),
                target: that.component.$element()
            });
    }
});

module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name dxDataGridOptions_onContextMenuPreparing
             * @publicName onContextMenuPreparing
             * @type function(e)
             * @type_function_param1 e:Object
             * @type_function_param1_field4 items:Array<Object>
             * @type_function_param1_field5 target:string
             * @type_function_param1_field6 targetElement:jQuery
             * @type_function_param1_field7 columnIndex:number
             * @type_function_param1_field8 column:Object
             * @type_function_param1_field9 rowIndex:number
             * @type_function_param1_field10 row:dxDataGridRowObject
             * @extends Action
             * @action
             */
            /**
             * @name dxTreeListOptions_onContextMenuPreparing
             * @publicName onContextMenuPreparing
             * @type function(e)
             * @type_function_param1 e:Object
             * @type_function_param1_field4 items:Array<Object>
             * @type_function_param1_field5 target:string
             * @type_function_param1_field6 targetElement:jQuery
             * @type_function_param1_field7 columnIndex:number
             * @type_function_param1_field8 column:Object
             * @type_function_param1_field9 rowIndex:number
             * @type_function_param1_field10 row:dxTreeListRowObject
             * @extends Action
             * @action
             */
            onContextMenuPreparing: null
        };
    },
    controllers: {
        contextMenu: ContextMenuController
    },
    views: {
        contextMenuView: ContextMenuView
    }
};

import $ from '../../core/renderer';
import { getPublicElement } from '../../core/utils/dom';
import { noop } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import modules from './ui.grid_core.modules';
import ContextMenu from '../context_menu';

var CONTEXT_MENU = 'dx-context-menu',

    viewName = {
        'columnHeadersView': 'header',
        'rowsView': 'content',
        'footerView': 'footer',
        'headerPanel': 'headerPanel'
    },
    VIEW_NAMES = ['columnHeadersView', 'rowsView', 'footerView', 'headerPanel'];

var ContextMenuController = modules.ViewController.inherit({
    init: function() {
        this.createAction('onContextMenuPreparing');
    },

    getContextMenuItems: function(dxEvent) {
        if(!dxEvent) {
            return false;
        }

        var that = this,
            $targetElement = $(dxEvent.target),
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
                $targetCellElement = $targetElement.closest('.dx-row > td, .dx-row > tr');
                $targetRowElement = $targetCellElement.parent();
                rowIndex = view.getRowIndex($targetRowElement);
                columnIndex = $targetCellElement[0] && $targetCellElement[0].cellIndex;
                rowOptions = $targetRowElement.data('options');
                options = {
                    event: dxEvent,
                    targetElement: getPublicElement($targetElement),
                    target: viewName[this],
                    rowIndex: rowIndex,
                    row: view._getRows()[rowIndex],
                    columnIndex: columnIndex,
                    column: rowOptions && rowOptions.cells[columnIndex].column
                };

                options.items = view.getContextMenuItems && view.getContextMenuItems(options);

                that.executeAction('onContextMenuPreparing', options);
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
        var that = this,
            $element = that.element().addClass(CONTEXT_MENU);

        this.setAria('role', 'presentation', $element);

        this._createComponent($element,
            ContextMenu, {
                onPositioning: function(actionArgs) {
                    var event = actionArgs.event,
                        contextMenuInstance = actionArgs.component,
                        items = that.getController('contextMenu').getContextMenuItems(event);

                    if(items) {
                        contextMenuInstance.option('items', items);
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
             * @name dxDataGridOptions.onContextMenuPreparing
             * @type function(e)
             * @type_function_param1 e:Object
             * @type_function_param1_field4 items:Array<Object>
             * @type_function_param1_field5 target:string
             * @type_function_param1_field6 targetElement:dxElement
             * @type_function_param1_field7 columnIndex:number
             * @type_function_param1_field8 column:dxDataGridColumn
             * @type_function_param1_field9 rowIndex:number
             * @type_function_param1_field10 row:dxDataGridRowObject
             * @extends Action
             * @action
             */
            /**
             * @name dxTreeListOptions.onContextMenuPreparing
             * @type function(e)
             * @type_function_param1 e:Object
             * @type_function_param1_field4 items:Array<Object>
             * @type_function_param1_field5 target:string
             * @type_function_param1_field6 targetElement:dxElement
             * @type_function_param1_field7 columnIndex:number
             * @type_function_param1_field8 column:dxTreeListColumn
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

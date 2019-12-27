import $ from '../../core/renderer';
import { getPublicElement } from '../../core/utils/dom';
import { noop } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import modules from './ui.grid_core.modules';
import ContextMenu from '../context_menu';

const CONTEXT_MENU = 'dx-context-menu';

const viewName = {
    'columnHeadersView': 'header',
    'rowsView': 'content',
    'footerView': 'footer',
    'headerPanel': 'headerPanel'
};
const VIEW_NAMES = ['columnHeadersView', 'rowsView', 'footerView', 'headerPanel'];

const ContextMenuController = modules.ViewController.inherit({
    init: function() {
        this.createAction('onContextMenuPreparing');
    },

    getContextMenuItems: function(dxEvent) {
        if(!dxEvent) {
            return false;
        }

        const that = this;
        const $targetElement = $(dxEvent.target);
        let view;
        let options;
        let rowIndex;
        let columnIndex;
        let rowOptions;
        let $element;
        let $targetRowElement;
        let $targetCellElement;
        let menuItems;

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

const ContextMenuView = modules.View.inherit({
    _renderCore: function() {
        const that = this;
        const $element = that.element().addClass(CONTEXT_MENU);

        this.setAria('role', 'presentation', $element);

        this._createComponent($element,
            ContextMenu, {
                onPositioning: function(actionArgs) {
                    const event = actionArgs.event;
                    const contextMenuInstance = actionArgs.component;
                    const items = that.getController('contextMenu').getContextMenuItems(event);

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

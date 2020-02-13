import $ from '../../core/renderer';
import { getImageContainer } from '../../core/utils/icon';

const DIAGRAM_CONTEXT_MENU_CLASS = 'dx-diagram-contextmenu';

const DiagramMenuHelper = {
    getContextMenuItemTemplate(itemData, itemIndex, itemElement, menuHasCheckedItems) {
        const itemKey = itemData.rootCommand !== undefined ? itemData.rootCommand : -1;
        if(itemData.icon && !itemData.checked) {
            const $iconElement = getImageContainer(itemData.icon);
            itemElement.append($iconElement);
        } else if(menuHasCheckedItems && menuHasCheckedItems[itemKey] === true) {
            const $checkElement = getImageContainer('check');
            $checkElement.css('visibility', !itemData.checked ? 'hidden' : '');
            itemElement.append($checkElement);
        }
        itemElement.append('<span class="dx-menu-item-text">' + itemData.text + '</span>');
        if(Array.isArray(itemData.items) && itemData.items.length > 0) {
            const $popoutElement = $('<span class="dx-menu-item-popout-container"><div class="dx-menu-item-popout"></div></span>');
            itemElement.append($popoutElement);
        }
    },
    getContextMenuCssClass() {
        return DIAGRAM_CONTEXT_MENU_CLASS;
    },
    onContextMenuItemClick(itemData, actionHandler) {
        if(itemData.command !== undefined && (!Array.isArray(itemData.items) || !itemData.items.length)) {
            const parameter = DiagramMenuHelper.getItemCommandParameter(itemData);
            actionHandler.call(this, itemData.command, parameter, itemData.onExecuted);
        } else if(itemData.rootCommand !== undefined && itemData.value !== undefined) {
            const parameter = DiagramMenuHelper.getItemCommandParameter(itemData, itemData.value);
            actionHandler.call(this, itemData.rootCommand, parameter, itemData.onExecuted);
        } else if(itemData.onExecuted) {
            actionHandler.call(this, itemData.command, undefined, itemData.onExecuted);
        }
    },
    getItemValue(item) {
        return (typeof item.value === 'object') ? JSON.stringify(item.value) : item.value;
    },
    getItemOptionText(indexPath) {
        return indexPath.reduce((r, i) => {
            return r + `items[${i}].`;
        }, '');
    },
    getItemCommandParameter(item, value) {
        if(item.getParameter) {
            return item.getParameter(this);
        }
        return value;
    }
};

module.exports = DiagramMenuHelper;

import $ from '../../core/renderer';
import { getImageContainer } from '../../core/utils/icon';

const DIAGRAM_CONTEXT_MENU_CLASS = 'dx-diagram-contextmenu';

const DiagramContextMenuHelper = {
    getItemTemplate(itemData, itemIndex, itemElement, menuHasCheckedItems) {
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
    getCssClass() {
        return DIAGRAM_CONTEXT_MENU_CLASS;
    }
};

module.exports = DiagramContextMenuHelper;

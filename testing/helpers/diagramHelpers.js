import $ from 'jquery';

export const Consts = {
    SIMPLE_DIAGRAM: '{ "shapes": [{ "key":"107", "type":"Ellipsis", "text":"A new ticket", "x":1440, "y":1080, "width":1440, "height":720, "zIndex":0 }] }',

    MAIN_TOOLBAR_SELECTOR: '.dx-diagram-toolbar-wrapper > .dx-diagram-toolbar',
    FLOATING_TOOLBAR_SELECTOR: '.dx-diagram-floating-toolbar-container > .dx-diagram-toolbar',
    CONTEXT_MENU_SELECTOR: 'div:not(.dx-diagram-toolbar-wrapper):not(.dx-diagram-floating-toolbar-container) > .dx-has-context-menu',
    TOOLBAR_ITEM_ACTIVE_CLASS: 'dx-format-active',
    DX_MENU_ITEM_SELECTOR: '.dx-menu-item',
    PROPERTIES_PANEL_BTN_SELECTOR: '.dx-diagram-properties-panel-btn',
    PROPERTIES_PANEL_SELECTOR: '.dx-diagram-properties-panel',
    PROPERTIES_PANEL_TOOLBAR_SELECTOR: '.dx-diagram-properties-panel .dx-diagram-toolbar',
    TOOLBOX_SCROLLVIEW_SELECTOR: '.dx-diagram-toolbox-panel .dx-scrollview',
    TOOLBOX_ACCORDION_SELECTOR: '.dx-diagram-toolbox-panel .dx-accordion',
    FULLSCREEN_CLASS: 'dx-diagram-fullscreen'
};

export function getMainToolbarInstance($diagramElement) {
    return $diagramElement.find(Consts.MAIN_TOOLBAR_SELECTOR).dxToolbar('instance');
}
export function getHistoryToolbarInstance($diagramElement) {
    return $($diagramElement.find(Consts.FLOATING_TOOLBAR_SELECTOR).get(0)).dxToolbar('instance');
}
export function getViewToolbarInstance($diagramElement) {
    return $($diagramElement.find(Consts.FLOATING_TOOLBAR_SELECTOR).get(1)).dxToolbar('instance');
}
export function findToolbarItem($diagramElement, label) {
    return $diagramElement.find(Consts.MAIN_TOOLBAR_SELECTOR)
        .find('.dx-widget')
        .filter(function() {
            return $(this).text().toLowerCase().indexOf(label) >= 0;
        });
}
export function findViewToolbarItem($diagramElement, label) {
    return $($diagramElement.find(Consts.FLOATING_TOOLBAR_SELECTOR).get(1))
        .find('.dx-widget')
        .filter(function() {
            return $(this).text().toLowerCase().indexOf(label) >= 0;
        });
}
export function getToolbarIcon($button) {
    return $button.find('.dx-dropdowneditor-field-template-wrapper').find('.dx-diagram-i, .dx-icon');
}

export function getContextMenuInstance($diagramElement) {
    return $diagramElement.find(Consts.CONTEXT_MENU_SELECTOR).dxContextMenu('instance');
}
export function findContextMenuItem($diagramElement, label) {
    return $('body').find('.dx-diagram-contextmenu, .dx-diagram-touchbar')
        .find(Consts.DX_MENU_ITEM_SELECTOR)
        .filter(function() {
            return $(this).text().toLowerCase().indexOf(label) >= 0;
        });
}


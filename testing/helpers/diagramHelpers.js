import $ from 'jquery';
import { DiagramContextMenu } from 'ui/diagram/ui.diagram.context_menu.js';

export const Consts = {
    SIMPLE_DIAGRAM: '{ "shapes": [{ "key":"107", "type":"Ellipsis", "text":"A new ticket", "x":1440, "y":1080, "width":1440, "height":720, "zIndex":0 }] }',
    SIMPLE_DIAGRAM_WITH_CONTAINER: '{"connectors":[],"shapes":[{"key":"1", "type":"verticalContainer", "text":"ASP.NET Team","x":1080,"y":1440,"width":2160,"height":5760,"childKeys":["5"]},{"key":"5","type":"rectangle","text":"Laurence Lebihan","x":1440,"y":2160,"width":1440,"height":1080}]}',

    MAIN_TOOLBAR_SELECTOR: '.dx-diagram-toolbar-wrapper > .dx-diagram-toolbar',
    FLOATING_TOOLBAR_SELECTOR: '.dx-diagram-floating-toolbar-container > .dx-diagram-toolbar',
    CONTEXT_MENU_SELECTOR: 'div:not(.dx-diagram-toolbar-wrapper):not(.dx-diagram-floating-toolbar-container) > .dx-has-context-menu',
    CONTEXT_TOOLBOX_SELECTOR: '.dx-diagram-context-toolbox',
    CONTEXT_TOOLBOX_CONTENT_SELECTOR: '.dx-diagram-context-toolbox-content',
    TOOLBAR_ITEM_ACTIVE_CLASS: 'dx-format-active',
    DX_MENU_ITEM_SELECTOR: '.dx-menu-item',
    PROPERTIES_PANEL_SELECTOR: '.dx-diagram-properties-panel',
    PROPERTIES_PANEL_TOOLBAR_SELECTOR: '.dx-diagram-properties-panel .dx-diagram-properties-panel-group-toolbar',
    TOOLBOX_INPUT_CONTAINER_SELECTOR: '.dx-diagram-toolbox-input-container',
    TOOLBOX_SCROLLVIEW_SELECTOR: '.dx-diagram-toolbox-panel .dx-scrollview',
    TOOLBOX_ACCORDION_SELECTOR: '.dx-diagram-toolbox-panel .dx-accordion',
    FULLSCREEN_CLASS: 'dx-diagram-fullscreen'
};

export function getMainToolbarElement($diagramElement) {
    return $diagramElement.find(Consts.MAIN_TOOLBAR_SELECTOR);
}
export function getMainToolbarInstance($diagramElement) {
    return getMainToolbarElement($diagramElement).dxToolbar('instance');
}
export function getHistoryToolbarElement($diagramElement) {
    return $($diagramElement.find(Consts.FLOATING_TOOLBAR_SELECTOR).get(0));
}
export function getHistoryToolbarInstance($diagramElement) {
    return getHistoryToolbarElement($diagramElement).dxToolbar('instance');
}
export function getViewToolbarElement($diagramElement) {
    return $($diagramElement.find(Consts.FLOATING_TOOLBAR_SELECTOR).get(2));
}
export function getViewToolbarInstance($diagramElement) {
    return getViewToolbarElement($diagramElement).dxToolbar('instance');
}
export function getPropertiesToolbarElement($diagramElement) {
    return $($diagramElement.find(Consts.FLOATING_TOOLBAR_SELECTOR).get(1));
}
export function getPropertiesToolbarInstance($diagramElement) {
    return getPropertiesToolbarElement($diagramElement).dxToolbar('instance');
}
export function findMainToolbarItem($diagramElement, label) {
    return $diagramElement.find(Consts.MAIN_TOOLBAR_SELECTOR)
        .find('.dx-widget')
        .filter(function() {
            return $(this).text().toLowerCase().indexOf(label) >= 0;
        });
}
export function findHistoryToolbarItem($diagramElement, label) {
    return getHistoryToolbarElement($diagramElement)
        .find('.dx-widget')
        .filter(function() {
            return $(this).text().toLowerCase().indexOf(label) >= 0;
        });
}
export function findViewToolbarItem($diagramElement, label) {
    return getViewToolbarElement($diagramElement)
        .find('.dx-widget')
        .filter(function() {
            return $(this).text().toLowerCase().indexOf(label) >= 0;
        });
}
export function findPropertiesToolbarItem($diagramElement, label) {
    return getPropertiesToolbarElement($diagramElement)
        .find('.dx-widget')
        .filter(function() {
            return $(this).text().toLowerCase().indexOf(label) >= 0;
        });
}
export function findPropertiesPanelToolbarItem($diagramElement, label) {
    return $('body').find(Consts.PROPERTIES_PANEL_TOOLBAR_SELECTOR)
        .find('.dx-widget')
        .filter(function() {
            return $(this).text().toLowerCase().indexOf(label) >= 0;
        });
}
export function getToolbarIcon($button) {
    return $button.find('.dx-dropdowneditor-field-template-wrapper').find('.dx-diagram-i, .dx-icon');
}
export function getContextMenuItemCheck($button) {
    return $button.find('.dx-icon-check');
}

export function getContextMenuElement($diagramElement) {
    return $diagramElement.find(Consts.CONTEXT_MENU_SELECTOR);
}
export function getContextMenuInstance($diagramElement) {
    return DiagramContextMenu.getInstance(getContextMenuElement($diagramElement));
}
export function findContextMenuItem($diagramElement, label) {
    return $('body').find('.dx-diagram-contextmenu, .dx-diagram-touchbar')
        .find(Consts.DX_MENU_ITEM_SELECTOR)
        .filter(function() {
            return $(this).text().toLowerCase().indexOf(label) >= 0;
        });
}


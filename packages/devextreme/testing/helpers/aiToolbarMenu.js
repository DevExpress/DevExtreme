import $ from 'jquery';

const TOOLBAR_FORMAT_WIDGET_CLASS = 'dx-htmleditor-toolbar-format';
const MENU_CLASS = 'dx-menu';
const MENU_ITEM_CLASS = 'dx-menu-item';

export const getMenuItems = ($element) => {
    const $menu = $element.find(`.${MENU_CLASS}`);
    const menuInstance = $menu.dxMenu('instance');
    return menuInstance.option('dataSource')[0].items;
};

export const openAIToolbarMenu = ($element) => {
    const $toolbarItem = $element.find(`.${TOOLBAR_FORMAT_WIDGET_CLASS} .${MENU_ITEM_CLASS}`);
    $toolbarItem.trigger('dxclick');
};

export const openAIDialog = ($element) => {
    openAIToolbarMenu($element);

    const $menuItem = $(`.${MENU_ITEM_CLASS}`).last();
    $menuItem.trigger('dxclick');
};

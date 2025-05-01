import $ from 'jquery';

const TOOLBAR_FORMAT_WIDGET_CLASS = 'dx-htmleditor-toolbar-format';
const MENU_CLASS = 'dx-menu';
const MENU_ITEM_CLASS = 'dx-menu-item';
const SUBMENU_CLASS = 'dx-submenu';

export const defaultAITranslateOptions = [
    'Arabic',
    'Chinese',
    'English',
    'French',
    'German',
    'Japanese',
    'Spanish'
];

export const defaultAIChangeToneOptions = [
    'Professional',
    'Casual',
    'Straightforward',
    'Confident',
    'Friendly'
];

export const defaultAIChangeStyleOptions = [
    'Formal',
    'Informal',
    'Technical',
    'Business',
    'Creative',
    'Journalistic',
    'Academic',
    'Persuasive',
    'Narrative',
    'Expository',
    'Descriptive',
    'Conversational'
];

export const defaultAICommands = [
    'summarize',
    'proofread',
    'expand',
    'shorten',
    'changeStyle',
    'changeTone',
    'translate',
    'askAI'
];

export const defaultAIOptions = {
    translate: defaultAITranslateOptions,
    changeTone: defaultAIChangeToneOptions,
    changeStyle: defaultAIChangeStyleOptions,
};

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

    const $subMenuItem = $(`.${SUBMENU_CLASS}`);

    if($subMenuItem.length) {
        $subMenuItem.trigger('dxclick');

        const $options = $subMenuItem.find(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`);
        $options.trigger('dxclick');
    }
};

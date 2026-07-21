export const TOOLBAR_CLASS = 'dx-toolbar';
export const TOOLBAR_FOCUS_MODE_CLASS = 'dx-toolbar-focus-mode';

export const DROP_DOWN_MENU_BUTTON_CLASS = 'dx-dropdownmenu-button';

export const MENU_CLASS = 'dx-menu';
export const MENU_ITEM_CLASS = 'dx-menu-item';
export const MENU_ITEM_EXPANDED_CLASS = 'dx-menu-item-expanded';
export const TOOLBAR_SEPARATOR_CLASS = 'dx-toolbar-separator';

export const TOOLBAR_ITEMS = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxDateRangeBox', 'dxMenu', 'dxSelectBox', 'dxSwitch', 'dxTabs', 'dxNumberBox', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'] as const;
export const TOOLBAR_COMPONENTS_SELECTOR = TOOLBAR_ITEMS.map((w) => w.toLowerCase().replace('dx', '.dx-')).join(',');
export const NATIVE_FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]';

export const TEXTEDITOR_CLASS = 'dx-texteditor';
export const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

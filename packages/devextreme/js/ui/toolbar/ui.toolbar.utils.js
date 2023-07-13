import $ from '../../core/renderer';

const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const TOOLBAR_ITEMS = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];


const getItemInstance = function($element) {
    const itemData = $element.data && $element.data();
    const dxComponents = itemData && itemData.dxComponents;
    const widgetName = dxComponents && dxComponents[0];

    return widgetName && itemData[widgetName];
};

export function toggleItemFocusableElementTabIndex(context, item) {
    if(!context) return;

    const $item = context._findItemElementByItem(item);
    if(!$item.length) {
        return;
    }

    const itemData = context._getItemData($item);
    const isItemNotFocusable = !!(itemData.options?.disabled || itemData.disabled || context.option('disabled'));

    const { widget } = itemData;

    if(widget && TOOLBAR_ITEMS.indexOf(widget) !== -1) {
        const $widget = $item.find(widget.toLowerCase().replace('dx', '.dx-'));
        if($widget.length) {
            const itemInstance = getItemInstance($widget);

            if(!itemInstance) {
                return;
            }

            let $focusTarget = itemInstance._focusTarget?.();

            if(widget === 'dxDropDownButton') {
                $focusTarget = $focusTarget && $focusTarget.find(`.${BUTTON_GROUP_CLASS}`);
            } else {
                $focusTarget = $focusTarget ?? $(itemInstance.element());
            }

            const tabIndex = itemData.options?.tabIndex;
            if(isItemNotFocusable) {
                $focusTarget.attr('tabIndex', -1);
            } else {
                $focusTarget.attr('tabIndex', tabIndex ?? 0);
            }
        }
    }
}

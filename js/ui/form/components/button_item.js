import $ from '../../../core/renderer';
import { isDefined } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';

const FIELD_BUTTON_ITEM_CLASS = 'dx-field-button-item';

export function renderButtonItem({
    item,
    $parent,
    itemRootElementCssClasses,
    validationGroup,
    createComponentCallback
}) {
    const $container_1 = $('<div>')
        .appendTo($parent)
        .addClass(itemRootElementCssClasses)
        .addClass(FIELD_BUTTON_ITEM_CLASS)
        .css('textAlign', convertAlignmentToTextAlign(item.horizontalAlignment));

    // TODO: try to avoid changes in $container.parent() and adjust the created $elements only
    $parent.css('justifyContent', convertAlignmentToJustifyContent(item.verticalAlignment));

    const $button = $('<div>')
        .appendTo($container_1);

    return {
        $itemRootElement: $container_1,
        buttonInstance: createComponentCallback(
            $button, 'dxButton',
            extend({ validationGroup }, item.buttonOptions))
    };
}

function convertAlignmentToTextAlign(horizontalAlignment) {
    return isDefined(horizontalAlignment) ? horizontalAlignment : 'right';
}

function convertAlignmentToJustifyContent(verticalAlignment) {
    switch(verticalAlignment) {
        case 'center':
            return 'center';
        case 'bottom':
            return 'flex-end';
        default:
            return 'flex-start';
    }
}

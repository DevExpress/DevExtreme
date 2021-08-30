export const FIELD_EMPTY_ITEM_CLASS = 'dx-field-empty-item';

export function renderEmptyItemTo({
    $container,
}) {
    return $container
        .addClass(FIELD_EMPTY_ITEM_CLASS)
        .html('&nbsp;');
}

import {
    FIELD_EMPTY_ITEM_CLASS,
} from '../constants';

export function renderEmptyItem({
    $container,
}) {
    return $container
        .addClass(FIELD_EMPTY_ITEM_CLASS)
        .html('&nbsp;');
}

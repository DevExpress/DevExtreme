import pointerEvents from 'common/core/events/pointer';

export const triggerCellClick = ($cell, singleSelection) => {
    $cell
        .trigger(pointerEvents.down)
        .trigger('dxclick');

    if(!singleSelection) {
        $cell.trigger(pointerEvents.up);
    }
};

import pointerEvents from 'events/pointer';

export const triggerCellClick = ($cell, singleSelection) => {
    $cell
        .trigger(pointerEvents.down)
        .trigger('dxclick');

    if(!singleSelection) {
        $cell.trigger(pointerEvents.up);
    }
};

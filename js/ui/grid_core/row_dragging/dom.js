import $ from '../../../core/renderer';
import gridCoreUtils from '../ui.grid_core.utils';
import { ATTRIBUTES, CLASSES } from './const';

const createHandleTemplateFunc = (addWidgetPrefix) => (container, options) => {
    const $container = $(container);
    $container.attr(ATTRIBUTES.dragCell, '');
    if(options.rowType === 'data') {
        $container.addClass(CLASSES.cellFocusDisabled);
        return $('<span>').addClass(addWidgetPrefix(CLASSES.handleIcon));
    } else {
        gridCoreUtils.setEmptyText($container);
    }
};

export const GridCoreRowDraggingDom = {
    createHandleTemplateFunc,
};

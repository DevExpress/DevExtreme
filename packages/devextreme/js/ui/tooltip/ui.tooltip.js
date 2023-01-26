import $ from '../../core/renderer';
import Tooltip from './tooltip';
import { extend } from '../../core/utils/extend';
import { Deferred } from '../../core/utils/deferred';
import { value as viewPort } from '../../core/utils/view_port';

let tooltip = null;
let removeTooltipElement = null;

const createTooltip = function(options) {
    options = extend({ position: 'top' }, options);

    const content = options.content;
    delete options.content;

    const $tooltip = $('<div>')
        .html(content)
        .appendTo(viewPort());

    removeTooltipElement = function() {
        $tooltip.remove();
    };

    tooltip = new Tooltip($tooltip, options);
};

const removeTooltip = function() {
    if(!tooltip) {
        return;
    }

    removeTooltipElement();
    tooltip = null;
};

export function show(options) {
    removeTooltip();
    createTooltip(options);
    return tooltip.show();
}

export function hide() {
    if(!tooltip) {
        return new Deferred().resolve();
    }

    return tooltip.hide()
        .done(removeTooltip)
        .promise();
}

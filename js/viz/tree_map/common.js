import { patchFontOptions as _patchFontOptions } from '../core/utils';

export function buildRectAppearance(option) {
    const border = option.border || {};
    return { fill: option.color, opacity: option.opacity, 'stroke': border.color, 'stroke-width': border.width, 'stroke-opacity': border.opacity, hatching: option.hatching };
}

export function buildTextAppearance(options, filter) {
    return {
        attr: { filter },
        css: _patchFontOptions(options.font)
    };
}

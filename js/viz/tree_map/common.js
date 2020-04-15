const _patchFontOptions = require('../core/utils').patchFontOptions;

exports.buildRectAppearance = function(option) {
    const border = option.border || {};
    return { fill: option.color, opacity: option.opacity, 'stroke': border.color, 'stroke-width': border.width, 'stroke-opacity': border.opacity, hatching: option.hatching };
};

exports.buildTextAppearance = function(options, filter) {
    return {
        attr: { filter },
        css: _patchFontOptions(options.font)
    };
};

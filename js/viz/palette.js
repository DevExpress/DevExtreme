"use strict";

var vizUtils = require("./core/utils"),
    _floor = Math.floor,
    _ceil = Math.ceil,
    _Color = require("../color"),
    extend = require("../core/utils/extend").extend,
    _isArray = Array.isArray,
    _isString = require("../core/utils/type").isString,
    _extend = extend,
    _normalizeEnum = vizUtils.normalizeEnum,
    HIGHLIGHTING_STEP = 50,
    DEFAULT = "default",
    currentPaletteName = DEFAULT;

var palettes = {
    "default": {
        simpleSet: ["#5f8b95", "#ba4d51", "#af8a53", "#955f71", "#859666", "#7e688c"],
        indicatingSet: ["#a3b97c", "#e1b676", "#ec7f83"],
        gradientSet: ["#5f8b95", "#ba4d51"]
    },
    "harmony light": {
        simpleSet: ["#fcb65e", "#679ec5", "#ad79ce", "#7abd5c", "#e18e92", "#b6d623", "#b7abea", "#85dbd5"],
        indicatingSet: ["#b6d623", "#fcb65e", "#e18e92"],
        gradientSet: ["#7abd5c", "#fcb65e"]
    },
    "soft pastel": {
        simpleSet: ["#60a69f", "#78b6d9", "#6682bb", "#a37182", "#eeba69", "#90ba58", "#456c68", "#7565a4"],
        indicatingSet: ["#90ba58", "#eeba69", "#a37182"],
        gradientSet: ["#78b6d9", "#eeba69"]
    },

    "pastel": {
        simpleSet: ["#bb7862", "#70b3a1", "#bb626a", "#057d85", "#ab394b", "#dac599", "#153459", "#b1d2c6"],
        indicatingSet: ["#70b3a1", "#dac599", "#bb626a"],
        gradientSet: ["#bb7862", "#70b3a1"]
    },
    "bright": {
        simpleSet: ["#70c92f", "#f8ca00", "#bd1550", "#e97f02", "#9d419c", "#7e4452", "#9ab57e", "#36a3a6"],
        indicatingSet: ["#70c92f", "#f8ca00", "#bd1550"],
        gradientSet: ["#e97f02", "#f8ca00"]
    },
    "soft": {
        simpleSet: ["#cbc87b", "#9ab57e", "#e55253", "#7e4452", "#e8c267", "#565077", "#6babac", "#ad6082"],
        indicatingSet: ["#9ab57e", "#e8c267", "#e55253"],
        gradientSet: ["#9ab57e", "#e8c267"]
    },
    "ocean": {
        simpleSet: ["#75c099", "#acc371", "#378a8a", "#5fa26a", "#064970", "#38c5d2", "#00a7c6", "#6f84bb"],
        indicatingSet: ["#c8e394", "#7bc59d", "#397c8b"],
        gradientSet: ["#acc371", "#38c5d2"]
    },
    "vintage": {
        simpleSet: ["#dea484", "#efc59c", "#cb715e", "#eb9692", "#a85c4c", "#f2c0b5", "#c96374", "#dd956c"],
        indicatingSet: ["#ffe5c6", "#f4bb9d", "#e57660"],
        gradientSet: ["#efc59c", "#cb715e"]
    },
    "violet": {
        simpleSet: ["#d1a1d1", "#eeacc5", "#7b5685", "#7e7cad", "#a13d73", "#5b41ab", "#e287e2", "#689cc1"],
        indicatingSet: ["#d8e2f6", "#d0b2da", "#d56a8a"],
        gradientSet: ["#eeacc5", "#7b5685"]
    }
};

function currentPalette(name) {
    if(name === undefined) {
        return currentPaletteName;
    } else {
        name = _normalizeEnum(name);
        currentPaletteName = name in palettes ? name : DEFAULT;
    }
}

function getPalette(palette, parameters) {
    var result,
        type = parameters && parameters.type;

    if(_isArray(palette)) {
        return palette.slice(0);
    } else {
        if(_isString(palette)) {
            result = palettes[_normalizeEnum(palette)];
        }
        if(!result) {
            result = palettes[currentPaletteName];
        }
    }
    result = result || null;
    return type ? result ? result[type].slice(0) : result : result;
}

function registerPalette(name, palette) {
    var item = {},
        paletteName;

    if(_isArray(palette)) {
        item.simpleSet = palette.slice(0);
    } else if(palette) {
        item.simpleSet = _isArray(palette.simpleSet) ? palette.simpleSet.slice(0) : undefined;
        item.indicatingSet = _isArray(palette.indicatingSet) ? palette.indicatingSet.slice(0) : undefined;
        item.gradientSet = _isArray(palette.gradientSet) ? palette.gradientSet.slice(0) : undefined;
    }
    if(item.simpleSet || item.indicatingSet || item.gradientSet) {
        paletteName = _normalizeEnum(name);
        _extend((palettes[paletteName] = palettes[paletteName] || {}), item);
    }
}

function RingBuf(buf) {
    var ind = 0;
    this.next = function() {
        var res = buf[ind++];
        if(ind === buf.length) {
            this.reset();
        }
        return res;
    };
    this.reset = function() {
        ind = 0;
    };
}

function Palette(palette, parameters) {
    parameters = parameters || {};
    var stepHighlight = parameters.useHighlight ? HIGHLIGHTING_STEP : 0;
    this._originalPalette = getPalette(palette, { type: parameters.type || "simpleSet" });
    this._paletteSteps = new RingBuf([0, stepHighlight, -stepHighlight]);
    this._resetPalette();
}

Palette.prototype = {
    constructor: Palette,

    dispose: function() {
        this._originalPalette = this._palette = this._paletteSteps = null;
    },

    getNextColor: function() {
        var that = this;
        if(that._currentColor >= that._palette.length) {
            that._resetPalette();
        }
        return that._palette[that._currentColor++];
    },

    _resetPalette: function() {
        var that = this,
            step = that._paletteSteps.next();
        that._palette = step ? getAlteredPalette(that._originalPalette, step) : that._originalPalette.slice(0);
        that._currentColor = 0;
    },

    reset: function() {
        this._paletteSteps.reset();
        this._resetPalette();
        return this;
    }
};

function getAlteredPalette(originalPalette, step) {
    var palette = [],
        i,
        ii = originalPalette.length;
    for(i = 0; i < ii; ++i) {
        palette.push(getNewColor(originalPalette[i], step));
    }
    return palette;
}

function getNewColor(currentColor, step) {
    var newColor = new _Color(currentColor).alter(step),
        lightness = getLightness(newColor);
    if(lightness > 200 || lightness < 55) {
        newColor = new _Color(currentColor).alter(-step / 2);
    }
    return newColor.toHex();
}

function getLightness(color) {
    return color.r * 0.3 + color.g * 0.59 + color.b * 0.11;
}

function DiscretePalette(source, size) {
    var palette = size > 0 ? createDiscreteColors(getPalette(source, { type: "gradientSet" }), size) : [];
    this.getColor = function(index) {
        return palette[index] || null;
    };
}

function createDiscreteColors(source, count) {
    var colorCount = count - 1,
        sourceCount = source.length - 1,
        colors = [],
        gradient = [],
        i;

    function addColor(pos) {
        var k = sourceCount * pos,
            kl = _floor(k),
            kr = _ceil(k);
        gradient.push(colors[kl].blend(colors[kr], k - kl).toHex());
    }

    for(i = 0; i <= sourceCount; ++i) {
        colors.push(new _Color(source[i]));
    }
    if(colorCount > 0) {
        for(i = 0; i <= colorCount; ++i) {
            addColor(i / colorCount);
        }
    } else {
        addColor(0.5);
    }
    return gradient;
}

function GradientPalette(source) {
    // TODO: Looks like some new set is going to be added
    var palette = getPalette(source, { type: "gradientSet" }),
        color1 = new _Color(palette[0]),
        color2 = new _Color(palette[1]);
    this.getColor = function(ratio) {
        return 0 <= ratio && ratio <= 1 ? color1.blend(color2, ratio).toHex() : null;
    };
}

_extend(exports, {
    Palette: Palette,
    DiscretePalette: DiscretePalette,
    GradientPalette: GradientPalette,
    registerPalette: registerPalette,
    getPalette: getPalette,
    currentPalette: currentPalette
});

///#DEBUG
exports._DEBUG_palettes = palettes;
///#ENDDEBUG

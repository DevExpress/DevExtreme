import { normalizeEnum } from './core/utils';
import { extend } from '../core/utils/extend';
import errors from '../core/errors';

const _floor = Math.floor;
const _ceil = Math.ceil;
const _Color = require('../color');
const _isArray = Array.isArray;

const _isString = require('../core/utils/type').isString;

const HIGHLIGHTING_STEP = 50;
const DEFAULT_PALETTE = 'material';

const officePalette = {
    simpleSet: ['#5f8b95', '#ba4d51', '#af8a53', '#955f71', '#859666', '#7e688c'],
    indicatingSet: ['#a3b97c', '#e1b676', '#ec7f83'],
    gradientSet: ['#5f8b95', '#ba4d51'],
    accentColor: '#ba4d51'
};

const palettes = {
    [DEFAULT_PALETTE]: {
        simpleSet: ['#1db2f5', '#f5564a', '#97c95c', '#ffc720', '#eb3573', '#a63db8'],
        indicatingSet: ['#97c95c', '#ffc720', '#f5564a'],
        gradientSet: ['#1db2f5', '#97c95c'],
        accentColor: '#1db2f5'
    },

    'default': officePalette, // deprecated in 18.1

    'office': officePalette,

    'harmony light': {
        simpleSet: ['#fcb65e', '#679ec5', '#ad79ce', '#7abd5c', '#e18e92', '#b6d623', '#b7abea', '#85dbd5'],
        indicatingSet: ['#b6d623', '#fcb65e', '#e18e92'],
        gradientSet: ['#7abd5c', '#fcb65e'],
        accentColor: '#679ec5'
    },
    'soft pastel': {
        simpleSet: ['#60a69f', '#78b6d9', '#6682bb', '#a37182', '#eeba69', '#90ba58', '#456c68', '#7565a4'],
        indicatingSet: ['#90ba58', '#eeba69', '#a37182'],
        gradientSet: ['#78b6d9', '#eeba69'],
        accentColor: '#60a69f'
    },

    'pastel': {
        simpleSet: ['#bb7862', '#70b3a1', '#bb626a', '#057d85', '#ab394b', '#dac599', '#153459', '#b1d2c6'],
        indicatingSet: ['#70b3a1', '#dac599', '#bb626a'],
        gradientSet: ['#bb7862', '#70b3a1'],
        accentColor: '#bb7862'
    },
    'bright': {
        simpleSet: ['#70c92f', '#f8ca00', '#bd1550', '#e97f02', '#9d419c', '#7e4452', '#9ab57e', '#36a3a6'],
        indicatingSet: ['#70c92f', '#f8ca00', '#bd1550'],
        gradientSet: ['#e97f02', '#f8ca00'],
        accentColor: '#e97f02'
    },
    'soft': {
        simpleSet: ['#cbc87b', '#9ab57e', '#e55253', '#7e4452', '#e8c267', '#565077', '#6babac', '#ad6082'],
        indicatingSet: ['#9ab57e', '#e8c267', '#e55253'],
        gradientSet: ['#9ab57e', '#e8c267'],
        accentColor: '#565077'
    },
    'ocean': {
        simpleSet: ['#75c099', '#acc371', '#378a8a', '#5fa26a', '#064970', '#38c5d2', '#00a7c6', '#6f84bb'],
        indicatingSet: ['#c8e394', '#7bc59d', '#397c8b'],
        gradientSet: ['#acc371', '#38c5d2'],
        accentColor: '#378a8a'
    },
    'vintage': {
        simpleSet: ['#dea484', '#efc59c', '#cb715e', '#eb9692', '#a85c4c', '#f2c0b5', '#c96374', '#dd956c'],
        indicatingSet: ['#ffe5c6', '#f4bb9d', '#e57660'],
        gradientSet: ['#efc59c', '#cb715e'],
        accentColor: '#cb715e'
    },
    'violet': {
        simpleSet: ['#d1a1d1', '#eeacc5', '#7b5685', '#7e7cad', '#a13d73', '#5b41ab', '#e287e2', '#689cc1'],
        indicatingSet: ['#d8e2f6', '#d0b2da', '#d56a8a'],
        gradientSet: ['#eeacc5', '#7b5685'],
        accentColor: '#7b5685'
    },

    // generic color schemes related palettes
    'carmine': {
        simpleSet: ['#fb7764', '#73d47f', '#fed85e', '#d47683', '#dde392', '#757ab2'],
        indicatingSet: ['#5cb85c', '#f0ad4e', '#d9534f'],
        gradientSet: ['#fb7764', '#73d47f'],
        accentColor: '#f05b41'
    },
    'dark moon': {
        simpleSet: ['#4ddac1', '#f4c99a', '#80dd9b', '#f998b3', '#4aaaa0', '#a5aef1'],
        indicatingSet: ['#59d8a4', '#f0ad4e', '#f9517e'],
        gradientSet: ['#4ddac1', '#f4c99a'],
        accentColor: '#3debd3'
    },
    'soft blue': {
        simpleSet: ['#7ab8eb', '#97da97', '#facb86', '#e78683', '#839bda', '#4db7be'],
        indicatingSet: ['#5cb85c', '#f0ad4e', '#d9534f'],
        gradientSet: ['#7ab8eb', '#97da97'],
        accentColor: '#7ab8eb'
    },
    'dark violet': {
        simpleSet: ['#9c63ff', '#64c064', '#eead51', '#d2504b', '#4b6bbf', '#2da7b0'],
        indicatingSet: ['#5cb85c', '#f0ad4e', '#d9534f'],
        gradientSet: ['#9c63ff', '#64c064'],
        accentColor: '#9c63ff'
    },
    'green mist': {
        simpleSet: ['#3cbab2', '#8ed962', '#5b9d95', '#efcc7c', '#f1929f', '#4d8dab'],
        indicatingSet: ['#72d63c', '#ffc852', '#f74a5e'],
        gradientSet: ['#3cbab2', '#8ed962'],
        accentColor: '#3cbab2'
    }
};

let currentPaletteName;

export function currentPalette(name) {
    if(name === undefined) {
        return currentPaletteName || DEFAULT_PALETTE;
    } else {
        name = normalizeEnum(name);
        currentPaletteName = name in palettes ? name : undefined;
    }
}

export function generateColors(palette, count, options = { keepLastColorInEnd: false }) {
    options.type = options.baseColorSet;
    options.extensionMode = options.paletteExtensionMode;

    return createPalette(palette, options).generateColors(count);
}

export function getPalette(palette, parameters) {
    parameters = parameters || {};
    palette = selectPaletteOnSeniority(palette, parameters.themeDefault);

    var result,
        type = parameters.type;
    if(_isArray(palette)) {
        return palette.slice(0);
    } else {
        if(_isString(palette)) {
            result = palettes[normalizeEnum(palette)];
        }
        if(!result) {
            result = palettes[currentPalette()];
        }
    }

    return type ? result[type].slice(0) : result;
}

export function registerPalette(name, palette) {
    var item = {},
        paletteName;

    if(_isArray(palette)) {
        item.simpleSet = palette.slice(0);
    } else if(palette) {
        item.simpleSet = _isArray(palette.simpleSet) ? palette.simpleSet.slice(0) : undefined;
        item.indicatingSet = _isArray(palette.indicatingSet) ? palette.indicatingSet.slice(0) : undefined;
        item.gradientSet = _isArray(palette.gradientSet) ? palette.gradientSet.slice(0) : undefined;
        item.accentColor = palette.accentColor;
    }
    if(!item.accentColor) {
        item.accentColor = item.simpleSet && item.simpleSet[0];
    }
    if(item.simpleSet || item.indicatingSet || item.gradientSet) {
        paletteName = normalizeEnum(name);
        extend((palettes[paletteName] = palettes[paletteName] || {}), item);
    }
}

export function getAccentColor(palette, themeDefault) {
    palette = getPalette(palette, { themeDefault });
    return palette.accentColor || palette[0];
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

function getAlternateColorsStrategy(palette, parameters) {
    var stepHighlight = parameters.useHighlight ? HIGHLIGHTING_STEP : 0,
        paletteSteps = new RingBuf([0, stepHighlight, -stepHighlight]),
        currentPalette = [];

    function reset() {
        var step = paletteSteps.next();
        currentPalette = step ? getAlteredPalette(palette, step) : palette.slice(0);
    }

    return {
        getColor: function(index) {
            var color = currentPalette[index % palette.length];

            if(index % palette.length === palette.length - 1) {
                reset();
            }
            return color;
        },

        generateColors: function(count) {
            const colors = [];
            count = count || parameters.count;
            for(var i = 0; i < count; i++) {
                colors.push(this.getColor(i));
            }

            return colors;
        },

        reset: function() {
            paletteSteps.reset();
            reset();
        }
    };
}

function getExtrapolateColorsStrategy(palette, parameters) {
    function convertColor(color, cycleIndex, cycleCount) {
        var hsl = new _Color(color).hsl,
            l = hsl.l / 100,
            diapason = cycleCount - 1 / cycleCount,
            minL = l - diapason * 0.5,
            maxL = l + diapason * 0.5,
            cycleMiddle = (cycleCount - 1) / 2,
            cycleDiff = cycleIndex - cycleMiddle;

        if(minL < Math.min(0.5, l * 0.9)) {
            minL = Math.min(0.5, l * 0.9);
        }

        if(maxL > Math.max(0.8, l + (1 - l) * 0.15)) {
            maxL = Math.max(0.8, l + (1 - l) * 0.15);
        }

        if(cycleDiff < 0) {
            l = l - (minL - l) * cycleDiff / cycleMiddle;
        } else {
            l = l + (maxL - l) * (cycleDiff / cycleMiddle);
        }
        hsl.l = l * 100;

        return _Color.prototype.fromHSL(hsl).toHex();

    }

    return {
        getColor: function(index, count) {
            var paletteCount = palette.length,
                cycles = _floor((count - 1) / (paletteCount) + 1),
                color = palette[index % paletteCount];

            if(cycles > 1) {
                return convertColor(color, _floor(index / paletteCount), cycles);
            }

            return color;
        },

        generateColors: function(count) {
            const colors = [];
            count = count || parameters.count;
            for(let i = 0; i < count; i++) colors.push(this.getColor(i, count));
            return colors;
        },

        reset: function() {

        }
    };
}

function getColorMixer(palette, parameters) {
    var paletteCount = palette.length,
        extendedPalette = [];

    function distributeColors(count, colorsCount, startIndex, distribution) {
        var groupSize = Math.floor(count / colorsCount),
            extraItems = count - colorsCount * groupSize,
            i = startIndex,
            middleIndex,
            size;

        while(i < startIndex + count) {
            size = groupSize;
            if(extraItems > 0) {
                size += 1;
                extraItems--;
            }
            middleIndex = size > 2 ? Math.floor(size / 2) : 0;

            distribution.push(i + middleIndex);
            i += size;
        }

        return distribution.sort(function(a, b) {
            return a - b;
        });
    }

    function getColorAndDistance(arr, startIndex, count) {
        startIndex = (count + startIndex) % count;

        var distance = 0;

        for(var i = startIndex; i < count * 2; i += 1) {
            var index = (count + i) % count;
            if(arr[index]) {
                return [arr[index], distance];
            }
            distance++;
        }
    }

    function blendColors(paletteWithEmptyColors, paletteLength) {
        for(var i = 0; i < paletteLength; i++) {
            var color = paletteWithEmptyColors[i];
            if(!color) {
                var color1 = paletteWithEmptyColors[i - 1];
                if(!color1) {
                    continue;
                } else {
                    var c2 = getColorAndDistance(paletteWithEmptyColors, i, paletteLength),
                        color2 = new _Color(c2[0]);

                    color1 = new _Color(color1);

                    for(var j = 0; j < c2[1]; j++, i++) {
                        paletteWithEmptyColors[i] = color1.blend(color2, (j + 1) / (c2[1] + 1)).toHex();
                    }
                }
            }
        }

        return paletteWithEmptyColors;
    }

    function extendPalette(count) {
        if(count <= paletteCount) {
            return palette;
        }

        var result = [],
            colorInGroups = paletteCount - 2,
            currentColorIndex = 0,
            cleanColorIndices = [];


        if(parameters.keepLastColorInEnd) {
            cleanColorIndices = distributeColors(count - 2, colorInGroups, 1, [0, count - 1]);
        } else {
            cleanColorIndices = distributeColors(count - 1, paletteCount - 1, 1, [0]);
        }

        for(var i = 0; i < count; i++) {
            if(cleanColorIndices.indexOf(i) > -1) {
                result[i] = palette[currentColorIndex++];
            }
        }

        result = blendColors(result, count);


        return result;
    }

    return {
        getColor: function(index, count) {
            count = count || parameters.count || paletteCount;

            if(extendedPalette.length !== count) {
                extendedPalette = extendPalette(count);
            }

            return extendedPalette[index % count];
        },

        generateColors: function(count, repeat) {
            count = count || parameters.count || paletteCount;
            if(repeat && count > paletteCount) {
                let colors = extendPalette(paletteCount);
                for(let i = 0; i < count - paletteCount; i++) {
                    colors.push(colors[i]);
                }
                return colors;
            } else {
                return paletteCount > 0 ? extendPalette(count).slice(0, count) : [];
            }
        },

        reset: function() {

        }
    };
}

export function createPalette(palette, parameters, themeDefaultPalette) {
    const paletteObj = {
        dispose() {
            this._extensionStrategy = null;
        },

        getNextColor(count) {
            return this._extensionStrategy.getColor(this._currentColor++, count);
        },

        generateColors(count, parameters) {
            return this._extensionStrategy.generateColors(count, (parameters || {}).repeat);
        },

        reset() {
            this._currentColor = 0;
            this._extensionStrategy.reset();
            return this;
        }
    };
    parameters = parameters || {};

    var extensionMode = (parameters.extensionMode || '').toLowerCase(),
        colors = getPalette(palette, { type: parameters.type || 'simpleSet', themeDefault: themeDefaultPalette });

    if(extensionMode === 'alternate') {
        paletteObj._extensionStrategy = getAlternateColorsStrategy(colors, parameters);
    } else if(extensionMode === 'extrapolate') {
        paletteObj._extensionStrategy = getExtrapolateColorsStrategy(colors, parameters);
    } else {
        paletteObj._extensionStrategy = getColorMixer(colors, parameters);
    }

    paletteObj.reset();

    return paletteObj;
}

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

export function getDiscretePalette(source, size, themeDefaultPalette) {
    var palette = size > 0 ? createDiscreteColors(getPalette(source, { type: 'gradientSet', themeDefault: themeDefaultPalette }), size) : [];

    return {
        getColor: function(index) {
            return palette[index] || null;
        }
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

export function getGradientPalette(source, themeDefaultPalette) {
    // TODO: Looks like some new set is going to be added
    var palette = getPalette(source, { type: 'gradientSet', themeDefault: themeDefaultPalette }),
        color1 = new _Color(palette[0]),
        color2 = new _Color(palette[1]);

    return {
        getColor: function(ratio) {
            return 0 <= ratio && ratio <= 1 ? color1.blend(color2, ratio).toHex() : null;
        }
    };
}

function selectPaletteOnSeniority(source, themeDefaultPalette) {
    const result = source || (currentPaletteName === undefined ? themeDefaultPalette : currentPalette());

    if(result === 'default') {
        errors.log('W0016', '"palette"', 'Default', '18.1', 'Use the "Office" value instead.');
    }

    return result;
}

///#DEBUG
export const _DEBUG_palettes = palettes;
///#ENDDEBUG

const standardColorNames = {
    'aliceblue': 'f0f8ff',
    'antiquewhite': 'faebd7',
    'aqua': '00ffff',
    'aquamarine': '7fffd4',
    'azure': 'f0ffff',
    'beige': 'f5f5dc',
    'bisque': 'ffe4c4',
    'black': '000000',
    'blanchedalmond': 'ffebcd',
    'blue': '0000ff',
    'blueviolet': '8a2be2',
    'brown': 'a52a2a',
    'burlywood': 'deb887',
    'cadetblue': '5f9ea0',
    'chartreuse': '7fff00',
    'chocolate': 'd2691e',
    'coral': 'ff7f50',
    'cornflowerblue': '6495ed',
    'cornsilk': 'fff8dc',
    'crimson': 'dc143c',
    'cyan': '00ffff',
    'darkblue': '00008b',
    'darkcyan': '008b8b',
    'darkgoldenrod': 'b8860b',
    'darkgray': 'a9a9a9',
    'darkgreen': '006400',
    'darkkhaki': 'bdb76b',
    'darkmagenta': '8b008b',
    'darkolivegreen': '556b2f',
    'darkorange': 'ff8c00',
    'darkorchid': '9932cc',
    'darkred': '8b0000',
    'darksalmon': 'e9967a',
    'darkseagreen': '8fbc8f',
    'darkslateblue': '483d8b',
    'darkslategray': '2f4f4f',
    'darkturquoise': '00ced1',
    'darkviolet': '9400d3',
    'deeppink': 'ff1493',
    'deepskyblue': '00bfff',
    'dimgray': '696969',
    'dodgerblue': '1e90ff',
    'feldspar': 'd19275',
    'firebrick': 'b22222',
    'floralwhite': 'fffaf0',
    'forestgreen': '228b22',
    'fuchsia': 'ff00ff',
    'gainsboro': 'dcdcdc',
    'ghostwhite': 'f8f8ff',
    'gold': 'ffd700',
    'goldenrod': 'daa520',
    'gray': '808080',
    'green': '008000',
    'greenyellow': 'adff2f',
    'honeydew': 'f0fff0',
    'hotpink': 'ff69b4',
    'indianred': 'cd5c5c',
    'indigo': '4b0082',
    'ivory': 'fffff0',
    'khaki': 'f0e68c',
    'lavender': 'e6e6fa',
    'lavenderblush': 'fff0f5',
    'lawngreen': '7cfc00',
    'lemonchiffon': 'fffacd',
    'lightblue': 'add8e6',
    'lightcoral': 'f08080',
    'lightcyan': 'e0ffff',
    'lightgoldenrodyellow': 'fafad2',
    'lightgrey': 'd3d3d3',
    'lightgreen': '90ee90',
    'lightpink': 'ffb6c1',
    'lightsalmon': 'ffa07a',
    'lightseagreen': '20b2aa',
    'lightskyblue': '87cefa',
    'lightslateblue': '8470ff',
    'lightslategray': '778899',
    'lightsteelblue': 'b0c4de',
    'lightyellow': 'ffffe0',
    'lime': '00ff00',
    'limegreen': '32cd32',
    'linen': 'faf0e6',
    'magenta': 'ff00ff',
    'maroon': '800000',
    'mediumaquamarine': '66cdaa',
    'mediumblue': '0000cd',
    'mediumorchid': 'ba55d3',
    'mediumpurple': '9370d8',
    'mediumseagreen': '3cb371',
    'mediumslateblue': '7b68ee',
    'mediumspringgreen': '00fa9a',
    'mediumturquoise': '48d1cc',
    'mediumvioletred': 'c71585',
    'midnightblue': '191970',
    'mintcream': 'f5fffa',
    'mistyrose': 'ffe4e1',
    'moccasin': 'ffe4b5',
    'navajowhite': 'ffdead',
    'navy': '000080',
    'oldlace': 'fdf5e6',
    'olive': '808000',
    'olivedrab': '6b8e23',
    'orange': 'ffa500',
    'orangered': 'ff4500',
    'orchid': 'da70d6',
    'palegoldenrod': 'eee8aa',
    'palegreen': '98fb98',
    'paleturquoise': 'afeeee',
    'palevioletred': 'd87093',
    'papayawhip': 'ffefd5',
    'peachpuff': 'ffdab9',
    'peru': 'cd853f',
    'pink': 'ffc0cb',
    'plum': 'dda0dd',
    'powderblue': 'b0e0e6',
    'purple': '800080',
    'rebeccapurple': '663399',
    'red': 'ff0000',
    'rosybrown': 'bc8f8f',
    'royalblue': '4169e1',
    'saddlebrown': '8b4513',
    'salmon': 'fa8072',
    'sandybrown': 'f4a460',
    'seagreen': '2e8b57',
    'seashell': 'fff5ee',
    'sienna': 'a0522d',
    'silver': 'c0c0c0',
    'skyblue': '87ceeb',
    'slateblue': '6a5acd',
    'slategray': '708090',
    'snow': 'fffafa',
    'springgreen': '00ff7f',
    'steelblue': '4682b4',
    'tan': 'd2b48c',
    'teal': '008080',
    'thistle': 'd8bfd8',
    'tomato': 'ff6347',
    'turquoise': '40e0d0',
    'violet': 'ee82ee',
    'violetred': 'd02090',
    'wheat': 'f5deb3',
    'white': 'ffffff',
    'whitesmoke': 'f5f5f5',
    'yellow': 'ffff00',
    'yellowgreen': '9acd32'
};


// array of color definition objects
const standardColorTypes = [
    {
        re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
        process: function(colorString) {
            return [
                parseInt(colorString[1], 10),
                parseInt(colorString[2], 10),
                parseInt(colorString[3], 10)
            ];
        }
    },
    {
        re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*\.*\d+)\)$/,
        process: function(colorString) {
            return [
                parseInt(colorString[1], 10),
                parseInt(colorString[2], 10),
                parseInt(colorString[3], 10),
                parseFloat(colorString[4])
            ];
        }
    },
    {
        re: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/,
        process: function(colorString) {
            return [
                parseInt(colorString[1], 16),
                parseInt(colorString[2], 16),
                parseInt(colorString[3], 16)
            ];
        }
    },
    {
        re: /^#([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})$/,
        process: function(colorString) {
            return [
                parseInt(colorString[1] + colorString[1], 16),
                parseInt(colorString[2] + colorString[2], 16),
                parseInt(colorString[3] + colorString[3], 16)
            ];
        }
    },
    {
        re: /^hsv\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
        process: function(colorString) {
            const h = parseInt(colorString[1], 10);
            const s = parseInt(colorString[2], 10);
            const v = parseInt(colorString[3], 10);
            const rgb = hsvToRgb(h, s, v);

            return [
                rgb[0],
                rgb[1],
                rgb[2],
                1,
                [h, s, v]
            ];
        }
    },
    {
        re: /^hsl\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
        process: function(colorString) {
            const h = parseInt(colorString[1], 10);
            const s = parseInt(colorString[2], 10);
            const l = parseInt(colorString[3], 10);
            const rgb = hslToRgb(h, s, l);

            return [
                rgb[0],
                rgb[1],
                rgb[2],
                1,
                null,
                [h, s, l]
            ];
        }
    }
];

const _round = Math.round;

function Color(value) {
    this.baseColor = value;
    let color;
    if(value) {
        color = String(value).toLowerCase().replace(/ /g, '');
        color = standardColorNames[color] ? '#' + standardColorNames[color] : color;
        color = parseColor(color);
    }
    if(!color) {
        this.colorIsInvalid = true;
    }

    color = color || {};
    this.r = normalize(color[0]);
    this.g = normalize(color[1]);
    this.b = normalize(color[2]);
    this.a = normalize(color[3], 1, 1);
    if(color[4]) {
        this.hsv = { h: color[4][0], s: color[4][1], v: color[4][2] };
    } else {
        this.hsv = toHsvFromRgb(this.r, this.g, this.b);
    }
    if(color[5]) {
        this.hsl = { h: color[5][0], s: color[5][1], l: color[5][2] };
    } else {
        this.hsl = toHslFromRgb(this.r, this.g, this.b);
    }
}

function parseColor(color) {
    if(color === 'transparent') {
        return [0, 0, 0, 0];
    }

    let i = 0;
    const ii = standardColorTypes.length;
    let str;
    for(; i < ii; ++i) {
        str = standardColorTypes[i].re.exec(color);
        if(str) {
            return standardColorTypes[i].process(str);
        }
    }
    return null;
}

function normalize(colorComponent, def, max) {
    def = def || 0;
    max = max || 255;
    return (colorComponent < 0 || isNaN(colorComponent)) ? def : ((colorComponent > max) ? max : colorComponent);
}

function toHexFromRgb(r, g, b) {
    return '#' + (0X01000000 | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function toHsvFromRgb(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let H;
    let S;
    let V = max;
    S = (max === 0 ? 0 : 1 - min / max);

    if(max === min) {
        H = 0;
    } else {
        switch(max) {
            case r:
                H = 60 * ((g - b) / delta);
                if(g < b) {
                    H = H + 360;
                }
                break;
            case g:
                H = 60 * ((b - r) / delta) + 120;
                break;
            case b:
                H = 60 * ((r - g) / delta) + 240;
                break;
        }
    }

    S *= 100;
    V *= 100 / 255;

    return {
        h: Math.round(H),
        s: Math.round(S),
        v: Math.round(V)
    };
}

function hsvToRgb(h, s, v) {
    const index = Math.floor((h % 360) / 60);
    const vMin = ((100 - s) * v) / 100;
    const a = (v - vMin) * ((h % 60) / 60);
    const vInc = vMin + a;
    const vDec = v - a;

    let r;
    let g;
    let b;

    switch(index) {
        /* eslint-disable no-multi-spaces */
        case 0: r = v;      g = vInc;   b = vMin;   break;
        case 1: r = vDec;   g = v;      b = vMin;   break;
        case 2: r = vMin;   g = v;      b = vInc;   break;
        case 3: r = vMin;   g = vDec;   b = v;      break;
        case 4: r = vInc;   g = vMin;   b = v;      break;
        case 5: r = v;      g = vMin;   b = vDec;   break;
        /* eslint-enable no-multi-spaces */
    }

    return [Math.round(r * 2.55), Math.round(g * 2.55), Math.round(b * 2.55)];
}

function calculateHue(r, g, b, delta) {
    const max = Math.max(r, g, b);
    switch(max) {
        case r:
            return (g - b) / delta + (g < b ? 6 : 0);
        case g:
            return (b - r) / delta + 2;
        case b:
            return (r - g) / delta + 4;
    }
}

function toHslFromRgb(r, g, b) {
    r = convertTo01Bounds(r, 255);
    g = convertTo01Bounds(g, 255);
    b = convertTo01Bounds(b, 255);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const maxMinSum = max + min;
    let h;
    let s;
    const l = maxMinSum / 2;

    if(max === min) {
        h = s = 0;
    } else {
        const delta = max - min;

        if(l > 0.5) {
            s = delta / (2 - maxMinSum);
        } else {
            s = delta / maxMinSum;
        }

        h = calculateHue(r, g, b, delta);
        h /= 6;
    }

    return { h: _round(h * 360), s: _round(s * 100), l: _round(l * 100) };
}

function makeColorTint(colorPart, h) {
    let colorTint = h;
    if(colorPart === 'r') {
        colorTint = h + 1 / 3;
    }
    if(colorPart === 'b') {
        colorTint = h - 1 / 3;
    }

    return colorTint;
}

function modifyColorTint(colorTint) {
    if(colorTint < 0) {
        colorTint += 1;
    }
    if(colorTint > 1) {
        colorTint -= 1;
    }

    return colorTint;
}

function hueToRgb(p, q, colorTint) {
    colorTint = modifyColorTint(colorTint);
    if(colorTint < 1 / 6) {
        return p + (q - p) * 6 * colorTint;
    }
    if(colorTint < 1 / 2) {
        return q;
    }
    if(colorTint < 2 / 3) {
        return p + (q - p) * (2 / 3 - colorTint) * 6;
    }
    return p;
}

function hslToRgb(h, s, l) {
    let r;
    let g;
    let b;

    h = convertTo01Bounds(h, 360);
    s = convertTo01Bounds(s, 100);
    l = convertTo01Bounds(l, 100);

    if(s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, makeColorTint('r', h));
        g = hueToRgb(p, q, makeColorTint('g', h));
        b = hueToRgb(p, q, makeColorTint('b', h));
    }

    return [_round(r * 255), _round(g * 255), _round(b * 255)];
}

function convertTo01Bounds(n, max) {
    n = Math.min(max, Math.max(0, parseFloat(n)));
    if((Math.abs(n - max) < 0.000001)) {
        return 1;
    }
    return (n % max) / parseFloat(max);
}

function isIntegerBetweenMinAndMax(number, min, max) {
    min = min || 0;
    max = max || 255;

    if(number % 1 !== 0 ||
       number < min ||
       number > max ||
       typeof number !== 'number' ||
       isNaN(number)) {
        return false;
    }

    return true;
}

Color.prototype = {
    constructor: Color,

    highlight: function(step) {
        step = step || 10;
        return this.alter(step).toHex();

    },

    darken: function(step) {
        step = step || 10;
        return this.alter(-step).toHex();
    },

    alter: function(step) {
        const result = new Color();
        result.r = normalize(this.r + step);
        result.g = normalize(this.g + step);
        result.b = normalize(this.b + step);
        return result;
    },

    blend: function(blendColor, opacity) {
        const other = blendColor instanceof Color ? blendColor : new Color(blendColor);
        const result = new Color();
        result.r = normalize(_round(this.r * (1 - opacity) + other.r * opacity));
        result.g = normalize(_round(this.g * (1 - opacity) + other.g * opacity));
        result.b = normalize(_round(this.b * (1 - opacity) + other.b * opacity));
        return result;
    },

    toHex: function() {
        return toHexFromRgb(this.r, this.g, this.b);
    },

    getPureColor: function() {
        const rgb = hsvToRgb(this.hsv.h, 100, 100);
        return new Color('rgb(' + rgb.join(',') + ')');
    },

    isValidHex: function(hex) {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
    },

    isValidRGB: function(r, g, b) {
        if(!isIntegerBetweenMinAndMax(r) || !isIntegerBetweenMinAndMax(g) || !isIntegerBetweenMinAndMax(b)) {
            return false;
        }
        return true;
    },

    isValidAlpha: function(a) {
        if(isNaN(a) || a < 0 || a > 1 || typeof a !== 'number') {
            return false;
        }
        return true;
    },

    colorIsInvalid: false,

    fromHSL: function(hsl) {
        const color = new Color();
        const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);

        color.r = rgb[0];
        color.g = rgb[1];
        color.b = rgb[2];

        return color;
    }
};

module.exports = Color;

/* eslint-disable spellcheck/spell-checker */

import type { ColorParseResult } from './utils/color.helpers';
import {
  hslToRgb,
  hsvToRgb,
  isIntegerBetweenMinAndMax,
  normalize, parseColor, toHexFromRgb, toHslFromRgb, toHsvFromRgb,
} from './utils/color.helpers';

const standardColorNames = {
  aliceblue: 'f0f8ff',
  antiquewhite: 'faebd7',
  aqua: '00ffff',
  aquamarine: '7fffd4',
  azure: 'f0ffff',
  beige: 'f5f5dc',
  bisque: 'ffe4c4',
  black: '000000',
  blanchedalmond: 'ffebcd',
  blue: '0000ff',
  blueviolet: '8a2be2',
  brown: 'a52a2a',
  burlywood: 'deb887',
  cadetblue: '5f9ea0',
  chartreuse: '7fff00',
  chocolate: 'd2691e',
  coral: 'ff7f50',
  cornflowerblue: '6495ed',
  cornsilk: 'fff8dc',
  crimson: 'dc143c',
  cyan: '00ffff',
  darkblue: '00008b',
  darkcyan: '008b8b',
  darkgoldenrod: 'b8860b',
  darkgray: 'a9a9a9',
  darkgreen: '006400',
  darkgrey: 'a9a9a9',
  darkkhaki: 'bdb76b',
  darkmagenta: '8b008b',
  darkolivegreen: '556b2f',
  darkorange: 'ff8c00',
  darkorchid: '9932cc',
  darkred: '8b0000',
  darksalmon: 'e9967a',
  darkseagreen: '8fbc8f',
  darkslateblue: '483d8b',
  darkslategray: '2f4f4f',
  darkslategrey: '2f4f4f',
  darkturquoise: '00ced1',
  darkviolet: '9400d3',
  deeppink: 'ff1493',
  deepskyblue: '00bfff',
  dimgray: '696969',
  dimgrey: '696969',
  dodgerblue: '1e90ff',
  feldspar: 'd19275',
  firebrick: 'b22222',
  floralwhite: 'fffaf0',
  forestgreen: '228b22',
  fuchsia: 'ff00ff',
  gainsboro: 'dcdcdc',
  ghostwhite: 'f8f8ff',
  gold: 'ffd700',
  goldenrod: 'daa520',
  gray: '808080',
  green: '008000',
  greenyellow: 'adff2f',
  grey: '808080',
  honeydew: 'f0fff0',
  hotpink: 'ff69b4',
  indianred: 'cd5c5c',
  indigo: '4b0082',
  ivory: 'fffff0',
  khaki: 'f0e68c',
  lavender: 'e6e6fa',
  lavenderblush: 'fff0f5',
  lawngreen: '7cfc00',
  lemonchiffon: 'fffacd',
  lightblue: 'add8e6',
  lightcoral: 'f08080',
  lightcyan: 'e0ffff',
  lightgoldenrodyellow: 'fafad2',
  lightgray: 'd3d3d3',
  lightgreen: '90ee90',
  lightgrey: 'd3d3d3',
  lightpink: 'ffb6c1',
  lightsalmon: 'ffa07a',
  lightseagreen: '20b2aa',
  lightskyblue: '87cefa',
  lightslateblue: '8470ff',
  lightslategray: '778899',
  lightslategrey: '778899',
  lightsteelblue: 'b0c4de',
  lightyellow: 'ffffe0',
  lime: '00ff00',
  limegreen: '32cd32',
  linen: 'faf0e6',
  magenta: 'ff00ff',
  maroon: '800000',
  mediumaquamarine: '66cdaa',
  mediumblue: '0000cd',
  mediumorchid: 'ba55d3',
  mediumpurple: '9370d8',
  mediumseagreen: '3cb371',
  mediumslateblue: '7b68ee',
  mediumspringgreen: '00fa9a',
  mediumturquoise: '48d1cc',
  mediumvioletred: 'c71585',
  midnightblue: '191970',
  mintcream: 'f5fffa',
  mistyrose: 'ffe4e1',
  moccasin: 'ffe4b5',
  navajowhite: 'ffdead',
  navy: '000080',
  oldlace: 'fdf5e6',
  olive: '808000',
  olivedrab: '6b8e23',
  orange: 'ffa500',
  orangered: 'ff4500',
  orchid: 'da70d6',
  palegoldenrod: 'eee8aa',
  palegreen: '98fb98',
  paleturquoise: 'afeeee',
  palevioletred: 'd87093',
  papayawhip: 'ffefd5',
  peachpuff: 'ffdab9',
  peru: 'cd853f',
  pink: 'ffc0cb',
  plum: 'dda0dd',
  powderblue: 'b0e0e6',
  purple: '800080',
  rebeccapurple: '663399',
  red: 'ff0000',
  rosybrown: 'bc8f8f',
  royalblue: '4169e1',
  saddlebrown: '8b4513',
  salmon: 'fa8072',
  sandybrown: 'f4a460',
  seagreen: '2e8b57',
  seashell: 'fff5ee',
  sienna: 'a0522d',
  silver: 'c0c0c0',
  skyblue: '87ceeb',
  slateblue: '6a5acd',
  slategray: '708090',
  slategrey: '708090',
  snow: 'fffafa',
  springgreen: '00ff7f',
  steelblue: '4682b4',
  tan: 'd2b48c',
  teal: '008080',
  thistle: 'd8bfd8',
  tomato: 'ff6347',
  turquoise: '40e0d0',
  violet: 'ee82ee',
  violetred: 'd02090',
  wheat: 'f5deb3',
  white: 'ffffff',
  whitesmoke: 'f5f5f5',
  yellow: 'ffff00',
  yellowgreen: '9acd32',
};

export class Color {
  baseColor?: string | null;

  r!: number;

  g!: number;

  b!: number;

  a!: number;

  hsv!: { h: number; s: number; v: number };

  hsl!: { h: number; s: number; l: number };

  colorIsInvalid = false;

  constructor(value?: string | null) {
    this.baseColor = value;
    let color: ColorParseResult | null = null;
    if (value) {
      let colorStr = String(value).toLowerCase().replace(/ /g, '');
      colorStr = standardColorNames[colorStr] ? `#${standardColorNames[colorStr]}` : colorStr;
      color = parseColor(colorStr);
    }
    if (!color) {
      this.colorIsInvalid = true;
    }

    const parts = color ?? [];
    this.r = normalize(parts[0]);
    this.g = normalize(parts[1]);
    this.b = normalize(parts[2]);
    this.a = normalize(parts[3], 1, 1);
    const hsvData = parts[4] as number[] | null | undefined;
    if (hsvData) {
      this.hsv = { h: hsvData[0], s: hsvData[1], v: hsvData[2] };
    } else {
      this.hsv = toHsvFromRgb(this.r, this.g, this.b);
    }
    const hslData = parts[5] as number[] | null | undefined;
    if (hslData) {
      this.hsl = { h: hslData[0], s: hslData[1], l: hslData[2] };
    } else {
      this.hsl = toHslFromRgb(this.r, this.g, this.b);
    }
  }

  highlight(step?: number): string {
    const stepValue = step ?? 10;
    return this.alter(stepValue).toHex();
  }

  darken(step?: number): string {
    const stepValue = step ?? 10;
    return this.alter(-stepValue).toHex();
  }

  alter(step: number): Color {
    const result = new Color();
    result.r = normalize(this.r + step);
    result.g = normalize(this.g + step);
    result.b = normalize(this.b + step);
    return result;
  }

  blend(blendColor: Color | string, opacity: number): Color {
    const other = blendColor instanceof Color ? blendColor : new Color(blendColor);
    const result = new Color();
    result.r = normalize(Math.round(this.r * (1 - opacity) + other.r * opacity));
    result.g = normalize(Math.round(this.g * (1 - opacity) + other.g * opacity));
    result.b = normalize(Math.round(this.b * (1 - opacity) + other.b * opacity));
    return result;
  }

  toHex(): string {
    return toHexFromRgb(this.r, this.g, this.b);
  }

  getPureColor(): Color {
    const rgb = hsvToRgb(this.hsv.h, 100, 100);
    return new Color(`rgb(${rgb.join(',')})`);
  }

  static isValidHex(hex: string): boolean {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
  }

  static isValidRGB(
    r?: unknown,
    g?: unknown,
    b?: unknown,
  ): boolean {
    if (
      !isIntegerBetweenMinAndMax(r)
      || !isIntegerBetweenMinAndMax(g)
      || !isIntegerBetweenMinAndMax(b)
    ) {
      return false;
    }
    return true;
  }

  static isValidAlpha(a?: unknown): a is number {
    if (typeof a !== 'number' || isNaN(a) || a < 0 || a > 1) {
      return false;
    }
    return true;
  }

  static fromHSL(hsl: { h: number; s: number; l: number }): Color {
    const color = new Color();
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);

    // eslint-disable-next-line prefer-destructuring
    color.r = rgb[0];
    // eslint-disable-next-line prefer-destructuring
    color.g = rgb[1];
    // eslint-disable-next-line prefer-destructuring
    color.b = rgb[2];
    color.hsl = { ...hsl };
    color.hsv = toHsvFromRgb(color.r, color.g, color.b);
    color.colorIsInvalid = false;

    return color;
  }
}

export type ColorInstance = Color;

export default Color;

/* eslint-disable spellcheck/spell-checker */

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

type ColorParseResult = | [number, number, number]
  | [number, number, number, number]
  | [number, number, number, number, [number, number, number]]
  | [number, number, number, number, null, [number, number, number]];

function makeColorTint(colorPart: string, h: number): number {
  let colorTint = h;
  if (colorPart === 'r') {
    colorTint = h + 1 / 3;
  }
  if (colorPart === 'b') {
    colorTint = h - 1 / 3;
  }

  return colorTint;
}

function modifyColorTint(colorTint: number): number {
  let tint = colorTint;
  if (tint < 0) {
    tint += 1;
  }
  if (tint > 1) {
    tint -= 1;
  }

  return tint;
}

function hueToRgb(p: number, q: number, colorTint: number): number {
  const tint = modifyColorTint(colorTint);
  if (tint < 1 / 6) {
    return p + (q - p) * 6 * tint;
  }
  if (tint < 1 / 2) {
    return q;
  }
  if (tint < 2 / 3) {
    return p + (q - p) * (2 / 3 - tint) * 6;
  }
  return p;
}

function convertTo01Bounds(n: number, max: number): number {
  const bounded = Math.min(max, Math.max(0, n));
  if (Math.abs(bounded - max) < 0.000001) {
    return 1;
  }
  return (bounded % max) / max;
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const index = Math.floor((h % 360) / 60);
  const vMin = ((100 - s) * v) / 100;
  const a = (v - vMin) * ((h % 60) / 60);
  const vInc = vMin + a;
  const vDec = v - a;

  let r = 0;
  let g = 0;
  let b = 0;

  switch (index) {
    case 0: r = v; g = vInc; b = vMin; break;
    case 1: r = vDec; g = v; b = vMin; break;
    case 2: r = vMin; g = v; b = vInc; break;
    case 3: r = vMin; g = vDec; b = v; break;
    case 4: r = vInc; g = vMin; b = v; break;
    case 5: r = v; g = vMin; b = vDec; break;
    default:
      break;
  }

  return [Math.round(r * 2.55), Math.round(g * 2.55), Math.round(b * 2.55)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r = 0;
  let g = 0;
  let b = 0;

  const h01 = convertTo01Bounds(h, 360);
  const s01 = convertTo01Bounds(s, 100);
  const l01 = convertTo01Bounds(l, 100);

  if (s01 === 0) {
    r = l01;
    g = l01;
    b = l01;
  } else {
    const q = l01 < 0.5 ? l01 * (1 + s01) : l01 + s01 - l01 * s01;
    const p = 2 * l01 - q;
    r = hueToRgb(p, q, makeColorTint('r', h01));
    g = hueToRgb(p, q, makeColorTint('g', h01));
    b = hueToRgb(p, q, makeColorTint('b', h01));
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// array of color definition objects
const standardColorTypes: {
  re: RegExp;
  process: (colorString: RegExpExecArray) => ColorParseResult;
}[] = [
  {
    re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
    process(colorString): [number, number, number] {
      return [
        parseInt(colorString[1], 10),
        parseInt(colorString[2], 10),
        parseInt(colorString[3], 10),
      ];
    },
  },
  {
    re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*\.*\d+)\)$/,
    process(colorString): [number, number, number, number] {
      return [
        parseInt(colorString[1], 10),
        parseInt(colorString[2], 10),
        parseInt(colorString[3], 10),
        parseFloat(colorString[4]),
      ];
    },
  },
  {
    re: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/,
    process(colorString): [number, number, number] {
      return [
        parseInt(colorString[1], 16),
        parseInt(colorString[2], 16),
        parseInt(colorString[3], 16),
      ];
    },
  },
  {
    re: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/,
    process(colorString): [number, number, number, number] {
      return [
        parseInt(colorString[1], 16),
        parseInt(colorString[2], 16),
        parseInt(colorString[3], 16),
        Number((parseInt(colorString[4], 16) / 255).toFixed(2)),
      ];
    },
  },
  {
    re: /^#([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})$/,
    process(colorString): [number, number, number, number] {
      return [
        parseInt(colorString[1] + colorString[1], 16),
        parseInt(colorString[2] + colorString[2], 16),
        parseInt(colorString[3] + colorString[3], 16),
        Number((parseInt(colorString[4] + colorString[4], 16) / 255).toFixed(2)),
      ];
    },
  },
  {
    re: /^#([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})$/,
    process(colorString): [number, number, number] {
      return [
        parseInt(colorString[1] + colorString[1], 16),
        parseInt(colorString[2] + colorString[2], 16),
        parseInt(colorString[3] + colorString[3], 16),
      ];
    },
  },
  {
    re: /^hsv\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
    process(colorString): [number, number, number, number, [number, number, number]] {
      const h = parseInt(colorString[1], 10);
      const s = parseInt(colorString[2], 10);
      const v = parseInt(colorString[3], 10);
      const rgb = hsvToRgb(h, s, v);

      return [
        rgb[0],
        rgb[1],
        rgb[2],
        1,
        [h, s, v],
      ];
    },
  },
  {
    re: /^hsl\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
    process(colorString): [number, number, number, number, null, [number, number, number]] {
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
        [h, s, l],
      ];
    },
  },
];

function parseColor(color: string): ColorParseResult | null {
  if (color === 'transparent') {
    return [0, 0, 0, 0];
  }

  for (const colorType of standardColorTypes) {
    const match = colorType.re.exec(color);
    if (match) {
      return colorType.process(match);
    }
  }
  return null;
}

function normalize(colorComponent: number | undefined, def = 0, max = 255): number {
  if (colorComponent === undefined || Number.isNaN(colorComponent) || colorComponent < 0) {
    return def;
  }
  return colorComponent > max ? max : colorComponent;
}

function toHexFromRgb(r: number, g: number, b: number): string {
  // eslint-disable-next-line no-bitwise
  return `#${(0X01000000 | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function toHsvFromRgb(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let H = 0;
  let S = 0;
  let V = max;
  S = max === 0 ? 0 : 1 - min / max;

  if (max === min) {
    H = 0;
  } else {
    switch (max) {
      case r:
        H = 60 * ((g - b) / delta);
        if (g < b) {
          H += 360;
        }
        break;
      case g:
        H = 60 * ((b - r) / delta) + 120;
        break;
      case b:
        H = 60 * ((r - g) / delta) + 240;
        break;
      default:
        break;
    }
  }

  S *= 100;
  V *= 100 / 255;

  return {
    h: Math.round(H),
    s: Math.round(S),
    v: Math.round(V),
  };
}

function calculateHue(r: number, g: number, b: number, delta: number): number {
  const max = Math.max(r, g, b);
  switch (max) {
    case r:
      return (g - b) / delta + (g < b ? 6 : 0);
    case g:
      return (b - r) / delta + 2;
    case b:
      return (r - g) / delta + 4;
    default:
      return 0; // unreachable: max is always one of r, g, b
  }
}

function toHslFromRgb(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const r01 = convertTo01Bounds(r, 255);
  const g01 = convertTo01Bounds(g, 255);
  const b01 = convertTo01Bounds(b, 255);

  const max = Math.max(r01, g01, b01);
  const min = Math.min(r01, g01, b01);
  const maxMinSum = max + min;
  let h = 0;
  let s = 0;
  const l = maxMinSum / 2;

  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const delta = max - min;

    if (l > 0.5) {
      s = delta / (2 - maxMinSum);
    } else {
      s = delta / maxMinSum;
    }

    h = calculateHue(r01, g01, b01, delta);
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function isIntegerBetweenMinAndMax(value: unknown, min = 0, max = 255): value is number {
  if (typeof value !== 'number'
       || value % 1 !== 0
       || value < min
       || value > max
       || isNaN(value)) {
    return false;
  }

  return true;
}

export class Color {
  baseColor: string | undefined;

  r!: number;

  g!: number;

  b!: number;

  a!: number;

  hsv!: { h: number; s: number; v: number };

  hsl!: { h: number; s: number; l: number };

  colorIsInvalid = false;

  constructor(value?: string) {
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
    r: unknown,
    g: unknown,
    b: unknown,
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

  static isValidAlpha(a: unknown): a is number {
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

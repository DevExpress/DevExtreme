export function makeColorTint(colorPart: string, h: number): number {
  let colorTint = h;
  if (colorPart === 'r') {
    colorTint = h + 1 / 3;
  }
  if (colorPart === 'b') {
    colorTint = h - 1 / 3;
  }

  return colorTint;
}

export function modifyColorTint(colorTint: number): number {
  let tint = colorTint;
  if (tint < 0) {
    tint += 1;
  }
  if (tint > 1) {
    tint -= 1;
  }

  return tint;
}

export function hueToRgb(p: number, q: number, colorTint: number): number {
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

export function convertTo01Bounds(n: number, max: number): number {
  const bounded = Math.min(max, Math.max(0, n));
  if (Math.abs(bounded - max) < 0.000001) {
    return 1;
  }
  return (bounded % max) / max;
}

export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
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

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
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

export type ColorParseResult = | [number, number, number]
  | [number, number, number, number]
  | [number, number, number, number, [number, number, number]]
  | [number, number, number, number, null, [number, number, number]];

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

export function parseColor(color: string): ColorParseResult | null {
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

export function normalize(colorComponent: number | undefined, def = 0, max = 255): number {
  if (colorComponent === undefined || Number.isNaN(colorComponent) || colorComponent < 0) {
    return def;
  }
  return colorComponent > max ? max : colorComponent;
}

export function toHexFromRgb(r: number, g: number, b: number): string {
  // eslint-disable-next-line no-bitwise
  return `#${(0X01000000 | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export function toHsvFromRgb(r: number, g: number, b: number): { h: number; s: number; v: number } {
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

export function toHslFromRgb(r: number, g: number, b: number): { h: number; s: number; l: number } {
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

export function isIntegerBetweenMinAndMax(value: unknown, min = 0, max = 255): value is number {
  if (typeof value !== 'number'
       || value % 1 !== 0
       || value < min
       || value > max
       || isNaN(value)) {
    return false;
  }

  return true;
}

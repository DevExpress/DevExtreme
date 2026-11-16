declare module 'wawoff2' {
  export function compress(font: Uint8Array): Promise<Uint8Array>;
  export function decompress(font: Uint8Array): Promise<Uint8Array>;
}

declare module 'cubic2quad' {
  // [x1, y1, cx1, cy1, x2, y2, cx2, cy2, x3, y3, ...]: quadratic curves sharing end points.
  export default function cubicToQuad(
    p1x: number, p1y: number,
    c1x: number, c1y: number,
    c2x: number, c2y: number,
    p2x: number, p2y: number,
    errorBound: number,
  ): number[];
}

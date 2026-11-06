declare module 'wawoff2' {
  export function compress(font: Uint8Array): Promise<Uint8Array>;
  export function decompress(font: Uint8Array): Promise<Uint8Array>;
}

declare module 'svg2ttf' {
  export default function svg2ttf(
    svgFont: string,
    options?: { familyname?: string; version?: string; ts?: number },
  ): { buffer: Uint8Array };
}

declare module 'ttf2woff' {
  export default function ttf2woff(font: Uint8Array): Uint8Array;
}

declare module 'wawoff2' {
  export function compress(font: Uint8Array): Promise<Uint8Array>;
  export function decompress(font: Uint8Array): Promise<Uint8Array>;
}

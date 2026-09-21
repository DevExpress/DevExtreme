declare module 'opentype.js' {
  // opentype.js hands glyphs back opaquely; nothing here reads inside one.
  type Glyph = Record<string, never>;

  interface GlyphSet {
    font: Font;
    glyphs: ArrayLike<Glyph>;
    length: number;

    get: (index: number) => Glyph;
    push: (index: number, loader: (font: Font, index: number) => Glyph) => void;
  }

  interface Font {
    glyphs: GlyphSet;
  }

  export function loadSync(url: string): Font;
}

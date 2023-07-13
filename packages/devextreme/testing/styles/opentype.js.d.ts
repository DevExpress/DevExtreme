declare module 'opentype.js' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Glyph { }

    interface GlyphSet {
        font: Font;
        // eslint-disable-next-line spellcheck/spell-checker
        glyphs: ArrayLike<Glyph>;
        length: number;

        get(index: Number): Glyph;
        push(index: Number, loader: (font: Font, index: Number) => Glyph);
    }

    interface Font {
        // eslint-disable-next-line spellcheck/spell-checker
        glyphs: GlyphSet;
    }

    export function loadSync(url: string): Font;
}

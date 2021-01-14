declare module 'font-carrier' {
    interface Glyph { }

    interface Font {
        allGlyph(): Glyph[]
    }

    export function transfer(input: string, options?: any): Font;
}

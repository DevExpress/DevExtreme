declare module 'font-carrier' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Glyph { }

    interface Font {
        allGlyph(): Glyph[];
    }

    export function transfer(input: string, options?: any): Font;
}

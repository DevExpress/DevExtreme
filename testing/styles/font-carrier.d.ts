declare module 'font-carrier' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Glyph { }

    interface Font {
        allGlyph(): Glyph[];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function transfer(input: string, options?: any): Font;
}

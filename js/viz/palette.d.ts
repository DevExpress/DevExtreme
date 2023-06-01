import {
    Palette,
    PaletteColorSet,
    PaletteExtensionMode,
} from '../common/charts';

export {
    Palette,
    PaletteColorSet,
    PaletteExtensionMode,
};

/**
 * @docid viz.currentPalette
 * @publicName currentPalette()
 * @static
 * @public
 */
export function currentPalette(): string;

/**
 * @docid viz.currentPalette
 * @publicName currentPalette(paletteName)
 * @static
 * @public
 */
export function currentPalette(paletteName: string): void;

/**
 * @docid viz.generateColors
 * @publicName generateColors(palette, count, options)
 * @param1 palette:Enums.Palette|Array<string>
 * @param3_field paletteExtensionMode:Enums.PaletteExtensionMode
 * @static
 * @public
 */
export function generateColors(palette: Palette | Array<string>, count: number, options: { paletteExtensionMode?: PaletteExtensionMode; baseColorSet?: PaletteColorSet }): Array<string>;

/**
 * @docid viz.getPalette
 * @publicName getPalette(paletteName)
 * @return object
 * @static
 * @public
 */
export function getPalette(paletteName: string): any;

/**
 * @docid viz.registerPalette
 * @publicName registerPalette(paletteName, palette)
 * @param2 palette:object
 * @static
 * @public
 */
export function registerPalette(paletteName: string, palette: any): void;

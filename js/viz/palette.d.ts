import {
    VizPalette,
    VizPaletteExtensionMode,
    VizPaletteColorSet,
} from '../types/enums';

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
 * @param1 palette:Enums.VizPalette|Array<string>
 * @param3_field paletteExtensionMode:Enums.VizPaletteExtensionMode
 * @param3_field baseColorSet:Enums.VizPaletteColorSet
 * @static
 * @public
 */
export function generateColors(palette: VizPalette | Array<string>, count: number, options: { paletteExtensionMode?: VizPaletteExtensionMode; baseColorSet?: VizPaletteColorSet }): Array<string>;

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

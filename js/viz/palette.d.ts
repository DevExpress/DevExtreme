import {
    PaletteType,
    PaletteExtensionModeType,
    VizPaletteColorSet,
} from '../docEnums';

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
 * @param1 palette:docEnums.PaletteType|Array<string>
 * @param3_field1 paletteExtensionMode:docEnums.PaletteExtensionModeType
 * @param3_field2 baseColorSet:docEnums.VizPaletteColorSet
 * @static
 * @public
 */
export function generateColors(palette: PaletteType | Array<string>, count: number, options: { paletteExtensionMode?: PaletteExtensionModeType; baseColorSet?: VizPaletteColorSet }): Array<string>;

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

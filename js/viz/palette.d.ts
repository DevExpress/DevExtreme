import {
    PaletteType,
    PaletteExtensionModeType,
    VizPaletteColorSet,
} from '../docEnums';

/**
 * @docid viz.currentPalette
 * @publicName currentPalette()
 * @return string
 * @static
 * @module viz/palette
 * @export currentPalette
 * @public
 */
export function currentPalette(): string;

/**
 * @docid viz.currentPalette
 * @publicName currentPalette(paletteName)
 * @param1 paletteName:string
 * @static
 * @module viz/palette
 * @export currentPalette
 * @public
 */
export function currentPalette(paletteName: string): void;

/**
 * @docid viz.generateColors
 * @publicName generateColors(palette, count, options)
 * @param1 palette:PaletteType|Array<string>
 * @param2 count:number
 * @param3 options:object
 * @param3_field1 paletteExtensionMode:PaletteExtensionModeType
 * @param3_field2 baseColorSet:VizPaletteColorSet
 * @return Array<string>
 * @static
 * @module viz/palette
 * @export generateColors
 * @public
 */
export function generateColors(palette: PaletteType | Array<string>, count: number, options: { paletteExtensionMode?: PaletteExtensionModeType; baseColorSet?: VizPaletteColorSet }): Array<string>;

/**
 * @docid viz.getPalette
 * @publicName getPalette(paletteName)
 * @param1 paletteName:string
 * @return object
 * @static
 * @module viz/palette
 * @export getPalette
 * @public
 */
export function getPalette(paletteName: string): any;

/**
 * @docid viz.registerPalette
 * @publicName registerPalette(paletteName, palette)
 * @param1 paletteName:string
 * @param2 palette:object
 * @static
 * @module viz/palette
 * @export registerPalette
 * @public
 */
export function registerPalette(paletteName: string, palette: any): void;

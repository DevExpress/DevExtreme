
export type PaletteType = 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
export type PaletteExtensionModeType = 'alternate' | 'blend' | 'extrapolate';
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
 * @param1 palette:Enums.VizPalette|Array<string>
 * @param2 count:number
 * @param3 options:object
 * @param3_field1 paletteExtensionMode:Enums.VizPaletteExtensionMode
 * @param3_field2 baseColorSet:Enums.VizPaletteColorSet
 * @return Array<string>
 * @static
 * @module viz/palette
 * @export generateColors
 * @public
 */
export function generateColors(palette: PaletteType | Array<string>, count: number, options: { paletteExtensionMode?: PaletteExtensionModeType, baseColorSet?: 'simpleSet' | 'indicatingSet' | 'gradientSet' }): Array<string>;

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
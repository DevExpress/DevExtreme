

/**
 * @docid vizmethods.currentPalette
 * @publicName currentPalette()
 * @return string
 * @static
 * @module viz/palette
 * @export currentPalette
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export function currentPalette(): string;

/**
 * @docid vizmethods.currentPalette
 * @publicName currentPalette(paletteName)
 * @param1 paletteName:string
 * @static
 * @module viz/palette
 * @export currentPalette
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export function currentPalette(paletteName: string): void;

/**
 * @docid vizmethods.generateColors
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
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export function generateColors(palette: 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office' | Array<string>, count: number, options: { paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate', baseColorSet?: 'simpleSet' | 'indicatingSet' | 'gradientSet' }): Array<string>;

/**
 * @docid vizmethods.getPalette
 * @publicName getPalette(paletteName)
 * @param1 paletteName:string
 * @return object
 * @static
 * @module viz/palette
 * @export getPalette
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export function getPalette(paletteName: string): any;

/**
 * @docid vizmethods.registerPalette
 * @publicName registerPalette(paletteName, palette)
 * @param1 paletteName:string
 * @param2 palette:object
 * @static
 * @module viz/palette
 * @export registerPalette
 * @prevFileNamespace DevExpress.viz
 * @public
 */
export function registerPalette(paletteName: string, palette: any): void;
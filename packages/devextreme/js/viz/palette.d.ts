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
 * Gets the current palette&apos;s name.
 */
export function currentPalette(): string;

/**
 * Changes the current palette for all data visualization UI components on the page.
 */
export function currentPalette(paletteName: string): void;

/**
 * Returns a subset of palette colors.
 */
export function generateColors(palette: Palette | Array<string>, count: number, options: { paletteExtensionMode?: PaletteExtensionMode; baseColorSet?: PaletteColorSet }): Array<string>;

/**
 * Gets the color sets of a predefined or registered palette.
 */
export function getPalette(paletteName: string): any;

/**
 * Registers a new palette.
 */
export function registerPalette(paletteName: string, palette: any): void;

import { Palette } from 'devextreme/viz/pie_chart';
import { PaletteExtensionMode } from 'devextreme/common/charts';

export const paletteCollection: Palette[] = ['Material', 'Soft Pastel', 'Harmony Light', 'Pastel', 'Bright', 'Soft', 'Ocean', 'Office', 'Vintage', 'Violet', 'Carmine', 'Dark Moon', 'Soft Blue', 'Dark Violet', 'Green Mist'];
export const paletteExtensionModes: PaletteExtensionMode[] = ['alternate', 'blend', 'extrapolate'];

const data: ({ arg: string; val: number; })[] = [];
for (let i = 0; i < 20; i += 1) {
  data.push({
    arg: `item${i}`,
    val: 1,
  });
}
export const dataSource = data;

export const paletteLabel = { 'aria-label': 'Palette' };
export const paletteExtensionLabel = { 'aria-label': 'Palette Extension Mode' };

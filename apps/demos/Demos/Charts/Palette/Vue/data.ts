import { type DxPieChartTypes } from 'devextreme-vue/pie-chart';
import { type PaletteExtensionMode } from 'devextreme-vue/common/charts';

export const paletteCollection: DxPieChartTypes.Palette[] = ['Material', 'Soft Pastel', 'Harmony Light', 'Pastel', 'Bright', 'Soft', 'Ocean', 'Office', 'Vintage', 'Violet', 'Carmine', 'Dark Moon', 'Soft Blue', 'Dark Violet', 'Green Mist'];
export const paletteExtensionModes: PaletteExtensionMode[] = ['alternate', 'blend', 'extrapolate'];

const data = [];
for (let i = 0; i < 20; i += 1) {
  data.push({
    arg: `item${i}`,
    val: 1,
  });
}
export const dataSource = data;

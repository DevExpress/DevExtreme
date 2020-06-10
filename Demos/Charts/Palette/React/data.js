export const paletteCollection = ['Material', 'Soft Pastel', 'Harmony Light', 'Pastel', 'Bright', 'Soft', 'Ocean', 'Office', 'Vintage', 'Violet', 'Carmine', 'Dark Moon', 'Soft Blue', 'Dark Violet', 'Green Mist'];
export const paletteExtensionModes = ['Alternate', 'Blend', 'Extrapolate'];

const data = [];
for (let i = 0; i < 20; i++) {
  data.push({
    arg: `item${i}`,
    val: 1
  });
}
export const dataSource = data;

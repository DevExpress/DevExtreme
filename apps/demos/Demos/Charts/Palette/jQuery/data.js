const paletteCollection = ['Material', 'Soft Pastel', 'Harmony Light', 'Pastel', 'Bright', 'Soft', 'Ocean', 'Office', 'Vintage', 'Violet', 'Carmine', 'Dark Moon', 'Soft Blue', 'Dark Violet', 'Green Mist'];
const paletteExtensionModes = ['alternate', 'blend', 'extrapolate'];
const dataSource = [];
let i;

for (i = 0; i < 20; i += 1) {
  dataSource.push({
    arg: `item${i}`,
    val: 1,
  });
}

export const skippedTests = {
  jQuery: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  Angular: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  React: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    // With templatesRenderAsynchronously the search highlighting nests spans once per column,
    // which shifts the column widths. Remove once the grid_core search fix is merged.
    TreeList: ['FilterModes'],
  },
  Vue: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
};

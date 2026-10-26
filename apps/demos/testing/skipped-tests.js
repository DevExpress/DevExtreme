export const skippedTests = {
  jQuery: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    // OSM uses synthetic tiles in tests: keep accessibility/CSP checks, skip screenshots.
    Map: ['ProvidersAndTypes', 'Markers', 'Routes', 'OpenStreetMapProvider'],
  },
  Angular: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  React: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  Vue: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
};

export const skippedTests = {
  jQuery: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  Angular: {
    Scheduler: ['Templates'],
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  React: {
    // NOTE: 'GroupByDate' demo has problems with rendering
    Scheduler: ['GroupByDate', 'Templates'],
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  Vue: {
    Scheduler: ['Templates'],
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
};

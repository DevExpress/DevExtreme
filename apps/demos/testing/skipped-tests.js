export const skippedTests = {
  jQuery: {
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  Angular: {
    // Common: ['PopupAndNotificationsOverview'],
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
    // Common: ['PopupAndNotificationsOverview'],
    Scheduler: ['Templates'],
    // WebGL initialization error at the provider. There is no point in adding a mask
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
};

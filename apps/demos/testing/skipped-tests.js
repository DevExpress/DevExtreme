export const skippedTests = {
  jQuery: {
    DataGrid: ['SignalRService', 'BatchUpdateRequest'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  Angular: {
    Common: ['PopupAndNotificationsOverview'],
    DataGrid: ['SignalRService', 'BatchUpdateRequest'],
    Scheduler: ['Templates'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  React: {
    DataGrid: ['SignalRService', 'BatchUpdateRequest'],
    // NOTE: 'GroupByDate' demo has problems with rendering
    Scheduler: ['GroupByDate', 'Templates'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  Vue: {
    Common: ['PopupAndNotificationsOverview'],
    Scheduler: ['Templates'],
    DataGrid: ['SignalRService', 'BatchUpdateRequest'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
};

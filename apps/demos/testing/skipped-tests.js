export const skippedTests = {
  jQuery: {
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  Angular: {
    Common: ['PopupAndNotificationsOverview'],
    DataGrid: ['SignalRService'],
    Scheduler: ['Templates'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    Gantt: ['TaskTemplate', 'Validation'],
  },
  React: {
    DataGrid: ['SignalRService'],
    // NOTE: 'GroupByDate' demo has problems with rendering
    Scheduler: ['GroupByDate', 'Templates'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    Gantt: ['Validation'],
  },
  Vue: {
    Common: ['PopupAndNotificationsOverview'],
    Charts: ['PointsAggregation'],
    Scheduler: ['Templates'],
    DataGrid: ['SignalRService'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    Gantt: ['Validation'],
  },
};

export const skippedTests = {
  jQuery: {
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  Angular: {
    Common: ['PopupAndNotificationsOverview'],
    DataGrid: ['SignalRService', 'MultipleRecordSelectionModes', 'RemoteCRUDOperations'],
    Scheduler: ['Templates'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    Gantt: ['TaskTemplate', 'Validation'],
    TreeView: ['LoadDataOnDemand'],
    Chart: ['LoadDataOnDemand'],
  },
  React: {
    DataGrid: ['Toolbar', 'SignalRService', 'MultipleRecordSelectionModes'],
    // NOTE: 'GroupByDate' demo has problems with rendering
    Scheduler: ['GroupByDate', 'Templates'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    Gantt: ['Validation'],
  },
  Vue: {
    Common: ['PopupAndNotificationsOverview'],
    Charts: ['PointsAggregation'],
    Scheduler: ['Templates'],
    DataGrid: ['SignalRService', 'MultipleRecordSelectionModes'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    Gantt: ['Validation'],
  },
};

export const skippedTests = {
  jQuery: {
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  Angular: {
    Common: ['PopupAndNotificationsOverview'],
    DataGrid: ['SignalRService', 'MultipleRecordSelectionModes', 'RemoteCRUDOperations'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    Gantt: ['TaskTemplate', 'Validation'],
    TreeView: ['LoadDataOnDemand'],
    Chart: ['LoadDataOnDemand'],
  },
  React: {
    DataGrid: ['Toolbar', 'SignalRService', 'MultipleRecordSelectionModes'],
    // NOTE: 'GroupByDate' demo has problems with rendering
    Scheduler: ['GroupByDate'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    Gantt: ['Validation'],
  },
  Vue: {
    Common: ['PopupAndNotificationsOverview'],
    Charts: ['PointsAggregation'],
    DataGrid: ['SignalRService', 'MultipleRecordSelectionModes'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    Gantt: ['Validation'],
  },
};

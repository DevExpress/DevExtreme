// import { THEME } from '../utils/visual-tests/helpers/theme-utils';

export const skippedTests = {
  jQuery: {
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  Angular: {
    Common: ['PopupAndNotificationsOverview'],
    DataGrid: ['SignalRService', 'MultipleRecordSelectionModes'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    Gantt: ['TaskTemplate', 'Validation'],
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

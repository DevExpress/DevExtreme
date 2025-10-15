import { THEME } from '../utils/visual-tests/helpers/theme-utils';

export const skippedTests = {
  jQuery: {
    Charts: [
      { demo: 'AjaxRequest', themes: [THEME.material] },
      { demo: 'ServerSideDataProcessing', themes: [THEME.material] },
      // NOTE: Requires preload font, which not work in testcafe
      { demo: 'SpiderWeb', themes: [THEME.material] },
    ],
    // Gantt: ['TaskTemplate', 'Validation'],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  Angular: {
    Common: ['PopupAndNotificationsOverview'],
    Gantt: ['TaskTemplate', 'Validation'],
    DataGrid: [
      // jQuery demo uses a different show-checkboxes mode
      { demo: 'MultipleRecordSelectionModes', themes: [THEME.fluent] },
      { demo: 'SignalRService', themes: [THEME.fluent] },
    ],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
  },
  React: {
    DataGrid: [
      // jQuery demo uses a different show-checkboxes mode
      { demo: 'MultipleRecordSelectionModes', themes: [THEME.fluent] },
      { demo: 'Toolbar', themes: [THEME.fluent] },
      { demo: 'SignalRService', themes: [THEME.fluent] },
    ],
    Scheduler: [
      // NOTE: 'GroupByDate' demo has problems with rendering
      { demo: 'GroupByDate', themes: [THEME.fluent] },
    ],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    Gantt: ['Validation'],
  },
  Vue: {
    Common: ['PopupAndNotificationsOverview'],
    Charts: ['PointsAggregation'],
    DataGrid: [
      // jQuery demo uses a different show-checkboxes mode
      { demo: 'MultipleRecordSelectionModes', themes: [THEME.fluent] },
      { demo: 'SignalRService', themes: [THEME.fluent] },
    ],
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    Gantt: ['Validation'],
  },
};

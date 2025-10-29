import { THEME } from '../utils/visual-tests/helpers/theme-utils';

export const skippedTests = {
  jQuery: {
    Map: ['ProvidersAndTypes', 'Markers', 'Routes'],
    DataGrid: [
      { demo: 'RealTimeUpdates', themes: [THEME.material] },
      { demo: 'MultiRowHeadersBands', themes: [THEME.material] },
    ],
    TreeList: [
      { demo: 'FilterRow', themes: [THEME.material] },
      { demo: 'PopupEditing', themes: [THEME.material] },
    ],
    PivotGrid: [
      { demo: 'SummaryDisplayModes', themes: [THEME.material] },
      { demo: 'RunningTotals', themes: [THEME.material] },
    ],
    Gauges: [
      { demo: 'DifferentSubvalueIndicatorTypesLinearGauge', themes: [THEME.material] },
      { demo: 'Tooltip', themes: [THEME.material] },
      { demo: 'ScaleLabelFormatting', themes: [THEME.material] },
    ],
    Gantt: [
      { demo: 'HeaderFilter', themes: [THEME.material] },
      { demo: 'ContextMenu', themes: [THEME.material] },
    ],
    Charts: [
      { demo: 'Line', themes: [THEME.material] },
      { demo: 'SmallValueGroups', themes: [THEME.material] },
      { demo: 'SankeyChart', themes: [THEME.material] },
      { demo: 'DoughnutSelection', themes: [THEME.material] },
      { demo: 'AreaSelectionZooming', themes: [THEME.material] },
      { demo: 'WindRose', themes: [THEME.material] },
      { demo: 'RangeBar', themes: [THEME.material] },
      { demo: 'Pie', themes: [THEME.material] },
    ],
    RangeSelector: [
      { demo: 'EmbeddedChart', themes: [THEME.material] },
    ]
  },
  Angular: {
    Common: ['PopupAndNotificationsOverview'],
    DataGrid: ['SignalRService', 'MultipleRecordSelectionModes', 'RemoteCRUDOperations'],
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

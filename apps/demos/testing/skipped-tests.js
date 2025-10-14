import { THEME } from '../utils/visual-tests/helpers/theme-utils';

export const skippedTests = {
  jQuery: {
    Charts: [
      { demo: 'ServerSideDataProcessing', themes: [THEME.material] },
      { demo: 'SpiderWeb', themes: [THEME.material] }, // NOTE: Requires preload font, which not work in testcafe
    ],
    Gantt: [
      { demo: 'TaskTemplate', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'Validation', themes: [THEME.generic, THEME.material, THEME.fluent] },
    ],
    Map: [
      { demo: 'ProvidersAndTypes', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'Markers', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'Routes', themes: [THEME.generic, THEME.material, THEME.fluent] },
    ],
  },
  Angular: {
    Map: [
      { demo: 'ProvidersAndTypes', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'Markers', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'Routes', themes: [THEME.generic, THEME.material, THEME.fluent] },
    ],
    PivotGrid: [
      { demo: 'Overview', themes: [THEME.material] },
      { demo: 'ChartIntegration', themes: [THEME.material] },
    ],
    TreeList: [
      { demo: 'BatchEditing', themes: [THEME.material] },
      { demo: 'RowEditing', themes: [THEME.material] },
      { demo: 'PopupEditing', themes: [THEME.material] },
      { demo: 'FormEditing', themes: [THEME.material] },
      { demo: 'CellEditing', themes: [THEME.material] },
      { demo: 'Resizing', themes: [THEME.material] },
    ],
    Gantt: [
      { demo: 'TaskTemplate', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'Validation', themes: [THEME.generic, THEME.material, THEME.fluent] },
    ],
  },
  React: {
    DataGrid: [
      { demo: 'SignalRService', themes: [THEME.material, THEME.fluent] },
      { demo: 'EditStateManagement', themes: [THEME.material] },
      { demo: 'MultipleRecordSelectionModes', themes: [THEME.fluent] },
      { demo: 'Toolbar', themes: [THEME.fluent, THEME.material] },
      { demo: 'MultipleRecordSelectionAPI', themes: [THEME.material] },
      { demo: 'CellEditing', themes: [THEME.material] },
    ],
    Gantt: [
      { demo: 'Validation', themes: [THEME.generic, THEME.material, THEME.fluent] },
    ],
    Map: [
      { demo: 'ProvidersAndTypes', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'Markers', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'Routes', themes: [THEME.generic, THEME.material, THEME.fluent] },
    ],
  },
  Vue: {
    Map: [
      { demo: 'ProvidersAndTypes', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'Markers', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'Routes', themes: [THEME.generic, THEME.material, THEME.fluent] },
    ],
  },
};

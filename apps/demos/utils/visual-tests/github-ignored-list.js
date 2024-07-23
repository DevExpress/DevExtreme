/* eslint-disable spellcheck/spell-checker */
// ignored because they have import of localization package and fail during bundling
// 2 for Grid (RowTemplate, CellCustomization)
const ignoredLocalization = ['Localization', 'RowTemplate', 'CellCustomization', 'TimeZonesSupport', 'ExportToPDF'];
// ignored becuse react and vue fail to max callstack exceeded

const ignoredCallstack = [
  'AdvancedMasterDetailView',
  'BatchUpdateRequest',
  'CollaborativeEditing',
  'CustomEditors',
  'CustomNewRecordPosition',
  'DataValidation',
  'EditStateManagement', // fail only in vue
  'RemoteGrouping',
  'RemoteReordering',
  'RemoteVirtualScrolling',
  'WebAPIService',
];

// ignored, because test uses DevExtreme which is not defined
// (probably something with path on CI, need to research)
const ignoredDevextreme = ['SignalRService'];

// ignored vue some problems with template + 1 miss style
const ignoredVue = [
  'FilteringAPI',
  'MultiRowHeadersBands',
  'RightToLeftSupport',
  'EditStateManagement',
];

export const gitHubIgnored = [
  ...ignoredLocalization,
  ...ignoredCallstack,
  ...ignoredDevextreme,
  ...ignoredVue,
];

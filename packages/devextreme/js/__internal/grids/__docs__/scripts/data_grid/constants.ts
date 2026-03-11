import * as path from 'path';

export const DATA_GRID_ROOT = path.resolve(__dirname, '..', '..', '..', 'data_grid');
export const GRID_CORE_ROOT = path.resolve(__dirname, '..', '..', '..', 'grid_core');
export const OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'artifacts');

export const EXCLUDED_DIRS = new Set(['__tests__', '__mock__', 'scripts', 'new', '__docs__']);
export const EXCLUDED_FILE_NAMES = new Set<string>();

export const REGISTER_MODULE_RECEIVERS = new Set([
  'gridCore',
  'core',
  'treeListCore',
  'dataGridCore',
]);

export const DATA_SOURCE_ADAPTER_PROVIDER = 'dataSourceAdapterProvider';

export const GRID_CORE_IMPORT_PATTERNS = [
  '@ts/grids/grid_core/',
  '../../grid_core/',
  '../../../grid_core/',
];

export type ModificationCategory = 'passthrough' | 'extended' | 'replaced' | 'new';

const DATA_GRID_FEATURE_MAP: Record<string, string> = {
  m_data_controller: 'Data',
  m_data_source_adapter: 'Data',
  m_core: 'Core',
  m_widget: 'Core',
  m_widget_base: 'Core',
  m_utils: 'Core',
  m_editing: 'Editing',
  grouping: 'Grouping',
  summary: 'Summary',
  export: 'Export',
  keyboard_navigation: 'Navigation',
  focus: 'Navigation',
  m_columns_controller: 'Columns',
  m_aggregate_calculator: 'Data',
  module_not_extended: 'Passthrough',
};

const MODULE_NOT_EXTENDED_FEATURE_MAP: Record<string, string> = {
  sorting: 'Sorting',
  selection: 'Selection',
  search: 'Filtering',
  filter_row: 'Filtering',
  filter_sync: 'Filtering',
  filter_panel: 'Filtering',
  filter_builder: 'Filtering',
  header_filter: 'Filtering',
  column_headers: 'Columns',
  column_chooser: 'Column Management',
  column_fixing: 'Column Management',
  sticky_columns: 'Column Management',
  virtual_columns: 'Column Management',
  columns_resizing_reordering: 'Column Management',
  adaptivity: 'Column Management',
  keyboard_navigation: 'Navigation',
  editing_row_based: 'Editing',
  editing_form_based: 'Editing',
  editing_cell_based: 'Editing',
  editor_factory: 'Editing',
  validating: 'Editing',
  virtual_scrolling: 'Scrolling',
  state_storing: 'State',
  pager: 'Paging',
  rows: 'Core',
  grid_view: 'Core',
  header_panel: 'Columns',
  context_menu: 'Core',
  error_handling: 'Core',
  master_detail: 'Master Detail',
  row_dragging: 'Row Dragging',
  toast: 'Core',
  ai_column: 'AI',
};

export function getFeatureAreaFromPath(relPath: string): string {
  const segments = relPath.split('/');
  const firstSegment = segments[0];

  if (firstSegment === 'module_not_extended') {
    const fileName = segments[1]?.replace('.ts', '') ?? '';
    return MODULE_NOT_EXTENDED_FEATURE_MAP[fileName] ?? 'Other';
  }

  if (DATA_GRID_FEATURE_MAP[firstSegment]) {
    return DATA_GRID_FEATURE_MAP[firstSegment];
  }

  const baseName = firstSegment.replace('.ts', '');
  if (DATA_GRID_FEATURE_MAP[baseName]) {
    return DATA_GRID_FEATURE_MAP[baseName];
  }

  return 'Other';
}

export const WIDGET_BASE_FILE = path.resolve(DATA_GRID_ROOT, 'm_widget_base.ts');

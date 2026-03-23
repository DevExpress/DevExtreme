import * as path from 'path';

export const GRID_CORE_ROOT = path.resolve(__dirname, '..', '..', '..', 'grid_core');
export const OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'artifacts');

export const MODULE_SUFFIX = 'Module';
export const MODULES_PREFIX = 'modules.';
export const MODULE_ITEM_CLASS = 'ModuleItem';
export const M_MODULES_PATH = 'm_modules';
export const BARE_MODULE_BASES = ['Controller', 'View', 'ViewController'];

export const EXCLUDED_DIRS = new Set(['__tests__', 'scripts', 'new', '__docs__']);
export const EXCLUDED_FILE_NAMES = new Set(['m_modules.ts']);

const CORE_DIRECTORY_FEATURE_MAP: Record<string, string> = {
  data_controller: 'Data',

  views: 'Core',
  editor_factory: 'Core',
  error_handling: 'Core',

  editing: 'Editing',
  validating: 'Editing',

  selection: 'Selection',

  filter: 'Filtering',
  header_filter: 'Filtering',
  search: 'Filtering',

  keyboard_navigation: 'Navigation',
  focus: 'Navigation',

  columns_controller: 'Columns Core',
  column_headers: 'Columns Core',
  header_panel: 'Columns Core',

  column_chooser: 'Column Management',
  column_fixing: 'Column Management',
  sticky_columns: 'Column Management',
  virtual_columns: 'Column Management',
  columns_resizing_reordering: 'Column Management',
  adaptivity: 'Column Management',

  virtual_scrolling: 'Scrolling',

  ai_column: 'AI',
  ai_prompt_editor: 'AI',
};

/**
 * Derive the feature area from a file path relative to grid_core root.
 * Uses the first directory segment to look up the feature, defaulting to 'Other'.
 */
export function getFeatureAreaFromPath(relPath: string): string {
  const firstSegment = relPath.split('/')[0];
  return CORE_DIRECTORY_FEATURE_MAP[firstSegment] ?? 'Other';
}

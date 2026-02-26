/**
 * Constants and configuration for Grid Core Architecture Documentation Generator.
 */

import * as path from 'path';

import type { ExternalClassInfo } from './types';

// ─── Paths ───────────────────────────────────────────────────────────────────

export const GRID_CORE_ROOT = path.resolve(__dirname, '..', '..', 'grid_core');
export const OUTPUT_DIR = path.resolve(__dirname, '..', 'artifacts');

// ─── Magic Strings ───────────────────────────────────────────────────────────

export const MODULE_SUFFIX = 'Module';
export const MODULES_PREFIX = 'modules.';
export const MODULE_ITEM_CLASS = 'ModuleItem';
export const M_MODULES_PATH = 'm_modules';
export const BARE_MODULE_BASES = ['Controller', 'View', 'ViewController'] as const;

// ─── Feature Areas ───────────────────────────────────────────────────────────

export const FEATURE_AREAS: Record<string, string> = {
  dataControllerModule: 'Core',
  columnsControllerModule: 'Core',
  gridViewModule: 'Core',
  rowsModule: 'Core',
  columnHeadersModule: 'Core',
  headerPanelModule: 'Core',
  editorFactoryModule: 'Core',
  errorHandlingModule: 'Core',

  editingModule: 'Editing',
  editingCellBasedModule: 'Editing',
  editingRowBasedModule: 'Editing',
  editingFormBasedModule: 'Editing',
  validatingModule: 'Editing',

  selectionModule: 'Selection',

  filterRowModule: 'Filtering',
  filterSyncModule: 'Filtering',
  filterPanelModule: 'Filtering',
  filterBuilderModule: 'Filtering',
  headerFilterModule: 'Filtering',
  searchModule: 'Filtering',

  keyboardNavigationModule: 'Navigation',
  headersKeyboardNavigationModule: 'Navigation',
  focusModule: 'Navigation',

  columnChooserModule: 'Column Management',
  columnFixingModule: 'Column Management',
  stickyColumnsModule: 'Column Management',
  virtualColumnsModule: 'Column Management',
  columnsResizingReorderingModule: 'Column Management',
  adaptivityModule: 'Column Management',

  virtualScrollingModule: 'Scrolling',

  masterDetailModule: 'Other',
  stateStoringModule: 'Other',
  rowDraggingModule: 'Other',
  pagerModule: 'Other',
  contextMenuModule: 'Other',
};

// ─── Standalone Class Info ────────────────────────────────────────────────────

/**
 * All classes that should appear as standalone nodes in the diagram
 * (outside of any module compound node).
 *
 * This includes:
 * - Base classes used by multiple modules (e.g. ColumnsView, SeparatorView)
 * - Classes registered as modules externally in data_grid/tree_list
 */
export const STANDALONE_CLASS_INFO: Record<string, ExternalClassInfo> = {
  // Base classes
  ColumnsView: { role: 'view', registeredAs: 'columnsView', featureArea: 'Core' },
  SeparatorView: { role: 'view', registeredAs: 'separatorView', featureArea: 'Column Management' },
  ColumnKeyboardNavigationController: { role: 'controller', registeredAs: 'columnKeyboardNavigation', featureArea: 'Navigation' },

  // Externally registered (assembled in data_grid/tree_list, not in grid_core modules)
  ToastViewController: { role: 'controller', registeredAs: 'toastViewController', featureArea: 'Other' },
  ToastView: { role: 'view', registeredAs: 'toastView', featureArea: 'Other' },
  AIColumnController: { role: 'controller', registeredAs: 'aiColumn', featureArea: 'AI' },
  AIColumnIntegrationController: { role: 'controller', registeredAs: 'aiColumnIntegration', featureArea: 'AI' },
  AIColumnCacheController: { role: 'controller', registeredAs: 'aiColumnCache', featureArea: 'AI' },
  AIPromptEditorViewController: { role: 'controller', registeredAs: 'aiPromptEditor', featureArea: 'AI' },
  AIPromptEditorView: { role: 'view', registeredAs: 'aiPromptEditorView', featureArea: 'AI' },
};

// ─── Excluded Directories for File Discovery ─────────────────────────────────

export const EXCLUDED_DIRS = new Set(['__tests__', 'scripts', 'new', '__docs__']);
export const EXCLUDED_FILE_NAME = 'm_modules.ts';

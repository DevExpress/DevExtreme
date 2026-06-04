import type { GridCommand } from '../types';
import {
  columnsPinningCommand,
  columnsReorderCommand,
  columnsResizeCommand,
  columnsVisibilityCommand,
} from './columns';
import {
  clearFilterCommand,
  filterValueCommand,
} from './filtering';
import {
  focusRowByIndexCommand,
  focusRowByKeyCommand,
} from './focus';
import {
  pageIndexCommand,
  pageSizeCommand,
  pagingCommand,
} from './paging';
import {
  searchingCommand,
} from './searching';
import {
  clearSelectionCommand,
  deselectAllCommand,
  selectAllCommand,
  selectByIndexesCommand,
  selectByKeysCommand,
} from './selection';
import {
  clearSortingCommand,
  sortingCommand,
} from './sorting';

export const coreCommands = [
  columnsPinningCommand,
  columnsReorderCommand,
  columnsResizeCommand,
  columnsVisibilityCommand,
  clearFilterCommand,
  filterValueCommand,
  focusRowByIndexCommand,
  focusRowByKeyCommand,
  pageIndexCommand,
  pageSizeCommand,
  pagingCommand,
  searchingCommand,
  clearSelectionCommand,
  deselectAllCommand,
  selectAllCommand,
  selectByIndexesCommand,
  selectByKeysCommand,
  clearSortingCommand,
  sortingCommand,
] as GridCommand[];

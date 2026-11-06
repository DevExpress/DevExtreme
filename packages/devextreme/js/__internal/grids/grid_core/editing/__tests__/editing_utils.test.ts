import { describe, expect, it } from '@jest/globals';
import type { GridsEditMode } from '@js/common/grids';

import {
  isCellBasedEditMode,
  isFormBasedEditMode,
  isRowBasedEditMode,
} from '../editing_utils';

describe('Edit mode checks', () => {
  it.each<[GridsEditMode, boolean, boolean, boolean]>([
    ['row', false, true, false],
    ['form', false, true, true],
    ['popup', false, true, true],
    ['cell', true, false, false],
    ['batch', true, false, false],
  ])('%s mode: cell-based %s, row-based %s, form-based %s', (
    editMode,
    isCellBased,
    isRowBased,
    isFormBased,
  ) => {
    expect(isCellBasedEditMode(editMode)).toBe(isCellBased);
    expect(isRowBasedEditMode(editMode)).toBe(isRowBased);
    expect(isFormBasedEditMode(editMode)).toBe(isFormBased);
  });
});

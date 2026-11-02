import { describe, expect, it } from '@jest/globals';
import type { GridsEditMode } from '@js/common/grids';

import { isRowOrFormEditMode } from '../utils';

describe('isRowOrFormEditMode', () => {
  it.each<[GridsEditMode, boolean]>([
    ['row', true],
    ['form', true],
    ['popup', false],
    ['cell', false],
    ['batch', false],
  ])('%s mode: %s', (editMode, expected) => {
    expect(isRowOrFormEditMode(editMode)).toBe(expected);
  });
});

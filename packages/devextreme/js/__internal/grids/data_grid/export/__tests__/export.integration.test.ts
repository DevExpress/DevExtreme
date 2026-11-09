import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../../grid_core/__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, value: 'a' },
  { id: 2, value: 'b' },
];

describe('Export button (T1337649)', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should be named after export.texts.exportTo when several formats are offered', async () => {
    const { component } = await createDataGrid({
      dataSource: DATA,
      export: {
        enabled: true,
        formats: ['xlsx', 'pdf'],
        texts: { exportTo: 'Download the grid' },
      },
    });

    expect(component.getExportButton().getButtonElement()?.getAttribute('aria-label')).toBe('Download the grid');
  });
});

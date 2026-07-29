import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import {
  afterTest, beforeTest, createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

const SCROLLER_SPACING_CLASS = 'dx-datagrid-scroller-spacing';

describe('ColumnsView scroller spacing (T1306973)', () => {
  beforeEach(() => {
    beforeTest();
  });

  afterEach(() => {
    afterTest();
  });

  it('should toggle the scroller spacing class on the headers view', async () => {
    const { instance } = await createDataGrid({
      dataSource: [{ id: 1, a: 'a', b: 'b' }],
      columns: ['a', 'b'],
    });
    const columnHeadersView = instance.getView('columnHeadersView');

    columnHeadersView.setScrollerSpacing(15);

    expect(columnHeadersView.element().hasClass(SCROLLER_SPACING_CLASS)).toBe(true);
    expect(columnHeadersView.element().css('paddingInlineEnd')).toBe('15px');

    columnHeadersView.setScrollerSpacing(0);

    expect(columnHeadersView.element().hasClass(SCROLLER_SPACING_CLASS)).toBe(false);
  });

  it('should toggle the scroller spacing class on the footer view', async () => {
    const { instance } = await createDataGrid({
      dataSource: [{ id: 1, a: 'a', b: 'b' }],
      columns: ['a', 'b'],
      summary: {
        totalItems: [{ column: 'a', summaryType: 'count' }],
      },
    });
    const footerView = instance.getView('footerView');

    footerView.setScrollerSpacing(15);

    expect(footerView.element().hasClass(SCROLLER_SPACING_CLASS)).toBe(true);

    footerView.setScrollerSpacing(0);

    expect(footerView.element().hasClass(SCROLLER_SPACING_CLASS)).toBe(false);
  });
});

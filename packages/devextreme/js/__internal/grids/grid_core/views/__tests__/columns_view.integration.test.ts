import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';

import {
  afterTest, beforeTest, createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

const SCROLLER_SPACING_CLASS = 'dx-datagrid-scroller-spacing';

describe('ColumnsView scroll preservation (T1335911)', () => {
  beforeEach(() => {
    beforeTest();
  });

  afterEach(() => {
    afterTest();
    jest.restoreAllMocks();
  });

  it.each([true, false])('preserves header and footer scroll during auto-width measurement with rtlEnabled=%s (T1335911)', async (rtlEnabled) => {
    jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(500);
    jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(24);
    const { $container, instance } = await createDataGrid({
      dataSource: [{
        id: 1, City: 'Atlanta', Phone: '123', Fax: '456',
      }],
      columns: ['City', {
        dataField: 'Phone', fixed: true, fixedPosition: 'right',
      }, {
        dataField: 'Fax', fixed: true, fixedPosition: 'right',
      }],
      columnWidth: 'auto',
      rtlEnabled,
      width: 500,
      summary: { totalItems: [{ column: 'City', summaryType: 'count' }] },
    });
    const header = $container.find('.dx-datagrid-headers .dx-datagrid-scroll-container').get(0) as HTMLElement;
    const footer = $container.find('.dx-datagrid-total-footer .dx-datagrid-scroll-container').get(0) as HTMLElement;
    const scrollLeft = rtlEnabled ? -50 : 50;
    header.scrollLeft = scrollLeft;
    footer.scrollLeft = scrollLeft;
    const { appendChild } = Node.prototype;
    let measured = false;
    jest.spyOn(Node.prototype, 'appendChild').mockImplementation(function append<T extends Node>(this: Node, child: T): T {
      const isHeader = child instanceof HTMLElement && !!child.querySelector('.dx-header-row');
      const result = appendChild.call(this, child) as T;
      if (isHeader && this instanceof HTMLElement && this.closest('.dx-datagrid-rowsview')) {
        measured = true;
        header.scrollLeft = 0;
        footer.scrollLeft = 0;
        header.dispatchEvent(new Event('scroll'));
        footer.dispatchEvent(new Event('scroll'));
      }
      return result;
    });

    instance.updateDimensions();
    jest.runAllTimers();

    expect(measured).toBe(true);
    expect(header.scrollLeft).toBe(scrollLeft);
    expect(footer.scrollLeft).toBe(scrollLeft);
  });
});

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

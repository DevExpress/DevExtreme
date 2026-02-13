import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

describe('Column Headers', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('headerCellTemplate', () => {
    it('should apply right alignment to number column when headerCellTemplate is used', async () => {
      const { component } = await createDataGrid({
        dataSource: [],
        showBorders: true,
        headerFilter: {
          visible: true,
        },
        columns: [
          {
            dataField: 'test',
            dataType: 'number',
            headerCellTemplate(headerElement) {
              $('<span>')
                .text('Test')
                .appendTo(headerElement);
            },
          },
        ],
      });
      expect(component.getHeaderCell(0).getAlignment()).toBe('right');
    });
  });

  describe('when cellHintEnabled: true', () => {
    const simulateTextOverflow = (
      element: HTMLElement,
      scrollWidth: number,
      clientWidth: number,
    ): void => {
      // Mock scrollWidth > clientWidth to simulate text overflow in a narrow column
      Object.defineProperty(element, 'scrollWidth', { value: scrollWidth, configurable: true });
      Object.defineProperty(element, 'clientWidth', { value: clientWidth, configurable: true });
    };

    const simulateHoverEvent = (element: HTMLElement): void => {
      // Dispatch mousemove on the element to trigger the tooltip
      element.dispatchEvent(new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
      }));
    };

    it('should show column caption in the tooltip instead of sort index when hovering sort indicator (T1321834)', async () => {
      const { component } = await createDataGrid({
        dataSource: [{ id: 1, Position: 'Developer', Name: 'John' }],
        columns: [
          {
            dataField: 'Position',
            caption: 'Position',
            width: 30,
            sortOrder: 'asc',
            sortIndex: 0,
          },
          {
            dataField: 'Name',
            caption: 'Name',
            sortOrder: 'desc',
            sortIndex: 1,
          },
        ],
        sorting: {
          mode: 'multiple',
          showSortIndexes: true,
        },
        cellHintEnabled: true,
      });

      const headerCell = component.getHeaderCell(0);
      const sortIndexIcon = headerCell.getSortIndexIcon() as HTMLElement;

      simulateTextOverflow(sortIndexIcon, 50, 20);
      simulateHoverEvent(sortIndexIcon);

      expect($(sortIndexIcon).attr('title')).toBe('Position');
    });

    it('should show cell text in the tooltip for non-header rows', async () => {
      const { instance } = await createDataGrid({
        dataSource: [{ id: 1, Position: 'Very Long Position Name That Should Be Truncated' }],
        columns: [
          {
            dataField: 'Position',
            caption: 'Position',
            width: 50,
          },
        ],
        cellHintEnabled: true,
      });

      const dataCell = instance.getCellElement(0, 0) as HTMLElement;

      simulateTextOverflow(dataCell, 200, 50);
      simulateHoverEvent(dataCell);

      expect($(dataCell).attr('title')).toBe(dataCell.textContent);
    });
  });
});

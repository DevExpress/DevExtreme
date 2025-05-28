import { describe, expect, it } from '@jest/globals';
import type { SortOrder } from '@js/common';
import type { ItemProps } from '@ts/grids/new/card_view/header_panel/item';
import { Item } from '@ts/grids/new/card_view/header_panel/item';
import { normalizeColumn } from '@ts/grids/new/grid_core/columns_controller/columns_controller.mock';
import { render } from 'inferno';

import { getHeaderItemA11yLabel } from './a11y/index';

const CLASSES = {
  itemRoot: 'dx-cardview-header-item',
};

const setup = (props: ItemProps) => {
  const rootElement = document.createElement('div');
  render(
    <Item {...props} />,
    rootElement,
  );

  return rootElement;
};

const getItemRoot = (
  element: HTMLElement,
): HTMLDivElement | null => element.querySelector(`.${CLASSES.itemRoot}`);

describe('Item', () => {
  describe('A11y', () => {
    it('should has aria label with column caption', () => {
      const expectedColumnName = 'TEST_COL';
      const expectedAriaLabel = getHeaderItemA11yLabel(expectedColumnName, {});
      const element = setup({
        column: normalizeColumn({
          dataField: 'SOME_DATA_FIELD',
          caption: expectedColumnName,
        }),
      });

      const itemRoot = getItemRoot(element);
      expect(itemRoot?.getAttribute('aria-label')).toBe(expectedAriaLabel);
    });

    it.each<boolean>([true, false])('should has aria label with header filter info', (hasFilters) => {
      const expectedColumnName = 'TEST_COL';
      const expectedAriaLabel = getHeaderItemA11yLabel(expectedColumnName, {
        hasHeaderFilterValue: hasFilters,
      });
      const element = setup({
        column: normalizeColumn({
          dataField: 'SOME_DATA_FIELD',
          caption: expectedColumnName,
        }),
        hasFilters,
      });

      const itemRoot = getItemRoot(element);
      expect(itemRoot?.getAttribute('aria-label')).toBe(expectedAriaLabel);
    });

    it.each<SortOrder | undefined>([
      'asc', 'desc', undefined,
    ])('sorting: %s -> should has arial label with sorting info', (sortOrder) => {
      const expectedColumnName = 'TEST_COL';
      const expectedAriaLabel = getHeaderItemA11yLabel(expectedColumnName, {
        sortOrder,
      });
      const element = setup({
        column: normalizeColumn({
          dataField: 'SOME_DATA_FIELD',
          caption: expectedColumnName,
          sortOrder,
        }),
      });

      const itemRoot = getItemRoot(element);
      expect(itemRoot?.getAttribute('aria-label')).toBe(expectedAriaLabel);
    });

    it.each<{
      sortOrder: SortOrder | undefined;
      sortIndex: number | undefined;
    }>([
      { sortOrder: 'asc', sortIndex: 0 },
      { sortOrder: 'desc', sortIndex: 5 },
      { sortOrder: undefined, sortIndex: 1 },
      { sortOrder: undefined, sortIndex: undefined },
      { sortOrder: 'asc', sortIndex: undefined },
      { sortOrder: 'desc', sortIndex: undefined },
    ])(
      'sorting: $sortOrder | sortIndex: $sortIndex -> should has arial label with sort idx info',
      ({ sortOrder, sortIndex }) => {
        const expectedColumnName = 'TEST_COL';
        const expectedAriaLabel = getHeaderItemA11yLabel(expectedColumnName, {
          sortOrder,
          sortIndex,
        });
        const element = setup({
          column: normalizeColumn({
            dataField: 'SOME_DATA_FIELD',
            caption: expectedColumnName,
            sortOrder,
            sortIndex,
          }),
        });

        const itemRoot = getItemRoot(element);
        expect(itemRoot?.getAttribute('aria-label')).toBe(expectedAriaLabel);
      },
    );

    it.each<{
      caption: string;
      hasFilters: boolean;
      sortOrder: SortOrder | undefined;
      sortIndex: number | undefined;
    }>([
      {
        caption: 'TEST #0',
        hasFilters: true,
        sortOrder: 'asc',
        sortIndex: 100,
      },
      {
        caption: 'TEST #1',
        hasFilters: true,
        sortOrder: undefined,
        sortIndex: 100,
      },
      {
        caption: 'TEST #2',
        hasFilters: true,
        sortOrder: undefined,
        sortIndex: 1,
      },
    ])('caption: $caption '
      + '| filterType: $filterType '
      + '| filterValues: $filterValues '
      + '| sortOrder: $sortOrder '
      + '| sortIndex: $sortIndex'
      + ' -> complex case', ({
      caption,
      hasFilters,
      sortOrder,
      sortIndex,
    }) => {
      const expectedAriaLabel = getHeaderItemA11yLabel(caption, {
        hasHeaderFilterValue: hasFilters,
        sortOrder,
        sortIndex,
      });
      const element = setup({
        column: normalizeColumn({
          dataField: 'SOME_DATA_FIELD',
          caption,
          sortOrder,
          sortIndex,
        }),
        hasFilters,
      });

      const itemRoot = getItemRoot(element);
      expect(itemRoot?.getAttribute('aria-label')).toBe(expectedAriaLabel);
    });
  });
});

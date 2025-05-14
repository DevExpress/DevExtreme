import { describe, expect, it } from '@jest/globals';
import type { SortOrder } from '@js/common';
import type { FilterType } from '@js/common/grids';
import type { ItemProps } from '@ts/grids/new/card_view/header_panel/item';
import { Item } from '@ts/grids/new/card_view/header_panel/item';
import { hasFilterValues } from '@ts/grids/new/card_view/header_panel/utils';
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

    it.each<{
      filterType: FilterType | undefined;
      filterValues: any[] | undefined;
    }>([
      { filterType: 'include', filterValues: ['A'] },
      { filterType: 'exclude', filterValues: ['A'] },
      { filterType: 'include', filterValues: [] },
      { filterType: 'exclude', filterValues: [] },
      { filterType: 'include', filterValues: undefined },
      { filterType: 'exclude', filterValues: undefined },
      { filterType: undefined, filterValues: [] },
      { filterType: undefined, filterValues: ['A'] },
      { filterType: undefined, filterValues: undefined },
    ])('should has aria label with header filter info', ({ filterType, filterValues }) => {
      const expectedColumnName = 'TEST_COL';
      const expectedAriaLabel = getHeaderItemA11yLabel(expectedColumnName, {
        hasHeaderFilterValue: hasFilterValues(filterType, filterValues),
      });
      const element = setup({
        column: normalizeColumn({
          dataField: 'SOME_DATA_FIELD',
          caption: expectedColumnName,
          filterType,
          filterValues,
        }),
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
      filterType: FilterType | undefined;
      filterValues: any[] | undefined;
      sortOrder: SortOrder | undefined;
      sortIndex: number | undefined;
    }>([
      {
        caption: 'TEST #0',
        filterType: 'include',
        filterValues: ['A'],
        sortOrder: 'asc',
        sortIndex: 100,
      },
      {
        caption: 'TEST #1',
        filterType: 'exclude',
        filterValues: undefined,
        sortOrder: undefined,
        sortIndex: 100,
      },
      {
        caption: 'TEST #2',
        filterType: undefined,
        filterValues: ['A'],
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
      filterType,
      filterValues,
      sortOrder,
      sortIndex,
    }) => {
      const expectedAriaLabel = getHeaderItemA11yLabel(caption, {
        hasHeaderFilterValue: hasFilterValues(filterType, filterValues),
        sortOrder,
        sortIndex,
      });
      const element = setup({
        column: normalizeColumn({
          dataField: 'SOME_DATA_FIELD',
          caption,
          filterType,
          filterValues,
          sortOrder,
          sortIndex,
        }),
      });

      const itemRoot = getItemRoot(element);
      expect(itemRoot?.getAttribute('aria-label')).toBe(expectedAriaLabel);
    });
  });
});

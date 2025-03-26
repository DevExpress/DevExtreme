/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive/index';
import { computed } from '@ts/core/reactive/index';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';
import type { Options as SearchOptions } from '@ts/grids/new/grid_core/search/options';
import type { HighlightedTextItem, HighlightTextOptions } from '@ts/grids/new/grid_core/search/types';
import {
  allowSearch, createFilterExpression, parseValue, splitHighlightedText,
} from '@ts/grids/new/grid_core/search/utils';

import { ColumnsController } from '../columns_controller';
import type { Column } from '../columns_controller/types';
import { OptionsController } from '../options_controller/options_controller';

type DefinedSearchOptions = Required<Required<SearchOptions>['searchPanel']>;

export class SearchController {
  public static dependencies = [
    OptionsController,
    ColumnsController,
  ] as const;

  public readonly highlightTextOptions: SubsGets<HighlightTextOptions> = computed((
    searchOptions: DefinedSearchOptions,
  ) => ({
    enabled: searchOptions.highlightSearchText,
    caseSensitive: searchOptions.highlightCaseSensitive,
    searchStr: searchOptions.text,
  }), [this.options.oneWay('searchPanel') as SubsGets<DefinedSearchOptions>]);

  private readonly _searchTextOption = this.options.twoWay('searchPanel.text');

  private readonly _searchVisibleColumnsOnly = this.options.oneWay('searchPanel.searchVisibleColumnsOnly');

  public readonly searchTextOption: SubsGets<string> = this._searchTextOption;

  public readonly searchFilter = computed(
    (
      searchText,
      columns,
      searchVisibleColumnsOnly,
    ) => this.calculateSearchFilter(searchText, columns, searchVisibleColumnsOnly),
    [
      this._searchTextOption,
      this.columnsController.columns,
      this._searchVisibleColumnsOnly,
    ],
  );

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
  ) { }

  public readonly getHighlightedText = (
    text: string,
  ): HighlightedTextItem[] | null => splitHighlightedText(
    text,
    this.highlightTextOptions.unreactive_get(),
  );

  public readonly updateSearchText = (text: string): void => {
    this._searchTextOption.update(text);
  };

  private calculateSearchFilter(
    text: string | undefined,
    columns: Column[],
    searchVisibleColumnsOnly: boolean,
  ): any {
    const filters: any[] = [];

    if (!text) return null;

    for (const column of columns) {
      if (allowSearch(column, searchVisibleColumnsOnly)) {
        const filterValue = parseValue(column, text);

        if (filterValue !== undefined) {
          const expression = createFilterExpression(column, filterValue, undefined, 'search');
          filters.push(expression);
        }
      }
    }

    if (filters.length === 0) {
      return ['!'];
    }

    return gridCoreUtils.combineFilters(filters, 'or');
  }
}

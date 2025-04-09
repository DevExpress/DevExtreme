/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive/index';
import { computed } from '@ts/core/reactive/index';
import type { Options as SearchOptions } from '@ts/grids/new/grid_core/search/options';
import type { HighlightedTextItem, HighlightTextOptions } from '@ts/grids/new/grid_core/search/types';

import { ColumnsController } from '../columns_controller';
import { OptionsController } from '../options_controller/options_controller';
import {
  calculateSearchFilter, splitHighlightedText,
} from './utils';

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

  public readonly searchTextOption = this.options.twoWay('searchPanel.text');

  private readonly searchVisibleColumnsOnly = this.options.oneWay('searchPanel.searchVisibleColumnsOnly');

  public readonly searchFilter = computed(
    (
      searchText,
      columns,
      searchVisibleColumnsOnly,
    ) => calculateSearchFilter(searchText, columns, searchVisibleColumnsOnly),
    [
      this.searchTextOption,
      this.columnsController.columns,
      this.searchVisibleColumnsOnly,
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
    this.searchTextOption.update(text);
  };
}

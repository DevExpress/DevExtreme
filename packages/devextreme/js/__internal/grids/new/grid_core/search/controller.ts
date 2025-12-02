import type { ReadonlySignal } from '@ts/core/state_manager/index';
import { computed } from '@ts/core/state_manager/index';
import type { Options as SearchOptions } from '@ts/grids/new/grid_core/search/options';
import type { HighlightedTextItem, HighlightTextOptions } from '@ts/grids/new/grid_core/search/types';

import { ColumnsController } from '../columns_controller/columns_controller';
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

  public readonly highlightTextOptions: ReadonlySignal<HighlightTextOptions> = computed(() => {
    const searchOptions = this.options.oneWay('searchPanel').value as DefinedSearchOptions;
    return {
      enabled: searchOptions.highlightSearchText,
      caseSensitive: searchOptions.highlightCaseSensitive,
      searchStr: searchOptions.text,
    };
  });

  public readonly searchTextOption = this.options.twoWay('searchPanel.text');

  public readonly searchPlaceholder = this.options.oneWay('searchPanel.placeholder');

  public readonly searchWidth = this.options.oneWay('searchPanel.width');

  private readonly searchVisibleColumnsOnly = this.options.oneWay('searchPanel.searchVisibleColumnsOnly');

  public readonly searchFilter = computed(() => {
    const searchText = this.searchTextOption.value;
    const columns = this.columnsController.columns.value;
    const searchVisibleColumnsOnly = this.searchVisibleColumnsOnly.value;

    return calculateSearchFilter(searchText, columns, searchVisibleColumnsOnly);
  });

  constructor(
    private readonly options: OptionsController,
    private readonly columnsController: ColumnsController,
  ) { }

  public readonly getHighlightedText = (
    text: string,
  ): HighlightedTextItem[] | null => splitHighlightedText(
    text,
    this.highlightTextOptions.peek(),
  );

  public readonly updateSearchText = (text: string): void => {
    this.searchTextOption.value = text;
  };
}

/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive/index';
import { computed } from '@ts/core/reactive/index';
import type { Options as SearchOptions } from '@ts/grids/new/grid_core/search/options';
import type { HighlightedTextItem, HighlightTextOptions } from '@ts/grids/new/grid_core/search/types';
import { splitHighlightedText } from '@ts/grids/new/grid_core/search/utils';

import { ColumnsController } from '../columns_controller';
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

  public readonly searchColumnList = computed(
    (columns, searchVisibleColumnsOnly) => columns
      .filter((c) => {
        const searchAllowed = c.allowSearch ?? c.allowFiltering;
        if (!searchAllowed) {
          return false;
        }

        if (searchVisibleColumnsOnly && !c.visible) {
          return false;
        }

        return true;
      })
      .map((c) => c.dataField ?? c.name),
    [
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
}

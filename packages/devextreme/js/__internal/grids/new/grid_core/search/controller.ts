/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive';
import { computed } from '@ts/core/reactive';
import type { Options as SearchOptions } from '@ts/grids/new/grid_core/search/options';
import type { HighlightedTextItem, HighlightTextOptions } from '@ts/grids/new/grid_core/search/types';
import { splitHighlightedText } from '@ts/grids/new/grid_core/search/utils';

import { OptionsController } from '../options_controller/options_controller';

type DefinedSearchOptions = Required<Required<SearchOptions>['searchPanel']>;

export class SearchController {
  public static dependencies = [
    OptionsController,
  ] as const;

  public readonly highlightTextOptions: SubsGets<HighlightTextOptions> = computed((
    searchOptions: DefinedSearchOptions,
  ) => ({
    enabled: searchOptions.highlightSearchText,
    caseSensitive: searchOptions.highlightCaseSensitive,
    searchStr: searchOptions.text,
  }), [this.options.oneWay('searchPanel') as SubsGets<DefinedSearchOptions>]);

  private readonly _searchTextOption = this.options.twoWay('searchPanel.text');

  public readonly searchTextOption: SubsGets<string> = this._searchTextOption;

  constructor(private readonly options: OptionsController) {}

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

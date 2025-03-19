/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive';
import { computed } from '@ts/core/reactive';
import { OptionsController } from '@ts/grids/new/grid_core/options_controller/options_controller';
import { splitHighlightedText } from '@ts/grids/new/grid_core/search/utils';

import type { Options as SearchOptions } from './options';
import type { HighlightedTextItem, HighlightTextOptions } from './types';

type DefinedSearchOptions = Required<Required<SearchOptions>['searchPanel']>;

export class SearchHighlightTextProcessor {
  public static dependencies = [
    OptionsController,
  ] as const;

  public readonly highlightTextOptions$: SubsGets<HighlightTextOptions> = computed((
    searchOptions: DefinedSearchOptions,
  ) => ({
    enabled: searchOptions.highlightSearchText,
    caseSensitive: searchOptions.highlightCaseSensitive,
    searchStr: searchOptions.text,
  }), [this.options.oneWay('searchPanel') as SubsGets<DefinedSearchOptions>]);

  constructor(private readonly options: OptionsController) {}

  public readonly getHighlightedText = (
    text: string,
  ): HighlightedTextItem[] | null => splitHighlightedText(
    text,
    this.highlightTextOptions$.unreactive_get(),
  );
}

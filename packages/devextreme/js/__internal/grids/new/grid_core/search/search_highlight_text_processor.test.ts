/* eslint-disable spellcheck/spell-checker */
import {
  afterEach,
  describe, expect, it, jest,
} from '@jest/globals';
import { OptionsControllerMock } from '@ts/grids/new/card_view/options_controller.mock';
import type { Options } from '@ts/grids/new/grid_core/options';
import { splitHighlightedText } from '@ts/grids/new/grid_core/search/utils';

import { SearchHighlightTextProcessor } from './search_highlight_text_processor';

jest.mock('@ts/grids/new/grid_core/search/utils', () => ({
  splitHighlightedText: jest.fn(),
}));

const setup = (config: Options = {}) => {
  const options = new OptionsControllerMock(config);
  const processor = new SearchHighlightTextProcessor(options);

  return { options, processor };
};

describe('Search', () => {
  describe('SearchHighlightTextProcessor', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should have highlightTextOptions$ from widget options', () => {
      const { processor } = setup({
        searchPanel: {
          highlightSearchText: true,
          highlightCaseSensitive: false,
          text: 'TEST_SEARCH_STR',
        },
      });

      const stateSlice = processor.highlightTextOptions$.unreactive_get();

      expect(stateSlice).toStrictEqual({
        enabled: true,
        caseSensitive: false,
        searchStr: 'TEST_SEARCH_STR',
      });
    });

    it('getHighlightText should call util function', () => {
      const { processor } = setup({
        searchPanel: {
          highlightSearchText: true,
          highlightCaseSensitive: false,
          text: 'TEST_SEARCH_STR',
        },
      });

      processor.getHighlightedText('SOURCE_TEXT');

      expect(splitHighlightedText).toHaveBeenCalledTimes(1);
      expect(splitHighlightedText).toHaveBeenCalledWith('SOURCE_TEXT', {
        enabled: true,
        caseSensitive: false,
        searchStr: 'TEST_SEARCH_STR',
      });
    });
  });
});

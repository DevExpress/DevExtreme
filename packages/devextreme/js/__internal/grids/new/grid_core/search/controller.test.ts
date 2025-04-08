/* eslint-disable spellcheck/spell-checker */
import {
  afterEach,
  describe, expect, it, jest,
} from '@jest/globals';
import { OptionsControllerMock } from '@ts/grids/new/card_view/options_controller.mock';
import type { Options } from '@ts/grids/new/grid_core/options';
import { splitHighlightedText } from '@ts/grids/new/grid_core/search/utils';

import { SearchController } from './controller';

jest.mock('@ts/grids/new/grid_core/search/utils', () => ({
  splitHighlightedText: jest.fn(),
}));

const setup = (config: Options = {}) => {
  const options = new OptionsControllerMock(config);
  const controller = new SearchController(options);

  return { options, controller };
};

describe('SearchController', () => {
  describe('highlightTextOptions', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should have observable from widget options', () => {
      const { controller } = setup({
        searchPanel: {
          highlightSearchText: true,
          highlightCaseSensitive: false,
          text: 'TEST_SEARCH_STR',
        },
      });

      const stateSlice = controller.highlightTextOptions.unreactive_get();

      expect(stateSlice).toStrictEqual({
        enabled: true,
        caseSensitive: false,
        searchStr: 'TEST_SEARCH_STR',
      });
    });

    it('getHighlightText method should call util function', () => {
      const { controller } = setup({
        searchPanel: {
          highlightSearchText: true,
          highlightCaseSensitive: false,
          text: 'TEST_SEARCH_STR',
        },
      });

      controller.getHighlightedText('SOURCE_TEXT');

      expect(splitHighlightedText).toHaveBeenCalledTimes(1);
      expect(splitHighlightedText).toHaveBeenCalledWith('SOURCE_TEXT', {
        enabled: true,
        caseSensitive: false,
        searchStr: 'TEST_SEARCH_STR',
      });
    });
  });
});

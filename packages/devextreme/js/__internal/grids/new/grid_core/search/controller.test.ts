import {
  afterEach,
  describe, expect, it, jest,
} from '@jest/globals';
import type { Options } from '@ts/grids/new/grid_core/options';
import { OptionsControllerMock } from '@ts/grids/new/grid_core/options_controller/options_controller.mock';
import { splitHighlightedText } from '@ts/grids/new/grid_core/search/utils';

import { getContext } from '../di.test_utils';
import { SearchController } from './controller';

jest.mock('@ts/grids/new/grid_core/search/utils');

const setup = (config: Options = {}) => {
  const context = getContext(config);

  return {
    options: context.get(OptionsControllerMock),
    controller: context.get(SearchController),
  };
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

      const stateSlice = controller.highlightTextOptions.peek();

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

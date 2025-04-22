import {
  describe, expect, it, jest,
} from '@jest/globals';

import { ColumnsController } from '../columns_controller';
import { DataController } from '../data_controller/index';
import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { SortingController } from './sorting_controller';

const setup = (config: Options) => {
  const context = getContext(config);

  return {
    dataController: context.get(DataController),
    sortingController: context.get(SortingController),
    columnsController: context.get(ColumnsController),
  };
};

describe('regressions', () => {
  describe('SortingController', () => {
    describe('onSingleModeSortClick', () => {
      it('should make only one request', async () => {
        const { sortingController, dataController, columnsController } = setup({
          columns: ['a', 'b'],
        });

        await dataController.waitLoaded();

        const loadSpy = jest.fn();
        dataController.items.subscribe(loadSpy);
        loadSpy.mockReset(); // reset in order not to count initial call

        sortingController.onSingleModeSortClick(
          columnsController.columns.peek()[0],
          {} as MouseEvent,
        );

        expect(loadSpy).toBeCalledTimes(1);
      });
    });
  });
});

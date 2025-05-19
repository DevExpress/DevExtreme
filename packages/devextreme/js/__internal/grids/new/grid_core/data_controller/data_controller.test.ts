import { describe, expect, it } from '@jest/globals';

import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { DataController } from './data_controller';

const getControllers = (options?: Options) => {
  const context = getContext(options ?? {});

  const optionsController = context.get(OptionsControllerMock);

  return {
    optionsController,
    dataController: context.get(DataController),
  };
};

const generateData = (length: number) => [...new Array(length)].map((_, index) => ({ field: `test_${index}` }));

describe('DataController', () => {
  describe('pageIndex', () => {
    it('does not change after pageSize increased and pageIndex < pageCount', async () => {
      const { optionsController, dataController } = getControllers({
        dataSource: generateData(20),
        paging: {
          pageIndex: 1,
          pageSize: 5,
        },
      });
      await dataController.waitLoaded();

      optionsController.option('paging.pageSize', 10);
      await dataController.waitLoaded();

      expect(optionsController.oneWay('paging.pageIndex').peek()).toEqual(1);
    });

    it('set to last page after pageSize increased and pageIndex >= pageCount', async () => {
      const { optionsController, dataController } = getControllers({
        dataSource: generateData(20),
        paging: {
          pageIndex: 3,
          pageSize: 5,
        },
      });
      await dataController.waitLoaded();

      optionsController.option('paging.pageSize', 10);
      await dataController.waitLoaded();

      expect(optionsController.oneWay('paging.pageIndex').peek()).toEqual(1);
    });

    it('set to last and only page after pageSize increased and pageIndex >= pageCount == 1', async () => {
      const { optionsController, dataController } = getControllers({
        dataSource: generateData(20),
        paging: {
          pageIndex: 1,
          pageSize: 5,
        },
      });
      await dataController.waitLoaded();

      optionsController.option('paging.pageSize', 20);
      await dataController.waitLoaded();

      expect(optionsController.oneWay('paging.pageIndex').peek()).toEqual(0);
    });
  });
});

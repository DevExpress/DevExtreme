import {
  DataStateValue, TotalCount, VisibleDataRows, KeyExprPlugin, CalculateLocalDataState,
  LocalData, LocalVisibleItems,
} from '../plugins';
import { Plugins } from '../../../../utils/plugin/context';

describe('Plugins', () => {
  let plugins = new Plugins();

  const reinitPlugins = () => {
    plugins = new Plugins();
  };

  describe('TotalCount', () => {
    beforeEach(reinitPlugins);

    it('dataState.totalCount is undefined', () => {
      plugins.set(DataStateValue, {
        data: [{}],
      });

      expect(plugins.getValue(TotalCount)).toEqual(1);
    });

    it('dataState.data is undefined', () => {
      plugins.set(DataStateValue, {
        data: [],
        totalCount: 2,
      });

      expect(plugins.getValue(TotalCount)).toEqual(2);
    });
  });

  describe('VisibleDataRows', () => {
    beforeEach(reinitPlugins);

    it('keyExpr is undefined', () => {
      plugins.set(KeyExprPlugin, undefined);
      plugins.set(DataStateValue, {
        data: [{
          id: 1,
          name: 'test',
        }],
      });

      expect(plugins.getValue(VisibleDataRows)).toEqual([{
        key: {
          id: 1,
          name: 'test',
        },
        rowType: 'data',
        data: {
          id: 1,
          name: 'test',
        },
      }]);
    });

    it('keyExpr is defined', () => {
      plugins.set(KeyExprPlugin, 'id');
      plugins.set(DataStateValue, {
        data: [{
          id: 1,
          name: 'test',
        }],
      });

      expect(plugins.getValue(VisibleDataRows)).toEqual([{
        key: 1,
        rowType: 'data',
        data: {
          id: 1,
          name: 'test',
        },
      }]);
    });
  });

  describe('CalculateLocalDataState', () => {
    beforeEach(reinitPlugins);

    it('local data is undefined', () => {
      const items = [{
        id: 1,
        name: 'test',
      }];
      plugins.set(LocalData, undefined);
      plugins.extend(LocalVisibleItems, -1, () => items);

      expect(plugins.getValue(CalculateLocalDataState)).toBe(undefined);
    });

    it('local data is defined', () => {
      const items = [{
        id: 1,
        name: 'test',
      }];
      plugins.set(LocalData, items);
      plugins.extend(LocalVisibleItems, -1, () => items);

      expect(plugins.getValue(CalculateLocalDataState)).toEqual({
        data: [{
          id: 1,
          name: 'test',
        }],
        totalCount: 1,
      });
    });

    it('visible items undefined', () => {
      const items = [{
        id: 1,
        name: 'test',
      }];
      plugins.set(LocalData, items);
      plugins.extend(LocalVisibleItems, -1, () => undefined);

      expect(plugins.getValue(CalculateLocalDataState)).toEqual({
        data: [],
        totalCount: 1,
      });
    });
  });
});

/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/dot-notation */
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { DataController } from './data_controller';

describe('options', () => {
  describe('keyExpr', () => {
    describe('when dataSource option is array', () => {
      it('should be passed to dataSource as key', () => {
        const keyExpr = 'asd';
        const options = new OptionsControllerMock({
          dataSource: [],
          keyExpr,
        });
        const dataController = new DataController(options);
        const dataSource = dataController['dataSource'].unreactive_get();
        expect(dataSource.key()).toBe(keyExpr);
      });
    });
    describe('when dataSource options is store', () => {
      it('should not affect', () => {
        const keyExpr = 'asd';
        const storeKey = 'dsa';
        const options = new OptionsControllerMock({
          dataSource: { store: { type: 'array', key: storeKey, data: [] } },
          keyExpr,
        });
        const dataController = new DataController(options);
        const dataSource = dataController['dataSource'].unreactive_get();
        expect(dataSource.key()).not.toBe(keyExpr);
        expect(dataSource.key()).toBe(storeKey);
      });
    });
  });
});

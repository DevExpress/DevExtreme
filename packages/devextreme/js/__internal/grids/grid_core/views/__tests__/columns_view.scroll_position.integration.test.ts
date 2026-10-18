import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

const createGrid = (rtlEnabled: boolean): ReturnType<typeof createDataGrid> => createDataGrid({
  rtlEnabled,
  dataSource: [{ id: 1, a: 'a', b: 'b' }],
  columns: ['a', 'b'],
  scrolling: {
    useNative: true,
  },
});

describe('ColumnHeadersView horizontal scroll position', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when the headers are scrolled to a negative position in RTL', () => {
    it('should restore the position after the headers are rendered again', async () => {
      const { instance } = await createGrid(true);
      const columnHeadersView = instance.getView('columnHeadersView');

      columnHeadersView.scrollTo({ left: -100 });

      const scrollToSpy = jest.spyOn(columnHeadersView, 'scrollTo');

      columnHeadersView.render();
      jest.runAllTimers();

      expect(scrollToSpy).toHaveBeenCalledWith({ left: -100 });
    });

    it('should restore the position after the headers are resized', async () => {
      const { instance } = await createGrid(true);
      const columnHeadersView = instance.getView('columnHeadersView');

      columnHeadersView.scrollTo({ left: -100 });

      const scrollToSpy = jest.spyOn(columnHeadersView, 'scrollTo');

      columnHeadersView.resize();

      expect(scrollToSpy).toHaveBeenCalledWith({ left: -100 });
    });
  });

  describe('when the headers are scrolled to a positive position in LTR', () => {
    it('should restore the position after the headers are rendered again', async () => {
      const { instance } = await createGrid(false);
      const columnHeadersView = instance.getView('columnHeadersView');

      columnHeadersView.scrollTo({ left: 100 });

      const scrollToSpy = jest.spyOn(columnHeadersView, 'scrollTo');

      columnHeadersView.render();
      jest.runAllTimers();

      expect(scrollToSpy).toHaveBeenCalledWith({ left: 100 });
    });
  });
});

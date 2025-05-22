/* eslint-disable spellcheck/spell-checker */
import {
  beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { CustomStore } from '@js/common/data';
import CardView from '@ts/grids/new/card_view/widget';
import type { Options as GridCoreOptions } from '@ts/grids/new/grid_core/options';
import { rerender } from 'inferno';

const setup = (options: GridCoreOptions = {}): CardView => {
  const container = document.createElement('div');
  const { body } = document;
  body.append(container);

  const cardView = new CardView(container, options);

  rerender();

  return cardView;
};

describe('SortingController', () => {
  describe('Integration tests', () => {
    let storeLoadMock: Function = jest.fn();

    beforeEach(() => {
      storeLoadMock = jest
        .fn()
        .mockImplementation(() => [
          { id: 0, A: 'A_0', B: 'B_0' },
          { id: 1, A: 'A_1', B: 'B_1' },
        ]);
    });

    describe('Single mode', () => {
      it('Should not trigger additional load on initial sorting', () => {
        const cardView = setup({
          dataSource: new CustomStore({
            load: storeLoadMock as any,
            totalCount: (() => 2) as any,
          }),
          keyExpr: 'id',
          columns: ['A', 'B'],
          sorting: {
            mode: 'single',
          },
        });

        const [firstCol] = cardView.getVisibleColumns();
        // @ts-expect-error access private property
        cardView.sortingController.onSingleModeSortClick(firstCol, new MouseEvent('click'));

        // NOTE: 1 -> initial load + 1 -> load on sorting
        expect(storeLoadMock).toHaveBeenCalledTimes(2);
      });

      it('Should not trigger additional load on sorting clear', () => {
        const cardView = setup({
          dataSource: new CustomStore({
            load: storeLoadMock as any,
            totalCount: (() => 2) as any,
          }),
          keyExpr: 'id',
          columns: [
            { dataField: 'A', sortOrder: 'asc' },
            'B',
          ],
          sorting: {
            mode: 'single',
          },
        });

        const [firstCol] = cardView.getVisibleColumns();
        // @ts-expect-error access private property
        cardView.sortingController.onSingleModeSortClick(firstCol, new MouseEvent('click', { ctrlKey: true }));

        // NOTE: 1 -> initial load + 1 -> sort clear
        expect(storeLoadMock).toHaveBeenCalledTimes(2);
      });

      it('Should not trigger additional load on sorting column change', () => {
        const cardView = setup({
          dataSource: new CustomStore({
            load: storeLoadMock as any,
            totalCount: (() => 2) as any,
          }),
          keyExpr: 'id',
          columns: [
            'A',
            { dataField: 'B', sortOrder: 'asc' },
          ],
          sorting: {
            mode: 'multiple',
          },
        });

        const [firstCol] = cardView.getVisibleColumns();
        // @ts-expect-error access private property
        cardView.sortingController.onSingleModeSortClick(firstCol, new MouseEvent('click'));

        // NOTE: 1 -> initial load + 1 -> load on sorting
        expect(storeLoadMock).toHaveBeenCalledTimes(2);
      });
    });

    describe('Multiple mode', () => {
      it('Should not trigger additional load on initial sorting', () => {
        const cardView = setup({
          dataSource: new CustomStore({
            load: storeLoadMock as any,
            totalCount: (() => 2) as any,
          }),
          keyExpr: 'id',
          columns: ['A', 'B'],
          sorting: {
            mode: 'multiple',
          },
        });

        const [firstCol] = cardView.getVisibleColumns();
        // @ts-expect-error access private property
        cardView.sortingController.onMultipleModeSortClick(firstCol, new MouseEvent('click'));

        // NOTE: 1 -> initial load + 1 -> load on sorting
        expect(storeLoadMock).toHaveBeenCalledTimes(2);
      });

      it('Should not trigger additional load on sorting clear', () => {
        const cardView = setup({
          dataSource: new CustomStore({
            load: storeLoadMock as any,
            totalCount: (() => 2) as any,
          }),
          keyExpr: 'id',
          columns: [
            { dataField: 'A', sortOrder: 'asc', sortIndex: 0 },
            { dataField: 'B', sortOrder: 'asc', sortIndex: 1 },
          ],
          sorting: {
            mode: 'single',
          },
        });

        const [firstCol] = cardView.getVisibleColumns();
        // @ts-expect-error access private property
        cardView.sortingController.onSingleModeSortClick(firstCol, new MouseEvent('click', { ctrlKey: true }));

        // NOTE: 1 -> initial load + 1 -> sort clear
        expect(storeLoadMock).toHaveBeenCalledTimes(2);
      });

      it('Should not trigger additional load on adding sorting column', () => {
        const cardView = setup({
          dataSource: new CustomStore({
            load: storeLoadMock as any,
            totalCount: (() => 2) as any,
          }),
          keyExpr: 'id',
          columns: [
            'A',
            { dataField: 'B', sortOrder: 'asc', sortIndex: 0 },
          ],
          sorting: {
            mode: 'single',
          },
        });

        const [firstCol] = cardView.getVisibleColumns();
        // @ts-expect-error access private property
        cardView.sortingController.onSingleModeSortClick(firstCol, new MouseEvent('click', { shiftKey: true }));

        // NOTE: 1 -> initial load + 1 -> load on sorting
        expect(storeLoadMock).toHaveBeenCalledTimes(2);
      });

      it('Should not trigger additional load on sorting column change', () => {
        const cardView = setup({
          dataSource: new CustomStore({
            load: storeLoadMock as any,
            totalCount: (() => 2) as any,
          }),
          keyExpr: 'id',
          columns: [
            'A',
            { dataField: 'B', sortOrder: 'asc', sortIndex: 0 },
          ],
          sorting: {
            mode: 'single',
          },
        });

        const [firstCol] = cardView.getVisibleColumns();
        // @ts-expect-error access private property
        cardView.sortingController.onSingleModeSortClick(firstCol, new MouseEvent('click'));

        // NOTE: 1 -> initial load + 1 -> load on sorting
        expect(storeLoadMock).toHaveBeenCalledTimes(2);
      });
    });
  });
});

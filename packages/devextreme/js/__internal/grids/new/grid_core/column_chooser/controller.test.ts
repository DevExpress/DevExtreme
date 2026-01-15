import { describe, expect, it } from '@jest/globals';
import type { SortOrder } from '@js/common';
import type { ColumnChooserMode } from '@js/common/grids';
import type { SelectionChangedEvent } from '@js/ui/tree_view';

import { ColumnsController } from '../columns_controller';
import type { Column } from '../columns_controller/types';
import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import type { ColumnChooserController } from './controller';
import { ColumnChooserControllerMock } from './controller.mock';

const setup = (options: Options) => {
  const context = getContext(options);

  const columnsController = context.get(ColumnsController);
  const optionsController = context.get(OptionsControllerMock);
  const controller = new ColumnChooserControllerMock(columnsController, optionsController);

  return {
    columnsController,
    controller,
    treeView: controller.treeView,
  };
};

const expectColumnVisibility = (
  columnsController: ColumnsController,
  visibility: boolean[],
): void => {
  const columns = columnsController.columns.peek();
  const columnsVisibility = columns.map((column) => column.visible);

  expect(columnsVisibility).toEqual(visibility);
};

describe('ColumnChooser', () => {
  describe('Controller', () => {
    describe('chooserColumns', () => {
      const expectChooserColumns = (
        controller: ColumnChooserController,
        columnNames: string[],
      ): void => {
        const columns = controller.chooserColumns
          .peek()
          .map((column) => column.name);

        expect(columns).toEqual(columnNames);
      };

      it.each<
        { mode: ColumnChooserMode; sortOrder?: SortOrder; result: string[] }
      >([
        { mode: 'dragAndDrop', sortOrder: 'asc', result: [] },
        { mode: 'dragAndDrop', sortOrder: 'desc', result: [] },
        { mode: 'dragAndDrop', sortOrder: undefined, result: [] },
        { mode: 'select', sortOrder: 'asc', result: ['A', 'B', 'C'] },
        { mode: 'select', sortOrder: 'desc', result: ['C', 'B', 'A'] },
        { mode: 'select', sortOrder: undefined, result: ['C', 'A', 'B'] },
      ])(
        'when mode: \'$mode\', sortOrder: \'$sortOrder\'',
        ({ mode, sortOrder, result }) => {
          const { controller } = setup({
            columns: [
              { dataField: 'C' },
              { dataField: 'A' },
              { dataField: 'B' },
            ],
            columnChooser: {
              enabled: true,
              mode,
              sortOrder,
            },
          });

          expectChooserColumns(controller, result);
        },
      );

      it.each<
        { mode: ColumnChooserMode; sortOrder?: SortOrder; result: string[] }
      >([
        { mode: 'dragAndDrop', sortOrder: 'asc', result: ['A', 'B', 'C'] },
        { mode: 'dragAndDrop', sortOrder: 'desc', result: ['C', 'B', 'A'] },
        { mode: 'dragAndDrop', sortOrder: undefined, result: ['C', 'A', 'B'] },
        { mode: 'select', sortOrder: 'asc', result: ['A', 'B', 'C', 'D', 'E'] },
        { mode: 'select', sortOrder: 'desc', result: ['E', 'D', 'C', 'B', 'A'] },
        { mode: 'select', sortOrder: undefined, result: ['C', 'D', 'A', 'B', 'E'] },
      ])(
        'when some columns are invisible and mode: \'$mode\', sortOrder: \'$sortOrder\'',
        ({ mode, sortOrder, result }) => {
          const { controller } = setup({
            columns: [
              { dataField: 'C', visible: false },
              { dataField: 'D' },
              { dataField: 'A', visible: false },
              { dataField: 'B', visible: false },
              { dataField: 'E' },
            ],
            columnChooser: {
              enabled: true,
              mode,
              sortOrder,
            },
          });

          expectChooserColumns(controller, result);
        },
      );

      it.each<
        { mode: ColumnChooserMode; sortOrder?: SortOrder; result: string[] }
      >([
        { mode: 'dragAndDrop', sortOrder: 'asc', result: ['A', 'C'] },
        { mode: 'dragAndDrop', sortOrder: 'desc', result: ['C', 'A'] },
        { mode: 'dragAndDrop', sortOrder: undefined, result: ['C', 'A'] },
        { mode: 'select', sortOrder: 'asc', result: ['A', 'C', 'D', 'E'] },
        { mode: 'select', sortOrder: 'desc', result: ['E', 'D', 'C', 'A'] },
        { mode: 'select', sortOrder: undefined, result: ['C', 'D', 'A', 'E'] },
      ])(
        'when some columns have showInColumnChooser=false and mode: \'$mode\', sortOrder: \'$sortOrder\'',
        ({ mode, sortOrder, result }) => {
          const { controller } = setup({
            columns: [
              { dataField: 'C', visible: false },
              { dataField: 'D' },
              { dataField: 'A', visible: false },
              { dataField: 'B', visible: false, showInColumnChooser: false },
              { dataField: 'E' },
              { dataField: 'F', showInColumnChooser: false },
            ],
            columnChooser: {
              enabled: true,
              mode,
              sortOrder,
            },
          });

          expectChooserColumns(controller, result);
        },
      );
    });

    describe('items', () => {
      it.each<
        { mode: ColumnChooserMode }
      >([
        { mode: 'select' },
        { mode: 'dragAndDrop' },
      ])('when mode=\'$mode\'', ({ mode }) => {
        const { controller } = setup({
          columns: [
            { dataField: 'A', visible: true },
            { dataField: 'B', visible: false },

            { dataField: 'C', caption: '1', visible: true },
            { dataField: 'D', caption: '2', visible: false },

            { dataField: 'E', allowHiding: false, visible: true },
            { dataField: 'F', allowHiding: false, visible: false },

            { dataField: 'G', showInColumnChooser: false },
            { dataField: 'H', showInColumnChooser: false, visible: false },
          ],
          columnChooser: {
            enabled: true,
            mode,
          },
        });

        let expectedItems = [
          {
            columnName: 'A', selected: true, text: 'A', disabled: false,
          },
          {
            columnName: 'B', selected: false, text: 'B', disabled: false,
          },
          {
            columnName: 'C', selected: true, text: '1', disabled: false,
          },
          {
            columnName: 'D', selected: false, text: '2', disabled: false,
          },
          {
            columnName: 'E', selected: true, text: 'E', disabled: true,
          },
          {
            columnName: 'F', selected: false, text: 'F', disabled: true,
          },
        ];

        if (mode === 'dragAndDrop') {
          expectedItems = expectedItems.filter((item) => !item.selected);
        }

        expect(controller.items.peek()).toMatchObject(expectedItems);
      });
    });

    it('onSelectionChanged', () => {
      const { controller, columnsController } = setup({
        columns: [
          { dataField: 'A' },
          { dataField: 'B' },
          { dataField: 'C', allowHiding: false },
          { dataField: 'D', allowHiding: false },
          { dataField: 'E', visible: false },
          { dataField: 'F', visible: false },
          { dataField: 'G', allowHiding: false, visible: false },
          { dataField: 'H', allowHiding: false, visible: false },
        ],
      });

      controller.onSelectionChanged({
        component: {
          getNodes: () => [
            { itemData: { columnName: 'A' }, selected: true },
            { itemData: { columnName: 'B' }, selected: false },
            { itemData: { columnName: 'C' }, selected: true },
            { itemData: { columnName: 'D' }, selected: false },
            { itemData: { columnName: 'E' }, selected: true },
            { itemData: { columnName: 'F' }, selected: false },
            { itemData: { columnName: 'G' }, selected: true },
            { itemData: { columnName: 'H' }, selected: false },
          ],
        },
      } as unknown as SelectionChangedEvent);

      expectColumnVisibility(
        columnsController,
        [true, false, true, true, true, false, true, false],
      );
    });

    it('onColumnMove', () => {
      const { controller, columnsController } = setup({
        columns: [
          { dataField: 'A', visible: true },
        ],
      });

      const getFirstColumn = (): Column => columnsController.columns.peek()[0];

      controller.onColumnMove(getFirstColumn());

      expect(getFirstColumn().visible).toBeFalsy();
    });

    describe('select mode', () => {
      it('toggles column visibility on select/unselect', () => {
        const { columnsController, treeView } = setup({
          columns: ['Column 1', 'Column 2', 'Column 3', 'Column 4'],
          columnChooser: {
            enabled: true,
            mode: 'select',
          },
        });

        treeView?.unselectItem(0);
        expectColumnVisibility(columnsController, [false, true, true, true]);

        treeView?.selectItem(0);
        expectColumnVisibility(columnsController, [true, true, true, true]);
      });

      it('toggles column visibility on selectAll/unselectAll', () => {
        const { columnsController, treeView } = setup({
          columns: [
            { name: 'Column 1', visible: false },
            { name: 'Column 2', visible: true },
          ],
          columnChooser: {
            enabled: true,
            mode: 'select',
          },
        });

        treeView?.selectAll();
        expectColumnVisibility(columnsController, [true, true]);

        treeView?.unselectAll();
        expectColumnVisibility(columnsController, [false, false]);
      });

      it('toggles column visibility on selectAll/unselectAll when some column have showInColumnChooser=false', () => {
        const { columnsController, treeView } = setup({
          columns: [
            { name: 'Column 1' },
            { name: 'Column 2', showInColumnChooser: false },
            { name: 'Column 3' },
          ],
          columnChooser: {
            enabled: true,
            mode: 'select',
          },
        });

        treeView?.unselectAll();
        expectColumnVisibility(columnsController, [false, true, false]);

        // make second column invisible
        columnsController.columnOption(
          columnsController.columns.peek()[1],
          'visible',
          false,
        );

        treeView?.selectAll();
        expectColumnVisibility(columnsController, [true, false, true]);
      });

      it('does not toggle columns with allowHiding=false on selectAll/unselectAll', () => {
        const { columnsController, treeView } = setup({
          columns: [
            { name: 'Column 1' },
            { name: 'Column 2', allowHiding: false },
          ],
          columnChooser: {
            enabled: true,
            mode: 'select',
          },
        });

        treeView?.unselectAll();
        expectColumnVisibility(columnsController, [false, true]);

        // make second column invisible
        columnsController.columnOption(
          columnsController.columns.peek()[1],
          'visible',
          false,
        );

        treeView?.selectAll();
        expectColumnVisibility(columnsController, [true, true]);
      });
    });
  });
});

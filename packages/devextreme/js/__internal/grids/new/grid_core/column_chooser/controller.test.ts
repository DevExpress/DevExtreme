/* eslint-disable spellcheck/spell-checker */
import { describe, expect, it } from '@jest/globals';
import type { SelectionChangedEvent } from '@js/ui/tree_view';

import { ColumnsController } from '../columns_controller';
import { DataController } from '../data_controller';
import { FilterController } from '../filtering';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ColumnChooserController } from './controller';
import { expectColumnVisibility } from './utils.test';

const createColumnChooserController = (options?: Options): {
  controller: ColumnChooserController;
  columnsController: ColumnsController;
  optionsController: OptionsControllerMock;
} => {
  const optionsController = new OptionsControllerMock(options ?? {
    columnChooser: {
      enabled: true,
    },
  });
  const filterController = new FilterController(optionsController);
  const dataController = new DataController(optionsController, filterController);
  const columnsController = new ColumnsController(optionsController, dataController);

  const columnChooserController = new ColumnChooserController(columnsController, optionsController);

  return {
    controller: columnChooserController,
    columnsController,
    optionsController,
  };
};

describe('ColumnChooser', () => {
  describe('Controller', () => {
    describe('chooserColumns state', () => {
      const expectChooserColumns = (
        controller: ColumnChooserController,
        columnNames: string[],
      ): void => {
        const columns = controller.chooserColumns
          .unreactive_get()
          .map((column) => column.name);

        expect(columns).toEqual(columnNames);
      };

      it('is correct', () => {
        const { controller } = createColumnChooserController({
          columns: [
            { dataField: 'A Column' },
            { dataField: 'B Column' },
          ],
        });

        expectChooserColumns(controller, ['A Column', 'B Column']);
      });

      it('is correct when a column has showInColumnChooser=false', () => {
        const { controller } = createColumnChooserController({
          columns: [
            { dataField: 'A Column' },
            { dataField: 'B Column', showInColumnChooser: false },
            { dataField: 'C Column' },
          ],
        });

        expectChooserColumns(controller, ['A Column', 'C Column']);
      });

      it('is correct when sortOrder is set', () => {
        const { controller, optionsController } = createColumnChooserController({
          columns: [
            { dataField: 'C Column' },
            { dataField: 'A Column' },
            { dataField: 'B Column' },
          ],
          columnChooser: {
            sortOrder: 'asc',
          },
        });

        expectChooserColumns(controller, ['A Column', 'B Column', 'C Column']);

        optionsController.option('columnChooser.sortOrder', 'desc');

        expectChooserColumns(controller, ['C Column', 'B Column', 'A Column']);
      });
    });

    describe('items state', () => {
      it('is correct', () => {
        const { controller } = createColumnChooserController({
          columns: [
            { dataField: 'A Column' },
            { dataField: 'B Column', caption: 'B Caption' },
          ],
        });

        expect(controller.items.unreactive_get()).toEqual(
          [
            {
              id: 0, columnName: 'A Column', selected: true, text: 'A Column', disabled: false,
            },
            {
              id: 1, columnName: 'B Column', selected: true, text: 'B Caption', disabled: false,
            },
          ],
        );
      });

      it('updated when column option changed on select mode', () => {
        const { columnsController, controller } = createColumnChooserController({
          columns: ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5'],
          columnChooser: {
            enabled: true,
            mode: 'select',
          },
        });

        const getItems = () => controller.items.unreactive_get();
        const getItem = (index: number) => getItems()[index];

        const columnOption = (index: number, option, value) => {
          const column = columnsController.columns.unreactive_get()[index];
          columnsController.columnOption(column, option, value);
        };

        columnOption(0, 'showInColumnChooser', false);
        expect(getItems().filter((item) => item.columnName === 'Column 1')).toHaveLength(0);

        columnOption(0, 'showInColumnChooser', true);
        expect(getItem(0).columnName).toBe('Column 1');

        // test column.visible
        columnOption(1, 'visible', false);
        expect(getItem(1).selected).toBeFalsy();

        columnOption(1, 'visible', true);
        expect(getItem(1).selected).toBeTruthy();

        // test column.caption
        columnOption(2, 'caption', 'new caption');
        expect(getItem(2).text).toBe('new caption');

        // test column.name
        columnOption(3, 'name', 'new name');
        expect(getItem(3).columnName).toBe('new name');

        // test column.allowHiding
        columnOption(4, 'allowHiding', false);
        expect(getItem(4).disabled).toBeTruthy();

        columnOption(4, 'allowHiding', true);
        expect(getItem(4).disabled).toBeFalsy();
      });
    });

    it('onSelectionChanged', () => {
      const { controller, columnsController } = createColumnChooserController({
        columns: [
          { dataField: 'A Column' },
          { dataField: 'B Column' },
          { dataField: 'C Column', allowHiding: false },
          { dataField: 'D Column', allowHiding: false },
          { dataField: 'E Column', visible: false },
          { dataField: 'F Column', visible: false },
          { dataField: 'G Column', allowHiding: false, visible: false },
          { dataField: 'H Column', allowHiding: false, visible: false },
        ],
      });

      controller.onSelectionChanged({
        component: {
          getNodes: () => [
            { itemData: { columnName: 'A Column' }, selected: true },
            { itemData: { columnName: 'B Column' }, selected: false },
            { itemData: { columnName: 'C Column' }, selected: true },
            { itemData: { columnName: 'D Column' }, selected: false },
            { itemData: { columnName: 'E Column' }, selected: true },
            { itemData: { columnName: 'F Column' }, selected: false },
            { itemData: { columnName: 'G Column' }, selected: true },
            { itemData: { columnName: 'H Column' }, selected: false },
          ],
        },
      } as unknown as SelectionChangedEvent);

      expectColumnVisibility(
        columnsController,
        [true, false, true, true, true, false, true, false],
      );
    });
  });
});

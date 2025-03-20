/* eslint-disable spellcheck/spell-checker */
import { describe, expect, it } from '@jest/globals';

import { ColumnsController } from '../columns_controller';
import { DataController } from '../data_controller';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ColumnChooserController } from './controller';

const createColumnChooserController = (options?: Options): {
  columnChooserController: ColumnChooserController;
  columnsController: ColumnsController;
  optionsController: OptionsControllerMock;
} => {
  const optionsController = new OptionsControllerMock(options ?? {
    columnChooser: {
      enabled: true,
    },
  });
  const dataController = new DataController(optionsController);
  const columnsController = new ColumnsController(optionsController, dataController);

  const columnChooserController = new ColumnChooserController(columnsController, optionsController);

  return {
    columnChooserController,
    columnsController,
    optionsController,
  };
};

describe('select mode: ', () => {
  it('updates treeView items on applying column options', () => {
    const {
      columnsController,
      columnChooserController,
    } = createColumnChooserController({
      columns: ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5'],
      columnChooser: {
        enabled: true,
        mode: 'select',
      },
    });

    const getItems = () => columnChooserController.items.unreactive_get();
    const getItem = (index: number) => getItems()[index];

    const columnOption = (index: number, option, value) => {
      const column = columnsController.columns.unreactive_get()[index];
      columnsController.columnOption(column, option, value);
    };

    // test column.showInColumnChooser
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

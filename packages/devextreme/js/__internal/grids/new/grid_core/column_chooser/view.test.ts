/* eslint-disable spellcheck/spell-checker */
import { describe, expect, it } from '@jest/globals';

import { expectColumnVisibility, renderColumnChooser, renderColumnChooserWithToolbar } from './test-utils';

describe('ColumnChooser', () => {
  describe('View', () => {
    it('toolbar button', () => {
      const { toolbarController, optionsController } = renderColumnChooserWithToolbar({
        toolbar: {
          visible: true,
        },
        columnChooser: {
          enabled: true,
        },
      });

      let toolbarItems = toolbarController.items.unreactive_get();

      expect(toolbarItems).toHaveLength(1);
      expect(toolbarItems[0].name).toEqual('columnChooserButton');

      optionsController.option('columnChooser.enabled', false);

      toolbarItems = toolbarController.items.unreactive_get();

      expect(toolbarItems).toHaveLength(0);
    });
  });

  describe('Select mode', () => {
    it('toggles column visibility on select/unselect', async () => {
      const { columnChooser, columnsController } = await renderColumnChooser({
        columns: ['Column 1', 'Column 2', 'Column 3', 'Column 4'],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });
      const treeView = columnChooser.treeViewRef.current;

      treeView?.unselectItem(0);
      expectColumnVisibility(columnsController, [false, true, true, true]);

      treeView?.selectItem(0);
      expectColumnVisibility(columnsController, [true, true, true, true]);
    });

    it('toggles column visibility on selectAll/unselectAll', async () => {
      const { columnsController, columnChooser } = await renderColumnChooser({
        columns: [
          { name: 'Column 1', visible: false },
          { name: 'Column 2', visible: true },
        ],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });
      const treeView = columnChooser.treeViewRef.current;

      treeView?.selectAll();
      expectColumnVisibility(columnsController, [true, true]);

      treeView?.unselectAll();
      expectColumnVisibility(columnsController, [false, false]);
    });

    it('toggles column visibility on selectAll/unselectAll when some column have showInColumnChooser=false', async () => {
      const { columnsController, columnChooser } = await renderColumnChooser({
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
      const treeView = columnChooser.treeViewRef.current;

      treeView?.unselectAll();
      expectColumnVisibility(columnsController, [false, true, false]);

      // make second column invisible
      columnsController.columnOption(
        columnsController.columns.unreactive_get()[1],
        'visible',
        false,
      );

      treeView?.selectAll();
      expectColumnVisibility(columnsController, [true, false, true]);
    });

    it('does not toggle columns with allowHiding=false on selectAll/unselectAll', async () => {
      const { columnsController, columnChooser } = await renderColumnChooser({
        columns: [
          { name: 'Column 1' },
          { name: 'Column 2', allowHiding: false },
        ],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });
      const treeView = columnChooser.treeViewRef.current;

      treeView?.unselectAll();
      expectColumnVisibility(columnsController, [false, true]);

      // make second column invisible
      columnsController.columnOption(
        columnsController.columns.unreactive_get()[1],
        'visible',
        false,
      );

      treeView?.selectAll();
      expectColumnVisibility(columnsController, [true, true]);
    });
  });
});

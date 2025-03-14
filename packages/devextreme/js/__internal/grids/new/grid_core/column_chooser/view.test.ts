/* eslint-disable spellcheck/spell-checker */
import { describe, expect, it } from '@jest/globals';

import { ColumnsController } from '../columns_controller';
import { DataController } from '../data_controller';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ToolbarController } from '../toolbar/controller';
import { ToolbarView } from '../toolbar/view';
import { ColumnChooserController } from './controller';
import { ColumnChooserView } from './view';

const createToolbarView = (optionsController: OptionsControllerMock) => {
  const toolbarElement = document.createElement('div');
  const toolbarController = new ToolbarController(optionsController);
  const toolbar = new ToolbarView(toolbarController, optionsController);

  return { toolbarElement, toolbar, toolbarController };
};

const createColumnChooserView = (
  optionsController: OptionsControllerMock,
  toolbarController?: ToolbarController,
) => {
  const columnChooserElement = document.createElement('div');

  const dataController = new DataController(optionsController);
  const columnsController = new ColumnsController(optionsController, dataController);
  const columnChooserController = new ColumnChooserController(columnsController, optionsController);

  const columnChooser = new ColumnChooserView(
    toolbarController ?? new ToolbarController(optionsController),
    columnChooserController,
    optionsController,
  );

  return {
    columnChooserElement,
    columnChooser,
    columnChooserController,
    columnsController,
  };
};

const renderColumnChooser = async (options?: Options) => {
  const optionsController = new OptionsControllerMock(options ?? {});
  const {
    columnChooserElement, columnChooser, columnChooserController, columnsController,
  } = createColumnChooserView(optionsController);

  columnChooser.render(columnChooserElement);

  columnChooser.show();

  await new Promise((resolve) => { setTimeout(resolve); });

  // we need to fire 'onShown' event by ourselves, so that setPopupAttributes() is called
  // @ts-expect-error
  columnChooser.popupRef.current?.option('onShown')();

  return {
    element: columnChooserElement,
    optionsController,
    columnChooser,
    columnChooserController,
    columnsController,
  };
};

const renderColumnChooserWithToolbar = (options?: Options) => {
  const optionsController = new OptionsControllerMock(options ?? {});
  const {
    toolbarElement,
    toolbar,
    toolbarController,
  } = createToolbarView(optionsController);
  const {
    columnChooserElement,
    columnChooser,
    columnChooserController,
    columnsController,
  } = createColumnChooserView(optionsController, toolbarController);

  const element = document.createElement('div');
  element.append(toolbarElement, columnChooserElement);

  toolbar.render(toolbarElement);
  columnChooser.render(columnChooserElement);

  return {
    element,
    toolbar,
    toolbarController,
    columnChooser,
    optionsController,
    columnChooserController,
    columnsController,
  };
};

describe('render', () => {
  it('has columnChooser toolbar button', () => {
    const { element } = renderColumnChooserWithToolbar({
      toolbar: {
        visible: true,
      },
      columnChooser: {
        enabled: true,
      },
    });

    expect(element).toMatchSnapshot();
  });

  it('matches markup in select mode', async () => {
    const { element } = await renderColumnChooser({
      columns: [
        { dataField: 'Column 1' },
        { dataField: 'Column 2', showInColumnChooser: false },
        { dataField: 'Column 3', allowHiding: false },
        { dataField: 'Column 4', caption: 'my caption' },
        { dataField: 'Column 5', visible: false },
        { dataField: 'Column 6' },
      ],
      columnChooser: {
        enabled: true,
        mode: 'select',
        selection: {
          allowSelectAll: true,
        },
      },
    });

    expect(element).toMatchSnapshot();
  });
});

describe('applying options', () => {
  it('hides/shows columnChooser toolbar button', () => {
    const { optionsController, toolbarController } = renderColumnChooserWithToolbar({
      toolbar: {
        visible: true,
      },
      columnChooser: {
        enabled: true,
      },
    });
    const getColumnChooserBtn = () => {
      const toolbarItems = toolbarController.items.unreactive_get();

      expect(toolbarItems).toHaveLength(1);
      expect(toolbarItems[0].name).toBe('columnChooserButton');

      return toolbarItems[0];
    };

    expect(getColumnChooserBtn().visible).toBeTruthy();

    optionsController.option('columnChooser.enabled', false);
    expect(getColumnChooserBtn().visible).toBeFalsy();

    optionsController.option('columnChooser.enabled', true);
    expect(getColumnChooserBtn().visible).toBeTruthy();
  });

  it('updates the markup', async () => {
    const { element, optionsController } = await renderColumnChooser({
      columnChooser: {
        enabled: true,
        width: 300,
        height: 300,
        search: {
          enabled: false,
        },
        position: {
          my: 'right top',
          at: 'right top',
        },
        mode: 'select',
        selection: {
          allowSelectAll: false,
        },
      },
    });

    expect(element).toMatchSnapshot();

    optionsController.option('columnChooser', {
      width: 400,
      height: 400,
      title: 'new title',
      position: {
        my: 'left bottom',
        at: 'left bottom',
      },
      search: {
        editorOptions: {
          placeholder: 'new placeholder',
        },
        enabled: true,
      },
      selection: {
        allowSelectAll: true,
        selectByClick: true,
      },
    });

    // random id is generated for placeholder, so remove it before matching snapshot
    element.querySelector('.dx-placeholder')?.removeAttribute('id');

    expect(element).toMatchSnapshot();
  });
});

describe('choosing columns', () => {
  describe('in \'select\' mode', () => {
    it('toggles column visibility on select/unselect', async () => {
      const {
        columnsController,
        columnChooserController,
      } = await renderColumnChooser({
        columns: ['Column 1', 'Column 2', 'Column 3', 'Column 4'],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });
      const treeView = columnChooserController.treeViewRef.current;

      treeView?.unselectItem(0);
      expect(columnsController.columns.unreactive_get()[0].visible).toBe(false);

      treeView?.selectItem(0);
      expect(columnsController.columns.unreactive_get()[1].visible).toBe(true);
    });

    it('toggles column visibility on selectAll/unselectAll', async () => {
      const {
        columnsController,
        columnChooserController,
      } = await renderColumnChooser({
        columns: [
          { name: 'Column 1', visible: false },
          { name: 'Column 2', visible: true },
        ],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });
      const treeView = columnChooserController.treeViewRef.current;

      treeView?.selectAll();
      expect(columnsController.columns.unreactive_get()[0].visible).toBe(true);
      expect(columnsController.columns.unreactive_get()[1].visible).toBe(true);

      treeView?.unselectAll();
      expect(columnsController.columns.unreactive_get()[0].visible).toBe(false);
      expect(columnsController.columns.unreactive_get()[1].visible).toBe(false);
    });

    it('toggles column visibility on selectAll/unselectAll when some column have showInColumnChooser=false', async () => {
      const {
        columnsController,
        columnChooserController,
      } = await renderColumnChooser({
        columns: [
          { name: 'Column 1' },
          { name: 'Column 2', showInColumnChooser: false },
        ],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });
      const treeView = columnChooserController.treeViewRef.current;

      treeView?.unselectAll();
      expect(columnsController.columns.unreactive_get()[0].visible).toBe(false);
      expect(columnsController.columns.unreactive_get()[1].visible).toBe(true);

      // make second column invisible
      columnsController.columnOption(
        columnsController.columns.unreactive_get()[1],
        'visible',
        false,
      );

      treeView?.selectAll();
      expect(columnsController.columns.unreactive_get()[0].visible).toBe(true);
      expect(columnsController.columns.unreactive_get()[1].visible).toBe(false);
    });

    it('does not toggle columns with allowHiding=false on selectAll/unselectAll', async () => {
      const {
        columnsController,
        columnChooserController,
      } = await renderColumnChooser({
        columns: [
          { name: 'Column 1' },
          { name: 'Column 2', allowHiding: false },
        ],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });
      const treeView = columnChooserController.treeViewRef.current;

      treeView?.unselectAll();
      expect(columnsController.columns.unreactive_get()[0].visible).toBe(false);
      expect(columnsController.columns.unreactive_get()[1].visible).toBe(true);

      // make second column invisible
      columnsController.columnOption(
        columnsController.columns.unreactive_get()[1],
        'visible',
        false,
      );

      treeView?.selectAll();
      expect(columnsController.columns.unreactive_get()[0].visible).toBe(true);
      expect(columnsController.columns.unreactive_get()[1].visible).toBe(true);
    });
  });
});

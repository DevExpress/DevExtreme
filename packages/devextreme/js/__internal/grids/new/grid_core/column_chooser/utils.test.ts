/* eslint-disable spellcheck/spell-checker */
import { expect } from '@jest/globals';

import { ColumnsController } from '../columns_controller';
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
): {
  columnChooserElement: HTMLDivElement;
  columnChooser: ColumnChooserView;
  columnChooserController: ColumnChooserController;
  columnsController: ColumnsController;
} => {
  const columnChooserElement = document.createElement('div');

  const columnsController = new ColumnsController(optionsController);
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

export const renderColumnChooser = async (options?: Options): Promise<{
  element: HTMLDivElement;
  optionsController: OptionsControllerMock;
  columnChooser: ColumnChooserView;
  columnChooserController: ColumnChooserController;
  columnsController: ColumnsController;
}> => {
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

export const renderColumnChooserWithToolbar = (options?: Options): {
  element: HTMLDivElement;
  toolbar: ToolbarView;
  toolbarController: ToolbarController;
  columnChooser: ColumnChooserView;
  optionsController: OptionsControllerMock;
  columnChooserController: ColumnChooserController;
  columnsController: ColumnsController;
} => {
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

export const expectColumnVisibility = (
  columnsController: ColumnsController,
  visibility: boolean[],
): void => {
  const columns = columnsController.columns.unreactive_get();
  const columnsVisibility = columns.map((column) => column.visible);

  expect(columnsVisibility).toEqual(visibility);
};

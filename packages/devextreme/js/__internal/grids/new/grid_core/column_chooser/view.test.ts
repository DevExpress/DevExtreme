/* eslint-disable spellcheck/spell-checker */
import { describe, expect, it } from '@jest/globals';
import type { ColumnChooserMode } from '@js/common/grids';
import { rerender } from 'inferno';

import { ColumnsController } from '../columns_controller';
import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ToolbarController } from '../toolbar/controller';
import { ToolbarView } from '../toolbar/view';
import { ColumnChooserView } from './view';

const CLASS = {
  root: 'dx-cardview-column-chooser',
  selectMode: 'dx-cardview-column-chooser-mode-select',
  dragMode: 'dx-cardview-column-chooser-mode-drag',
  list: 'dx-cardview-column-chooser-list',
  plain: 'dx-cardview-column-chooser-plain',
  item: 'dx-column-chooser-item',

  treeViewItem: 'dx-treeview-item-content',
};

export const renderColumnChooser = (options: Options = {}, open = true): {
  element: HTMLDivElement;
  columnChooserView: ColumnChooserView;
  columnsController: ColumnsController;
} => {
  const context = getContext(options);
  const element = document.createElement('div');

  const columnChooserView = context.get(ColumnChooserView);
  const columnsController = context.get(ColumnsController);

  columnChooserView.render(element);

  if (open) {
    columnChooserView.show();

    rerender();

    // we need to fire 'onShowing' event manually, so that setPopupAttributes() is called
    // @ts-expect-error
    columnChooserView.popupRef.current?.option('onShowing')({
      component: columnChooserView.popupRef.current,
    });
  }

  return {
    element,
    columnChooserView,
    columnsController,
  };
};

export const renderColumnChooserWithToolbar = (options: Options = {}): {
  element: HTMLDivElement;
  toolbarController: ToolbarController;
  optionsController: OptionsControllerMock;
} => {
  const context = getContext(options);
  const rootElement = document.createElement('div');

  const optionsController = context.get(OptionsControllerMock);
  const columnChooserView = context.get(ColumnChooserView);
  const toolbarView = context.get(ToolbarView);
  const toolbarController = context.get(ToolbarController);

  const toolbarElement = document.createElement('div');
  const columnChooserElement = document.createElement('div');

  rootElement.append(toolbarElement, columnChooserElement);

  toolbarView.render(toolbarElement);
  columnChooserView.render(columnChooserElement);

  return {
    element: rootElement,
    optionsController,
    toolbarController,
  };
};

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

    it.each<
      { mode: ColumnChooserMode; opened: boolean; result: boolean }
    >([
      { mode: 'dragAndDrop', opened: true, result: true },
      { mode: 'dragAndDrop', opened: false, result: false },
      { mode: 'select', opened: true, result: false },
      { mode: 'select', opened: false, result: false },
    ])('\'dragModeOpened\' state is correct when mode: \'$mode\', column chooser opened: $opened', ({ mode, opened, result }) => {
      const { columnChooserView } = renderColumnChooser({
        columns: ['Column 1', 'Column 2'],
        columnChooser: {
          enabled: true,
          mode,
        },
      }, false);

      if (opened) {
        columnChooserView.show();
      }

      expect(columnChooserView.dragModeOpened.unreactive_get()).toEqual(result);
    });

    describe('Select mode', () => {
      it('popup has correct css classes', () => {
        const { columnChooserView } = renderColumnChooser({
          columns: ['Column 1', 'Column 2'],
          columnChooser: {
            enabled: true,
            mode: 'select',
          },
        });
        const popup = columnChooserView.popupRef.current;
        // @ts-expect-error
        const wrapperElement = popup?._$wrapper.get(0) as HTMLElement | undefined;

        expect(popup?.content().classList).toContain(CLASS.list);
        expect(popup?.content().classList).toContain(CLASS.plain);

        expect(wrapperElement?.classList).toContain(CLASS.root);
        expect(wrapperElement?.classList).toContain(CLASS.selectMode);
      });
    });

    describe('Drag mode', () => {
      it('popup has correct css classes', () => {
        const { columnChooserView } = renderColumnChooser({
          columns: ['Column 1', 'Column 2'],
          columnChooser: {
            enabled: true,
            mode: 'dragAndDrop',
          },
        });
        const popup = columnChooserView.popupRef.current;
        // @ts-expect-error
        const overlayElement = popup?._$wrapper.get(0) as HTMLElement | undefined;

        expect(popup?.content().classList).toContain(CLASS.list);

        expect(overlayElement?.classList).toContain(CLASS.root);
        expect(overlayElement?.classList).toContain(CLASS.dragMode);
      });
    });
  });
});

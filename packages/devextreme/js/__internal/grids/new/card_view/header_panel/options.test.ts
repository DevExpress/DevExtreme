/* eslint-disable spellcheck/spell-checker */
import {
  describe, expect, it, jest,
} from '@jest/globals';
import { rerender } from 'inferno';

import { ColumnsController } from '../../grid_core/columns_controller';
import { DataController } from '../../grid_core/data_controller';
import { Sortable } from '../../grid_core/inferno_wrappers/sortable';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller.mock';
import { HeaderPanelView } from './view';

const setup = (options: Options) => {
  const rootElement = document.createElement('div');
  rootElement.classList.add('test-container');

  const optionsController = new OptionsControllerMock(options);
  const dataController = new DataController(optionsController);
  const columnsController = new ColumnsController(optionsController, dataController);
  const headerPanelView = new HeaderPanelView(columnsController, optionsController);

  headerPanelView.render(rootElement);
  rerender();

  return {
    optionsController,
    dataController,
    columnsController,
    headerPanelView,
    rootElement,
  };
};

describe('Options', () => {
  describe('headerPanel', () => {
    describe('dragging', () => {
      it('should pass options to inner Sortable', () => {
        const renderSpy = jest.spyOn(Sortable.prototype, 'render');

        setup({
          columns: ['column1'],
          allowColumnReordering: true,
          headerPanel: {
            dragging: {
              dropFeedbackMode: 'push',
              scrollSpeed: 555,
              scrollSensitivity: 111,
            },
          },
        });

        // @ts-expect-error
        expect(renderSpy.mock.calls[0][0]).toMatchObject({
          dropFeedbackMode: 'push',
          scrollSpeed: 555,
          scrollSensitivity: 111,
        });
      });
    });

    describe('visible', () => {
      describe('when it is false', () => {
        it('should hide headerPanel', () => {
          const { rootElement } = setup({
            columns: ['column1'],
            headerPanel: {
              visible: false,
            },
          });

          expect(rootElement).toMatchSnapshot();
        });
      });
      describe('when it is true', () => {
        it('should show headerPanel', () => {
          const { rootElement } = setup({
            columns: ['column1'],
            headerPanel: {
              visible: true,
            },
          });

          expect(rootElement).toMatchSnapshot();
        });
      });
    });

    describe('itemTemplate', () => {
      // TODO: fix option controller to enable test
      it.skip('should override content of headerPanel item', () => {
        const { rootElement } = setup({
          columns: ['column1'],
          headerPanel: {
            // @ts-expect-error
            itemTemplate: ({ column }) => $('<div>')
              .addClass('my-class')
              .text(column.caption),
          },
        });

        expect(rootElement).toMatchSnapshot();
      });
    });

    describe('itemCssClass', () => {
      it('should add css class to headerPanel item', () => {
        const { rootElement } = setup({
          columns: ['column1'],
          headerPanel: {
            itemCssClass: 'my-class',
          },
        });

        expect(rootElement.querySelector('.dx-scrollable')).toMatchSnapshot();
      });
    });
  });
});

// TODO: update after related column props are extracted from columns_controller
describe('ColumnProperties', () => {
  describe('headerItemTemplate', () => {
    it.skip('should override content of headerPanel item', () => {
      const { rootElement } = setup({
        columns: [{
          dataField: 'column1',
          // @ts-expect-error
          headerItemTemplate: ({ column }) => $('<div>')
            .addClass('my-class')
            .text(column.caption),
        }],
      });

      expect(rootElement).toMatchSnapshot();
    });
  });
  describe('headerItemCssClass', () => {
    it('should override content of headerPanel item', () => {
      const { rootElement } = setup({
        columns: [{
          dataField: 'column1',
          headerItemCssClass: 'my-css-class',
        }],
      });

      expect(rootElement).toMatchSnapshot();
    });
  });
});

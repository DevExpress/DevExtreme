/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/dot-notation */
import { describe, expect, it } from '@jest/globals';

import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { ToolbarController } from './controller';
import { ToolbarView } from './view';

const createToolbarView = (options?: Options): {
  rootElement: HTMLElement;
  optionsController: OptionsControllerMock;
} => {
  const rootElement = document.createElement('div');
  const optionsController = new OptionsControllerMock(options ?? {
    toolbar: {
      visible: true,
    },
  });

  const toolbarController = new ToolbarController(optionsController);
  const toolbar = new ToolbarView(toolbarController, optionsController);

  toolbar.render(rootElement);

  return {
    rootElement,
    optionsController,
  };
};

describe('Options', () => {
  describe('visilbe', () => {
    describe('when it is \'true\'', () => {
      it('Toolbar should be visible', () => {
        const { rootElement } = createToolbarView({
          toolbar: {
            visible: true,
          },
        });

        expect(rootElement).toMatchSnapshot();
      });
    });

    describe('when it is \'false\'', () => {
      it('Toolbar should be hidden', () => {
        const { rootElement } = createToolbarView({
          toolbar: {
            visible: false,
          },
        });

        expect(rootElement).toMatchSnapshot();
      });
    });

    describe('when changing it to \'false\' at runtime', () => {
      it('Toolbar should be hidden', () => {
        const { rootElement, optionsController } = createToolbarView({
          toolbar: {
            visible: true,
          },
        });

        optionsController.option('toolbar.visible', false);

        expect(rootElement).toMatchSnapshot();
      });
    });

    describe('when changing it to \'true\' at runtime', () => {
      it('Toolbar should be visible', () => {
        const { rootElement, optionsController } = createToolbarView({
          toolbar: {
            visible: false,
          },
        });

        optionsController.option('toolbar.visible', true);

        expect(rootElement).toMatchSnapshot();
      });
    });
  });

  describe('items', () => {
    describe('when these are not set', () => {
      it('Toolbar should be hidden', () => {
        const { rootElement } = createToolbarView({
          toolbar: {
            items: [],
          },
        });

        expect(rootElement).toMatchSnapshot();
      });
    });

    describe('when these are set', () => {
      it('Toolbar should be visible', () => {
        const { rootElement } = createToolbarView({
          toolbar: {
            items: [{
              location: 'before',
              widget: 'dxButton',
              options: {
                text: 'button1',
              },
            }, {
              location: 'after',
              widget: 'dxButton',
              options: {
                text: 'button2',
              },
            }],
          },
        });

        expect(rootElement).toMatchSnapshot();
      });
    });
  });

  describe('disabled', () => {
    describe('when it is \'true\'', () => {
      it('Toolbar should be disabled', () => {
        const { rootElement } = createToolbarView({
          toolbar: {
            visible: true,
            disabled: true,
          },
        });

        expect(rootElement).toMatchSnapshot();
      });
    });

    describe('when it is \'false\'', () => {
      it('Toolbar should not be disabled', () => {
        const { rootElement } = createToolbarView({
          toolbar: {
            visible: true,
            disabled: false,
          },
        });

        expect(rootElement).toMatchSnapshot();
      });
    });
  });
});

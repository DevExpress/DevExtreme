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

describe('render', () => {
  it('empty toolbar', () => {
    const { rootElement } = createToolbarView();

    expect(rootElement).toMatchSnapshot();
  });

  it('Toolbar with options', () => {
    const { rootElement } = createToolbarView({
      toolbar: {
        visible: true,
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

describe('Applying options', () => {
  describe('when visible = \'undefined\' and there are no items', () => {
    it('Toolbar should be hidden', () => {
      const { rootElement } = createToolbarView({
        toolbar: {
          items: [],
        },
      });

      expect(rootElement).toMatchSnapshot();
    });
  });

  describe('when visible = \'undefined\' and there are items', () => {
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

  describe('when visible = \'true\'', () => {
    it('Toolbar should be visible', () => {
      const { rootElement } = createToolbarView({
        toolbar: {
          visible: true,
        },
      });

      expect(rootElement).toMatchSnapshot();
    });
  });

  describe('when visible = \'false\'', () => {
    it('Toolbar should be hidden', () => {
      const { rootElement } = createToolbarView({
        toolbar: {
          visible: false,
        },
      });

      expect(rootElement).toMatchSnapshot();
    });
  });

  describe('when changing a visible to \'false\' at runtime', () => {
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

  describe('when changing a visible to \'true\' at runtime', () => {
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

  describe('when disabled = \'true\'', () => {
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

  describe('when disabled = \'false\'', () => {
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

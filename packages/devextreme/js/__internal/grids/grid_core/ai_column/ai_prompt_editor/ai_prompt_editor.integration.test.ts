import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Popup from '@js/ui/popup';
import TextArea from '@js/ui/text_area';
import { AiPromptEditorModel } from '@ts/grids/grid_core//__tests__/__mock__/model/ai_prompt_editor';

import { AiPromptEditor } from './ai_prompt_editor';
import type { AiPromptEditorOptions } from './types';

const createComponentMock = jest.fn((
  el: dxElementWrapper,
  Widget: any,
  options: any,
): any => new Widget(el, options));

const createAiPromptEditor = (
  options: Partial<AiPromptEditorOptions> = {},
): {
  container: dxElementWrapper;
  instance: AiPromptEditor;
  POM: AiPromptEditorModel;
} => {
  const container = $(document.createElement('div')).appendTo(document.body);
  const instance = new AiPromptEditor({
    ...options,
    container,
    createComponent: createComponentMock,
  });

  return {
    container,
    instance,
    POM: new AiPromptEditorModel(container[0]),
  };
};

const beforeTest = (): void => {
  fx.off = true;
  jest.clearAllMocks();
};

const afterTest = (): void => {
  document.body.innerHTML = '';
  fx.off = false;
};

describe('AiPromptEditor', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when creating an instance', () => {
    it('should create Popup using createComponent', () => {
      const { container } = createAiPromptEditor();

      expect(createComponentMock.mock.calls[0]).toEqual([
        container,
        Popup,
        {
          visible: false,
          width: 360,
          height: 216,
          title: 'AI Prompt Editor',
          contentTemplate: expect.any(Function),
          wrapperAttr: { class: 'dx-ai-prompt-editor' },
          toolbarItems: [
            {
              toolbar: 'bottom',
              location: 'before',
              widget: 'dxButton',
              options: {
                text: 'Regenerate Data',
                disabled: true,
                elementAttr: {
                  class: 'dx-ai-prompt-editor__refresh-button',
                },
                onClick: expect.any(Function),
              },
            },
            {
              toolbar: 'bottom',
              location: 'after',
              widget: 'dxButton',
              options: {
                text: 'Apply',
                disabled: true,
                elementAttr: {
                  class: 'dx-ai-prompt-editor__apply-button',
                },
                onClick: expect.any(Function),
              },
            },
          ],
        },
      ]);
    });
  });

  describe('when creating an instance', () => {
    it('should create TextArea using createComponent', () => {
      const { POM } = createAiPromptEditor({ popupOptions: { visible: true } });

      expect(createComponentMock.mock.calls[1]).toEqual([
        $(POM.getTextAreaElement()),
        TextArea,
        {
          onValueChanged: expect.any(Function),
          value: '',
          valueChangeEvent: 'input change keyup',
        },
      ]);
    });
  });

  describe('when show is called', () => {
    it('should be visible', async () => {
      const { instance, POM } = createAiPromptEditor();

      await instance.show();

      expect(POM.isVisible()).toBe(true);
    });
  });

  describe('when hide is called', () => {
    it('should be hidden', async () => {
      const { instance, POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      expect(POM.isVisible()).toBe(true);

      await instance.hide();

      expect(POM.isVisible()).toBe(false);
    });
  });

  describe('when "Regenerate Data" button is clicked', () => {
    it('should call onRefresh', () => {
      const onRefreshMock = jest.fn(() => Promise.resolve());

      const { POM } = createAiPromptEditor({
        value: 'test',
        popupOptions: { visible: true },
        onRefresh: onRefreshMock,
      });

      POM.getRefreshButtonElement().click();

      expect(onRefreshMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when "Apply" button is clicked', () => {
    it('should call onSubmit', () => {
      const onSubmitMock = jest.fn(() => Promise.resolve());

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      POM.changeTextAreaValue('test'); // Change the value to enable the "Apply" button
      POM.getApplyButtonElement().click();

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Regenerate Data button', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when no initial value is provided', () => {
    it('should be disabled', () => {
      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      expect(POM.isRefreshButtonDisabled()).toBe(true);
    });
  });

  describe('when initial value is empty string', () => {
    it('should be disabled', () => {
      const { POM } = createAiPromptEditor({
        value: '',
        popupOptions: { visible: true },
      });

      expect(POM.isRefreshButtonDisabled()).toBe(true);
    });
  });

  describe('when initial value is provided', () => {
    it('should be enabled', () => {
      const { POM } = createAiPromptEditor({
        value: 'initial text',
        popupOptions: { visible: true },
      });

      expect(POM.isRefreshButtonDisabled()).toBe(false);
    });
  });

  describe('when text area value changes', () => {
    it('should remain enabled', () => {
      const { POM } = createAiPromptEditor({
        value: 'initial text',
        popupOptions: { visible: true },
      });

      POM.changeTextAreaValue('changed text');

      expect(POM.isRefreshButtonDisabled()).toBe(false);
    });
  });

  describe('when Apply button is clicked and onSubmit completes', () => {
    it('should become enabled', async () => {
      const onSubmitMock = jest.fn(() => Promise.resolve());

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      expect(POM.isRefreshButtonDisabled()).toBe(true);

      // Change text and apply
      POM.changeTextAreaValue('new text');
      POM.getApplyButtonElement().click();
      await Promise.resolve();

      expect(POM.isRefreshButtonDisabled()).toBe(false);
    });
  });

  describe('when Apply button is clicked and onSubmit completes asynchronously', () => {
    it('should become enabled', async () => {
      let resolveFn: () => void = () => {};
      const onSubmitMock = jest.fn(() => new Promise<void>((resolve) => {
        resolveFn = resolve;
      }));

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      expect(POM.isRefreshButtonDisabled()).toBe(true);

      // Change text and apply
      POM.changeTextAreaValue('new text');
      POM.getApplyButtonElement().click();

      expect(POM.isRefreshButtonDisabled()).toBe(true);

      resolveFn();
      await Promise.resolve();

      expect(POM.isRefreshButtonDisabled()).toBe(false);
    });
  });
});

describe('Apply button', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when no initial value is provided', () => {
    it('should be disabled', () => {
      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      expect(POM.isApplyButtonDisabled()).toBe(true);
    });
  });

  describe('when initial value is provided', () => {
    it('should be disabled', () => {
      const { POM } = createAiPromptEditor({
        value: 'initial text',
        popupOptions: { visible: true },
      });

      expect(POM.isApplyButtonDisabled()).toBe(true);
    });
  });

  describe('when text area value changes from empty', () => {
    it('should be enabled', () => {
      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      expect(POM.isApplyButtonDisabled()).toBe(true);

      POM.changeTextAreaValue('new text');

      expect(POM.isApplyButtonDisabled()).toBe(false);
    });
  });

  describe('when text area value changes from non-empty', () => {
    it('should be enabled', () => {
      const { POM } = createAiPromptEditor({
        value: 'initial text',
        popupOptions: { visible: true },
      });

      expect(POM.isApplyButtonDisabled()).toBe(true);

      POM.changeTextAreaValue('changed text');

      expect(POM.isApplyButtonDisabled()).toBe(false);
    });
  });

  describe('when text area value is changed back to initial value', () => {
    it('should be disabled', () => {
      const { POM } = createAiPromptEditor({
        value: 'initial text',
        popupOptions: { visible: true },
      });

      expect(POM.isApplyButtonDisabled()).toBe(true);

      // Change value
      POM.changeTextAreaValue('changed text');
      expect(POM.isApplyButtonDisabled()).toBe(false);

      // Change back to initial
      POM.changeTextAreaValue('initial text');
      expect(POM.isApplyButtonDisabled()).toBe(true);
    });
  });

  describe('when it is clicked', () => {
    it('should become disabled', () => {
      const onSubmitMock = jest.fn(() => Promise.resolve());

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      POM.changeTextAreaValue('new text');
      expect(POM.isApplyButtonDisabled()).toBe(false);

      POM.getApplyButtonElement().click();

      expect(POM.isApplyButtonDisabled()).toBe(true);
    });
  });

  describe('when it is clicked and text is changed again', () => {
    it('should be enabled', () => {
      const onSubmitMock = jest.fn(() => Promise.resolve());

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      // First change and apply
      POM.changeTextAreaValue('new text');
      POM.getApplyButtonElement().click();
      expect(POM.isApplyButtonDisabled()).toBe(true);

      // Second change
      POM.changeTextAreaValue('another text');
      expect(POM.isApplyButtonDisabled()).toBe(false);
    });
  });
});

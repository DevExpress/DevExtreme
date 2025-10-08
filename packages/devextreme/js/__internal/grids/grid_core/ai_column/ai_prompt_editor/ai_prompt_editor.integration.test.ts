import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Popup from '@js/ui/popup';
import ProgressBar from '@js/ui/progress_bar';
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
          height: 'auto',
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
            {
              toolbar: 'bottom',
              location: 'after',
              widget: 'dxButton',
              visible: false,
              options: {
                text: 'Stop',
                elementAttr: {
                  class: 'dx-ai-prompt-editor__stop-button',
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

  describe('when creating an instance', () => {
    it('should create ProgressBar using createComponent', () => {
      const { POM } = createAiPromptEditor({ popupOptions: { visible: true } });

      expect(createComponentMock.mock.calls[2]).toEqual([
        $(POM.getProgressBarElement()),
        ProgressBar,
        {
          value: false,
          visible: false,
          showStatus: false,
          width: '100%',
        },
      ]);
    });
  });

  describe('when "Regenerate Data" button is clicked', () => {
    it('should call onRefresh', () => {
      const onRefreshMock = jest.fn();

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
      const onSubmitMock = jest.fn();

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      POM.changeTextAreaValue('test'); // Change the value to enable the "Apply" button
      POM.getApplyButtonElement().click();

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('when "Stop" button is clicked', () => {
    it('should call onStop', () => {
      const onStopMock = jest.fn();
      const onSubmitMock = jest.fn();

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onStop: onStopMock,
        onSubmit: onSubmitMock,
      });

      POM.changeTextAreaValue('test'); // Change the value to enable the "Apply" button
      POM.getApplyButtonElement().click();

      expect(onStopMock).toHaveBeenCalledTimes(0);
      expect(onSubmitMock).toHaveBeenCalledTimes(1);

      POM.getStopButtonElement().click();

      expect(onStopMock).toHaveBeenCalledTimes(1);
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

  /*
  describe('when it is clicked', () => {
    it('should become disabled', () => {
      const onSubmitMock = jest.fn();

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
    it('should be enabled', async () => {
      const onSubmitMock = jest.fn(() => Promise.resolve());

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      // First change and apply
      POM.changeTextAreaValue('new text');
      POM.getApplyButtonElement().click();
      await Promise.resolve();

      expect(POM.isApplyButtonDisabled()).toBe(true);

      // Second change
      POM.changeTextAreaValue('another text');

      expect(POM.isApplyButtonDisabled()).toBe(false);
    });
  });

  describe('when Stop button is clicked', () => {
    it('should become disabled', () => {
      const onSubmitMock = jest.fn(() => Promise.resolve());

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      POM.changeTextAreaValue('new text');
      POM.getApplyButtonElement().click();

      expect(POM.isApplyButtonDisabled()).toBe(true);

      POM.getStopButtonElement().click();

      expect(POM.isApplyButtonDisabled()).toBe(true);
    });
  });

  describe('when Stop button is clicked and initial value is set', () => {
    it('should become enabled', async () => {
      let rejectFn: () => void = () => {};
      const onSubmitMock = jest.fn(() => new Promise<void>((_, reject) => {
        rejectFn = reject;
      }));
      const onStopMock = jest.fn(() => {
        rejectFn();
        return Promise.resolve();
      });

      const { POM } = createAiPromptEditor({
        value: 'initial text',
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
        onStop: onStopMock,
      });

      POM.changeTextAreaValue('new text');
      POM.getApplyButtonElement().click();

      expect(POM.isApplyButtonDisabled()).toBe(true);

      POM.getStopButtonElement().click();
      await Promise.resolve();

      expect(POM.isApplyButtonDisabled()).toBe(false);
    });
  });
  */
});

describe('Stop button', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when editor is created', () => {
    it('should be hidden by default', () => {
      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      expect(POM.isStopButtonVisible()).toBe(false);
    });
  });
/*
  describe('when Apply button is clicked', () => {
    it('should become visible', () => {
      let resolveFn: () => void = () => {};
      const onSubmitMock = jest.fn(() => new Promise<void>((resolve) => {
        resolveFn = resolve;
      }));

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      expect(POM.isStopButtonVisible()).toBe(false);

      POM.changeTextAreaValue('test');
      POM.getApplyButtonElement().click();

      expect(POM.isStopButtonVisible()).toBe(true);

      resolveFn();
    });
  });

  describe('when onSubmit completes', () => {
    it('should become hidden', async () => {
      const onSubmitMock = jest.fn(() => Promise.resolve());

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      POM.changeTextAreaValue('test');
      POM.getApplyButtonElement().click();

      expect(POM.isStopButtonVisible()).toBe(true);

      await Promise.resolve();

      expect(POM.isStopButtonVisible()).toBe(false);
    });
  });

  describe('when Apply button becomes visible', () => {
    it('should be hidden', async () => {
      const onSubmitMock = jest.fn(() => Promise.resolve());

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      // Initially Apply is visible, Stop is hidden
      expect(POM.isApplyButtonVisible()).toBe(true);
      expect(POM.isStopButtonVisible()).toBe(false);

      POM.changeTextAreaValue('test');
      POM.getApplyButtonElement().click();

      // During submit: Apply is hidden, Stop is visible
      expect(POM.isApplyButtonVisible()).toBe(false);
      expect(POM.isStopButtonVisible()).toBe(true);

      await Promise.resolve();

      expect(POM.isStopButtonVisible()).toBe(false);
    });
  }); */
});

describe('TextArea', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when editor is created', () => {
    it('should be enabled by default', () => {
      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      const textArea = POM.getTextArea();
      expect(textArea.disabled).toBe(false);
    });
  });

  /*
  describe('when Apply button is clicked', () => {
    it('should become disabled', () => {
      const onSubmitMock = jest.fn(() => Promise.resolve());

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      const textArea = POM.getTextArea();

      POM.changeTextAreaValue('test');
      expect(textArea.disabled).toBe(false);

      POM.getApplyButtonElement().click();
      expect(textArea.disabled).toBe(true);
    });

    it('should become enabled after submit completes', async () => {
      const onSubmitMock = jest.fn(() => Promise.resolve());

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      const textArea = POM.getTextArea();

      POM.changeTextAreaValue('test');
      POM.getApplyButtonElement().click();

      expect(textArea.disabled).toBe(true);

      await Promise.resolve();

      expect(textArea.disabled).toBe(false);
    });
  });

  describe('when Stop button is clicked', () => {
    it('should become enabled', async () => {
      const onSubmitMock = jest.fn(() => Promise.resolve());

      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
        onSubmit: onSubmitMock,
      });

      const textArea = POM.getTextArea();

      POM.changeTextAreaValue('test');
      POM.getApplyButtonElement().click();

      expect(textArea.disabled).toBe(true);

      POM.getStopButtonElement().click();
      await Promise.resolve();

      expect(textArea.disabled).toBe(false);
    });
  });
  */
});

describe('Public Methods', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when toggleDisableState is called', () => {
    it('should disable all controls when disabled is true', () => {
      const { instance, POM } = createAiPromptEditor({
        value: 'initial text',
        popupOptions: { visible: true },
      });

      // Initially enabled
      expect(POM.isRefreshButtonDisabled()).toBe(false);
      expect(POM.isApplyButtonDisabled()).toBe(true); // Apply is disabled because no changes
      expect(POM.getTextArea().disabled).toBe(false);

      instance.toggleDisableState(true);

      expect(POM.isRefreshButtonDisabled()).toBe(true);
      expect(POM.isApplyButtonDisabled()).toBe(true);
      expect(POM.getTextArea().disabled).toBe(true);
    });

    it('should enable controls based on state when disabled is false', () => {
      const { instance, POM } = createAiPromptEditor({
        value: 'initial text',
        popupOptions: { visible: true },
      });

      // Disable first
      instance.toggleDisableState(true);
      // Then enable
      instance.toggleDisableState(false);

      expect(POM.isRefreshButtonDisabled()).toBe(false); // Should be enabled because value exists
      expect(POM.isApplyButtonDisabled()).toBe(true); // Should remain disabled because no changes
      expect(POM.getTextArea().disabled).toBe(false);
    });

    describe('when no initial value is provided', () => {
      it('should enable controls based on state when disabled is false', () => {
        const { instance, POM } = createAiPromptEditor({
          popupOptions: { visible: true },
        });

        // Disable first
        instance.toggleDisableState(true);
        // Then enable
        instance.toggleDisableState(false);

        expect(POM.isRefreshButtonDisabled())
          .toBe(true); // Should be disabled because value is empty
        expect(POM.isApplyButtonDisabled())
          .toBe(true); // Should remain disabled because no changes
        expect(POM.getTextArea().disabled)
          .toBe(false);
      });
    });
  });

  describe('when toggleApplyButtonVisibility is called', () => {
    it('should show Apply and hide Stop when isApplyButtonVisible is true', () => {
      const { instance, POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      instance.toggleApplyButtonVisibility(true);

      expect(POM.isApplyButtonVisible()).toBe(true);
      expect(POM.isStopButtonVisible()).toBe(false);
    });

    it('should hide Apply and show Stop when isApplyButtonVisible is false', () => {
      const { instance, POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      instance.toggleApplyButtonVisibility(false);

      expect(POM.isApplyButtonVisible()).toBe(false);
      expect(POM.isStopButtonVisible()).toBe(true);
    });

    it('should toggle visibility correctly', () => {
      const { instance, POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      // Initially Apply is visible
      expect(POM.isApplyButtonVisible()).toBe(true);
      expect(POM.isStopButtonVisible()).toBe(false);

      // Hide Apply, show Stop
      instance.toggleApplyButtonVisibility(false);
      expect(POM.isApplyButtonVisible()).toBe(false);
      expect(POM.isStopButtonVisible()).toBe(true);

      // Show Apply, hide Stop
      instance.toggleApplyButtonVisibility(true);
      expect(POM.isApplyButtonVisible()).toBe(true);
      expect(POM.isStopButtonVisible()).toBe(false);
    });
  });

  describe('when updateValue is called', () => {
    it('should update internal value and enable Regenerate Data button', () => {
      const { instance, POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      instance.updateValue('new value');

      expect(POM.getTextArea().value).toBe('new value');
    });

    it('should update internal value and disable Regenerate Data button', () => {
      const { instance, POM } = createAiPromptEditor({
        value: 'initial text',
        popupOptions: { visible: true },
      });

      instance.updateValue('');

      expect(POM.getTextArea().value).toBe('');
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

  describe('when updateOptions is called', () => {
    it('should update the prompt editor options', async () => {
      const { container, instance, POM } = createAiPromptEditor({
        value: 'updated prompt',
        popupOptions: { visible: true },
      });

      await instance.show();

      expect(POM.getTextArea().value).toBe('updated prompt');
      expect(POM.isRefreshButtonDisabled()).toBe(false);
      expect(POM.isApplyButtonDisabled()).toBe(true);
      expect(POM.isApplyButtonVisible()).toBe(true);

      instance.updateOptions({
        container,
        value: '',
        createComponent: createComponentMock,
        popupOptions: { visible: true },
      });

      expect(POM.getTextArea().value).toBe('');
      expect(POM.isRefreshButtonDisabled()).toBe(true);
      expect(POM.isApplyButtonDisabled()).toBe(true);
      expect(POM.isApplyButtonVisible()).toBe(true);
    });
  });

  describe('when setLoading is called', () => {
    it('should show progress bar when isLoading is true', () => {
      const { instance, POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      expect(POM.isProgressBarVisible()).toBe(false);

      instance.setLoading(true);

      expect(POM.isProgressBarVisible()).toBe(true);
    });

    it('should hide progress bar when isLoading is false', () => {
      const { instance, POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      instance.setLoading(true);
      expect(POM.isProgressBarVisible()).toBe(true);

      instance.setLoading(false);
      expect(POM.isProgressBarVisible()).toBe(false);
    });
  });
});

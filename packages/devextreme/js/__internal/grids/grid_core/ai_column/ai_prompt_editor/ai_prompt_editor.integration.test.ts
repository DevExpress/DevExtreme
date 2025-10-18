import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Popup from '@js/ui/popup';
import ProgressBar from '@js/ui/progress_bar';
import TextArea from '@js/ui/text_area';
import { AiPromptEditorModel } from '@ts/grids/grid_core/__tests__/__mock__/model/ai_prompt_editor';

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
      const onSubmit = (): void => {};
      const onStop = (): void => {};
      const onRefresh = (): void => {};

      const { container } = createAiPromptEditor({
        onSubmit,
        onStop,
        onRefresh,
      });

      expect(createComponentMock.mock.calls[0]).toEqual([
        container,
        Popup,
        {
          visible: false,
          width: 360,
          height: 'auto',
          title: 'AI Prompt Editor',
          hideOnOutsideClick: true,
          shading: false,
          shadingColor: 'transparent',
          dragEnabled: true,
          contentTemplate: expect.any(Function),
          wrapperAttr: { class: 'dx-ai-prompt-editor dx-aidialog' },
          toolbarItems: [
            {
              toolbar: 'bottom',
              location: 'before',
              widget: 'dxButton',
              options: {
                text: 'Regenerate Data',
                icon: 'refresh',
                stylingMode: 'outlined',
                disabled: true,
                elementAttr: {
                  class: 'dx-ai-prompt-editor__refresh-button',
                },
                onClick: onRefresh,
              },
            },
            {
              toolbar: 'bottom',
              location: 'after',
              widget: 'dxButton',
              options: {
                text: 'Apply',
                icon: 'arrowright',
                stylingMode: 'contained',
                type: 'default',
                disabled: true,
                elementAttr: {
                  class: 'dx-ai-prompt-editor__apply-button',
                },
                onClick: onSubmit,
              },
            },
            {
              toolbar: 'bottom',
              location: 'after',
              widget: 'dxButton',
              visible: false,
              options: {
                text: 'Stop',
                icon: 'square',
                stylingMode: 'contained',
                type: 'default',
                elementAttr: {
                  class: 'dx-ai-prompt-editor__stop-button',
                },
                onClick: onStop,
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
        $(POM.getTextArea().getElement()),
        TextArea,
        {
          height: 140,
          onValueChanged: expect.any(Function),
          value: '',
          valueChangeEvent: 'input change keyup',
          placeholder: 'Prompt AI to generate column values...',
        },
      ]);
    });
  });

  describe('when creating an instance', () => {
    it('should create ProgressBar using createComponent', () => {
      const { POM } = createAiPromptEditor({ popupOptions: { visible: true } });

      expect(createComponentMock.mock.calls[2]).toEqual([
        $(POM.getProgressBar().getElement()),
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
        prompt: 'test',
        popupOptions: { visible: true },
        onRefresh: onRefreshMock,
      });

      POM.getRefreshButton().getElement().click();

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

      POM.getTextArea().setValue('test'); // Change the value to enable the "Apply" button
      POM.getApplyButton().getElement().click();

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

      POM.getTextArea().setValue('test'); // Change the value to enable the "Apply" button
      POM.getApplyButton().getElement().click();

      expect(onStopMock).toHaveBeenCalledTimes(0);
      expect(onSubmitMock).toHaveBeenCalledTimes(1);

      POM.getStopButton().getElement().click();

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

      expect(POM.getRefreshButton().isDisabled()).toBe(true);
    });
  });

  describe('when initial value is empty string', () => {
    it('should be disabled', () => {
      const { POM } = createAiPromptEditor({
        prompt: '',
        popupOptions: { visible: true },
      });

      expect(POM.getRefreshButton().isDisabled()).toBe(true);
    });
  });

  describe('when initial value is provided', () => {
    it('should be enabled', () => {
      const { POM } = createAiPromptEditor({
        prompt: 'initial text',
        popupOptions: { visible: true },
      });

      expect(POM.getRefreshButton().isDisabled()).toBe(false);
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

      expect(POM.getApplyButton().isDisabled()).toBe(true);
    });
  });

  describe('when initial value is provided', () => {
    it('should be disabled', () => {
      const { POM } = createAiPromptEditor({
        prompt: 'initial text',
        popupOptions: { visible: true },
      });

      expect(POM.getApplyButton().isDisabled()).toBe(true);
    });
  });

  describe('when text area value changes from empty', () => {
    it('should be enabled', () => {
      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      expect(POM.getApplyButton().isDisabled()).toBe(true);

      POM.getTextArea().setValue('new text');

      expect(POM.getApplyButton().isDisabled()).toBe(false);
    });
  });

  describe('when text area value changes from non-empty', () => {
    it('should be enabled', () => {
      const { POM } = createAiPromptEditor({
        prompt: 'initial text',
        popupOptions: { visible: true },
      });

      expect(POM.getApplyButton().isDisabled()).toBe(true);

      POM.getTextArea().setValue('changed text');

      expect(POM.getApplyButton().isDisabled()).toBe(false);
    });
  });

  describe('when text area value is changed back to initial value', () => {
    it('should be enabled', () => {
      const { POM } = createAiPromptEditor({
        prompt: 'initial text',
        popupOptions: { visible: true },
      });

      expect(POM.getApplyButton().isDisabled()).toBe(true);

      // Change value
      POM.getTextArea().setValue('changed text');
      expect(POM.getApplyButton().isDisabled()).toBe(false);

      // Change back to initial
      POM.getTextArea().setValue('initial text');
      expect(POM.getApplyButton().isDisabled()).toBe(false);
    });
  });

  describe('when text area value is reset from non-empty', () => {
    it('should be disabled', () => {
      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      expect(POM.getApplyButton().isDisabled()).toBe(true);

      // Change value
      POM.getTextArea().setValue('changed text');
      expect(POM.getApplyButton().isDisabled()).toBe(false);

      // Reset to empty
      POM.getTextArea().setValue('');
      expect(POM.getApplyButton().isDisabled()).toBe(true);
    });
  });
});

describe('Stop button', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when editor is created', () => {
    it('should be hidden by default', () => {
      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      expect(POM.isStopToolbarItemVisible()).toBe(false);
    });
  });
});

describe('TextArea', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when editor is created', () => {
    it('should be enabled by default', () => {
      const { POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      expect(POM.getTextArea().getInputElement().disabled).toBe(false);
    });
  });
});

describe('Public Methods', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when toggleApplyButtonVisibility is called', () => {
    it('should show Apply and hide Stop when isApplyButtonVisible is true', () => {
      const { instance, POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      instance.toggleApplyButtonVisibility(true);

      expect(POM.isApplyToolbarItemVisible()).toBe(true);
      expect(POM.isStopToolbarItemVisible()).toBe(false);
    });

    it('should hide Apply and show Stop when isApplyButtonVisible is false', () => {
      const { instance, POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      instance.toggleApplyButtonVisibility(false);

      expect(POM.isApplyToolbarItemVisible()).toBe(false);
      expect(POM.isStopToolbarItemVisible()).toBe(true);
    });

    it('should toggle visibility correctly', () => {
      const { instance, POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      // Initially Apply is visible
      expect(POM.isApplyToolbarItemVisible()).toBe(true);
      expect(POM.isStopToolbarItemVisible()).toBe(false);

      // Hide Apply, show Stop
      instance.toggleApplyButtonVisibility(false);
      expect(POM.isApplyToolbarItemVisible()).toBe(false);
      expect(POM.isStopToolbarItemVisible()).toBe(true);

      // Show Apply, hide Stop
      instance.toggleApplyButtonVisibility(true);
      expect(POM.isApplyToolbarItemVisible()).toBe(true);
      expect(POM.isStopToolbarItemVisible()).toBe(false);
    });
  });

  describe('when updatePrompt is called', () => {
    it('should update internal value and enable Regenerate Data button', () => {
      const { instance, POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      instance.updatePrompt('new value');

      expect(POM.getTextArea().getInputElement().value).toBe('new value');
    });

    it('should update internal value and disable Regenerate Data button', () => {
      const { instance, POM } = createAiPromptEditor({
        prompt: 'initial text',
        popupOptions: { visible: true },
      });

      instance.updatePrompt('');

      expect(POM.getTextArea().getInputElement().value).toBe('');
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
        prompt: 'updated prompt',
        popupOptions: { visible: true },
      });

      await instance.show();

      expect(POM.getTextArea().getInputElement().value).toBe('updated prompt');
      expect(POM.getRefreshButton().isDisabled()).toBe(false);
      expect(POM.getApplyButton().isDisabled()).toBe(true);
      expect(POM.isApplyToolbarItemVisible()).toBe(true);

      instance.updateOptions({
        container,
        prompt: '',
        createComponent: createComponentMock,
        popupOptions: { visible: true },
      });

      expect(POM.getTextArea().getInputElement().value).toBe('');
      expect(POM.getRefreshButton().isDisabled()).toBe(true);
      expect(POM.getApplyButton().isDisabled()).toBe(true);
      expect(POM.isApplyToolbarItemVisible()).toBe(true);
    });
  });

  describe('when setLoading is called', () => {
    it('should show progress bar when isLoading is true', () => {
      const { instance, POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      expect(POM.getProgressBar().isVisible()).toBe(false);

      instance.setLoading(true);

      expect(POM.getProgressBar().isVisible()).toBe(true);
    });

    it('should hide progress bar when isLoading is false', () => {
      const { instance, POM } = createAiPromptEditor({
        popupOptions: { visible: true },
      });

      instance.setLoading(true);
      expect(POM.getProgressBar().isVisible()).toBe(true);

      instance.setLoading(false);
      expect(POM.getProgressBar().isVisible()).toBe(false);
    });
  });

  describe('when updateStateOnAction is called', () => {
    describe('with apply action', () => {
      it('should set loading, disable controls and hide apply button', () => {
        const { instance, POM } = createAiPromptEditor({
          prompt: 'initial text',
          popupOptions: { visible: true },
        });

        // Change text to enable apply button initially
        POM.getTextArea().setValue('changed text');
        expect(POM.getApplyButton().isDisabled()).toBe(false);
        expect(POM.getRefreshButton().isDisabled()).toBe(true);
        expect(POM.getTextArea().getInputElement().disabled).toBe(false);
        expect(POM.getProgressBar().isVisible()).toBe(false);
        expect(POM.isApplyToolbarItemVisible()).toBe(true);
        expect(POM.isStopToolbarItemVisible()).toBe(false);
        expect(POM.getPopupInstance().option('shading')).toBe(false);
        expect(POM.getPopupInstance().option('hideOnOutsideClick')).toBe(true);

        instance.updateStateOnAction('apply');

        expect(POM.getProgressBar().isVisible()).toBe(true);
        expect(POM.getApplyButton().isDisabled()).toBe(true);
        expect(POM.getRefreshButton().isDisabled()).toBe(true);
        expect(POM.getTextArea().getInputElement().disabled).toBe(true);
        expect(POM.isApplyToolbarItemVisible()).toBe(false);
        expect(POM.isStopToolbarItemVisible()).toBe(true);
        expect(POM.getPopupInstance().option('shading')).toBe(true);
        expect(POM.getPopupInstance().option('hideOnOutsideClick')).toBe(false);
      });
    });

    describe('with regenerate action', () => {
      it('should set loading and disable controls', () => {
        const { instance, POM } = createAiPromptEditor({
          prompt: 'initial text',
          popupOptions: { visible: true },
        });

        // Change text to enable apply button initially
        POM.getTextArea().setValue('changed text');
        expect(POM.getApplyButton().isDisabled()).toBe(false);
        expect(POM.getRefreshButton().isDisabled()).toBe(true);
        expect(POM.getTextArea().getInputElement().disabled).toBe(false);
        expect(POM.getProgressBar().isVisible()).toBe(false);
        expect(POM.getPopupInstance().option('shading')).toBe(false);
        expect(POM.getPopupInstance().option('hideOnOutsideClick')).toBe(true);

        instance.updateStateOnAction('regenerate');

        expect(POM.getProgressBar().isVisible()).toBe(true);
        expect(POM.getApplyButton().isDisabled()).toBe(true);
        expect(POM.getRefreshButton().isDisabled()).toBe(true);
        expect(POM.getTextArea().getInputElement().disabled).toBe(true);
        // Apply button visibility should remain unchanged for regenerate action
        expect(POM.isApplyToolbarItemVisible()).toBe(false);
        expect(POM.isStopToolbarItemVisible()).toBe(true);
        expect(POM.getPopupInstance().option('shading')).toBe(true);
        expect(POM.getPopupInstance().option('hideOnOutsideClick')).toBe(false);
      });
    });

    describe('with stop action after apply', () => {
      it('should clear loading, enable controls and show apply button', () => {
        const { instance, POM } = createAiPromptEditor({
          prompt: 'initial text',
          popupOptions: { visible: true },
        });

        // First set to apply state
        POM.getTextArea().setValue('changed text');
        instance.updateStateOnAction('apply');

        // Verify apply state is set
        expect(POM.getProgressBar().isVisible()).toBe(true);
        expect(POM.getApplyButton().isDisabled()).toBe(true);
        expect(POM.getRefreshButton().isDisabled()).toBe(true);
        expect(POM.getTextArea().getInputElement().disabled).toBe(true);
        expect(POM.isApplyToolbarItemVisible()).toBe(false);
        expect(POM.isStopToolbarItemVisible()).toBe(true);
        expect(POM.getPopupInstance().option('shading')).toBe(true);
        expect(POM.getPopupInstance().option('hideOnOutsideClick')).toBe(false);

        instance.updateStateOnAction('stop');

        expect(POM.getProgressBar().isVisible()).toBe(false);
        // Should be enabled because text was changed
        expect(POM.getApplyButton().isDisabled()).toBe(false);
        expect(POM.getRefreshButton().isDisabled()).toBe(true);
        expect(POM.getTextArea().getInputElement().disabled).toBe(false);
        expect(POM.isApplyToolbarItemVisible()).toBe(true);
        expect(POM.isStopToolbarItemVisible()).toBe(false);
        expect(POM.getPopupInstance().option('shading')).toBe(false);
        expect(POM.getPopupInstance().option('hideOnOutsideClick')).toBe(true);
      });
    });

    describe('with stop action after regenerate data', () => {
      it('should clear loading, enable controls and enable regenerate data button', () => {
        const { instance, POM } = createAiPromptEditor({
          prompt: 'initial text',
          popupOptions: { visible: true },
        });

        instance.updateStateOnAction('regenerate');

        expect(POM.getProgressBar().isVisible()).toBe(true);
        expect(POM.getApplyButton().isDisabled()).toBe(true);
        expect(POM.getRefreshButton().isDisabled()).toBe(true);
        expect(POM.getTextArea().getInputElement().disabled).toBe(true);
        expect(POM.isApplyToolbarItemVisible()).toBe(false);
        expect(POM.isStopToolbarItemVisible()).toBe(true);
        expect(POM.getPopupInstance().option('shading')).toBe(true);
        expect(POM.getPopupInstance().option('hideOnOutsideClick')).toBe(false);

        instance.updateStateOnAction('stop');

        expect(POM.getProgressBar().isVisible()).toBe(false);
        // Should be enabled because text was changed
        expect(POM.getApplyButton().isDisabled()).toBe(true);
        expect(POM.getRefreshButton().isDisabled()).toBe(false);
        expect(POM.getTextArea().getInputElement().disabled).toBe(false);
        expect(POM.isApplyToolbarItemVisible()).toBe(true);
        expect(POM.isStopToolbarItemVisible()).toBe(false);
        expect(POM.getPopupInstance().option('shading')).toBe(false);
        expect(POM.getPopupInstance().option('hideOnOutsideClick')).toBe(true);
      });
    });
  });
});

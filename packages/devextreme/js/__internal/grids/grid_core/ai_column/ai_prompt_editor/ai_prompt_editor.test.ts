import {
  beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Popup from '@js/ui/popup';
import TextArea from '@js/ui/text_area';

import { AiPromptEditor } from './ai_prompt_editor';
import type { AiPromptEditorOptions } from './types';

const textAreaInstanceMock = {};
const popupInstanceMock = {
  show: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
  hide: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
};

const createComponentMock = jest.fn((
  el: dxElementWrapper,
  Widget: any,
  options: any,
) => {
  switch (true) {
    case Widget === Popup:
      options.contentTemplate();
      return popupInstanceMock;
    case Widget === TextArea:
      return textAreaInstanceMock;
    default:
      return {};
  }
});

const createAiPromptEditor = (
  options: AiPromptEditorOptions,
): AiPromptEditor => new AiPromptEditor(options);

describe('AiPromptEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when creating an instance', () => {
    it('should create Popup using createComponent', () => {
      const container = $(document.createElement('div'));
      createAiPromptEditor({
        container,
        createComponent: createComponentMock,
      });

      expect(createComponentMock.mock.calls[0]).toEqual([
        container,
        Popup,
        {
          visible: false,
          contentTemplate: expect.any(Function),
          toolbarItems: [
            {
              toolbar: 'bottom',
              location: 'before',
              widget: 'dxButton',
              options: {
                text: 'Regenerate Data',
                onClick: expect.any(Function),
              },
            },
            {
              toolbar: 'bottom',
              location: 'after',
              widget: 'dxButton',
              options: {
                text: 'Apply',
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
      const container = $(document.createElement('div'));
      createAiPromptEditor({
        container,
        createComponent: createComponentMock,
      });

      expect(createComponentMock.mock.calls[1]).toEqual([
        $('<div>'),
        TextArea,
        {},
      ]);
    });
  });

  describe('when show is called', () => {
    it('should call show on popupInstance', async () => {
      const container = $(document.createElement('div'));
      const aiPromptEditor = createAiPromptEditor({
        container,
        createComponent: createComponentMock,
      });

      await aiPromptEditor.show();

      expect(popupInstanceMock.show).toHaveBeenCalled();
    });
  });

  describe('when hide is called', () => {
    it('should call hide on popupInstance', async () => {
      const container = $(document.createElement('div'));
      const aiPromptEditor = createAiPromptEditor({
        container,
        createComponent: createComponentMock,
      });

      await aiPromptEditor.hide();

      expect(popupInstanceMock.hide).toHaveBeenCalled();
    });
  });

  describe('when onSubmit is provided', () => {
    it('should call onSubmit when "Regenerate Data" button is clicked', () => {
      const container = $(document.createElement('div'));
      const onSubmitMock = jest.fn();

      createAiPromptEditor({
        container,
        createComponent: createComponentMock,
        onSubmit: onSubmitMock,
      });

      const regenerateButtonConfig = createComponentMock.mock.calls[0][2].toolbarItems[0];

      regenerateButtonConfig.options.onClick();

      expect(onSubmitMock).toHaveBeenCalled();
    });
  });

  describe('when onRefresh is provided', () => {
    it('should call onRefresh when "Apply" button is clicked', () => {
      const container = $(document.createElement('div'));
      const onRefreshMock = jest.fn();

      createAiPromptEditor({
        container,
        createComponent: createComponentMock,
        onRefresh: onRefreshMock,
      });

      const applyButtonConfig = createComponentMock.mock.calls[0][2].toolbarItems[1];

      applyButtonConfig.options.onClick();

      expect(onRefreshMock).toHaveBeenCalled();
    });
  });
});

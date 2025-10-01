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
});

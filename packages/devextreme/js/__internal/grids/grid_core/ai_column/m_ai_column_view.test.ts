/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { AiPromptEditorModel } from '@ts/grids/grid_core//__tests__/__mock__/model/ai_prompt_editor';

import type { Column } from '../columns_controller/m_columns_controller';
import { AiPromptEditor } from './ai_prompt_editor/ai_prompt_editor';
import { AI_COLUMN_NAME } from './const';
import { AiColumnView } from './m_ai_column_view';

jest.mock('./ai_prompt_editor/ai_prompt_editor', (): any => {
  const original = jest.requireActual<any>('./ai_prompt_editor/ai_prompt_editor');
  const wrapInstanceWithMocks = (instance: AiPromptEditor): AiPromptEditor => {
    const proto = Object.getPrototypeOf(instance);

    Object.getOwnPropertyNames(proto).forEach((key): void => {
      const originalMethod = instance[key];
      if (typeof originalMethod === 'function' && key !== 'constructor') {
        instance[key] = jest.fn(function (...args: any[]) {
          return originalMethod.apply(this, args);
        });
      }
    });

    return instance;
  };

  return {
    ...original,
    AiPromptEditor: jest.fn((...args: any[]) => {
      const instance = new original.AiPromptEditor(...args);
      return wrapInstanceWithMocks(instance);
    }),
  };
});
jest.spyOn(AiColumnView.prototype, 'getController');

const mockColumnsController = {
  addCommandColumn: jest.fn(),
};
const mockAiColumnController = {};
const mockColumn = { type: 'ai', alignment: 'left' } as Column;

const createComponentMock = jest.fn((
  el: dxElementWrapper,
  Widget: any,
  options: any,
): any => new Widget(el, options));

const createAiColumnView = (): {
  $container: dxElementWrapper;
  $cellElement: dxElementWrapper;
  aiColumnView: AiColumnView;
  aiPromptEditorPOM: AiPromptEditorModel;
} => {
  const $container = $('<div>').appendTo(document.body);
  const $cellElement = $('<div>').appendTo(document.body);
  const mockComponent = {
    element: (): any => $container.get(0),
    _createComponent: createComponentMock,
    _controllers: {
      columns: mockColumnsController,
      aiColumn: mockAiColumnController,
    },
  };
  const aiColumnView = new AiColumnView(mockComponent);

  aiColumnView.init();
  aiColumnView.render($container);

  return {
    $container,
    $cellElement,
    aiColumnView,
    aiPromptEditorPOM: new AiPromptEditorModel(aiColumnView.element().get(0)),
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

describe('AiColumnView', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('initialization', () => {
    it('should initialize controllers and add AI command column', () => {
      const { aiColumnView } = createAiColumnView();

      expect(aiColumnView.getController).toHaveBeenCalledWith('columns');
      expect(aiColumnView.getController).toHaveBeenCalledWith('aiColumn');
      expect(mockColumnsController.addCommandColumn).toHaveBeenCalledTimes(1);
      expect(mockColumnsController.addCommandColumn).toHaveBeenCalledWith({
        type: AI_COLUMN_NAME,
        command: AI_COLUMN_NAME,
        cssClass: 'dx-command-ai',
        fixed: false,
      });
    });
  });

  describe('Methods', () => {
    describe('showPromptEditor', () => {
      it('should create new AiPromptEditor instance', async () => {
        const {
          $container,
          $cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAiColumnView();

        await aiColumnView.showPromptEditor(
          $cellElement,
          mockColumn,
        );

        expect(AiPromptEditor).toHaveBeenCalledTimes(1);
        expect(AiPromptEditor).toHaveBeenCalledWith({
          value: '',
          container: aiColumnView.element(),
          createComponent: expect.any(Function),
          popupOptions: {
            shading: false,
            position: {
              my: 'right top',
              at: 'right bottom',
              of: $cellElement.get(0),
              collision: 'fit',
              boundary: $container.get(0),
            },
          },
        });
        expect(aiColumnView.getPromptEditorInstance().show).toHaveBeenCalledTimes(1);
        expect(aiPromptEditorPOM.isVisible()).toBe(true);
      });

      it('should update existing AiPromptEditor instance', async () => {
        const {
          $cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAiColumnView();

        await aiColumnView.showPromptEditor($cellElement, mockColumn);

        const newColumn = {
          ...mockColumn,
          ai: { prompt: 'updated prompt' },
        } as Column;

        await aiColumnView.showPromptEditor(
          $cellElement,
          newColumn,
        );

        expect(AiPromptEditor).toHaveBeenCalledTimes(1); // Only one instance created
        expect(aiColumnView.getPromptEditorInstance().updateOptions).toHaveBeenCalledTimes(1);
        expect(aiPromptEditorPOM.getTextArea().value).toBe('updated prompt');
      });

      it('should configure popup position correctly for left alignment', async () => {
        const {
          $cellElement,
          aiColumnView,
        } = createAiColumnView();
        const leftAlignedColumn = {
          ...mockColumn,
          alignment: 'left',
        } as Column;

        await aiColumnView.showPromptEditor($cellElement, leftAlignedColumn);

        expect(AiPromptEditor).toHaveBeenCalledWith(
          expect.objectContaining({
            popupOptions: expect.objectContaining({
              position: expect.objectContaining({
                my: 'right top',
                at: 'right bottom',
              }),
            }),
          }),
        );
      });

      it('should configure popup position correctly for right alignment', async () => {
        const {
          $cellElement,
          aiColumnView,
        } = createAiColumnView();
        const rightAlignedColumn = {
          ...mockColumn,
          alignment: 'right',
        } as Column;

        await aiColumnView.showPromptEditor($cellElement, rightAlignedColumn);

        expect(AiPromptEditor).toHaveBeenCalledWith(
          expect.objectContaining({
            popupOptions: expect.objectContaining({
              position: expect.objectContaining({
                my: 'left top',
                at: 'left bottom',
              }),
            }),
          }),
        );
      });

      describe('when called with invalid parameters', () => {
        it('should return false if cell element is null', async () => {
          const {
            aiColumnView,
          } = createAiColumnView();

          const result = await aiColumnView.showPromptEditor(null as any, mockColumn);

          expect(AiPromptEditor).not.toHaveBeenCalled();
          expect(result).toBe(false);
        });

        it('should return false if cell element is empty', async () => {
          const {
            aiColumnView,
          } = createAiColumnView();

          const result = await aiColumnView.showPromptEditor($(), mockColumn);

          expect(AiPromptEditor).not.toHaveBeenCalled();
          expect(result).toBe(false);
        });

        it('should return false if column is null', async () => {
          const {
            $cellElement,
            aiColumnView,
          } = createAiColumnView();

          const result = await aiColumnView.showPromptEditor(
            $cellElement,
            null as any,
          );

          expect(AiPromptEditor).not.toHaveBeenCalled();
          expect(result).toBe(false);
        });

        it('should return false if column type is not ai', async () => {
          const {
            $cellElement,
            aiColumnView,
          } = createAiColumnView();

          const result = await aiColumnView.showPromptEditor(
            $cellElement,
            { ...mockColumn, type: '' },
          );

          expect(AiPromptEditor).not.toHaveBeenCalled();
          expect(result).toBe(false);
        });
      });
    });

    describe('hidePromptEditor', () => {
      it('should call hide method', async () => {
        const {
          $cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAiColumnView();
        await aiColumnView.showPromptEditor($cellElement, mockColumn);

        const result = await aiColumnView.hidePromptEditor();

        expect(aiColumnView.getPromptEditorInstance().hide).toHaveBeenCalledTimes(1);
        expect(aiPromptEditorPOM.isVisible()).toBe(false);
        expect(result).toBe(false);
      });
    });
  });
});

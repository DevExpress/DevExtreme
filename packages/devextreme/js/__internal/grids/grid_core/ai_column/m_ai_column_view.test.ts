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
import Callbacks from '@js/core/utils/callbacks';
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
        instance[key] = jest.fn(function mockMethod(...args: any[]) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return originalMethod.apply(this, args) as any;
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
  columnOption: jest.fn(),
  getColumnByPath: jest.fn(),
  getColumnOptionNameByFullName: jest.fn(),
};
const mockAiColumnController = {
  abortAIColumnRequest: jest.fn(),
  refreshAIColumn: jest.fn(),
  sendAIColumnRequest: jest.fn(),
  aiRequestCompleted: Callbacks(),
  aiRequestRejected: Callbacks(),
};
const mockColumn = { type: 'ai', alignment: 'left', name: 'aiColumn' } as Column;

const createComponentMock = jest.fn((
  el: dxElementWrapper,
  Widget: any,
  options: any,
): any => new Widget(el, options));

const createAiColumnView = (): {
  $container: dxElementWrapper;
  cellElement: HTMLElement;
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
    cellElement: $cellElement[0],
    aiColumnView,
    aiPromptEditorPOM: new AiPromptEditorModel(aiColumnView.element().get(0)),
  };
};

const beforeTest = (): void => {
  fx.off = true;
  jest.useFakeTimers();
  jest.clearAllMocks();
};

const afterTest = (): void => {
  document.body.innerHTML = '';
  fx.off = false;
  jest.useRealTimers();
  mockAiColumnController.aiRequestCompleted.empty();
  mockAiColumnController.aiRequestRejected.empty();
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
          cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAiColumnView();

        await aiColumnView.showPromptEditor(
          cellElement,
          mockColumn,
        );

        expect(AiPromptEditor).toHaveBeenCalledTimes(1);
        expect(AiPromptEditor).toHaveBeenCalledWith({
          prompt: '',
          container: aiColumnView.element(),
          createComponent: expect.any(Function),
          onStop: expect.any(Function),
          onSubmit: expect.any(Function),
          onRefresh: expect.any(Function),
          popupOptions: {
            container: document.body,
            onHiding: expect.any(Function),
            position: {
              my: 'right top',
              at: 'right bottom',
              of: '.dx-header-row td[aria-colindex="1"]',
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
          cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAiColumnView();

        await aiColumnView.showPromptEditor(cellElement, mockColumn);

        const newColumn = {
          ...mockColumn,
          ai: { prompt: 'updated prompt' },
        } as Column;

        await aiColumnView.showPromptEditor(
          cellElement,
          newColumn,
        );

        expect(AiPromptEditor).toHaveBeenCalledTimes(1); // Only one instance created
        expect(aiColumnView.getPromptEditorInstance().updateOptions).toHaveBeenCalledTimes(1);
        expect(aiPromptEditorPOM.getTextArea().value).toBe('updated prompt');
      });

      it('should configure popup position correctly for left alignment', async () => {
        const {
          cellElement,
          aiColumnView,
        } = createAiColumnView();
        const leftAlignedColumn = {
          ...mockColumn,
          alignment: 'left',
        } as Column;

        await aiColumnView.showPromptEditor(cellElement, leftAlignedColumn);

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
          cellElement,
          aiColumnView,
        } = createAiColumnView();
        const rightAlignedColumn = {
          ...mockColumn,
          alignment: 'right',
        } as Column;

        await aiColumnView.showPromptEditor(cellElement, rightAlignedColumn);

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

        it('should return false if column is null', async () => {
          const {
            cellElement,
            aiColumnView,
          } = createAiColumnView();

          const result = await aiColumnView.showPromptEditor(
            cellElement,
            null as any,
          );

          expect(AiPromptEditor).not.toHaveBeenCalled();
          expect(result).toBe(false);
        });

        it('should return false if column type is not ai', async () => {
          const {
            cellElement,
            aiColumnView,
          } = createAiColumnView();

          const result = await aiColumnView.showPromptEditor(
            cellElement,
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
          cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAiColumnView();
        await aiColumnView.showPromptEditor(cellElement, mockColumn);

        const result = await aiColumnView.hidePromptEditor();

        expect(aiColumnView.getPromptEditorInstance().hide).toHaveBeenCalledTimes(1);
        expect(aiPromptEditorPOM.isVisible()).toBe(false);
        expect(result).toBe(false);
      });
    });
  });

  describe('event handlers in AiPromptEditor config', () => {
    describe('onSubmit', () => {
      it('should update column option and prompt editor state', async () => {
        const {
          cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAiColumnView();
        const columnWithIndex = { ...mockColumn, index: 2 };

        await aiColumnView.showPromptEditor(cellElement, columnWithIndex);

        aiPromptEditorPOM.changeTextAreaValue('test prompt');
        aiPromptEditorPOM.getApplyButtonElement().click();

        expect(aiColumnView.getPromptEditorInstance().updateStateOnAction).toHaveBeenCalledWith('apply');
        expect(mockColumnsController.columnOption).toHaveBeenCalledWith(
          2,
          'ai.prompt',
          'test prompt',
          true,
        );
      });
    });

    describe('onStop', () => {
      it('should abort AI request and update prompt editor state', async () => {
        const {
          cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAiColumnView();

        mockAiColumnController.sendAIColumnRequest
          .mockImplementation(() => {
            setTimeout(() => {
              mockAiColumnController.aiRequestCompleted.fire();
            });
          });

        await aiColumnView.showPromptEditor(cellElement, mockColumn);

        const promptEditorInstance = aiColumnView.getPromptEditorInstance();

        aiPromptEditorPOM.changeTextAreaValue('test prompt');
        aiPromptEditorPOM.getApplyButtonElement().click();
        (promptEditorInstance.updateStateOnAction as jest.Mock).mockClear();

        aiPromptEditorPOM.getStopButtonElement().click();
        jest.runAllTimers();

        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith();
        expect(mockAiColumnController.abortAIColumnRequest).toHaveBeenCalledTimes(1);
      });
    });

    describe('onRefresh', () => {
      it('should refresh AI column and update prompt editor state', async () => {
        const {
          cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAiColumnView();
        const columnWithPrompt = { ...mockColumn, name: 'testColumn', ai: { prompt: 'test prompt' } };

        await aiColumnView.showPromptEditor(cellElement, columnWithPrompt);

        const promptEditorInstance = aiColumnView.getPromptEditorInstance();

        aiPromptEditorPOM.getRefreshButtonElement().click();

        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith('regenerate');
        expect(mockAiColumnController.refreshAIColumn).toHaveBeenCalledWith('testColumn');
      });

      it('should update prompt editor state on completion', async () => {
        const {
          cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAiColumnView();
        const columnWithPrompt = { ...mockColumn, name: 'testColumn', ai: { prompt: 'test prompt' } };

        mockAiColumnController.refreshAIColumn
          .mockImplementation(() => {
            setTimeout(() => {
              mockAiColumnController.aiRequestCompleted.fire();
            });
          });

        await aiColumnView.showPromptEditor(cellElement, columnWithPrompt);

        const promptEditorInstance = aiColumnView.getPromptEditorInstance();

        aiPromptEditorPOM.getRefreshButtonElement().click();
        (promptEditorInstance.updateStateOnAction as jest.Mock).mockClear();

        jest.runAllTimers();

        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledTimes(1);
        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith();
      });

      it('should update prompt editor state on error', async () => {
        const {
          cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAiColumnView();
        const columnWithPrompt = { ...mockColumn, name: 'testColumn', ai: { prompt: 'test prompt' } };

        mockAiColumnController.refreshAIColumn
          .mockImplementation(() => {
            setTimeout(() => {
              mockAiColumnController.aiRequestRejected.fire();
            });
          });

        await aiColumnView.showPromptEditor(cellElement, columnWithPrompt);

        const promptEditorInstance = aiColumnView.getPromptEditorInstance();

        aiPromptEditorPOM.getRefreshButtonElement().click();
        (promptEditorInstance.updateStateOnAction as jest.Mock).mockClear();

        jest.runAllTimers();

        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledTimes(1);
        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith();
      });
    });

    describe('onHiding', () => {
      it('should update prompt editor state and abort AI request', async () => {
        const {
          cellElement,
          aiColumnView,
        } = createAiColumnView();

        await aiColumnView.showPromptEditor(cellElement, mockColumn);

        const promptEditorInstance = aiColumnView.getPromptEditorInstance();

        await aiColumnView.hidePromptEditor();

        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith();
        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledTimes(1);
        expect(mockAiColumnController.abortAIColumnRequest).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('optionChanged', () => {
    it('should return early if name is not columns', () => {
      const { aiColumnView } = createAiColumnView();

      aiColumnView.optionChanged({ name: 'dataSource' });

      expect(mockColumnsController.getColumnByPath).not.toHaveBeenCalled();
    });

    it('should return early if column type is not ai', () => {
      const { aiColumnView } = createAiColumnView();
      const column = { type: 'data' };
      mockColumnsController.getColumnByPath.mockReturnValue(column);

      aiColumnView.optionChanged({
        name: 'columns',
        fullName: 'columns[0].caption',
      });

      expect(mockColumnsController.getColumnOptionNameByFullName).not.toHaveBeenCalled();
    });

    it('should handle ai.prompt option change', async () => {
      const {
        cellElement,
        aiColumnView,
      } = createAiColumnView();

      mockColumnsController.getColumnByPath.mockReturnValue(mockColumn);
      mockColumnsController.getColumnOptionNameByFullName.mockReturnValue('ai.prompt');

      await aiColumnView.showPromptEditor(cellElement, mockColumn);

      const promptEditorInstance = aiColumnView.getPromptEditorInstance();

      aiColumnView.optionChanged({
        name: 'columns',
        fullName: 'columns[0].ai.prompt',
        value: 'new prompt value',
      });

      expect(promptEditorInstance.updatePrompt).toHaveBeenCalledWith('new prompt value');
      expect(mockAiColumnController.sendAIColumnRequest).toHaveBeenCalledWith('aiColumn');
    });

    it('should update prompt editor state on completion', async () => {
      const {
        cellElement,
        aiColumnView,
      } = createAiColumnView();

      mockColumnsController.getColumnByPath.mockReturnValue(mockColumn);
      mockColumnsController.getColumnOptionNameByFullName.mockReturnValue('ai.prompt');
      mockAiColumnController.sendAIColumnRequest
        .mockImplementation(() => {
          mockAiColumnController.aiRequestCompleted.fire();
        });

      await aiColumnView.showPromptEditor(cellElement, mockColumn);

      aiColumnView.optionChanged({
        name: 'columns',
        fullName: 'columns[0].ai.prompt',
        value: 'new prompt value',
      });

      const promptEditorInstance = aiColumnView.getPromptEditorInstance();

      expect(promptEditorInstance.updatePrompt).toHaveBeenCalledWith('new prompt value');
      expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledTimes(1);
    });

    it('should update prompt editor state on error', async () => {
      const {
        cellElement,
        aiColumnView,
      } = createAiColumnView();

      mockColumnsController.getColumnByPath.mockReturnValue(mockColumn);
      mockColumnsController.getColumnOptionNameByFullName.mockReturnValue('ai.prompt');
      mockAiColumnController.sendAIColumnRequest
        .mockImplementation(() => {
          mockAiColumnController.aiRequestRejected.fire();
        });

      await aiColumnView.showPromptEditor(cellElement, mockColumn);

      aiColumnView.optionChanged({
        name: 'columns',
        fullName: 'columns[0].ai.prompt',
        value: 'new prompt value',
      });

      const promptEditorInstance = aiColumnView.getPromptEditorInstance();

      expect(promptEditorInstance.updatePrompt).toHaveBeenCalledWith('new prompt value');
      expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledTimes(1);
      expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith();
    });

    describe('when prompt editor is not initialized', () => {
      it('should handle optionChanged', () => {
        const { aiColumnView } = createAiColumnView();

        mockColumnsController.getColumnByPath.mockReturnValue(mockColumn);
        mockColumnsController.getColumnOptionNameByFullName.mockReturnValue('ai.prompt');

        expect(() => {
          aiColumnView.optionChanged({
            name: 'columns',
            fullName: 'columns[0].ai.prompt',
            value: 'new prompt value',
          });
        }).not.toThrow();

        expect(mockAiColumnController.sendAIColumnRequest).toHaveBeenCalledWith('aiColumn');
      });
    });
  });
});

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
import wrapInstanceWithMocks from '@ts/grids/grid_core/__tests__/__mock__/helpers/wrapInstance';
import { AIPromptEditorModel } from '@ts/grids/grid_core/__tests__/__mock__/model/ai_prompt_editor';

import type { Column } from '../columns_controller/m_columns_controller';
import { AIPromptEditor } from './ai_prompt_editor/ai_prompt_editor';
import { AIPromptEditorView } from './m_ai_prompt_editor_view';

jest.mock('./ai_prompt_editor/ai_prompt_editor', (): any => {
  const original = jest.requireActual<any>('./ai_prompt_editor/ai_prompt_editor');

  return {
    ...original,
    AIPromptEditor: jest.fn((...args: any[]) => {
      const instance: AIPromptEditor = new original.AIPromptEditor(...args);
      return wrapInstanceWithMocks(instance);
    }),
  };
});
jest.spyOn(AIPromptEditorView.prototype, 'getController');

const mockColumnsController = {
  addCommandColumn: jest.fn(),
  columnOption: jest.fn(),
  getColumnByPath: jest.fn(),
  getColumnOptionNameByFullName: jest.fn(),
  getVisibleIndex: jest.fn().mockReturnValue(0),
};
const mockAIColumnController = {
  abortAIColumnRequest: jest.fn(),
  refreshAIColumn: jest.fn(),
  sendAIColumnRequest: jest.fn(),
  getAIColumns: jest.fn().mockReturnValue([]),
  aiRequestCompleted: Callbacks(),
  aiRequestRejected: Callbacks(),
  promptEditorRequested: Callbacks(),
};
const mockColumn = {
  type: 'ai',
  alignment: 'left',
  name: 'aiColumn',
  index: 0,
} as Column;

const createComponentMock = jest.fn((
  el: dxElementWrapper,
  Widget: any,
  options: any,
): any => new Widget(el, options));

const createAIPromptEditorView = (): {
  $container: dxElementWrapper;
  cellElement: HTMLElement;
  aiPromptEditorView: AIPromptEditorView;
  aiPromptEditorPOM: AIPromptEditorModel;
} => {
  const $container = $('<div>').appendTo(document.body);
  const $cellElement = $('<div>').appendTo(document.body);
  const mockComponent = {
    element: (): any => $container.get(0),
    _createComponent: createComponentMock,
    _controllers: {
      columns: mockColumnsController,
      aiColumn: mockAIColumnController,
    },
  };
  const aiPromptEditorView = new AIPromptEditorView(mockComponent);

  aiPromptEditorView.init();
  aiPromptEditorView.render($container);

  return {
    $container,
    cellElement: $cellElement[0],
    aiPromptEditorView,
    aiPromptEditorPOM: new AIPromptEditorModel(aiPromptEditorView.element().get(0)),
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
  mockAIColumnController.aiRequestCompleted.empty();
  mockAIColumnController.aiRequestRejected.empty();
};

describe('AIPromptEditorView', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('initialization', () => {
    it('should initialize controllers', () => {
      const { aiPromptEditorView } = createAIPromptEditorView();

      expect(aiPromptEditorView.getController).toHaveBeenCalledWith('columns');
      expect(aiPromptEditorView.getController).toHaveBeenCalledWith('aiColumn');
    });
  });

  describe('Methods', () => {
    describe('showPromptEditor', () => {
      it('should create new AIPromptEditor instance', async () => {
        const {
          $container,
          cellElement,
          aiPromptEditorView,
          aiPromptEditorPOM,
        } = createAIPromptEditorView();

        await aiPromptEditorView.showPromptEditor(
          cellElement,
          mockColumn,
        );

        expect(AIPromptEditor).toHaveBeenCalledTimes(1);
        expect(AIPromptEditor).toHaveBeenCalledWith({
          prompt: '',
          container: aiPromptEditorView.element(),
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
          editorOptions: { },
        });
        expect(aiPromptEditorView.getPromptEditorInstance().show).toHaveBeenCalledTimes(1);
        expect(aiPromptEditorPOM.isVisible()).toBe(true);
      });

      it('should update existing AIPromptEditor instance', async () => {
        const {
          cellElement,
          aiPromptEditorView,
          aiPromptEditorPOM,
        } = createAIPromptEditorView();

        await aiPromptEditorView.showPromptEditor(cellElement, mockColumn);

        expect(AIPromptEditor).toHaveBeenCalledTimes(1);
        expect(AIPromptEditor).toHaveBeenCalledWith(
          expect.objectContaining({
            popupOptions: expect.objectContaining({
              position: expect.objectContaining({
                of: '.dx-header-row td[aria-colindex="1"]',
              }),
            }),
          }),
        );
        expect(aiPromptEditorView.getPromptEditorInstance().updateOptions).toHaveBeenCalledTimes(0);

        const newColumn = {
          ...mockColumn,
          ai: { prompt: 'updated prompt' },
        } as Column;
        mockColumnsController.getVisibleIndex.mockReturnValue(1);

        await aiPromptEditorView.showPromptEditor(
          cellElement,
          newColumn,
        );

        expect(AIPromptEditor).toHaveBeenCalledTimes(1); // Only one instance created
        expect(aiPromptEditorView.getPromptEditorInstance().updateOptions).toHaveBeenCalledTimes(1);
        expect(aiPromptEditorView.getPromptEditorInstance().updateOptions).toHaveBeenCalledWith(
          expect.objectContaining({
            popupOptions: expect.objectContaining({
              position: expect.objectContaining({
                of: '.dx-header-row td[aria-colindex="2"]',
              }),
            }),
          }),
        );
        expect(aiPromptEditorPOM.getTextArea().getInputElement().value).toBe('updated prompt');
      });

      it('should configure popup position correctly for left alignment', async () => {
        const {
          cellElement,
          aiPromptEditorView,
        } = createAIPromptEditorView();
        const leftAlignedColumn = {
          ...mockColumn,
          alignment: 'left',
        } as Column;

        await aiPromptEditorView.showPromptEditor(cellElement, leftAlignedColumn);

        expect(AIPromptEditor).toHaveBeenCalledWith(
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
          aiPromptEditorView,
        } = createAIPromptEditorView();
        const rightAlignedColumn = {
          ...mockColumn,
          alignment: 'right',
        } as Column;

        await aiPromptEditorView.showPromptEditor(cellElement, rightAlignedColumn);

        expect(AIPromptEditor).toHaveBeenCalledWith(
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
            aiPromptEditorView,
          } = createAIPromptEditorView();

          const result = await aiPromptEditorView.showPromptEditor(null as any, mockColumn);

          expect(AIPromptEditor).not.toHaveBeenCalled();
          expect(result).toBe(false);
        });

        it('should return false if column is null', async () => {
          const {
            cellElement,
            aiPromptEditorView,
          } = createAIPromptEditorView();

          const result = await aiPromptEditorView.showPromptEditor(
            cellElement,
            null as any,
          );

          expect(AIPromptEditor).not.toHaveBeenCalled();
          expect(result).toBe(false);
        });

        it('should return false if column type is not ai', async () => {
          const {
            cellElement,
            aiPromptEditorView,
          } = createAIPromptEditorView();

          const result = await aiPromptEditorView.showPromptEditor(
            cellElement,
            { ...mockColumn, type: '' },
          );

          expect(AIPromptEditor).not.toHaveBeenCalled();
          expect(result).toBe(false);
        });
      });
    });

    describe('hidePromptEditor', () => {
      it('should call hide method', async () => {
        const {
          cellElement,
          aiPromptEditorView,
          aiPromptEditorPOM,
        } = createAIPromptEditorView();
        await aiPromptEditorView.showPromptEditor(cellElement, mockColumn);

        const result = await aiPromptEditorView.hidePromptEditor();

        expect(aiPromptEditorView.getPromptEditorInstance().hide).toHaveBeenCalledTimes(1);
        expect(aiPromptEditorPOM.isVisible()).toBe(false);
        expect(result).toBe(false);
      });
    });
  });

  describe('event handlers in AIPromptEditor config', () => {
    describe('onSubmit', () => {
      it('should update column option and prompt editor state', async () => {
        const {
          cellElement,
          aiPromptEditorView,
          aiPromptEditorPOM,
        } = createAIPromptEditorView();
        const columnWithIndex = { ...mockColumn, index: 2 };

        await aiPromptEditorView.showPromptEditor(cellElement, columnWithIndex);

        aiPromptEditorPOM.getTextArea().setValue('test prompt');
        aiPromptEditorPOM.getApplyButton().getElement().click();

        expect(aiPromptEditorView.getPromptEditorInstance().updateStateOnAction).toHaveBeenCalledWith('apply');
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
          aiPromptEditorView,
          aiPromptEditorPOM,
        } = createAIPromptEditorView();

        mockAIColumnController.sendAIColumnRequest
          .mockImplementation(() => {
            setTimeout(() => {
              mockAIColumnController.aiRequestCompleted.fire();
            });
          });

        await aiPromptEditorView.showPromptEditor(cellElement, mockColumn);

        const promptEditorInstance = aiPromptEditorView.getPromptEditorInstance();

        aiPromptEditorPOM.getTextArea().setValue('test prompt');
        aiPromptEditorPOM.getApplyButton().getElement().click();
        (promptEditorInstance.updateStateOnAction as jest.Mock).mockClear();

        aiPromptEditorPOM.getStopButton().getElement().click();
        jest.runAllTimers();

        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith('stop');
        expect(mockAIColumnController.abortAIColumnRequest).toHaveBeenCalledTimes(1);
      });
    });

    describe('onRefresh', () => {
      it('should refresh AI column and update prompt editor state', async () => {
        const {
          cellElement,
          aiPromptEditorView,
          aiPromptEditorPOM,
        } = createAIPromptEditorView();
        const columnWithPrompt = { ...mockColumn, name: 'testColumn', ai: { prompt: 'test prompt' } };

        await aiPromptEditorView.showPromptEditor(cellElement, columnWithPrompt);

        const promptEditorInstance = aiPromptEditorView.getPromptEditorInstance();

        aiPromptEditorPOM.getRefreshButton().getElement().click();

        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith('regenerate');
        expect(mockAIColumnController.refreshAIColumn).toHaveBeenCalledWith('testColumn');
      });

      it('should update prompt editor state on completion', async () => {
        const {
          cellElement,
          aiPromptEditorView,
          aiPromptEditorPOM,
        } = createAIPromptEditorView();
        const columnWithPrompt = { ...mockColumn, name: 'testColumn', ai: { prompt: 'test prompt' } };

        mockAIColumnController.refreshAIColumn
          .mockImplementation(() => {
            setTimeout(() => {
              mockAIColumnController.aiRequestCompleted.fire();
            });
          });

        await aiPromptEditorView.showPromptEditor(cellElement, columnWithPrompt);

        const promptEditorInstance = aiPromptEditorView.getPromptEditorInstance();

        aiPromptEditorPOM.getRefreshButton().getElement().click();
        (promptEditorInstance.updateStateOnAction as jest.Mock).mockClear();

        jest.runAllTimers();

        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledTimes(1);
        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith('stop');
      });

      it('should update prompt editor state on error', async () => {
        const {
          cellElement,
          aiPromptEditorView,
          aiPromptEditorPOM,
        } = createAIPromptEditorView();
        const columnWithPrompt = { ...mockColumn, name: 'testColumn', ai: { prompt: 'test prompt' } };

        mockAIColumnController.refreshAIColumn
          .mockImplementation(() => {
            setTimeout(() => {
              mockAIColumnController.aiRequestRejected.fire();
            });
          });

        await aiPromptEditorView.showPromptEditor(cellElement, columnWithPrompt);

        const promptEditorInstance = aiPromptEditorView.getPromptEditorInstance();

        aiPromptEditorPOM.getRefreshButton().getElement().click();
        (promptEditorInstance.updateStateOnAction as jest.Mock).mockClear();

        jest.runAllTimers();

        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledTimes(1);
        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith('stop');
      });
    });

    describe('onHiding', () => {
      it('should update prompt editor state and abort AI request', async () => {
        const {
          cellElement,
          aiPromptEditorView,
        } = createAIPromptEditorView();

        await aiPromptEditorView.showPromptEditor(cellElement, mockColumn);

        const promptEditorInstance = aiPromptEditorView.getPromptEditorInstance();

        await aiPromptEditorView.hidePromptEditor();

        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith('stop');
        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledTimes(1);
        expect(mockAIColumnController.abortAIColumnRequest).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('optionChanged', () => {
    it('should return early if name is not columns', () => {
      const { aiPromptEditorView } = createAIPromptEditorView();

      aiPromptEditorView.optionChanged({ name: 'dataSource' });

      expect(mockColumnsController.getColumnByPath).not.toHaveBeenCalled();
    });

    it('should return early if column type is not ai', () => {
      const { aiPromptEditorView } = createAIPromptEditorView();
      const column = { type: 'data' };
      mockColumnsController.getColumnByPath.mockReturnValue(column);

      aiPromptEditorView.optionChanged({
        name: 'columns',
        fullName: 'columns[0].caption',
      });

      expect(mockColumnsController.getColumnOptionNameByFullName).not.toHaveBeenCalled();
    });

    it('should handle ai.prompt option change', async () => {
      const {
        cellElement,
        aiPromptEditorView,
      } = createAIPromptEditorView();

      mockColumnsController.getColumnByPath.mockReturnValue(mockColumn);
      mockColumnsController.getColumnOptionNameByFullName.mockReturnValue('ai.prompt');
      mockAIColumnController.sendAIColumnRequest
        .mockImplementation(() => {
          setTimeout(() => {
            mockAIColumnController.aiRequestCompleted.fire();
          });
        });

      await aiPromptEditorView.showPromptEditor(cellElement, mockColumn);

      const promptEditorInstance = aiPromptEditorView.getPromptEditorInstance();

      (promptEditorInstance.getEditorValue as jest.Mock).mockReturnValue('new prompt value');

      aiPromptEditorView.optionChanged({
        name: 'columns',
        fullName: 'columns[0].ai.prompt',
        value: 'new prompt value',
      });

      expect(promptEditorInstance.updatePrompt).toHaveBeenCalledWith('new prompt value');
      expect(mockAIColumnController.sendAIColumnRequest).toHaveBeenCalledWith('aiColumn');
    });

    it('should update prompt editor state on completion', async () => {
      const {
        cellElement,
        aiPromptEditorView,
      } = createAIPromptEditorView();

      mockColumnsController.getColumnByPath.mockReturnValue(mockColumn);
      mockColumnsController.getColumnOptionNameByFullName.mockReturnValue('ai.prompt');
      mockAIColumnController.sendAIColumnRequest
        .mockImplementation(() => {
          mockAIColumnController.aiRequestCompleted.fire();
        });

      await aiPromptEditorView.showPromptEditor(cellElement, mockColumn);

      const promptEditorInstance = aiPromptEditorView.getPromptEditorInstance();

      (promptEditorInstance.getEditorValue as jest.Mock).mockReturnValue('new prompt value');

      aiPromptEditorView.optionChanged({
        name: 'columns',
        fullName: 'columns[0].ai.prompt',
        value: 'new prompt value',
      });

      expect(promptEditorInstance.updatePrompt).toHaveBeenCalledWith('new prompt value');
      expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledTimes(1);
    });

    it('should update prompt editor state on error', async () => {
      const {
        cellElement,
        aiPromptEditorView,
      } = createAIPromptEditorView();

      mockColumnsController.getColumnByPath.mockReturnValue(mockColumn);
      mockColumnsController.getColumnOptionNameByFullName.mockReturnValue('ai.prompt');
      mockAIColumnController.sendAIColumnRequest
        .mockImplementation(() => {
          mockAIColumnController.aiRequestRejected.fire();
        });

      await aiPromptEditorView.showPromptEditor(cellElement, mockColumn);

      aiPromptEditorView.optionChanged({
        name: 'columns',
        fullName: 'columns[0].ai.prompt',
        value: 'new prompt value',
      });

      const promptEditorInstance = aiPromptEditorView.getPromptEditorInstance();

      expect(promptEditorInstance.updatePrompt).toHaveBeenCalledWith('new prompt value');
      expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledTimes(1);
      expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith('stop');
    });

    describe('when prompt editor is not initialized', () => {
      it('should handle optionChanged', () => {
        const { aiPromptEditorView } = createAIPromptEditorView();

        mockColumnsController.getColumnByPath.mockReturnValue(mockColumn);
        mockColumnsController.getColumnOptionNameByFullName.mockReturnValue('ai.prompt');

        expect(() => {
          aiPromptEditorView.optionChanged({
            name: 'columns',
            fullName: 'columns[0].ai.prompt',
            value: 'new prompt value',
          });
        }).not.toThrow();

        expect(mockAIColumnController.sendAIColumnRequest).toHaveBeenCalledWith('aiColumn');
      });
    });
  });
});

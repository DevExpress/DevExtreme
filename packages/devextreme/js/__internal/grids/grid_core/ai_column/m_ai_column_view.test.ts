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
import { AI_COLUMN_NAME } from './const';
import { AIColumnView } from './m_ai_column_view';

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
jest.spyOn(AIColumnView.prototype, 'getController');

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

const createAIColumnView = (): {
  $container: dxElementWrapper;
  cellElement: HTMLElement;
  aiColumnView: AIColumnView;
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
  const aiColumnView = new AIColumnView(mockComponent);

  aiColumnView.init();
  aiColumnView.render($container);

  return {
    $container,
    cellElement: $cellElement[0],
    aiColumnView,
    aiPromptEditorPOM: new AIPromptEditorModel(aiColumnView.element().get(0)),
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

describe('AIColumnView', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('initialization', () => {
    it('should initialize controllers and add AI command column', () => {
      const { aiColumnView } = createAIColumnView();

      expect(aiColumnView.getController).toHaveBeenCalledWith('columns');
      expect(aiColumnView.getController).toHaveBeenCalledWith('aiColumn');
      expect(mockColumnsController.addCommandColumn).toHaveBeenCalledTimes(1);
      expect(mockColumnsController.addCommandColumn).toHaveBeenCalledWith({
        type: AI_COLUMN_NAME,
        command: AI_COLUMN_NAME,
        cssClass: 'dx-command-ai',
        fixed: false,
        minWidth: 120,
      });
    });
  });

  describe('Methods', () => {
    describe('showPromptEditor', () => {
      it('should create new AIPromptEditor instance', async () => {
        const {
          $container,
          cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAIColumnView();

        await aiColumnView.showPromptEditor(
          cellElement,
          mockColumn,
        );

        expect(AIPromptEditor).toHaveBeenCalledTimes(1);
        expect(AIPromptEditor).toHaveBeenCalledWith({
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
          editorOptions: { },
        });
        expect(aiColumnView.getPromptEditorInstance().show).toHaveBeenCalledTimes(1);
        expect(aiPromptEditorPOM.isVisible()).toBe(true);
      });

      it('should update existing AIPromptEditor instance', async () => {
        const {
          cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAIColumnView();

        await aiColumnView.showPromptEditor(cellElement, mockColumn);

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
        expect(aiColumnView.getPromptEditorInstance().updateOptions).toHaveBeenCalledTimes(0);

        const newColumn = {
          ...mockColumn,
          ai: { prompt: 'updated prompt' },
        } as Column;
        mockColumnsController.getVisibleIndex.mockReturnValue(1);

        await aiColumnView.showPromptEditor(
          cellElement,
          newColumn,
        );

        expect(AIPromptEditor).toHaveBeenCalledTimes(1); // Only one instance created
        expect(aiColumnView.getPromptEditorInstance().updateOptions).toHaveBeenCalledTimes(1);
        expect(aiColumnView.getPromptEditorInstance().updateOptions).toHaveBeenCalledWith(
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
          aiColumnView,
        } = createAIColumnView();
        const leftAlignedColumn = {
          ...mockColumn,
          alignment: 'left',
        } as Column;

        await aiColumnView.showPromptEditor(cellElement, leftAlignedColumn);

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
          aiColumnView,
        } = createAIColumnView();
        const rightAlignedColumn = {
          ...mockColumn,
          alignment: 'right',
        } as Column;

        await aiColumnView.showPromptEditor(cellElement, rightAlignedColumn);

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
            aiColumnView,
          } = createAIColumnView();

          const result = await aiColumnView.showPromptEditor(null as any, mockColumn);

          expect(AIPromptEditor).not.toHaveBeenCalled();
          expect(result).toBe(false);
        });

        it('should return false if column is null', async () => {
          const {
            cellElement,
            aiColumnView,
          } = createAIColumnView();

          const result = await aiColumnView.showPromptEditor(
            cellElement,
            null as any,
          );

          expect(AIPromptEditor).not.toHaveBeenCalled();
          expect(result).toBe(false);
        });

        it('should return false if column type is not ai', async () => {
          const {
            cellElement,
            aiColumnView,
          } = createAIColumnView();

          const result = await aiColumnView.showPromptEditor(
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
          aiColumnView,
          aiPromptEditorPOM,
        } = createAIColumnView();
        await aiColumnView.showPromptEditor(cellElement, mockColumn);

        const result = await aiColumnView.hidePromptEditor();

        expect(aiColumnView.getPromptEditorInstance().hide).toHaveBeenCalledTimes(1);
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
          aiColumnView,
          aiPromptEditorPOM,
        } = createAIColumnView();
        const columnWithIndex = { ...mockColumn, index: 2 };

        await aiColumnView.showPromptEditor(cellElement, columnWithIndex);

        aiPromptEditorPOM.getTextArea().setValue('test prompt');
        aiPromptEditorPOM.getApplyButton().getElement().click();

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
        } = createAIColumnView();

        mockAIColumnController.sendAIColumnRequest
          .mockImplementation(() => {
            setTimeout(() => {
              mockAIColumnController.aiRequestCompleted.fire();
            });
          });

        await aiColumnView.showPromptEditor(cellElement, mockColumn);

        const promptEditorInstance = aiColumnView.getPromptEditorInstance();

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
          aiColumnView,
          aiPromptEditorPOM,
        } = createAIColumnView();
        const columnWithPrompt = { ...mockColumn, name: 'testColumn', ai: { prompt: 'test prompt' } };

        await aiColumnView.showPromptEditor(cellElement, columnWithPrompt);

        const promptEditorInstance = aiColumnView.getPromptEditorInstance();

        aiPromptEditorPOM.getRefreshButton().getElement().click();

        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith('regenerate');
        expect(mockAIColumnController.refreshAIColumn).toHaveBeenCalledWith('testColumn');
      });

      it('should update prompt editor state on completion', async () => {
        const {
          cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAIColumnView();
        const columnWithPrompt = { ...mockColumn, name: 'testColumn', ai: { prompt: 'test prompt' } };

        mockAIColumnController.refreshAIColumn
          .mockImplementation(() => {
            setTimeout(() => {
              mockAIColumnController.aiRequestCompleted.fire();
            });
          });

        await aiColumnView.showPromptEditor(cellElement, columnWithPrompt);

        const promptEditorInstance = aiColumnView.getPromptEditorInstance();

        aiPromptEditorPOM.getRefreshButton().getElement().click();
        (promptEditorInstance.updateStateOnAction as jest.Mock).mockClear();

        jest.runAllTimers();

        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledTimes(1);
        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith('stop');
      });

      it('should update prompt editor state on error', async () => {
        const {
          cellElement,
          aiColumnView,
          aiPromptEditorPOM,
        } = createAIColumnView();
        const columnWithPrompt = { ...mockColumn, name: 'testColumn', ai: { prompt: 'test prompt' } };

        mockAIColumnController.refreshAIColumn
          .mockImplementation(() => {
            setTimeout(() => {
              mockAIColumnController.aiRequestRejected.fire();
            });
          });

        await aiColumnView.showPromptEditor(cellElement, columnWithPrompt);

        const promptEditorInstance = aiColumnView.getPromptEditorInstance();

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
          aiColumnView,
        } = createAIColumnView();

        await aiColumnView.showPromptEditor(cellElement, mockColumn);

        const promptEditorInstance = aiColumnView.getPromptEditorInstance();

        await aiColumnView.hidePromptEditor();

        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith('stop');
        expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledTimes(1);
        expect(mockAIColumnController.abortAIColumnRequest).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('optionChanged', () => {
    it('should return early if name is not columns', () => {
      const { aiColumnView } = createAIColumnView();

      aiColumnView.optionChanged({ name: 'dataSource' });

      expect(mockColumnsController.getColumnByPath).not.toHaveBeenCalled();
    });

    it('should return early if column type is not ai', () => {
      const { aiColumnView } = createAIColumnView();
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
      } = createAIColumnView();

      mockColumnsController.getColumnByPath.mockReturnValue(mockColumn);
      mockColumnsController.getColumnOptionNameByFullName.mockReturnValue('ai.prompt');
      mockAIColumnController.sendAIColumnRequest
        .mockImplementation(() => {
          setTimeout(() => {
            mockAIColumnController.aiRequestCompleted.fire();
          });
        });

      await aiColumnView.showPromptEditor(cellElement, mockColumn);

      const promptEditorInstance = aiColumnView.getPromptEditorInstance();

      (promptEditorInstance.getEditorValue as jest.Mock).mockReturnValue('new prompt value');

      aiColumnView.optionChanged({
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
        aiColumnView,
      } = createAIColumnView();

      mockColumnsController.getColumnByPath.mockReturnValue(mockColumn);
      mockColumnsController.getColumnOptionNameByFullName.mockReturnValue('ai.prompt');
      mockAIColumnController.sendAIColumnRequest
        .mockImplementation(() => {
          mockAIColumnController.aiRequestCompleted.fire();
        });

      await aiColumnView.showPromptEditor(cellElement, mockColumn);

      const promptEditorInstance = aiColumnView.getPromptEditorInstance();

      (promptEditorInstance.getEditorValue as jest.Mock).mockReturnValue('new prompt value');

      aiColumnView.optionChanged({
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
        aiColumnView,
      } = createAIColumnView();

      mockColumnsController.getColumnByPath.mockReturnValue(mockColumn);
      mockColumnsController.getColumnOptionNameByFullName.mockReturnValue('ai.prompt');
      mockAIColumnController.sendAIColumnRequest
        .mockImplementation(() => {
          mockAIColumnController.aiRequestRejected.fire();
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
      expect(promptEditorInstance.updateStateOnAction).toHaveBeenCalledWith('stop');
    });

    describe('when prompt editor is not initialized', () => {
      it('should handle optionChanged', () => {
        const { aiColumnView } = createAIColumnView();

        mockColumnsController.getColumnByPath.mockReturnValue(mockColumn);
        mockColumnsController.getColumnOptionNameByFullName.mockReturnValue('ai.prompt');

        expect(() => {
          aiColumnView.optionChanged({
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

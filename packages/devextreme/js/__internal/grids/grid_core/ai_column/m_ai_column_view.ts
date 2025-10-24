import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import domAdapter from '@ts/core/m_dom_adapter';

import type { Column, ColumnsController } from '../columns_controller/m_columns_controller';
import { View } from '../m_modules';
import { AiPromptEditor } from './ai_prompt_editor/ai_prompt_editor';
import type { AiPromptEditorOptions } from './ai_prompt_editor/types';
import { AI_COLUMN_NAME } from './const';
import type { AiColumnController } from './m_ai_column_controller';
import { getAiCommandColumnOptions, isAIColumnAutoMode } from './utils';

export class AiColumnView extends View {
  private columnsController!: ColumnsController;

  private aiColumnController!: AiColumnController;

  private promptEditorInstance!: AiPromptEditor;

  private addAiCommandColumn(): void {
    this.columnsController.addCommandColumn(getAiCommandColumnOptions());
  }

  private getAiPromptEditorConfig(
    $cellElement: dxElementWrapper,
    column: Column,
  ): AiPromptEditorOptions {
    const alignment = column.alignment === 'right' ? 'left' : 'right';
    const visibleIndex = this.columnsController.getVisibleIndex(column.index);

    return {
      prompt: column.ai?.prompt ?? '',
      container: this.element(),
      createComponent: this._createComponent.bind(this),
      onSubmit: (): void => {
        this.promptEditorInstance.updateStateOnAction('apply');
        this.columnsController.columnOption(
          column.index,
          'ai.prompt',
          this.promptEditorInstance.getEditorValue(),
          true,
        );
      },
      onStop: (): void => {
        this.promptEditorInstance.updateStateOnAction('stop');
        this.aiColumnController.abortAIColumnRequest(column.name as string);
      },
      onRefresh: (): void => {
        this.promptEditorInstance.updateStateOnAction('regenerate');
        this.aiColumnController.refreshAIColumn(column.name as string);
      },
      popupOptions: {
        container: domAdapter.getBody(),
        onHiding: (): void => {
          this.promptEditorInstance.updateStateOnAction('stop');
          this.aiColumnController.abortAIColumnRequest(column.name as string);
        },
        position: {
          my: `${alignment} top`,
          at: `${alignment} bottom`,
          of: `.dx-header-row td[aria-colindex="${visibleIndex + 1}"]`,
          collision: 'fit',
          boundary: this.component.element(),
        },
      },
    };
  }

  // TODO: support changing all columns and the entire column
  public optionChanged(args): void {
    super.optionChanged(args);

    if (args.name !== 'columns') {
      return;
    }

    const column = this.columnsController.getColumnByPath(args.fullName);

    if (column?.type !== AI_COLUMN_NAME) {
      return;
    }

    const columnOptionName = this.columnsController.getColumnOptionNameByFullName(args.fullName);

    if (columnOptionName === 'ai.prompt' && isAIColumnAutoMode(column)) {
      this.aiColumnController.sendAIColumnRequest(column.name as string);
    }
  }

  public init(): void {
    this.columnsController = this.getController('columns');
    this.aiColumnController = this.getController('aiColumn');

    this.addAiCommandColumn();
    this.aiColumnController.aiRequestCompleted.add(() => {
      this.promptEditorInstance?.updatePrompt(this.promptEditorInstance.getEditorValue());
      this.promptEditorInstance?.updateStateOnAction('stop');
    });
    this.aiColumnController.aiRequestRejected.add(() => {
      this.promptEditorInstance?.updateStateOnAction('stop');
    });
  }

  public showPromptEditor(cellElement: HTMLElement, column: Column): Promise<boolean> {
    const $cellElement = $(cellElement);

    if (!$cellElement?.length || column?.type !== AI_COLUMN_NAME) {
      return Promise.resolve(false);
    }

    const config = this.getAiPromptEditorConfig($cellElement, column);

    if (!this.promptEditorInstance) {
      this.promptEditorInstance = new AiPromptEditor(config);
    } else {
      this.promptEditorInstance.updateOptions(config);
    }

    return this.promptEditorInstance.show();
  }

  public hidePromptEditor(): Promise<boolean> {
    return this.promptEditorInstance?.hide();
  }

  public getPromptEditorInstance(): AiPromptEditor {
    return this.promptEditorInstance;
  }
}

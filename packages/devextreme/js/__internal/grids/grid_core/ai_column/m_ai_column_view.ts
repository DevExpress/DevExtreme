import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import domAdapter from '@ts/core/m_dom_adapter';

import type { Column, ColumnsController } from '../columns_controller/m_columns_controller';
import { View } from '../m_modules';
import { AiPromptEditor } from './ai_prompt_editor/ai_prompt_editor';
import type { AiPromptEditorOptions } from './ai_prompt_editor/types';
import { AI_COLUMN_NAME } from './const';
import type { AiColumnController } from './m_ai_column_controller';
import { getAiCommandColumnOptions } from './m_ai_column_controller_utils';

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
        this.promptEditorInstance.updateStateOnAction();
        this.aiColumnController.abortAIColumnRequest();
      },
      onRefresh: (): void => {
        this.promptEditorInstance.updateStateOnAction('regenerate');
        this.aiColumnController.refreshAIColumn(column.name as string);
      },
      popupOptions: {
        container: domAdapter.getBody(),
        onHiding: (): void => {
          this.promptEditorInstance.updateStateOnAction();
          this.aiColumnController.abortAIColumnRequest();
        },
        position: {
          my: `${alignment} top`,
          at: `${alignment} bottom`,
          of: `.dx-header-row td[aria-colindex="${(column.index ?? 0) + 1}"]`,
          collision: 'fit',
          boundary: this.component.element(),
        },
      },
    };
  }

  // TODO: support changing all columns and the entire column
  public optionChanged(args): void {
    if (args.name !== 'columns') {
      return;
    }

    const column = this.columnsController.getColumnByPath(args.fullName);

    if (column?.type !== AI_COLUMN_NAME) {
      return;
    }

    const columnOptionName = this.columnsController.getColumnOptionNameByFullName(args.fullName);

    if (columnOptionName === 'ai.prompt') {
      this.promptEditorInstance?.updatePrompt(args.value);
      this.aiColumnController.sendAIColumnRequest(column.name as string);
    }
  }

  public init(): void {
    this.columnsController = this.getController('columns');
    this.aiColumnController = this.getController('aiColumn');

    this.addAiCommandColumn();
    this.aiColumnController.aiRequestCompleted.add(() => {
      this.promptEditorInstance?.updateStateOnAction();
    });
    this.aiColumnController.aiRequestRejected.add(() => {
      this.promptEditorInstance?.updateStateOnAction();
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

import $ from '@js/core/renderer';
import domAdapter from '@ts/core/m_dom_adapter';

import type { Column, ColumnsController } from '../columns_controller/m_columns_controller';
import { getColumnHeaderCellSelector } from '../columns_controller/m_columns_controller_utils';
import { View } from '../m_modules';
import { AIPromptEditor } from './ai_prompt_editor/ai_prompt_editor';
import type { AIPromptEditorOptions } from './ai_prompt_editor/types';
import { AI_COLUMN_NAME } from './const';
import type { AIColumnController } from './m_ai_column_controller';
import {
  getAICommandColumnOptions, isAIColumnAutoMode, isEditorOptions, isPopupOptions,
  isPromptOption,
  isRefreshOption,
} from './utils';

export class AIColumnView extends View {
  private columnsController!: ColumnsController;

  private aiColumnController!: AIColumnController;

  private promptEditorInstance!: AIPromptEditor;

  private addAICommandColumn(): void {
    this.columnsController.addCommandColumn(getAICommandColumnOptions());
  }

  private getAIPromptEditorConfig(
    column: Column,
  ): AIPromptEditorOptions {
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
          of: getColumnHeaderCellSelector(visibleIndex),
          collision: 'fit',
          boundary: this.component.element(),
        },
        ...column.ai?.popup,
      },
      editorOptions: {
        ...column.ai?.editorOptions,
      },
    };
  }

  private updatePromptEditorInstance(column: Column): void {
    const config = this.getAIPromptEditorConfig(column);

    if (!this.promptEditorInstance) {
      this.promptEditorInstance = new AIPromptEditor(config);
    } else {
      this.promptEditorInstance.updateOptions(config);
    }
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
    const isPromptOptionName = isPromptOption(columnOptionName, args.value);

    if (isPromptOptionName) {
      this.promptEditorInstance?.updatePrompt(args.value);
    }

    if (isPromptOptionName && isAIColumnAutoMode(column)) {
      this.aiColumnController.sendAIColumnRequest(column.name);
    }

    const needUpdatePopup = isPopupOptions(columnOptionName, args.value);
    const needUpdateEditor = isEditorOptions(columnOptionName, args.value);
    if (needUpdatePopup || needUpdateEditor) {
      this.updatePromptEditorInstance(column);
    }

    if (isRefreshOption(columnOptionName, args.value)) {
      // TODO: this.component.refresh();
    }
  }

  private ensureAIPromptEditorVisibility() {
    const aiColumns = this.aiColumnController.getAIColumns();
    const aiColumnsWithVisiblePopup = aiColumns.filter((column) => column.ai?.popup?.visible);
    if (aiColumnsWithVisiblePopup.length > 0) {
      this.updatePromptEditorInstance(aiColumnsWithVisiblePopup[0]);
    }
  }

  public init(): void {
    this.columnsController = this.getController('columns');
    this.aiColumnController = this.getController('aiColumn');

    this.addAICommandColumn();
    this.aiColumnController.aiRequestCompleted.add(() => {
      this.promptEditorInstance?.updatePrompt(this.promptEditorInstance.getEditorValue());
      this.promptEditorInstance?.updateStateOnAction('stop');
    });
    this.aiColumnController.aiRequestRejected.add(() => {
      this.promptEditorInstance?.updateStateOnAction('stop');
    });

    this.renderCompleted.add(() => {
      this.ensureAIPromptEditorVisibility();
    });
  }

  public showPromptEditor(cellElement: HTMLElement, column: Column): Promise<boolean> {
    const $cellElement = $(cellElement);

    if (!$cellElement?.length || column?.type !== AI_COLUMN_NAME) {
      return Promise.resolve(false);
    }

    this.updatePromptEditorInstance(column);
    return this.promptEditorInstance.show();
  }

  public hidePromptEditor(): Promise<boolean> {
    return this.promptEditorInstance?.hide();
  }

  public getPromptEditorInstance(): AIPromptEditor {
    return this.promptEditorInstance;
  }
}

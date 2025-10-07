import type { dxElementWrapper } from '@js/core/renderer';

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
      value: column.ai?.prompt ?? '',
      container: this.element(),
      createComponent: this._createComponent.bind(this),
      popupOptions: {
        shading: false,
        position: {
          my: `${alignment} top`,
          at: `${alignment} bottom`,
          of: $cellElement.get(0),
          collision: 'fit',
          boundary: this.component.element(),
        },
      },
    };
  }

  public init(): void {
    this.columnsController = this.getController('columns');
    this.aiColumnController = this.getController('aiColumn');

    this.addAiCommandColumn();
  }

  public showPromptEditor($cellElement: dxElementWrapper, column: Column): Promise<boolean> {
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

import type { Column } from '@ts/grids/grid_core/columns_controller/types';

import { ViewController } from '../../m_modules';
import type { AIPromptEditorView } from '../views/m_ai_prompt_editor_view';

export class AIPromptEditorViewController extends ViewController {
  private aiPromptEditorView!: AIPromptEditorView;

  public init(): void {
    this.aiPromptEditorView = this.getView('aiPromptEditorView');
  }

  public show(
    cellElement: HTMLElement,
    column: Column,
  ): Promise<boolean> {
    return this.aiPromptEditorView.show(cellElement, column);
  }

  public hide(): Promise<boolean> {
    return this.aiPromptEditorView.hide();
  }
}

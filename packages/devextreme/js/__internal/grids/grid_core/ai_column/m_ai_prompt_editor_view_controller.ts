import type { Column } from '../columns_controller/m_columns_controller';
import { ViewController } from '../m_modules';
import type { AIPromptEditorView } from './m_ai_prompt_editor_view';

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

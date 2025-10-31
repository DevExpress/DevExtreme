import { DropDownButtonModel } from '@ts/ui/drop_down_editor/__tests__/__mock__/model/drop_down_button';

const SELECTORS = {
  aiColumnHeaderContent: 'dx-command-ai-header-content',
  aiColumnHeaderButton: 'dx-command-ai-header-button',
  aiChatSparkleOutlineIcon: 'dx-icon-chatsparkleoutline',
};

export class HeaderCellModel {
  constructor(public readonly root: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.root;
  }

  public getText(): string {
    return this.getHeaderContent()?.textContent ?? '';
  }

  public getHeaderContent(): HTMLElement {
    return this.root.querySelector(`.${SELECTORS.aiColumnHeaderContent}`) as HTMLElement;
  }

  public getIcon(): HTMLElement {
    return this.root.querySelector(`.${SELECTORS.aiChatSparkleOutlineIcon}`) as HTMLElement;
  }

  public getDropDownButton(): DropDownButtonModel {
    return new DropDownButtonModel(this.root.querySelector(`.${SELECTORS.aiColumnHeaderButton}`) as HTMLElement);
  }
}

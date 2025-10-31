import { DropDownButtonModel } from '@ts/ui/drop_down_editor/__tests__/__mock__/model/drop_down_button';

const SELECTORS = {
  aiColumnHeaderContent: 'dx-command-ai-header-content',
  aiColumnHeaderButton: 'dx-command-ai-header-button',
  aiChatSparkleOutlineIcon: 'dx-icon-chatsparkleoutline',
};

export class HeaderCellModel {
  constructor(public readonly root: HTMLElement | null) {}

  public getElement(): HTMLElement | null {
    return this.root;
  }

  public getText(): string {
    return this.getHeaderContent()?.textContent ?? '';
  }

  public getHeaderContent(): HTMLElement | null {
    return this.root?.querySelector(`.${SELECTORS.aiColumnHeaderContent}`) ?? null;
  }

  public getIcon(): HTMLElement | null {
    return this.root?.querySelector(`.${SELECTORS.aiChatSparkleOutlineIcon}`) ?? null;
  }

  public getDropDownButton(): DropDownButtonModel {
    return new DropDownButtonModel(this.root?.querySelector(`.${SELECTORS.aiColumnHeaderButton}`) ?? null);
  }
}

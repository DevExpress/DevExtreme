const SELECTORS = {
  aiColumnHeaderContent: 'dx-command-ai-header-content',
  aiColumnHeaderButton: 'dx-command-ai-header-button',
  aiChatSparkleOutlineIcon: 'dx-icon-chatsparkleoutline',
};

export class HeaderCellModel {
  constructor(public readonly element: HTMLElement) {}

  public getText(): string {
    return this.getHeaderContent()?.textContent ?? '';
  }

  public getHeaderContent(): HTMLElement | null {
    return this.element.querySelector(`.${SELECTORS.aiColumnHeaderContent}`);
  }

  public getIcon(): HTMLElement | null {
    return this.element.querySelector(`.${SELECTORS.aiChatSparkleOutlineIcon}`);
  }

  public getDropDownButton(): HTMLElement | null {
    return this.element.querySelector(`.${SELECTORS.aiColumnHeaderButton}`);
  }
}

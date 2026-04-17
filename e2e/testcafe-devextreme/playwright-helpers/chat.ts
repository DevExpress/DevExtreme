import type { Page, Locator } from '@playwright/test';

const CLASS = {
  input: 'dx-texteditor-input',
  messageList: 'dx-chat-messagelist',
  messageBoxButton: 'dx-button',
  scrollable: 'dx-scrollable',
  textArea: 'dx-textarea',
  messageBubble: 'dx-chat-messagebubble',
  contextMenuContent: 'dx-messagelist-context-menu-content',
  menuItem: 'dx-menu-item',
} as const;

export class Chat {
  readonly page: Page;
  readonly selector: string;
  readonly element: Locator;
  readonly messageList: Locator;
  readonly messageBoxButton: Locator;

  constructor(page: Page, selector = '#container') {
    this.page = page;
    this.selector = selector;
    this.element = page.locator(selector);
    this.messageList = this.element.locator(`.${CLASS.messageList}`);
    this.messageBoxButton = this.element.locator(`.${CLASS.messageBoxButton}`);
  }

  getInput(): Locator {
    return this.element.locator(`.${CLASS.textArea} .${CLASS.input}`);
  }

  getScrollable(): Locator {
    return this.element.locator(`.${CLASS.scrollable}`);
  }

  getMessage(index: number): Locator {
    return this.element.locator(`.${CLASS.messageBubble}`).nth(index);
  }

  getContextMenuContent(): Locator {
    return this.page.locator(`.${CLASS.contextMenuContent}`);
  }

  getContextMenuItem(index: number): Locator {
    return this.getContextMenuContent().locator(`.${CLASS.menuItem}`).nth(index);
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxChat('instance').option(n, v);
        },
        { sel, name, value },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n }) => ($(s) as any).dxChat('instance').option(n),
      { sel, name },
    );
  }

  async focus(): Promise<void> {
    await this.page.evaluate(
      (sel) => {
        ($(sel) as any).dxChat('instance').focus();
      },
      this.selector,
    );
  }

  async repaint(): Promise<void> {
    await this.page.evaluate(
      (sel) => {
        ($(sel) as any).dxChat('instance').repaint();
      },
      this.selector,
    );
  }

  async renderMessage(message: unknown): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ sel: s, msg }) => {
        ($(s) as any).dxChat('instance').renderMessage(msg);
      },
      { sel, msg: message },
    );
  }

  async scrollOffset(): Promise<{ top: number; left: number }> {
    const sel = this.selector;
    return this.page.evaluate(
      (s) => {
        const scrollable = ($(s) as any).find('.dx-scrollable').dxScrollable('instance');
        return {
          top: scrollable.scrollTop(),
          left: scrollable.scrollLeft(),
        };
      },
      sel,
    );
  }

  async rightClick(locator: Locator): Promise<void> {
    await locator.click({ button: 'right' });
  }
}

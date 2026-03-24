import type { Page, Locator } from '@playwright/test';

const CLASS = {
  dropDownButton: 'dx-dropdowneditor-button',
  textEditorInput: 'dx-texteditor-input',
  list: 'dx-list',
  focused: 'dx-state-focused',
  invisible: 'dx-state-invisible',
  actionButton: 'dx-texteditor-button-container',
  button: 'dx-button',
} as const;

const ATTR = {
  popupId: 'aria-owns',
} as const;

export class SelectBox {
  readonly page: Page;
  readonly selector: string;
  readonly element: Locator;
  readonly input: Locator;
  readonly dropDownButton: Locator;

  constructor(page: Page, selector = '#container') {
    this.page = page;
    this.selector = selector;
    this.element = page.locator(selector);
    this.input = this.element.locator(`.${CLASS.textEditorInput}`);
    this.dropDownButton = this.element.locator(`.${CLASS.dropDownButton}`);
  }

  async click(): Promise<void> {
    await this.element.click();
  }

  get isFocused(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.focused,
    );
  }

  get value(): Promise<string> {
    return this.input.inputValue();
  }

  async isOpened(): Promise<boolean> {
    const popupId = await this.input.getAttribute(ATTR.popupId);
    if (!popupId) return false;
    const overlayContent = this.page.locator(`#${popupId}`).locator('..');
    const isInvisible = await overlayContent.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.invisible,
    );
    return !isInvisible;
  }

  async getPopup(): Promise<Locator> {
    const popupId = await this.input.getAttribute(ATTR.popupId);
    return this.page.locator(`#${popupId}`);
  }

  async getList(): Promise<Locator> {
    const popup = await this.getPopup();
    return popup.locator(`.${CLASS.list}`);
  }

  getButton(index: number): Locator {
    return this.element.locator(`.${CLASS.actionButton} .${CLASS.button}`).nth(index);
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxSelectBox('instance').option(n, v);
        },
        { sel, name, value },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n }) => ($(s) as any).dxSelectBox('instance').option(n),
      { sel, name },
    );
  }

  async focus(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      (s) => { ($(s) as any).dxSelectBox('instance').focus(); },
      sel,
    );
  }
}

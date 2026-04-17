import type { Page, Locator } from '@playwright/test';

const CLASS = {
  inputField: 'dx-lookup-field',
  list: 'dx-list',
  focused: 'dx-state-focused',
  invisible: 'dx-state-invisible',
  popupWrapper: 'dx-popup-wrapper',
  overlayContent: 'dx-overlay-content',
  popupContent: 'dx-popup-content',
  search: 'dx-lookup-search',
} as const;

const ATTR = {
  popupId: 'aria-owns',
} as const;

export class Lookup {
  readonly page: Page;
  readonly selector: string;
  readonly element: Locator;
  readonly field: Locator;

  constructor(page: Page, selector = '#container') {
    this.page = page;
    this.selector = selector;
    this.element = page.locator(selector);
    this.field = this.element.locator(`.${CLASS.inputField}`);
  }

  async open(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      (s) => { ($(s) as any).dxLookup('instance').open(); },
      sel,
    );
  }

  async isOpened(): Promise<boolean> {
    const sel = this.selector;
    return this.page.evaluate(
      (s) => {
        const instance = ($(s) as any).dxLookup('instance');
        const popup = instance._popup;
        return popup ? popup.option('visible') : false;
      },
      sel,
    );
  }

  async getPopup(): Promise<Locator> {
    return this.page.locator(`.${CLASS.popupWrapper}`);
  }

  async getList(): Promise<Locator> {
    const popup = await this.getPopup();
    return popup.locator(`.${CLASS.list}`);
  }

  getSearchInput(): Locator {
    return this.page.locator(`.${CLASS.search} input`);
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxLookup('instance').option(n, v);
        },
        { sel, name, value },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n }) => ($(s) as any).dxLookup('instance').option(n),
      { sel, name },
    );
  }

  async focus(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      (s) => { ($(s) as any).dxLookup('instance').focus(); },
      sel,
    );
  }
}

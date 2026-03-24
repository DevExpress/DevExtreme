import type { Page, Locator } from '@playwright/test';

const CLASS = {
  scrollable: 'dx-scrollable',
  scrollableContainer: 'dx-scrollable-container',
  scrollableContent: 'dx-scrollable-content',
  scrollbar: 'dx-scrollbar-horizontal',
  scrollbarVertical: 'dx-scrollbar-vertical',
  simulatedScrollbar: 'dx-scrollable-scrollbar',
} as const;

export class Scrollable {
  readonly page: Page;
  readonly selector: string;
  readonly element: Locator;

  constructor(page: Page, selector = '#scrollable', options?: Record<string, unknown>) {
    this.page = page;
    this.selector = selector;
    this.element = page.locator(selector);
    if (options) {
      this._options = options;
    }
  }

  private _options?: Record<string, unknown>;

  getContainer(): Locator {
    return this.element.locator(`.${CLASS.scrollableContainer}`);
  }

  getContent(): Locator {
    return this.element.locator(`.${CLASS.scrollableContent}`);
  }

  getScrollbar(direction: 'horizontal' | 'vertical' = 'vertical'): Locator {
    const cls = direction === 'horizontal' ? CLASS.scrollbar : CLASS.scrollbarVertical;
    return this.element.locator(`.${cls}`);
  }

  async scrollTo(position: { top?: number; left?: number }): Promise<void> {
    await this.page.evaluate(
      ({ sel, pos }) => {
        ($(sel) as any).dxScrollable('instance').scrollTo(pos);
      },
      { sel: this.selector, pos: position },
    );
  }

  async scrollTop(): Promise<number> {
    return this.page.evaluate(
      ({ sel }) => ($(sel) as any).dxScrollable('instance').scrollTop(),
      { sel: this.selector },
    );
  }

  async scrollLeft(): Promise<number> {
    return this.page.evaluate(
      ({ sel }) => ($(sel) as any).dxScrollable('instance').scrollLeft(),
      { sel: this.selector },
    );
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxScrollable('instance').option(n, v);
        },
        { sel, name, value },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n }) => ($(s) as any).dxScrollable('instance').option(n),
      { sel, name },
    );
  }
}

export class ScrollView extends Scrollable {
  constructor(page: Page, selector = '#scrollView', options?: Record<string, unknown>) {
    super(page, selector, options);
  }

  async scrollViewOption(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxScrollView('instance').option(n, v);
        },
        { sel, name, value },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n }) => ($(s) as any).dxScrollView('instance').option(n),
      { sel, name },
    );
  }
}

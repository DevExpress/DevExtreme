import type { Page, Locator } from '@playwright/test';

export class Widget {
  readonly page: Page;
  readonly selector: string;
  readonly element: Locator;

  constructor(page: Page, widgetName: string, selector = '#container') {
    this.page = page;
    this.selector = selector;
    this.element = page.locator(selector);
    this.widgetName = widgetName;
  }

  private readonly widgetName: string;

  async option(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    const wn = this.widgetName;
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v, wn: w }) => {
          ($(s) as any)[w]('instance').option(n, v);
        },
        { sel, name, value, wn },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n, wn: w }) => ($(s) as any)[w]('instance').option(n),
      { sel, name, wn },
    );
  }

  async optionObject(options: Record<string, unknown>): Promise<void> {
    const sel = this.selector;
    const wn = this.widgetName;
    await this.page.evaluate(
      ({ sel: s, opts, wn: w }) => {
        ($(s) as any)[w]('instance').option(opts);
      },
      { sel, opts: options, wn },
    );
  }

  async getInstance(): Promise<void> {
    return this.page.evaluate(
      ({ sel: s, wn: w }) => ($(s) as any)[w]('instance'),
      { sel: this.selector, wn: this.widgetName },
    );
  }

  async focus(): Promise<void> {
    const sel = this.selector;
    const wn = this.widgetName;
    await this.page.evaluate(
      ({ sel: s, wn: w }) => {
        ($(s) as any)[w]('instance').focus();
      },
      { sel, wn },
    );
  }

  get isFocused(): Locator {
    return this.element.locator('.dx-state-focused');
  }

  async hasFocusClass(): Promise<boolean> {
    return this.element.evaluate((el) => el.classList.contains('dx-state-focused'));
  }

  async hasClass(className: string): Promise<boolean> {
    return this.element.evaluate((el, cls) => el.classList.contains(cls), className);
  }
}

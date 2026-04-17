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

  async scrollToElement(elementSelector: string): Promise<void> {
    await this.page.evaluate(
      ({ sel, elemSel }) => {
        ($(sel) as any).dxScrollable('instance').scrollToElement($(elemSel)[0]);
      },
      { sel: this.selector, elemSel: elementSelector },
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

  async isScrollbarVisible(direction: 'horizontal' | 'vertical' = 'vertical'): Promise<boolean> {
    const cls = direction === 'horizontal' ? CLASS.scrollbar : CLASS.scrollbarVertical;
    return this.page.evaluate(
      ({ sel, scrollbarCls }) => {
        const scrollbarTrack = document.querySelector(`${sel} .${scrollbarCls}`);
        if (!scrollbarTrack) return false;
        const scrollThumb = scrollbarTrack.querySelector('.dx-scrollable-scroll');
        if (!scrollThumb) return false;
        return !scrollThumb.classList.contains('dx-state-invisible');
      },
      { sel: this.selector, scrollbarCls: cls },
    );
  }

  readonly hScrollbar: null = null;

  async setContainerCssWidth(width: number): Promise<void> {
    await this.page.evaluate(
      ({ sel, w }) => {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (el) el.style.width = `${w}px`;
        const inst = ($(sel) as any).dxScrollable('instance');
        inst.option('width', w);
        inst.update();
      },
      { sel: this.selector, w: width },
    );
  }

  async update(): Promise<void> {
    await this.page.evaluate(
      ({ sel }) => {
        ($(sel) as any).dxScrollable('instance').update();
      },
      { sel: this.selector },
    );
  }

  async scrollOffset(): Promise<{ left: number; top: number }> {
    return this.page.evaluate(
      ({ sel }) => {
        const inst = ($(sel) as any).dxScrollable('instance');
        return inst.scrollOffset();
      },
      { sel: this.selector },
    );
  }

  async getMaxScrollOffset(): Promise<{ horizontal: number; vertical: number }> {
    return this.page.evaluate(
      ({ sel }) => {
        const inst = ($(sel) as any).dxScrollable('instance');
        const scrollWidth = inst.scrollWidth();
        const clientWidth = inst.clientWidth();
        const scrollHeight = inst.scrollHeight();
        const clientHeight = inst.clientHeight();
        return {
          horizontal: Math.max(0, scrollWidth - clientWidth),
          vertical: Math.max(0, scrollHeight - clientHeight),
        };
      },
      { sel: this.selector },
    );
  }

  async hide(): Promise<void> {
    await this.page.evaluate(
      ({ sel }) => {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (el) el.style.display = 'none';
      },
      { sel: this.selector },
    );
  }

  async show(): Promise<void> {
    await this.page.evaluate(
      ({ sel }) => {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (el) el.style.display = 'block';
      },
      { sel: this.selector },
    );
  }

  async triggerHidingEvent(): Promise<void> {
    await this.page.evaluate(
      ({ sel }) => {
        ($(sel) as any).dxScrollable('instance')._visibilityChanged(false);
      },
      { sel: this.selector },
    );
  }

  async triggerShownEvent(): Promise<void> {
    await this.page.evaluate(
      ({ sel }) => {
        ($(sel) as any).dxScrollable('instance')._visibilityChanged(true);
      },
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

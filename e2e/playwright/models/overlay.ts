import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';

const CLASS = {
  content: 'dx-overlay-content',
  wrapper: 'dx-overlay-wrapper',
};

export default class Overlay extends Widget {
  public readonly content: Locator;

  public readonly wrapper: Locator;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.content = this.element.locator(`.${CLASS.content}`);
    this.wrapper = this.element.locator(`.${CLASS.wrapper}`);
  }

  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxOverlay'; }

  // The last wrapper on the page rather than the one under the widget element: when several
  // popups are open the topmost one is the interesting one.
  public getWrapper(): Locator {
    return this.page.locator(`.${CLASS.wrapper}`).last();
  }

  public getContent(): Locator {
    return this.page.locator(`.${CLASS.content}`);
  }

  public isVisible(): Promise<boolean> {
    return this.option('visible');
  }

  public async show(): Promise<void> {
    await this.invoke('show');
  }

  public async hide(): Promise<void> {
    await this.invoke('hide');
  }
}

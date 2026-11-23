import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';
import Scrollbar from './scrollbar';

export interface ScrollOffset {
  top: number;
  left: number;
}

export type ScrollableDirection = 'both' | 'horizontal' | 'vertical';

export interface ScrollableModelOptions {
  direction?: ScrollableDirection;
  useNative?: boolean;
  useSimulatedScrollbar?: boolean;
}

const CLASS = {
  container: 'dx-scrollable-container',
};

export default class Scrollable extends Widget {
  name: WidgetName = 'dxScrollable';

  public readonly scrollbar: Scrollbar;

  public readonly hScrollbar?: Scrollbar;

  constructor(
    page: Page,
    selector: Locator | string,
    { direction = 'vertical', useNative = false, useSimulatedScrollbar = false }: ScrollableModelOptions = {},
  ) {
    super(page, selector);

    this.scrollbar = new Scrollbar(this.element, direction);

    if (!useNative && !useSimulatedScrollbar && direction !== 'vertical') {
      this.hScrollbar = new Scrollbar(this.element, 'horizontal');
    }
  }

  public getContainer(): Locator {
    return this.element.locator(`.${CLASS.container}`);
  }

  public getMaxScrollOffset(): Promise<{ vertical: number; horizontal: number }> {
    return this.getContainer().evaluate((container) => ({
      vertical: container.scrollHeight - container.clientHeight,
      horizontal: container.scrollWidth - container.clientWidth,
    }));
  }

  public async scrollOffset(): Promise<ScrollOffset> {
    const { top, left }: ScrollOffset = await this.invoke('scrollOffset');

    // The simulated strategy negates its location, so a zero offset comes back as -0.
    return { top: top + 0, left: left + 0 };
  }

  public async scrollTo(value: Partial<ScrollOffset>): Promise<void> {
    await this.invoke('scrollTo', value);
  }

  public async scrollToElement(selector: string): Promise<void> {
    await this.invoke('scrollToElement', selector);
  }

  public async update(): Promise<void> {
    await this.invoke('update');
  }

  public async setContainerCssWidth(width: number): Promise<void> {
    await this.element.evaluate((element, { value, widgetName }) => {
      const instance = ($(element) as any).data(widgetName);

      instance.container().css({ width: value });
      // eslint-disable-next-line no-underscore-dangle
      instance._dimensionChanged();
    }, { value: width, widgetName: this.getName() });
  }

  public async hide(): Promise<void> {
    await this.element.evaluate((element) => {
      (element as HTMLElement).style.setProperty('display', 'none');
    });
  }

  public async show(): Promise<void> {
    await this.element.evaluate((element) => {
      (element as HTMLElement).style.setProperty('display', 'block');
    });
  }

  public async triggerHidingEvent(): Promise<void> {
    await this.invoke('_visibilityChanged', false);
  }

  public async triggerShownEvent(): Promise<void> {
    await this.invoke('_visibilityChanged', true);
  }
}

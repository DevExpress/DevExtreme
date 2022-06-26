import { ClientFunction, Selector } from 'testcafe';
import { DIRECTION_VERTICAL, DIRECTION_HORIZONTAL } from '../../../../../js/renovation/ui/scroll_view/common/consts';

import Widget from '../../internal/widget';
import Scrollbar from './scrollbar';
import type { PlatformType } from '../../../helpers/multi-platform-test/platform-type';

const CLASS = {
  scrollable: 'dx-scrollable',
  scrollableContainer: 'dx-scrollable-container',
  scrollableContent: 'dx-scrollable-content',
};

const getScrollable = (platform: PlatformType) => class Scrollable extends Widget {
  scrollbar: Scrollbar;

  vScrollbar?: Scrollbar;

  hScrollbar?: Scrollbar;

  name: string;

  constructor(id: string | Selector, options?: any, name = 'dxScrollable') {
    super(id);

    const direction = options.direction ?? 'vertical';

    this.scrollbar = new Scrollbar(options.direction ?? 'vertical');

    if (!options.useNative && !options.useSimulatedScrollbar) {
      if (direction !== DIRECTION_HORIZONTAL) {
        this.vScrollbar = new Scrollbar(DIRECTION_VERTICAL);
      }
      if (direction !== DIRECTION_VERTICAL) {
        this.hScrollbar = new Scrollbar(DIRECTION_HORIZONTAL);
      }
    }

    this.name = name;
    this.platform = platform ?? 'jquery';
  }

  // eslint-disable-next-line class-methods-use-this
  getElement(): Selector {
    return Selector(`.${CLASS.scrollable}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getContainer(): Selector {
    return Selector(`.${CLASS.scrollableContainer}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getContent(): Selector {
    return Selector(`.${CLASS.scrollableContent}`);
  }

  async getMaxScrollOffset(): Promise<{ vertical: number; horizontal: number }> {
    const container = this.getContainer();
    const scrollHeight = await container.scrollHeight;
    const clientHeight = await container.clientHeight;
    const scrollWidth = await container.scrollWidth;
    const clientWidth = await container.clientWidth;

    return ClientFunction(
      () => ({
        vertical: scrollHeight - clientHeight,
        horizontal: scrollWidth - clientWidth,
      }),
      {
        dependencies: {
          scrollHeight, clientHeight, scrollWidth, clientWidth,
        },
      },
    )();
  }

  apiScrollOffset(): Promise<{ top: number; left: number }> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).scrollOffset(),
      { dependencies: { getInstance } },
    )();
  }

  apiScrollTo(value: { top?: number; left?: number }): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        (getInstance() as any).scrollTo(value);
      },
      { dependencies: { getInstance, value } },
    )();
  }

  apiScrollToElement(selector: string): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        (getInstance() as any).scrollToElement(selector);
      },
      { dependencies: { getInstance, selector } },
    )();
  }

  apiOption(name: string, value: string | number | boolean = 'undefined'): Promise<any> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        const scrollable = getInstance() as any;
        return value !== 'undefined' ? scrollable.option(name, value) : scrollable.option(name);
      },
      { dependencies: { getInstance, name, value } },
    )();
  }

  apiUpdate(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        (getInstance() as any).update();
      },
      { dependencies: { getInstance } },
    )();
  }

  setContainerCssWidth(value: number): Promise<unknown> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        (getInstance() as any).container().css({ width: value });
        // force recalculate size for old component
        // eslint-disable-next-line no-underscore-dangle
        (getInstance() as any)._dimensionChanged();
      },
      { dependencies: { getInstance, value } },
    )();
  }

  // eslint-disable-next-line class-methods-use-this
  hide(): Promise<unknown> {
    return ClientFunction(
      () => {
        const targetElement = document.querySelector(`.${CLASS.scrollable}`) as HTMLElement;

        targetElement.style.display = 'none';
      },
      { dependencies: { CLASS } },
    )();
  }

  apiTriggerHidingEvent(): Promise<unknown> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        // eslint-disable-next-line no-underscore-dangle
        (getInstance() as any)._visibilityChanged(false);
      },
      { dependencies: { getInstance } },
    )();
  }

  // eslint-disable-next-line class-methods-use-this
  show(): Promise<unknown> {
    return ClientFunction(
      () => {
        const targetElement = document.querySelector(`.${CLASS.scrollable}`) as HTMLElement;

        targetElement.style.display = 'block';
      },
      { dependencies: { CLASS } },
    )();
  }

  apiTriggerShownEvent(): Promise<unknown> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        // eslint-disable-next-line no-underscore-dangle
        (getInstance() as any)._visibilityChanged(true);
      },
      { dependencies: { getInstance } },
    )();
  }
};

export const ScrollableFactory = {
  jquery: getScrollable('jquery'),
  angular: getScrollable('angular'),
  react: getScrollable('react'),
};

export default ScrollableFactory.jquery;

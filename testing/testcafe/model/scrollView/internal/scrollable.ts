import { ClientFunction, Selector } from 'testcafe';
import { DIRECTION_VERTICAL, DIRECTION_HORIZONTAL } from '../../../../../js/renovation/ui/scroll_view/common/consts';

import Widget from '../../internal/widget';
import Scrollbar from './scrollbar';
import type { PlatformType } from '../../../helpers/multi-platform-test/platform-type';
import { WidgetName } from '../../../helpers/createWidget';

const CLASS = {
  scrollable: 'dx-scrollable',
  scrollableContainer: 'dx-scrollable-container',
  scrollableContent: 'dx-scrollable-content',
};

const getScrollable = (platform: PlatformType) => class Scrollable extends Widget {
  scrollbar: Scrollbar;

  vScrollbar?: Scrollbar;

  hScrollbar?: Scrollbar;

  constructor(id: string | Selector, options?: any) {
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
  }

  // eslint-disable-next-line class-methods-use-this
  getTestingPlatform() {
    return platform;
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxScrollable'; }

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

  scrollOffset(): Promise<{ top: number; left: number }> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).scrollOffset(),
      { dependencies: { getInstance } },
    )();
  }

  scrollTo(value: { top?: number; left?: number }): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => { (getInstance() as any).scrollTo(value); },
      { dependencies: { getInstance, value } },
    )();
  }

  scrollToElement(selector: string): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => { (getInstance() as any).scrollToElement(selector); },
      { dependencies: { getInstance, selector } },
    )();
  }

  update(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => { (getInstance() as any).update(); },
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

  triggerHidingEvent(): Promise<unknown> {
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

  triggerShownEvent(): Promise<unknown> {
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

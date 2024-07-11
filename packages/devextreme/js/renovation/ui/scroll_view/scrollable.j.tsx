import registerComponent from '../../../core/component_registrator';
import { ScrollableWrapper } from '../../component_wrapper/navigation/scrollable';
import { Scrollable as ScrollableComponent } from './scrollable';

import {
  ScrollOffset,
  ScrollableDirection,
  ElementOffset,
} from './common/types';

export default class Scrollable extends ScrollableWrapper {
  content(): HTMLDivElement | undefined {
    return this._toPublicElement(this.viewRef?.content(...arguments));
  }
  container(): HTMLDivElement | undefined {
    return this._toPublicElement(this.viewRef?.container(...arguments));
  }
  scrollTo(targetLocation: number | Partial<ScrollOffset>): void | undefined {
    return this.viewRef?.scrollTo(...arguments);
  }
  scrollBy(distance: number | Partial<ScrollOffset>): void | undefined {
    return this.viewRef?.scrollBy(...arguments);
  }
  updateHandler(): void | undefined {
    return this.viewRef?.updateHandler(...arguments);
  }
  release(): void | undefined {
    return this.viewRef?.release(...arguments);
  }
  refresh(): void | undefined {
    return this.viewRef?.refresh(...arguments);
  }
  scrollToElement(
    element: HTMLElement,
    offset?: ElementOffset
  ): void | undefined {
    const params = [this._patchElementParam(element), offset];
    return this.viewRef?.scrollToElement(...params.slice(0, arguments.length));
  }
  scrollHeight(): number | undefined {
    return this.viewRef?.scrollHeight(...arguments);
  }
  scrollWidth(): number | undefined {
    return this.viewRef?.scrollWidth(...arguments);
  }
  scrollOffset(): ScrollOffset | undefined {
    return this.viewRef?.scrollOffset(...arguments);
  }
  scrollTop(): number | undefined {
    return this.viewRef?.scrollTop(...arguments);
  }
  scrollLeft(): number | undefined {
    return this.viewRef?.scrollLeft(...arguments);
  }
  clientHeight(): number | undefined {
    return this.viewRef?.clientHeight(...arguments);
  }
  clientWidth(): number | undefined {
    return this.viewRef?.clientWidth(...arguments);
  }
  getScrollElementPosition(
    targetElement: HTMLElement,
    direction: ScrollableDirection,
    offset?: ElementOffset
  ): number | undefined {
    const params = [this._patchElementParam(targetElement), direction, offset];
    return this.viewRef?.getScrollElementPosition(
      ...params.slice(0, arguments.length)
    );
  }
  startLoading(): void | undefined {
    return this.viewRef?.startLoading(...arguments);
  }
  finishLoading(): void | undefined {
    return this.viewRef?.finishLoading(...arguments);
  }

  _getActionConfigs() {
    return {
      onVisibilityChange: {},
      onStart: {},
      onEnd: {},
      onBounce: {},
      scrollLocationChange: {},
      onScroll: {},
      onUpdated: {},
      onPullDown: {},
      onReachBottom: {},
    };
  }

  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ['loadPanelTemplate'],
      props: [
        'useNative',
        'useSimulatedScrollbar',
        'refreshStrategy',
        'inertiaEnabled',
        'useKeyboard',
        'showScrollbar',
        'scrollByThumb',
        'onVisibilityChange',
        'onStart',
        'onEnd',
        'onBounce',
        'scrollLocationChange',
        'loadPanelTemplate',
        'aria',
        'addWidgetClass',
        'disabled',
        'height',
        'width',
        'visible',
        'rtlEnabled',
        'classes',
        'direction',
        'bounceEnabled',
        'scrollByContent',
        'pullDownEnabled',
        'reachBottomEnabled',
        'forceGeneratePockets',
        'needScrollViewContentWrapper',
        'needRenderScrollbars',
        'onScroll',
        'onUpdated',
        'onPullDown',
        'onReachBottom',
        'pullingDownText',
        'pulledDownText',
        'refreshingText',
        'reachBottomText',
      ],
    };
  }

  get _viewComponent() {
    return ScrollableComponent;
  }
}

registerComponent('dxScrollable', Scrollable);

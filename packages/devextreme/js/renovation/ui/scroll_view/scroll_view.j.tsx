import registerComponent from '../../../core/component_registrator';
import { ScrollViewWrapper } from '../../component_wrapper/navigation/scroll_view';
import { ScrollView as ScrollViewComponent } from './scroll_view';

import { ElementOffset, ScrollOffset } from './common/types';

export default class ScrollView extends ScrollViewWrapper {
  release(preventScrollBottom: boolean): void | undefined {
    return this.viewRef?.release(...arguments);
  }
  refresh(): void | undefined {
    return this.viewRef?.refresh(...arguments);
  }
  content(): HTMLDivElement | undefined {
    return this._toPublicElement(this.viewRef?.content(...arguments));
  }
  container(): HTMLDivElement | undefined {
    return this._toPublicElement(this.viewRef?.container(...arguments));
  }
  scrollBy(distance: number | Partial<ScrollOffset>): void | undefined {
    return this.viewRef?.scrollBy(...arguments);
  }
  scrollTo(targetLocation: number | Partial<ScrollOffset>): void | undefined {
    return this.viewRef?.scrollTo(...arguments);
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
  toggleLoading(showOrHide: boolean): void | undefined {
    return this.viewRef?.toggleLoading(...arguments);
  }
  startLoading(): void | undefined {
    return this.viewRef?.startLoading(...arguments);
  }
  finishLoading(): void | undefined {
    return this.viewRef?.finishLoading(...arguments);
  }
  updateHandler(): void | undefined {
    return this.viewRef?.updateHandler(...arguments);
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
        'pullDownEnabled',
        'reachBottomEnabled',
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
    return ScrollViewComponent;
  }
}

registerComponent('dxScrollView', ScrollView);

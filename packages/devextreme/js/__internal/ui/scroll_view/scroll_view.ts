/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { hasWindow } from '@js/core/utils/window';
import LoadIndicator from '@js/ui/load_indicator';
import type { Properties } from '@js/ui/scroll_view';
import { isMaterialBased } from '@js/ui/themes';
import type { OptionChanged } from '@ts/core/widget/types';
import LoadPanel from '@ts/ui/m_load_panel';

import PullDownStrategy from './scroll_view.native.pull_down';
import SwipeDownStrategy from './scroll_view.native.swipe_down';
import SimulatedStrategy from './scroll_view.simulated';
import Scrollable from './scrollable';
import type { RefreshStrategy, ScrollOffset } from './types';

// STYLE scrollView

const SCROLLVIEW_CLASS = 'dx-scrollview';
const SCROLLVIEW_CONTENT_CLASS = `${SCROLLVIEW_CLASS}-content`;
const SCROLLVIEW_TOP_POCKET_CLASS = `${SCROLLVIEW_CLASS}-top-pocket`;
const SCROLLVIEW_BOTTOM_POCKET_CLASS = `${SCROLLVIEW_CLASS}-bottom-pocket`;
const SCROLLVIEW_PULLDOWN_CLASS = `${SCROLLVIEW_CLASS}-pull-down`;

const SCROLLVIEW_REACHBOTTOM_CLASS = `${SCROLLVIEW_CLASS}-scrollbottom`;
const SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS = `${SCROLLVIEW_REACHBOTTOM_CLASS}-indicator`;
const SCROLLVIEW_REACHBOTTOM_TEXT_CLASS = `${SCROLLVIEW_REACHBOTTOM_CLASS}-text`;

const SCROLLVIEW_LOADPANEL = `${SCROLLVIEW_CLASS}-loadpanel`;

const refreshStrategies = {
  pullDown: PullDownStrategy,
  swipeDown: SwipeDownStrategy,
  simulated: SimulatedStrategy,
};

const isServerSide = !hasWindow();

export interface ScrollViewProperties extends Omit<Properties, 'onScroll' | 'onUpdated' | 'onDisposing' | 'onOptionChanged' | 'onInitialized'> {
  refreshStrategy: RefreshStrategy;
}

export class ScrollViewServerSide extends Scrollable<ScrollViewProperties> {
  finishLoading(): void {}

  release(): void {}

  refresh(): void {}

  scrollOffset(): ScrollOffset {
    return { top: 0, left: 0 };
  }

  isBottomReached(): boolean {
    return false;
  }

  // eslint-disable-next-line consistent-return
  _optionChanged(args: OptionChanged<ScrollViewProperties>): void {
    const { name } = args;
    // @ts-expect-error ts-error
    if (name !== 'onUpdated') {
      return super._optionChanged(args);
    }
  }
}

export class ScrollView extends Scrollable<ScrollViewProperties> {
  // @ts-expect-error ts-error
  _strategy!: PullDownStrategy | SwipeDownStrategy | SimulatedStrategy;

  _loadPanel!: LoadPanel;

  _pullDownEnabled!: boolean;

  _loadingIndicatorEnabled?: boolean;

  _$topPocket!: dxElementWrapper;

  _$pullDown!: dxElementWrapper;

  _$bottomPocket?: dxElementWrapper;

  _$reachBottom?: dxElementWrapper;

  _$reachBottomText?: dxElementWrapper;

  _pullDownAction?: () => void;

  _reachBottomAction?: () => void;

  _reachBottomEnabled?: boolean;

  _getDefaultOptions(): ScrollViewProperties {
    return {
      ...super._getDefaultOptions(),
      pullingDownText: messageLocalization.format('dxScrollView-pullingDownText'),
      pulledDownText: messageLocalization.format('dxScrollView-pulledDownText'),
      refreshingText: messageLocalization.format('dxScrollView-refreshingText'),
      reachBottomText: messageLocalization.format('dxScrollView-reachBottomText'),
      // @ts-expect-error ts-error
      onPullDown: null,
      // @ts-expect-error ts-error
      onReachBottom: null,
      refreshStrategy: 'pullDown',
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<ScrollViewProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          const realDevice = devices.real();
          return realDevice.platform === 'android';
        },
        options: {
          refreshStrategy: 'swipeDown',
        },
      },
      {
        device(): boolean {
          // @ts-expect-error ts-error
          return isMaterialBased();
        },
        options: {
          pullingDownText: '',
          pulledDownText: '',
          refreshingText: '',
          reachBottomText: '',
        },
      },
    ]);
  }

  _init(): void {
    super._init();
    this._loadingIndicatorEnabled = true;
  }

  _initScrollableMarkup(): void {
    super._initScrollableMarkup();
    this.$element().addClass(SCROLLVIEW_CLASS);

    this._initContent();
    this._initTopPocket();
    this._initBottomPocket();
    this._initLoadPanel();
  }

  _initContent(): void {
    const $content = $('<div>').addClass(SCROLLVIEW_CONTENT_CLASS);
    this._$content.wrapInner($content);
  }

  _initTopPocket(): void {
    this._$topPocket = $('<div>')
      .addClass(SCROLLVIEW_TOP_POCKET_CLASS);
    this._$pullDown = $('<div>')
      .addClass(SCROLLVIEW_PULLDOWN_CLASS);

    this._$topPocket.append(this._$pullDown);
    this._$content.prepend(this._$topPocket);
  }

  _initBottomPocket(): void {
    this._$bottomPocket = $('<div>')
      .addClass(SCROLLVIEW_BOTTOM_POCKET_CLASS);
    this._$reachBottom = $('<div>')
      .addClass(SCROLLVIEW_REACHBOTTOM_CLASS);
    const $loadContainer = $('<div>')
      .addClass(SCROLLVIEW_REACHBOTTOM_INDICATOR_CLASS);

    const loadIndicatorElement = $('<div>')[0];
    const $loadIndicator = new LoadIndicator(loadIndicatorElement).$element();
    this._$reachBottomText = $('<div>')
      .addClass(SCROLLVIEW_REACHBOTTOM_TEXT_CLASS);

    this._updateReachBottomText();

    this._$reachBottom
      .append($loadContainer.append($loadIndicator))
      .append(this._$reachBottomText);

    this._$bottomPocket.append(this._$reachBottom);

    this._$content.append(this._$bottomPocket);
  }

  _initLoadPanel(): void {
    const $loadPanelElement = $('<div>')
      .addClass(SCROLLVIEW_LOADPANEL)
      .appendTo(this.$element());

    const { refreshingText } = this.option();

    this._loadPanel = this._createComponent($loadPanelElement, LoadPanel, {
      shading: false,
      delay: 400,
      message: refreshingText,
      position: {
        // @ts-expect-error ts-error
        of: this.$element(),
      },
    });
  }

  _updateReachBottomText(): void {
    const { reachBottomText } = this.option();

    // @ts-expect-error ts-error
    this._$reachBottomText.text(reachBottomText);
  }

  _createStrategy(): void {
    const { useNative, refreshStrategy } = this.option();

    const strategyName = useNative ? refreshStrategy : 'simulated';
    const strategyClass = refreshStrategies[strategyName];

    // @ts-expect-error ts-error
    // eslint-disable-next-line new-cap
    this._strategy = new strategyClass(this);
    this._strategy.pullDownCallbacks.add(this._pullDownHandler.bind(this));
    this._strategy.releaseCallbacks.add(this._releaseHandler.bind(this));
    this._strategy.reachBottomCallbacks.add(this._reachBottomHandler.bind(this));
  }

  _createActions(): void {
    super._createActions();
    this._pullDownAction = this._createActionByOption('onPullDown');
    this._reachBottomAction = this._createActionByOption('onReachBottom');
    this._tryRefreshPocketState();
  }

  _tryRefreshPocketState(): void {
    this._pullDownEnable(this.hasActionSubscription('onPullDown'));
    this._reachBottomEnable(this.hasActionSubscription('onReachBottom'));
  }

  on(eventName: string, ...args: unknown[]): this {
    // @ts-expect-error ts-error
    const result = super.on.apply(this, [eventName, ...args]);

    if (eventName === 'pullDown' || eventName === 'reachBottom') {
      this._tryRefreshPocketState();
    }

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type, consistent-return
  _pullDownEnable(enabled: boolean): boolean | void {
    if (arguments.length === 0) {
      return this._pullDownEnabled;
    }

    if (this._$pullDown && this._strategy) {
      // @ts-expect-error ts-error
      this._$pullDown.toggle(enabled);
      this._strategy.pullDownEnable(enabled);
      this._pullDownEnabled = enabled;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type, consistent-return
  _reachBottomEnable(enabled: boolean): boolean | void {
    if (arguments.length === 0) {
      return this._reachBottomEnabled;
    }

    if (this._$reachBottom && this._strategy) {
      // @ts-expect-error ts-error
      this._$reachBottom.toggle(enabled);
      this._strategy.reachBottomEnable(enabled);
      this._reachBottomEnabled = enabled;
    }
  }

  _pullDownHandler(): void {
    this._loadingIndicator(false);
    this._pullDownLoading();
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type, consistent-return
  _loadingIndicator(value?: boolean): boolean | void {
    if (arguments.length < 1) {
      return this._loadingIndicatorEnabled;
    }
    this._loadingIndicatorEnabled = value;
  }

  _pullDownLoading(): void {
    this.startLoading();
    this._pullDownAction?.();
  }

  _reachBottomHandler(): void {
    this._loadingIndicator(false);
    this._reachBottomLoading();
  }

  _reachBottomLoading(): void {
    this.startLoading();
    this._reachBottomAction?.();
  }

  _releaseHandler(): void {
    this.finishLoading();
    this._loadingIndicator(true);
  }

  _optionChanged(args: OptionChanged<ScrollViewProperties>): void {
    switch (args.name) {
      case 'onPullDown':
      case 'onReachBottom':
        this._createActions();
        break;
      case 'pullingDownText':
      case 'pulledDownText':
      case 'refreshingText':
      case 'refreshStrategy':
        this._invalidate();
        break;
      case 'reachBottomText':
        this._updateReachBottomText();
        break;
      default:
        super._optionChanged(args);
    }
  }

  content(): HTMLElement {
    return getPublicElement(this._$content.children().eq(1));
  }

  release(preventReachBottom?: boolean): PromiseLike<unknown> {
    if (preventReachBottom !== undefined) {
      this.toggleLoading(!preventReachBottom);
    }
    return this._strategy.release();
  }

  toggleLoading(showOrHide: boolean): void {
    this._reachBottomEnable(showOrHide);
  }

  refresh(): void {
    if (!this.hasActionSubscription('onPullDown')) {
      return;
    }

    this._strategy.pendingRelease();
    this._pullDownLoading();
  }

  startLoading(): void {
    if (this._loadingIndicator() && this.$element().is(':visible')) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._loadPanel.show();
    }
    this._lock();
  }

  finishLoading(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._loadPanel.hide();
    this._unlock();
  }

  isBottomReached(): boolean {
    return this._strategy.isBottomReached();
  }

  _dispose(): void {
    this._strategy.dispose();
    super._dispose();

    if (this._loadPanel) {
      this._loadPanel.$element().remove();
    }
  }
}

registerComponent('dxScrollView', isServerSide ? ScrollViewServerSide : ScrollView);

export default isServerSide ? ScrollViewServerSide : ScrollView;

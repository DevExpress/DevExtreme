import { TransitionExecutor } from '@js/common/core/animation/transition_executor/transition_executor';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { triggerShownEvent } from '@js/common/core/events/visibility_change';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import {
  // @ts-expect-error
  executeAsync,
  noop,
} from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import {
  Deferred,
  // @ts-expect-error
  fromPromise,
} from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import { isPromise } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import type { Properties } from '@js/ui/defer_rendering';
import LoadIndicator from '@js/ui/load_indicator';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

const window = getWindow();

const WIDGET_CLASS = 'dx-widget';
const DEFER_RENDERING_CLASS = 'dx-deferrendering';
const PENDING_RENDERING_CLASS = 'dx-pending-rendering';
const PENDING_RENDERING_MANUAL_CLASS = 'dx-pending-rendering-manual';
const PENDING_RENDERING_ACTIVE_CLASS = 'dx-pending-rendering-active';
const VISIBLE_WHILE_PENDING_RENDERING_CLASS = 'dx-visible-while-pending-rendering';
const INVISIBLE_WHILE_PENDING_RENDERING_CLASS = 'dx-invisible-while-pending-rendering';
const LOADINDICATOR_CONTAINER_CLASS = 'dx-loadindicator-container';
const DEFER_RENDERING_LOADINDICATOR_CONTAINER_CLASS = 'dx-deferrendering-loadindicator-container';
const DEFER_DEFER_RENDERING_LOAD_INDICATOR = 'dx-deferrendering-load-indicator';

const ANONYMOUS_TEMPLATE_NAME = 'content';

const ACTIONS = ['onRendered', 'onShown'];

class DeferRendering extends Widget<Properties> {
  _renderTask?: DeferredObj<unknown>;

  transitionExecutor?: any;

  _initContent?: () => void;

  _actions!: Record<string, unknown>;

  _$initialContent?: dxElementWrapper;

  _$loadIndicator?: dxElementWrapper;

  _isRendered?: boolean;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      showLoadIndicator: false,
      // @ts-expect-error ts-error
      onRendered: null,
      // @ts-expect-error ts-error
      onShown: null,
    };
  }

  _getAnonymousTemplateName(): string {
    return ANONYMOUS_TEMPLATE_NAME;
  }

  _init(): void {
    this.transitionExecutor = new TransitionExecutor();

    this._initElement();
    this._initRender();

    this._$initialContent = this.$element().clone().contents();

    this._initActions();
    super._init();
  }

  _initElement(): void {
    this.$element()
      .addClass(DEFER_RENDERING_CLASS);
  }

  _initRender(): void {
    const that = this;
    const $element = this.$element();
    const renderWhen = this.option('renderWhen');

    const doRender = () => that._renderDeferredContent();

    if (isPromise(renderWhen)) {
      fromPromise(renderWhen).done(doRender);
    } else {
      $element.data('dx-render-delegate', doRender);
      if (renderWhen === undefined) {
        $element.addClass(PENDING_RENDERING_MANUAL_CLASS);
      }
    }
  }

  _initActions(): void {
    this._actions = {};

    each(ACTIONS, (_, action) => {
      this._actions[action] = this._createActionByOption(action) || noop;
    });
  }

  _initMarkup(): void {
    super._initMarkup();

    if (!this._initContent) {
      this._initContent = this._renderContent;
      this._renderContent = () => {};
    }

    this._initContent();
  }

  _renderContentImpl(): void {
    this.$element().removeClass(WIDGET_CLASS);
    // @ts-expect-error ts-error
    this.$element().append(this._$initialContent);
    this._setLoadingState();
  }

  _renderDeferredContent(): Promise<unknown> {
    const that = this;
    const $element = this.$element();
    const result = Deferred();

    $element.removeClass(PENDING_RENDERING_MANUAL_CLASS);
    $element.addClass(PENDING_RENDERING_ACTIVE_CLASS);

    this._abortRenderTask();
    this._renderTask = executeAsync(() => {
      that._renderImpl()
        .done(() => {
          const shownArgs = { element: $element };
          // @ts-expect-error ts-error
          that._actions.onShown([shownArgs]);
          result.resolve(shownArgs);
        })
        .fail(function () {
          // @ts-expect-error
          result.rejectWith(result, arguments);
        });
    });

    return result.promise();
  }

  _isElementInViewport(element) {
    const rect = getBoundingRect(element);

    return rect.bottom >= 0
      && rect.right >= 0
      && rect.top <= (window.innerHeight || domAdapter.getDocumentElement().clientHeight)
      && rect.left <= (window.innerWidth || domAdapter.getDocumentElement().clientWidth);
  }

  _animate(): DeferredObj<unknown> {
    const that = this;
    const $element = this.$element();
    const animation = hasWindow() && this.option('animation');
    const staggerItemSelector = this.option('staggerItemSelector');
    let animatePromise;

    that.transitionExecutor.stop();

    if (animation) {
      if (staggerItemSelector) {
        // @ts-expect-error ts-error
        $element.find(staggerItemSelector).each(function () {
          if (that._isElementInViewport(this)) {
            that.transitionExecutor.enter($(this), animation);
          }
        });
      } else {
        that.transitionExecutor.enter($element, animation);
      }
      animatePromise = that.transitionExecutor.start();
    } else {
      animatePromise = Deferred().resolve().promise();
    }

    return animatePromise;
  }

  _renderImpl(): DeferredObj<unknown> {
    const $element = this.$element();
    const renderedArgs = {
      element: $element,
    };

    const contentTemplate = this._getTemplate(this._templateManager.anonymousTemplateName);

    if (contentTemplate) {
      contentTemplate.render({
        container: $element.empty(),
        noModel: true,
      });
    }

    this._setRenderedState();
    // @ts-expect-error ts-error
    eventsEngine.trigger($element, 'dxcontentrendered');
    // @ts-expect-error ts-error
    this._actions.onRendered([renderedArgs]);
    this._isRendered = true;

    return this._animate();
  }

  _setLoadingState() {
    const $element = this.$element();
    const hasCustomLoadIndicator = !!$element.find(`.${VISIBLE_WHILE_PENDING_RENDERING_CLASS}`).length;

    $element.addClass(PENDING_RENDERING_CLASS);
    if (!hasCustomLoadIndicator) {
      $element.children().addClass(INVISIBLE_WHILE_PENDING_RENDERING_CLASS);
    }

    if (this.option('showLoadIndicator')) {
      this._showLoadIndicator($element);
    }
  }

  _showLoadIndicator($container) {
    // @ts-expect-error
    this._$loadIndicator = new LoadIndicator($('<div>'), { visible: true })
      .$element()
      .addClass(DEFER_DEFER_RENDERING_LOAD_INDICATOR);

    $('<div>')
      .addClass(LOADINDICATOR_CONTAINER_CLASS)
      .addClass(DEFER_RENDERING_LOADINDICATOR_CONTAINER_CLASS)
      .append(this._$loadIndicator)
      .appendTo($container);
  }

  _setRenderedState(): void {
    const $element = this.$element();

    if (this._$loadIndicator) {
      this._$loadIndicator.remove();
    }

    $element.removeClass(PENDING_RENDERING_CLASS);
    $element.removeClass(PENDING_RENDERING_ACTIVE_CLASS);

    triggerShownEvent($element.children());
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { value } = args;
    const { previousValue } = args;

    switch (args.name) {
      case 'renderWhen':
        if (previousValue === false && value === true) {
          this._renderOrAnimate();
        } else if (previousValue === true && value === false) {
          this.transitionExecutor.stop();
          this._setLoadingState();
        }
        break;
      case 'showLoadIndicator':
      case 'onRendered':
      case 'onShown':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _renderOrAnimate(): Promise<unknown> {
    let result;

    if (this._isRendered) {
      this._setRenderedState();
      result = this._animate();
    } else {
      result = this._renderDeferredContent();
    }

    return result;
  }

  renderContent(): Promise<unknown> {
    return this._renderOrAnimate();
  }

  _abortRenderTask(): void {
    if (this._renderTask) {
      // @ts-expect-error ts-error
      this._renderTask.abort();
      this._renderTask = undefined;
    }
  }

  _dispose(): void {
    this.transitionExecutor.stop(true);
    this._abortRenderTask();
    // @ts-expect-error ts-error
    this._actions = undefined;
    this._$initialContent = undefined;
    super._dispose();
  }
}

registerComponent('dxDeferRendering', DeferRendering);

export default DeferRendering;

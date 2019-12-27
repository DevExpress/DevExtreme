const $ = require('../core/renderer');
const domAdapter = require('../core/dom_adapter');
const windowUtils = require('../core/utils/window');
const window = windowUtils.getWindow();
const eventsEngine = require('../events/core/events_engine');
const registerComponent = require('../core/component_registrator');
const commonUtils = require('../core/utils/common');
const extend = require('../core/utils/extend').extend;
const each = require('../core/utils/iterator').each;
const domUtils = require('../core/utils/dom');
const TransitionExecutorModule = require('../animation/transition_executor/transition_executor');
const Widget = require('./widget/ui.widget');
const LoadIndicator = require('./load_indicator');
const isPromise = require('../core/utils/type').isPromise;
const deferredUtils = require('../core/utils/deferred');
const Deferred = deferredUtils.Deferred;

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

/**
* @name dxDeferRendering
* @inherits Widget
* @module ui/defer_rendering
* @export default
*/
const DeferRendering = Widget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxDeferRenderingOptions.showLoadIndicator
            * @type bool
            * @default false
            */
            showLoadIndicator: false,
            /**
            * @name dxDeferRenderingOptions.renderWhen
            * @type Promise<void> | bool
            * @default undefined
            */
            renderWhen: undefined,
            /**
            * @name dxDeferRenderingOptions.animation
            * @type animationConfig
            * @default undefined
            */
            animation: undefined,
            /**
            * @name dxDeferRenderingOptions.staggerItemSelector
            * @type string
            * @default undefined
            */
            staggerItemSelector: undefined,
            /**
            * @name dxDeferRenderingOptions.onRendered
            * @extends Action
            * @action
            */
            onRendered: null,
            /**
            * @name dxDeferRenderingOptions.onShown
            * @extends Action
            * @action
            */
            onShown: null
        });
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _init: function() {
        this.transitionExecutor = new TransitionExecutorModule.TransitionExecutor();

        this._initElement();
        this._initRender();

        this._$initialContent = this.$element().clone().contents();

        this._initActions();
        this.callBase();
    },

    _initElement: function() {
        this.$element()
            .addClass(DEFER_RENDERING_CLASS);
    },

    _initRender: function() {
        const that = this;
        const $element = this.$element();
        const renderWhen = this.option('renderWhen');

        const doRender = function() {
            return that._renderDeferredContent();
        };

        if(isPromise(renderWhen)) {
            deferredUtils.fromPromise(renderWhen).done(doRender);
        } else {
            $element.data('dx-render-delegate', doRender);
            if(renderWhen === undefined) {
                $element.addClass(PENDING_RENDERING_MANUAL_CLASS);
            }
        }
    },

    _initActions: function() {
        this._actions = {};

        each(ACTIONS, (function(_, action) {
            this._actions[action] = this._createActionByOption(action) || commonUtils.noop;
        }).bind(this));
    },


    _initMarkup: function() {
        this.callBase();

        if(!this._initContent) {
            this._initContent = this._renderContent;
            this._renderContent = function() {};
        }

        this._initContent();
    },

    _renderContentImpl: function() {
        this.$element().removeClass(WIDGET_CLASS);
        this.$element().append(this._$initialContent);
        this._setLoadingState();
    },

    _renderDeferredContent: function() {
        const that = this;
        const $element = this.$element();
        const result = new Deferred();

        $element.removeClass(PENDING_RENDERING_MANUAL_CLASS);
        $element.addClass(PENDING_RENDERING_ACTIVE_CLASS);

        this._abortRenderTask();
        this._renderTask = commonUtils.executeAsync(function() {
            that._renderImpl()
                .done(function() {
                    const shownArgs = { element: $element };
                    that._actions.onShown([shownArgs]);
                    result.resolve(shownArgs);
                })
                .fail(function() {
                    result.rejectWith(result, arguments);
                });
        });

        return result.promise();
    },

    _isElementInViewport: function(element) {
        const rect = element.getBoundingClientRect();

        return rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= (window.innerHeight || domAdapter.getDocumentElement().clientHeight) &&
            rect.left <= (window.innerWidth || domAdapter.getDocumentElement().clientWidth);
    },

    _animate: function() {
        const that = this;
        const $element = this.$element();
        const animation = windowUtils.hasWindow() && this.option('animation');
        const staggerItemSelector = this.option('staggerItemSelector');
        let animatePromise;

        that.transitionExecutor.stop();

        if(animation) {
            if(staggerItemSelector) {
                $element.find(staggerItemSelector).each(function() {
                    if(that._isElementInViewport(this)) {
                        that.transitionExecutor.enter($(this), animation);
                    }
                });
            } else {
                that.transitionExecutor.enter($element, animation);
            }
            animatePromise = that.transitionExecutor.start();
        } else {
            animatePromise = new Deferred().resolve().promise();
        }

        return animatePromise;
    },

    _renderImpl: function() {
        const $element = this.$element();
        const renderedArgs = {
            element: $element
        };

        const contentTemplate = this._getTemplate(this._templateManager.anonymousTemplateName);

        if(contentTemplate) {
            contentTemplate.render({
                container: $element.empty(),
                noModel: true
            });
        }

        this._setRenderedState($element);
        eventsEngine.trigger($element, 'dxcontentrendered');
        this._actions.onRendered([renderedArgs]);
        this._isRendered = true;

        return this._animate();
    },

    _setLoadingState: function() {
        const $element = this.$element();
        const hasCustomLoadIndicator = !!$element.find('.' + VISIBLE_WHILE_PENDING_RENDERING_CLASS).length;

        $element.addClass(PENDING_RENDERING_CLASS);
        if(!hasCustomLoadIndicator) {
            $element.children().addClass(INVISIBLE_WHILE_PENDING_RENDERING_CLASS);
        }

        if(this.option('showLoadIndicator')) {
            this._showLoadIndicator($element);
        }
    },

    _showLoadIndicator: function($container) {
        this._$loadIndicator = new LoadIndicator($('<div>'), { visible: true }).$element()
            .addClass(DEFER_DEFER_RENDERING_LOAD_INDICATOR);

        $('<div>')
            .addClass(LOADINDICATOR_CONTAINER_CLASS)
            .addClass(DEFER_RENDERING_LOADINDICATOR_CONTAINER_CLASS)
            .append(this._$loadIndicator)
            .appendTo($container);
    },

    _setRenderedState: function() {
        const $element = this.$element();

        if(this._$loadIndicator) {
            this._$loadIndicator.remove();
        }

        $element.removeClass(PENDING_RENDERING_CLASS);
        $element.removeClass(PENDING_RENDERING_ACTIVE_CLASS);

        domUtils.triggerShownEvent($element.children());
    },

    _optionChanged: function(args) {
        const value = args.value;
        const previousValue = args.previousValue;

        switch(args.name) {
            case 'renderWhen':
                if(previousValue === false && value === true) {
                    this._renderOrAnimate();
                } else if(previousValue === true && value === false) {
                    this.transitionExecutor.stop();
                    this._setLoadingState();
                }
                break;
            case 'showLoadIndicator':
            case 'onRendered':
            case 'onShown':
                break;
            default:
                this.callBase(args);
        }
    },

    _renderOrAnimate: function() {
        let result;

        if(this._isRendered) {
            this._setRenderedState();
            result = this._animate();
        } else {
            result = this._renderDeferredContent();
        }

        return result;
    },

    renderContent: function() {
        return this._renderOrAnimate();
    },

    _abortRenderTask: function() {
        if(this._renderTask) {
            this._renderTask.abort();
            this._renderTask = undefined;
        }
    },

    _dispose: function() {
        this.transitionExecutor.stop(true);
        this._abortRenderTask();
        this._actions = undefined;
        this._$initialContent = undefined;
        this.callBase();
    }

});

registerComponent('dxDeferRendering', DeferRendering);

module.exports = DeferRendering;

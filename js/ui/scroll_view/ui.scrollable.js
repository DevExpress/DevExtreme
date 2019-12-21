import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import support from '../../core/utils/support';
import browser from '../../core/utils/browser';
import commonUtils from '../../core/utils/common';
import typeUtils from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { getPublicElement } from '../../core/utils/dom';
import windowUtils from '../../core/utils/window';
import domAdapter from '../../core/dom_adapter';
import devices from '../../core/devices';
import registerComponent from '../../core/component_registrator';
import DOMComponent from '../../core/dom_component';
import selectors from '../widget/selectors';
import eventUtils from '../../events/utils';
import scrollEvents from './ui.events.emitter.gesture.scroll';
import simulatedStrategy from './ui.scrollable.simulated';
import NativeStrategy from './ui.scrollable.native';
import { when } from '../../core/utils/deferred';

const SCROLLABLE = 'dxScrollable';
const SCROLLABLE_STRATEGY = 'dxScrollableStrategy';
const SCROLLABLE_CLASS = 'dx-scrollable';
const SCROLLABLE_DISABLED_CLASS = 'dx-scrollable-disabled';
const SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
const SCROLLABLE_WRAPPER_CLASS = 'dx-scrollable-wrapper';
const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';
const SCROLLABLE_CUSTOMIZABLE_SCROLLBARS_CLASS = 'dx-scrollable-customizable-scrollbars';
const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal';
const BOTH = 'both';

var deviceDependentOptions = function() {
    return [{
        device: function() {
            return !support.nativeScrolling;
        },
        options: {
            useNative: false
        }
    }, {
        device: function(device) {
            return !devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic';
        },
        options: {
            bounceEnabled: false,

            scrollByThumb: true,

            scrollByContent: support.touch,

            showScrollbar: 'onHover'
        }
    }];
};

var Scrollable = DOMComponent.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            disabled: false,
            onScroll: null,

            direction: VERTICAL,

            showScrollbar: 'onScroll',

            useNative: true,

            bounceEnabled: true,

            scrollByContent: true,

            scrollByThumb: false,

            onUpdated: null,

            onStart: null,
            onEnd: null,

            onBounce: null,
            onStop: null,

            useSimulatedScrollbar: false,
            useKeyboard: true,

            inertiaEnabled: true,

            pushBackValue: 0,

            updateManually: false
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat(deviceDependentOptions(), [
            {
                device: function() {
                    return support.nativeScrolling && devices.real().platform === 'android' && !browser.mozilla;
                },
                options: {
                    useSimulatedScrollbar: true
                }
            },
            {
                device: function() {
                    return devices.real().platform === 'ios';
                },
                options: {
                    pushBackValue: 1
                }
            }
        ]);
    },

    _initOptions: function(options) {
        this.callBase(options);
        if(!('useSimulatedScrollbar' in options)) {
            this._setUseSimulatedScrollbar();
        }
    },

    _setUseSimulatedScrollbar: function() {
        if(!this.initialOption('useSimulatedScrollbar')) {
            this.option('useSimulatedScrollbar', !this.option('useNative'));
        }
    },

    _init: function() {
        this.callBase();
        this._initScrollableMarkup();
        this._locked = false;
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this.update();
            this._updateRtlPosition();
            this._savedScrollOffset && this.scrollTo(this._savedScrollOffset);
            delete this._savedScrollOffset;
        } else {
            this._savedScrollOffset = this.scrollOffset();
        }
    },

    _initScrollableMarkup: function() {
        var $element = this.$element().addClass(SCROLLABLE_CLASS),
            $container = this._$container = $('<div>').addClass(SCROLLABLE_CONTAINER_CLASS),
            $wrapper = this._$wrapper = $('<div>').addClass(SCROLLABLE_WRAPPER_CLASS),
            $content = this._$content = $('<div>').addClass(SCROLLABLE_CONTENT_CLASS);

        if(domAdapter.hasDocumentProperty('onbeforeactivate') && browser.msie && browser.version < 12) {
            eventsEngine.on($element, eventUtils.addNamespace('beforeactivate', SCROLLABLE), function(e) {
                if(!$(e.target).is(selectors.focusable)) {
                    e.preventDefault();
                }
            });
        }

        $content.append($element.contents()).appendTo($container);
        $container.appendTo($wrapper);
        $wrapper.appendTo($element);
    },

    _dimensionChanged: function() {
        this.update();
    },

    _attachNativeScrollbarsCustomizationCss: function() {
        // NOTE: Customize native scrollbars for dashboard team

        if(devices.real().deviceType === 'desktop' && !(windowUtils.getNavigator().platform.indexOf('Mac') > -1 && browser['webkit'])) {
            this.$element().addClass(SCROLLABLE_CUSTOMIZABLE_SCROLLBARS_CLASS);
        }
    },

    _initMarkup: function() {
        this.callBase();
        this._renderDirection();
    },

    _render: function() {
        this._renderStrategy();
        this._attachNativeScrollbarsCustomizationCss();

        this._attachEventHandlers();
        this._renderDisabledState();
        this._createActions();
        this.update();

        this.callBase();
        this._updateRtlPosition();
    },

    _updateRtlPosition: function() {
        this._updateBounds();
        if(this.option('rtlEnabled') && this.option('direction') !== VERTICAL) {
            commonUtils.deferUpdate(() => {
                const containerElement = this._container().get(0);
                const maxLeftOffset = containerElement.scrollWidth - containerElement.clientWidth;
                commonUtils.deferRender(() => {
                    this.scrollTo({ left: maxLeftOffset });
                });
            });
        }
    },

    _updateBounds: function() {
        this._strategy.updateBounds();
    },

    _attachEventHandlers: function() {
        var strategy = this._strategy;

        var initEventData = {
            getDirection: strategy.getDirection.bind(strategy),
            validate: this._validate.bind(this),
            isNative: this.option('useNative'),
            scrollTarget: this._$container
        };

        eventsEngine.off(this._$wrapper, '.' + SCROLLABLE);
        eventsEngine.on(this._$wrapper, eventUtils.addNamespace(scrollEvents.init, SCROLLABLE), initEventData, this._initHandler.bind(this));
        eventsEngine.on(this._$wrapper, eventUtils.addNamespace(scrollEvents.start, SCROLLABLE), strategy.handleStart.bind(strategy));
        eventsEngine.on(this._$wrapper, eventUtils.addNamespace(scrollEvents.move, SCROLLABLE), strategy.handleMove.bind(strategy));
        eventsEngine.on(this._$wrapper, eventUtils.addNamespace(scrollEvents.end, SCROLLABLE), strategy.handleEnd.bind(strategy));
        eventsEngine.on(this._$wrapper, eventUtils.addNamespace(scrollEvents.cancel, SCROLLABLE), strategy.handleCancel.bind(strategy));
        eventsEngine.on(this._$wrapper, eventUtils.addNamespace(scrollEvents.stop, SCROLLABLE), strategy.handleStop.bind(strategy));

        eventsEngine.off(this._$container, '.' + SCROLLABLE);
        eventsEngine.on(this._$container, eventUtils.addNamespace('scroll', SCROLLABLE), strategy.handleScroll.bind(strategy));
    },

    _validate: function(e) {
        if(this._isLocked()) {
            return false;
        }

        this._updateIfNeed();

        return this._strategy.validate(e);
    },

    _initHandler: function() {
        var strategy = this._strategy;
        strategy.handleInit.apply(strategy, arguments);
    },

    _renderDisabledState: function() {
        this.$element().toggleClass(SCROLLABLE_DISABLED_CLASS, this.option('disabled'));

        if(this.option('disabled')) {
            this._lock();
        } else {
            this._unlock();
        }
    },

    _renderDirection: function() {
        this.$element()
            .removeClass('dx-scrollable-' + HORIZONTAL)
            .removeClass('dx-scrollable-' + VERTICAL)
            .removeClass('dx-scrollable-' + BOTH)
            .addClass('dx-scrollable-' + this.option('direction'));
    },

    _renderStrategy: function() {
        this._createStrategy();
        this._strategy.render();
        this.$element().data(SCROLLABLE_STRATEGY, this._strategy);
    },

    _createStrategy: function() {
        this._strategy = (this.option('useNative'))
            ? new NativeStrategy(this)
            : new simulatedStrategy.SimulatedStrategy(this);
    },

    _createActions: function() {
        this._strategy && this._strategy.createActions();
    },

    _clean: function() {
        this._strategy && this._strategy.dispose();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'onStart':
            case 'onEnd':
            case 'onStop':
            case 'onUpdated':
            case 'onScroll':
            case 'onBounce':
                this._createActions();
                break;
            case 'direction':
                this._resetInactiveDirection();
                this._invalidate();
                break;
            case 'useNative':
                this._setUseSimulatedScrollbar();
                this._invalidate();
                break;
            case 'inertiaEnabled':
            case 'scrollByContent':
            case 'scrollByThumb':
            case 'bounceEnabled':
            case 'useKeyboard':
            case 'showScrollbar':
            case 'useSimulatedScrollbar':
            case 'pushBackValue':
                this._invalidate();
                break;
            case 'disabled':
                this._renderDisabledState();
                this._strategy && this._strategy.disabledChanged();
                break;
            case 'updateManually':
                break;
            case 'width':
                this.callBase(args);
                this._updateRtlPosition();
                break;
            default:
                this.callBase(args);
        }
    },

    _resetInactiveDirection: function() {
        var inactiveProp = this._getInactiveProp();
        if(!inactiveProp || !windowUtils.hasWindow()) {
            return;
        }

        var scrollOffset = this.scrollOffset();
        scrollOffset[inactiveProp] = 0;
        this.scrollTo(scrollOffset);
    },

    _getInactiveProp: function() {
        var direction = this.option('direction');
        if(direction === VERTICAL) {
            return 'left';
        }
        if(direction === HORIZONTAL) {
            return 'top';
        }
    },

    _location: function() {
        return this._strategy.location();
    },

    _normalizeLocation: function(location) {
        if(typeUtils.isPlainObject(location)) {
            var left = commonUtils.ensureDefined(location.left, location.x);
            var top = commonUtils.ensureDefined(location.top, location.y);
            return {
                left: typeUtils.isDefined(left) ? -left : undefined,
                top: typeUtils.isDefined(top) ? -top : undefined
            };
        } else {
            var direction = this.option('direction');
            return {
                left: direction !== VERTICAL ? -location : undefined,
                top: direction !== HORIZONTAL ? -location : undefined
            };
        }
    },

    _isLocked: function() {
        return this._locked;
    },

    _lock: function() {
        this._locked = true;
    },

    _unlock: function() {
        if(!this.option('disabled')) {
            this._locked = false;
        }
    },

    _isDirection: function(direction) {
        var current = this.option('direction');
        if(direction === VERTICAL) {
            return current !== HORIZONTAL;
        }
        if(direction === HORIZONTAL) {
            return current !== VERTICAL;
        }
        return current === direction;
    },

    _updateAllowedDirection: function() {
        var allowedDirections = this._strategy._allowedDirections();

        if(this._isDirection(BOTH) && allowedDirections.vertical && allowedDirections.horizontal) {
            this._allowedDirectionValue = BOTH;
        } else if(this._isDirection(HORIZONTAL) && allowedDirections.horizontal) {
            this._allowedDirectionValue = HORIZONTAL;
        } else if(this._isDirection(VERTICAL) && allowedDirections.vertical) {
            this._allowedDirectionValue = VERTICAL;
        } else {
            this._allowedDirectionValue = null;
        }
    },

    _allowedDirection: function() {
        return this._allowedDirectionValue;
    },

    _container: function() {
        return this._$container;
    },

    $content: function() {
        return this._$content;
    },

    content: function() {
        return getPublicElement(this._$content);
    },

    scrollOffset: function() {
        var location = this._location();
        return {
            top: -location.top,
            left: -location.left
        };
    },

    scrollTop: function() {
        return this.scrollOffset().top;
    },

    scrollLeft: function() {
        return this.scrollOffset().left;
    },

    clientHeight: function() {
        return this._$container.height();
    },

    scrollHeight: function() {
        return this.$content().outerHeight() - 2 * this._strategy.verticalOffset();
    },

    clientWidth: function() {
        return this._$container.width();
    },

    scrollWidth: function() {
        return this.$content().outerWidth();
    },

    update: function() {
        if(!this._strategy) {
            return;
        }
        return when(this._strategy.update()).done((function() {
            this._updateAllowedDirection();
        }).bind(this));
    },

    scrollBy: function(distance) {
        distance = this._normalizeLocation(distance);

        if(!distance.top && !distance.left) {
            return;
        }

        this._updateIfNeed();
        this._strategy.scrollBy(distance);
    },

    scrollTo: function(targetLocation) {
        targetLocation = this._normalizeLocation(targetLocation);

        this._updateIfNeed();

        var location = this._location();

        if(!this.option('useNative')) {
            targetLocation = this._strategy._applyScaleRatio(targetLocation);
            location = this._strategy._applyScaleRatio(location);
        }

        var distance = this._normalizeLocation({
            left: location.left - commonUtils.ensureDefined(targetLocation.left, location.left),
            top: location.top - commonUtils.ensureDefined(targetLocation.top, location.top)
        });

        if(!distance.top && !distance.left) {
            return;
        }

        this._strategy.scrollBy(distance);
    },

    scrollToElement: function(element, offset) {
        var $element = $(element);
        var elementInsideContent = this.$content().find(element).length;
        var elementIsInsideContent = ($element.parents('.' + SCROLLABLE_CLASS).length - $element.parents('.' + SCROLLABLE_CONTENT_CLASS).length) === 0;
        if(!elementInsideContent || !elementIsInsideContent) {
            return;
        }

        var scrollPosition = { top: 0, left: 0 };
        var direction = this.option('direction');

        if(direction !== VERTICAL) {
            scrollPosition.left = this.getScrollElementPosition($element, HORIZONTAL, offset);
        }
        if(direction !== HORIZONTAL) {
            scrollPosition.top = this.getScrollElementPosition($element, VERTICAL, offset);
        }

        this.scrollTo(scrollPosition);
    },

    getScrollElementPosition: function($element, direction, offset) {
        offset = offset || {};
        var isVertical = direction === VERTICAL;
        var startOffset = (isVertical ? offset.top : offset.left) || 0;
        var endOffset = (isVertical ? offset.bottom : offset.right) || 0;
        var pushBackOffset = isVertical ? this._strategy.verticalOffset() : 0;
        var elementPositionRelativeToContent = this._elementPositionRelativeToContent($element, isVertical ? 'top' : 'left');
        var elementPosition = elementPositionRelativeToContent - pushBackOffset;
        var elementSize = $element[isVertical ? 'outerHeight' : 'outerWidth']();
        var scrollLocation = (isVertical ? this.scrollTop() : this.scrollLeft());
        var clientSize = (isVertical ? this.clientHeight() : this.clientWidth());

        var startDistance = scrollLocation - elementPosition + startOffset;
        var endDistance = scrollLocation - elementPosition - elementSize + clientSize - endOffset;

        if(startDistance <= 0 && endDistance >= 0) {
            return scrollLocation;
        }

        return scrollLocation - (Math.abs(startDistance) > Math.abs(endDistance) ? endDistance : startDistance);
    },

    _elementPositionRelativeToContent: function($element, prop) {
        var result = 0;
        while(this._hasScrollContent($element)) {
            result += $element.position()[prop];
            $element = $element.offsetParent();
        }
        return result;
    },

    _hasScrollContent: function($element) {
        var $content = this.$content();
        return $element.closest($content).length && !$element.is($content);
    },

    _updateIfNeed: function() {
        if(!this.option('updateManually')) {
            this.update();
        }
    }
});

registerComponent(SCROLLABLE, Scrollable);

module.exports = Scrollable;

module.exports.deviceDependentOptions = deviceDependentOptions;

const $ = require('../core/renderer');
const eventsEngine = require('../events/core/events_engine');
const devices = require('../core/devices');
const extend = require('../core/utils/extend').extend;
const inkRipple = require('./widget/utils.ink_ripple');
const registerComponent = require('../core/component_registrator');
const Editor = require('./editor/editor');
const eventUtils = require('../events/utils');
const feedbackEvents = require('../events/core/emitter.feedback');
const themes = require('./themes');
const fx = require('../animation/fx');
const messageLocalization = require('../localization/message');
const clickEvent = require('../events/click');
const Swipeable = require('../events/gesture/swipeable');
const Deferred = require('../core/utils/deferred').Deferred;

const SWITCH_CLASS = 'dx-switch';
const SWITCH_WRAPPER_CLASS = SWITCH_CLASS + '-wrapper';
const SWITCH_CONTAINER_CLASS = SWITCH_CLASS + '-container';
const SWITCH_INNER_CLASS = SWITCH_CLASS + '-inner';
const SWITCH_HANDLE_CLASS = SWITCH_CLASS + '-handle';
const SWITCH_ON_VALUE_CLASS = SWITCH_CLASS + '-on-value';
const SWITCH_ON_CLASS = SWITCH_CLASS + '-on';
const SWITCH_OFF_CLASS = SWITCH_CLASS + '-off';

const SWITCH_ANIMATION_DURATION = 100;

const Switch = Editor.inherit({
    _supportedKeys: function() {
        const isRTL = this.option('rtlEnabled');

        const click = function(e) {
            e.preventDefault();
            this._clickAction({ event: e });
        };
        const move = function(value, e) {
            e.preventDefault();
            e.stopPropagation();
            this._animateValue(value);
        };
        return extend(this.callBase(), {
            space: click,
            enter: click,
            leftArrow: move.bind(this, isRTL ? true : false),
            rightArrow: move.bind(this, isRTL ? false : true)
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            hoverStateEnabled: true,

            activeStateEnabled: true,

            switchedOnText: this._getLocalizationMessage('On'),

            switchedOffText: this._getLocalizationMessage('Off'),

            value: false,

            useInkRipple: false,
            _animateHandle: true

        });
    },

    _defaultOptionsRules: function() {
        const themeName = themes.current();

        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            },
            {
                device: function(device) {
                    return themes.isIos7(themeName);
                },
                options: {
                    _animateHandle: false
                }
            },
        ]);
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            onText: { since: '18.2', alias: 'switchedOnText' },

            offText: { since: '18.2', alias: 'switchedOffText' }
        });
    },

    _getLocalizationMessage: function(state) {
        // todo: remove this method when deprecated dxSwitchOptions.switchedOnText/switchedOffText will be removed
        const newMessage = messageLocalization.format('dxSwitch-switched' + state + 'Text');
        const oldMessage = messageLocalization.format('dxSwitch-' + state.toLowerCase() + 'Text');

        return newMessage || oldMessage;
    },

    _feedbackHideTimeout: 0,
    _animating: false,

    _initMarkup: function() {
        this._renderContainers();
        this.option('useInkRipple') && this._renderInkRipple();

        this.$element()
            .addClass(SWITCH_CLASS)
            .append(this._$switchWrapper);

        this._renderSubmitElement();

        this._renderClick();

        this.setAria('role', 'button');

        this._renderSwipeable();

        this.callBase();

        this._renderSwitchInner();
        this._renderLabels();
        this._renderValue();
    },

    _getInnerOffset: function(value, offset) {
        const ratio = (offset - this._offsetDirection() * Number(!value)) / 2;
        return 100 * ratio + '%';
    },

    _getHandleOffset: function(value, offset) {
        if(this.option('rtlEnabled')) {
            value = !value;
        }

        if(value) {
            const calcValue = -100 + 100 * (-offset);
            return calcValue + '%';
        } else {
            return 100 * (-offset) + '%';
        }
    },

    _renderSwitchInner: function() {
        this._$switchInner = $('<div>')
            .addClass(SWITCH_INNER_CLASS)
            .appendTo(this._$switchContainer);

        this._$handle = $('<div>')
            .addClass(SWITCH_HANDLE_CLASS)
            .appendTo(this._$switchInner);
    },

    _renderLabels: function() {
        this._$labelOn = $('<div>')
            .addClass(SWITCH_ON_CLASS)
            .prependTo(this._$switchInner);

        this._$labelOff = $('<div>')
            .addClass(SWITCH_OFF_CLASS)
            .appendTo(this._$switchInner);

        this._setLabelsText();
    },

    _renderContainers: function() {
        this._$switchContainer = $('<div>')
            .addClass(SWITCH_CONTAINER_CLASS);

        this._$switchWrapper = $('<div>')
            .addClass(SWITCH_WRAPPER_CLASS)
            .append(this._$switchContainer);
    },

    _renderSwipeable: function() {
        this._createComponent(this.$element(), Swipeable, {
            elastic: false,
            immediate: true,
            onStart: this._swipeStartHandler.bind(this),
            onUpdated: this._swipeUpdateHandler.bind(this),
            onEnd: this._swipeEndHandler.bind(this),
            itemSizeFunc: this._getItemSizeFunc.bind(this)
        });
    },

    _getItemSizeFunc: function() {
        return this._$switchContainer.outerWidth(true) - this._$handle.get(0).getBoundingClientRect().width;
    },

    _renderSubmitElement: function() {
        this._$submitElement = $('<input>')
            .attr('type', 'hidden')
            .appendTo(this.$element());
    },

    _getSubmitElement: function() {
        return this._$submitElement;
    },

    _renderInkRipple: function() {
        this._inkRipple = inkRipple.render({
            waveSizeCoefficient: 1.7,
            isCentered: true,
            useHoldAnimation: false,
            wavesNumber: 2
        });
    },

    _renderInkWave: function(element, dxEvent, doRender, waveIndex) {
        if(!this._inkRipple) {
            return;
        }

        const config = {
            element: element,
            event: dxEvent,
            wave: waveIndex
        };

        if(doRender) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
    },

    _updateFocusState: function(e, value) {
        this.callBase.apply(this, arguments);
        this._renderInkWave(this._$handle, e, value, 0);
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);
        this._renderInkWave(this._$handle, e, value, 1);
    },

    _offsetDirection: function() {
        return this.option('rtlEnabled') ? -1 : 1;
    },

    _renderPosition: function(state, swipeOffset) {
        const innerOffset = this._getInnerOffset(state, swipeOffset);
        const handleOffset = this._getHandleOffset(state, swipeOffset);

        if(this.option('_animateHandle')) {
            this._$switchInner.css('transform', ' translateX(' + innerOffset + ')');
            this._$handle.css('transform', ' translateX(' + handleOffset + ')');
        }
    },

    _validateValue: function() {
        const check = this.option('value');
        if(typeof check !== 'boolean') {
            this._options['value'] = !!check;
        }
    },

    _renderClick: function() {
        const eventName = eventUtils.addNamespace(clickEvent.name, this.NAME);
        const $element = this.$element();
        this._clickAction = this._createAction(this._clickHandler.bind(this));

        eventsEngine.off($element, eventName);
        eventsEngine.on($element, eventName, (function(e) {
            this._clickAction({ event: e });
        }).bind(this));
    },

    _clickHandler: function(args) {
        const e = args.event;

        this._saveValueChangeEvent(e);

        if(this._animating || this._swiping) {
            return;
        }

        this._animateValue(!this.option('value'));
    },

    _animateValue: function(value) {
        const startValue = this.option('value');
        const endValue = value;

        if(startValue === endValue) {
            return;
        }

        this._animating = true;

        const fromInnerOffset = this._getInnerOffset(startValue, 0);
        const toInnerOffset = this._getInnerOffset(endValue, 0);
        const fromHandleOffset = this._getHandleOffset(startValue, 0);
        const toHandleOffset = this._getHandleOffset(endValue, 0);

        const that = this;
        const fromInnerConfig = {};
        const toInnerConfig = {};
        const fromHandleConfig = {};
        const toHandlerConfig = {};

        fromInnerConfig['transform'] = ' translateX(' + fromInnerOffset + ')';
        toInnerConfig['transform'] = ' translateX(' + toInnerOffset + ')';
        fromHandleConfig['transform'] = ' translateX(' + fromHandleOffset + ')';
        toHandlerConfig['transform'] = ' translateX(' + toHandleOffset + ')';

        this.$element().toggleClass(SWITCH_ON_VALUE_CLASS, endValue);

        fx.animate(this._$handle, {
            from: fromHandleConfig,
            to: toHandlerConfig,
            duration: SWITCH_ANIMATION_DURATION,
        });

        fx.animate(this._$switchInner, {
            from: fromInnerConfig,
            to: toInnerConfig,
            duration: SWITCH_ANIMATION_DURATION,
            complete: function() {
                that._animating = false;
                that.option('value', endValue);
            }
        });
    },

    _swipeStartHandler: function(e) {
        const state = this.option('value');
        const rtlEnabled = this.option('rtlEnabled');
        const maxOffOffset = rtlEnabled ? 0 : 1;
        const maxOnOffset = rtlEnabled ? 1 : 0;

        e.event.maxLeftOffset = state ? maxOffOffset : maxOnOffset;
        e.event.maxRightOffset = state ? maxOnOffset : maxOffOffset;
        this._swiping = true;

        this._feedbackDeferred = new Deferred();
        feedbackEvents.lock(this._feedbackDeferred);
        this._toggleActiveState(this.$element(), this.option('activeStateEnabled'));
    },

    _swipeUpdateHandler: function(e) {
        this._renderPosition(this.option('value'), e.event.offset);
    },

    _swipeEndHandler: function(e) {
        const that = this;
        const offsetDirection = this._offsetDirection();
        const toInnerConfig = {};
        const toHandleConfig = {};

        const innerOffset = this._getInnerOffset(that.option('value'), e.event.targetOffset);
        const handleOffset = this._getHandleOffset(that.option('value'), e.event.targetOffset);

        toInnerConfig['transform'] = ' translateX(' + innerOffset + ')';
        toHandleConfig['transform'] = ' translateX(' + handleOffset + ')';

        fx.animate(this._$handle, {
            to: toHandleConfig,
            duration: SWITCH_ANIMATION_DURATION,
        });

        fx.animate(this._$switchInner, {
            to: toInnerConfig,
            duration: SWITCH_ANIMATION_DURATION,
            complete: function() {
                that._swiping = false;
                const pos = that.option('value') + offsetDirection * e.event.targetOffset;
                that.option('value', Boolean(pos));
                that._feedbackDeferred.resolve();
                that._toggleActiveState(that.$element(), false);
            }
        });
    },

    _renderValue: function() {
        this._validateValue();

        const val = this.option('value');
        this._renderPosition(val, 0);

        this.$element().toggleClass(SWITCH_ON_VALUE_CLASS, val);
        this._getSubmitElement().val(val);
        this.setAria({
            'pressed': val,
            'label': val ? this.option('switchedOnText') : this.option('switchedOffText')
        });
    },

    _setLabelsText: function() {
        this._$labelOn && this._$labelOn.text(this.option('switchedOnText'));
        this._$labelOff && this._$labelOff.text(this.option('switchedOffText'));
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this.repaint();
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'useInkRipple':
                this._invalidate();
                break;
            case 'width':
                delete this._marginBound;
                this._refresh();
                break;
            case 'switchedOnText':
            case 'switchedOffText':
                this._setLabelsText();
                break;
            case 'value':
                this._renderValue();
                this.callBase(args);
                break;
            case '_animateHandle':
                break;
            default:
                this.callBase(args);
        }
    },

    _clean: function() {
        delete this._inkRipple;
        this.callBase();
    }
});

registerComponent('dxSwitch', Switch);

module.exports = Switch;

import $ from '../core/renderer';
import { getWindow, hasWindow } from '../core/utils/window';
const window = getWindow();
import { getPublicElement } from '../core/element';
import domAdapter from '../core/dom_adapter';
import eventsEngine from '../events/core/events_engine';
import registerComponent from '../core/component_registrator';
import { noop, pairToObject } from '../core/utils/common';
import { extend } from '../core/utils/extend';
import { move } from '../animation/translator';
import positionUtils from '../animation/position';
import { isObject, isString } from '../core/utils/type';
import { fitIntoRange } from '../core/utils/math';
import { addNamespace } from '../events/utils/index';
import Popup from './popup';
import { getBoundingRect } from '../core/utils/position';

// STYLE popover

const POPOVER_CLASS = 'dx-popover';
const POPOVER_WRAPPER_CLASS = 'dx-popover-wrapper';
const POPOVER_ARROW_CLASS = 'dx-popover-arrow';
const POPOVER_WITHOUT_TITLE_CLASS = 'dx-popover-without-title';

const POSITION_FLIP_MAP = {
    'left': 'right',
    'top': 'bottom',
    'right': 'left',
    'bottom': 'top',
    'center': 'center'
};

const WEIGHT_OF_SIDES = {
    'left': -1,
    'top': -1,
    'center': 0,
    'right': 1,
    'bottom': 1
};

const POSITION_ALIASES = {
    // NOTE: public API
    'top': { my: 'bottom center', at: 'top center', collision: 'fit flip' },
    'bottom': { my: 'top center', at: 'bottom center', collision: 'fit flip' },
    'right': { my: 'left center', at: 'right center', collision: 'flip fit' },
    'left': { my: 'right center', at: 'left center', collision: 'flip fit' }
};

const SIDE_BORDER_WIDTH_STYLES = {
    'left': 'borderLeftWidth',
    'top': 'borderTopWidth',
    'right': 'borderRightWidth',
    'bottom': 'borderBottomWidth'
};

const getEventNameByOption = function(optionValue) {
    return isObject(optionValue) ? optionValue.name : optionValue;
};
const getEventName = function(that, optionName) {
    const optionValue = that.option(optionName);

    return getEventNameByOption(optionValue);
};
const getEventDelay = function(that, optionName) {
    const optionValue = that.option(optionName);

    return isObject(optionValue) && optionValue.delay;
};
const attachEvent = function(that, name) {
    const target = that.option('target');
    const isSelector = isString(target);
    const event = getEventName(that, name + 'Event');

    if(!event || that.option('disabled')) {
        return;
    }

    const eventName = addNamespace(event, that.NAME);
    const action = that._createAction((function() {
        const delay = getEventDelay(that, name + 'Event');
        this._clearEventsTimeouts();

        if(delay) {
            this._timeouts[name] = setTimeout(function() {
                that[name]();
            }, delay);
        } else {
            that[name]();
        }
    }).bind(that), { validatingTargetName: 'target' });

    const handler = function(e) {
        action({ event: e, target: $(e.currentTarget) });
    };

    const EVENT_HANDLER_NAME = '_' + name + 'EventHandler';
    if(isSelector) {
        that[EVENT_HANDLER_NAME] = handler;
        eventsEngine.on(domAdapter.getDocument(), eventName, target, handler);
    } else {
        const targetElement = getPublicElement($(target));
        that[EVENT_HANDLER_NAME] = undefined;
        eventsEngine.on(targetElement, eventName, handler);
    }
};
const detachEvent = function(that, target, name, event) {
    let eventName = event || getEventName(that, name + 'Event');

    if(!eventName) {
        return;
    }

    eventName = addNamespace(eventName, that.NAME);

    const EVENT_HANDLER_NAME = '_' + name + 'EventHandler';
    if(that[EVENT_HANDLER_NAME]) {
        eventsEngine.off(domAdapter.getDocument(), eventName, target, that[EVENT_HANDLER_NAME]);
    } else {
        eventsEngine.off(getPublicElement($(target)), eventName);
    }
};


const Popover = Popup.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            target: window,

            shading: false,

            position: 'bottom',

            closeOnOutsideClick: true,

            animation: {
                show: {
                    type: 'fade',
                    from: 0,
                    to: 1
                },
                hide: {
                    type: 'fade',
                    to: 0
                }
            },

            showTitle: false,

            width: 'auto',

            height: 'auto',

            /**
             * @name dxPopoverOptions.dragEnabled
             * @hidden
             */
            dragEnabled: false,

            /**
            * @name dxPopoverOptions.resizeEnabled
            * @hidden
            */
            resizeEnabled: false,

            /**
            * @name dxPopoverOptions.onResizeStart
            * @extends Action
            * @action
            * @hidden
            */

            /**
            * @name dxPopoverOptions.onResize
            * @extends Action
            * @action
            * @hidden
            */

            /**
            * @name dxPopoverOptions.onResizeEnd
            * @extends Action
            * @action
            * @hidden
            */

            /**
            * @name dxPopoverOptions.fullScreen
            * @hidden
            */

            /**
            * @name dxPopoverOptions.showEvent.name
            * @type string
            * @default undefined
            */
            /**
            * @name dxPopoverOptions.showEvent.delay
            * @type number
            * @default undefined
            */

            /**
            * @name dxPopoverOptions.hideEvent.name
            * @type string
            * @default undefined
            */
            /**
            * @name dxPopoverOptions.hideEvent.delay
            * @type number
            * @default undefined
            */

            fullScreen: false,
            closeOnTargetScroll: true,
            arrowPosition: '',
            arrowOffset: 0,
            boundaryOffset: { h: 10, v: 10 },
            _fixedPosition: true

            /**
            * @name dxPopoverOptions.focusStateEnabled
            * @hidden
            */

            /**
            * @name dxPopoverOptions.accessKey
            * @hidden
            */

            /**
            * @name dxPopoverOptions.tabIndex
            * @hidden
            */
        });
    },

    _defaultOptionsRules: function() {
        return [
            {
                device: { platform: 'ios' },
                options: {
                    arrowPosition: {
                        boundaryOffset: { h: 20, v: -10 },
                        collision: 'fit'
                    }
                }
            }, {
                device: function() {
                    return !hasWindow();
                },
                options: {
                    animation: null
                }
            }
        ];
    },

    _init: function() {
        this.callBase();

        this._renderArrow();
        this._timeouts = {};

        this.$element().addClass(POPOVER_CLASS);
        this._wrapper().addClass(POPOVER_WRAPPER_CLASS);
    },

    _render: function() {
        this.callBase.apply(this, arguments);
        this._detachEvents(this.option('target'));
        this._attachEvents();
    },

    _detachEvents: function(target) {
        detachEvent(this, target, 'show');
        detachEvent(this, target, 'hide');
    },

    _attachEvents: function() {
        attachEvent(this, 'show');
        attachEvent(this, 'hide');
    },

    _renderArrow: function() {
        this._$arrow = $('<div>')
            .addClass(POPOVER_ARROW_CLASS)
            .prependTo(this.overlayContent());
    },

    _documentDownHandler: function(e) {
        if(this._isOutsideClick(e)) {
            return this.callBase(e);
        }
        return true;
    },

    _isOutsideClick: function(e) {
        return !$(e.target).closest(this.option('target')).length;
    },

    _animate: function(animation) {
        if(animation && animation.to && typeof animation.to === 'object') {
            extend(animation.to, {
                position: this._getContainerPosition()
            });
        }

        this.callBase.apply(this, arguments);
    },

    _stopAnimation: function() {
        this.callBase.apply(this, arguments);
    },

    _renderTitle: function() {
        this._wrapper().toggleClass(POPOVER_WITHOUT_TITLE_CLASS, !this.option('showTitle'));
        this.callBase();
    },

    _renderPosition: function() {
        this.callBase();
        this._renderOverlayPosition();
    },

    _renderOverlayBoundaryOffset: noop,

    _renderOverlayPosition: function() {
        this._resetOverlayPosition();
        this._updateContentSize();

        const contentPosition = this._getContainerPosition();
        const resultLocation = positionUtils.setup(this._$content, contentPosition);

        const positionSide = this._getSideByLocation(resultLocation);

        this._togglePositionClass('dx-position-' + positionSide);
        this._toggleFlippedClass(resultLocation.h.flip, resultLocation.v.flip);

        const isArrowVisible = this._isHorizontalSide() || this._isVerticalSide();

        if(isArrowVisible) {
            this._renderArrowPosition(positionSide);
        }
    },

    _resetOverlayPosition: function() {
        this._setContentHeight(true);
        this._togglePositionClass('dx-position-' + this._positionSide);

        move(this._$content, { left: 0, top: 0 });

        this._$arrow.css({
            top: 'auto', right: 'auto', bottom: 'auto', left: 'auto'
        });
    },

    _updateContentSize: function() {
        if(!this._$popupContent) {
            return;
        }

        const containerLocation = positionUtils.calculate(this._$content, this._getContainerPosition());

        if((containerLocation.h.oversize > 0) && this._isHorizontalSide() && !containerLocation.h.fit) {
            const newContainerWidth = this._$content.width() - containerLocation.h.oversize;

            this._$content.width(newContainerWidth);
        }

        if((containerLocation.v.oversize > 0) && this._isVerticalSide() && !containerLocation.v.fit) {
            const newOverlayContentHeight = this._$content.height() - containerLocation.v.oversize;
            const newPopupContentHeight = this._$popupContent.height() - containerLocation.v.oversize;

            this._$content.height(newOverlayContentHeight);
            this._$popupContent.height(newPopupContentHeight);
        }
    },

    _getContainerPosition: function() {
        const offset = pairToObject(this._position.offset || '');
        let hOffset = offset.h;
        let vOffset = offset.v;
        const isVerticalSide = this._isVerticalSide();
        const isHorizontalSide = this._isHorizontalSide();

        if(isVerticalSide || isHorizontalSide) {
            const isPopoverInside = this._isPopoverInside();
            const sign = (isPopoverInside ? -1 : 1) * WEIGHT_OF_SIDES[this._positionSide];
            const arrowSize = isVerticalSide ? this._$arrow.height() : this._$arrow.width();
            const arrowSizeCorrection = this._getContentBorderWidth(this._positionSide);
            const arrowOffset = sign * (arrowSize - arrowSizeCorrection);

            isVerticalSide ? vOffset += arrowOffset : hOffset += arrowOffset;
        }

        return extend({}, this._position, { offset: hOffset + ' ' + vOffset });
    },

    _getContentBorderWidth: function(side) {
        const borderWidth = this._$content.css(SIDE_BORDER_WIDTH_STYLES[side]);
        return parseInt(borderWidth) || 0;
    },

    _getSideByLocation: function(location) {
        const isFlippedByVertical = location.v.flip;
        const isFlippedByHorizontal = location.h.flip;

        return (this._isVerticalSide() && isFlippedByVertical || this._isHorizontalSide() && isFlippedByHorizontal || this._isPopoverInside())
            ? POSITION_FLIP_MAP[this._positionSide]
            : this._positionSide;
    },

    _togglePositionClass: function(positionClass) {
        this._$wrapper
            .removeClass('dx-position-left dx-position-right dx-position-top dx-position-bottom')
            .addClass(positionClass);
    },

    _toggleFlippedClass: function(isFlippedHorizontal, isFlippedVertical) {
        this._$wrapper
            .toggleClass('dx-popover-flipped-horizontal', isFlippedHorizontal)
            .toggleClass('dx-popover-flipped-vertical', isFlippedVertical);
    },

    _renderArrowPosition: function(side) {
        const arrowRect = getBoundingRect(this._$arrow.get(0));
        const arrowFlip = -(this._isVerticalSide(side) ? arrowRect.height : arrowRect.width);
        this._$arrow.css(POSITION_FLIP_MAP[side], arrowFlip);

        const axis = this._isVerticalSide(side) ? 'left' : 'top';
        const sizeProperty = this._isVerticalSide(side) ? 'width' : 'height';
        const $target = $(this._position.of);

        const targetOffset = positionUtils.offset($target) || { top: 0, left: 0 };
        const contentOffset = positionUtils.offset(this._$content);

        const arrowSize = arrowRect[sizeProperty];
        const contentLocation = contentOffset[axis];
        const contentSize = getBoundingRect(this._$content.get(0))[sizeProperty];
        const targetLocation = targetOffset[axis];
        const targetSize = $target.get(0).preventDefault ? 0 : getBoundingRect($target.get(0))[sizeProperty];

        const min = Math.max(contentLocation, targetLocation);
        const max = Math.min(contentLocation + contentSize, targetLocation + targetSize);
        let arrowLocation;
        if(this.option('arrowPosition') === 'start') {
            arrowLocation = min - contentLocation;
        } else if(this.option('arrowPosition') === 'end') {
            arrowLocation = max - contentLocation - arrowSize;
        } else {
            arrowLocation = (min + max) / 2 - contentLocation - arrowSize / 2;
        }

        const borderWidth = this._getContentBorderWidth(side);
        const finalArrowLocation = fitIntoRange(arrowLocation - borderWidth + this.option('arrowOffset'), borderWidth, contentSize - arrowSize - borderWidth * 2);
        this._$arrow.css(axis, finalArrowLocation);
    },

    _isPopoverInside: function() {
        const position = this._transformStringPosition(this.option('position'), POSITION_ALIASES);

        const my = positionUtils.setup.normalizeAlign(position.my);
        const at = positionUtils.setup.normalizeAlign(position.at);

        return my.h === at.h && my.v === at.v;
    },

    _setContentHeight: function(fullUpdate) {
        if(fullUpdate) {
            this.callBase();
        }
    },

    _renderWrapperPosition: function() {
        if(this.option('shading')) {
            this._$wrapper.css({ top: 0, left: 0 });
        }
    },

    _renderWrapperDimensions: function() {
        if(this.option('shading')) {
            this._$wrapper.css({
                width: '100%',
                height: '100%'
            });
        }
    },

    _normalizePosition: function() {
        const position = extend({}, this._transformStringPosition(this.option('position'), POSITION_ALIASES));

        if(!position.of) {
            position.of = this.option('target');
        }

        if(!position.collision) {
            position.collision = 'flip';
        }

        if(!position.boundaryOffset) {
            position.boundaryOffset = this.option('boundaryOffset');
        }

        this._positionSide = this._getDisplaySide(position);

        this._position = position;
    },

    _getDisplaySide: function(position) {
        const my = positionUtils.setup.normalizeAlign(position.my);
        const at = positionUtils.setup.normalizeAlign(position.at);

        const weightSign = WEIGHT_OF_SIDES[my.h] === WEIGHT_OF_SIDES[at.h] && WEIGHT_OF_SIDES[my.v] === WEIGHT_OF_SIDES[at.v] ? -1 : 1;
        const horizontalWeight = Math.abs(WEIGHT_OF_SIDES[my.h] - weightSign * WEIGHT_OF_SIDES[at.h]);
        const verticalWeight = Math.abs(WEIGHT_OF_SIDES[my.v] - weightSign * WEIGHT_OF_SIDES[at.v]);

        return horizontalWeight > verticalWeight ? at.h : at.v;
    },

    _isVerticalSide: function(side) {
        side = side || this._positionSide;
        return side === 'top' || side === 'bottom';
    },

    _isHorizontalSide: function(side) {
        side = side || this._positionSide;
        return side === 'left' || side === 'right';
    },

    _clearEventTimeout: function(name) {
        clearTimeout(this._timeouts[name]);
    },

    _clearEventsTimeouts: function() {
        this._clearEventTimeout('show');
        this._clearEventTimeout('hide');
    },

    _clean: function() {
        this._detachEvents(this.option('target'));
        this.callBase.apply(this, arguments);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'boundaryOffset':
            case 'arrowPosition':
            case 'arrowOffset':
                this._renderGeometry();
                break;
            case 'fullScreen':
                if(args.value) {
                    this.option('fullScreen', false);
                }
                break;
            case 'target':
                args.previousValue && this._detachEvents(args.previousValue);
                this.callBase(args);
                break;
            case 'showEvent':
            case 'hideEvent': {
                const name = args.name.substring(0, 4);
                const event = getEventNameByOption(args.previousValue);

                this.hide();
                detachEvent(this, this.option('target'), name, event);
                attachEvent(this, name);
                break;
            }
            case 'visible':
                this._clearEventTimeout(args.value ? 'show' : 'hide');
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    },

    show: function(target) {
        if(target) {
            this.option('target', target);
        }

        return this.callBase();
    }

    /**
    * @name dxPopoverMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxPopoverMethods.focus
    * @publicName focus()
    * @hidden
    */

});

registerComponent('dxPopover', Popover);

export default Popover;

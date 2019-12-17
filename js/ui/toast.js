// TODOs
// 1. animation

const $ = require('../core/renderer');
const window = require('../core/utils/window').getWindow();
const domAdapter = require('../core/dom_adapter');
const eventsEngine = require('../events/core/events_engine');
const ready = require('../core/utils/ready_callbacks').add;
const commonUtils = require('../core/utils/common');
const typeUtils = require('../core/utils/type');
const extend = require('../core/utils/extend').extend;
const inArray = require('../core/utils/array').inArray;
const pointerEvents = require('../events/pointer');
const registerComponent = require('../core/component_registrator');
const Overlay = require('./overlay');
const themes = require('./themes');

const TOAST_CLASS = 'dx-toast';
const TOAST_CLASS_PREFIX = TOAST_CLASS + '-';
const TOAST_WRAPPER_CLASS = TOAST_CLASS_PREFIX + 'wrapper';
const TOAST_CONTENT_CLASS = TOAST_CLASS_PREFIX + 'content';
const TOAST_MESSAGE_CLASS = TOAST_CLASS_PREFIX + 'message';
const TOAST_ICON_CLASS = TOAST_CLASS_PREFIX + 'icon';

const WIDGET_NAME = 'dxToast';
const toastTypes = ['info', 'warning', 'error', 'success'];

const TOAST_STACK = [];
const FIRST_Z_INDEX_OFFSET = 8000;

let visibleToastInstance = null;

const POSITION_ALIASES = {
    'top': { my: 'top', at: 'top', of: null, offset: '0 0' },
    'bottom': { my: 'bottom', at: 'bottom', of: null, offset: '0 -20' },
    'center': { my: 'center', at: 'center', of: null, offset: '0 0' },
    'right': { my: 'center right', at: 'center right', of: null, offset: '0 0' },
    'left': { my: 'center left', at: 'center left', of: null, offset: '0 0' }
};

ready(function() {
    eventsEngine.subscribeGlobal(domAdapter.getDocument(), pointerEvents.down, function(e) {
        for(let i = TOAST_STACK.length - 1; i >= 0; i--) {
            if(!TOAST_STACK[i]._proxiedDocumentDownHandler(e)) {
                return;
            }
        }
    });
});

/**
* @name dxToast
* @inherits dxOverlay
* @module ui/toast
* @export default
*/
const Toast = Overlay.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxToastOptions.message
            * @type string
            * @default ""
            */
            message: '',

            /**
            * @name dxToastOptions.type
            * @type Enums.ToastType
            * @default 'info'
            */
            type: 'info',

            /**
            * @name dxToastOptions.displayTime
            * @type number
            * @default 2000
            */
            displayTime: 2000,

            /**
            * @name dxToastOptions.position
            * @type positionConfig|string
            * @default "bottom center"
            */
            position: 'bottom center',

            /**
            * @name dxToastOptions.animation
            * @type object
            * @default { show: { type: "fade", duration: 400, from: 0, to: 1 }, hide: { type: "fade", duration: 400, to: 0 } }
            */
            animation: {
                /**
                * @name dxToastOptions.animation.show
                * @type animationConfig
                * @default { type: "fade", duration: 400, from: 0, to: 1 }
                */
                show: {
                    type: 'fade',
                    duration: 400,
                    from: 0,
                    to: 1
                },
                /**
                * @name dxToastOptions.animation.hide
                * @type animationConfig
                * @default { type: "fade", duration: 400, to: 0 }
                */
                hide: {
                    type: 'fade',
                    duration: 400,
                    to: 0
                }
            },

            /**
            * @name dxToastOptions.shading
            * @type boolean
            * @default false
            */
            shading: false,

            /**
            * @name dxToastOptions.disabled
            * @hidden
            */

            /**
            * @name dxToastOptions.width
            * @default function() {return $(window).width() * 0.8 }
            */

            /**
            * @name dxToastOptions.height
            * @default 'auto'
            */
            height: 'auto',

            closeOnBackButton: false,

            /**
            * @name dxToastOptions.closeOnSwipe
            * @type boolean
            * @default true
            */
            closeOnSwipe: true,

            /**
            * @name dxToastOptions.closeOnClick
            * @type boolean
            * @default false
            */
            closeOnClick: false,

            /**
            * @name dxToastOptions.resizeEnabled
            * @hidden
            */
            resizeEnabled: false

            /**
            * @name dxToastOptions.dragEnabled
            * @hidden
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: { platform: 'android' },
                options: {
                    /**
                    * @name dxToastOptions.closeOnOutsideClick
                    * @default true @for Android
                    */
                    closeOnOutsideClick: true,

                    /**
                    * @name dxToastOptions.width
                    * @default 'auto' @for Android
                    */
                    width: 'auto',

                    /**
                    * @name dxToastOptions.position
                    * @default { at: 'bottom left', my: 'bottom left', offset: '20 -20'} @for Android
                    */
                    position: {
                        at: 'bottom left',
                        my: 'bottom left',
                        offset: '20 -20'
                    },

                    /**
                    * @name dxToastOptions.animation
                    * @default {show: {type: 'slide', duration: 200, from: { position: {my: 'top', at: 'bottom', of: window}}}, hide: { type: 'slide', duration: 200, to: { position: {my: 'top', at: 'bottom', of: window}}}} @for Android
                    */
                    animation: {
                        show: {
                            type: 'slide',
                            duration: 200,
                            from: {
                                position: {
                                    my: 'top',
                                    at: 'bottom',
                                    of: window
                                }
                            },
                        },
                        hide: {
                            type: 'slide',
                            duration: 200,
                            to: {
                                position: {
                                    my: 'top',
                                    at: 'bottom',
                                    of: window
                                }
                            },
                        }
                    }
                }
            },
            {
                device: function(device) {
                    const isPhone = device.deviceType === 'phone';
                    const isAndroid = device.platform === 'android';

                    return isPhone && isAndroid;
                },
                options: {
                    /**
                    * @name dxToastOptions.width
                    * @default function() { return $(window).width(); } @for phones_on_Android
                    */
                    width: function() { return $(window).width(); },

                    /**
                    * @name dxToastOptions.position
                    * @default { at: 'bottom center', my: 'bottom center', offset: '0 0' } @for phones_on_Android
                    */
                    position: {
                        at: 'bottom center',
                        my: 'bottom center',
                        offset: '0 0'
                    }
                }
            },
            {
                device: function() {
                    return themes.isMaterial();
                },
                options: {
                    /**
                    * @name dxToastOptions.minWidth
                    * @default 344 @for Material
                    */
                    minWidth: 344,
                    /**
                    * @name dxToastOptions.maxWidth
                    * @default 568 @for Material
                    */
                    maxWidth: 568,
                    /**
                    * @name dxToastOptions.displayTime
                    * @default 4000 @for Material
                    */
                    displayTime: 4000
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();

        this._posStringToObject();
    },

    _renderContentImpl: function() {
        if(this.option('message')) {
            this._message = $('<div>')
                .addClass(TOAST_MESSAGE_CLASS)
                .text(this.option('message'))
                .appendTo(this.$content());
        }

        this.setAria('role', 'alert', this._message);

        if(inArray(this.option('type').toLowerCase(), toastTypes) > -1) {
            this.$content().prepend($('<div>').addClass(TOAST_ICON_CLASS));
        }

        this.callBase();
    },

    _render: function() {
        this.callBase();

        this.$element().addClass(TOAST_CLASS);
        this._wrapper().addClass(TOAST_WRAPPER_CLASS);
        this._$content.addClass(TOAST_CLASS_PREFIX + String(this.option('type')).toLowerCase());
        this.$content().addClass(TOAST_CONTENT_CLASS);

        this._toggleCloseEvents('Swipe');
        this._toggleCloseEvents('Click');
    },

    _renderScrollTerminator: commonUtils.noop,

    _toggleCloseEvents: function(event) {
        const dxEvent = 'dx' + event.toLowerCase();

        eventsEngine.off(this._$content, dxEvent);
        this.option('closeOn' + event) && eventsEngine.on(this._$content, dxEvent, this.hide.bind(this));
    },

    _posStringToObject: function() {
        if(!typeUtils.isString(this.option('position'))) return;

        const verticalPosition = this.option('position').split(' ')[0];
        const horizontalPosition = this.option('position').split(' ')[1];

        this.option('position', extend({}, POSITION_ALIASES[verticalPosition]));

        switch(horizontalPosition) {
            case 'center':
            case 'left':
            case 'right':
                this.option('position').at += ' ' + horizontalPosition;
                this.option('position').my += ' ' + horizontalPosition;
                break;
        }
    },

    _show: function() {
        if(visibleToastInstance && visibleToastInstance !== this) {
            clearTimeout(visibleToastInstance._hideTimeout);
            visibleToastInstance.hide();
        }

        visibleToastInstance = this;

        return this.callBase.apply(this, arguments).done((function() {
            clearTimeout(this._hideTimeout);

            this._hideTimeout = setTimeout(this.hide.bind(this), this.option('displayTime'));
        }).bind(this));
    },

    _hide: function() {
        visibleToastInstance = null;
        return this.callBase.apply(this, arguments);
    },

    _overlayStack: function() {
        return TOAST_STACK;
    },

    _zIndexInitValue: function() {
        return this.callBase() + FIRST_Z_INDEX_OFFSET;
    },

    _dispose: function() {
        clearTimeout(this._hideTimeout);
        visibleToastInstance = null;
        this.callBase();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'type':
                this._$content.removeClass(TOAST_CLASS_PREFIX + args.previousValue);
                this._$content.addClass(TOAST_CLASS_PREFIX + String(args.value).toLowerCase());
                break;
            case 'message':
                if(this._message) {
                    this._message.text(args.value);
                }
                break;
            case 'closeOnSwipe':
                this._toggleCloseEvents('Swipe');
                break;
            case 'closeOnClick':
                this._toggleCloseEvents('Click');
                break;
            case 'displayTime':
            case 'position':
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent(WIDGET_NAME, Toast);

module.exports = Toast;

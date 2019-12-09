var $ = require("../../core/renderer"),
    eventsEngine = require("../../events/core/events_engine"),
    events = require("../../events/"),
    Action = require("../../core/action"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    each = require("../../core/utils/iterator").each,
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    DOMComponentWithTemplate = require("../../core/dom_component_with_template"),
    selectors = require("./selectors"),
    eventUtils = require("../../events/utils");

require("../../events/click");
require("../../events/hover");
require("../../events/core/emitter.feedback");

const { hover, focus, active, dxClick, keyboard } = events;

var WIDGET_CLASS = "dx-widget",
    ACTIVE_STATE_CLASS = "dx-state-active",
    DISABLED_STATE_CLASS = "dx-state-disabled",
    INVISIBLE_STATE_CLASS = "dx-state-invisible",
    HOVER_STATE_CLASS = "dx-state-hover",
    FOCUSED_STATE_CLASS = "dx-state-focused",
    FEEDBACK_SHOW_TIMEOUT = 30,
    FEEDBACK_HIDE_TIMEOUT = 400;

/**
 * @name ui
 * @section utils
 */

/**
* @const dxItem
* @type object
* @section uiWidgetMarkupComponents
*/

/**
* @name Widget
* @type object
* @inherits DOMComponent
* @module ui/widget/ui.widget
* @export default
* @hidden
*/
var Widget = DOMComponentWithTemplate.inherit({

    _supportedKeys: function() {
        return {};
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            /**
             * @name WidgetOptions.disabled
             * @type boolean
             * @default false
             */
            disabled: false,

            /**
             * @name WidgetOptions.visible
             * @type boolean
             * @default true
             */
            visible: true,

            /**
             * @name WidgetOptions.hint
             * @type string
             * @default undefined
             */
            hint: undefined,

            /**
             * @name WidgetOptions.activeStateEnabled
             * @type boolean
             * @default false
             */
            activeStateEnabled: false,

            /**
            * @name WidgetOptions.onContentReady
            * @extends Action
            * @action
            */
            onContentReady: null,

            /**
             * @name WidgetOptions.hoverStateEnabled
             * @type boolean
             * @default false
             */
            hoverStateEnabled: false,

            /**
             * @name WidgetOptions.focusStateEnabled
             * @type boolean
             * @default false
             */
            focusStateEnabled: false,

            /**
             * @name WidgetOptions.tabIndex
             * @type number
             * @default 0
             */
            tabIndex: 0,

            /**
             * @name WidgetOptions.accessKey
             * @type string
             * @default null
             */
            accessKey: null,

            /**
            * @name WidgetOptions.onFocusIn
            * @extends Action
            * @action
            * @hidden
            */
            onFocusIn: null,

            /**
            * @name WidgetOptions.onFocusOut
            * @extends Action
            * @action
            * @hidden
            */
            onFocusOut: null,
            onKeyboardHandled: null,

            /**
            * @name ui.template
            * @type template
            * @namespace DevExpress.ui
            * @deprecated
            */

            /**
            * @name format
            * @type Enums.Format|string|function|Object
            * @type_function_param1 value:number|date
            * @type_function_return string
            * @default undefined
            * @section Common
            */
            /**
            * @name format.type
            * @type Enums.Format
            */
            /**
            * @name format.precision
            * @type number
            */
            /**
            * @name format.currency
            * @type String
            */
            /**
            * @name format.formatter
            * @type function
            * @type_function_param1 value:number|date
            * @type_function_return string
            */
            /**
            * @name format.parser
            * @type function
            * @type_function_param1 value:string
            * @type_function_return number|date
            */
        });
    },

    _feedbackShowTimeout: FEEDBACK_SHOW_TIMEOUT,
    _feedbackHideTimeout: FEEDBACK_HIDE_TIMEOUT,

    _init: function() {
        this.callBase();
        this._initContentReadyAction();
    },

    _clearInnerOptionCache: function(optionContainer) {
        this[optionContainer + "Cache"] = {};
    },

    _cacheInnerOptions: function(optionContainer, optionValue) {
        var cacheName = optionContainer + "Cache";
        this[cacheName] = extend(this[cacheName], optionValue);
    },

    _getOptionsFromContainer: function({ name, fullName, value }) {
        var options = {};

        if(name === fullName) {
            options = value;
        } else {
            var option = fullName.split(".").pop();
            options[option] = value;
        }

        return options;
    },

    _innerOptionChanged: function(innerWidget, args) {
        var options = this._getOptionsFromContainer(args);
        innerWidget && innerWidget.option(options);
        this._cacheInnerOptions(args.name, options);
    },

    _getInnerOptionsCache: function(optionContainer) {
        return this[optionContainer + "Cache"];
    },

    _initInnerOptionCache: function(optionContainer) {
        this._clearInnerOptionCache(optionContainer);
        this._cacheInnerOptions(optionContainer, this.option(optionContainer));
    },

    _bindInnerWidgetOptions: function(innerWidget, optionsContainer) {
        this._setOptionByStealth(optionsContainer, extend({}, innerWidget.option()));
        innerWidget.on("optionChanged", (e) => {
            this._setOptionByStealth(optionsContainer, extend({}, e.component.option()));
        });
    },

    _getAriaTarget: function() {
        return this._focusTarget();
    },

    _initContentReadyAction: function() {
        this._contentReadyAction = this._createActionByOption("onContentReady", {
            excludeValidators: ["disabled", "readOnly"]
        });
    },

    _initMarkup: function() {
        this.$element().addClass(WIDGET_CLASS);

        this._toggleDisabledState(this.option("disabled"));
        this._toggleVisibility(this.option("visible"));

        this._renderHint();

        if(this._isFocusable()) {
            this._renderFocusTarget();
        }

        this.callBase();
    },

    _render: function() {
        this.callBase();

        this._renderContent();
        this._renderFocusState();
        this._attachFeedbackEvents();
        this._attachHoverEvents();
    },

    _renderHint: function() {
        var hint = this.option("hint");
        this.$element().attr("title", hint ? hint : null);
    },

    _renderContent: function() {
        commonUtils.deferRender(() => {
            if(this._disposed) {
                return;
            }
            return this._renderContentImpl();
        }).done(() => {
            if(this._disposed) {
                return;
            }
            this._fireContentReadyAction();
        });
    },

    _renderContentImpl: commonUtils.noop,

    _fireContentReadyAction: commonUtils.deferRenderer(function() {
        this._contentReadyAction();
    }),

    _dispose: function() {
        this._contentReadyAction = null;
        this._detachKeyboardEvents();

        this.callBase();
    },

    _resetActiveState: function() {
        this._toggleActiveState(this._eventBindingTarget(), false);
    },

    _clean: function() {
        this._cleanFocusState();
        this._resetActiveState();
        this.callBase();
        this.$element().empty();
    },

    _toggleVisibility: function(visible) {
        this.$element().toggleClass(INVISIBLE_STATE_CLASS, !visible);
        this.setAria("hidden", !visible || undefined);
    },

    _renderFocusState: function() {
        this._attachKeyboardEvents();

        if(!this._isFocusable()) {
            return;
        }

        this._renderFocusTarget();
        this._attachFocusEvents();
        this._renderAccessKey();
    },

    _renderAccessKey() {
        const $el = this._focusTarget();
        const { accessKey } = this.option();
        const namespace = 'UIFeedback';

        $el.attr('accesskey', accessKey);
        dxClick.off($el, { namespace });
        accessKey && dxClick.on($el, e => {
            if(eventUtils.isFakeClickEvent(e)) {
                e.stopImmediatePropagation();
                this.focus();
            }
        }, { namespace });
    },

    _isFocusable: function() {
        return this.option("focusStateEnabled") && !this.option("disabled");
    },

    _eventBindingTarget: function() {
        return this.$element();
    },

    _focusTarget: function() {
        return this._getActiveElement();
    },

    _getActiveElement: function() {
        var activeElement = this._eventBindingTarget();

        if(this._activeStateUnit) {
            activeElement = activeElement
                .find(this._activeStateUnit)
                .not("." + DISABLED_STATE_CLASS);
        }

        return activeElement;
    },

    _renderFocusTarget: function() {
        this._focusTarget().attr("tabIndex", this.option("tabIndex"));
    },

    _keyboardEventBindingTarget: function() {
        return this._eventBindingTarget();
    },

    _refreshFocusEvent: function() {
        this._detachFocusEvents();
        this._attachFocusEvents();
    },

    _focusEventTarget: function() {
        return this._focusTarget();
    },

    _focusInHandler: function(e) {
        if(e.isDefaultPrevented()) {
            return;
        }

        var that = this;

        that._createActionByOption("onFocusIn", {
            beforeExecute: function() {
                that._updateFocusState(e, true);
            },
            excludeValidators: ["readOnly"]
        })({ event: e });
    },

    _focusOutHandler: function(e) {
        if(e.isDefaultPrevented()) {
            return;
        }

        var that = this;

        that._createActionByOption("onFocusOut", {
            beforeExecute: function() {
                that._updateFocusState(e, false);
            },
            excludeValidators: ["readOnly", "disabled"]
        })({ event: e });
    },

    _updateFocusState: function(e, isFocused) {
        var target = e.target;

        if(inArray(target, this._focusTarget()) !== -1) {
            this._toggleFocusClass(isFocused, $(target));
        }
    },

    _toggleFocusClass: function(isFocused, $element) {
        var $focusTarget = $element && $element.length ? $element : this._focusTarget();
        $focusTarget.toggleClass(FOCUSED_STATE_CLASS, isFocused);
    },

    _hasFocusClass: function(element) {
        var $focusTarget = $(element || this._focusTarget());
        return $focusTarget.hasClass(FOCUSED_STATE_CLASS);
    },

    _isFocused: function() {
        return this._hasFocusClass();
    },

    _getKeyboardListeners() {
        return [];
    },

    _attachKeyboardEvents: function() {
        this._detachKeyboardEvents();

        const { focusStateEnabled, onKeyboardHandled } = this.option();
        const hasChildListeners = this._getKeyboardListeners().length;
        const hasKeyboardEventHandler = !!onKeyboardHandled;
        const shouldAttach = focusStateEnabled || hasChildListeners || hasKeyboardEventHandler;

        if(shouldAttach) {
            this._keyboardListenerId = keyboard.on(
                this._keyboardEventBindingTarget(),
                this._focusTarget(),
                opts => this._keyboardHandler(opts)
            );
        }
    },

    _keyboardHandler: function(options, onlyChildProcessing) {
        if(!onlyChildProcessing) {
            const { originalEvent, keyName, which } = options;
            const keys = this._supportedKeys(originalEvent);
            const func = keys[keyName] || keys[which];

            if(func !== undefined) {
                const handler = func.bind(this);
                const result = handler(originalEvent, options);

                if(!result) {
                    return false;
                }
            }
        }

        const keyboardListeners = this._getKeyboardListeners();
        const { onKeyboardHandled } = this.option();

        keyboardListeners.forEach(listener => listener && listener._keyboardHandler(options));

        onKeyboardHandled && onKeyboardHandled(options);

        return true;
    },

    _refreshFocusState: function() {
        this._cleanFocusState();
        this._renderFocusState();
    },

    _cleanFocusState: function() {
        var $element = this._focusTarget();

        this._detachFocusEvents();

        this._toggleFocusClass(false);
        $element.removeAttr("tabIndex");

        this._detachKeyboardEvents();
    },

    _detachKeyboardEvents() {
        keyboard.off(this._keyboardListenerId);
        this._keyboardListenerId = null;
    },

    _attachHoverEvents() {
        const { hoverStateEnabled } = this.option();
        const selector = this._activeStateUnit;
        const namespace = 'UIFeedback';
        const $el = this._eventBindingTarget();

        hover.off($el, { selector, namespace });

        if(hoverStateEnabled) {
            hover.on($el, new Action(({ event, element }) => {
                this._hoverStartHandler(event);
                this._refreshHoveredElement($(element));
            }, { excludeValidators: ['readOnly'] }), event => {
                this._hoverEndHandler(event);
                this._forgetHoveredElement();
            }, { selector, namespace });
        } else {
            this._toggleHoverClass(false);
        }
    },

    _attachFeedbackEvents() {
        const { activeStateEnabled } = this.option();
        const selector = this._activeStateUnit;
        const namespace = 'UIFeedback';
        const $el = this._eventBindingTarget();

        active.off($el, { namespace, selector });

        if(activeStateEnabled) {
            active.on($el,
                new Action(({ event, element }) => this._toggleActiveState($(element), true, event)),
                new Action(({ event, element }) => this._toggleActiveState($(element), false, event),
                    { excludeValidators: ['disabled', 'readOnly'] }
                ), {
                    showTimeout: this._feedbackShowTimeout,
                    hideTimeout: this._feedbackHideTimeout,
                    selector,
                    namespace
                }
            );
        }
    },

    _detachFocusEvents() {
        const $el = this._focusEventTarget();

        focus.off($el, { namespace: `${this.NAME}Focus` });
    },

    _attachFocusEvents() {
        const $el = this._focusEventTarget();

        focus.on($el,
            e => this._focusInHandler(e),
            e => this._focusOutHandler(e), {
                namespace: `${this.NAME}Focus`,
                isFocusable: el => $(el).is(selectors.focusable)
            }
        );
    },

    _hoverStartHandler: commonUtils.noop,

    _hoverEndHandler: commonUtils.noop,

    _toggleActiveState: function($element, value) {
        this._toggleHoverClass(!value);
        $element.toggleClass(ACTIVE_STATE_CLASS, value);
    },

    _refreshHoveredElement: function(hoveredElement) {
        var selector = this._activeStateUnit || this._eventBindingTarget();
        this._forgetHoveredElement();
        this._hoveredElement = hoveredElement.closest(selector);
        this._toggleHoverClass(true);
    },

    _forgetHoveredElement: function() {
        this._toggleHoverClass(false);
        delete this._hoveredElement;
    },

    _toggleHoverClass: function(value) {
        if(this._hoveredElement) {
            this._hoveredElement.toggleClass(HOVER_STATE_CLASS, value && this.option("hoverStateEnabled"));
        }
    },

    _toggleDisabledState: function(value) {
        this.$element().toggleClass(DISABLED_STATE_CLASS, Boolean(value));
        this._toggleHoverClass(!value);
        this.setAria("disabled", value || undefined);
    },

    _setWidgetOption: function(widgetName, args) {
        if(!this[widgetName]) {
            return;
        }

        if(typeUtils.isPlainObject(args[0])) {
            each(args[0], (function(option, value) {
                this._setWidgetOption(widgetName, [option, value]);
            }).bind(this));
            return;
        }

        var optionName = args[0];
        var value = args[1];

        if(args.length === 1) {
            value = this.option(optionName);
        }

        var widgetOptionMap = this[widgetName + "OptionMap"];
        this[widgetName].option(widgetOptionMap ? widgetOptionMap(optionName) : optionName, value);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "disabled":
                this._toggleDisabledState(args.value);
                this._refreshFocusState();
                break;
            case "hint":
                this._renderHint();
                break;
            case "activeStateEnabled":
                this._attachFeedbackEvents();
                break;
            case "hoverStateEnabled":
                this._attachHoverEvents();
                break;
            case "tabIndex":
            case "focusStateEnabled":
                this._refreshFocusState();
                break;
            case "onFocusIn":
            case "onFocusOut":
                break;
            case "accessKey":
                this._renderAccessKey();
                break;
            case "visible":
                var visible = args.value;
                this._toggleVisibility(visible);
                if(this._isVisibilityChangeSupported()) {
                    // TODO hiding works wrong
                    this._checkVisibilityChanged(args.value ? "shown" : "hiding");
                }
                break;
            case "onKeyboardHandled":
                this._attachKeyboardEvents();
                break;
            case "onContentReady":
                this._initContentReadyAction();
                break;
            default:
                this.callBase(args);
        }
    },

    _isVisible: function() {
        return this.callBase() && this.option("visible");
    },

    beginUpdate: function() {
        this._ready(false);
        this.callBase();
    },

    endUpdate: function() {
        this.callBase();

        if(this._initialized) {
            this._ready(true);
        }
    },

    _ready: function(value) {
        if(arguments.length === 0) {
            return this._isReady;
        }

        this._isReady = value;

    },

    setAria: function() {
        var setAttribute = function(option) {
            var attrName = (option.name === "role" || option.name === "id") ? option.name : "aria-" + option.name,
                attrValue = option.value;

            if(typeUtils.isDefined(attrValue)) {
                attrValue = attrValue.toString();
            } else {
                attrValue = null;
            }

            option.target.attr(attrName, attrValue);
        };

        if(!typeUtils.isPlainObject(arguments[0])) {
            setAttribute({
                name: arguments[0],
                value: arguments[1],
                target: arguments[2] || this._getAriaTarget()
            });
        } else {
            var $target = arguments[1] || this._getAriaTarget();

            each(arguments[0], function(key, value) {
                setAttribute({
                    name: key,
                    value: value,
                    target: $target
                });
            });
        }
    },

    isReady: function() {
        return this._ready();
    },

    /**
    * @name WidgetMethods.repaint
    * @publicName repaint()
    */
    repaint: function() {
        this._refresh();
    },

    /**
    * @name WidgetMethods.focus
    * @publicName focus()
    */
    focus: function() {
        eventsEngine.trigger(this._focusTarget(), "focus");
    },

    /**
    * @name WidgetMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @param1 key:string
    * @param2 handler:function
    */
    registerKeyHandler: function(key, handler) {
        var currentKeys = this._supportedKeys(),
            addingKeys = {};

        addingKeys[key] = handler;

        this._supportedKeys = function() {
            return extend(currentKeys, addingKeys);
        };
    }
});

module.exports = Widget;

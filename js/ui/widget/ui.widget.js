import $ from '../../core/renderer';
import Action from '../../core/action';
import DOMComponent from '../../core/dom_component';
import { active, dxClick, focus, hover, keyboard } from '../../events/short';
import { deferRender, deferRenderer, noop } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import { focusable as focusableSelector } from './selectors';
import { inArray } from '../../core/utils/array';
import { isFakeClickEvent } from '../../events/utils';
import { isPlainObject, isDefined } from '../../core/utils/type';

import '../../events/click';
import '../../events/core/emitter.feedback';
import '../../events/hover';

function setAttribute(name, value, target) {
    name = (name === 'role' || name === 'id') ? name : `aria-${name}`;
    value = isDefined(value) ? value.toString() : null;

    target.attr(name, value);
}

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
const Widget = DOMComponent.inherit({
    _feedbackHideTimeout: 400,
    _feedbackShowTimeout: 30,

    _supportedKeys() {
        return {};
    },

    _getDefaultOptions() {
        return extend(this.callBase(), {
            hoveredElement: null,
            isActive: false,

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

            onKeyboardHandled: null
        });
    },

    _init() {
        this.callBase();
        this._initContentReadyAction();
    },

    _clearInnerOptionCache(optionContainer) {
        this[`${optionContainer}Cache`] = {};
    },

    _cacheInnerOptions(optionContainer, optionValue) {
        const cacheName = `${optionContainer}Cache`;

        this[cacheName] = extend(this[cacheName], optionValue);
    },

    _innerOptionChanged(innerWidget, args) {
        const options = Widget.getOptionsFromContainer(args);

        innerWidget && innerWidget.option(options);
        this._cacheInnerOptions(args.name, options);
    },

    _getInnerOptionsCache(optionContainer) {
        return this[`${optionContainer}Cache`];
    },

    _initInnerOptionCache(optionContainer) {
        this._clearInnerOptionCache(optionContainer);
        this._cacheInnerOptions(optionContainer, this.option(optionContainer));
    },

    _bindInnerWidgetOptions(innerWidget, optionsContainer) {
        const syncOptions = () =>
            this._options.silent(optionsContainer, extend({}, innerWidget.option()));

        syncOptions();
        innerWidget.on('optionChanged', syncOptions);
    },

    _getAriaTarget() {
        return this._focusTarget();
    },

    _initContentReadyAction() {
        this._contentReadyAction = this._createActionByOption('onContentReady', {
            excludeValidators: ['disabled', 'readOnly']
        });
    },

    _initMarkup() {
        const { disabled, visible } = this.option();

        this.$element().addClass('dx-widget');

        this._toggleDisabledState(disabled);
        this._toggleVisibility(visible);
        this._renderHint();
        this._isFocusable() && this._renderFocusTarget();

        this.callBase();
    },

    _render() {
        this.callBase();

        this._renderContent();
        this._renderFocusState();
        this._attachFeedbackEvents();
        this._attachHoverEvents();
    },

    _renderHint() {
        const { hint } = this.option();

        this.$element().attr('title', hint || null);
    },

    _renderContent() {
        deferRender(() => !this._disposed ? this._renderContentImpl() : void 0)
            .done(() => !this._disposed ? this._fireContentReadyAction() : void 0);
    },

    _renderContentImpl: noop,

    _fireContentReadyAction: deferRenderer(function() { return this._contentReadyAction(); }),

    _dispose() {
        this._contentReadyAction = null;
        this._detachKeyboardEvents();

        this.callBase();
    },

    _resetActiveState() {
        this._toggleActiveState(this._eventBindingTarget(), false);
    },

    _clean() {
        this._cleanFocusState();
        this._resetActiveState();
        this.callBase();
        this.$element().empty();
    },

    _toggleVisibility(visible) {
        this.$element().toggleClass('dx-state-invisible', !visible);
        this.setAria('hidden', !visible || void 0);
    },

    _renderFocusState() {
        this._attachKeyboardEvents();

        if(this._isFocusable()) {
            this._renderFocusTarget();
            this._attachFocusEvents();
            this._renderAccessKey();
        }
    },

    _renderAccessKey() {
        const $el = this._focusTarget();
        const { accessKey } = this.option();
        const namespace = 'UIFeedback';

        $el.attr('accesskey', accessKey);
        dxClick.off($el, { namespace });
        accessKey && dxClick.on($el, e => {
            if(isFakeClickEvent(e)) {
                e.stopImmediatePropagation();
                this.focus();
            }
        }, { namespace });
    },

    _isFocusable() {
        const { focusStateEnabled, disabled } = this.option();

        return focusStateEnabled && !disabled;
    },

    _eventBindingTarget() {
        return this.$element();
    },

    _focusTarget() {
        return this._getActiveElement();
    },

    _getActiveElement() {
        const activeElement = this._eventBindingTarget();

        if(this._activeStateUnit) {
            return activeElement
                .find(this._activeStateUnit)
                .not('.dx-state-disabled');
        }

        return activeElement;
    },

    _renderFocusTarget() {
        const { tabIndex } = this.option();

        this._focusTarget().attr('tabIndex', tabIndex);
    },

    _keyboardEventBindingTarget() {
        return this._eventBindingTarget();
    },

    _refreshFocusEvent() {
        this._detachFocusEvents();
        this._attachFocusEvents();
    },

    _focusEventTarget() {
        return this._focusTarget();
    },

    _focusInHandler(event) {
        if(!event.isDefaultPrevented()) {
            this._createActionByOption('onFocusIn', {
                beforeExecute: () => this._updateFocusState(event, true),
                excludeValidators: ['readOnly']
            })({ event });
        }
    },

    _focusOutHandler(event) {
        if(!event.isDefaultPrevented()) {
            this._createActionByOption('onFocusOut', {
                beforeExecute: () => this._updateFocusState(event, false),
                excludeValidators: ['readOnly', 'disabled']
            })({ event });
        }
    },

    _updateFocusState({ target }, isFocused) {
        if(inArray(target, this._focusTarget()) !== -1) {
            this._toggleFocusClass(isFocused, $(target));
        }
    },

    _toggleFocusClass(isFocused, $element) {
        const $focusTarget = $element && $element.length ? $element : this._focusTarget();

        $focusTarget.toggleClass('dx-state-focused', isFocused);
    },

    _hasFocusClass(element) {
        const $focusTarget = $(element || this._focusTarget());

        return $focusTarget.hasClass('dx-state-focused');
    },

    _isFocused() {
        return this._hasFocusClass();
    },

    _getKeyboardListeners() {
        return [];
    },

    _attachKeyboardEvents() {
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

    _keyboardHandler(options, onlyChildProcessing) {
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

    _refreshFocusState() {
        this._cleanFocusState();
        this._renderFocusState();
    },

    _cleanFocusState() {
        const $element = this._focusTarget();

        $element.removeAttr('tabIndex');
        this._toggleFocusClass(false);
        this._detachFocusEvents();
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
                this.option('hoveredElement', $(element));
            }, { excludeValidators: ['readOnly'] }), event => {
                this.option('hoveredElement', null);
                this._hoverEndHandler(event);
            }, { selector, namespace });
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
                isFocusable: el => $(el).is(focusableSelector)
            }
        );
    },

    _hoverStartHandler: noop,
    _hoverEndHandler: noop,

    _toggleActiveState($element, value) {
        this.option('isActive', value);
        $element.toggleClass('dx-state-active', value);
    },

    _updatedHover() {
        const hoveredElement = this._options.silent('hoveredElement');

        this._hover(hoveredElement, hoveredElement);
    },

    _findHoverTarget($el) {
        return $el && $el.closest(this._activeStateUnit || this._eventBindingTarget());
    },

    _hover($el, $previous) {
        const { hoverStateEnabled, disabled, isActive } = this.option();

        $previous = this._findHoverTarget($previous);
        $previous && $previous.toggleClass('dx-state-hover', false);

        if($el && hoverStateEnabled && !disabled && !isActive) {
            const newHoveredElement = this._findHoverTarget($el);

            newHoveredElement && newHoveredElement.toggleClass('dx-state-hover', true);
        }
    },

    _toggleDisabledState(value) {
        this.$element().toggleClass('dx-state-disabled', Boolean(value));
        this.setAria('disabled', value || undefined);
    },

    _setWidgetOption(widgetName, args) {
        if(!this[widgetName]) {
            return;
        }

        if(isPlainObject(args[0])) {
            each(args[0], (option, value) => this._setWidgetOption(widgetName, [option, value]));

            return;
        }

        const optionName = args[0];
        let value = args[1];

        if(args.length === 1) {
            value = this.option(optionName);
        }

        const widgetOptionMap = this[`${widgetName}OptionMap`];

        this[widgetName].option(widgetOptionMap ? widgetOptionMap(optionName) : optionName, value);
    },

    _optionChanged(args) {
        const { name, value, previousValue } = args;

        switch(name) {
            case 'disabled':
                this._toggleDisabledState(value);
                this._updatedHover();
                this._refreshFocusState();
                break;
            case 'hint':
                this._renderHint();
                break;
            case 'activeStateEnabled':
                this._attachFeedbackEvents();
                break;
            case 'hoverStateEnabled':
                this._attachHoverEvents();
                this._updatedHover();
                break;
            case 'tabIndex':
            case 'focusStateEnabled':
                this._refreshFocusState();
                break;
            case 'onFocusIn':
            case 'onFocusOut':
                break;
            case 'accessKey':
                this._renderAccessKey();
                break;
            case 'hoveredElement':
                this._hover(value, previousValue);
                break;
            case 'isActive':
                this._updatedHover();
                break;
            case 'visible':
                this._toggleVisibility(value);
                if(this._isVisibilityChangeSupported()) {
                    // TODO hiding works wrong
                    this._checkVisibilityChanged(value ? 'shown' : 'hiding');
                }
                break;
            case 'onKeyboardHandled':
                this._attachKeyboardEvents();
                break;
            case 'onContentReady':
                this._initContentReadyAction();
                break;
            default:
                this.callBase(args);
        }
    },

    _isVisible() {
        const { visible } = this.option();

        return this.callBase() && visible;
    },

    beginUpdate() {
        this._ready(false);
        this.callBase();
    },

    endUpdate() {
        this.callBase();

        if(this._initialized) {
            this._ready(true);
        }
    },

    _ready(value) {
        if(arguments.length === 0) {
            return this._isReady;
        }

        this._isReady = value;
    },

    setAria(...args) {
        if(!isPlainObject(args[0])) {
            setAttribute(args[0], args[1], args[2] || this._getAriaTarget());
        } else {
            const target = args[1] || this._getAriaTarget();

            each(args[0], (name, value) => setAttribute(name, value, target));
        }
    },

    isReady() {
        return this._ready();
    },

    /**
    * @name WidgetMethods.repaint
    * @publicName repaint()
    */
    repaint() {
        this._refresh();
    },

    /**
    * @name WidgetMethods.focus
    * @publicName focus()
    */
    focus() {
        focus.trigger(this._focusTarget());
    },

    /**
    * @name WidgetMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @param1 key:string
    * @param2 handler:function
    */
    registerKeyHandler(key, handler) {
        const currentKeys = this._supportedKeys();

        this._supportedKeys = () => extend(currentKeys, { [key]: handler });
    }
});

Widget.getOptionsFromContainer = ({ name, fullName, value }) => {
    let options = {};

    if(name === fullName) {
        options = value;
    } else {
        const option = fullName.split('.').pop();

        options[option] = value;
    }

    return options;
};

module.exports = Widget;

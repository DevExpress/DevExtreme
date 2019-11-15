import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import feedbackEvents from '../../events/core/emitter.feedback';
import hoverEvents from '../../events/hover';
import Action from '../../core/action';
import DOMComponentWithTemplate from '../../core/dom_component_with_template';
import KeyboardProcessor from './ui.keyboard_processor';
import { focusable as focusableSelector } from './selectors';
import { addNamespace, isFakeClickEvent } from '../../events/utils';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import { each } from '../../core/utils/iterator';
import { noop, deferRender } from '../../core/utils/common';
import { isPlainObject, isDefined } from '../../core/utils/type';
import { name as clickEventName } from '../../events/click';

const EVENT_NAME = {
    active: feedbackEvents.active,
    beforeActivate: owner => addNamespace('beforeactivate', `${owner}Focus`),
    click: addNamespace(clickEventName, 'UIFeedback'),
    focusIn: owner => addNamespace('focusin', `${owner}Focus`),
    focusOut: owner => addNamespace('focusout', `${owner}Focus`),
    inactive: feedbackEvents.inactive,
    hoverEnd: addNamespace(hoverEvents.end, 'UIFeedback'),
    hoverStart: addNamespace(hoverEvents.start, 'UIFeedback')
};

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
const Widget = DOMComponentWithTemplate.inherit({
    _feedbackShowTimeout: 30,
    _feedbackHideTimeout: 400,

    _supportedKeys() {
        return {};
    },

    _getDefaultOptions() {
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

            _keyboardProcessor: undefined,

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

    _getOptionsFromContainer({ name, fullName, value }) {
        let options = {};

        if(name === fullName) {
            options = value;
        } else {
            const option = fullName.split('.').pop();

            options[option] = value;
        }

        return options;
    },

    _innerOptionChanged(innerWidget, args) {
        const options = this._getOptionsFromContainer(args);

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
        this._options[optionsContainer] = extend({}, innerWidget.option());
        innerWidget.on('optionChanged', ({ component }) =>
            this._options[optionsContainer] = extend({}, component.option())
        );
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
        deferRender(() => !this._disposed ? this._renderContentImpl() : undefined)
            .done(() => !this._disposed && this._fireContentReadyAction());
    },

    _renderContentImpl: noop,

    _fireContentReadyAction: deferRender(() => this._contentReadyAction()),

    _dispose() {
        this._contentReadyAction = null;

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
        this.setAria('hidden', !visible || undefined);
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
        const focusTarget = this._focusTarget();
        const { accessKey } = this.option();

        focusTarget.attr('accesskey', accessKey);
        eventsEngine.off(focusTarget, EVENT_NAME.click);
        accessKey && eventsEngine.on(focusTarget, EVENT_NAME.click, e => {
            if(isFakeClickEvent(e)) {
                e.stopImmediatePropagation();
                this.focus();
            }
        });
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

        return this._activeStateUnit ?
            activeElement.find(this._activeStateUnit).not('.dx-state-disabled') :
            activeElement;
    },

    _renderFocusTarget() {
        const { tabIndex } = this.option();

        this._focusTarget().attr('tabIndex', tabIndex);
    },

    _keyboardEventBindingTarget() {
        return this._eventBindingTarget();
    },

    _detachFocusEvents() {
        const $focusTarget = this._focusEventTarget();

        eventsEngine.off($focusTarget, EVENT_NAME.focusIn(this.NAME));
        eventsEngine.off($focusTarget, EVENT_NAME.focusOut(this.NAME));

        if(domAdapter.hasDocumentProperty('onbeforeactivate')) {
            eventsEngine.off($focusTarget, EVENT_NAME.beforeActivate(this.NAME));
        }
    },

    _attachFocusEvents() {
        this._attachFocusEventsCore(
            this._focusEventTarget(),
            this._focusInHandler.bind(this),
            this._focusOutHandler.bind(this),
            { owner: this.NAME }
        );
    },

    // NOTE: Static method
    _attachFocusEventsCore($el, focusIn, focusOut, { owner }) {
        eventsEngine.on($el, EVENT_NAME.focusIn(owner), focusIn);
        eventsEngine.on($el, EVENT_NAME.focusOut(owner), focusOut);

        if(domAdapter.hasDocumentProperty('onbeforeactivate')) {
            eventsEngine.on($el, EVENT_NAME.beforeActivate(owner),
                e => $(e.target).is(focusableSelector) || e.preventDefault()
            );
        }
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

    _attachKeyboardEvents() {
        const { focusStateEnabled, _keyboardProcessor } = this.option();

        if(_keyboardProcessor) {
            this._keyboardProcessor = _keyboardProcessor.reinitialize(this._keyboardHandler, this);
        } else if(focusStateEnabled) {
            this._disposeKeyboardProcessor();
            this._keyboardProcessor = new KeyboardProcessor({
                element: this._keyboardEventBindingTarget(),
                handler: this._keyboardHandler,
                focusTarget: this._focusTarget(),
                context: this
            });
        }
    },

    _keyboardHandler({ originalEvent, keyName, keyCode }) {
        const keys = this._supportedKeys(originalEvent);
        const func = keys[keyName] || keys[keyCode];

        if(func !== undefined) {
            const handler = func.bind(this);

            return handler(originalEvent) || false;
        } else {
            return true;
        }
    },

    _refreshFocusState() {
        this._cleanFocusState();
        this._renderFocusState();
    },

    _cleanFocusState() {
        const $element = this._focusTarget();

        this._detachFocusEvents();
        this._toggleFocusClass(false);
        $element.removeAttr('tabIndex');
        this._disposeKeyboardProcessor();
    },

    _disposeKeyboardProcessor() {
        if(this._keyboardProcessor) {
            this._keyboardProcessor.dispose();
            delete this._keyboardProcessor;
        }
    },

    _attachHoverEvents() {
        const { hoverStateEnabled } = this.option();
        const hoverableSelector = this._activeStateUnit;
        const $el = this._eventBindingTarget();

        this._detachHoverEvents($el, hoverableSelector);

        if(hoverStateEnabled) {
            this._attachHoverEventsCore($el, ($element, event) => {
                this._hoverStartHandler(event);
                this._refreshHoveredElement($element);
            }, event => {
                this._hoverEndHandler(event);
                this._forgetHoveredElement();
            }, { selector: hoverableSelector });
        } else {
            this._toggleHoverClass(false);
        }
    },

    // NOTE: Static method
    _attachHoverEventsCore($el, start, end, { selector }) {
        const startAction = new Action(({ event, element }) => start($(element), event),
            { excludeValidators: ['readOnly'] });

        eventsEngine.on($el, EVENT_NAME.hoverEnd, selector, event => end(event));
        eventsEngine.on($el, EVENT_NAME.hoverStart, selector, event => {
            startAction.execute({ element: event.target, event });
        });
    },

    // NOTE: Static method
    _detachHoverEvents($el, selector) {
        eventsEngine.off($el, EVENT_NAME.hoverStart, selector);
        eventsEngine.off($el, EVENT_NAME.hoverEnd, selector);
    },

    _attachFeedbackEvents() {
        const { activeStateEnabled } = this.option();
        const eventBindingTarget = this._eventBindingTarget();

        this._detachFeedbackEvents(eventBindingTarget, this._activeStateUnit, { namespace: 'UIFeedback' });

        if(activeStateEnabled) {
            this._attachFeedbackEventsCore(
                eventBindingTarget,
                ($el, event) => this._toggleActiveState($el, true, event),
                ($el, event) => this._toggleActiveState($el, false, event), {
                    selector: this._activeStateUnit,
                    showTimeout: this._feedbackShowTimeout,
                    hideTimeout: this._feedbackHideTimeout,
                    namespace: 'UIFeedback'
                }
            );
        }
    },

    // NOTE: Static method
    _detachFeedbackEvents($el, selector, { namespace } = {}) {
        const activeEvent = namespace ? addNamespace(EVENT_NAME.active, namespace) : EVENT_NAME.active;
        const inactiveEvent = namespace ? addNamespace(EVENT_NAME.inactive, namespace) : EVENT_NAME.inactive;

        eventsEngine.off($el, activeEvent, selector);
        eventsEngine.off($el, inactiveEvent, selector);
    },

    // NOTE: Static method
    _attachFeedbackEventsCore($el, active, inactive, opts) {
        const { selector, showTimeout, hideTimeout, namespace } = opts;
        const activeEvent = namespace ? addNamespace(EVENT_NAME.active, namespace) : EVENT_NAME.active;
        const inactiveEvent = namespace ? addNamespace(EVENT_NAME.inactive, namespace) : EVENT_NAME.inactive;
        const feedbackAction = new Action(({ event, element }) => active(element, event));
        const feedbackActionDisabled = new Action(({ event, element }) => inactive(element, event),
            { excludeValidators: ['disabled', 'readOnly'] });

        eventsEngine.on($el, activeEvent, selector, { timeout: showTimeout },
            event => feedbackAction.execute({ event, element: $(event.currentTarget) })
        );
        eventsEngine.on($el, inactiveEvent, selector, { timeout: hideTimeout },
            event => feedbackActionDisabled.execute({ event, element: $(event.currentTarget) })
        );
    },

    _hoverStartHandler: noop,
    _hoverEndHandler: noop,

    _toggleActiveState($element, value) {
        this._toggleHoverClass(!value);
        $element.toggleClass('dx-state-active', value);
    },

    _refreshHoveredElement(hoveredElement) {
        const selector = this._activeStateUnit || this._eventBindingTarget();

        this._forgetHoveredElement();
        this._hoveredElement = hoveredElement.closest(selector);
        this._toggleHoverClass(true);
    },

    _forgetHoveredElement() {
        this._toggleHoverClass(false);
        delete this._hoveredElement;
    },

    _toggleHoverClass(value) {
        if(this._hoveredElement) {
            const { hoverStateEnabled } = this.option();

            this._hoveredElement.toggleClass('dx-state-hover', value && hoverStateEnabled);
        }
    },

    _toggleDisabledState(value) {
        this.$element().toggleClass('dx-state-disabled', Boolean(value));
        this._toggleHoverClass(!value);
        this.setAria('disabled', value || undefined);
    },

    _setWidgetOption(widgetName, args) {
        if(!this[widgetName]) {
            return;
        }

        if(isPlainObject(args[0])) {
            each(args[0], (option, value) =>
                this._setWidgetOption(widgetName, [option, value])
            );

            return;
        }

        const optionName = args[0];
        const value = args.length === 1 ? this.option(optionName) : args[1];
        const widgetOptionMap = this[`${widgetName}OptionMap`];

        this[widgetName].option(widgetOptionMap ?
            widgetOptionMap(optionName) :
            optionName,
        value);
    },

    _optionChanged(args) {
        const { value, name } = args;

        switch(name) {
            case 'disabled':
                this._toggleDisabledState(value);
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
                break;
            case 'tabIndex':
            case '_keyboardProcessor':
            case 'focusStateEnabled':
                this._refreshFocusState();
                break;
            case 'onFocusIn':
            case 'onFocusOut':
                break;
            case 'accessKey':
                this._renderAccessKey();
                break;
            case 'visible':
                this._toggleVisibility(value);

                if(this._isVisibilityChangeSupported()) {
                    // TODO hiding works wrong
                    this._checkVisibilityChanged(value ? 'shown' : 'hiding');
                }
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
        this._initialized && this._ready(true);
    },

    _ready(value) {
        if(arguments.length === 0) {
            return this._isReady;
        }

        this._isReady = value;
    },

    setAria() {
        const setAttribute = ({ value, target, name }) => {
            const attrName = (name === 'role' || name === 'id') ? name : `aria-${name}`;
            const attrValue = isDefined(value) ? value.toString() : null;

            target.attr(attrName, attrValue);
        };

        if(!isPlainObject(arguments[0])) {
            setAttribute({
                name: arguments[0],
                value: arguments[1],
                target: arguments[2] || this._getAriaTarget()
            });
        } else {
            const target = arguments[1] || this._getAriaTarget();

            each(arguments[0], (name, value) =>
                setAttribute({ name, value, target })
            );
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
        eventsEngine.trigger(this._focusTarget(), 'focus');
    },

    /**
    * @name WidgetMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @param1 key:string
    * @param2 handler:function
    */
    registerKeyHandler(key, handler) {
        const currentKeys = this._supportedKeys();
        const addingKeys = {};

        addingKeys[key] = handler;

        this._supportedKeys = () => extend(currentKeys, addingKeys);
    }
});

module.exports = Widget;

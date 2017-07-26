"use strict";

var $ = require("../../core/renderer"),
    errors = require("./ui.errors"),
    Action = require("../../core/action"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    each = require("../../core/utils/iterator").each,
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    domUtils = require("../../core/utils/dom"),
    devices = require("../../core/devices"),
    DOMComponent = require("../../core/dom_component"),
    Template = require("./jquery.template"),
    FunctionTemplate = require("./function_template"),
    EmptyTemplate = require("./empty_template"),
    ChildDefaultTemplate = require("./child_default_template"),
    KeyboardProcessor = require("./ui.keyboard_processor"),
    selectors = require("./jquery.selectors"),
    eventUtils = require("../../events/utils"),
    hoverEvents = require("../../events/hover"),
    feedbackEvents = require("../../events/core/emitter.feedback"),
    clickEvent = require("../../events/click"),
    inflector = require("../../core/utils/inflector");

var UI_FEEDBACK = "UIFeedback",
    WIDGET_CLASS = "dx-widget",
    ACTIVE_STATE_CLASS = "dx-state-active",
    DISABLED_STATE_CLASS = "dx-state-disabled",
    INVISIBLE_STATE_CLASS = "dx-state-invisible",
    HOVER_STATE_CLASS = "dx-state-hover",
    FOCUSED_STATE_CLASS = "dx-state-focused",
    FEEDBACK_SHOW_TIMEOUT = 30,
    FEEDBACK_HIDE_TIMEOUT = 400,
    FOCUS_NAMESPACE = "Focus",
    ANONYMOUS_TEMPLATE_NAME = "template",
    TEXT_NODE = 3,
    TEMPLATE_SELECTOR = "[data-options*='dxTemplate']",
    TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";

var DX_POLYMORPH_WIDGET_TEMPLATE = new FunctionTemplate(function(options) {
    var widgetName = options.model.widget;
    if(widgetName) {
        var widgetElement = $("<div>"),
            widgetOptions = options.model.options || {};

        if(widgetName === "button" || widgetName === "tabs" || widgetName === "dropDownMenu") {
            var deprecatedName = widgetName;
            widgetName = inflector.camelize("dx-" + widgetName);
            errors.log("W0001", "dxToolbar - 'widget' item field", deprecatedName, "16.1", "Use: '" + widgetName + "' instead");
        }

        widgetElement[widgetName](widgetOptions);

        return widgetElement;
    }

    return $();
});

var beforeActivateExists = document["onbeforeactivate"] !== undefined;

/**
 * @name ui
 * @publicName ui
 * @section utils
 */

/**
* @name dxItem
* @publicName dxItem
* @type object
* @section uiWidgetMarkupComponents
*/

/**
* @name Widget
* @publicName Widget
* @type object
* @inherits DOMComponent
* @module ui/widget/ui.widget
* @export default
* @hidden
*/
var Widget = DOMComponent.inherit({

    _supportedKeys: function() {
        return {};
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            /**
             * @name WidgetOptions_disabled
             * @publicName disabled
             * @type boolean
             * @default false
             */
            disabled: false,

            /**
             * @name WidgetOptions_visible
             * @publicName visible
             * @type boolean
             * @default true
             */
            visible: true,

            /**
             * @name WidgetOptions_hint
             * @publicName hint
             * @type string
             * @default undefined
             */
            hint: undefined,

            /**
             * @name WidgetOptions_activeStateEnabled
             * @publicName activeStateEnabled
             * @type boolean
             * @default false
             */
            activeStateEnabled: false,

            /**
            * @name WidgetOptions_onContentReady
            * @publicName onContentReady
            * @extends Action
            * @action
            * @hidden
            */
            onContentReady: null,

            /**
             * @name WidgetOptions_hoverStateEnabled
             * @publicName hoverStateEnabled
             * @type boolean
             * @default false
             */
            hoverStateEnabled: false,

            /**
             * @name WidgetOptions_focusStateEnabled
             * @publicName focusStateEnabled
             * @type boolean
             * @default false
             */
            focusStateEnabled: false,

            /**
             * @name WidgetOptions_tabIndex
             * @publicName tabIndex
             * @type number
             * @default 0
             */
            tabIndex: 0,

            /**
             * @name WidgetOptions_accessKey
             * @publicName accessKey
             * @type string
             * @default null
             */
            accessKey: null,

            /**
            * @name WidgetOptions_onFocusIn
            * @publicName onFocusIn
            * @extends Action
            * @action
            * @hidden
            */
            onFocusIn: null,

            /**
            * @name WidgetOptions_onFocusOut
            * @publicName onFocusOut
            * @extends Action
            * @action
            * @hidden
            */
            onFocusOut: null,

            integrationOptions: {
                watchMethod: function(fn, callback, options) {
                    options = options || {};
                    if(!options.skipImmediate) {
                        callback(fn());
                    }
                    return commonUtils.noop;
                },
                templates: {
                    "dx-polymorph-widget": DX_POLYMORPH_WIDGET_TEMPLATE
                },
                createTemplate: function(element) {
                    return new Template(element);
                }
            },
            _keyboardProcessor: undefined,

            /**
            * @name template
            * @publicName template
            * @type String|function|Node|jQuery
            * @section Common
            */

            /**
            * @name format
            * @publicName format
            * @type String|function|Object
            * @type_function_param1 value:number|date
            * @type_function_return string
            * @default undefined
            * @acceptValues "currency" | "fixedPoint" | "percent" | "decimal" | "exponential" | "largeNumber" | "thousands" | "millions" | "billions" | "trillions" | "longDate" | "longTime" | "longDateLongTime" | "monthAndDay" | "monthAndYear" | "quarterAndYear" | "shortDate" | "shortTime" | "shortDateShortTime" | "second" | "millisecond" | "day" | "month" | "quarter" | "year" | "dayOfWeek" | "hour" | "minute"
            * @section Common
            */
            /**
            * @name format_type
            * @publicName type
            * @type String
            * @acceptValues "currency" | "fixedPoint" | "percent" | "decimal" | "exponential" | "largeNumber" | "thousands" | "millions" | "billions" | "trillions" | "longDate" | "longTime" | "longDateLongTime" | "monthAndDay" | "monthAndYear" | "quarterAndYear" | "shortDate" | "shortTime" | "shortDateShortTime" | "second" | "millisecond" | "day" | "month" | "quarter" | "year" | "dayOfWeek" | "hour" | "minute"
            */
            /**
            * @name format_precision
            * @publicName precision
            * @type number
            */
            /**
            * @name format_currency
            * @publicName currency
            * @type String
            */
            /**
            * @name format_formatter
            * @publicName formatter
            * @type function
            * @type_function_param1 value:number|date
            * @type_function_return string
            */
            /**
            * @name format_parser
            * @publicName parser
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

        this._tempTemplates = [];
        this._defaultTemplates = {};
        this._initTemplates();
        this._initContentReadyAction();
    },

    _initTemplates: function() {
        this._extractTemplates();
        this._extractAnonymousTemplate();
    },

    _extractTemplates: function() {
        var templates = this.option("integrationOptions.templates"),
            templateElements = this.element().contents().filter(TEMPLATE_SELECTOR);

        var templatesMap = {};

        templateElements.each(function(_, template) {
            var templateOptions = domUtils.getElementOptions(template).dxTemplate;

            if(!templateOptions) {
                return;
            }

            if(!templateOptions.name) {
                throw errors.Error("E0023");
            }

            $(template).addClass(TEMPLATE_WRAPPER_CLASS).detach();
            templatesMap[templateOptions.name] = templatesMap[templateOptions.name] || [];
            templatesMap[templateOptions.name].push(template);
        });

        each(templatesMap, (function(templateName, value) {
            var deviceTemplate = this._findTemplateByDevice(value);
            if(deviceTemplate) {
                templates[templateName] = this._createTemplate(deviceTemplate);
            }
        }).bind(this));
    },

    _findTemplateByDevice: function(templates) {
        var suitableTemplate = commonUtils.findBestMatches(devices.current(), templates, function(template) {
            return domUtils.getElementOptions(template).dxTemplate;
        })[0];

        each(templates, function(index, template) {
            if(template !== suitableTemplate) {
                $(template).remove();
            }
        });

        return suitableTemplate;
    },

    _extractAnonymousTemplate: function() {
        var templates = this.option("integrationOptions.templates"),
            anonymousTemplateName = this._getAnonymousTemplateName(),
            $anonymousTemplate = this.element().contents().detach();

        var $notJunkTemplateContent = $anonymousTemplate.filter(function(_, element) {
                var isTextNode = element.nodeType === TEXT_NODE,
                    isEmptyText = $(element).text().trim().length < 1;

                return !(isTextNode && isEmptyText);
            }),
            onlyJunkTemplateContent = $notJunkTemplateContent.length < 1;

        if(!templates[anonymousTemplateName] && !onlyJunkTemplateContent) {
            templates[anonymousTemplateName] = this._createTemplate($anonymousTemplate);
        }
    },

    _getAriaTarget: function() {
        return this._focusTarget();
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _getTemplateByOption: function(optionName) {
        return this._getTemplate(this.option(optionName));
    },

    _getTemplate: function(templateSource) {
        if(typeUtils.isFunction(templateSource)) {
            return new FunctionTemplate(function(options) {
                var templateSourceResult = templateSource.apply(this, this._getNormalizedTemplateArgs(options));

                if(!typeUtils.isDefined(templateSourceResult)) {
                    return new EmptyTemplate();
                }

                var dispose = false;
                var template = this._acquireTemplate(templateSourceResult, function(templateSource) {
                    if(templateSource.nodeType || templateSource.jquery && !$(templateSource).is("script")) {
                        return new FunctionTemplate(function() {
                            return templateSource;
                        });
                    }
                    dispose = true;
                    return this._createTemplate(templateSource);
                }.bind(this));

                var result = template.render(options);
                dispose && template.dispose && template.dispose();
                return result;
            }.bind(this));
        }

        return this._acquireTemplate(templateSource, this._createTemplateIfNeeded.bind(this));
    },

    _acquireTemplate: function(templateSource, createTemplate) {
        if(templateSource == null) {
            return new EmptyTemplate();
        }

        if(templateSource instanceof ChildDefaultTemplate) {
            return this._defaultTemplates[templateSource.name];
        }

        //TODO: templateSource.render is needed for angular2 integration. Try to remove it after supporting TypeScript modules.
        if(typeUtils.isFunction(templateSource.render) && !templateSource.jquery) {
            return templateSource;
        }

        if(templateSource.nodeType || templateSource.jquery) {
            templateSource = $(templateSource);

            return createTemplate(templateSource);
        }

        if(typeof templateSource === "string") {
            var userTemplate = this.option("integrationOptions.templates")[templateSource];
            if(userTemplate) {
                return userTemplate;
            }

            var dynamicTemplate = this._defaultTemplates[templateSource];
            if(dynamicTemplate) {
                return dynamicTemplate;
            }
            return createTemplate(templateSource);
        }

        return this._acquireTemplate(templateSource.toString(), createTemplate);
    },

    _createTemplateIfNeeded: function(templateSource) {
        var templateKey = function(templateSource) {
            return (templateSource.jquery && templateSource[0]) || templateSource;
        };

        var cachedTemplate = this._tempTemplates.filter(function(t) {
            templateSource = templateKey(templateSource);
            return t.source === templateSource;
        })[0];
        if(cachedTemplate) return cachedTemplate.template;

        var template = this._createTemplate(templateSource);
        this._tempTemplates.push({ template: template, source: templateKey(templateSource) });
        return template;
    },

    _createTemplate: function(templateSource) {
        templateSource = typeof templateSource === "string" ? domUtils.normalizeTemplateElement(templateSource) : templateSource;
        return this.option("integrationOptions.createTemplate")(templateSource);
    },

    _getNormalizedTemplateArgs: function(options) {
        var args = [];

        if("model" in options) {
            args.push(options.model);
        }
        if("index" in options) {
            args.push(options.index);
        }
        args.push(options.container);

        return args;
    },

    _cleanTemplates: function() {
        this._tempTemplates.forEach(function(t) {
            t.template.dispose && t.template.dispose();
        });
        this._tempTemplates = [];
    },

    _initContentReadyAction: function() {
        this._contentReadyAction = this._createActionByOption("onContentReady", {
            excludeValidators: ["designMode", "disabled", "readOnly"]
        });
    },

    _render: function() {
        this.element().addClass(WIDGET_CLASS);
        this.callBase();

        this._toggleDisabledState(this.option("disabled"));
        this._toggleVisibility(this.option("visible"));

        this._renderHint();
        this._renderContent();

        this._renderFocusState();
        this._attachFeedbackEvents();
        this._attachHoverEvents();
    },

    _renderHint: function() {
        domUtils.toggleAttr(this.element(), "title", this.option("hint"));
    },

    _renderContent: function() {
        var that = this;

        commonUtils.deferRender(function() {
            that._renderContentImpl();
        });

        that._fireContentReadyAction();
    },

    _renderContentImpl: commonUtils.noop,

    _fireContentReadyAction: function() {
        this._contentReadyAction();
    },

    _dispose: function() {
        this._cleanTemplates();
        this._contentReadyAction = null;

        this.callBase();
    },

    _clean: function() {
        this._cleanFocusState();

        this.callBase();
        this.element().empty();
    },

    _toggleVisibility: function(visible) {
        this.element().toggleClass(INVISIBLE_STATE_CLASS, !visible);
        this.setAria("hidden", !visible || undefined);
    },

    _renderFocusState: function() {
        if(!this.option("focusStateEnabled") || this.option("disabled")) {
            return;
        }

        this._renderFocusTarget();
        this._attachFocusEvents();
        this._attachKeyboardEvents();
        this._renderAccessKey();
    },

    _renderAccessKey: function() {
        var focusTarget = this._focusTarget();
        focusTarget.attr("accesskey", this.option("accessKey"));

        var clickNamespace = eventUtils.addNamespace(clickEvent.name, UI_FEEDBACK);

        focusTarget.off(clickNamespace);

        this.option("accessKey") && focusTarget.on(clickNamespace, (function(e) {
            if(eventUtils.isFakeClickEvent(e)) {
                e.stopImmediatePropagation();
                this.focus();
            }
        }).bind(this));
    },

    _eventBindingTarget: function() {
        return this.element();
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

    _detachFocusEvents: function() {
        var $element = this._focusTarget(),
            namespace = this.NAME + FOCUS_NAMESPACE,
            focusEvents = eventUtils.addNamespace("focusin", namespace);

        focusEvents = focusEvents + " " + eventUtils.addNamespace("focusout", namespace);

        if(beforeActivateExists) {
            focusEvents = focusEvents + " " + eventUtils.addNamespace("beforeactivate", namespace);
        }

        $element.off(focusEvents);
    },

    _attachFocusEvents: function() {
        var namespace = this.NAME + FOCUS_NAMESPACE,
            focusInEvent = eventUtils.addNamespace("focusin", namespace),
            focusOutEvent = eventUtils.addNamespace("focusout", namespace);

        this._focusTarget()
            .on(focusInEvent, this._focusInHandler.bind(this))
            .on(focusOutEvent, this._focusOutHandler.bind(this));

        if(beforeActivateExists) {
            var beforeActivateEvent = eventUtils.addNamespace("beforeactivate", namespace);
            this._focusTarget()
                .on(beforeActivateEvent, function(e) {
                    if(!$(e.target).is(selectors.focusable)) {
                        e.preventDefault();
                    }
                });
        }
    },

    _refreshFocusEvent: function() {
        this._detachFocusEvents();
        this._attachFocusEvents();
    },

    _focusInHandler: function(e) {
        var that = this;

        that._createActionByOption("onFocusIn", {
            beforeExecute: function() {
                that._updateFocusState(e, true);
            },
            excludeValidators: ["readOnly"]
        })({ jQueryEvent: e });
    },

    _focusOutHandler: function(e) {
        var that = this;

        that._createActionByOption("onFocusOut", {
            beforeExecute: function() {
                that._updateFocusState(e, false);
            },
            excludeValidators: ["readOnly", "disabled"]
        })({ jQueryEvent: e });
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

    _attachKeyboardEvents: function() {
        var processor = this.option("_keyboardProcessor") || new KeyboardProcessor({
            element: this._keyboardEventBindingTarget(),
            focusTarget: this._focusTarget()
        });

        this._keyboardProcessor = processor.reinitialize(this._keyboardHandler, this);
    },

    _keyboardHandler: function(options) {
        var e = options.originalEvent,
            key = options.key;

        var keys = this._supportedKeys(),
            func = keys[key];

        if(func !== undefined) {
            var handler = func.bind(this);
            return handler(e) || false;
        } else {
            return true;
        }
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

        if(this._keyboardProcessor) {
            this._keyboardProcessor.dispose();
        }
    },

    _attachHoverEvents: function() {
        var that = this,
            hoverableSelector = that._activeStateUnit,
            nameStart = eventUtils.addNamespace(hoverEvents.start, UI_FEEDBACK),
            nameEnd = eventUtils.addNamespace(hoverEvents.end, UI_FEEDBACK);

        that._eventBindingTarget()
            .off(nameStart, hoverableSelector)
            .off(nameEnd, hoverableSelector);

        if(that.option("hoverStateEnabled")) {
            var startAction = new Action(function(args) {
                that._hoverStartHandler(args.event);
                var $target = args.element;
                that._refreshHoveredElement($target);
            }, {
                excludeValidators: ["readOnly"]
            });

            that._eventBindingTarget()
                .on(nameStart, hoverableSelector, function(e) {
                    startAction.execute({
                        element: $(e.target),
                        event: e
                    });
                })
                .on(nameEnd, hoverableSelector, function(e) {
                    that._hoverEndHandler(e);
                    that._forgetHoveredElement();
                });
        } else {
            that._toggleHoverClass(false);
        }
    },

    _hoverStartHandler: commonUtils.noop,

    _hoverEndHandler: commonUtils.noop,

    _attachFeedbackEvents: function() {
        var that = this,
            feedbackSelector = that._activeStateUnit,
            activeEventName = eventUtils.addNamespace(feedbackEvents.active, UI_FEEDBACK),
            inactiveEventName = eventUtils.addNamespace(feedbackEvents.inactive, UI_FEEDBACK),
            feedbackAction,
            feedbackActionDisabled;

        that._eventBindingTarget()
            .off(activeEventName, feedbackSelector)
            .off(inactiveEventName, feedbackSelector);

        if(that.option("activeStateEnabled")) {
            var feedbackActionHandler = function(args) {
                var $element = args.element,
                    value = args.value,
                    jQueryEvent = args.jQueryEvent;

                that._toggleActiveState($element, value, jQueryEvent);
            };

            that._eventBindingTarget()
                .on(activeEventName, feedbackSelector, { timeout: that._feedbackShowTimeout }, function(e) {
                    feedbackAction = feedbackAction || new Action(feedbackActionHandler);
                    feedbackAction.execute({
                        element: $(e.currentTarget),
                        value: true,
                        jQueryEvent: e
                    });
                })
                .on(inactiveEventName, feedbackSelector, { timeout: that._feedbackHideTimeout }, function(e) {
                    feedbackActionDisabled = feedbackActionDisabled || new Action(feedbackActionHandler, { excludeValidators: ["disabled", "readOnly"] });
                    feedbackActionDisabled.execute({
                        element: $(e.currentTarget),
                        value: false,
                        jQueryEvent: e
                    });
                });
        }
    },

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
        this.element().toggleClass(DISABLED_STATE_CLASS, Boolean(value));
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
            case "_keyboardProcessor":
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
                    //TODO hiding works wrong
                    this._checkVisibilityChanged(args.value ? "shown" : "hiding");
                }
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

            if(attrValue === null || attrValue === undefined) {
                attrValue = undefined;
            } else {
                attrValue = attrValue.toString();
            }

            domUtils.toggleAttr(option.target, attrName, attrValue);
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
    * @name WidgetMethods_repaint
    * @publicName repaint()
    */
    repaint: function() {
        this._refresh();
    },

    /**
    * @name WidgetMethods_focus
    * @publicName focus()
    */
    focus: function() {
        this._focusTarget().focus();
    },

    /**
    * @name WidgetMethods_registerKeyHandler
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

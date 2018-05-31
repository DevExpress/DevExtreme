"use strict";

var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    iconUtils = require("../core/utils/icon"),
    domUtils = require("../core/utils/dom"),
    devices = require("../core/devices"),
    registerComponent = require("../core/component_registrator"),
    extend = require("../core/utils/extend").extend,
    ValidationMixin = require("./validation/validation_mixin"),
    ValidationEngine = require("./validation_engine"),
    Widget = require("./widget/ui.widget"),
    inkRipple = require("./widget/utils.ink_ripple"),
    eventUtils = require("../events/utils"),
    themes = require("./themes"),
    clickEvent = require("../events/click"),
    FunctionTemplate = require("./widget/function_template");

var BUTTON_CLASS = "dx-button",
    BUTTON_CONTENT_CLASS = "dx-button-content",
    BUTTON_HAS_TEXT_CLASS = "dx-button-has-text",
    BUTTON_HAS_ICON_CLASS = "dx-button-has-icon",

    TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper",

    BUTTON_TEXT_CLASS = "dx-button-text",

    ANONYMOUS_TEMPLATE_NAME = "content",

    BUTTON_FEEDBACK_HIDE_TIMEOUT = 100;

/**
* @name dxButton
* @inherits Widget
* @module ui/button
* @export default
*/
var Button = Widget.inherit({

    _supportedKeys: function() {
        var that = this,
            click = function(e) {
                e.preventDefault();
                that._executeClickAction(e);
            };
        return extend(this.callBase(), {
            space: click,
            enter: click
        });
    },

    _setDeprecatedOptions: function() {
        this.callBase();

    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            /**
             * @name dxButtonOptions.hoverStateEnabled
             * @type boolean
             * @default true
             * @inheritdoc
             */
            hoverStateEnabled: true,

            /**
            * @name dxButtonOptions.onClick
            * @type function(e)|string
            * @extends Action
            * @type_function_param1 e:object
            * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field5 event:event
            * @type_function_param1_field6 validationGroup:object
            * @action
            */
            onClick: null,

            /**
            * @name dxButtonOptions.type
            * @type Enums.ButtonType
            * @default 'normal'
            */
            type: "normal",

            /**
            * @name dxButtonOptions.text
            * @type string
            * @default ""
            */
            text: "",

            /**
            * @name dxButtonOptions.icon
            * @type string
            * @default ""
            */
            icon: "",

            /**
            * @name dxButtonOptions.validationGroup
            * @type string
            * @default undefined
            */
            validationGroup: undefined,

            /**
             * @name dxButtonOptions.activeStateEnabled
             * @type boolean
             * @default true
             */
            activeStateEnabled: true,

            /**
            * @name dxButtonOptions.template
            * @type template|function
            * @default "content"
            * @type_function_param1 buttonData:object
            * @type_function_param1_field1 text:string
            * @type_function_param1_field2 icon:string
            * @type_function_param2 contentElement:dxElement
            * @type_function_return string|Node|jQuery
            */
            template: "content",

            /**
            * @name dxButtonOptions.useSubmitBehavior
            * @type boolean
            * @default false
            */
            useSubmitBehavior: false,

            useInkRipple: false

            /**
            * @name dxButtonDefaultTemplate
            * @type object
            */
            /**
            * @name dxButtonDefaultTemplate.text
            * @type String
            */
            /**
            * @name dxButtonDefaultTemplate.icon
            * @type String
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxButtonOptions.focusStateEnabled
                    * @type boolean
                    * @default true @for desktop
                    * @inheritdoc
                    */
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return /(android5|material)/.test(themes.current());
                },
                options: {
                    useInkRipple: true
                }
            }
        ]);
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _feedbackHideTimeout: BUTTON_FEEDBACK_HIDE_TIMEOUT,

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["content"] = new FunctionTemplate(function(options) {
            var data = options.model,
                $iconElement = iconUtils.getImageContainer(data && data.icon),
                $textContainer = data && data.text ? $("<span>").text(data.text).addClass(BUTTON_TEXT_CLASS) : undefined;

            $(options.container).append($iconElement).append($textContainer);
        }, this);
    },

    _initMarkup: function() {
        this.$element().addClass(BUTTON_CLASS);
        this._renderType();

        this.option("useInkRipple") && this._renderInkRipple();
        this._renderClick();

        this.setAria("role", "button");
        this._updateAriaLabel();

        this.callBase();

        this._updateContent();
    },

    _renderInkRipple: function() {
        var isOnlyIconButton = (!this.option("text") && this.option("icon")) || (this.option("type") === "back"),
            config = {};

        if(isOnlyIconButton) {
            extend(config, {
                waveSizeCoefficient: 1,
                useHoldAnimation: false,
                isCentered: true
            });
        }

        this._inkRipple = inkRipple.render(config);
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);

        if(!this._inkRipple) {
            return;
        }

        var config = {
            element: this._$content,
            event: e
        };

        if(value) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
    },

    _updateContent: function() {
        var $element = this.$element(),
            data = this._getContentData();

        if(this._$content) {
            this._$content.empty();
        } else {
            this._$content = $("<div>")
                .addClass(BUTTON_CONTENT_CLASS)
                .appendTo($element);
        }

        $element
            .toggleClass(BUTTON_HAS_ICON_CLASS, !!data.icon)
            .toggleClass(BUTTON_HAS_TEXT_CLASS, !!data.text);

        var template = this._getTemplateByOption("template"),
            $result = $(template.render({
                model: data,
                container: domUtils.getPublicElement(this._$content)
            }));

        if($result.hasClass(TEMPLATE_WRAPPER_CLASS)) {
            this._$content.replaceWith($result);
            this._$content = $result;
            this._$content.addClass(BUTTON_CONTENT_CLASS);
        }

        if(this.option("useSubmitBehavior")) {
            this._renderSubmitInput();
        }
    },

    _renderSubmitInput: function() {
        var submitAction = this._createAction(function(args) {
            var e = args.event,
                validationGroup = ValidationEngine.getGroupConfig(args.component._findGroup());

            if(validationGroup && !validationGroup.validate().isValid) {
                e.preventDefault();
            }
            e.stopPropagation();
        });

        this._$submitInput = $("<input>")
            .attr("type", "submit")
            .addClass("dx-button-submit-input")
            .appendTo(this._$content);

        eventsEngine.on(this._$submitInput, "click", function(e) {
            submitAction({ event: e });
        });
    },

    _getContentData: function() {
        var icon = this.option("icon"),
            text = this.option("text"),
            back = this.option("type") === "back";

        if(back && !icon) {
            icon = "back";
        }

        return {
            icon: icon,
            text: text
        };
    },

    _renderClick: function() {
        var that = this,
            eventName = eventUtils.addNamespace(clickEvent.name, this.NAME),
            actionConfig = { };

        if(this.option("useSubmitBehavior")) {
            actionConfig.afterExecute = function(e) {
                setTimeout(function() {
                    e.component._$submitInput.get(0).click();
                });
            };
        }

        this._clickAction = this._createActionByOption("onClick", actionConfig);

        eventsEngine.off(this.$element(), eventName);
        eventsEngine.on(this.$element(), eventName, function(e) {
            that._executeClickAction(e);
        });
    },

    _executeClickAction: function(e) {
        this._clickAction({ event: e, validationGroup: ValidationEngine.getGroupConfig(this._findGroup()) });
    },

    _updateAriaLabel: function() {
        var icon = this.option("icon"),
            text = this.option("text");

        if(iconUtils.getImageSourceType(icon) === "image") {
            if(icon.indexOf("base64") === -1) {
                icon = icon.replace(/.+\/([^\.]+)\..+$/, "$1");
            } else {
                icon = "Base64";
            }
        }

        var ariaLabel = text || icon || "";
        ariaLabel = ariaLabel.toString().trim();

        this.setAria("label", ariaLabel);
    },

    _renderType: function() {
        var type = this.option("type");
        if(type) {
            this.$element().addClass("dx-button-" + type);
        }
    },

    _refreshType: function(prevType) {
        var type = this.option("type");

        prevType && this.$element()
            .removeClass("dx-button-" + prevType)
            .addClass("dx-button-" + type);

        if(!this.$element().hasClass(BUTTON_HAS_ICON_CLASS) && type === "back") {
            this._updateContent();
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "onClick":
                this._renderClick();
                break;
            case "icon":
            case "text":
                this._updateContent();
                this._updateAriaLabel();
                break;
            case "type":
                this._refreshType(args.previousValue);
                this._updateContent();
                this._updateAriaLabel();
                break;
            case "template":
                this._updateContent();
                break;
            case "useInkRipple":
                this._invalidate();
                break;
            case "useSubmitBehavior":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    _clean: function() {
        this.callBase();
        delete this._$content;
        delete this._inkRipple;
    }

}).include(ValidationMixin);

registerComponent("dxButton", Button);

module.exports = Button;

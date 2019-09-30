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
    FunctionTemplate = require("../core/templates/function_template").FunctionTemplate;

var BUTTON_CLASS = "dx-button",
    BUTTON_CONTENT_CLASS = "dx-button-content",
    BUTTON_HAS_TEXT_CLASS = "dx-button-has-text",
    BUTTON_HAS_ICON_CLASS = "dx-button-has-icon",
    BUTTON_ICON_RIGHT_CLASS = "dx-button-icon-right",
    ICON_RIGHT_CLASS = "dx-icon-right",
    BUTTON_STYLING_MODE_CLASS_PREFIX = "dx-button-mode-",
    ALLOWED_STYLE_CLASSES = [
        BUTTON_STYLING_MODE_CLASS_PREFIX + "contained",
        BUTTON_STYLING_MODE_CLASS_PREFIX + "text",
        BUTTON_STYLING_MODE_CLASS_PREFIX + "outlined"
    ],

    TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper",

    BUTTON_TEXT_CLASS = "dx-button-text",

    ANONYMOUS_TEMPLATE_NAME = "content",

    BUTTON_LEFT_ICON_POSITION = "left",

    BUTTON_FEEDBACK_HIDE_TIMEOUT = 100;

/**
* @name dxButton
* @inherits Widget
* @hasTranscludedContent
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
             */
            hoverStateEnabled: true,

            /**
            * @name dxButtonOptions.onClick
            * @type function(e)
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

            iconPosition: BUTTON_LEFT_ICON_POSITION,

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

            useInkRipple: false,
            _templateData: {},

            /**
            * @name dxButtonOptions.stylingMode
            * @type Enums.ButtonStylingMode
            * @default 'contained'
            */
            stylingMode: "contained"

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
                    */
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    var themeName = themes.current();
                    return themes.isMaterial(themeName);
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
        var that = this;

        this._defaultTemplates["content"] = new FunctionTemplate(function(options) {
            var data = options.model,
                $iconElement = iconUtils.getImageContainer(data && data.icon),
                $textContainer = data && data.text ? $("<span>").text(data.text).addClass(BUTTON_TEXT_CLASS) : undefined,
                $container = $(options.container);

            $container.append($textContainer);

            if(that.option("iconPosition") === BUTTON_LEFT_ICON_POSITION) {
                $container.prepend($iconElement);
            } else {
                $iconElement.addClass(ICON_RIGHT_CLASS);
                $container.append($iconElement);
            }
        });
    },

    _initMarkup: function() {
        this.$element().addClass(BUTTON_CLASS);
        this._renderType();
        this._renderStylingMode();

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
        const $element = this.$element(),
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
            .toggleClass(BUTTON_ICON_RIGHT_CLASS, !!data.icon && this.option("iconPosition") !== BUTTON_LEFT_ICON_POSITION)
            .toggleClass(BUTTON_HAS_TEXT_CLASS, !!data.text);

        const transclude = this._getAnonymousTemplateName() === this.option("template"),
            template = this._getTemplateByOption("template"),
            $result = $(template.render({
                model: data,
                container: domUtils.getPublicElement(this._$content),
                transclude
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

    _setDisabled: function(value) {
        this.option("disabled", value);
    },

    _waitForValidationCompleting: function(complete) {
        complete.then((result) => {
            this._validationStatus = result.status;
            this._setDisabled(false);
            if(this._validationStatus === "valid") {
                this._$submitInput.get(0).click();
            }
            return result;
        });
    },

    _getSubmitAction: function() {
        return this._createAction(({ event: e }) => {
            if(this._needValidate) {
                const validationGroup = ValidationEngine.getGroupConfig(this._findGroup());
                if(validationGroup) {
                    const result = validationGroup.validate();
                    this._validationStatus = result.status;
                    if(this._validationStatus === "pending") {
                        this._needValidate = false;
                        this._setDisabled(true);
                        this._waitForValidationCompleting(result.complete);
                    }
                }
            } else {
                this._needValidate = true;
            }
            this._validationStatus !== "valid" && e.preventDefault();
            e.stopPropagation();
        });
    },

    _renderSubmitInput: function() {
        const submitAction = this._getSubmitAction();
        this._needValidate = true;
        this._validationStatus = "valid";
        this._$submitInput = $("<input>")
            .attr("type", "submit")
            .attr("tabindex", -1)
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

        return extend({
            icon: icon,
            text: text
        }, this.option("_templateData"));
    },

    _renderClick: function() {
        var that = this,
            eventName = eventUtils.addNamespace(clickEvent.name, this.NAME),
            actionConfig = { excludeValidators: ["readOnly"] };

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
                icon = icon.replace(/.+\/([^.]+)\..+$/, "$1");
            } else {
                icon = "Base64";
            }
        }

        var ariaLabel = text || icon || "";
        ariaLabel = ariaLabel.toString().trim();

        this.setAria("label", ariaLabel.length ? ariaLabel : null);
    },

    _renderType: function() {
        var type = this.option("type");
        if(type) {
            this.$element().addClass("dx-button-" + type);
        }
    },

    _renderStylingMode: function() {
        const optionName = "stylingMode";
        ALLOWED_STYLE_CLASSES.forEach(className => this.$element().removeClass(className));
        let stylingModeClass = BUTTON_STYLING_MODE_CLASS_PREFIX + this.option(optionName);
        if(ALLOWED_STYLE_CLASSES.indexOf(stylingModeClass) === -1) {
            const defaultOptionValue = this._getDefaultOptions()[optionName];
            stylingModeClass = BUTTON_STYLING_MODE_CLASS_PREFIX + defaultOptionValue;
        }
        this.$element().addClass(stylingModeClass);
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
            case "_templateData":
                break;
            case "template":
            case "iconPosition":
                this._updateContent();
                break;
            case "stylingMode":
                this._renderStylingMode();
                break;
            case "useInkRipple":
            case "useSubmitBehavior":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    _clean: function() {
        delete this._inkRipple;
        this.callBase();
        delete this._$content;
    }

}).include(ValidationMixin);

registerComponent("dxButton", Button);

module.exports = Button;

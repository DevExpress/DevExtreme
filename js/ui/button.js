import $ from '../core/renderer';
import devices from '../core/devices';
import eventsEngine from '../events/core/events_engine';
import inkRipple from './widget/utils.ink_ripple';
import registerComponent from '../core/component_registrator';
import themes from './themes';
import ValidationEngine from './validation_engine';
import Widget from './widget/ui.widget';
import { addNamespace } from '../events/utils';
import { extend } from '../core/utils/extend';
import { FunctionTemplate } from '../core/templates/function_template';
import { getImageContainer, getImageSourceType } from '../core/utils/icon';
import { getPublicElement } from '../core/utils/dom';
import { name as clickEventName } from '../events/click';

/**
* @name dxButton
* @inherits Widget
* @hasTranscludedContent
* @module ui/button
* @export default
*/
class Button extends Widget {
    constructor(...args) {
        super(...args);

        this._feedbackHideTimeout = 100;
    }

    _clean() {
        delete this._inkRipple;
        delete this._$content;
        super._clean();
    }

    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([
            {
                device: () => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
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
                device: () => themes.isMaterial(themes.current()),
                options: { useInkRipple: true }
            }
        ]);
    }

    _executeClickAction(event) {
        this._clickAction({
            validationGroup: this._validationGroupConfig,
            event
        });
    }

    _findGroup() {
        const $element = this.$element();

        return this.option('validationGroup') ||
            ValidationEngine.findGroup($element, this._modelByElement($element));

    }

    _getAnonymousTemplateName() {
        return 'content';
    }

    _getContentData() {
        const { icon, text, type, _templateData } = this.option();

        return extend({
            icon: (type === 'back' && !icon) ? 'back' : icon,
            text
        }, _templateData);
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {

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
            type: 'normal',

            /**
            * @name dxButtonOptions.text
            * @type string
            * @default ""
            */
            text: '',

            /**
            * @name dxButtonOptions.icon
            * @type string
            * @default ""
            */
            icon: '',

            iconPosition: 'left',

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
            template: 'content',

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
            stylingMode: 'contained'

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
    }

    _getSubmitAction() {
        return this._createAction(({ event: e }) => {
            if(this._needValidate) {
                const validationGroup = this._validationGroupConfig;

                if(validationGroup) {
                    const { status, complete } = validationGroup.validate();

                    this._validationStatus = status;

                    if(status === 'pending') {
                        this._needValidate = false;
                        this._setDisabled(true);
                        this._waitForValidationCompleting(complete);
                    }
                }
            } else {
                this._needValidate = true;
            }
            this._validationStatus !== 'valid' && e.preventDefault();
            e.stopPropagation();
        });
    }

    _initMarkup() {
        this.$element().addClass('dx-button');
        this._renderType();
        this._renderStylingMode();

        this.option('useInkRipple') && this._renderInkRipple();
        this._renderClick();

        this.setAria('role', 'button');
        this._updateAriaLabel();

        super._initMarkup();

        this._updateContent();
    }

    _initTemplates() {
        super._initTemplates();

        this._defaultTemplates['content'] = new FunctionTemplate(({ model = {}, container }) => {
            const { text, icon } = model;
            const $icon = getImageContainer(icon);
            const $textContainer = text && $('<span>').text(text).addClass('dx-button-text');
            const $container = $(container);

            $container.append($textContainer);

            if(this.option('iconPosition') === 'left') {
                $container.prepend($icon);
            } else {
                $icon.addClass('dx-icon-right');
                $container.append($icon);
            }
        });
    }

    _optionChanged(args) {
        const { name, previousValue } = args;

        switch(name) {
            case 'onClick':
                this._renderClick();
                break;
            case 'icon':
            case 'text':
                this._updateContent();
                this._updateAriaLabel();
                break;
            case 'type':
                this._refreshType(previousValue);
                this._updateContent();
                this._updateAriaLabel();
                break;
            case '_templateData':
                break;
            case 'template':
            case 'iconPosition':
                this._updateContent();
                break;
            case 'stylingMode':
                this._renderStylingMode();
                break;
            case 'useInkRipple':
            case 'useSubmitBehavior':
                this._invalidate();
                break;
            default:
                super._optionChanged(args);
        }
    }

    _refreshType(prevType) {
        const type = this.option('type');
        const $element = this.$element();

        prevType && $element
            .removeClass(`dx-button-${prevType}`)
            .addClass(`dx-button-${type}`);

        if(!$element.hasClass('dx-button-has-icon') && type === 'back') {
            this._updateContent();
        }
    }

    _renderClick() {
        const actionConfig = { excludeValidators: ['readOnly'] };

        if(this.option('useSubmitBehavior')) {
            actionConfig.afterExecute = ({ component }) =>
                setTimeout(() => component._$submitInput.get(0).click());
        }

        this._clickAction = this._createActionByOption('onClick', actionConfig);

        const $element = this.$element();
        const eventName = addNamespace(clickEventName, this.NAME);

        eventsEngine.off($element, eventName);
        eventsEngine.on($element, eventName, this._executeClickAction.bind(this));
    }

    _renderInkRipple() {
        const { text, icon, type } = this.option();
        const isOnlyIconButton = !text && icon || type === 'back';
        const config = {};

        if(isOnlyIconButton) {
            extend(config, {
                waveSizeCoefficient: 1,
                useHoldAnimation: false,
                isCentered: true
            });
        }

        this._inkRipple = inkRipple.render(config);
    }

    _renderStylingMode() {
        const $element = this.$element();
        const stylingMode = this.option('stylingMode');
        let stylingModeClass = `dx-button-mode-${stylingMode}`;

        ['dx-button-mode-contained', 'dx-button-mode-text', 'dx-button-mode-outlined']
            .forEach($element.removeClass.bind($element));

        if(['contained', 'text', 'outlined'].indexOf(stylingMode) === -1) {
            const defaultOptionValue = this._getDefaultOptions()['stylingMode'];

            stylingModeClass = `dx-button-mode-${defaultOptionValue}`;
        }

        $element.addClass(stylingModeClass);
    }

    _renderSubmitInput() {
        const submitAction = this._getSubmitAction();

        this._needValidate = true;
        this._validationStatus = 'valid';
        this._$submitInput = $('<input>')
            .attr('type', 'submit')
            .attr('tabindex', -1)
            .addClass('dx-button-submit-input')
            .appendTo(this._$content);

        eventsEngine.on(this._$submitInput, 'click', e => submitAction({ event: e }));
    }

    _renderType() {
        const type = this.option('type');

        type && this.$element().addClass(`dx-button-${type}`);
    }

    _setDisabled(value) {
        this.option('disabled', value);
    }

    _supportedKeys() {
        const click = e => {
            e.preventDefault();
            this._executeClickAction(e);
        };

        return extend(super._supportedKeys(), { space: click, enter: click });
    }

    _toggleActiveState($el, value, event) {
        super._toggleActiveState($el, value, event);

        if(this._inkRipple) {
            const config = { element: this._$content, event };

            value ? this._inkRipple.showWave(config) : this._inkRipple.hideWave(config);
        }
    }

    _updateAriaLabel() {
        let { icon, text } = this.option();

        if(getImageSourceType(icon) === 'image') {
            icon = icon.indexOf('base64') === -1 ? icon.replace(/.+\/([^.]+)\..+$/, '$1') : 'Base64';
        }

        let ariaLabel = text || icon || '';

        ariaLabel = ariaLabel.toString().trim();

        this.setAria('label', ariaLabel.length ? ariaLabel : null);
    }

    _updateContent() {
        const $element = this.$element();
        const data = this._getContentData();
        const { icon, text } = data;

        this._$content ? this._$content.empty() : this._$content = $('<div>')
            .addClass('dx-button-content')
            .appendTo($element);

        $element
            .toggleClass('dx-button-has-icon', !!icon)
            .toggleClass('dx-button-icon-right', !!icon && this.option('iconPosition') !== 'left')
            .toggleClass('dx-button-has-text', !!text);

        const transclude = this._getAnonymousTemplateName() === this.option('template');
        const template = this._getTemplateByOption('template');
        const $result = $(template.render({
            model: data,
            container: getPublicElement(this._$content),
            transclude
        }));

        if($result.hasClass('dx-template-wrapper')) {
            this._$content.replaceWith($result);
            this._$content = $result;
            this._$content.addClass('dx-button-content');
        }

        this.option('useSubmitBehavior') && this._renderSubmitInput();
    }

    get _validationGroupConfig() {
        return ValidationEngine.getGroupConfig(this._findGroup());
    }

    _waitForValidationCompleting(complete) {
        complete.then(result => {
            this._validationStatus = result.status;
            this._setDisabled(false);
            this._validationStatus === 'valid' && this._$submitInput.get(0).click();

            return result;
        });
    }
}

registerComponent('dxButton', Button);

module.exports = Button;

import $ from '../core/renderer';
import devices from '../core/devices';
import inkRipple from './widget/utils.ink_ripple';
import registerComponent from '../core/component_registrator';
import themes from './themes';
import Action from '../core/action';
import ValidationEngine from './validation_engine';
import Widget from './widget/ui.widget';
import { active as activeEvents, click as clickEvent, dxClick as dxClickEvent } from '../events/core/events_engine';
import { extend } from '../core/utils/extend';
import { FunctionTemplate } from '../core/templates/function_template';
import { getImageContainer, getImageSourceType } from '../core/utils/icon';
import { getPublicElement } from '../core/utils/dom';

const ANONYMOUS_TEMPLATE_NAME = 'content';

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

    _$content() {
        return this.$element().find('.dx-button-content');
    }

    _$submitInput() {
        return this.$element().find('.dx-button-submit-input');
    }

    _attachActiveEvents(active, inactive) {
        const $el = this._eventBindingTarget();
        const namespace = 'inkRipple';
        const selector = this._activeStateUnit;

        activeEvents.off($el, { namespace, selector });
        activeEvents.on($el,
            new Action(active),
            new Action(inactive, { excludeValidators: ['disabled', 'readOnly'] }), {
                showTimeout: this._feedbackShowTimeout,
                hideTimeout: this._feedbackHideTimeout,
                selector,
                namespace
            }
        );
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
        const model = this._modelByElement($element);
        const { validationGroup } = this.option();

        return validationGroup || ValidationEngine.findGroup($element, model);
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
        let needValidate = true;
        let validationStatus = 'valid';

        return this._createAction(({ event }) => {
            if(needValidate) {
                const validationGroup = this._validationGroupConfig;

                if(validationGroup) {
                    const { status, complete } = validationGroup.validate();

                    validationStatus = status;

                    if(status === 'pending') {
                        needValidate = false;
                        this.option('disabled', true);

                        complete.then(({ status }) => {
                            needValidate = true;
                            this.option('disabled', false);

                            validationStatus = status;
                            validationStatus === 'valid' && this._submitInput().click();
                        });
                    }
                }
            }

            validationStatus !== 'valid' && event.preventDefault();
            event.stopPropagation();
        });
    }

    _initMarkup() {
        this.$element().addClass('dx-button');

        this._renderType();
        this._renderStylingMode();
        this._renderInkRipple();
        this._renderClick();

        this._updateAriaLabel();

        super._initMarkup();

        this._updateContent();
        this._renderSubmitInput();
        this.setAria('role', 'button');
    }

    _initTemplates() {
        this._templateManager.anonymousTemplateName = ANONYMOUS_TEMPLATE_NAME;
        this._templateManager.addDefaultTemplate({
            ['content']: new FunctionTemplate(({ model = {}, container }) => {
                const { text, icon } = model;
                const { iconPosition } = this.option();
                const $icon = getImageContainer(icon);
                const $textContainer = text && $('<span>').text(text).addClass('dx-button-text');
                const $container = $(container);

                $container.append($textContainer);

                if(iconPosition === 'left') {
                    $container.prepend($icon);
                } else {
                    $icon.addClass('dx-icon-right');
                    $container.append($icon);
                }
            })
        });
        super._initTemplates();
    }

    _optionChanged(args) {
        const { name, previousValue } = args;

        switch(name) {
            case 'onClick':
                this._updateClick();
                break;
            case 'icon':
            case 'text':
                this._updateContent();
                this._updateAriaLabel();
                break;
            case 'type':
                this._updateType(previousValue);
                this._updateContent();
                break;
            case '_templateData':
                break;
            case 'template':
            case 'iconPosition':
                this._updateContent();
                break;
            case 'stylingMode':
                this._updateStylingMode();
                break;
            case 'useSubmitBehavior':
                this._updateSubmitInput();
                break;
            case 'useInkRipple':
                this._invalidate();
                break;
            default:
                super._optionChanged(args);
        }
    }

    _renderClick() {
        const $el = this.$element();

        dxClickEvent.off($el, { namespace: this.NAME });
        dxClickEvent.on($el, event => this._executeClickAction(event),
            { namespace: this.NAME });
        this._updateClick();
    }

    _renderInkRipple() {
        const { text, icon, type, useInkRipple } = this.option();

        if(useInkRipple) {
            const isOnlyIconButton = !text && icon || type === 'back';
            const _inkRipple = inkRipple.render(isOnlyIconButton ? {
                waveSizeCoefficient: 1,
                useHoldAnimation: false,
                isCentered: true
            } : {});
            const changeWaveVisibility = (event, visible) => {
                const { activeStateEnabled } = this.option();

                if(activeStateEnabled && !this._disposed) {
                    const config = { element: this._$content(), event };

                    visible ? _inkRipple.showWave(config) : _inkRipple.hideWave(config);
                }
            };

            this._attachActiveEvents(
                ({ event }) => changeWaveVisibility(event, true),
                ({ event }) => changeWaveVisibility(event)
            );
        }
    }

    _renderStylingMode() {
        const $element = this.$element();
        let { stylingMode } = this.option();

        if(['contained', 'text', 'outlined'].indexOf(stylingMode) === -1) {
            stylingMode = this._getDefaultOptions().stylingMode;
        }

        $element.addClass(`dx-button-mode-${stylingMode}`);
    }

    _renderSubmitInput() {
        const { useSubmitBehavior } = this.option();

        if(useSubmitBehavior) {
            const submitAction = this._getSubmitAction();
            const $content = this._$content();

            $('<input>')
                .attr('type', 'submit')
                .attr('tabindex', -1)
                .addClass('dx-button-submit-input')
                .appendTo($content);

            clickEvent.on(this._$submitInput(), event => submitAction({ event }));
        }
    }

    _renderType() {
        const { type } = this.option();
        const $element = this.$element();

        type && $element.addClass(`dx-button-${type}`);
    }

    _submitInput() {
        return this._$submitInput().get(0);
    }

    _supportedKeys() {
        const click = e => {
            e.preventDefault();
            this._executeClickAction(e);
        };

        return extend(super._supportedKeys(), { space: click, enter: click });
    }

    _updateAriaLabel() {
        const ariaTarget = this._getAriaTarget();
        let { icon, text } = this.option();

        if(!text) {
            if(getImageSourceType(icon) === 'image') {
                icon = icon.indexOf('base64') === -1 ? icon.replace(/.+\/([^.]+)\..+$/, '$1') : 'Base64';
            }

            text = icon || '';
        }

        ariaTarget.attr('aria-label', text.trim() || null);
    }

    _updateClick() {
        this._clickAction = this._createActionByOption('onClick', {
            excludeValidators: ['readOnly'],
            afterExecute: () => {
                const { useSubmitBehavior } = this.option();

                useSubmitBehavior && setTimeout(() => this._submitInput().click());
            }
        });
    }

    _updateContent() {
        const $element = this.$element();
        let $content = this._$content();
        const data = this._getContentData();
        const { template, iconPosition } = this.option();
        const { icon, text } = data;

        $content.length ? $content.empty() : $content = $('<div>')
            .addClass('dx-button-content')
            .appendTo($element);

        $element
            .toggleClass('dx-button-has-icon', !!icon)
            .toggleClass('dx-button-icon-right', !!icon && iconPosition !== 'left')
            .toggleClass('dx-button-has-text', !!text);

        const $template = $(this._getTemplateByOption('template').render({
            model: data,
            container: getPublicElement($content),
            transclude: this._templateManager.anonymousTemplateName === template
        }));

        if($template.hasClass('dx-template-wrapper')) {
            $template.addClass('dx-button-content');
            $content.replaceWith($template);
        }
    }

    _updateSubmitInput() {
        const { useSubmitBehavior } = this.option();
        const $submitInput = this._$submitInput();

        if(!useSubmitBehavior && this._$submitInput) {
            $submitInput.remove();
        } else if(useSubmitBehavior && !this._$submitInput) {
            this._renderSubmitInput();
        }
    }

    _updateStylingMode() {
        const $element = this.$element();

        ['contained', 'text', 'outlined'].map(mode => `dx-button-mode-${mode}`)
            .forEach($element.removeClass.bind($element));

        this._renderStylingMode();
    }

    _updateType(previous) {
        const $element = this.$element();

        // TODO: temporary solution
        [previous, 'back', 'danger', 'default', 'normal', 'success'].map(type => `dx-button-${type}`)
            .forEach($element.removeClass.bind($element));

        this._renderType();
    }

    get _validationGroupConfig() {
        return ValidationEngine.getGroupConfig(this._findGroup());
    }
}

registerComponent('dxButton', Button);

module.exports = Button;

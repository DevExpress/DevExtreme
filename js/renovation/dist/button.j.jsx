import $ from '../../core/renderer';

import registerComponent from '../../core/component_registrator';
import ValidationEngine from '../../ui/validation_engine';
import Component from '../preact-wrapper/component';
import * as Preact from 'preact';
import ButtonView from '../button.p';
import { wrapElement, getInnerActionName, removeDifferentElements } from '../preact-wrapper/utils';
import { useLayoutEffect } from 'preact/hooks';
import { getPublicElement } from '../../core/utils/dom';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

const actions = {
    onClick: { excludeValidators: ['readOnly'] },
    onContentReady: { excludeValidators: ['disabled', 'readOnly'] },
};

class Button extends Component {
    getView() {
        return ButtonView;
    }

    getProps(isFirstRender) {
        const props = super.getProps(isFirstRender);

        if(props.template) {
            const template = this._getTemplate(props.template);

            props.render = ({ parentRef, ...restProps }) => {
                useLayoutEffect(() => {
                    const $parent = $(parentRef.current);
                    const $children = $parent.contents();

                    let $template = $(template.render({
                        container: getPublicElement($parent),
                        model: restProps,
                        transclude: this._templateManager.anonymousTemplateName === props.template,
                        // TODO index
                    }));

                    if($template.hasClass(TEMPLATE_WRAPPER_CLASS)) {
                        $template = wrapElement($parent, $template);
                    }
                    const $newChildren = $parent.contents();

                    return () => {
                        // NOTE: order is important
                        removeDifferentElements($children, $newChildren);
                    };
                }, Object.keys(props).map(key => props[key]));

                return (<Preact.Fragment/>);
            };
        }

        Object.keys(actions).forEach((name) => {
            props[name] = this.option(getInnerActionName(name));
        });

        props.validationGroup = ValidationEngine.getGroupConfig(this._findGroup());

        return {
            ref: this.view_ref,
            ...props
        };
    }

    focus() {
        this.view_ref.current.focus();
    }

    _findGroup() {
        const $element = this.$element();
        const model = this._modelByElement($element);
        const { validationGroup } = this.option();

        return validationGroup || ValidationEngine.findGroup($element, model);
    }

    _init() {
        // NOTE: if we have no template and have some children,
        //       then it is anonymous template and we should render these children
        const haveAnonymousTemplate = this.$element().contents().length > 0;
        const template = this.option('template');
        this.option('haveAnonymousTemplate', haveAnonymousTemplate);
        this._setAnonymousTemplateIfNeed(template);

        super._init();

        this.view_ref = Preact.createRef();

        if(this.option('useSubmitBehavior')) {
            this.option('onSubmit', this._getSubmitAction());
        }

        Object.keys(actions).forEach((name) => {
            this._addAction(name, actions[name]);
        });
    }

    _optionChanged(option) {
        const { name, value } = option;
        if(actions[name]) {
            this._addAction(name, actions[name]);
        }

        switch(name) {
            case 'useSubmitBehavior':
                value === true && this.option('onSubmit', this._getSubmitAction());
                break;
            case 'onOptionChanged':
                super._optionChanged(option);
                break;
            case 'template':
                this._setAnonymousTemplateIfNeed(value);
                break;
        }

        super._optionChanged();
    }

    _getSubmitAction() {
        let needValidate = true;
        let validationStatus = 'valid';

        return this._createAction(({ event, submitInput }) => {
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
                            validationStatus === 'valid' && submitInput.click();
                        });
                    }
                }
            }

            validationStatus !== 'valid' && event.preventDefault();
            event.stopPropagation();
        });
    }

    get _validationGroupConfig() {
        return ValidationEngine.getGroupConfig(this._findGroup());
    }

    // NOTE: should find a way, how we can pass anonymousTemplateName,
    //       or we should use one name for all anonymous template (BC)
    _getAnonymousTemplateName() {
        return 'content';
    }

    _setAnonymousTemplateIfNeed(template) {
        if(this.option('haveAnonymousTemplate') && !template) {
            this.option('template', this._getAnonymousTemplateName());
        }
    }
}

registerComponent('Button', Button);

module.exports = Button;

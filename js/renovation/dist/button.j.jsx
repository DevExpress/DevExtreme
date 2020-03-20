import $ from '../../core/renderer';
import * as Preact from 'preact';
import registerComponent from '../../core/component_registrator';
import ValidationEngine from '../../ui/validation_engine';
import Widget from '../preact-wrapper/component';
import { extend } from '../../core/utils/extend';
import ButtonView from '../button.p';
import { wrapElement, getInnerActionName } from '../preact-wrapper/utils';
import { useLayoutEffect, useState } from 'preact/hooks';
import { getPublicElement } from '../../core/utils/dom';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

const actions = {
    onClick: { excludeValidators: ['readOnly'] },
    onContentReady: { excludeValidators: ['disabled', 'readOnly'] },
};

class Button extends Widget {
    getView() {
        return ButtonView;
    }

    getProps(isFirstRender) {
        const props = super.getProps(isFirstRender);

        if(props.template) {
            const template = this._getTemplate(props.template);

            props.render = ({ parentRef, ...restProps }) => {
                // NOTE: Here we see on an old DOM tree, which was before template render
                const [$parent] = useState($(parentRef.current));
                $parent?.empty();

                useLayoutEffect(() => {
                    // NOTE: Here we see on an actual DOM tree
                    const $parent = $(parentRef.current);
                    let $template = $(template.render({
                        container: getPublicElement($parent),
                        model: restProps,
                    }));

                    if($template.hasClass(TEMPLATE_WRAPPER_CLASS)) {
                        $template = wrapElement($parent, $template);
                    }

                    return () => {
                        $template.remove();
                    };
                }, Object.keys(props).map(key => props[key]));

                return (<Preact.Fragment/>);
            };
        }

        Object.keys(actions).forEach((name) => {
            props[name] = this.option(getInnerActionName(name));
        });

        props.validationGroup = ValidationEngine.getGroupConfig(this._findGroup());
        console.log(this._initializing, this._initialized);

        return props;
    }

    _findGroup() {
        const $element = this.$element();
        const model = this._modelByElement($element);
        const { validationGroup } = this.option();

        return validationGroup || ValidationEngine.findGroup($element, model);
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            activeStateEnabled: true,
            focusStateEnabled: true,
            hoverStateEnabled: true,
            icon: '',
            iconPosition: 'left',
            template: '',
            text: '',
            useInkRipple: false,
            useSubmitBehavior: false,
            validationGroup: undefined,
        });
    }

    _init() {
        super._init();

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
}

registerComponent('Button', Button);

module.exports = Button;

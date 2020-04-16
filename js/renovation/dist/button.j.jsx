import $ from '../../core/renderer';

import registerComponent from '../../core/component_registrator';
import ValidationEngine from '../../ui/validation_engine';
import Component from '../preact-wrapper/component';
import * as Preact from 'preact';
import ButtonView from '../button.p';
import { wrapElement, getInnerActionName, removeDifferentElements } from '../preact-wrapper/utils';
import { useLayoutEffect } from 'preact/hooks';
import { getPublicElement } from '../../core/utils/dom';
import { extend } from '../../core/utils/extend';

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
        const { onKeyPress: defaultKeyPress } = props;

        if(props.template || props.haveAnonymousTemplate) {
            // NOTE: 'template' - default name for anonymous template
            const template = this._getTemplate(props.template || 'template');

            props.render = ({ parentRef, ...restProps }) => {
                useLayoutEffect(() => {
                    const $parent = $(parentRef.current);
                    const $children = $parent.contents();

                    let $template = $(template.render({
                        container: getPublicElement($parent),
                        model: restProps,
                        transclude: !props.template && props.haveAnonymousTemplate,
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

        props.onKeyPress = (event, options) => {
            const { originalEvent, keyName, which } = options;
            const keys = this._supportedKeys();
            const func = keys[keyName] || keys[which];

            // NOTE: registered handler has more priority
            if(func !== undefined) {
                const handler = func.bind(this);
                const result = handler(originalEvent, options);

                return { cancel: result?.cancel };
            }

            // NOTE: make possible pass onKeyPress property
            return defaultKeyPress?.(event, options);
        };

        return {
            ref: this.view_ref,
            ...props
        };
    }

    focus() {
        this.view_ref.current.focus();
    }

    registerKeyHandler(key, handler) {
        const currentKeys = this._supportedKeys();

        this._supportedKeys = () => extend(currentKeys, { [key]: handler });
    }

    _findGroup() {
        const $element = this.$element();
        const model = this._modelByElement($element);
        const { validationGroup } = this.option();

        return validationGroup || ValidationEngine.findGroup($element, model);
    }

    _init() {
        this.option('haveAnonymousTemplate', this.$element().contents().length > 0);
        super._init();

        this.view_ref = Preact.createRef();

        if(this.option('useSubmitBehavior')) {
            this.option('onSubmit', this._getSubmitAction());
        }

        Object.keys(actions).forEach((name) => {
            this._addAction(name, actions[name]);
        });

        this._supportedKeys = () => {
            return {};
        };
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

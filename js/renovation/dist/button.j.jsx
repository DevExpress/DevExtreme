import $ from '../../core/renderer';
import * as Preact from 'preact';
import registerComponent from '../../core/component_registrator';
import Widget from '../preact-wrapper/component';
import { extend } from '../../core/utils/extend';
import ButtonView from '../button.p';
import { wrapElement, getInnerActionName } from '../preact-wrapper/utils';
import { useLayoutEffect } from 'preact/hooks';
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
                useLayoutEffect(() => {
                    const $parent = $(parentRef.current);
                    let $template = $(template.render({
                        container: getPublicElement($parent),
                        model: restProps,
                    }));

                    if($template.hasClass(TEMPLATE_WRAPPER_CLASS)) {
                        $template = wrapElement($parent, $template);
                    }

                    return () => {
                        $parent.empty();
                    };
                }, Object.keys(props).map(key => props[key]));

                return (<Preact.Fragment/>);
            };
        }

        Object.keys(actions).forEach((name) => {
            props[name] = this.option(getInnerActionName(name));
        });

        return props;
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
        });
    }

    _init() {
        super._init();

        Object.keys(actions).forEach((name) => {
            this._addAction(name, actions[name]);
        });
    }

    _optionChanged(option) {
        if(actions[option.name]) {
            this._addAction(option.name, actions[option.name]);
        }

        super._optionChanged();
    }
}

registerComponent('Button', Button);

module.exports = Button;

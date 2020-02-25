
import $ from '../../core/renderer';
import * as Preact from 'preact';
import registerComponent from '../../core/component_registrator';
import Widget from '../preact-wrapper/component';
import { extend } from '../../core/utils/extend';
import ButtonView from '../button.p';
import { wrapElement } from '../preact-wrapper/utils';
import { useLayoutEffect } from 'preact/hooks';
import { getPublicElement } from '../../core/utils/dom';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

class Button extends Widget {
    getView() {
        return ButtonView;
    }

    getProps(isFirstRender) {
        const props = super.getProps(isFirstRender);

        if(props.template) {
            const template = this._getTemplate(props.template);

            // TODO: rename 'contentRender' => 'template' after fix generator bug
            //       (renames 'template' => 'render' in declaration)
            props.contentRender = ({ parentRef, ...restProps }) => {
                useLayoutEffect(() => {
                    const $parent = $(parentRef.current);
                    let $template = template.render({
                        container: getPublicElement($parent),
                        ...restProps,
                    });

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

        props.onClick = this._createActionByOption('onClick', {
            excludeValidators: ['readOnly'],
            afterExecute: () => {
                const { useSubmitBehavior } = this.option();

                useSubmitBehavior && setTimeout(() => this._submitInput().click());
            }
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
}

registerComponent('Button', Button);

module.exports = Button;

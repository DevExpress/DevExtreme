
import $ from '../../core/renderer';
import registerComponent from '../../core/component_registrator';
import Widget from '../preact-wrapper/component';
import { extend } from '../../core/utils/extend';
import ButtonView from '../button.p';
import { HTMLToPreact } from '../preact-wrapper/utils';
import { getPublicElement } from '../../core/utils/dom';

const templateDeclarations = {
    template: {
        getContainer: (className) => $(`<div class=${className}>`),
        containerClass: 'dx-button-content',
        wrapperClass: 'dx-react-wrapper',
    }
};

class Button extends Widget {
    getView() {
        return ButtonView;
    }

    getProps(isFirstRender) {
        const props = super.getProps(isFirstRender);

        Object.keys(templateDeclarations).map((key) => {
            if(props[key]) {
                props[`${key}Render`] = (params) => {
                    const declaration = templateDeclarations[key];
                    const $container = declaration.getContainer(declaration.containerClass);
                    const data = { container: getPublicElement($container), ...params };
                    const $template = $(this._getTemplate(props[key]).render(data));

                    if(declaration.wrapperClass && $template.hasClass(declaration.wrapperClass)) {
                        $template.addClass(declaration.containerClass);
                        return HTMLToPreact($template.get(0));
                    }

                    return HTMLToPreact($container.get(0));
                };
            }
        });

        // TODO: remove after generator fix ('template'->'render' translation)
        if(props.template) {
            props.contentRender = (params) => {
                const declaration = templateDeclarations.template;
                const $container = declaration.getContainer(declaration.containerClass);
                const data = { container: getPublicElement($container), ...params };
                const $template = $(this._getTemplate(props.template).render(data));

                if(declaration.wrapperClass && $template.hasClass(declaration.wrapperClass)) {
                    $template.addClass(declaration.containerClass);
                    return HTMLToPreact($template.get(0));
                }

                return HTMLToPreact($container.get(0));
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

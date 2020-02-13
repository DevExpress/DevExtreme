
import $ from '../../core/renderer';
import registerComponent from '../../core/component_registrator';
import Widget from '../preact-wrapper/component';
import { extend } from '../../core/utils/extend';
import ButtonView from '../button.p';
import { HTMLToPreact } from '../preact-wrapper/utils';

class Button extends Widget {
    getView() {
        return ButtonView;
    }

    getProps(isFirstRender) {
        const props = super.getProps(isFirstRender);

        if(props.template) {
            props.contentRender = ({ text, icon, contentRef }) => {
                const data = { text, icon };
                let $content = $('<div>');
                $content.addClass('dx-button-content');
                const $template = $(
                    this._getTemplate(this.option('template')).render({
                        model: data, container: $content
                    })
                );

                if($template.hasClass('dx-template-wrapper')) {
                    $template.addClass('dx-button-content');
                    $content = $template;
                }

                const result = HTMLToPreact($content.get(0));
                result.ref = contentRef;

                return result;
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
            template: '',
            text: '',
        });
    }
}

registerComponent('Button', Button);

module.exports = Button;

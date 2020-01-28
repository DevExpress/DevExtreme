import registerComponent from '../../core/component_registrator';
import Widget from '../preact_wrapper';
import { extend } from '../../core/utils/extend';
import ButtonView from '../button.p';

class Button extends Widget {
    getView() {
        return ButtonView;
    }

    getProps(isFirstRender) {
        const props = super.getProps(isFirstRender);
        if(props.contentRender) {
            props.contentRender = (data) => {
                const template = this._getTemplate(props.contentRender);

                return (<div style={{ display: 'none' }} ref={(element) => {
                    if(element && element.parentElement) {
                        const parent = element.parentElement;
                        while(parent.firstChild) {
                            parent.removeChild(parent.firstChild);
                        }
                        template.render({ model: data, container: parent });
                        parent.appendChild(element);
                    }
                }}/>);
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
            focusStateEnabled: true
        });
    }
}

registerComponent('Button', Button);

module.exports = Button;

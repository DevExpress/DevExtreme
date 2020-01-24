import registerComponent from '../core/component_registrator';
import Widget from './widget/preact_wrapper';
import { extend } from '../core/utils/extend';
import ButtonView from './test-button.p';

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
        return props;
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            focusStateEnabled: true
        });
    }
}

registerComponent('dxTestButton', Button);

module.exports = Button;

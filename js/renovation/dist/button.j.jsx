import registerComponent from '../../core/component_registrator';
import Widget from '../preact_wrapper';
import { extend } from '../../core/utils/extend';
import { equalByValue } from '../../core/utils/common';
import ButtonView from '../button.p';
import * as Preact from 'preact';

// NOTE: workaround to memoize template
let prevData;
let prevTemplate;
let parent;

const removeChildren = (element) => {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

class Button extends Widget {
    getView() {
        return ButtonView;
    }

    getProps(isFirstRender) {
        const props = super.getProps(isFirstRender);

        // NOTE: workaround to switch from custom template to default
        if(!props.template) {
            parent && removeChildren(parent);
        }

        if(props.template) {
            props.contentRender = (data) => {
                const templateProp = this.option('template');

                if(equalByValue(data, prevData) && prevTemplate === templateProp) return;

                const template = this._getTemplate(templateProp);

                return (<div style={{ display: 'none' }} ref={(element) => {
                    prevTemplate = templateProp;
                    prevData = data;

                    if(element?.parentElement) {
                        parent = element.parentElement;
                        removeChildren(parent);
                        template.render({
                            model: data,
                            container: parent
                        });
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

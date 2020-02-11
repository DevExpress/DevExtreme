
import $ from '../../core/renderer';
import * as Preact from 'preact';
import registerComponent from '../../core/component_registrator';
import Widget from '../preact_wrapper';
import { extend } from '../../core/utils/extend';
import { equalByValue } from '../../core/utils/common';
import ButtonView from '../button.p';

// NOTE: workaround to memoize template
let prevData;
let prevTemplate;
let component;
let wrapper = false;

const removeChildren = (element) => {
    while(element?.firstChild) {
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
            component && removeChildren($(component).parent().get(0));
        }

        if(props.template) {
            props.contentRender = (data) => {
                const templateProp = this.option('template');
                const shouldRender = !equalByValue(data, prevData) || prevTemplate !== templateProp;

                if(shouldRender) {
                    const template = this._getTemplate(templateProp);

                    component && removeChildren($(component).parent().get(0));

                    prevTemplate = templateProp;
                    prevData = data;
                    wrapper = false;

                    component = <div className="dx-button-content" ref={(element) => {
                        if(element) {
                            const $template = $(template.render({
                                model: data,
                                container: element
                            }));
                            if($template.hasClass('dx-template-wrapper')) {
                                $template.addClass('dx-button-content');
                                $(element).replaceWith($template);
                                component = $template;
                                wrapper = true;
                            }
                        }
                    }}/>;
                }

                return !wrapper && component;
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

    _initTemplates() {
        super._initTemplates();
        this._templateManager.addDefaultTemplates({
            test: {
                render: function(args) {
                    const $element = $('<span>')
                        .addClass('dx-template-wrapper')
                        .text('button');

                    return $element.get(0);
                }
            }
        });
    }
}

registerComponent('Button', Button);

module.exports = Button;

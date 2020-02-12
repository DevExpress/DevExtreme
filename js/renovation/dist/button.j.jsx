
import $ from '../../core/renderer';
import * as Preact from 'preact';
import registerComponent from '../../core/component_registrator';
import Widget from '../preact_wrapper';
import { extend } from '../../core/utils/extend';
import ButtonView from '../button.p';

const HTMLToPreact = (node) => {
    if(node.nodeType === 3) {
        return node.wholeText;
    }

    const tag = node.tagName;
    const attributes = [...node.attributes].reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
    }, {});
    const childNodes = node.childNodes;
    const children = [];
    for(let i = 0; i < childNodes.length; i++) {
        children.push(HTMLToPreact(childNodes[i]));
    }

    return Preact.h(tag, attributes, children);
};

class Button extends Widget {
    getView() {
        return ButtonView;
    }

    getProps(isFirstRender) {
        const props = super.getProps(isFirstRender);

        if(props.template) {
            props.contentRender = ({ text, icon, contentRef }) => {
                const data = { text, icon };
                let $content = $('<div className=dx-button-content>');
                const templateProp = this.option('template');
                const $template = $(this._getTemplate(templateProp).render({ model: data, container: $content }));

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

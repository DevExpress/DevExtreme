import registerComponent from '../../core/component_registrator';
import Widget from '../../ui/widget/ui.widget';
import { extend } from '../../core/utils/extend';
import ButtonView from '../button.p';
import * as Preact from 'preact';

class Button extends Widget {
    _initMarkup() { }

    _render() {
        this._renderContent();
    }

    _renderContent() {
        const options = this.option();
        const isFirstRender = this.$element().children().length === 0;
        const container = isFirstRender ? this.$element().get(0) : undefined;

        let contentRender;
        if(options.contentRender) {
            contentRender = (data) => {
                const template = this._getTemplate(options.contentRender);

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

        Preact.render(view(
            extend({}, options, {
                onClick: this._createActionByOption('onClick', {
                    excludeValidators: ['readOnly'],
                    afterExecute: () => {
                        const { useSubmitBehavior } = this.option();

                        useSubmitBehavior && setTimeout(() => this._submitInput().click());
                    }
                }),
                contentRender: contentRender
            })
        ), this.$element().get(0), container);
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            focusStateEnabled: true
        });
    }

    _optionChanged() {
        this._invalidate();
    }

    _refresh() {
        this._renderComponent();
    }
}

function view(options) {
    return Preact.h(ButtonView, options);
}

registerComponent('dxTestButton', Button);

module.exports = Button;

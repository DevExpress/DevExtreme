import registerComponent from '../core/component_registrator';
import Widget from './widget/ui.widget';
import { extend } from '../core/utils/extend';
import ButtonView from "./test-button.p";
import * as Preact from 'preact';

export default class Button extends Widget {
    _initMarkup() { }

    _render() {
        this._renderContent();
    }

    _renderContent() {
        const options = this.option();
        const container = this.$element().children().length === 0 /**isFirstRender*/ ? this.$element().get(0) : undefined;

        Preact.render(view(
            Object.assign({}, options, {
                onClick: this._createActionByOption('onClick', {
                    excludeValidators: ['readOnly'],
                    afterExecute: () => {
                        const { useSubmitBehavior } = this.option();
        
                        useSubmitBehavior && setTimeout(() => this._submitInput().click());
                    }
                })
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
    return (<ButtonView
        classNames={options.classNames}
        height={options.height}
        hint={options.hint}
        onClick={options.onClick}
        pressed={options.pressed}
        stylingMode={options.stylingMode}
        text={options.text}
        type={options.type}
        width={options.width}
    ></ButtonView>);
}

registerComponent("dxTestButton", Button);

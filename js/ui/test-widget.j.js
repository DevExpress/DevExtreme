import registerComponent from '../core/component_registrator';
import WidgetBase from './widget/preact_wrapper';
import { extend } from '../core/utils/extend';
import WidgetView from './test-widget.p';

class Widget extends WidgetBase {
    getView() {
        return WidgetView;
    }

    getProps(isFirstRender) {
        const props = super.getProps(isFirstRender);
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

registerComponent('dxTestWidget', Widget);

module.exports = Widget;

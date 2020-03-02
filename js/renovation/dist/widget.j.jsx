import registerComponent from '../../core/component_registrator';
import WidgetBase from '../preact-wrapper/component';
import { extend } from '../../core/utils/extend';
import WidgetView from '../widget.p';

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

        props.onContentReady = this._createActionByOption('onContentReady', {
            excludeValidators: ['disabled', 'readOnly']
        });

        return props;
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            focusStateEnabled: true
        });
    }
}

registerComponent('Widget', Widget);

module.exports = Widget;

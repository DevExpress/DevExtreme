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

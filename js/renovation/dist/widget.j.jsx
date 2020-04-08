import registerComponent from '../../core/component_registrator';
import Component from '../preact-wrapper/component';
import * as Preact from 'preact';
import WidgetView from '../widget.p';

class Widget extends Component {
    getView() {
        return WidgetView;
    }

    getProps(isFirstRender) {
        const props = super.getProps(isFirstRender);

        return {
            ref: this.view_ref,
            ...props
        };
    }

    focus() {
        this.view_ref.current.focus();
    }

    _init() {
        super._init();
        this.view_ref = Preact.createRef();
    }
}

registerComponent('Widget', Widget);

module.exports = Widget;

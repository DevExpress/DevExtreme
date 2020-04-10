import registerComponent from '../../core/component_registrator';
import Component from '../preact-wrapper/component';
import WidgetComponent from '../widget.p';

export default class Widget extends Component {
    get _viewComponent() {
        return WidgetComponent;
    }

    focus() {
        this.viewRef.current.focus();
    }

    _initWidget() {
        this._createViewRef();
    }
}

registerComponent('Widget', Widget);

import Widget from '../../ui/widget/ui.widget';
import * as Preact from 'preact';
import { extend } from '../../core/utils/extend';

export default class PreactWrapper extends Widget {
    getInstance() {
        return this;
    }

    getView() {
        return null;
    }

    renderView(options) {
        return Preact.h(this.getView(), options);
    }

    _initMarkup() { }

    _render() {
        this._renderContent();
    }

    getProps(isFirstRender) {
        const options = extend({}, this.option());
        const attributes = this.$element()[0].attributes;

        if(isFirstRender) {
            options.elementAttr = extend(Object.keys(attributes).reduce((a, key) => {
                if(attributes[key].specified) {
                    a[attributes[key].name] = attributes[key].value;
                }
                return a;
            }, {}), options.elementAttr);
        } else if(attributes.id) {
            // NOTE: workaround to save container id
            options.elementAttr = extend({ [attributes.id.name]: attributes.id.value }, options.elementAttr);
        }

        return options;
    }

    _renderContent() {
        const isFirstRender = this.$element().children().length === 0;
        const container = isFirstRender ? this.$element().get(0) : undefined;

        Preact.render(this.renderView(this.getProps(isFirstRender)), this.$element().get(0), container);
    }

    _optionChanged() {
        this._invalidate();
    }

    _refresh() {
        this._renderComponent();
    }
}

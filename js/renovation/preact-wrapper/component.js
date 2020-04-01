import DOMComponent from '../../core/dom_component';
import * as Preact from 'preact';
import { extend } from '../../core/utils/extend';
import { getInnerActionName } from './utils';

export default class PreactWrapper extends DOMComponent {
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

    _optionChanged(option) {
        if(option) {
            super._optionChanged(option);
        }
        this._invalidate();
    }

    _addAction(name, config) {
        this.option(getInnerActionName(name), this._createActionByOption(name, config));
    }

    // Public API
    repaint() {
        this._refresh();
    }
}

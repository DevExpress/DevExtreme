import DOMComponent from '../../core/dom_component';
import * as Preact from 'preact';
import { extend } from '../../core/utils/extend';
import { getInnerActionName } from './utils';
import { isEmpty } from '../../core/utils/string';

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

    _initMarkup() {
        const isFirstRender = this.$element().children().length === 0;
        const container = isFirstRender ? this.$element().get(0) : undefined;

        Preact.render(this.renderView(this.getProps(isFirstRender)), this.$element().get(0), container);
    }

    _render() {
        this._renderContent();
    }

    getProps(isFirstRender) {
        const options = extend({}, this.option());
        const attributes = this.$element()[0].attributes;
        const { width, height } = this.$element()[0].style;

        if(isFirstRender) {
            options.elementAttr = extend(Object.keys(attributes).reduce((a, key) => {
                if(attributes[key].specified) {
                    a[attributes[key].name] = attributes[key].value;
                }
                return a;
            }, {}), options.elementAttr);
        } else {
            if(attributes.id) {
                // NOTE: workaround to save container id
                options.elementAttr = extend({ [attributes.id.name]: attributes.id.value }, options.elementAttr);
            }
            if(attributes.class) {
                // NOTE: workaround to save custom classes on type changes
                options.classNames = attributes.class.value
                    .split(' ')
                    .filter(name => name.indexOf('dx-') < 0);
            }
        }
        if(!isEmpty(width)) {
            options.width = width;
        }
        if(!isEmpty(height)) {
            options.height = height;
        }

        return options;
    }

    _renderContent() { }

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

    setAria() { }
}

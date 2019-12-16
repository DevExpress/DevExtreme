import registerComponent from '../core/component_registrator';
import Widget from './widget/ui.widget';
import { extend } from '../core/utils/extend';
import View from "./test-button-group.p";
import * as Preact from 'preact';

export default class ButtonGroup extends Widget {
    //_initMarkup() { }

    _render() {
        this._renderContent();
    }

    _renderContent() {
        const options = this.option();
        const container = this.$element().children().length === 0 /**isFirstRender*/ ? this.$element().get(0) : undefined;

        Preact.render(view(
            Object.assign({}, options, {
                selectedItemsChange: (items) => { 
                    // prevent render
                    this.option("selectedItems", items);
                }
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
    return (<View
        {...options}
    ></View>);
}

registerComponent("dxTestButtonGroup", ButtonGroup);

module.exports = ButtonGroup;

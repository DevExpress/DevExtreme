import $ from 'jquery';
import { extend } from 'core/utils/extend';

export class TestTabsWrapper {
    constructor($element, options) {
        const { itemsCount } = options;
        const tabsOptions = extend({
            items: this._generateItems(itemsCount),
        }, options);

        this._$tabs = $($element).dxTabs(tabsOptions);
        this._tabs = this._$tabs.dxTabs('instance');
    }

    _generateItems(count = 5) {
        return [...new Array(count)].map((value, index) => ({ text: `item ${index}` }));
    }

    _checkTabsContent($tabs) {
        const items = this._tabs.option('items');
        $tabs.toArray().forEach((tabElement, index) =>
            QUnit.assert.equal($(tabElement).text(), items[index].text, `text of the ${index} tab`)
        );
    }

    set width(value) {
        this._tabs.option('width', value);
    }

    checkTabsWithScrollable() {
        const $tabs = this._$tabs.find('> .dx-tabs-scrollable .dx-scrollable-content > .dx-tabs-wrapper > .dx-tab');
        QUnit.assert.equal($tabs.length, this._tabs.option('items').length, 'tabs are rendered in the Scrollable');
        this._checkTabsContent($tabs);
    }

    checkNavigationButtons(expected) {
        const visibilityStateText = expected ? 'shown' : 'hidden';
        QUnit.assert.equal(this._$tabs.find('> .dx-tabs-nav-button-left').length, Number(expected), `the left nav button element is ${visibilityStateText}`);
        QUnit.assert.equal(this._$tabs.find('> .dx-tabs-nav-button-right').length, Number(expected), `the right nav button element is ${visibilityStateText}`);
    }
}

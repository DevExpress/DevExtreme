import $ from 'jquery';
import ko from 'knockout';

import 'ui/button';
import 'integration/knockout';

QUnit.test = QUnit.urlParams['nocsp'] ? QUnit.test : QUnit.skip;

QUnit.module('Render', () => {
    // T831205
    QUnit.test('Widget rendering when buttonTemplate is used', function(assert) {
        const markup =
        '<div id="button-with-template" data-bind="dxButton: { template: \'testTemplate\' }">\
            <div data-options="dxTemplate: { name: \'testTemplate\' }">\
                <div id="template" data-bind="text: $root.text"></div>\
            </div>\
        </div>';

        $(markup).appendTo($('#qunit-fixture'));

        const $element = $('#button-with-template');

        ko.applyBindings({ text: 'test-text' }, $element[0]);
        assert.equal($('#template').eq(0).text().trim(), 'test-text', 'template text rendered');
    });
});

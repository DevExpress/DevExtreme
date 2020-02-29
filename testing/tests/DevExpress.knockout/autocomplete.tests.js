const $ = require('jquery');
const keyboardMock = require('../../helpers/keyboardMock.js');
const ko = require('knockout');
const Autocomplete = require('ui/autocomplete');

require('integration/knockout');

QUnit.testStart(function() {
    const markup =
        '<div id="T131530" data-bind="dxAutocomplete: { items: [{}, {}], itemTemplate: \'item\', searchTimeout: 0 }">\
            <div data-options="dxTemplate: { name: \'item\' }">Template</div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

Autocomplete.defaultOptions({ options: { deferRendering: false } });

QUnit.test('autocomplete should delegate templates to child widgets (T131530)', function(assert) {
    const $autocomplete = $('#T131530');
    ko.applyBindings({}, $autocomplete.get(0));

    const autocomplete = $autocomplete.dxAutocomplete('instance');
    const popupContent = autocomplete._popup.$content();
    const $input = $autocomplete.find('.' + TEXTEDITOR_INPUT_CLASS);
    const kb = keyboardMock($input);

    kb.type('T');

    assert.equal($.trim(popupContent.find('.dx-list-item').text()), 'TemplateTemplate');
});

var $ = require('jquery'),
    keyboardMock = require('../../helpers/keyboardMock.js'),
    ko = require('knockout'),
    Autocomplete = require('ui/autocomplete');

require('integration/knockout');

QUnit.testStart(function() {
    var markup =
        '<div id="T131530" data-bind="dxAutocomplete: { items: [{}, {}], itemTemplate: \'item\', searchTimeout: 0 }">\
            <div data-options="dxTemplate: { name: \'item\' }">Template</div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

var TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

Autocomplete.defaultOptions({ options: { deferRendering: false } });

QUnit.test('autocomplete should delegate templates to child widgets (T131530)', function(assert) {
    var $autocomplete = $('#T131530');
    ko.applyBindings({}, $autocomplete.get(0));

    var autocomplete = $autocomplete.dxAutocomplete('instance'),
        popupContent = autocomplete._popup.$content(),
        $input = $autocomplete.find('.' + TEXTEDITOR_INPUT_CLASS),
        kb = keyboardMock($input);

    kb.type('T');

    assert.equal($.trim(popupContent.find('.dx-list-item').text()), 'TemplateTemplate');
});

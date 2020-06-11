require('../DevExpress.ui.widgets.editors/dropDownEditor.markup.tests.js');

const $ = require('jquery');

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture" class="qunit-fixture-visible">\
            <div id="dropDownEditorLazy"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.test('there is no popup in markup on server', function(assert) {
    const dropDownEditor = $('#dropDownEditorLazy').dxDropDownEditor({
        opened: true
    }).dxDropDownEditor('instance');
    const $popup = $('.dx-popup');

    assert.notOk($popup.length);
    assert.ok(!dropDownEditor._popup);
});

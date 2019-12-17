var $ = require('jquery'),
    viewPort = require('core/utils/view_port').value,
    devices = require('core/devices'),
    ko = require('knockout');

require('ui/popup');
require('integration/knockout');

QUnit.testStart(function() {
    var markup =
        '<div id="B255099">\
            <div data-bind="dxPopup: { title: \'Test Title\', visible: true }"></div>\
        </div>\
        \
        <div id="T180280">\
            <div>\
                <div data-bind="dxPopup: { visible: true }">123</div>\
            </div>\
        </div>\
         <div id="container">\
            <div data-bind="dxPopup: popupOptions"></div>\
        </div>\
        \
        <div id="titleKOTemplate">\
            <div>\
                <div data-bind="dxPopup: { visible: true }">\
                    <div data-options="dxTemplate: { name: \'title\' }">\
                        <div data-bind="text: text"></div>\
                    </div>\
                </div>\
            </div>\
        </div>';

    $('#qunit-fixture').addClass('dx-theme-ios').addClass('dx-viewport').html(markup);
});

var POPUP_TITLE_CLASS = 'dx-popup-title';

QUnit.module('rendering', {
    beforeEach: function() {
        this.element = $('#popup').dxPopup();
        this.instance = this.element.dxPopup('instance');
        devices.current('desktop');
    }
});

QUnit.test('\'title\' option has higher priority that the \'titleTemplate\' option (B255099)', function(assert) {
    ko.applyBindings({}, $('#B255099').get(0));

    var $title = $('.' + POPUP_TITLE_CLASS);
    assert.equal($title.text(), 'Test Title');
});


QUnit.module('templates');

QUnit.test('popup should not crash with KO (T180280)', function(assert) {
    assert.expect(0);

    var originalViewPort = viewPort();

    try {
        viewPort('#T180280');
        ko.applyBindings({}, $('#T180280').get(0));
    } finally {
        viewPort(originalViewPort);
    }
});

QUnit.test('popup should not crash without KO root context specifying in title template (T180280)', function(assert) {
    assert.expect(0);

    var originalViewPort = viewPort();

    try {
        viewPort('#titleKOTemplate');
        ko.applyBindings({ text: 'custom' }, $('#titleKOTemplate').get(0));
    } finally {
        viewPort(originalViewPort);
    }
});

QUnit.test('button in popup toolbar should handle changes in model', function(assert) {
    var visible = ko.observable(false),
        buttonDisabled = ko.observable(true);

    var vm = {
        popupOptions: {
            animation: null,
            visible: visible,
            toolbarItems: [{
                toolbar: 'bottom',
                widget: 'dxButton',
                disabled: buttonDisabled,
                options: {
                    text: 'Text'
                }
            }]
        }
    };

    ko.applyBindings(vm, $('#container').get(0));

    visible(true);
    buttonDisabled(false);
    assert.equal(viewPort().find('.dx-state-disabled').length, 0, 'property was changed');
});

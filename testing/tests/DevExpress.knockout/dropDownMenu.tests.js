const $ = require('jquery');
const ko = require('knockout');
const fx = require('animation/fx');
const executeAsyncMock = require('../../helpers/executeAsyncMock.js');

require('ui/drop_down_menu');
require('integration/knockout');

QUnit.testStart(function() {
    const markup =
        '<div id="dropDownMenuKO" data-bind="dxDropDownMenu: { items: items, onContentReady: onContentReady, opened: opened }">\
            <div data-options="dxTemplate: { name: \'item\' }">\
                <img  class="my-icon" data-bind="attr: { src: icon }" />\
                <span class="my-text" data-bind="text: text"></span>\
            </div>\
        </div>\
        \
        <div id="dropDownMenuCustomTemplateName" data-bind="dxDropDownMenu: { items: items, itemTemplate: itemTemplate }">\
            <div data-options="dxTemplate: { name: \'itemWithIcon\' }">\
                <img  class="my-icon" data-bind="attr: { src: icon }" />\
                <span class="my-text" data-bind="text: text"></span>\
            </div>\
        </div>\
        \
        <div id="T131530" data-bind="dxDropDownMenu: { items: [{ template: \'item0\' }, { template: \'item1\' }], opened: opened }">\
            <div data-options="dxTemplate: { name: \'item0\' }">\
                Template 1\
            </div>\
            <div data-options="dxTemplate: { name: \'item1\' }">\
                Template 2\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('KO cases', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
        executeAsyncMock.setup();
    },
    afterEach: function() {
        fx.off = false;
        executeAsyncMock.teardown();
        this.clock.restore();
    }
});

QUnit.test('custom item template', function(assert) {
    assert.expect(3);

    const element = $('#dropDownMenuKO');

    ko.applyBindings({
        items: [
            {
                text: '0',
                icon: 'http://1.png'
            },
            {
                text: '1',
                icon: 'http://1.png'
            },
            {
                text: '2',
                icon: 'http://3.png'
            }

        ],
        onContentReady: function() {
            const instance = element.dxDropDownMenu('instance');
            const popupElement = instance._popup._wrapper();

            instance.close();

            instance._popup.option('onShown', function() {
                assert.equal(popupElement.find('.dx-list-item').length, 3);
                assert.equal(popupElement.find('img.my-icon').length, 3);
                assert.equal(popupElement.find('span.my-text').length, 3);
            });

            $('#dropDownMenuKO').trigger('dxclick');
        },
        opened: true
    }, element[0]);
});

QUnit.test('custom template name', function(assert) {
    const vm = {
        items: [
            {
                text: '0',
                icon: 'http://1.png'
            },
            {
                text: '1',
                icon: 'http://1.png'
            },
            {
                text: '2',
                icon: 'http://3.png'
            }

        ],
        itemTemplate: 'itemWithIcon'
    };
    const $element = $('#dropDownMenuCustomTemplateName');

    ko.applyBindings(vm, $element.get(0));

    const instance = $element.dxDropDownMenu('instance');

    $element.trigger('dxclick');

    assert.equal(instance._popup._wrapper().find('.my-icon').length, 3);
    assert.equal(instance._popup._wrapper().find('.my-text').length, 3);
});


QUnit.test('dropdownmenu should delegate templates to child widgets (T131530)', function(assert) {
    const $dropDownMenu = $('#T131530');
    ko.applyBindings({
        opened: true
    }, $dropDownMenu.get(0));

    $dropDownMenu.dxDropDownMenu('close');
    assert.equal($.trim($dropDownMenu.find('.dx-list-item').eq(0).text()), 'Template 1');
    assert.equal($.trim($dropDownMenu.find('.dx-list-item').eq(1).text()), 'Template 2');
});

const $ = require('jquery');

require('ui/slide_out');
require('common.css!');

const SLIDEOUT_CLASS = 'dx-slideout';
const SLIDEOUT_ITEM_CONTAINER_CLASS = 'dx-slideout-item-container';

const SLIDEOUT_ITEM_CLASS = 'dx-slideout-item';

const LIST_CLASS = 'dx-list';
const LIST_ITEM_CLASS = 'dx-list-item';


QUnit.testStart(function() {
    const markup = '\
        <div id="slideOut"></div>\
        <div id="slideOutWithTemplate">\
            <div data-options="dxTemplate: { name: \'content\'}">\
                content\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('render widget', {
    beforeEach: function() {
        this.$element = $('#slideOut');
    }
}, () => {
    QUnit.test('render widget', function(assert) {
        const slideOut = this.$element.dxSlideOut();

        assert.ok(slideOut.hasClass(SLIDEOUT_CLASS), 'widget class was added');
        assert.equal(slideOut.find('.' + LIST_CLASS).length, 1, 'menu was rendered');
        assert.equal(slideOut.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS).length, 1, 'item container was rendered');
    });

    QUnit.test('render item', function(assert) {
        const slideOut = this.$element.dxSlideOut({
            dataSource: [{ text: 'testItem' }],
            selectedIndex: 0
        });
        assert.equal(slideOut.find('.' + SLIDEOUT_ITEM_CLASS).length, 1);
    });

    QUnit.test('update items during beginUpdate/endUpdate should refresh list only once', function(assert) {
        const $slideOut = this.$element.dxSlideOut({}), instance = $slideOut.dxSlideOut('instance');

        instance.beginUpdate();
        instance.option('items', [1]);
        instance.option('items', [1, 2]);

        assert.equal($slideOut.find('.' + LIST_ITEM_CLASS).length, 0, 'list was not only once');

        instance.endUpdate();
        assert.equal($slideOut.find('.' + LIST_ITEM_CLASS).length, 2, 'list was updated');
    });

    QUnit.test('show only one item at same time', function(assert) {
        const slideOut = this.$element.dxSlideOut({
            dataSource: [
                { text: 'testItem1' },
                { text: 'testItem2' }
            ],
            selectedIndex: 0
        });

        assert.equal(slideOut.find('.' + SLIDEOUT_ITEM_CLASS).length, 1);
    });

    QUnit.test('show only one item at same time if contentTemplate is used', function(assert) {
        const slideOut = $('#slideOutWithTemplate').dxSlideOut({
            dataSource: [
                { text: '1' },
                { text: '2' }
            ],
            contentTemplate: function() {
                return 'itemText';
            },
            selectedIndex: 0
        });

        assert.equal($.trim(slideOut.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS).text()), 'itemText', 'item was rendered only once');
    });

    QUnit.test('show only one item at same time if contentTemplate append markup in container', function(assert) {
        const slideOut = $('#slideOutWithTemplate').dxSlideOut({
            dataSource: [
                { text: '1' },
                { text: '2' }
            ],
            contentTemplate: function(element) {
                $(element).append($('<div>').text('itemText'));
            },
            selectedIndex: 0
        });

        assert.equal($.trim(slideOut.find('.' + SLIDEOUT_ITEM_CONTAINER_CLASS).text()), 'itemText', 'item was rendered only once');
    });
});


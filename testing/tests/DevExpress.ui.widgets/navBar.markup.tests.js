import $ from 'jquery';
import errors from 'core/errors';

import 'ui/nav_bar';

QUnit.testStart(function() {
    const markup =
        '<div id="navbar">';

    $('#qunit-fixture').html(markup);
});

const toSelector = function(cssClass) {
    return '.' + cssClass;
};

const NAVBAR_ITEM_CLASS = 'dx-nav-item';
const NAVBAR_TEXT_ITEM_CLASS = 'dx-navbar-text-item';

const TAB_SELECTED_CLASS = 'dx-tab-selected';


QUnit.module('rendering', () => {
    QUnit.test('item without icon should have correct class', function(assert) {
        const $navBar = $('#navbar').dxNavBar({
            items: [
                { text: '0', icon: 'home' },
                { text: '1' }
            ]
        });

        const $items = $navBar.dxNavBar('itemElements');

        assert.ok(!$items.eq(0).hasClass(NAVBAR_TEXT_ITEM_CLASS), 'class was not added');
        assert.ok($items.eq(1).hasClass(NAVBAR_TEXT_ITEM_CLASS), 'class was added');
    });

    QUnit.test('selected item should have selected class on rendering', function(assert) {
        const $navBar = $('#navbar').dxNavBar({
            items: [
                1,
                2
            ],
            selectedItem: 1
        });

        const $item = $navBar.find(toSelector(NAVBAR_ITEM_CLASS)).eq(0);

        assert.ok($item.hasClass(TAB_SELECTED_CLASS), 'selection present');
    });

    QUnit.test('show deprecated warning by the initialization', function(assert) {
        const originalLog = errors.log;
        try {
            const stub = sinon.stub();
            errors.log = stub;

            $('#navbar').dxNavBar();

            assert.equal(stub.callCount, 1, 'the log method is called once');
            assert.deepEqual(stub.getCall(0).args, [
                'W0000',
                'dxNavBar',
                '20.1',
                'Use the \'dxTabs\' widget instead'
            ], 'args of the log method');
        } finally {
            errors.log = originalLog;
        }
    });
});


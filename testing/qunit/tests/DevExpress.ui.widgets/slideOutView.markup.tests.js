import $ from 'jquery';
import config from 'core/config';
import typeUtils from 'core/utils/type';
import windowUtils from 'core/utils/window';
import errors from 'core/errors';

import 'common.css!';
import 'ui/slide_out_view';

const SLIDEOUTVIEW_CLASS = 'dx-slideoutview';
const SLIDEOUTVIEW_WRAPPER_CLASS = 'dx-slideoutview-wrapper';
const SLIDEOUTVIEW_MENU_CONTENT_CLASS = 'dx-slideoutview-menu-content';
const SLIDEOUTVIEW_CONTENT_CLASS = 'dx-slideoutview-content';
const SLIDEOUTVIEW_SHIELD_CLASS = 'dx-slideoutview-shield';

const position = function($element) {
    return $element.position().left;
};


QUnit.testStart(function() {
    const markup = '\
    <style>\
        .dx-slideoutview-menu-content {\
            width: 200px;\
        }\
    </style>\
    \
    <div id="slideOutView">\
        <div id="content">Test Content</div>\
    </div>\
    <div id="contentTemplate">\
        <div data-options="dxTemplate: { name: \'customMenu\' }">\
            Test Menu Template\
        </div>\
            <div data-options="dxTemplate: { name: \'customContent\' }">\
            Test Content Template\
        </div>\
    </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('rendering', () => {
    QUnit.test('render slideoutView', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({});

        assert.ok($element.hasClass(SLIDEOUTVIEW_CLASS), 'slideoutview rendered');
        assert.equal($element.find('.' + SLIDEOUTVIEW_WRAPPER_CLASS).length, 1, 'slideoutview has wrapper');
        assert.equal($element.find('.' + SLIDEOUTVIEW_MENU_CONTENT_CLASS).length, 1, 'slideoutview has menu container');
        assert.equal($element.find('.' + SLIDEOUTVIEW_CONTENT_CLASS).length, 1, 'slideoutview has content');
    });

    QUnit.test('render slideoutView content', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({}); const $content = $element.find('.' + SLIDEOUTVIEW_CONTENT_CLASS);

        assert.equal($.trim($content.text()), 'Test Content', 'slideoutview content was rendered');
    });

    QUnit.test('slideoutView preserve content', function(assert) {
        const $content = $('#slideOutView #content');
        const $element = $('#slideOutView').dxSlideOutView({});

        assert.equal($content[0], $element.find('#content')[0]);
    });

    QUnit.test('custom content template for menu should be rendered correctly', function(assert) {
        const $element = $('#contentTemplate').dxSlideOutView({
            menuTemplate: 'customMenu'
        });
        const $menu = $($element.dxSlideOutView('instance').menuContent());

        assert.equal($.trim($menu.text()), 'Test Menu Template', 'menu content text is correct');
    });

    QUnit.test('templates should be dom nodes without jQuery', function(assert) {
        assert.expect(2);
        $('#contentTemplate').dxSlideOutView({
            menuTemplate: function(element) {
                assert.equal(typeUtils.isRenderer(element), !!config().useJQuery, 'element is correct');
            },
            contentTemplate: function(element) {
                assert.equal(typeUtils.isRenderer(element), !!config().useJQuery, 'element is correct');
            }
        });
    });

    QUnit.test('custom content template for content should be rendered correctly', function(assert) {
        const $element = $('#contentTemplate').dxSlideOutView({
            contentTemplate: 'customContent'
        });
        const $content = $($element.dxSlideOutView('instance').content());

        assert.equal($.trim($content.text()), 'Test Content Template', 'content text is correct');
    });

    QUnit.test('render right menu position', function(assert) {
        const $element = $('#contentTemplate').dxSlideOutView({
            menuPosition: 'inverted',
            menuVisible: true
        });
        const instance = $element.dxSlideOutView('instance');
        const $content = $(instance.content());
        const $menuContent = $(instance.menuContent());

        assert.notOk($menuContent.hasClass(SLIDEOUTVIEW_CLASS + '-left'), 'there is no left menu position class');
        assert.ok($menuContent.hasClass(SLIDEOUTVIEW_CLASS + '-right'), 'right menu position class added');

        if(windowUtils.hasWindow()) {
            assert.equal(position($content), -200, 'menu left position is negative');
        }

        instance.option('menuPosition', 'normal');
        assert.notOk($menuContent.hasClass(SLIDEOUTVIEW_CLASS + '-right'), 'right menu position class has been removed');
        assert.ok($menuContent.hasClass(SLIDEOUTVIEW_CLASS + '-left'), 'left menu position class added');
    });

    QUnit.test('shield should be rendered', function(assert) {
        const $element = $('#slideOutView').dxSlideOutView({
            menuVisible: true
        });

        assert.equal($element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS).length, 1, 'slideoutview has shield');
    });

    QUnit.test('show deprecated warning by the initialization', function(assert) {
        const originalLog = errors.log;
        try {
            const stub = sinon.stub();
            errors.log = stub;

            $('#slideOutView').dxSlideOutView();

            assert.equal(stub.callCount, 1, 'the log method is called once');
            assert.deepEqual(stub.getCall(0).args, [
                'W0000',
                'dxSlideOutView',
                '20.1',
                'Use the \'dxDrawer\' widget instead'
            ], 'args of the log method');
        } finally {
            errors.log = originalLog;
        }
    });
});


var $ = require('jquery'),
    config = require('core/config'),
    typeUtils = require('core/utils/type'),
    windowUtils = require('core/utils/window');

require('common.css!');
require('ui/slide_out_view');

var SLIDEOUTVIEW_CLASS = 'dx-slideoutview',
    SLIDEOUTVIEW_WRAPPER_CLASS = 'dx-slideoutview-wrapper',
    SLIDEOUTVIEW_MENU_CONTENT_CLASS = 'dx-slideoutview-menu-content',
    SLIDEOUTVIEW_CONTENT_CLASS = 'dx-slideoutview-content',
    SLIDEOUTVIEW_SHIELD_CLASS = 'dx-slideoutview-shield';

var position = function($element) {
    return $element.position().left;
};


QUnit.testStart(function() {
    var markup = '\
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
        var $element = $('#slideOutView').dxSlideOutView({});

        assert.ok($element.hasClass(SLIDEOUTVIEW_CLASS), 'slideoutview rendered');
        assert.equal($element.find('.' + SLIDEOUTVIEW_WRAPPER_CLASS).length, 1, 'slideoutview has wrapper');
        assert.equal($element.find('.' + SLIDEOUTVIEW_MENU_CONTENT_CLASS).length, 1, 'slideoutview has menu container');
        assert.equal($element.find('.' + SLIDEOUTVIEW_CONTENT_CLASS).length, 1, 'slideoutview has content');
    });

    QUnit.test('render slideoutView content', function(assert) {
        var $element = $('#slideOutView').dxSlideOutView({}),
            $content = $element.find('.' + SLIDEOUTVIEW_CONTENT_CLASS);

        assert.equal($.trim($content.text()), 'Test Content', 'slideoutview content was rendered');
    });

    QUnit.test('slideoutView preserve content', function(assert) {
        const $content = $('#slideOutView #content'),
            $element = $('#slideOutView').dxSlideOutView({});

        assert.equal($content[0], $element.find('#content')[0]);
    });

    QUnit.test('custom content template for menu should be rendered correctly', function(assert) {
        var $element = $('#contentTemplate').dxSlideOutView({
                menuTemplate: 'customMenu'
            }),
            $menu = $($element.dxSlideOutView('instance').menuContent());

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
        var $element = $('#contentTemplate').dxSlideOutView({
                contentTemplate: 'customContent'
            }),
            $content = $($element.dxSlideOutView('instance').content());

        assert.equal($.trim($content.text()), 'Test Content Template', 'content text is correct');
    });

    QUnit.test('render right menu position', function(assert) {
        var $element = $('#contentTemplate').dxSlideOutView({
                menuPosition: 'inverted',
                menuVisible: true
            }),
            instance = $element.dxSlideOutView('instance'),
            $content = $(instance.content()),
            $menuContent = $(instance.menuContent());

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
        var $element = $('#slideOutView').dxSlideOutView({
            menuVisible: true
        });

        assert.equal($element.find('.' + SLIDEOUTVIEW_SHIELD_CLASS).length, 1, 'slideoutview has shield');
    });
});


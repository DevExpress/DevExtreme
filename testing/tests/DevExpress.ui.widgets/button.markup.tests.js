var $ = require('jquery'),
    isRenderer = require('core/utils/type').isRenderer,
    config = require('core/config');

require('ui/button');
require('common.css!');

QUnit.testStart(function() {
    var markup =
        '<div id="button"></div>\
        <div id="widget"></div>\
        <div id="buttonWithTemplate">\
            <div data-options="dxTemplate: { name: \'content\' }" data-bind="text: text"></div>\
        </div>\
        <div id="buttonWithAnonymousTemplate">\
            <div id="content">test</div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

var BUTTON_CLASS = 'dx-button',
    BUTTON_TEXT_CLASS = 'dx-button-text',
    BUTTON_HAS_TEXT_CLASS = 'dx-button-has-text',
    BUTTON_HAS_ICON_CLASS = 'dx-button-has-icon',
    BUTTON_CONTENT_CLASS = 'dx-button-content',
    BUTTON_BACK_CLASS = 'dx-button-back',
    TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper',
    BUTTON_TEXT_STYLE_CLASS = 'dx-button-mode-text',
    BUTTON_CONTAINED_STYLE_CLASS = 'dx-button-mode-contained';

QUnit.module('Button markup');

QUnit.test('markup init', function(assert) {
    var element = $('#button').dxButton();

    assert.ok(element.hasClass(BUTTON_CLASS));

    var items = element.children();

    var buttonContent = $(items[0]).hasClass(BUTTON_CONTENT_CLASS);

    assert.equal(true, buttonContent);
});

QUnit.test('init with options', function(assert) {
    var element = $('#button').dxButton({
            text: 'text',
            icon: 'home'
        }),
        buttonContent = element.find('.' + BUTTON_CONTENT_CLASS);

    assert.equal($.trim(buttonContent.find('.' + BUTTON_TEXT_CLASS).text()), 'text');
    assert.ok(element.hasClass(BUTTON_HAS_ICON_CLASS), 'button with icon has icon class');
    assert.ok(element.hasClass(BUTTON_HAS_TEXT_CLASS), 'button with text has text class');
});

QUnit.test('submit element should have tabindex attribute', function(assert) {
    var $element = $('#button').dxButton({ useSubmitBehavior: true }),
        $submitElement = $element.find('input');

    assert.equal($submitElement.attr('tabindex'), -1, 'submit input is not focusable');
});

QUnit.test('class added from type (back)', function(assert) {
    var element = $('#button').dxButton({
            type: 'back'
        }),
        buttonContent = element.find('.' + BUTTON_CONTENT_CLASS);

    assert.ok(element.hasClass(BUTTON_BACK_CLASS), 'class was added');
    assert.ok(buttonContent.find('.dx-icon').length, 'icon class was added');
});

QUnit.test('class added from stylingMode', function(assert) {
    var element = $('#button').dxButton({
        stylingMode: 'text'
    });

    assert.ok(element.hasClass(BUTTON_TEXT_STYLE_CLASS), 'class was added');
});

QUnit.test('Default value should be used if stylingMode has wrong value', function(assert) {
    var element = $('#button').dxButton({
        stylingMode: 'someWrongValue'
    });

    assert.ok(element.hasClass(BUTTON_CONTAINED_STYLE_CLASS), 'class was added');
});

QUnit.test('icon must rendered after change type of button on \'back\'', function(assert) {
    var element = $('#button').dxButton({
        type: 'normal',
        text: 'test'
    });

    assert.ok(element.hasClass('dx-button-normal'), 'button has correct type class');
    assert.equal(element.find('.dx-icon').length, 0, 'icon not be rendered');

    element.dxButton('instance').option('type', 'back');

    assert.equal(element.find('.dx-button-normal').length, 0, 'prev class type was removed');
    assert.equal(element.find('.dx-icon').length, 1, 'icon was rendered');
    assert.ok(element.hasClass(BUTTON_BACK_CLASS), 'button has correct type class after change type');
});

QUnit.test('class is not removed after change type', function(assert) {
    var $element = $('#button').dxButton({});

    $element.addClass('test');
    $element.dxButton('option', 'type', 'custom-1');

    assert.ok($element.hasClass('test'));
});

QUnit.test('previous type class is removed after type changed', function(assert) {
    var $element = $('#button').dxButton({});

    $element.dxButton('option', 'type', 'custom-1');
    assert.ok($element.hasClass('dx-button-custom-1'));

    $element.dxButton('option', 'type', 'custom-2');
    assert.ok($element.hasClass('dx-button-custom-2'));
    assert.ok(!$element.hasClass('dx-button-custom-1'));
});

QUnit.test('icon', function(assert) {

    var element = $('#button').dxButton({
        icon: 'back'
    });

    assert.ok(element.find('.dx-icon').hasClass('dx-icon-back'), 'class was added');

    element.dxButton('instance').option('icon', 'success');
    assert.ok(element.find('.dx-icon').hasClass('dx-icon-success'), 'class set with option');
    assert.ok(element.hasClass(BUTTON_HAS_ICON_CLASS), 'button with icon has icon class');
    assert.ok(!element.hasClass(BUTTON_HAS_TEXT_CLASS, 'button with icon only has not text class'));
});

QUnit.test('icon as path', function(assert) {
    var element = $('#button').dxButton({
        icon: '../../testing/content/add.png'
    });

    assert.ok(element.find('img[src=\'../../testing/content/add.png\']').length, 'icon was added by src');

    element.dxButton('instance').option('icon', '../../testing/content/plus.png');
    assert.ok(element.find('img[src=\'../../testing/content/plus.png\']').length, 'icon was changed correctly');
});

QUnit.test('icon as external lib class', function(assert) {
    var element = $('#button').dxButton({
        icon: 'fa fa-icon'
    });

    assert.ok(element.find('.fa.fa-icon').length, 'icon was added by fa class');

    element.dxButton('instance').option('icon', 'fa-new-icon fa');
    assert.ok(element.find('.fa-new-icon.fa').length, 'icon was changed correctly');
});

QUnit.test('dxButton content class appear on correct container (T256387)', function(assert) {
    var $button = $('#buttonWithTemplate').dxButton({ text: 'text1', icon: 'test-icon', template: 'content' });

    assert.ok($button.find('.' + BUTTON_CONTENT_CLASS).hasClass(TEMPLATE_WRAPPER_CLASS), 'template has content class');
});

QUnit.test('dxButton with anonymous template', function(assert) {
    const $button = $('#buttonWithAnonymousTemplate').dxButton();

    assert.equal($.trim($button.text()), 'test', 'anonymous template rendered');
});

QUnit.test('anonymous content template rendering', function(assert) {
    const $contentElement = $('#buttonWithAnonymousTemplate #content');

    const $button = $('#buttonWithAnonymousTemplate').dxButton();

    assert.equal($button.find('#content')[0], $contentElement[0], 'content element preserved');
});

QUnit.test('dxButton with template as function', function(assert) {
    $('#button').dxButton({
        template: function(data, container) {
            assert.equal(isRenderer(container), !!config().useJQuery, 'container is correct');
            return $('<div>');
        }
    });
});

QUnit.test('dxButton should render custom template with render function that returns dom node', function(assert) {
    var $element = $('#button').dxButton({
        integrationOptions: {
            templates: {
                'content': {
                    render: function(args) {
                        var $element = $('<span>')
                            .addClass('dx-template-wrapper')
                            .text('button text');

                        return $element.get(0);
                    }
                }
            }
        }
    });

    assert.equal($element.text(), 'button text', 'container is correct');
});

QUnit.module('aria accessibility');

QUnit.test('aria role', function(assert) {
    var $element = $('#button').dxButton({});

    assert.equal($element.attr('role'), 'button', 'aria role is correct');
});

QUnit.test('aria-label attribute', function(assert) {
    var $element = $('#button').dxButton({
            text: 'test',
            icon: 'find',
            type: 'danger'
        }),
        instance = $element.dxButton('instance');

    assert.equal($element.attr('aria-label'), 'test', 'aria label for all params is correct');

    instance.option('text', '');
    assert.equal($element.attr('aria-label'), 'find', 'aria label without text is correct');

    instance.option('icon', '/path/file.png');
    assert.equal($element.attr('aria-label'), 'file', 'aria label without text and icon is correct');

    instance.option('icon', '');
    assert.equal($element.attr('aria-label'), undefined, 'aria label without text and icon is correct');
});

QUnit.test('icon-type base64 should not be parsed for aria-label creation (T281454)', function(assert) {
    var $element = $('#button').dxButton({
        icon: 'data:image/png;base64,'
    });

    assert.equal($element.attr('aria-label'), 'Base64', 'aria label is not exist');
});

QUnit.test('after change the button type to \'back\' and then change to \'normal\' arrow should be disappear', function(assert) {
    var $element = $('#button').dxButton({});
    var instance = $element.dxButton('instance');

    var backIconClass = '.dx-icon-back';

    assert.equal($element.find(backIconClass).length, 0, 'button hasn\'t \'back\' icon');

    instance.option('type', 'back');
    assert.equal($element.find(backIconClass).length, 1, 'button has \'back\' icon');

    instance.option('type', 'normal');
    assert.equal($element.find(backIconClass).length, 0, 'button hasn\'t \'back\' icon');
});

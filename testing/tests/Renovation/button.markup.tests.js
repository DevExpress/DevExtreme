import $ from 'jquery';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';

import 'renovation/ui/editors/button.j';

QUnit.testStart(function() {
    const markup =
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

const BUTTON_CLASS = 'dx-button';
const BUTTON_TEXT_CLASS = 'dx-button-text';
const BUTTON_HAS_TEXT_CLASS = 'dx-button-has-text';
const BUTTON_HAS_ICON_CLASS = 'dx-button-has-icon';
const BUTTON_CONTENT_CLASS = 'dx-button-content';
const BUTTON_BACK_CLASS = 'dx-button-back';
const BUTTON_TEXT_STYLE_CLASS = 'dx-button-mode-text';
const BUTTON_CONTAINED_STYLE_CLASS = 'dx-button-mode-contained';

const moduleConfig = {
    Button(options = {}) {
        $('#button').dxButton(options);
        return $('#button');
    }
};

QUnit.module('Button markup', moduleConfig, () => {
    QUnit.test('markup init', function(assert) {
        const element = this.Button();

        assert.ok(element.hasClass(BUTTON_CLASS));

        const items = element.children();

        const hasButtonContentClass = $(items[0]).hasClass(BUTTON_CONTENT_CLASS);

        assert.ok(hasButtonContentClass);
    });

    QUnit.test('init with options', function(assert) {
        const element = this.Button({
            text: 'text',
            icon: 'home'
        });
        const buttonContent = element.find('.' + BUTTON_CONTENT_CLASS);

        assert.equal($.trim(buttonContent.find('.' + BUTTON_TEXT_CLASS).text()), 'text');
        assert.ok(element.hasClass(BUTTON_HAS_ICON_CLASS), 'button with icon has icon class');
        assert.ok(element.hasClass(BUTTON_HAS_TEXT_CLASS), 'button with text has text class');
    });

    QUnit.test('submit element should have tabindex attribute', function(assert) {
        const element = this.Button({ useSubmitBehavior: true });

        const $submitElement = element.find('input');

        assert.equal($submitElement.attr('tabindex'), -1, 'submit input is not focusable');
    });

    QUnit.test('class added from type (back)', function(assert) {
        const element = this.Button({
            type: 'back'
        });
        const buttonContent = element.find('.' + BUTTON_CONTENT_CLASS);

        assert.ok(element.hasClass(BUTTON_BACK_CLASS), 'class was added');
        assert.ok(buttonContent.find('.dx-icon').length, 'icon class was added');
    });

    QUnit.test('class added from stylingMode', function(assert) {
        const element = this.Button({
            stylingMode: 'text'
        });

        assert.ok(element.hasClass(BUTTON_TEXT_STYLE_CLASS), 'class was added');
    });

    QUnit.test('Default value should be used if stylingMode has wrong value', function(assert) {
        const element = this.Button({
            stylingMode: 'someWrongValue'
        });

        assert.ok(element.hasClass(BUTTON_CONTAINED_STYLE_CLASS), 'class was added');
    });

    QUnit.test('icon must rendered after change type of button on \'back\'', function(assert) {
        const element = this.Button({
            type: 'normal',
            text: 'test'
        });

        assert.ok(element.hasClass('dx-button-normal'), 'button has correct type class');
        assert.equal(element.find('.dx-icon').length, 0, 'icon not be rendered');

        this.Button({ type: 'back' });

        assert.equal(element.find('.dx-button-normal').length, 0, 'prev class type was removed');
        assert.equal(element.find('.dx-icon').length, 1, 'icon was rendered');
        assert.ok(element.hasClass(BUTTON_BACK_CLASS), 'button has correct type class after change type');
    });

    QUnit.test('class is not removed after change type', function(assert) {
        const element = this.Button();

        element.addClass('test');
        this.Button({ type: 'custom-1' });

        assert.ok(element.hasClass('test'));
    });

    QUnit.test('previous type class is removed after type changed', function(assert) {
        const element = this.Button({ type: 'custom-1' });
        assert.ok(element.hasClass('dx-button-custom-1'));

        this.Button({ type: 'custom-2' });
        assert.ok(element.hasClass('dx-button-custom-2'));
        assert.ok(!element.hasClass('dx-button-custom-1'));
    });

    QUnit.test('icon', function(assert) {
        const element = this.Button({
            icon: 'back'
        });

        assert.ok(element.find('.dx-icon').hasClass('dx-icon-back'), 'class was added');

        this.Button({ icon: 'success' });
        assert.ok(element.find('.dx-icon').hasClass('dx-icon-success'), 'class set with option');
        assert.ok(element.hasClass(BUTTON_HAS_ICON_CLASS), 'button with icon has icon class');
        assert.ok(!element.hasClass(BUTTON_HAS_TEXT_CLASS, 'button with icon only has not text class'));
    });

    QUnit.test('icon as path', function(assert) {
        const element = this.Button({
            icon: '../../testing/content/add.png'
        });

        assert.ok(element.find('img[src=\'../../testing/content/add.png\']').length, 'icon was added by src');

        this.Button({ icon: '../../testing/content/plus.png' });
        assert.ok(element.find('img[src=\'../../testing/content/plus.png\']').length, 'icon was changed correctly');
    });

    QUnit.test('icon as external lib class', function(assert) {
        const element = this.Button({
            icon: 'fa fa-icon'
        });

        assert.ok(element.find('.fa.fa-icon').length, 'icon was added by fa class');

        this.Button({ icon: 'fa-new-icon fa' });
        assert.ok(element.find('.fa-new-icon.fa').length, 'icon was changed correctly');
    });

    QUnit.test('Button with anonymous template', function(assert) {
        $('#buttonWithAnonymousTemplate').dxButton();

        assert.equal($.trim($('#buttonWithAnonymousTemplate').text()), 'test', 'anonymous template rendered');
    });

    QUnit.test('anonymous content template rendering', function(assert) {
        const $contentElement = $('#buttonWithAnonymousTemplate #content');

        $('#buttonWithAnonymousTemplate').dxButton();

        assert.equal($('#buttonWithAnonymousTemplate').find('#content')[0], $contentElement[0], 'content element preserved');
    });

    QUnit.test('Button with template as function', function(assert) {
        this.Button({
            template: function(data, container) {
                assert.equal(isRenderer(container), !!config().useJQuery, 'container is correct');
                return $('<div>');
            }
        });
    });
});

QUnit.module('aria accessibility', moduleConfig, () => {
    QUnit.test('aria role', function(assert) {
        const element = this.Button();

        assert.equal(element.attr('role'), 'button', 'aria role is correct');
    });

    QUnit.test('aria-label attribute', function(assert) {
        const element = this.Button({
            text: 'test',
            icon: 'find',
            type: 'danger'
        });

        assert.equal(element.attr('aria-label'), 'test', 'aria label for all params is correct');

        this.Button({ text: '' });
        assert.equal(element.attr('aria-label'), 'find', 'aria label without text is correct');

        this.Button({ icon: '/path/file.png' });
        assert.equal(element.attr('aria-label'), 'file', 'aria label without text and icon is correct');

        this.Button({ icon: '' });
        assert.equal(element.attr('aria-label'), undefined, 'aria label without text and icon is correct');
    });

    QUnit.test('icon-type base64 should not be parsed for aria-label creation (T281454)', function(assert) {
        const element = this.Button({
            icon: 'data:image/png;base64,'
        });

        assert.equal(element.attr('aria-label'), 'Base64', 'aria label is not exist');
    });

    QUnit.test('after change the button type to \'back\' and then change to \'normal\' arrow should be disappear', function(assert) {
        const element = this.Button();
        const backIconClass = '.dx-icon-back';

        assert.equal(element.find(backIconClass).length, 0, 'button hasn\'t \'back\' icon');

        this.Button({ type: 'back' });
        assert.equal(element.find(backIconClass).length, 1, 'button has \'back\' icon');

        this.Button({ type: 'normal' });
        assert.equal(element.find(backIconClass).length, 0, 'button hasn\'t \'back\' icon');
    });
});


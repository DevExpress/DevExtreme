import $ from 'jquery';
import 'renovation/dist/button.j';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';

QUnit.testStart(function() {
    $('#qunit-fixture').html(`
        <div id="component"></div>
        <div id="anotherComponent"></div>
    `);
});

const buttonConfig = {
    beforeEach: function(module) {
        // it needs for Preact timers https://github.com/preactjs/preact/blob/master/hooks/src/index.js#L273
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.tick(100);
        this.clock.restore();
    }
};

QUnit.module('Props: template', buttonConfig);

QUnit.test('should render button with default template', function(assert) {
    const $element = $('#component');
    $element.Button({ text: 'test', icon: 'check' });
    const $contentElements = $element.find('.dx-button-content').children();

    assert.strictEqual($element.Button('instance').option('template'), '', 'default template value');
    assert.ok($contentElements.eq(0).hasClass('dx-icon'), 'render icon');
    assert.ok($contentElements.eq(1).hasClass('dx-button-text'), 'render test');
});

QUnit.test('should pass correct container', function(assert) {
    const $element = $('#component');

    $element.Button({
        template: function(data, container) {
            assert.strictEqual(isRenderer(container), !!config().useJQuery, 'container is correct');
            return $('<div>');
        }
    });
});

QUnit.test('should pass correct data', function(assert) {
    const $element = $('#component');

    $element.Button({
        text: 'My button',
        icon: 'test',
        template: function(data, container) {
            assert.strictEqual(data.text, 'My button', 'text is correct');
            assert.strictEqual(data.icon, 'test', 'icon is correct');
            const $template = $('<div>');
            $template.text(`${data.text}123`);
            return $template;
        }
    });

    assert.strictEqual($element.text(), 'My button123', 'render correct text');
});

QUnit.test('should render jQuery', function(assert) {
    const $element = $('#component');

    $element.Button({
        template: (data, container) => $('<div id="custom-template">'),
    });
    assert.strictEqual($element.find('.dx-button-content').length, 1, 'render content');
    assert.strictEqual($element.find('#custom-template').length, 1, 'render custom template');
});

QUnit.test('should render dom node', function(assert) {
    const $element = $('#component');

    $element.Button({
        template: (data, container) => $('<div id="custom-template">').get(0),
    });
    assert.strictEqual($element.find('.dx-button-content').length, 1, 'render content');
    assert.strictEqual($element.find('#custom-template').length, 1, 'render custom template');
});

QUnit.test('should replace content if has "dx-template-wrapper" class', function(assert) {
    const $element = $('#component');

    $element.Button({
        template: (data, container) => {
            const $element = $('<span>')
                .addClass('dx-template-wrapper');

            return $element.get(0);
        },
    });
    assert.ok($element.find('.dx-button-content').hasClass('dx-template-wrapper'), 'template has "dx-button-content" class');
});

QUnit.test('should rerender template in runtime', function(assert) {
    const template = (data, container) => $('<div id="custom-template">');
    const templateNew = (data, container) => $('<div id="new-template">');
    const $element = $('#component');

    $element.Button({ template: template });
    assert.strictEqual($element.find('#custom-template').length, 1, 'render custom template');

    $element.Button('instance').option('template', templateNew);
    assert.strictEqual($element.find('#custom-template').length, 0, 'not render old template');
    assert.strictEqual($element.find('#new-template').length, 1, 'render new template');
});

QUnit.test('should render submit input with custom template', function(assert) {
    const $element = $('#component');

    $element.Button({
        useSubmitBehavior: true,
        template: (data, container) => $('<span>'),
    });

    assert.strictEqual($element.find('.dx-button-submit-input').length, 1, 'render submit input');
});

import $ from 'jquery';
import 'renovation/dist/button.j';
import { isRenderer } from 'core/utils/type';
import globalConfig from 'core/config';

QUnit.testStart(function() {
    $('#qunit-fixture').html(`
        <div id="component"></div>
        <div id="anotherComponent"></div>
    `);
});

const config = {
    beforeEach: function(module) {
        // it needs for Preact timers https://github.com/preactjs/preact/blob/master/hooks/src/index.js#L273
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.tick(100);
        this.clock.restore();
    }
};

QUnit.module('Props: template', config);

QUnit.test('should render button with default template', function(assert) {
    const $element = $('#component');
    $element.Button({ text: 'test', icon: 'check' });
    const $contentElements = $element.find('.dx-button-content').children();

    assert.equal($element.Button('instance').option('template'), '', 'default template value');
    assert.ok($contentElements.eq(0).hasClass('dx-icon'), 'render icon');
    assert.ok($contentElements.eq(1).hasClass('dx-button-text'), 'render test');
});

QUnit.test('should render template function', function(assert) {
    const $element = $('#component');

    $element.Button({
        template: function(data, container) {
            assert.equal(isRenderer(container), !!globalConfig().useJQuery, 'container is correct');
            return $('<div id="custom-template">');
        }
    });
    assert.equal($element.find('#custom-template').length, 1, 'render custom template');
});

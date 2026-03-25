import $ from 'jquery';

import 'ui/form';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';
    $('#qunit-fixture').html(markup);
});

QUnit.module('Public API: getScrollable');

function initForm(options) {
    return $('#form').dxForm({
        formData: { name: 'John', lastName: 'Doe' },
        ...options,
    }).dxForm('instance');
}

QUnit.test('getScrollable returns Scrollable instance when scrollingEnabled is true', function(assert) {
    const form = initForm({ scrollingEnabled: true });

    const scrollable = form.getScrollable();

    assert.ok(scrollable, 'scrollable instance is returned');
    assert.strictEqual(typeof scrollable.scrollTo, 'function', 'returned object has scrollTo method');
    assert.strictEqual(typeof scrollable.content, 'function', 'returned object has content method');
});

QUnit.test('getScrollable returns undefined when scrollingEnabled is false', function(assert) {
    const form = initForm({ scrollingEnabled: false });

    const scrollable = form.getScrollable();

    assert.strictEqual(scrollable, undefined, 'scrollable is undefined');
});

QUnit.test('getScrollable returns undefined when scrollingEnabled is not set (default)', function(assert) {
    const form = initForm();

    const scrollable = form.getScrollable();

    assert.strictEqual(scrollable, undefined, 'scrollable is undefined by default');
});

QUnit.test('getScrollable returns Scrollable after scrollingEnabled is changed from false to true at runtime', function(assert) {
    const form = initForm({ scrollingEnabled: false });

    assert.strictEqual(form.getScrollable(), undefined, 'scrollable is undefined initially');

    form.option('scrollingEnabled', true);

    const scrollable = form.getScrollable();
    assert.ok(scrollable, 'scrollable instance is returned after enabling scrolling');
});

QUnit.test('getScrollable returns undefined after scrollingEnabled is changed from true to false at runtime', function(assert) {
    const form = initForm({ scrollingEnabled: true });

    assert.ok(form.getScrollable(), 'scrollable exists initially');

    form.option('scrollingEnabled', false);

    assert.strictEqual(form.getScrollable(), undefined, 'scrollable is undefined after disabling scrolling');
});

QUnit.test('getScrollable content contains form layout manager when scrollingEnabled is true', function(assert) {
    const form = initForm({ scrollingEnabled: true });

    const scrollable = form.getScrollable();
    const $content = $(scrollable.content());

    assert.strictEqual($content.find('.dx-layout-manager').length, 1, 'layout manager is inside scrollable content');
});

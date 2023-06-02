import { hasWindow, getWindow, getNavigator, setWindow, hasProperty } from 'core/utils/window';

QUnit.module('Window utils', {
    afterEach() {
        setWindow(window);
    }
});

QUnit.test('utils should use real DOM API by default', function(assert) {
    assert.strictEqual(hasWindow(), true, 'hasWidow returns true');
    assert.strictEqual(typeof getWindow().getComputedStyle, 'function', 'window is real');
    assert.ok(getNavigator().userAgent.length > 0, 'getNavigator().userAgent returns non-empty string');
    assert.strictEqual(hasProperty('document'), true, 'hasProperty returns true for document');
});

QUnit.test('setWindow should replace window object', function(assert) {
    setWindow({ isWindowMock: true });

    assert.strictEqual(hasWindow(), false, 'hasWidow returns false');
    assert.strictEqual(getWindow().isWindowMock, true, 'window is mocked');
    assert.strictEqual(getNavigator().userAgent, '', 'getNavigator().userAgent returns empty string');
    assert.strictEqual(hasProperty('document'), false, 'hasProperty returns false for document');
});

QUnit.test('setWindow second param should set hasWindow value', function(assert) {
    setWindow({ isWindowMock: true }, true);

    assert.strictEqual(hasWindow(), true, 'hasWidow returns true');
    assert.strictEqual(getWindow().isWindowMock, true, 'window is mocked');
});

QUnit.test('setWindow with real window should return real window', function(assert) {
    setWindow({ isWindowMock: true });
    setWindow(window);

    assert.strictEqual(hasWindow(), true, 'hasWidow returns true');
    assert.strictEqual(typeof getWindow().getComputedStyle, 'function', 'window is real');
    assert.ok(getNavigator().userAgent.length > 0, 'getNavigator().userAgent returns non-empty string');
    assert.strictEqual(hasProperty('document'), true, 'hasProperty returns true for document');
});

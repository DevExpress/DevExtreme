const themes = require('ui/themes');
const viewportUtils = require('core/utils/view_port');

window.includeThemesLinks();

const viewport = document.createElement('div');
viewport.className = 'dx-viewport';
document.body.appendChild(viewport);

QUnit.module('themes', {
    beforeEach: function() {
        this._originalTheme = themes.current();
    },
    afterEach: function() {
        themes.current(this._originalTheme);
        viewportUtils.value(viewport);
    }
});

QUnit.test('theme changing', function(assert) {
    themes.current('generic.light');

    assert.equal(themes.current(), 'generic.light');
    assert.equal(viewport.classList.toString(), [
        'dx-viewport',
        'dx-device-desktop',
        'dx-device-generic',
        'dx-theme-generic',
        'dx-theme-generic-typography',
        'dx-color-scheme-light'
    ].join(' '));
});

QUnit.test('viewport changing', function(assert) {
    themes.current('generic.light');

    const fixture = document.getElementById('qunit-fixture');
    const newViewport = document.createElement('div');
    fixture.appendChild(newViewport);
    viewportUtils.value(newViewport);

    assert.equal(viewportUtils.value()[0], newViewport);
    assert.equal(viewport.classList.toString(), 'dx-viewport');
    assert.equal(newViewport.classList.toString(), [
        'dx-device-desktop',
        'dx-device-generic',
        'dx-theme-generic',
        'dx-theme-generic-typography',
        'dx-color-scheme-light'
    ].join(' '));

    fixture.removeChild(newViewport);
});

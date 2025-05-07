import $ from 'jquery';
import domUtils from '__internal/core/utils/m_dom';
import support from '__internal/core/utils/m_support';
import styleUtils from 'core/utils/style';
import devices from '__internal/core/m_devices';
import initMobileViewport from 'common/core/environment/init_mobile_viewport';
import keyboardMock from '../../helpers/keyboardMock.js';

QUnit.module('createMarkup');

QUnit.test('normalizeTemplateElement with script element', function(assert) {
    const domElement = document.createElement('script');

    domElement.innerHTML = 'Test';

    const $result = domUtils.normalizeTemplateElement(domElement);

    assert.equal($result.text(), 'Test', 'template based on script element works fine');
});


QUnit.module('clipboard');

QUnit.test('get text from clipboard', function(assert) {
    let clipboardText = '';

    const $input = $('<input>').appendTo('#qunit-fixture');
    const keyboard = keyboardMock($input);

    $input.on('paste', function(e) {
        clipboardText = domUtils.clipboardText(e);
    });

    keyboard.paste('test');

    assert.equal(clipboardText, 'test', 'text from clipboard is correct');
});


QUnit.module('selection');

QUnit.test('clearSelection should not run if selectionType is \'Caret\'', function(assert) {
    const originalGetSelection = window.getSelection;

    try {
        let cleared = 0;
        const selectionMockObject = {
            empty: function() { cleared++; },
            type: 'Range'
        };

        window.getSelection = function() { return selectionMockObject; };

        domUtils.clearSelection();
        assert.equal(cleared, 1, 'selection should clear if type is Range');

        selectionMockObject.type = 'Caret';
        domUtils.clearSelection();

        assert.equal(cleared, 1, 'selection should not clear if type is Caret');

    } finally {
        window.getSelection = originalGetSelection;
    }
});

QUnit.module('initMobileViewPort');

QUnit.test('allowSelection should be detected by realDevice', function(assert) {
    if(!support.supportProp('userSelect')) {
        assert.expect(0);
        return;
    }

    const $viewPort = $('<div>').addClass('dx-viewport');
    const originalRealDevice = devices.real();
    const originalCurrentDevice = devices.current();

    $viewPort.appendTo('#qunit-fixture');

    try {
        devices.real({ platform: 'ios', deviceType: 'mobile' });
        devices.current({ platform: 'generic', deviceType: 'desktop' });

        initMobileViewport();

        assert.equal($viewPort.css(styleUtils.styleProp('userSelect')), 'none', 'allow selection detected by real device');
    } finally {
        devices.real(originalRealDevice);
        devices.current(originalCurrentDevice);
    }
});


QUnit.module('Contains');

QUnit.test('it correctly detect the html element', function(assert) {
    const html = document.documentElement;

    assert.ok(domUtils.contains(document, html), 'Document contains the html element');
});

QUnit.test('it correctly detect the body element', function(assert) {
    const body = document.body;

    assert.ok(domUtils.contains(document, body), 'Document contains the body element');
});

QUnit.test('it does not raise error if element is a href', function(assert) {
    const hrefElement = $('<a>')
        .attr({ href: 'text' })
        .get(0);

    try {
        domUtils.contains(document, hrefElement);
    } catch(e) {
        assert.ok(false, `error is raised: ${e.message}`);
    } finally {
        assert.ok(true, 'no error raised');
    }
});

QUnit.test('it correctly detects the window element', function(assert) {
    assert.ok(domUtils.contains(window, document.body), 'Window contains the body element');
});

QUnit.test('it correctly works with svg elements', function(assert) {
    const svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const childElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    svgContainer.appendChild(childElement);

    assert.ok(domUtils.contains(svgContainer, childElement));
});

QUnit.test('element in shadow dom should be detected if container is window', function(assert) {
    const $div = $('<div>').appendTo('#qunit-fixture');
    const divContent = $div.get(0);

    divContent.attachShadow({ mode: 'open' });
    divContent.shadowRoot.innerHTML = '<p>Inner Text</p>';

    const textElement = divContent.shadowRoot.querySelector('p');

    assert.ok(domUtils.contains(window, textElement));
});

QUnit.test('element in shadow dom should be detected if container is div element', function(assert) {
    const $div = $('<div>').appendTo('#qunit-fixture');
    const divContent = $div.get(0);

    divContent.attachShadow({ mode: 'open' });
    divContent.shadowRoot.innerHTML = '<p>Inner Text</p>';

    const textElement = divContent.shadowRoot.querySelector('p');

    assert.ok(domUtils.contains(divContent, textElement));
});

QUnit.test('element in shadow dom should be detected if container is document', function(assert) {
    const $div = $('<div>').appendTo('#qunit-fixture');
    const divContent = $div.get(0);

    divContent.attachShadow({ mode: 'open' });
    divContent.shadowRoot.innerHTML = '<p>Inner Text</p>';

    const textElement = divContent.shadowRoot.querySelector('p');

    assert.ok(domUtils.contains(document, textElement));
});

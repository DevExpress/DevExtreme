import $ from 'jquery';
import domUtils from 'core/utils/dom';
import domAdapter from 'core/dom_adapter';
import support from 'core/utils/support';
import styleUtils from 'core/utils/style';
import devices from 'core/devices';
import initMobileViewport from 'mobile/init_mobile_viewport';
import keyboardMock from '../../helpers/keyboardMock.js';

QUnit.module('createMarkup');

QUnit.test('createMarkupFromString', function(assert) {
    const originalWinJS = window.WinJS;
    const str = '<div>test</div>';
    let $resultElement;

    try {
        window.WinJS = undefined;
        $resultElement = domUtils.createMarkupFromString(str);
        assert.equal($resultElement.length, 1);
        assert.equal($resultElement.text(), 'test');

        window.WinJS = {
            Utilities: {
                setInnerHTMLUnsafe: function(tempElement, str) {
                    $(tempElement).append(str);
                }
            }
        };
        $resultElement = domUtils.createMarkupFromString(str);
        assert.equal($resultElement.length, 1);
        assert.equal($resultElement.text(), 'test');
    } finally {
        window.WinJS = originalWinJS;
    }
});

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

QUnit.test('resetActiveElement should not throw an error in IE', function(assert) {
    const getActiveElement = sinon.stub(domAdapter, 'getActiveElement').returns({
        blur: function() {
            throw 'IE throws an \'Incorrect Function\' exception in blur method';
        }
    });
    const bodyBlur = sinon.spy(document.body, 'blur');

    try {
        domUtils.resetActiveElement();
        assert.strictEqual(bodyBlur.callCount, 1, 'body should be blured if blur function on element does not work');
    } finally {
        bodyBlur.restore();
        getActiveElement.restore();
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

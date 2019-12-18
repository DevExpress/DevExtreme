import $ from 'jquery';
import eventsEngine from 'events/core/events_engine';
import browser from 'core/utils/browser';
import { fileSaver } from 'exporter';
import errors from 'ui/widget/ui.errors';
import typeUtils from 'core/utils/type';
import domAdapter from 'core/dom_adapter';
import ariaAccessibilityTestHelper from '../../helpers/ariaAccessibilityTestHelper.js';

QUnit.module('saveAs');

QUnit.test('exportLinkElement generate', function(assert) {
    if(!typeUtils.isFunction(window.Blob)) {
        assert.ok(true, 'This browser doesn\'t support Blob function');
        return;
    }

    if(typeUtils.isDefined(navigator.msSaveOrOpenBlob)) {
        assert.ok(true, 'This browser use msSaveOrOpenBlob for save blob');
        return;
    }

    var URL = window.URL || window.webkitURL || window.mozURL || window.msURL || window.oURL;

    var helper = new ariaAccessibilityTestHelper(() => {});

    var href = URL.createObjectURL(new Blob([], { type: 'test/plain' }));

    var testExportLink = fileSaver._linkDownloader('test.xlsx', href);
    testExportLink.id = 'link';

    helper.checkAttributes($(testExportLink), { id: 'link', target: '_blank', download: 'test.xlsx', href: href }, 'downloadLink');
    assert.equal(domAdapter.getDocument().getElementById('link'), null, 'download link not attached to a document');

    var clickHandler = sinon.spy();
    testExportLink.addEventListener('click', function(e) {
        clickHandler(e);
        e.preventDefault();
    });

    fileSaver._click(testExportLink);

    assert.equal(clickHandler.callCount, 1, '\'click\' event dispatched');
    URL.revokeObjectURL(href);
});

QUnit.test('saveAs - check revokeObjectURL', function(assert) {
    if(!typeUtils.isFunction(window.Blob)) {
        assert.ok(true, 'This browser doesn\'t support Blob function');
        return;
    }

    if(typeUtils.isDefined(navigator.msSaveOrOpenBlob)) {
        assert.ok(true, 'This browser use msSaveOrOpenBlob for save blob');
        return;
    }

    assert.timeout(1000);
    var done = assert.async();
    assert.expect(5);
    assert.equal(fileSaver._revokeObjectURLTimeout, 30000, 'default fileSaver._revokeObjectURLTimeout');

    var oldRevokeObjectURLTimeout = fileSaver._revokeObjectURLTimeout;
    var oldFileSaverClick = fileSaver._click;
    try {
        fileSaver._revokeObjectURLTimeout = 100;
        fileSaver._objectUrlRevoked = false;

        fileSaver._click = function(link) {
            link.addEventListener('click', function(e) {
                assert.ok(true, 'file should be download');
                e.preventDefault();
            });

            oldFileSaverClick(link);
        };

        fileSaver.saveAs('test', 'EXCEL', new Blob([], { type: 'test/plain' }));

        assert.ok(!fileSaver._objectUrlRevoked, 'objectURL is not revoked immediately');
        setTimeout(
            function() {
                assert.ok(!fileSaver._objectUrlRevoked, 'objectURL is not revoked immediately');
            },
            50);

        setTimeout(
            function() {
                assert.ok(fileSaver._objectUrlRevoked, 'objectURL is revoked after fileSaver._revokeObjectURLTimeout');
                done();
            },
            150);
    } finally {
        fileSaver._revokeObjectURLTimeout = oldRevokeObjectURLTimeout;
        fileSaver._click = oldFileSaverClick;
    }
});

QUnit.test('Proxy Url exportForm generate', function(assert) {
    var originalTrigger = eventsEngine.trigger;
    eventsEngine.trigger = $.noop;
    // act
    var testForm = fileSaver._saveByProxy('#', 'testFile.xlsx', 'EXCEL', 'testData');

    // assert
    assert.equal(testForm.attr('action'), '#', 'Set proxy as form action');
    assert.equal(testForm.children('input[name=contentType]').eq(0).val(), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Set contentType in form Post data');
    assert.equal(testForm.children('input[name=fileName]').eq(0).val(), 'testFile.xlsx', 'Set fileName in form Post data');
    assert.equal(testForm.children('input[name=data]').eq(0).val(), 'testData', 'Set data in form Post data');

    eventsEngine.trigger = originalTrigger;
});

QUnit.test('Save blob by _winJSBlobSave on winJS devices', function(assert) {
    // arrange
    if(!browser.msie && typeUtils.isFunction(window.Blob)) {
        var _winJSBlobSave = fileSaver._winJSBlobSave,
            isCalled = false;
        try {
            window.WinJS = {};
            fileSaver._winJSBlobSave = function() { isCalled = true; };

            // act
            fileSaver.saveAs('test', 'EXCEL', [], 'testUrl');

            // assert
            assert.ok(isCalled);
        } finally {
            delete window.WinJS;
            fileSaver._winJSBlobSave = _winJSBlobSave;
        }
    } else {
        assert.ok(true, 'This test is for not IE browsers');
    }
});

QUnit.test('Save base 64 for Safari', function(assert) {
    if(!typeUtils.isFunction(window.Blob)) {
        if(browser.msie) {
            assert.ok(true, 'This test not for IE browsers');
            return;
        }
        // arrange
        var exportLinkElementClicked = false,
            _linkDownloader = fileSaver._linkDownloader;

        fileSaver._linkDownloader = function() { exportLinkElementClicked = true; };
        fileSaver.saveAs('test', 'EXCEL');

        // assert
        assert.ok(exportLinkElementClicked, 'ExportLink href generated');

        fileSaver._linkDownloader = _linkDownloader;
    } else {
        assert.ok(true, 'This test for browsers have no Blob function support ');
        return;
    }
});

QUnit.test('No E1034 on iPad', function(assert) {
    if(!typeUtils.isDefined(navigator.userAgent.match(/iPad/i))) {
        assert.ok(true, 'This test for iPad devices');
        return;
    }

    var done = assert.async();
    var warningSend = null;
    var _devExpressLog = errors.log;
    var _fileSaverClick = fileSaver._click;
    var oldRevokeObjectURLTimeout = fileSaver._revokeObjectURLTimeout;

    try {
        fileSaver._click = () => { };
        fileSaver._revokeObjectURLTimeout = 100;

        errors.log = function(errorCode) { warningSend = errorCode; return; };

        fileSaver.saveAs('test', 'EXCEL', new Blob([], { type: 'test/plain' }));

        setTimeout(() => {
            assert.ok(warningSend !== 'E1034', 'Warning E1034 wasn\'t sent');
            done();
        }, 150);
    } finally {
        errors.log = _devExpressLog;
        fileSaver._click = _fileSaverClick;
        fileSaver._revokeObjectURLTimeout = oldRevokeObjectURLTimeout;
    }
});

QUnit.test('Blob is saved via msSaveOrOpenBlob method', function(assert) {
    if(browser.msie && parseInt(browser.version) > 9) {
        // arrange
        var isCalled,
            _msSaveOrOpenBlob = navigator.msSaveOrOpenBlob;

        navigator.msSaveOrOpenBlob = function(data, fileName) {
            isCalled = true;
        };

        // act
        fileSaver._saveBlobAs('test', 'EXCEL', new Blob([], { type: 'test/plain' }));

        // assert
        assert.ok(fileSaver._blobSaved, 'blob is saved');
        assert.ok(isCalled, 'msSaveOrOpenBlob method is called');

        navigator.msSaveOrOpenBlob = _msSaveOrOpenBlob;
    } else {
        assert.ok(true, 'This test for ie10+ browsers');
        return;
    }
});

QUnit.test('SaveBlobAs is called after saveAs', function(assert) {
    if(!typeUtils.isFunction(window.Blob)) {
        assert.ok(true, 'This browser doesn\'t support Blob function');
        return;
    }

    // arrange
    var saveBlobAs = fileSaver._saveBlobAs,
        isSaveBlobAs = false;

    fileSaver._saveBlobAs = function() {
        isSaveBlobAs = true;
    };

    // act
    fileSaver.saveAs('test', 'EXCEl');

    fileSaver._saveBlobAs = saveBlobAs;

    // assert
    assert.ok(isSaveBlobAs);
});

QUnit.test('Force using proxy', function(assert) {
    sinon.stub(eventsEngine, 'trigger');
    try {
        // act
        fileSaver.saveAs('test', 'EXCEl', undefined, 'http://localhost/', true);

        // assert
        assert.deepEqual(eventsEngine.trigger.lastCall.args[1], 'submit');
    } finally {
        eventsEngine.trigger.restore();
    }
});

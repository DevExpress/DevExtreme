import $ from 'jquery';
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

    const URL = window.URL || window.webkitURL || window.mozURL || window.msURL || window.oURL;

    const helper = new ariaAccessibilityTestHelper(() => {});

    const href = URL.createObjectURL(new Blob([], { type: 'test/plain' }));

    const testExportLink = fileSaver._linkDownloader('test.xlsx', href);
    testExportLink.id = 'link';

    helper.checkAttributes($(testExportLink), { id: 'link', target: '_blank', download: 'test.xlsx', href: href }, 'downloadLink');
    assert.equal(domAdapter.getDocument().getElementById('link'), null, 'download link not attached to a document');

    const clickHandler = sinon.spy();
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
    const done = assert.async();
    assert.expect(5);
    assert.equal(fileSaver._revokeObjectURLTimeout, 30000, 'default fileSaver._revokeObjectURLTimeout');

    const oldRevokeObjectURLTimeout = fileSaver._revokeObjectURLTimeout;
    const oldFileSaverClick = fileSaver._click;
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

QUnit.test('Save blob by _winJSBlobSave on winJS devices', function(assert) {
    if(typeUtils.isFunction(window.Blob)) {
        const _winJSBlobSave = fileSaver._winJSBlobSave;
        let isCalled = false;
        try {
            window.WinJS = {};
            fileSaver._winJSBlobSave = function() { isCalled = true; };

            fileSaver.saveAs('test', 'EXCEL', [], 'testUrl');

            assert.ok(isCalled);
        } finally {
            delete window.WinJS;
            fileSaver._winJSBlobSave = _winJSBlobSave;
        }
    }
});

QUnit.test('Save base 64 for Safari', function(assert) {
    if(!typeUtils.isFunction(window.Blob)) {
        let exportLinkElementClicked = false;
        const _linkDownloader = fileSaver._linkDownloader;

        fileSaver._linkDownloader = function() { exportLinkElementClicked = true; };
        fileSaver.saveAs('test', 'EXCEL');

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

    const done = assert.async();
    let warningSend = null;
    const _devExpressLog = errors.log;
    const _fileSaverClick = fileSaver._click;
    const oldRevokeObjectURLTimeout = fileSaver._revokeObjectURLTimeout;

    try {
        fileSaver._click = () => { };
        fileSaver._revokeObjectURLTimeout = 100;

        errors.log = function(errorCode) { warningSend = errorCode; return; };

        fileSaver.saveAs('test', 'EXCEL', new Blob([], { type: 'test/plain' }));

        setTimeout(() => {
            assert.notStrictEqual(warningSend, 'E1034', 'Warning E1034 wasn\'t sent');
            done();
        }, 150);
    } finally {
        errors.log = _devExpressLog;
        fileSaver._click = _fileSaverClick;
        fileSaver._revokeObjectURLTimeout = oldRevokeObjectURLTimeout;
    }
});

QUnit.test('SaveBlobAs is called after saveAs', function(assert) {
    if(!typeUtils.isFunction(window.Blob)) {
        assert.ok(true, 'This browser doesn\'t support Blob function');
        return;
    }

    const saveBlobAs = fileSaver._saveBlobAs;
    let isSaveBlobAs = false;

    fileSaver._saveBlobAs = function() {
        isSaveBlobAs = true;
    };

    fileSaver.saveAs('test', 'EXCEl');
    fileSaver._saveBlobAs = saveBlobAs;

    assert.ok(isSaveBlobAs);
});

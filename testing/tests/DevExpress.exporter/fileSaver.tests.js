"use strict";

var $ = require("jquery"),
    browser = require("core/utils/browser"),
    fileSaver = require("client_exporter").fileSaver,
    errors = require("ui/widget/ui.errors"),
    commonUtils = require("core/utils/common");

QUnit.module("saveAs");

QUnit.test("IE9 do not save without proxy", function(assert) {
    if(!browser.msie || parseInt(browser.version) >= 10) {
        assert.ok(true, "This test only for IE version below 10");
        return;
    }

    //arrange
    var fileSaved = false,
        warningSend = null,
        _errorsLog = errors.log,
        _saveBlobAs = fileSaver._saveBlobAs,
        _saveByProxy = fileSaver._saveByProxy,
        _saveBase64As = fileSaver._saveBase64As;

    //act
    errors.log = function(errorCode) { warningSend = errorCode; return; };
    fileSaver._saveBlobAs = fileSaver._saveBase64As = fileSaver._saveByProxy = function() { fileSaved = true; return; };

    fileSaver.saveAs("test", "EXCEL", null, undefined);

    //assert
    assert.ok(!fileSaved, "File wasn't load");
    assert.equal(warningSend, "E1034", "Warning E1034 was sent");

    errors.log = _errorsLog;
    fileSaver._saveBlobAs = _saveBlobAs;
    fileSaver._saveByProxy = _saveByProxy;
    fileSaver._saveBase64As = _saveBase64As;

});

QUnit.test("exportLinkElement generate", function(assert) {
    if(!commonUtils.isFunction(window.Blob)) {
        assert.ok(true, "This browser doesn't support Blob function");
        return;
    }

    if(commonUtils.isDefined(navigator.msSaveOrOpenBlob)) {
        assert.ok(true, "This browser use msSaveOrOpenBlob for save blob");
        return;
    }

    //act
    var testExportLink = fileSaver._saveBlobAs("test.xlsx", "EXCEL", new Blob([], { type: "test/plain" }), "$(this).attr('rel','clicked'); return false;");

    //assert
    assert.ok(testExportLink);
    assert.ok(String($(testExportLink).attr("href")).indexOf("blob:") !== -1, "ExportLink href corrected");
    assert.equal($(testExportLink).attr("download"), "test.xlsx", "ExportLink download attribute corrected");
    assert.equal($(testExportLink).css("display"), "none", "ExportLink is styled display none");
    assert.equal($(testExportLink).attr("rel"), "clicked", "ExportLink is clicked");
});

QUnit.test("Proxy Url exportForm generate", function(assert) {
    //act
    var testForm = fileSaver._saveByProxy("#", "testFile.xlsx", "EXCEL", "testData", function() { return false; });

    //assert
    assert.equal(testForm.attr("action"), "#", "Set proxy as form action");
    assert.equal(testForm.children("input[name=contentType]").eq(0).val(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Set contentType in form Post data");
    assert.equal(testForm.children("input[name=fileName]").eq(0).val(), "testFile.xlsx", "Set fileName in form Post data");
    assert.equal(testForm.children("input[name=data]").eq(0).val(), "testData", "Set data in form Post data");
});

QUnit.test("Save blob by _winJSBlobSave on winJS devices", function(assert) {
    //arrange
    if(!browser.msie && commonUtils.isFunction(window.Blob)) {
        var _winJSBlobSave = fileSaver._winJSBlobSave,
            isCalled = false;
        try {
            window.WinJS = {};
            fileSaver._winJSBlobSave = function() { isCalled = true; };

            //act
            fileSaver.saveAs("test", "EXCEL", [], "testUrl");

            //assert
            assert.ok(isCalled);
        } finally {
            delete window.WinJS;
            fileSaver._winJSBlobSave = _winJSBlobSave;
        }
    } else {
        assert.ok(true, "This test is for not IE browsers");
    }
});


QUnit.test("Save base64 via proxyUrl for IE < 10", function(assert) {
    //act
    if(browser.msie && parseInt(browser.version) < 10) {
        var _formDownloader = fileSaver._linkDownloader,
            isCalled;

        fileSaver._formDownloader = function() { isCalled = "proxyForm"; };

        fileSaver.saveAs("test", "EXCEL", [], "testUrl");

        //assert
        assert.ok(isCalled);

        fileSaver._linkDownloader = _formDownloader;
    } else {
        assert.ok(true, "Test for ie<10");
    }
});

QUnit.test("Save base 64 for Safari", function(assert) {
    if(!commonUtils.isFunction(window.Blob)) {
        if(browser.msie) {
            assert.ok(true, "This test not for IE browsers");
            return;
        }
        //arrange
        var exportLinkElementClicked = false,
            _linkDownloader = fileSaver._linkDownloader;

        fileSaver._linkDownloader = function() { exportLinkElementClicked = true; };
        fileSaver.saveAs("test", "EXCEL");

        //assert
        assert.ok(exportLinkElementClicked, "ExportLink href generated");

        fileSaver._linkDownloader = _linkDownloader;
    } else {
        assert.ok(true, "This test for browsers have no Blob function support ");
        return;
    }
});

QUnit.test("No E1034 on iPad", function(assert) {
    if(!commonUtils.isDefined(navigator.userAgent.match(/iPad/i))) {
        assert.ok(true, "This test for iPad devices");
        return;
    }
    //arrange
    var warningSend = null,
        _devExpressLog = errors.log,
        _linkDownloader = fileSaver._linkDownloader;

    //act
    fileSaver._linkDownloader = function() { return; };
    errors.log = function(errorCode) { warningSend = errorCode; return; };

    fileSaver.saveAs("test", "EXCEL", new Blob([], { type: "test/plain" }));

    //assert
    assert.ok(warningSend !== "E1034", "Warning E1034 wasn't sent");

    errors.log = _devExpressLog;
    fileSaver._linkDownloader = _linkDownloader;

});

QUnit.test("Blob is saved via msSaveOrOpenBlob method", function(assert) {
    if(browser.msie && parseInt(browser.version) > 9) {
        //arrange
        var isCalled,
            _msSaveOrOpenBlob = navigator.msSaveOrOpenBlob;

        navigator.msSaveOrOpenBlob = function(data, fileName) {
            isCalled = true;
        };

        //act
        fileSaver._saveBlobAs("test", "EXCEL", new Blob([], { type: "test/plain" }));

        //assert
        assert.ok(fileSaver._blobSaved, "blob is saved");
        assert.ok(isCalled, "msSaveOrOpenBlob method is called");

        navigator.msSaveOrOpenBlob = _msSaveOrOpenBlob;
    } else {
        assert.ok(true, "This test for ie10+ browsers");
        return;
    }
});

QUnit.test("SaveBlobAs is called after saveAs", function(assert) {
    if(!commonUtils.isFunction(window.Blob)) {
        assert.ok(true, "This browser doesn't support Blob function");
        return;
    }

    //arrange
    var saveBlobAs = fileSaver._saveBlobAs,
        isSaveBlobAs = false;

    fileSaver._saveBlobAs = function() {
        isSaveBlobAs = true;
    };

    //act
    fileSaver.saveAs("test", "EXCEl");

    fileSaver._saveBlobAs = saveBlobAs;

    //assert
    assert.ok(isSaveBlobAs);
});

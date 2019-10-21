var $ = require("jquery"),
    eventsEngine = require("events/core/events_engine"),
    browser = require("core/utils/browser"),
    fileSaver = require("exporter").fileSaver,
    errors = require("ui/widget/ui.errors"),
    typeUtils = require("core/utils/type");

QUnit.module("saveAs");

QUnit.test("exportLinkElement generate", function(assert) {
    if(!typeUtils.isFunction(window.Blob)) {
        assert.ok(true, "This browser doesn't support Blob function");
        return;
    }

    if(typeUtils.isDefined(navigator.msSaveOrOpenBlob)) {
        assert.ok(true, "This browser use msSaveOrOpenBlob for save blob");
        return;
    }

    var clock = sinon.useFakeTimers(),
        oldRevokeObjectURLTimeout = fileSaver._revokeObjectURLTimeout;

    try {
        fileSaver._revokeObjectURLTimeout = 0;
        // act
        var clickHandler = function(e) {
                $(e.target).attr('rel', 'clicked');
                e.preventDefault();
            },
            testExportLink = fileSaver._saveBlobAs("test.xlsx", "EXCEL", new Blob([], { type: "test/plain" }), clickHandler);

        clock.tick();

        // assert
        assert.ok(testExportLink);
        assert.ok(String($(testExportLink).attr("href")).indexOf("blob:") !== -1, "ExportLink href corrected");
        assert.equal($(testExportLink).attr("download"), "test.xlsx", "ExportLink download attribute corrected");
        assert.equal($(testExportLink).css("display"), "none", "ExportLink is styled display none");
        assert.equal($(testExportLink).attr("rel"), "clicked", "ExportLink is clicked");

        // T596771
        assert.notOk($(testExportLink).parent().length, "link is removed");
        assert.ok(fileSaver._objectUrlRevoked, "objectURL is revoked");
    } finally {
        fileSaver._revokeObjectURLTimeout = oldRevokeObjectURLTimeout;
        clock.restore();
    }
});

QUnit.test("saveAs - check revokeObjectURL", function(assert) {
    if(!typeUtils.isFunction(window.Blob)) {
        assert.ok(true, "This browser doesn't support Blob function");
        return;
    }

    if(typeUtils.isDefined(navigator.msSaveOrOpenBlob)) {
        assert.ok(true, "This browser use msSaveOrOpenBlob for save blob");
        return;
    }

    assert.timeout(1000);
    var done = assert.async();
    assert.expect(4);
    assert.equal(fileSaver._revokeObjectURLTimeout, 30000, "default fileSaver._revokeObjectURLTimeout");

    var oldRevokeObjectURLTimeout = fileSaver._revokeObjectURLTimeout;
    try {
        fileSaver._revokeObjectURLTimeout = 100;
        fileSaver._objectUrlRevoked = false;

        fileSaver.saveAs(
            "test.xlsx", "EXCEL", new Blob([], { type: "test/plain" }), null,
            function(e) {
                $(e.target).attr('rel', 'clicked');
                e.preventDefault();
            });

        assert.ok(!fileSaver._objectUrlRevoked, "objectURL is not revoked immediately");
        setTimeout(
            function() {
                assert.ok(!fileSaver._objectUrlRevoked, "objectURL is not revoked immediately");
            },
            50);

        setTimeout(
            function() {
                assert.ok(fileSaver._objectUrlRevoked, "objectURL is revoked after fileSaver._revokeObjectURLTimeout");
                done();
            },
            150);
    } finally {
        fileSaver._revokeObjectURLTimeout = oldRevokeObjectURLTimeout;
    }
});

QUnit.test("Proxy Url exportForm generate", function(assert) {
    var originalTrigger = eventsEngine.trigger;
    eventsEngine.trigger = $.noop;
    // act
    var testForm = fileSaver._saveByProxy("#", "testFile.xlsx", "EXCEL", "testData");

    // assert
    assert.equal(testForm.attr("action"), "#", "Set proxy as form action");
    assert.equal(testForm.children("input[name=contentType]").eq(0).val(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Set contentType in form Post data");
    assert.equal(testForm.children("input[name=fileName]").eq(0).val(), "testFile.xlsx", "Set fileName in form Post data");
    assert.equal(testForm.children("input[name=data]").eq(0).val(), "testData", "Set data in form Post data");

    eventsEngine.trigger = originalTrigger;
});

QUnit.test("Save blob by _winJSBlobSave on winJS devices", function(assert) {
    // arrange
    if(!browser.msie && typeUtils.isFunction(window.Blob)) {
        var _winJSBlobSave = fileSaver._winJSBlobSave,
            isCalled = false;
        try {
            window.WinJS = {};
            fileSaver._winJSBlobSave = function() { isCalled = true; };

            // act
            fileSaver.saveAs("test", "EXCEL", [], "testUrl");

            // assert
            assert.ok(isCalled);
        } finally {
            delete window.WinJS;
            fileSaver._winJSBlobSave = _winJSBlobSave;
        }
    } else {
        assert.ok(true, "This test is for not IE browsers");
    }
});

QUnit.test("Save base 64 for Safari", function(assert) {
    if(!typeUtils.isFunction(window.Blob)) {
        if(browser.msie) {
            assert.ok(true, "This test not for IE browsers");
            return;
        }
        // arrange
        var exportLinkElementClicked = false,
            _linkDownloader = fileSaver._linkDownloader;

        fileSaver._linkDownloader = function() { exportLinkElementClicked = true; };
        fileSaver.saveAs("test", "EXCEL");

        // assert
        assert.ok(exportLinkElementClicked, "ExportLink href generated");

        fileSaver._linkDownloader = _linkDownloader;
    } else {
        assert.ok(true, "This test for browsers have no Blob function support ");
        return;
    }
});

QUnit.test("No E1034 on iPad", function(assert) {
    if(!typeUtils.isDefined(navigator.userAgent.match(/iPad/i))) {
        assert.ok(true, "This test for iPad devices");
        return;
    }
    // arrange
    var warningSend = null,
        _devExpressLog = errors.log,
        _linkDownloader = fileSaver._linkDownloader;

    // act
    fileSaver._linkDownloader = function() { return; };
    errors.log = function(errorCode) { warningSend = errorCode; return; };

    fileSaver.saveAs("test", "EXCEL", new Blob([], { type: "test/plain" }));

    // assert
    assert.ok(warningSend !== "E1034", "Warning E1034 wasn't sent");

    errors.log = _devExpressLog;
    fileSaver._linkDownloader = _linkDownloader;

});

QUnit.test("Blob is saved via msSaveOrOpenBlob method", function(assert) {
    if(browser.msie && parseInt(browser.version) > 9) {
        // arrange
        var isCalled,
            _msSaveOrOpenBlob = navigator.msSaveOrOpenBlob;

        navigator.msSaveOrOpenBlob = function(data, fileName) {
            isCalled = true;
        };

        // act
        fileSaver._saveBlobAs("test", "EXCEL", new Blob([], { type: "test/plain" }));

        // assert
        assert.ok(fileSaver._blobSaved, "blob is saved");
        assert.ok(isCalled, "msSaveOrOpenBlob method is called");

        navigator.msSaveOrOpenBlob = _msSaveOrOpenBlob;
    } else {
        assert.ok(true, "This test for ie10+ browsers");
        return;
    }
});

QUnit.test("SaveBlobAs is called after saveAs", function(assert) {
    if(!typeUtils.isFunction(window.Blob)) {
        assert.ok(true, "This browser doesn't support Blob function");
        return;
    }

    // arrange
    var saveBlobAs = fileSaver._saveBlobAs,
        isSaveBlobAs = false;

    fileSaver._saveBlobAs = function() {
        isSaveBlobAs = true;
    };

    // act
    fileSaver.saveAs("test", "EXCEl");

    fileSaver._saveBlobAs = saveBlobAs;

    // assert
    assert.ok(isSaveBlobAs);
});

QUnit.test("Force using proxy", function(assert) {
    sinon.stub(eventsEngine, "trigger");
    try {
        // act
        fileSaver.saveAs("test", "EXCEl", undefined, "http://localhost/", undefined, true);

        // assert
        assert.deepEqual(eventsEngine.trigger.lastCall.args[1], "submit");
    } finally {
        eventsEngine.trigger.restore();
    }
});

QUnit.test("Using proxyUrl is now deprecated", function(assert) {
    sinon.stub(eventsEngine, "trigger");
    sinon.stub(errors, "log");
    try {
        // act
        fileSaver.saveAs("test", "EXCEl", undefined, "http://localhost/", undefined, true);

        // assert
        assert.equal(errors.log.callCount, 1);
        assert.equal(errors.log.getCall(0).args[0], "W0001");
    } finally {
        eventsEngine.trigger.restore();
        errors.log.restore();
    }
});

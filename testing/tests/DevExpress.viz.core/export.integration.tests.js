"use strict";

require("viz/tree_map/tree_map");

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    rendererModule = require("viz/core/renderers/renderer"),
    clientExporter = require("client_exporter"),
    exportModule = require("viz/core/export");

$("#qunit-fixture").append('<div id="test-container" style="width: 200px; height: 150px;"></div>');

QUnit.module("Export", {
    beforeEach: function() {
        this.$container = $("#test-container");
        var renderer = this.renderer = new vizMocks.Renderer();
        rendererModule.Renderer = function() {
            return renderer;
        };

        this.renderer.svg = sinon.stub().returns("testMarkup");

        var exportMenu = this.exportMenu = new vizMocks.ExportMenu();
        exportModule.ExportMenu = sinon.spy(function() { return exportMenu; });

        sinon.stub(clientExporter, "export");
    },

    afterEach: function() {
        clientExporter.export.restore();
    },

    createWidget: function(options) {
        return this.$container.dxTreeMap(options).dxTreeMap("instance");
    }
});

QUnit.test('Export method. Defined options', function(assert) {
    //arrange
    var exportFunc = clientExporter.export,
        exportedStub = sinon.spy(),
        exportingStub = sinon.spy(),
        fileSavingStub = sinon.spy(),
        widget = this.createWidget({
            "export": {
                backgroundColor: "#ff0000",
                proxyUrl: "testProxy"
            },
            onExporting: exportingStub,
            onExported: exportedStub,
            onFileSaving: fileSavingStub
        });

    widget.$element().css("background-color", "#ff0000");

    //act
    widget.exportTo("testName", "jpeg");

    var firstExportCall = exportFunc.getCall(0);
    firstExportCall.args[1].exportingAction();
    firstExportCall.args[1].exportedAction();
    firstExportCall.args[1].fileSavingAction();

    //assert
    assert.ok(exportFunc.callCount, 1, "export was called one time");
    assert.equal(firstExportCall.args[0], "testMarkup", "export data");

    assert.equal(firstExportCall.args[1].width, 200, "width");
    assert.equal(firstExportCall.args[1].height, 150, "height");
    assert.equal(firstExportCall.args[1].backgroundColor, "#ff0000", "backgroundColor");
    assert.equal(firstExportCall.args[1].fileName, "testName", "fileName");
    assert.equal(firstExportCall.args[1].format, "JPEG", "format");
    assert.equal(firstExportCall.args[1].proxyUrl, "testProxy", "proxyUrl");

    assert.equal(exportingStub.callCount, 1, "exporting event");
    assert.equal(exportedStub.callCount, 1, "exported event");
    assert.equal(fileSavingStub.callCount, 1, "file saving event");
});

QUnit.test('Export method. PNG format', function(assert) {
    //arrange
    var exportFunc = clientExporter.export,
        exportedStub = sinon.spy(),
        exportingStub = sinon.spy(),
        fileSavingStub = sinon.spy(),
        widget = this.createWidget({
            "export": {
                proxyUrl: "testProxy"
            },
            onExporting: exportingStub,
            onExported: exportedStub,
            onFileSaving: fileSavingStub
        });

    widget.$element().css("background-color", "#ff0000");

    //act
    widget.exportTo("testName", "png");

    //assert
    var firstExportCall = exportFunc.getCall(0);
    assert.ok(exportFunc.callCount, 1, "export was called one time");
    assert.equal(firstExportCall.args[1].format, "PNG", "format");
});

QUnit.test('Export method. JPEG format', function(assert) {
    //arrange
    var exportFunc = clientExporter.export,
        exportedStub = sinon.spy(),
        exportingStub = sinon.spy(),
        fileSavingStub = sinon.spy(),
        widget = this.createWidget({
            "export": {
                proxyUrl: "testProxy"
            },
            onExporting: exportingStub,
            onExported: exportedStub,
            onFileSaving: fileSavingStub
        });

    widget.$element().css("background-color", "#ff0000");

    //act
    widget.exportTo("testName", "jpeg");

    //assert
    var firstExportCall = exportFunc.getCall(0);
    assert.ok(exportFunc.callCount, 1, "export was called one time");
    assert.equal(firstExportCall.args[1].format, "JPEG", "format");
});

QUnit.test('Export method. GIF format', function(assert) {
    //arrange
    var exportFunc = clientExporter.export,
        exportedStub = sinon.spy(),
        exportingStub = sinon.spy(),
        fileSavingStub = sinon.spy(),
        widget = this.createWidget({
            "export": {
                proxyUrl: "testProxy"
            },
            onExporting: exportingStub,
            onExported: exportedStub,
            onFileSaving: fileSavingStub
        });

    widget.$element().css("background-color", "#ff0000");

    //act
    widget.exportTo("testName", "gif");

    //assert
    var firstExportCall = exportFunc.getCall(0);
    assert.ok(exportFunc.callCount, 1, "export was called one time");
    assert.equal(firstExportCall.args[1].format, "GIF", "format");
});

QUnit.test('Export method. SVG format', function(assert) {
    //arrange
    var exportFunc = clientExporter.export,
        exportedStub = sinon.spy(),
        exportingStub = sinon.spy(),
        fileSavingStub = sinon.spy(),
        widget = this.createWidget({
            "export": {
                proxyUrl: "testProxy"
            },
            onExporting: exportingStub,
            onExported: exportedStub,
            onFileSaving: fileSavingStub
        });

    widget.$element().css("background-color", "#ff0000");

    //act
    widget.exportTo("testName", "svg");

    //assert
    var firstExportCall = exportFunc.getCall(0);
    assert.ok(exportFunc.callCount, 1, "export was called one time");
    assert.equal(firstExportCall.args[1].format, "SVG", "format");
});

QUnit.test('Export method. PDF format', function(assert) {
    //arrange
    var exportFunc = clientExporter.export,
        exportedStub = sinon.spy(),
        exportingStub = sinon.spy(),
        fileSavingStub = sinon.spy(),
        widget = this.createWidget({
            "export": {
                proxyUrl: "testProxy"
            },
            onExporting: exportingStub,
            onExported: exportedStub,
            onFileSaving: fileSavingStub
        });

    widget.$element().css("background-color", "#ff0000");

    //act
    widget.exportTo("testName", "pdf");

    //assert
    var firstExportCall = exportFunc.getCall(0);
    assert.ok(exportFunc.callCount, 1, "export was called one time");
    assert.equal(firstExportCall.args[1].format, "PDF", "format");
});

QUnit.test('Export method. invalid format', function(assert) {
    //arrange
    var exportFunc = clientExporter.export,
        exportedStub = sinon.spy(),
        exportingStub = sinon.spy(),
        fileSavingStub = sinon.spy(),
        widget = this.createWidget({
            "export": {
                proxyUrl: "testProxy"
            },
            onExporting: exportingStub,
            onExported: exportedStub,
            onFileSaving: fileSavingStub
        });

    widget.$element().css("background-color", "#ff0000");

    //act
    widget.exportTo("testName", "abc");

    //assert
    var firstExportCall = exportFunc.getCall(0);
    assert.ok(exportFunc.callCount, 1, "export was called one time");
    assert.equal(firstExportCall.args[1].format, "PNG", "format");
});

QUnit.test('Export method. Undefined options', function(assert) {
    //arrange
    var exportFunc = clientExporter.export,
        widget = this.createWidget();

    widget.$element().css("background-color", "rgba(0, 0, 0, 0)");

    //act
    widget.exportTo();

    //assert
    var firstExportCall = exportFunc.getCall(0);
    assert.equal(firstExportCall.args[1].backgroundColor, "#ffffff", "backgroundColor");
    assert.equal(firstExportCall.args[1].fileName, "file", "fileName");
    assert.equal(firstExportCall.args[1].format, "PNG", "format");
    assert.equal(firstExportCall.args[1].proxyUrl, undefined, "proxyUrl");
});

QUnit.test('Export menu creation', function(assert) {
    //arrange, act
    var incidentOccurred = sinon.spy();
    this.createWidget({
        incidentOccurred: incidentOccurred
    });

    //assert
    assert.equal(exportModule.ExportMenu.lastCall.args[0].renderer, this.renderer);
    assert.ok(typeof exportModule.ExportMenu.lastCall.args[0].svgMethod === "function");
    assert.ok(typeof exportModule.ExportMenu.lastCall.args[0].incidentOccurred === "function");
});

QUnit.test("Export menu disposing", function(assert) {
    //arrange
    this.createWidget();

    //act
    this.$container.remove();

    //assert
    assert.equal(this.exportMenu.dispose.callCount, 1, "disposing of export menu is called");
});

QUnit.test("export menu option", function(assert) {
    //arrange
    var widget = this.createWidget();

    //act
    widget.option("export", { tag: "options" });

    //assert
    var exportOptions = this.exportMenu.setOptions.getCall(0).args[0].exportOptions;

    assert.equal(exportOptions.fileName, "file", "file name");
    assert.equal(exportOptions.format, "PNG", "format");
    assert.equal(exportOptions.height, 150, "canvas height");
    assert.equal(exportOptions.width, 200, "canvas width");

    assert.ok(exportOptions.exportedAction, "exportedAction");
    assert.ok(exportOptions.exportingAction, "exportingAction");
    assert.ok(exportOptions.fileSavingAction, "fileSavingAction");
});

QUnit.test("Depends on theme", function(assert) {
    var widget = this.createWidget();
    this.exportMenu.setOptions.reset();

    widget.option("theme", "test-theme");

    assert.strictEqual(this.exportMenu.setOptions.callCount, 1);
});

QUnit.test('Print method', function(assert) {
    //arrange
    var widget = this.createWidget(),
        svgNode = { style: {} };

    widget.svg = sinon.spy();
    sinon.stub(window, "open", function() {
        return {
            document: {
                open: sinon.stub(),
                write: sinon.stub(),
                close: sinon.stub(),
                body: { getElementsByTagName: sinon.stub().withArgs("svg").returns([svgNode]) }
            },
            print: sinon.stub(),
            close: sinon.stub()
        };
    });

    //act
    widget.print();

    //assert
    assert.ok(widget.svg.callCount, 1, "svg method");
    assert.deepEqual(svgNode.style, { backgroundColor: "#ffffff" });

    window.open.restore();
});

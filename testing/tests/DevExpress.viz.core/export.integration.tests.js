require('viz/tree_map/tree_map');

const $ = require('jquery');
const vizMocks = require('../../helpers/vizMocks.js');
const rendererModule = require('viz/core/renderers/renderer');
const clientExporter = require('exporter');
const exportModule = require('viz/core/export');
const Deferred = require('core/utils/deferred').Deferred;
const logger = require('core/utils/console').logger;

$('#qunit-fixture').append('<div id="test-container" style="width: 200px; height: 150px;"></div>');

QUnit.module('Export', {
    beforeEach: function() {
        this.$container = $('#test-container');
        const renderer = this.renderer = new vizMocks.Renderer();
        rendererModule.Renderer = function() {
            return renderer;
        };

        const exportMenu = this.exportMenu = new vizMocks.ExportMenu();
        exportModule.ExportMenu = sinon.spy(function() { return exportMenu; });

        sinon.stub(clientExporter, 'export').returns(new Deferred());

        this.toDataURLStub = sinon.stub(window.HTMLCanvasElement.prototype, 'toDataURL');
        this.toDataURLStub.returnsArg(0);
    },

    afterEach: function() {
        clientExporter.export.restore();
        this.toDataURLStub.restore();
    },

    createWidget: function(options) {
        return this.$container.dxTreeMap(options).dxTreeMap('instance');
    }
});

QUnit.test('Export method. Defined options', function(assert) {
    // arrange
    const exportFunc = clientExporter.export;
    const exportedStub = sinon.spy();
    const exportingStub = sinon.spy();
    const fileSavingStub = sinon.spy();
    const svgToCanvas = function() { };
    const widget = this.createWidget({
        'export': {
            backgroundColor: '#ff0000',
            proxyUrl: 'testProxy',
            margin: 40,
            svgToCanvas: svgToCanvas
        },
        onExporting: exportingStub,
        onExported: exportedStub,
        onFileSaving: fileSavingStub
    });

    widget.$element().css('backgroundColor', '#ff0000');

    // act
    widget.exportTo('testName', 'jpeg');

    const firstExportCall = exportFunc.getCall(0);
    firstExportCall.args[1].exportingAction();
    firstExportCall.args[1].exportedAction();
    firstExportCall.args[1].fileSavingAction();

    // assert
    assert.strictEqual(exportFunc.callCount, 1, 'export was called one time');
    assert.equal(firstExportCall.args[0], this.renderer.root.element, 'export data');

    assert.equal(firstExportCall.args[1].width, 200, 'width');
    assert.equal(firstExportCall.args[1].height, 150, 'height');
    assert.equal(firstExportCall.args[1].backgroundColor, '#ff0000', 'backgroundColor');
    assert.equal(firstExportCall.args[1].fileName, 'testName', 'fileName');
    assert.equal(firstExportCall.args[1].format, 'JPEG', 'format');
    assert.equal(firstExportCall.args[1].proxyUrl, 'testProxy', 'proxyUrl');
    assert.equal(firstExportCall.args[1].margin, 40, 'margin');
    assert.equal(firstExportCall.args[1].svgToCanvas, svgToCanvas, 'svgToCanvas passed');

    assert.equal(exportingStub.callCount, 1, 'exporting event');
    assert.equal(exportedStub.callCount, 1, 'exported event');
    assert.equal(fileSavingStub.callCount, 1, 'file saving event');
});

QUnit.test('Export method. PNG format', function(assert) {
    // arrange
    const exportFunc = clientExporter.export;
    const exportedStub = sinon.spy();
    const exportingStub = sinon.spy();
    const fileSavingStub = sinon.spy();
    const widget = this.createWidget({
        'export': {
            proxyUrl: 'testProxy'
        },
        onExporting: exportingStub,
        onExported: exportedStub,
        onFileSaving: fileSavingStub
    });

    // act
    widget.exportTo('testName', 'png');

    // assert
    const firstExportCall = exportFunc.getCall(0);
    assert.strictEqual(exportFunc.callCount, 1, 'export was called one time');
    assert.equal(firstExportCall.args[1].format, 'PNG', 'format');
});

QUnit.test('Export method. JPEG format', function(assert) {
    // arrange
    const exportFunc = clientExporter.export;
    const exportedStub = sinon.spy();
    const exportingStub = sinon.spy();
    const fileSavingStub = sinon.spy();
    const widget = this.createWidget({
        'export': {
            proxyUrl: 'testProxy'
        },
        onExporting: exportingStub,
        onExported: exportedStub,
        onFileSaving: fileSavingStub
    });

    // act
    widget.exportTo('testName', 'jpeg');

    // assert
    const firstExportCall = exportFunc.getCall(0);
    assert.strictEqual(exportFunc.callCount, 1, 'export was called one time');
    assert.equal(firstExportCall.args[1].format, 'JPEG', 'format');
});

QUnit.test('Export method. GIF format', function(assert) {
    // arrange
    const exportFunc = clientExporter.export;
    const exportedStub = sinon.spy();
    const exportingStub = sinon.spy();
    const fileSavingStub = sinon.spy();
    const widget = this.createWidget({
        'export': {
            proxyUrl: 'testProxy'
        },
        onExporting: exportingStub,
        onExported: exportedStub,
        onFileSaving: fileSavingStub
    });

    // act
    widget.exportTo('testName', 'gif');

    // assert
    const firstExportCall = exportFunc.getCall(0);
    assert.strictEqual(exportFunc.callCount, 1, 'export was called one time');
    assert.equal(firstExportCall.args[1].format, 'GIF', 'format');
});

QUnit.test('Export method. SVG format', function(assert) {
    // arrange
    const exportFunc = clientExporter.export;
    const exportedStub = sinon.spy();
    const exportingStub = sinon.spy();
    const fileSavingStub = sinon.spy();
    const widget = this.createWidget({
        'export': {
            proxyUrl: 'testProxy'
        },
        onExporting: exportingStub,
        onExported: exportedStub,
        onFileSaving: fileSavingStub
    });

    // act
    widget.exportTo('testName', 'svg');

    // assert
    const firstExportCall = exportFunc.getCall(0);
    assert.strictEqual(exportFunc.callCount, 1, 'export was called one time');
    assert.equal(firstExportCall.args[1].format, 'SVG', 'format');
});

QUnit.test('Export method. PDF format', function(assert) {
    // arrange
    const exportFunc = clientExporter.export;
    const exportedStub = sinon.spy();
    const exportingStub = sinon.spy();
    const fileSavingStub = sinon.spy();
    const widget = this.createWidget({
        'export': {
            proxyUrl: 'testProxy'
        },
        onExporting: exportingStub,
        onExported: exportedStub,
        onFileSaving: fileSavingStub
    });

    // act
    widget.exportTo('testName', 'pdf');

    // assert
    const firstExportCall = exportFunc.getCall(0);
    assert.strictEqual(exportFunc.callCount, 1, 'export was called one time');
    assert.equal(firstExportCall.args[1].format, 'PDF', 'format');
});

QUnit.test('Export method. invalid format', function(assert) {
    // arrange
    const incidentOccurred = sinon.spy();
    const exportFunc = clientExporter.export;
    const exportedStub = sinon.spy();
    const exportingStub = sinon.spy();
    const fileSavingStub = sinon.spy();
    const widget = this.createWidget({
        'export': {
            proxyUrl: 'testProxy'
        },
        onExporting: exportingStub,
        onExported: exportedStub,
        onFileSaving: fileSavingStub,
        onIncidentOccurred: incidentOccurred
    });

    // act
    widget.exportTo('testName', 'abc');

    // assert
    const firstExportCall = exportFunc.getCall(0);
    assert.strictEqual(exportFunc.callCount, 1, 'export was called one time');
    assert.equal(firstExportCall.args[1].format, 'PNG', 'format');
    assert.equal(incidentOccurred.callCount, 0);
});

QUnit.test('Export method. unsopported image format', function(assert) {
    // arrange
    this.toDataURLStub.withArgs('image/jpeg').returns('image/png');

    const incidentOccurred = sinon.spy();
    const exportFunc = clientExporter.export;
    const exportedStub = sinon.spy();
    const exportingStub = sinon.spy();
    const fileSavingStub = sinon.spy();
    const widget = this.createWidget({
        'export': {
            proxyUrl: 'testProxy'
        },
        onExporting: exportingStub,
        onExported: exportedStub,
        onFileSaving: fileSavingStub,
        onIncidentOccurred: incidentOccurred
    });

    // act
    widget.exportTo('testName', 'jpeg');

    // assert
    const firstExportCall = exportFunc.getCall(0);
    assert.strictEqual(exportFunc.callCount, 1, 'export was called one time');
    assert.equal(firstExportCall.args[1].format, 'PNG', 'format');
    assert.equal(incidentOccurred.callCount, 1);
    assert.deepEqual(incidentOccurred.getCall(0).args[0].target.id, 'W2108');
    assert.deepEqual(incidentOccurred.getCall(0).args[0].target.args, ['JPEG']);
});

QUnit.test('Export method. Undefined options', function(assert) {
    // arrange
    const exportFunc = clientExporter.export;
    const widget = this.createWidget();

    // act
    widget.exportTo();

    // assert
    const firstExportCall = exportFunc.getCall(0);
    assert.equal(firstExportCall.args[1].backgroundColor, '#ffffff', 'backgroundColor');
    assert.equal(firstExportCall.args[1].fileName, 'file', 'fileName');
    assert.equal(firstExportCall.args[1].format, 'PNG', 'format');
    assert.equal(firstExportCall.args[1].proxyUrl, undefined, 'proxyUrl');
});

QUnit.test('Disable pointer events while exporting', function(assert) {
    // arrange
    const widget = this.createWidget({
        'export': {
            backgroundColor: '#ff0000',
            proxyUrl: 'testProxy',
            margin: 40
        }
    });

    // act
    widget.exportTo('testName', 'jpeg');

    assert.equal(widget._renderer.root.attr('pointer-events'), 'none');
});

QUnit.test('Restore pointer events after export', function(assert) {
    // arrange
    const done = assert.async();
    clientExporter.export.returns(new Deferred().resolve());
    const widget = this.createWidget({
        'export': {
            backgroundColor: '#ff0000',
            proxyUrl: 'testProxy',
            margin: 40
        }
    });

    widget._renderer.root.attr({ 'pointer-events': 'all' });

    // act
    widget.exportTo('testName', 'jpeg').then(function() {
        assert.equal(widget._renderer.root.attr('pointer-events'), 'all');
        done();
    });
});

QUnit.test('Restore pointer events after export if rejected', function(assert) {
    // arrange
    sinon.stub(logger, 'error');
    const done = assert.async();
    clientExporter.export.returns(new Deferred().reject('my error'));
    const widget = this.createWidget({
        'export': {
            backgroundColor: '#ff0000',
            proxyUrl: 'testProxy',
            margin: 40
        }
    });

    widget._renderer.root.attr({ 'pointer-events': 'all' });

    // act
    widget.exportTo('testName', 'jpeg').always(function() {
        assert.equal(widget._renderer.root.attr('pointer-events'), 'all');
        assert.deepEqual(logger.error.lastCall.args, ['my error']);
        logger.error.restore();
        done();
    });
});

QUnit.test('Disable pointer events while printing', function(assert) {
    // arrange
    const widget = this.createWidget({
        'export': {
            backgroundColor: '#ff0000',
            proxyUrl: 'testProxy',
            margin: 40
        }
    });

    // act
    widget.print();

    assert.equal(widget._renderer.root.attr('pointer-events'), 'none');
});

QUnit.test('Restore pointer events after printing', function(assert) {
    // arrange
    clientExporter.export.returns(new Deferred().resolve());
    const done = assert.async();
    const widget = this.createWidget({
        'export': {
            backgroundColor: '#ff0000',
            proxyUrl: 'testProxy',
            margin: 40
        }
    });

    widget._renderer.root.attr({ 'pointer-events': 'all' });

    // act
    widget.print().then(() => {
        assert.equal(widget._renderer.root.attr('pointer-events'), 'all');
        done();
    });
});

QUnit.test('Restore pointer events after printing if rejected', function(assert) {
    // arrange
    clientExporter.export.returns(new Deferred().reject());
    sinon.stub(logger, 'error');
    const done = assert.async();
    const widget = this.createWidget({
        'export': {
            backgroundColor: '#ff0000',
            proxyUrl: 'testProxy',
            margin: 40
        }
    });

    widget._renderer.root.attr({ 'pointer-events': 'all' });

    // act
    widget.print().always(function() {
        assert.equal(widget._renderer.root.attr('pointer-events'), 'all');
        logger.error.restore();
        done();
    });
});

QUnit.test('Export menu creation', function(assert) {
    // arrange, act
    const incidentOccurred = sinon.spy();
    const widget = this.createWidget({
        onIncidentOccurred: incidentOccurred,
        rtlEnabled: 'rtl option'
    });
    widget.exportTo = sinon.spy();
    widget.print = sinon.spy();


    // assert
    assert.equal(exportModule.ExportMenu.lastCall.args[0].renderer, this.renderer);
    assert.ok(typeof exportModule.ExportMenu.lastCall.args[0].incidentOccurred === 'function');
    assert.strictEqual(this.exportMenu.setOptions.getCall(0).args[0].rtl, 'rtl option');
    assert.ok(typeof exportModule.ExportMenu.lastCall.args[0].exportTo === 'function');
    assert.ok(typeof exportModule.ExportMenu.lastCall.args[0].print === 'function');

    exportModule.ExportMenu.lastCall.args[0].exportTo('FORMAT');
    assert.deepEqual(widget.exportTo.getCall(0).args, [undefined, 'FORMAT']);

    exportModule.ExportMenu.lastCall.args[0].print();
    assert.equal(widget.print.callCount, 1);
});

QUnit.test('Export menu disposing', function(assert) {
    // arrange
    this.createWidget();

    // act
    this.$container.remove();

    // assert
    assert.equal(this.exportMenu.dispose.callCount, 1, 'disposing of export menu is called');
});

QUnit.test('Depends on theme', function(assert) {
    const widget = this.createWidget();
    this.exportMenu.setOptions.reset();

    widget.option('theme', 'test-theme');

    assert.strictEqual(this.exportMenu.setOptions.callCount, 1);
});

QUnit.test('Print method - use export to prepare image, create hidden iFrame with image, delete iFrame after printing', function(assert) {
    assert.expect(28);
    const done = assert.async();
    const deferred = new Deferred();
    const exportFunc = clientExporter.export;
    const exportedStub = sinon.spy();
    const exportingStub = sinon.spy();
    const fileSavingStub = sinon.spy();
    const mockWindow = {
        print: sinon.spy(),
        focus: sinon.spy()
    };
    const widget = this.createWidget({
        'export': {
            backgroundColor: '#ff0000',
            proxyUrl: 'testProxy',
            format: 'JPEG',
            forceProxy: false,
            margin: 40,
            __test: {
                deferred: deferred,
                imageSrc: '/testing/content/exporterTestsContent/test-image.png',
                mockWindow: mockWindow,
                checkAssertions: function() {
                    assert.equal(window.frames.length, 1);
                    const frame = window.frames[0].frameElement;
                    assert.equal(frame.style.visibility, 'hidden');
                    assert.equal(frame.style.position, 'fixed');
                    assert.equal(frame.style.right, '0px');
                    assert.equal(frame.style.bottom, '0px');

                    const body = frame.contentDocument.body;
                    const image = body.childNodes[0];
                    assert.equal(image.getAttribute('src'), '/testing/content/exporterTestsContent/test-image.png');

                    assert.equal(mockWindow.focus.callCount, 1); // Required for IE
                    assert.equal(mockWindow.print.callCount, 1);
                    assert.ok(mockWindow.focus.getCall(0).calledBefore(mockWindow.print.getCall(0)));
                }
            }
        },
        onExporting: exportingStub,
        onExported: exportedStub,
        onFileSaving: fileSavingStub
    });

    // act
    widget.print();

    const that = this;
    const firstExportCall = exportFunc.getCall(0);
    const fileSavingEventArgs = { data: 'imageData' };
    firstExportCall.args[1].fileSavingAction(fileSavingEventArgs);

    deferred.done(function(imageSrc) {
        assert.ok(fileSavingEventArgs.cancel, 'file should not be saved');

        assert.strictEqual(exportFunc.callCount, 1, 'export was called one time');
        assert.equal(firstExportCall.args[0], that.renderer.root.element, 'export data');

        assert.equal(firstExportCall.args[1].width, 200, 'width');
        assert.equal(firstExportCall.args[1].height, 150, 'height');
        assert.equal(firstExportCall.args[1].backgroundColor, '#ff0000', 'backgroundColor');
        assert.equal(firstExportCall.args[1].fileName, 'file', 'fileName');
        assert.equal(firstExportCall.args[1].format, 'PNG', 'format');
        assert.equal(firstExportCall.args[1].proxyUrl, 'testProxy', 'proxyUrl');
        assert.equal(firstExportCall.args[1].margin, 0, 'margin');
        assert.equal(firstExportCall.args[1].forceProxy, true, 'image data should be base64');
        assert.ok(firstExportCall.args[1].fileSavingAction);
        assert.equal(firstExportCall.args[1].exportingAction, null);
        assert.equal(firstExportCall.args[1].exportedAction, null);

        assert.equal(exportingStub.callCount, 0, 'exporting event');
        assert.equal(exportedStub.callCount, 0, 'exported event');
        assert.equal(fileSavingStub.callCount, 0, 'file saving event');

        assert.equal(imageSrc, 'data:image/png;base64,imageData');

        assert.equal(window.frames.length, 0);
        done();
    });
});

QUnit.test('Print method, error image loading - delete iFrame', function(assert) {
    assert.expect(4);
    const done = assert.async();
    const deferred = new Deferred();
    const exportFunc = clientExporter.export;
    const mockWindow = {
        print: sinon.spy(),
        focus: sinon.spy()
    };
    const widget = this.createWidget({
        'export': {
            __test: {
                deferred: deferred,
                imageSrc: 'wrong_image_url',
                mockWindow: mockWindow,
                checkAssertions: function() {
                    const image = window.frames[0].frameElement.contentDocument.body.childNodes[0];
                    assert.equal(image.getAttribute('src'), 'wrong_image_url');
                    assert.equal(mockWindow.focus.callCount, 0);
                    assert.equal(mockWindow.print.callCount, 0);
                }
            }
        }
    });

    // act
    widget.print();

    exportFunc.getCall(0).args[1].fileSavingAction({ data: 'imageData' });

    deferred.done(function() {
        assert.equal(window.frames.length, 0);
        done();
    });
});

QUnit.test('Export with right size after resize', function(assert) {
    const exportFunc = clientExporter.export;
    const widget = this.createWidget();

    widget.option({
        size: {
            width: 100,
            height: 200
        }
    });
    widget.exportTo('testName', 'jpeg');

    // assert
    assert.equal(exportFunc.getCall(0).args[1].width, 100, 'width');
    assert.equal(exportFunc.getCall(0).args[1].height, 200, 'height');
});

QUnit.test('Hide export menu before exporting and show after', function(assert) {
    const exportFunc = clientExporter.export;
    const widget = this.createWidget();

    widget.option({
        size: {
            width: 100,
            height: 200
        }
    });
    widget.exportTo('testName', 'jpeg');

    // assert
    assert.equal(this.exportMenu.hide.callCount, 1);
    assert.equal(this.exportMenu.show.callCount, 1);

    assert.ok(this.exportMenu.hide.getCall(0).calledBefore(exportFunc.getCall(0)));
    assert.ok(this.exportMenu.show.getCall(0).calledAfter(exportFunc.getCall(0)));
});
QUnit.test('Hide export menu before printing and show after', function(assert) {
    const exportFunc = clientExporter.export;
    const widget = this.createWidget();

    widget.option({
        size: {
            width: 100,
            height: 200
        }
    });
    widget.print();

    // assert
    assert.equal(this.exportMenu.hide.callCount, 1);
    assert.equal(this.exportMenu.show.callCount, 1);

    assert.ok(this.exportMenu.hide.getCall(0).calledBefore(exportFunc.getCall(0)));
    assert.ok(this.exportMenu.show.getCall(0).calledAfter(exportFunc.getCall(0)));
});

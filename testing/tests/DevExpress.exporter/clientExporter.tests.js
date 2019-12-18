var clientExporter = require('exporter'),
    fileSaver = clientExporter.fileSaver;

QUnit.module('Client exporter', {
    beforeEach: function() {
        sinon.stub(fileSaver, 'saveAs');
    },
    afterEach: function() {
        fileSaver.saveAs.restore();
    }
});

function defaultGetBlob(data, options, callback) {
    callback();
}

QUnit.test('Save as', function(assert) {
    // arrange
    // act
    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL'
    }, defaultGetBlob);

    // assert
    assert.equal(fileSaver.saveAs.callCount, 1, 'saveAs was called');
});

QUnit.test('onExporting', function(assert) {
    // arrange
    var exportingActionStub = sinon.spy();

    // act
    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL',
        exportingAction: exportingActionStub
    }, defaultGetBlob);

    // assert
    assert.equal(exportingActionStub.callCount, 1, 'onExporting event');
    assert.deepEqual(exportingActionStub.getCall(0).args[0], {
        cancel: false,
        fileName: 'testFile',
        format: 'EXCEL'
    }, 'onExporting event args');
});

QUnit.test('Cancel exporting via onExporting', function(assert) {
    // arrange
    var exportingActionStub = sinon.spy(function(e) {
            e.cancel = true;
        }),
        exportedActionStub = sinon.spy(),
        done = assert.async();

    // act
    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL',
        exportingAction: exportingActionStub,
        exportedAction: exportedActionStub
    }, defaultGetBlob).then(done);

    // assert
    assert.equal(exportedActionStub.callCount, 0, 'onExported event');
    assert.equal(fileSaver.saveAs.callCount, 0, 'saveAs was not called');
});

QUnit.test('FileName is changed on onExporting event', function(assert) {
    // arrange
    var exportingActionStub = sinon.spy(function(e) {
        e.fileName = 'Excel file name';
    });

    // act
    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL',
        exportingAction: exportingActionStub
    }, defaultGetBlob);

    // assert
    assert.equal(fileSaver.saveAs.getCall(0).args[0], 'Excel file name', 'file name');
});

QUnit.test('onExported', function(assert) {
    // arrange
    var exportedActionStub = sinon.spy();

    // act
    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL',
        exportedAction: exportedActionStub
    }, defaultGetBlob);

    // assert
    assert.equal(exportedActionStub.callCount, 1, 'onExported event');
});

QUnit.test('onFileSaving without cancel', function(assert) {
    // arrange
    var fileSavingActionStub = sinon.spy(),
        data = 'test-data',
        getBlob = function(_0, _1, callback) {
            callback(data);
        };

    // act
    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL',
        fileSavingAction: fileSavingActionStub
    }, getBlob);

    // assert
    assert.equal(fileSavingActionStub.callCount, 1, 'onFileSavingCalled called');
    assert.deepEqual(fileSavingActionStub.getCall(0).args[0], {
        fileName: 'testFile',
        data: data,
        format: 'EXCEL',
        cancel: false
    }, 'file saving args');
    assert.equal(fileSaver.saveAs.callCount, 1, 'fileSave called');
});

QUnit.test('onFileSaving with cancel', function(assert) {
    // arrange
    var fileSavingActionStub = sinon.spy(function(e) {
        e.cancel = true;
    });

    // act
    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL',
        fileSavingAction: fileSavingActionStub
    }, defaultGetBlob);

    // assert
    assert.equal(fileSavingActionStub.callCount, 1, 'onFileSavingCalled called');
    assert.equal(fileSaver.saveAs.callCount, 0, 'fileSave not called');
});

QUnit.test('Export to jpeg format', function(assert) {
    var getBlob = sinon.spy(defaultGetBlob);
    // arrange
    // act
    clientExporter.export('testData', {
        fileName: 'testFile',
        format: 'JPEG'
    }, getBlob);

    // assert
    assert.equal(getBlob.callCount, 1, 'getBlob from image creator');
    assert.equal(getBlob.getCall(0).args[0], 'testData', 'data to image creator');
    assert.deepEqual(getBlob.getCall(0).args[1], {
        fileName: 'testFile',
        format: 'JPEG'
    }, 'options to image creator');
});

QUnit.test('Export to png format', function(assert) {
    var getBlob = sinon.spy(defaultGetBlob);
    // arrange
    // act
    clientExporter.export('testData', {
        fileName: 'testFile',
        format: 'PNG'
    }, getBlob);

    // assert
    assert.equal(getBlob.callCount, 1, 'getBlob from image creator');
    assert.equal(getBlob.getCall(0).args[0], 'testData', 'data to image creator');
    assert.deepEqual(getBlob.getCall(0).args[1], {
        fileName: 'testFile',
        format: 'PNG'
    }, 'options to image creator');
});

QUnit.test('Export to gif format', function(assert) {
    var getBlob = sinon.spy(defaultGetBlob);
    // arrange
    // act
    clientExporter.export('testData', {
        fileName: 'testFile',
        format: 'GIF'
    }, getBlob);

    // assert
    assert.equal(getBlob.callCount, 1, 'getBlob from image creator');
    assert.equal(getBlob.getCall(0).args[0], 'testData', 'data to image creator');
    assert.deepEqual(getBlob.getCall(0).args[1], {
        fileName: 'testFile',
        format: 'GIF'
    }, 'options to image creator');
});

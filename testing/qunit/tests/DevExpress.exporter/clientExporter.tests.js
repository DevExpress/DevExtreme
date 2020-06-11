import clientExporter from 'exporter';
import { Deferred } from 'core/utils/deferred';
const fileSaver = clientExporter.fileSaver;

QUnit.module('Client exporter', {
    beforeEach: function() {
        sinon.stub(fileSaver, 'saveAs');
    },
    afterEach: function() {
        fileSaver.saveAs.restore();
    }
});

function defaultGetBlob(data, options) {
    return new Deferred().resolve();
}

QUnit.test('Save as', function(assert) {
    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL'
    }, defaultGetBlob).then(() => {
        assert.equal(fileSaver.saveAs.callCount, 1, 'saveAs was called');
    })
        .always(assert.async());
});

QUnit.test('onExporting', function(assert) {
    const exportingActionStub = sinon.spy();

    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL',
        exportingAction: exportingActionStub
    }, defaultGetBlob);

    assert.equal(exportingActionStub.callCount, 1, 'onExporting event');
    assert.deepEqual(exportingActionStub.getCall(0).args[0], {
        cancel: false,
        fileName: 'testFile',
        format: 'EXCEL'
    }, 'onExporting event args');
});

QUnit.test('Cancel exporting via onExporting', function(assert) {
    const exportingActionStub = sinon.spy(function(e) {
        e.cancel = true;
    });
    const exportedActionStub = sinon.spy();
    const done = assert.async();

    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL',
        exportingAction: exportingActionStub,
        exportedAction: exportedActionStub
    }, defaultGetBlob).then(done);

    assert.equal(exportedActionStub.callCount, 0, 'onExported event');
    assert.equal(fileSaver.saveAs.callCount, 0, 'saveAs was not called');
});

QUnit.test('FileName is changed on onExporting event', function(assert) {
    const exportingActionStub = sinon.spy(function(e) {
        e.fileName = 'Excel file name';
    });

    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL',
        exportingAction: exportingActionStub
    }, defaultGetBlob).then(() => {
        assert.equal(fileSaver.saveAs.getCall(0).args[0], 'Excel file name', 'file name');
    }).always(assert.async());
});

QUnit.test('onExported', function(assert) {
    const exportedActionStub = sinon.spy();

    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL',
        exportedAction: exportedActionStub
    }, defaultGetBlob).then(() => {
        assert.equal(exportedActionStub.callCount, 1, 'onExported event');
    }).always(assert.async());
});

QUnit.test('onFileSaving without cancel', function(assert) {
    const fileSavingActionStub = sinon.spy();
    const data = 'test-data';
    const getBlob = function(_0, _1) {
        return new Deferred().resolve(data);
    };

    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL',
        fileSavingAction: fileSavingActionStub
    }, getBlob).then(() => {
        assert.equal(fileSavingActionStub.callCount, 1, 'onFileSavingCalled called');
        assert.deepEqual(fileSavingActionStub.getCall(0).args[0], {
            fileName: 'testFile',
            data: data,
            format: 'EXCEL',
            cancel: false
        }, 'file saving args');
        assert.equal(fileSaver.saveAs.callCount, 1, 'fileSave called');
    }).always(assert.async());
});

QUnit.test('onFileSaving with cancel', function(assert) {
    const fileSavingActionStub = sinon.spy(function(e) {
        e.cancel = true;
    });

    clientExporter.export({}, {
        fileName: 'testFile',
        format: 'EXCEL',
        fileSavingAction: fileSavingActionStub
    }, defaultGetBlob).then(() => {
        assert.equal(fileSavingActionStub.callCount, 1, 'onFileSavingCalled called');
        assert.equal(fileSaver.saveAs.callCount, 0, 'fileSave not called');
    }).always(assert.async());

});

QUnit.test('Export to jpeg format', function(assert) {
    const getBlob = sinon.spy(defaultGetBlob);
    clientExporter.export('testData', {
        fileName: 'testFile',
        format: 'JPEG'
    }, getBlob);

    assert.equal(getBlob.callCount, 1, 'getBlob from image creator');
    assert.equal(getBlob.getCall(0).args[0], 'testData', 'data to image creator');
    assert.deepEqual(getBlob.getCall(0).args[1], {
        fileName: 'testFile',
        format: 'JPEG'
    }, 'options to image creator');
});

QUnit.test('Export to png format', function(assert) {
    const getBlob = sinon.spy(defaultGetBlob);
    clientExporter.export('testData', {
        fileName: 'testFile',
        format: 'PNG'
    }, getBlob);

    assert.equal(getBlob.callCount, 1, 'getBlob from image creator');
    assert.equal(getBlob.getCall(0).args[0], 'testData', 'data to image creator');
    assert.deepEqual(getBlob.getCall(0).args[1], {
        fileName: 'testFile',
        format: 'PNG'
    }, 'options to image creator');
});

QUnit.test('Export to gif format', function(assert) {
    const getBlob = sinon.spy(defaultGetBlob);
    clientExporter.export('testData', {
        fileName: 'testFile',
        format: 'GIF'
    }, getBlob);

    assert.equal(getBlob.callCount, 1, 'getBlob from image creator');
    assert.equal(getBlob.getCall(0).args[0], 'testData', 'data to image creator');
    assert.deepEqual(getBlob.getCall(0).args[1], {
        fileName: 'testFile',
        format: 'GIF'
    }, 'options to image creator');
});

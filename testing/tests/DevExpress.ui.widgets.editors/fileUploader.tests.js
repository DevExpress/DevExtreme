import $ from 'jquery';
import FileUploader from 'ui/file_uploader';
import devices from 'core/devices';
import { Deferred } from 'core/utils/deferred';
import keyboardMock from '../../helpers/keyboardMock.js';
import { createBlobFile } from '../../helpers/fileHelper.js';
import '../../helpers/xmlHttpRequestMock.js';
import 'common.css!';
import 'generic_light.css!';

const { test } = QUnit;

QUnit.testStart(function() {
    const markup =
        '<div id="fileuploader"></div>';

    $('#qunit-fixture').html(markup);
});

const internals = FileUploader.__internals;

const FILEUPLOADER_EMPTY_CLASS = 'dx-fileuploader-empty';

const FILEUPLOADER_CONTENT_CLASS = 'dx-fileuploader-content';
const FILEUPLOADER_INPUT_WRAPPER_CLASS = 'dx-fileuploader-input-wrapper';
const FILEUPLOADER_BUTTON_CLASS = 'dx-fileuploader-button';
const FILEUPLOADER_INPUT_CONTAINER_CLASS = 'dx-fileuploader-input-container';
const FILEUPLOADER_INPUT_LABEL_CLASS = 'dx-fileuploader-input-label';
const FILEUPLOADER_INPUT_CLASS = 'dx-fileuploader-input';
const FILEUPLOADER_FILES_CONTAINER_CLASS = 'dx-fileuploader-files-container';
const FILEUPLOADER_FILE_CONTAINER_CLASS = 'dx-fileuploader-file-container';

const FILEUPLOADER_FILE_CLASS = 'dx-fileuploader-file';
const FILEUPLOADER_FILE_NAME_CLASS = 'dx-fileuploader-file-name';
const FILEUPLOADER_FILE_SIZE_CLASS = 'dx-fileuploader-file-size';

const FILEUPLOADER_CANCEL_BUTTON_CLASS = 'dx-fileuploader-cancel-button';
const FILEUPLOADER_UPLOAD_BUTTON_CLASS = 'dx-fileuploader-upload-button';
const FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS = 'dx-fileuploader-file-status-message';

const FILEUPLOADER_INVALID_CLASS = 'dx-fileuploader-invalid';

const FILEUPLOADER_AFTER_LOAD_DELAY = 500;


const simulateFileChoose = function($fileUploader, files) {
    const $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

    files = $.isArray(files) ? files : [files];

    if($.isPlainObject(files[0])) {
        $input.val(files[0].name);
        $input.prop('files', files);
    } else {
        $input.val(files[0]);
    }

    $input.trigger('change');
};

const fakeFile = {
    name: 'fakefile.png',
    size: 100023,
    type: 'image/png',
    lastModifiedDate: $.now()
};
const fakeFile1 = {
    name: 'fakefile1.jpeg',
    size: 1063,
    type: 'image/jpeg',
    lastModifiedDate: $.now()
};
const fakeFile2 = {
    name: 'document.pdf',
    size: 4000,
    type: 'application/pdf',
    lastModifiedDate: $.now()
};

const getNewFile = function() {
    const randomSize = Math.round(Math.random() * 10000);
    const randomId = Math.round(Math.random() * 10000);

    return {
        name: 'fakefile' + randomId,
        size: randomSize,
        type: 'image/jpeg',
        lastModifiedDate: $.now()
    };
};

const executeAfterDelay = (action, delay) => {
    delay = delay || 1000;
    action = action || (() => { });
    const deferred = new Deferred();

    setTimeout(() => {
        try {
            const result = action();
            deferred.resolve(result);
        } catch(e) {
            deferred.reject(e);
        }
    }, delay);

    return deferred.promise();
};

const getUploadChunkArgumentsSummary = (file, chunksInfo) => {
    return {
        fileName: file.name,
        bytesUploaded: chunksInfo.bytesUploaded,
        chunkCount: chunksInfo.chunkCount,
        blobSize: chunksInfo.chunkBlob.size,
        chunkIndex: chunksInfo.chunkIndex
    };
};


const moduleConfig = {
    beforeEach: function() {
        internals.changeFileInputRenderer(() => $('<div>'));

        this.xhrMock = new window.XMLHttpRequestMock();
        this._nativeXhr = XMLHttpRequest;
        window.XMLHttpRequest = this.xhrMock.XMLHttpRequest;

        this.formDataMock = new window.FormDataMock();
        this._nativeFormData = window.FormData;
        window.FormData = this.formDataMock.FormData;

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        internals.resetFileInputTag();

        window.XMLHttpRequest = this._nativeXhr;
        window.FormData = this._nativeFormData;

        this.xhrMock.dispose();
        delete this.xhrMock;
        delete this.formDataMock;

        this.clock.restore();
    }
};

QUnit.module('custom uploading', moduleConfig, () => {

    test('chunked uploading goes well', function(assert) {
        const chunkSize = 20000;
        const fileSize = 50100;
        const uploadChunkSpy = sinon.spy((file, chunksInfo) => {
            lastArgsInfo = getUploadChunkArgumentsSummary(file, chunksInfo);
            return executeAfterDelay();
        });
        const onProgressSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();

        let lastArgsInfo = null;
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            chunkSize: chunkSize,
            uploadChunk: uploadChunkSpy,
            onProgress: onProgressSpy,
            onUploaded: onUploadedSpy
        });

        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);

        const expectedArgsInfo = { fileName: 'image1.png', bytesUploaded: 0, chunkCount: 3, blobSize: chunkSize, chunkIndex: 0 };

        this.clock.tick(500);
        assert.strictEqual(uploadChunkSpy.callCount, 1, 'custom function called for 1st chunk');
        assert.strictEqual(onProgressSpy.callCount, 0, 'progress event not called before 1st chunk completed');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');
        assert.deepEqual(lastArgsInfo, expectedArgsInfo, 'custom function has valid arguments');

        this.clock.tick(1000);
        expectedArgsInfo.bytesUploaded = 20000;
        expectedArgsInfo.chunkIndex++;
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function called for 2nd chunk');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event called for 1st chunk');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');
        assert.deepEqual(lastArgsInfo, expectedArgsInfo, 'custom function has valid arguments');

        this.clock.tick(1000);
        expectedArgsInfo.bytesUploaded = 40000;
        expectedArgsInfo.chunkIndex++;
        expectedArgsInfo.blobSize = 10100;
        assert.strictEqual(uploadChunkSpy.callCount, 3, 'custom function called for 3rd chunk');
        assert.strictEqual(onProgressSpy.callCount, 2, 'progress event called for 2nd chunk');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');
        assert.deepEqual(lastArgsInfo, expectedArgsInfo, 'custom function has valid arguments');

        this.clock.tick(1000);
        assert.strictEqual(uploadChunkSpy.callCount, 3, 'custom function called for each chunk');
        assert.strictEqual(onProgressSpy.callCount, 3, 'progress event called for each chunk');
        assert.strictEqual(onUploadedSpy.callCount, 1, 'uploaded event raised');
        assert.deepEqual(lastArgsInfo, expectedArgsInfo, 'custom function has valid arguments');
    });

    test('chunked uploading handle error', function(assert) {
        const chunkSize = 20000;
        const fileSize = 50100;
        const uploadChunkSpy = sinon.spy((file, chunksInfo) => executeAfterDelay(() => {
            if(chunksInfo.chunkIndex === 1) {
                throw 'Some error.';
            }
        }));
        const onProgressSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const onUploadErrorSpy = sinon.spy();

        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            chunkSize: chunkSize,
            uploadChunk: uploadChunkSpy,
            onProgress: onProgressSpy,
            onUploaded: onUploadedSpy,
            onUploadError: onUploadErrorSpy
        });

        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);

        this.clock.tick(500);
        assert.strictEqual(uploadChunkSpy.callCount, 1, 'custom function called for 1st chunk');
        assert.strictEqual(onProgressSpy.callCount, 0, 'progress event not called before 1st chunk completed');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');
        assert.strictEqual(onUploadErrorSpy.callCount, 0, 'upload error is not raised');

        this.clock.tick(1000);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function called for 2nd chunk');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event called for 1st chunk');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');
        assert.strictEqual(onUploadErrorSpy.callCount, 0, 'upload error is not raised');

        this.clock.tick(1000);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function is not called after error');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event is not called after error');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised after error');
        assert.strictEqual(onUploadErrorSpy.callCount, 1, 'upload error raised');
        assert.strictEqual(onUploadErrorSpy.args[0][0].error, 'Some error.', 'upload error event has valid arguments');

        this.clock.tick(5000);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function is not called after error');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event is not called after error');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised after error');
        assert.strictEqual(onUploadErrorSpy.callCount, 1, 'upload error raised only once');
    });

    test('custom state persisted during chunked uploading', function(assert) {
        let lastCustomData = null;
        const chunkSize = 20000;
        const fileSize = 50100;
        const uploadChunkSpy = sinon.spy((file, chunksInfo) => {
            lastCustomData = $.extend(true, { }, chunksInfo.customData);
            chunksInfo.customData.testCounter = chunksInfo.customData.testCounter || 0;
            chunksInfo.customData.testCounter++;
            return executeAfterDelay();
        });

        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            chunkSize: chunkSize,
            uploadChunk: uploadChunkSpy
        });

        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);

        this.clock.tick(500);
        assert.strictEqual(uploadChunkSpy.callCount, 1, 'custom function called for 1st chunk');
        assert.deepEqual(lastCustomData, { }, 'custom data is empty');

        this.clock.tick(1000);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function called for 2nd chunk');
        assert.deepEqual(lastCustomData, { testCounter: 1 }, 'custom data is updated');

        this.clock.tick(1000);
        assert.strictEqual(uploadChunkSpy.callCount, 3, 'custom function called for 3rd chunk');
        assert.deepEqual(lastCustomData, { testCounter: 2 }, 'custom data is updated');
    });

    test('cancel chunked uploading', function(assert) {
        const chunkSize = 20000;
        const fileSize = 50100;
        const uploadChunkSpy = sinon.spy(() => executeAfterDelay());
        const abortUploadSpy = sinon.spy((file, chunksInfo) => {
            lastArgsInfo = getUploadChunkArgumentsSummary(file, chunksInfo);
            return executeAfterDelay();
        });
        const onProgressSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const onUploadAbortedSpy = sinon.spy();

        let lastArgsInfo = null;
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            chunkSize: chunkSize,
            uploadChunk: uploadChunkSpy,
            abortUpload: abortUploadSpy,
            onProgress: onProgressSpy,
            onUploaded: onUploadedSpy,
            onUploadAborted: onUploadAbortedSpy
        });
        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);

        this.clock.tick(1500);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function called for 2nd chunk');
        assert.strictEqual(abortUploadSpy.callCount, 0, 'abort upload not called');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event called for 1st chunk');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');
        assert.strictEqual(onUploadAbortedSpy.callCount, 0, 'upload aborted event is not raised');

        $fileUploader.find(`.${FILEUPLOADER_CANCEL_BUTTON_CLASS}`).eq(0).trigger('dxclick');

        this.clock.tick(100);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function is not called after cancel');
        assert.strictEqual(abortUploadSpy.callCount, 1, 'abort upload called once');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event is not called after cancel');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised after cancel');
        assert.strictEqual(onUploadAbortedSpy.callCount, 0, 'upload aborted event is not raised');
        const expectedArgsInfo = { fileName: 'image1.png', bytesUploaded: 20000, chunkCount: 3, blobSize: 20000, chunkIndex: 1 };
        assert.deepEqual(expectedArgsInfo, lastArgsInfo, 'custom function has valid arguments');

        this.clock.tick(1000);
        assert.strictEqual(onUploadAbortedSpy.callCount, 1, 'upload aborted event raised once');

        this.clock.tick(5000);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function is not called after error');
        assert.strictEqual(abortUploadSpy.callCount, 1, 'abort upload called once');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event is not called after error');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised after error');
        assert.strictEqual(onUploadAbortedSpy.callCount, 1, 'upload aborted event raised once');
    });

    test('cancel chunked uploading with removeFile(number) method', function(assert) {
        const chunkSize = 20000;
        const fileSize = 50100;
        const uploadChunkSpy = sinon.spy(() => executeAfterDelay());
        const abortUploadSpy = sinon.spy((file, chunksInfo) => {
            lastArgsInfo = getUploadChunkArgumentsSummary(file, chunksInfo);
            return executeAfterDelay();
        });
        const onProgressSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const onUploadAbortedSpy = sinon.spy();

        let lastArgsInfo = null;
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'useButtons',
            chunkSize: chunkSize,
            uploadChunk: uploadChunkSpy,
            abortUpload: abortUploadSpy,
            onProgress: onProgressSpy,
            onUploaded: onUploadedSpy,
            onUploadAborted: onUploadAbortedSpy
        });
        const instance = $fileUploader.dxFileUploader('instance');

        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);
        instance.upload();

        this.clock.tick(1500);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function called for 2nd chunk');
        assert.strictEqual(abortUploadSpy.callCount, 0, 'abort upload not called');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event called for 1st chunk');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');
        assert.strictEqual(onUploadAbortedSpy.callCount, 0, 'upload aborted event is not raised');

        instance.removeFile(0);

        this.clock.tick(100);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function is not called after cancel');
        assert.strictEqual(abortUploadSpy.callCount, 1, 'abort upload called once');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event is not called after cancel');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised after cancel');
        assert.strictEqual(onUploadAbortedSpy.callCount, 0, 'upload aborted event is not raised');
        const expectedArgsInfo = { fileName: 'image1.png', bytesUploaded: 20000, chunkCount: 3, blobSize: 20000, chunkIndex: 1 };
        assert.deepEqual(expectedArgsInfo, lastArgsInfo, 'custom function has valid arguments');

        this.clock.tick(1000);
        assert.strictEqual(onUploadAbortedSpy.callCount, 1, 'upload aborted event raised once');

        this.clock.tick(5000);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function is not called after error');
        assert.strictEqual(abortUploadSpy.callCount, 1, 'abort upload called once');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event is not called after error');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised after error');
        assert.strictEqual(onUploadAbortedSpy.callCount, 1, 'upload aborted event raised once');
    });

    test('cancel chunked uploading with removeFile(file) method', function(assert) {
        const chunkSize = 20000;
        const fileSize = 50100;
        const uploadChunkSpy = sinon.spy(() => executeAfterDelay());
        const abortUploadSpy = sinon.spy((file, chunksInfo) => {
            lastArgsInfo = getUploadChunkArgumentsSummary(file, chunksInfo);
            return executeAfterDelay();
        });
        const onProgressSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const onUploadAbortedSpy = sinon.spy();

        let lastArgsInfo = null;
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            chunkSize: chunkSize,
            uploadChunk: uploadChunkSpy,
            abortUpload: abortUploadSpy,
            onProgress: onProgressSpy,
            onUploaded: onUploadedSpy,
            onUploadAborted: onUploadAbortedSpy
        });
        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);

        this.clock.tick(1500);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function called for 2nd chunk');
        assert.strictEqual(abortUploadSpy.callCount, 0, 'abort upload not called');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event called for 1st chunk');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');
        assert.strictEqual(onUploadAbortedSpy.callCount, 0, 'upload aborted event is not raised');

        $fileUploader.dxFileUploader('instance').removeFile(file);

        this.clock.tick(100);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function is not called after cancel');
        assert.strictEqual(abortUploadSpy.callCount, 1, 'abort upload called once');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event is not called after cancel');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised after cancel');
        assert.strictEqual(onUploadAbortedSpy.callCount, 0, 'upload aborted event is not raised');
        const expectedArgsInfo = { fileName: 'image1.png', bytesUploaded: 20000, chunkCount: 3, blobSize: 20000, chunkIndex: 1 };
        assert.deepEqual(expectedArgsInfo, lastArgsInfo, 'custom function has valid arguments');

        this.clock.tick(1000);
        assert.strictEqual(onUploadAbortedSpy.callCount, 1, 'upload aborted event raised once');

        this.clock.tick(5000);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'custom function is not called after error');
        assert.strictEqual(abortUploadSpy.callCount, 1, 'abort upload called once');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event is not called after error');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised after error');
        assert.strictEqual(onUploadAbortedSpy.callCount, 1, 'upload aborted event raised once');
    });

    test('custom state available during upload aborting', function(assert) {
        let lastCustomData = null;
        const chunkSize = 20000;
        const fileSize = 50100;
        const uploadChunkSpy = sinon.spy((file, chunksInfo) => {
            chunksInfo.customData.testCounter = chunksInfo.customData.testCounter || 0;
            chunksInfo.customData.testCounter++;
            return executeAfterDelay();
        });
        const abortUploadSpy = sinon.spy((file, chunksInfo) => {
            lastCustomData = $.extend(true, { }, chunksInfo.customData);
            return executeAfterDelay();
        });

        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            chunkSize: chunkSize,
            uploadChunk: uploadChunkSpy,
            abortUpload: abortUploadSpy
        });

        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);

        this.clock.tick(1500);
        $fileUploader.find(`.${FILEUPLOADER_CANCEL_BUTTON_CLASS}`).eq(0).trigger('dxclick');

        this.clock.tick(100);
        assert.deepEqual(lastCustomData, { testCounter: 2 }, 'custom data is specified');
    });

    test('whole file upload goes well', function(assert) {
        const fileSize = 50100;
        const uploadFileSpy = sinon.spy(() => executeAfterDelay());
        const onProgressSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();

        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            uploadFile: uploadFileSpy,
            onProgress: onProgressSpy,
            onUploaded: onUploadedSpy
        });

        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);

        this.clock.tick(500);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(uploadFileSpy.args[0][0].name, 'image1.png', 'custom function has valid argument');
        assert.strictEqual(onProgressSpy.callCount, 0, 'progress event is not called');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');

        this.clock.tick(1000);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(onProgressSpy.callCount, 0, 'progress event is not called');
        assert.strictEqual(onUploadedSpy.callCount, 1, 'uploaded event raised');
    });

    test('whole file upload handles progress', function(assert) {
        const fileSize = 50100;
        const uploadFileSpy = sinon.spy((file, progressCallback) => {
            return executeAfterDelay(() => progressCallback(20000), 300)
                .then(() => executeAfterDelay(() => progressCallback(40000), 400))
                .then(() => executeAfterDelay(null, 300));
        });
        const onProgressSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();

        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            uploadFile: uploadFileSpy,
            onProgress: onProgressSpy,
            onUploaded: onUploadedSpy
        });

        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);

        this.clock.tick(200);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(onProgressSpy.callCount, 0, 'progress event is not called');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');

        this.clock.tick(200);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event called');
        assert.strictEqual(onProgressSpy.args[0][0].bytesLoaded, 20000, 'loaded bytes updated');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');

        this.clock.tick(200);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event called');
        assert.strictEqual(onProgressSpy.args[0][0].bytesLoaded, 20000, 'loaded bytes not updated');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');

        this.clock.tick(200);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(onProgressSpy.callCount, 2, 'progress event called');
        assert.strictEqual(onProgressSpy.args[1][0].bytesLoaded, 40000, 'loaded bytes updated');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');

        this.clock.tick(300);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(onProgressSpy.callCount, 2, 'progress event called');
        assert.strictEqual(onUploadedSpy.callCount, 1, 'uploaded event raised');
    });

    test('whole file upload handles error', function(assert) {
        const fileSize = 50100;
        const uploadFileSpy = sinon.spy(() => executeAfterDelay(() => {
            throw 'Some error.';
        }));
        const onProgressSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const onUploadErrorSpy = sinon.spy();

        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            uploadFile: uploadFileSpy,
            onProgress: onProgressSpy,
            onUploaded: onUploadedSpy,
            onUploadError: onUploadErrorSpy
        });

        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);

        this.clock.tick(500);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(onProgressSpy.callCount, 0, 'progress event is not called');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');
        assert.strictEqual(onUploadErrorSpy.callCount, 0, 'upload error is not raised');

        this.clock.tick(1000);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(onProgressSpy.callCount, 0, 'progress event is not called');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');
        assert.strictEqual(onUploadErrorSpy.callCount, 1, 'upload error raised');
        assert.strictEqual(onUploadErrorSpy.args[0][0].error, 'Some error.', 'upload error event has valid arguments');
    });

    test('whole file upload allows canceling', function(assert) {
        const fileSize = 50100;
        const uploadFileSpy = sinon.spy(() => executeAfterDelay());
        const abortUploadSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();

        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            uploadFile: uploadFileSpy,
            abortUpload: abortUploadSpy,
            onUploaded: onUploadedSpy
        });

        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);

        this.clock.tick(500);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(abortUploadSpy.callCount, 0, 'abort upload not called');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');

        $fileUploader.find(`.${FILEUPLOADER_CANCEL_BUTTON_CLASS}`).eq(0).trigger('dxclick');

        this.clock.tick(100);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(abortUploadSpy.callCount, 1, 'abort upload called');
        assert.strictEqual(abortUploadSpy.args[0][0].name, 'image1.png', 'abort upload has valid args');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');

        this.clock.tick(1000);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(abortUploadSpy.callCount, 1, 'abort upload called');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');
    });

    test('whole file upload allows canceling with removeFile(number) method', function(assert) {
        const fileSize = 50100;
        const uploadFileSpy = sinon.spy(() => executeAfterDelay());
        const abortUploadSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();

        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'useButtons',
            uploadFile: uploadFileSpy,
            abortUpload: abortUploadSpy,
            onUploaded: onUploadedSpy
        });
        const instance = $fileUploader.dxFileUploader('instance');

        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);
        instance.upload();

        this.clock.tick(500);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(abortUploadSpy.callCount, 0, 'abort upload not called');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');

        instance.removeFile(0);

        this.clock.tick(100);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(abortUploadSpy.callCount, 1, 'abort upload called');
        assert.strictEqual(abortUploadSpy.args[0][0].name, 'image1.png', 'abort upload has valid args');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');

        this.clock.tick(1000);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(abortUploadSpy.callCount, 1, 'abort upload called');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');
    });

    test('whole file upload allows canceling with removeFile(file) method', function(assert) {
        const fileSize = 50100;
        const uploadFileSpy = sinon.spy(() => executeAfterDelay());
        const abortUploadSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();

        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            uploadFile: uploadFileSpy,
            abortUpload: abortUploadSpy,
            onUploaded: onUploadedSpy
        });

        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);

        this.clock.tick(500);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(abortUploadSpy.callCount, 0, 'abort upload not called');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');

        $fileUploader.dxFileUploader('instance').removeFile(file);

        this.clock.tick(100);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(abortUploadSpy.callCount, 1, 'abort upload called');
        assert.strictEqual(abortUploadSpy.args[0][0].name, 'image1.png', 'abort upload has valid args');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');

        this.clock.tick(1000);
        assert.strictEqual(uploadFileSpy.callCount, 1, 'custom function called');
        assert.strictEqual(abortUploadSpy.callCount, 1, 'abort upload called');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');
    });

    test('uploaded files are not aborted after resetting value', function(assert) {
        const chunkSize = 20000;
        const fileSize = 50100;
        const uploadChunkSpy = sinon.spy(() => executeAfterDelay());
        const onUploadedSpy = sinon.spy();
        const onAbortedSpy = sinon.spy();

        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            chunkSize: chunkSize,
            uploadChunk: uploadChunkSpy,
            onUploaded: onUploadedSpy,
            onUploadAborted: onAbortedSpy
        });

        const fileUploader = $fileUploader.dxFileUploader('instance');

        const file = createBlobFile('image1.png', fileSize);
        simulateFileChoose($fileUploader, [file]);

        this.clock.tick(5000);
        assert.strictEqual(uploadChunkSpy.callCount, 3, 'custom function called for each chunk');
        assert.strictEqual(onUploadedSpy.callCount, 1, 'uploaded event raised');
        assert.strictEqual(onAbortedSpy.callCount, 0, 'upload aborted event is not called');

        uploadChunkSpy.reset();
        onUploadedSpy.reset();
        onAbortedSpy.reset();

        fileUploader.option('value', []);

        this.clock.tick(1000);
        assert.strictEqual(uploadChunkSpy.callCount, 0, 'custom function not called');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event not raised');
        assert.strictEqual(onAbortedSpy.callCount, 0, 'upload aborted event is not called');
    });

    QUnit.test('upload of all files with upload method', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });
        simulateFileChoose($element, [fakeFile, fakeFile1]);

        $element.dxFileUploader('instance').upload();

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        const request = this.xhrMock.getInstanceAt();

        assert.ok(request.uploaded, 'upload is done');
    });

    QUnit.test('upload of specific file by file from value option with upload method', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });
        const instance = $element.dxFileUploader('instance');
        const files = [fakeFile, fakeFile1];

        simulateFileChoose($element, files);

        instance.upload(instance.option('value[1]'));

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        const request = this.xhrMock.getInstanceAt();

        assert.ok(request.uploaded, 'upload is done');
        assert.strictEqual(request.loadedSize, files[1].size, 'correct file was uploaded');
    });

    QUnit.test('upload of specific file by file index with upload method', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });
        const files = [fakeFile, fakeFile1];

        simulateFileChoose($element, files);

        $element.dxFileUploader('instance').upload(1);

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        const request = this.xhrMock.getInstanceAt();

        assert.ok(request.uploaded, 'upload is done');
        assert.strictEqual(request.loadedSize, files[1].size, 'correct file was uploaded');
    });

    QUnit.test('upload of all files with upload method does not work in useForm mode', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm'
        });
        simulateFileChoose($element, fakeFile);
        $element.dxFileUploader('instance').upload();

        const request = this.xhrMock.getInstanceAt();

        assert.ok(!request, 'request is not created');
    });

    QUnit.test('upload of all files with upload method works in instantly mode if set files to value option', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly'
        });
        const instance = $element.dxFileUploader('instance');

        instance.option('value', [fakeFile]);
        this.clock.tick(300);
        instance.upload();

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        const request = this.xhrMock.getInstanceAt();

        assert.ok(request.uploaded, 'upload is done');
    });

    QUnit.test('set custom dialog trigger attaches click event handler on targets', function(assert) {
        const instance = $('#fileuploader').dxFileUploader().dxFileUploader('instance');
        sinon.stub(instance, '_attachSelectFileDialogHandler');

        instance.option('dialogTrigger', '.pic');

        assert.strictEqual(instance._attachSelectFileDialogHandler.callCount, 1, 'attachHandlers method called');
        const items = instance._attachSelectFileDialogHandler.args[0];
        assert.strictEqual(items.length, 1, 'attachHandlers args is valid');
        assert.strictEqual(items[0], '.pic', 'attachHandlers args is valid');

        instance._attachSelectFileDialogHandler.restore();
    });

    QUnit.test('it is possible to drop files using custom dropzone', function(assert) {
        const customDropZone = $('<div>').addClass('drop').appendTo('#qunit-fixture');
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            multiple: true,
            dropZone: '.drop'
        });
        const files = [fakeFile, fakeFile1];
        const event = $.Event($.Event('drop', { dataTransfer: { files: files } }));

        customDropZone.trigger(event);
        assert.deepEqual($fileUploader.dxFileUploader('option', 'value'), files, 'files are correct');
        customDropZone.remove();
    });

});

QUnit.module('uploading by chunks', moduleConfig, function() {
    QUnit.test('fileUploader should prevent upload chunks', function(assert) {
        let isPreventedUpload = false;
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            chunkSize: 2000,
            onUploadAborted: function() {
                isPreventedUpload = true;
            }
        });
        simulateFileChoose($fileUploader, [createBlobFile('fake.png', 100023)]);

        const instance = $fileUploader.dxFileUploader('instance');

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT_DEFAULT);
        instance.option('value', []);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT_DEFAULT);

        assert.ok(isPreventedUpload, 'file uploading is prevented');
    });
    QUnit.test('file should correctly cut and sent it', function(assert) {
        this.xhrMock.startSeries();
        const fakeContentFile = createBlobFile('fake.png', 100023);
        let index = 0;
        let loadedBytes = 0;
        let isUploaded = false;
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            chunkSize: 20000,
            onProgress: function(e) {
                const progressBar = $('.dx-progressbar').dxProgressBar('instance');
                const request = this.xhrMock.getLastInstance();

                loadedBytes += request.loadedSize;
                assert.equal(e.bytesLoaded, loadedBytes, 'total loaded bytes size is correct');
                assert.equal(progressBar.option('value'), loadedBytes, 'progressBar value is correct');
                assert.equal(e.segmentSize, request.loadedSize, 'loaded segment bytes size is correct');
                assert.equal(e.component.option('progress'), Math.floor(loadedBytes / fakeContentFile.size * 100), 'component progress value is correct');

                assert.ok(this.xhrMock.getInstanceAt(index), 'request ' + index + ' is created');
                index++;
            }.bind(this),
            onUploaded: function() {
                isUploaded = true;
            }
        });
        const instance = $fileUploader.dxFileUploader('instance');
        simulateFileChoose($fileUploader, [fakeContentFile]);
        this.clock.tick();

        const expectedCallsCount = Math.ceil(fakeContentFile.size / instance.option('chunkSize'));
        assert.equal(index, expectedCallsCount, 'count of calls onProgress event is valid');
        assert.ok(isUploaded, 'file is uploaded');
        assert.equal(instance.option('progress'), 100, 'component progress value is correct');
    });
    QUnit.test('onFileAborted event should be raised if canceled uploading', function(assert) {
        let isUploadAborted = false;
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            chunkSize: 20000,
            onUploadAborted: function() {
                isUploadAborted = true;
            }
        });
        simulateFileChoose($fileUploader, [createBlobFile('fake.png', 100023)]);
        $fileUploader.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).eq(0).trigger('dxclick');
        assert.ok(isUploadAborted, 'upload file is aborted');
        assert.ok(this.xhrMock.getInstanceAt().uploadAborted, 'request is aborted');
    });
    QUnit.test('multiple files should correctly cut and sent it', function(assert) {
        this.xhrMock.startSeries();
        let fileUploadedCount = 0;
        let totalBytes = 0;
        let totalLoadedBytes = 0;
        const fileStates = { };

        const files = [createBlobFile('fake1.png', 100023), createBlobFile('fake2.png', 5000)];
        files.forEach(function(item) {
            totalBytes += item.size;
            fileStates[item.name] = {
                bytesLoaded: 0
            };
        });

        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            chunkSize: 20000,
            onProgress: function(e) {
                const request = this.xhrMock.getLastInstance();
                const state = fileStates[e.file.name];
                state.bytesLoaded += request.loadedSize;
                totalLoadedBytes += request.loadedSize;

                assert.equal(e.bytesLoaded, state.bytesLoaded, 'loaded bytes size is correct');
                assert.equal(e.segmentSize, request.loadedSize, 'current loaded segment bytes size is correct');
                assert.equal(e.component.option('progress'), Math.floor(totalLoadedBytes / totalBytes * 100), 'component progress value is correct');
            }.bind(this),
            onUploaded: function() {
                fileUploadedCount++;
            }
        });
        simulateFileChoose($fileUploader, files);
        this.clock.tick();

        assert.equal(fileUploadedCount, files.length, 'Count uploaded files is correct');
        for(let i = 0; i < files.length; i++) {
            assert.equal(files[i].size, fileStates[files[i].name].bytesLoaded, 'Uploded file bytes is correct');
        }
    });
    QUnit.test('uploading multiple files should be succesed', function(assert) {
        const uploadedFiles = [];
        this.xhrMock.startSeries();
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'instantly',
            chunkSize: 20000,
            onUploaded: function(e) {
                uploadedFiles.push(e.file.name);
            }
        });

        const files = [createBlobFile('fake1.png', 100023), createBlobFile('fake2.png', 5000)];
        simulateFileChoose($fileUploader, files);
        this.clock.tick();

        assert.equal(uploadedFiles.length, files.length, 'count uploaded files is valid');
        for(let i = 0; i < files.length; i++) {
            assert.equal(uploadedFiles[files.length - i - 1], files[i].name, 'uploaded files is valid');
        }
    });
    QUnit.test('each chunk should be set in the separate call stack - T886389', function(assert) {
        this.xhrMock.startSeries();

        const fileSize = 100023;
        const chunkSize = 20000;
        const files = [createBlobFile('fake1.png', fileSize)];
        const chunkCount = Math.ceil(fileSize / chunkSize);

        const progressSpy = sinon.spy();

        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            chunkSize,
            onProgress: progressSpy
        });

        simulateFileChoose($fileUploader, files);
        assert.strictEqual(progressSpy.callCount, 1, 'only one chunk sent');

        this.clock.tick();
        assert.strictEqual(progressSpy.callCount, chunkCount, 'all chunks are sent');
    });
});

QUnit.module('validation rendering', moduleConfig, function() {
    QUnit.test('file with .pdf Extension should be rendered as invalid', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true,
            allowedFileExtensions: ['.jpeg', '.png']
        });
        const $filesContainer = $fileUploader.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS);
        simulateFileChoose($fileUploader, [fakeFile, fakeFile1, fakeFile2]);
        assert.equal($filesContainer.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + '.' + FILEUPLOADER_INVALID_CLASS).length, 1, 'One file is invalid');
        assert.equal($filesContainer.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS).not('.' + FILEUPLOADER_INVALID_CLASS).length, 2, 'Two files is valid');

        const invalidFileName = $filesContainer.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + '.' + FILEUPLOADER_INVALID_CLASS).find('.' + FILEUPLOADER_FILE_NAME_CLASS).text();
        assert.equal(invalidFileName, fakeFile2.name, fakeFile2.name + 'is invalid file name');
    });
    QUnit.test('file with .pdf Extension should be rendered with validation text', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            allowedFileExtensions: ['.jpeg']
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');
        simulateFileChoose($fileUploader, [fakeFile2]);

        const statusMessage = $fileUploader.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).text();
        assert.equal(statusMessage, fileUploader.option('invalidFileExtensionMessage'), 'validation text is correct');
    });
    QUnit.test('File with size more than 100 kb is invalid ', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            maxFileSize: 100000
        });
        simulateFileChoose($fileUploader, [fakeFile]);
        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + '.' + FILEUPLOADER_INVALID_CLASS).length, 1, 'One file is invalid');
        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS).not('.' + FILEUPLOADER_INVALID_CLASS).length, 0, 'No has valid files');
    });
    QUnit.test('File with size more than 100 kb should be rendered with validation text ', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            maxFileSize: 100000
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');
        simulateFileChoose($fileUploader, [fakeFile]);

        const statusMessage = $fileUploader.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).text();
        assert.equal(statusMessage, fileUploader.option('invalidMaxFileSizeMessage'), 'validation text is correct');
    });
    QUnit.test('File with size less than 2 kb is invalid ', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            minFileSize: 2000
        });
        simulateFileChoose($fileUploader, [fakeFile, fakeFile1]);
        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + '.' + FILEUPLOADER_INVALID_CLASS).length, 1, 'Big file is invalid');
        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS).not('.' + FILEUPLOADER_INVALID_CLASS).length, 1, 'Small file is valid');
    });
    QUnit.test('File with size less than 2 kb should be rendered with validation text ', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            minFileSize: 2000
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');
        simulateFileChoose($fileUploader, [fakeFile1]);

        const statusMessage = $fileUploader.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).text();
        assert.equal(statusMessage, fileUploader.option('invalidMinFileSizeMessage'), 'validation text is correct');
    });
    QUnit.test('Files with size more than 4 kb and file extension not contains in allowedFileExtensions should be invalid', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            allowedFileExtensions: ['.pdf'],
            maxFileSize: 4000
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');
        simulateFileChoose($fileUploader, [fakeFile, fakeFile1, fakeFile2]);

        const bigFileWithInvalidExtStatusMessage = $($fileUploader.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).get(0)).text();
        assert.ok(bigFileWithInvalidExtStatusMessage.indexOf(fileUploader.option('invalidMaxFileSizeMessage')) > -1, 'has invalidMaxFileSizeMessage');
        assert.ok(bigFileWithInvalidExtStatusMessage.indexOf(fileUploader.option('invalidFileExtensionMessage')) > -1, 'has invalidFileExtensionMessage');

        const imageFileStatusMessage = $($fileUploader.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).get(1)).text();
        assert.equal(imageFileStatusMessage, fileUploader.option('invalidFileExtensionMessage'), 'has invalidFileExtensionMessage');

        const pdfFileStatusMessage = $($fileUploader.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).get(2)).text();
        assert.equal(pdfFileStatusMessage, fileUploader.option('readyToUploadMessage'), 'validation passed');
    });
});


QUnit.module('rendering', () => {
    QUnit.test('the \'Upload\' button should be hidden if no files are chosen', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });
        const $uploadButton = $fileUploader.find('.' + FILEUPLOADER_CONTENT_CLASS + ' > .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

        assert.ok($uploadButton.length && !$uploadButton.is(':visible'), 'the upload button is hidden');
    });
});

QUnit.module('files rendering', moduleConfig, () => {
    QUnit.test('selected files should be rendered in container', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true
        });
        const $filesContainer = $fileUploader.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS);

        simulateFileChoose($fileUploader, [fakeFile, fakeFile1]);
        assert.equal($filesContainer.find('.' + FILEUPLOADER_FILE_CLASS).length, 2, 'number of files is correct');
    });

    QUnit.test('selected files should be rendered in container, uploadMethod = useForm', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'useForm'
        });
        const $filesContainer = $fileUploader.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS);

        simulateFileChoose($fileUploader, [fakeFile, fakeFile1]);
        assert.equal($filesContainer.find('.' + FILEUPLOADER_FILE_CLASS).length, 2, 'number of files is correct');
    });

    QUnit.test('files should contain file name and file size', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader();

        simulateFileChoose($fileUploader, fakeFile);

        const $file = $('.' + FILEUPLOADER_FILE_CLASS);

        assert.equal($file.find('.' + FILEUPLOADER_FILE_NAME_CLASS).length, 1, 'file contains file name');
        assert.equal($file.find('.' + FILEUPLOADER_FILE_SIZE_CLASS).length, 1, 'file contains file size');
    });

    QUnit.test('files size should be correct', function(assert) {
        const files = [
            { name: 'first.png', size: 1 },
            { name: 'second.png', size: 1024 },
            { name: 'third.png', size: 1048576 },
            { name: 'fourth.png', size: 1073741824 }
        ];
        const filesSize = [
            '1 bytes',
            '1 kb',
            '1 Mb',
            '1 Gb'
        ];
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true
        });

        simulateFileChoose($fileUploader, files);

        const $filesSize = $('.' + FILEUPLOADER_FILE_SIZE_CLASS);

        $.each(filesSize, function(index, fileSize) {
            assert.equal($filesSize.eq(index).text(), fileSize, 'file ' + (index + 1) + ' size is correct');
        });
    });

    QUnit.test('progressBar should be rendered for each file', function(assert) {
        const files = [fakeFile, fakeFile1];
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'instantly'
        });

        simulateFileChoose($fileUploader, files);

        const $progressBar = $fileUploader.find('.' + FILEUPLOADER_FILE_CLASS + ' .dx-progressbar');

        assert.equal($progressBar.length, files.length, 'separate progressBar is rendered for each file');
    });

    QUnit.test('cancel button should be rendered for each file', function(assert) {
        const files = [fakeFile, fakeFile1];
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'instantly'
        });

        simulateFileChoose($fileUploader, files);

        const $cancelButtons = $fileUploader.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS);

        assert.equal($cancelButtons.length, files.length, 'cancel buttons are rendered');
    });

    QUnit.test('list of files should be rendered depending on the \'showFileList\' option', function(assert) {
        const files = [fakeFile, fakeFile1];
        const $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            showFileList: false,
            extendSelection: false
        });
        const instance = $element.dxFileUploader('instance');

        simulateFileChoose($element, files);

        assert.equal($element.find('.' + FILEUPLOADER_FILE_CLASS).length, 0, 'no files are listed');

        instance.option('showFileList', true);
        assert.equal($element.find('.' + FILEUPLOADER_FILE_CLASS).length, files.length, 'files are listed');

        instance.option('showFileList', false);
        assert.equal($element.find('.' + FILEUPLOADER_FILE_CLASS).length, 0, 'no files are listed again');
    });

    QUnit.test('file info width should be correct if file has long name', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            allowCanceling: true,
            uploadMode: 'useButtons',
            width: 300
        });
        const file = {
            name: 'very_very_very_very_very_very_very_very_very_long_name.png',
            size: 100023,
            type: 'image/png',
            lastModifiedDate: $.now()
        };

        simulateFileChoose($fileUploader, file);

        const $fileContainer = $fileUploader.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS);
        const fileContainerWidth = $fileContainer.width();
        const $fileContainerChildren = $fileContainer.children();
        let fileContainerChildrenWidth = 0;

        for(let i = 0, n = $fileContainerChildren.length; i < n; i++) {
            fileContainerChildrenWidth += $fileContainerChildren.eq(i).width();
        }

        assert.ok(fileContainerChildrenWidth <= fileContainerWidth, 'file info width is correct');
    });

    QUnit.test('drag event should handle on inputWrapper element if \'useDragOver\' is true', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            uploadMode: 'instantly'
        });
        const $inputWrapper = $fileUploader.find('.dx-fileuploader-input-wrapper');

        $fileUploader.trigger('dragenter');
        assert.ok(!$fileUploader.hasClass('dx-fileuploader-dragover'), 'drag event was not handled for fileuploader element');

        $inputWrapper.trigger('dragenter');
        assert.ok($fileUploader.hasClass('dx-fileuploader-dragover'), 'drag event was handled for input wrapper element');
    });

    QUnit.test('\'dragover\' class should be removed on \'dragleave\' event after several \'dragenter\' events', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            uploadMode: 'instantly'
        });
        const $inputWrapper = $fileUploader.find('.dx-fileuploader-input-wrapper');

        $inputWrapper
            .trigger('dragenter')
            .trigger('dragenter')
            .trigger('dragleave');

        assert.notOk($fileUploader.hasClass('dx-fileuploader-dragover'), 'FileUploader hasn\'t the dragover class');
    });

    QUnit.test('T286111 - input click should not be prevented if the \'useNativeInputClick\' option is set to true', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({ uploadMode: 'useButtons', useNativeInputClick: true });
        const $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);
        const clickSpy = sinon.spy();

        $input
            .on('click', clickSpy)
            .click();

        assert.ok(clickSpy.calledOnce, 'input click event handler is called once');
        assert.ok(!clickSpy.args[0][0].isDefaultPrevented(), 'click event is not prevented');
    });

    QUnit.test('T286111 - input should be rendered in select button if form is used and native click should be', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm',
            useNativeInputClick: true
        });
        const $selectButton = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS).children('.' + FILEUPLOADER_BUTTON_CLASS);

        assert.equal($selectButton.find('.' + FILEUPLOADER_INPUT_CLASS).length, 1, 'input is rendered in select button');
    });

    QUnit.test('files count in list is correct if the \'extendSelection\' option is false', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            extendSelection: false,
            multiple: true
        });

        simulateFileChoose($fileUploader, [fakeFile, fakeFile]);
        simulateFileChoose($fileUploader, [fakeFile, fakeFile, fakeFile]);

        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CLASS).length, 3, 'files count is correct');
    });

    QUnit.test('files count in list is correct if the \'extendSelection\' option is true', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            extendSelection: true,
            multiple: true,
            uploadMode: 'instantly'
        });

        simulateFileChoose($fileUploader, [getNewFile(), getNewFile()]);
        simulateFileChoose($fileUploader, [getNewFile(), getNewFile(), getNewFile()]);

        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CLASS).length, 5, 'files count is correct');
    });

    QUnit.test('file list should be updated after choosing another file when \'multiple\' option is false (T390178)', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly'
        });

        simulateFileChoose($fileUploader, [fakeFile]);
        simulateFileChoose($fileUploader, [fakeFile1]);

        const fileName = $fileUploader.find('.' + FILEUPLOADER_FILE_NAME_CLASS).text();
        assert.equal(fileName, fakeFile1.name, 'the correct file is displayed in the file list');
        assert.notEqual(this.xhrMock.getInstanceAt(1), undefined, 'request is created');
    });
});

QUnit.module('allowCanceling', moduleConfig, () => {
    QUnit.test('cancel buttons rendering should depend on the \'allowCanceling\' option', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            allowCanceling: false,
            uploadMode: 'instantly'
        });
        const instance = $element.dxFileUploader('instance');

        simulateFileChoose($element, fakeFile);
        assert.ok(!$element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).is(':visible'), 'cancel button is not visible when \'allowCanceling\' is false');


        instance.option('allowCanceling', true);
        simulateFileChoose($element, fakeFile);

        assert.equal($element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).length, 1, 'cancel button is rendered when \'allowCanceling\' is true');
    });

    QUnit.test('the \'cancel\' button should be rendered for each file if the \'allowCanceling\' option is true', function(assert) {
        const files = [fakeFile, fakeFile1];
        const $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            showFileList: true,
            allowCanceling: true,
            uploadMode: 'instantly'
        });

        simulateFileChoose($element, files);
        assert.equal($element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).length, 2, 'two cancel button are rendered');

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);
        assert.ok(!$element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).is(':visible'), 'no cancel buttons are rendered after files are uploaded');
    });

    QUnit.test('file should be removed after the \'cancel\' button is clicked', function(assert) {
        const files = [fakeFile, fakeFile1];
        let valueChangedCount = 0;
        const $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            showFileList: true,
            allowCanceling: true,
            uploadMode: 'instantly'
        });
        const instance = $element.dxFileUploader('instance');

        simulateFileChoose($element, files);

        instance.option('onValueChanged', function() {
            valueChangedCount++;
        });
        $element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).eq(0).trigger('dxclick');

        assert.equal($element.find('.' + FILEUPLOADER_FILE_CLASS).length, 1, 'only one file is rendered');
        assert.deepEqual(instance.option('value'), [fakeFile1], 'only one file is in the \'value\' option');
        assert.equal(valueChangedCount, 1, 'the \'onValueChanged\' event is fired');
    });

    QUnit.test('the \'allowCanceling\' option should be ignored if the \'uploadMode\' option is \'useForm\'', function(assert) {
        const files = [fakeFile, fakeFile1];
        const $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            showFileList: true,
            allowCanceling: true,
            uploadMode: 'useForm'
        });

        simulateFileChoose($element, files);
        assert.equal($element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).length, 0, 'no cancel buttons are rendered');
    });

    QUnit.test('file list should be cleared when \'useForm\' option is used', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'useForm'
        });
        const fileUploader = $element.dxFileUploader('instance');
        const newFile = getNewFile();

        simulateFileChoose($element, [fakeFile, fakeFile1]);
        simulateFileChoose($element, [newFile]);

        assert.deepEqual(fileUploader.option('value'), [newFile], 'file list was cleared');
    });

    QUnit.test('cancel of all files with abortUpload method', function(assert) {
        const onUploadAbortedSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'useButtons',
            onUploadAborted: onUploadAbortedSpy,
            onUploaded: onUploadedSpy
        });
        simulateFileChoose($element, [fakeFile, fakeFile1]);
        const instance = $element.dxFileUploader('instance');

        instance.upload();
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);

        instance.abortUpload();
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

        assert.ok(onUploadAbortedSpy.calledTwice, 'upload is cancelled');
        assert.ok(onUploadedSpy.notCalled, 'upload is not finished');
    });

    QUnit.test('cancel of specific file by file from value option with abortUpload method', function(assert) {
        const onUploadAbortedSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'useButtons',
            onUploadAborted: onUploadAbortedSpy,
            onUploaded: onUploadedSpy
        });
        const instance = $element.dxFileUploader('instance');
        const files = [fakeFile, fakeFile1];

        simulateFileChoose($element, files);

        instance.upload();

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);

        instance.abortUpload(1);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

        assert.ok(onUploadAbortedSpy.calledOnce, 'upload is cancelled');
        assert.strictEqual(onUploadAbortedSpy.args[0][0].file.name, files[1].name, 'correct file is cancelled');
        assert.ok(onUploadedSpy.calledOnce, 'upload is finished');
        assert.strictEqual(onUploadedSpy.args[0][0].file.name, files[0].name, 'correct file is uploaded');
    });

    QUnit.test('cancel of specific file by file index with abortUpload method', function(assert) {
        const onUploadAbortedSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'useButtons',
            onUploadAborted: onUploadAbortedSpy,
            onUploaded: onUploadedSpy
        });
        const instance = $element.dxFileUploader('instance');
        const files = [fakeFile, fakeFile1];

        simulateFileChoose($element, files);

        instance.upload();

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);

        instance.abortUpload(instance.option('value[1]'));
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

        assert.ok(onUploadAbortedSpy.calledOnce, 'upload is cancelled');
        assert.strictEqual(onUploadAbortedSpy.args[0][0].file.name, files[1].name, 'correct file is cancelled');
        assert.ok(onUploadedSpy.calledOnce, 'upload is finished');
        assert.strictEqual(onUploadedSpy.args[0][0].file.name, files[0].name, 'correct file is uploaded');
    });

    QUnit.test('useButtons: cancel of a file with abortUpload method leads to resetting file state', function(assert) {
        const onUploadAbortedSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'useButtons',
            onUploadAborted: onUploadAbortedSpy,
            onUploaded: onUploadedSpy
        });
        simulateFileChoose($element, [fakeFile, fakeFile1]);
        const instance = $element.dxFileUploader('instance');

        instance.upload();
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);

        instance.abortUpload();
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

        assert.ok(onUploadAbortedSpy.calledTwice, 'upload is cancelled');
        assert.ok(onUploadedSpy.notCalled, 'upload is not finished');

        const $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS);
        const $progressBar = $element.find('.dx-progressbar');
        const $uploadButton = $element.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

        assert.strictEqual($fileStatusMessage.eq(0).text(), instance.option('readyToUploadMessage'), 'status message is returned to original state');
        assert.ok($fileStatusMessage.eq(0).is(':visible'), 'status message is visible');
        assert.strictEqual($fileStatusMessage.eq(1).text(), instance.option('readyToUploadMessage'), 'status message is return to original state');
        assert.ok($fileStatusMessage.eq(1).is(':visible'), 'status message is visible');
        assert.strictEqual($progressBar.length, 0, 'there is no progressbar');
        assert.ok($uploadButton.eq(1).is(':visible'), '\'upload\' button 1 is visible');
        assert.notOk($uploadButton.eq(1).hasClass('dx-state-disabled'), '\'upload\' button 1 is enabled');
        assert.ok($uploadButton.eq(2).is(':visible'), '\'upload\' button 2 is visible');
        assert.notOk($uploadButton.eq(2).hasClass('dx-state-disabled'), '\'upload\' button 2 is enabled');
    });

    QUnit.test('instantly: cancel of a file with abortUpload method sets file in aborted state', function(assert) {
        const onUploadAbortedSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'instantly',
            onUploadAborted: onUploadAbortedSpy,
            onUploaded: onUploadedSpy
        });
        simulateFileChoose($element, [fakeFile, fakeFile1]);
        const instance = $element.dxFileUploader('instance');

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);

        instance.abortUpload();
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

        assert.ok(onUploadAbortedSpy.calledTwice, 'upload is cancelled');
        assert.ok(onUploadedSpy.notCalled, 'upload is not finished');

        const $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS);
        const $progressBar = $element.find('.dx-progressbar');

        assert.strictEqual($fileStatusMessage.eq(0).text(), instance.option('uploadAbortedMessage'), 'has aborted status message');
        assert.ok($fileStatusMessage.eq(0).is(':visible'), 'status message is visible');
        assert.strictEqual($fileStatusMessage.eq(1).text(), instance.option('uploadAbortedMessage'), 'has aborted status message');
        assert.ok($fileStatusMessage.eq(1).is(':visible'), 'status message is visible');
        assert.strictEqual($progressBar.length, 0, 'there is no progressbar');
    });

    QUnit.test('useButtons: upload can be restarted with button after abortUpload() called', function(assert) {
        const onUploadAbortedSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            onUploadAborted: onUploadAbortedSpy,
            onUploaded: onUploadedSpy
        });
        simulateFileChoose($element, [fakeFile]);
        const instance = $element.dxFileUploader('instance');

        instance.upload();
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);

        instance.abortUpload();
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

        assert.ok(onUploadAbortedSpy.calledOnce, 'upload is cancelled');
        assert.ok(onUploadedSpy.notCalled, 'upload is not finished');

        onUploadAbortedSpy.reset();
        onUploadedSpy.reset();

        let $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS);
        let $progressBar = $element.find('.dx-progressbar');
        let $uploadButton = $element.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

        assert.strictEqual($fileStatusMessage.eq(0).text(), instance.option('readyToUploadMessage'), 'status message is returned to original state');
        assert.ok($fileStatusMessage.eq(0).is(':visible'), 'status message is visible');
        assert.strictEqual($progressBar.length, 0, 'there is no progressbar');
        assert.ok($uploadButton.eq(1).is(':visible'), '\'upload\' button is visible');
        assert.notOk($uploadButton.eq(1).hasClass('dx-state-disabled'), '\'upload\' button is enabled');

        $uploadButton.eq(1).trigger('dxclick');
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

        assert.ok(onUploadAbortedSpy.notCalled, 'upload is not cancelled');
        assert.ok(onUploadedSpy.calledOnce, 'upload is finished');


        $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS);
        $progressBar = $element.find('.dx-progressbar');
        $uploadButton = $element.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

        assert.strictEqual($fileStatusMessage.eq(0).text(), instance.option('uploadedMessage'), 'has uploaded status message');
        assert.ok($fileStatusMessage.eq(0).is(':visible'), 'status message is visible');
        assert.strictEqual($progressBar.length, 0, 'there is no progressbar');
        assert.notOk($uploadButton.eq(1).is(':visible'), '\'upload\' button is invisible');
        assert.ok($uploadButton.eq(1).hasClass('dx-state-disabled'), '\'upload\' button is disabled');
    });

    QUnit.test('its possible to remove file with removeFile() method when showFileList = false', function(assert) {
        const onUploadedSpy = sinon.spy();
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            showFileList: false,
            onUploaded: onUploadedSpy
        });
        simulateFileChoose($element, [fakeFile]);
        const instance = $element.dxFileUploader('instance');

        instance.upload();
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

        assert.ok(onUploadedSpy.calledOnce, 'upload is finished');

        instance.removeFile(0);
        assert.strictEqual(instance.option('value').length, 0, 'file is removed');
    });

});

QUnit.module('autoUpload', moduleConfig, () => {
    QUnit.test('\'upload\' button should be rendered depending on the \'uploadMode\' option', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });
        const instance = $fileUploader.dxFileUploader('instance');

        assert.equal($fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 1, '\'upload\' button is rendered');

        instance.option('uploadMode', 'instantly');
        assert.equal($fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 0, '\'upload\' button is not rendered');

        instance.option('uploadMode', 'useButtons');
        assert.equal($fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 1, '\'upload\' button is rendered again');
    });

    QUnit.test('upload buttons should be rendered if the \'uploadMode\' option is \'useButtons\'', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });
        const files = [fakeFile, fakeFile1];
        simulateFileChoose($element, files);

        const $commonUploadButton = $element.find('.' + FILEUPLOADER_CONTENT_CLASS + ' > .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);
        assert.equal($commonUploadButton.length, 1, 'common upload button is rendered');

        const $uploadButtons = $element.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS + ' .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);
        assert.equal($uploadButtons.length, files.length, 'upload button is created for each file');
    });

    QUnit.test('the \'value\' option should be cleared after the \'uploadMode\' option change', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            multiple: true
        });
        const instance = $fileUploader.dxFileUploader('instance');

        const files = [fakeFile, fakeFile1];
        simulateFileChoose($fileUploader, files);

        assert.equal(instance.option('value').length, files.length, 'files are added after init');

        instance.option('uploadMode', 'instantly');
        assert.equal(instance.option('value').length, 0, 'the \'value\' option is empty');
    });

    QUnit.test('the \'upload\' button should not be rendered if the \'uploadMode\' option is not \'useButtons\'', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm'
        });
        const instance = $fileUploader.dxFileUploader('instance');

        assert.equal($fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 0, 'there is no \'upload\' button');

        instance.option('uploadMode', 'instantly');
        assert.equal($fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 0, 'there is no \'upload\' button');
    });

    QUnit.test('no upload buttons should be rendered if the \'uploadMode\' option is \'instantly\'', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly'
        });

        simulateFileChoose($element, fakeFile);

        assert.equal($element.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 0, 'no upload buttons are created');
    });

    QUnit.test('file should be uploaded only one time', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });
        const $uploadButton = $fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

        simulateFileChoose($fileUploader, fakeFile);

        $uploadButton.trigger('dxclick');
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);

        const xhr = this.xhrMock.getLastInstance();
        $uploadButton.trigger('dxclick');
        let newXhr = this.xhrMock.getLastInstance();

        assert.equal(xhr, newXhr, 'new xhr was not created when file is uploading');

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);
        $uploadButton.trigger('dxclick');
        newXhr = this.xhrMock.getLastInstance();

        assert.equal(xhr, newXhr, 'new xhr was not created when file is uploaded');
    });
});

QUnit.module('value option', moduleConfig, () => {
    QUnit.test('selected file should be present in value option', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader();
        const fileUploader = $fileUploader.dxFileUploader('instance');

        simulateFileChoose($fileUploader, fakeFile);

        assert.deepEqual(fileUploader.option('value'), [fakeFile], 'value set correctly');
    });

    QUnit.test('input value should not be changed inside widget after selecting', function(assert) {
        const originalVal = $.fn.val;

        try {
            const $fileUploader = $('#fileuploader').dxFileUploader({
                uploadMode: 'instantly'
            });

            let valUsed = 0;

            $.fn.val = function() {
                if(arguments.length) {
                    valUsed++;
                }

                return originalVal.apply(this, arguments);
            };

            simulateFileChoose($fileUploader, fakeFile);

            assert.equal(valUsed, 1, 'val used only in simulateFileChoose method');
        } finally {
            $.fn.val = originalVal;
        }
    });

    QUnit.test('value change should be fired when file selected', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onValueChanged: function(e) {
                assert.deepEqual(e.value, [fakeFile], 'value specified correctly');
            }
        });

        simulateFileChoose($fileUploader, fakeFile);
    });

    QUnit.test('value change should be fired when file selected, uploadMode = useForm', function(assert) {
        const valueChangeHandler = sinon.stub();
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm',
            onValueChanged: valueChangeHandler
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');

        simulateFileChoose($fileUploader, fakeFile);

        assert.equal(valueChangeHandler.callCount, 1, 'onValueChanged was called once');
        assert.deepEqual(valueChangeHandler.getCall(0).args[0].value, [fakeFile], 'value have been correctly passed to the event');
        assert.deepEqual(fileUploader.option('value'), [fakeFile], 'value is correct');
    });

    QUnit.test('value should support files at initialization', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            value: [fakeFile]
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');
        const $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

        assert.equal($fileInput.val(), '', 'input value was set to empty string');
        assert.deepEqual(fileUploader.option('value'), [fakeFile], 'file value is correct');
    });

    QUnit.test('value should present in the file name', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader();

        simulateFileChoose($fileUploader, fakeFile);

        const $fileName = $fileUploader.find('.' + FILEUPLOADER_FILE_NAME_CLASS).eq(0);

        assert.equal($fileName.text(), fakeFile.name, 'file name represent value correctly');
    });

    QUnit.test('empty class should be present when value is empty', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader();

        assert.ok($fileUploader.hasClass(FILEUPLOADER_EMPTY_CLASS), 'empty class added');

        simulateFileChoose($fileUploader, fakeFile);
        assert.ok(!$fileUploader.hasClass(FILEUPLOADER_EMPTY_CLASS), 'empty class not added');
    });

    QUnit.test('value should contain only file name (ie9 fix)', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            extendSelection: false
        });

        simulateFileChoose($fileUploader, 'C:\\fakefolder\\fakefile.txt');
        assert.deepEqual($fileUploader.dxFileUploader('option', 'value'), [{ name: 'fakefile.txt' }], 'value contain file name');

        simulateFileChoose($fileUploader, 'C:\\fakefile.txt');
        assert.deepEqual($fileUploader.dxFileUploader('option', 'value'), [{ name: 'fakefile.txt' }], 'value contain file name');

        simulateFileChoose($fileUploader, 'fakefile.txt');
        assert.deepEqual($fileUploader.dxFileUploader('option', 'value'), [{ name: 'fakefile.txt' }], 'value contain file name');
    });

    QUnit.test('T823593 file list shoud be rerendered if widget invalidated', function(assert) {
        let eventHandled = false;

        const onValueChanged = e => {
            if(eventHandled) {
                return;
            } else {
                eventHandled = true;
            }

            const fileUploader = e.component;
            fileUploader.beginUpdate();
            fileUploader.option('value', e.value);
            fileUploader.option('allowedFileExtensions', ['.png', '.gif']);
            fileUploader.endUpdate();
        };

        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'useForm',
            allowedFileExtensions: ['.png', '.gif'],
            onValueChanged: onValueChanged
        });

        simulateFileChoose($fileUploader, fakeFile);

        const $file = $fileUploader.find(`.${FILEUPLOADER_FILES_CONTAINER_CLASS} .${FILEUPLOADER_FILE_CLASS}`);
        const $fileName = $file.find(`.${FILEUPLOADER_FILE_NAME_CLASS}`);
        const $fileStatus = $file.find(`.${FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS}`);

        assert.strictEqual($file.length, 1, 'file rendered');
        assert.strictEqual($fileName.text(), 'fakefile.png', 'file name rendered');
        assert.strictEqual($fileStatus.text(), 'Ready to upload', 'file status message rendered');
    });
});

QUnit.module('multiple option', moduleConfig, () => {
    QUnit.test('field multiple attr should be set correctly', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true
        });
        const $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

        assert.equal($fileInput.prop('multiple'), true, 'file input has correct name property');

        $fileUploader.dxFileUploader('option', 'multiple', false);
        assert.equal($fileInput.prop('multiple'), false, 'file input has correct name property');
    });

    QUnit.test('value should contain several file names', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true,
            extendSelection: false
        });

        simulateFileChoose($fileUploader, fakeFile);
        assert.deepEqual($fileUploader.dxFileUploader('option', 'value'), [fakeFile], 'value contain file name');

        simulateFileChoose($fileUploader, [fakeFile, fakeFile1]);
        assert.deepEqual($fileUploader.dxFileUploader('option', 'value'), [fakeFile, fakeFile1], 'value contain both files');
    });
});

QUnit.module('option change', moduleConfig, () => {
    QUnit.test('file input should not be rerendered if widget repainted', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly'
        });

        simulateFileChoose($fileUploader, fakeFile);
        $fileUploader.dxFileUploader('repaint');

        const $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);
        assert.equal($fileInput.val(), fakeFile.name, 'value was not set to empty string');
    });
});

QUnit.module('file uploading', moduleConfig, () => {
    QUnit.test('upload should be started after file is selected', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({ uploadMode: 'instantly' });

        simulateFileChoose($element, fakeFile);

        const request = this.xhrMock.getInstanceAt();
        const expectedCallsCount = this.xhrMock.LOAD_TIMEOUT / this.xhrMock.PROGRESS_INTERVAL;

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

        assert.equal(request.onProgressCallCount, expectedCallsCount, 'the \'onprogress\' callback fired ' + expectedCallsCount + ' times');
        assert.ok(request.uploaded, 'loading is finished');
    });

    QUnit.test('upload should not start automatically only if \'uploadMode\' option is not \'instantly\'', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });

        simulateFileChoose($element, fakeFile);

        const request = this.xhrMock.getInstanceAt();
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

        assert.ok(!request, 'upload did not start');
    });

    QUnit.test('click on common \'upload\' button should start file uploading', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });
        const $button = $element.find('.' + FILEUPLOADER_CONTENT_CLASS + ' > .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

        simulateFileChoose($element, fakeFile);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

        let request = this.xhrMock.getInstanceAt();
        assert.ok(!request, 'upload did not start');

        $button.trigger('dxclick');
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        request = this.xhrMock.getInstanceAt();

        assert.ok(request.uploaded, 'upload started');
    });

    QUnit.test('upload of specific file should start after click on corresponding \'upload\' button', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });
        const files = [fakeFile, fakeFile1];

        simulateFileChoose($element, files);

        const $uploadButtons = $element.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS + ' .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

        $uploadButtons.eq(1).trigger('dxclick');

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        const request = this.xhrMock.getInstanceAt();

        assert.ok(request.uploaded, 'upload is done');
        assert.strictEqual(request.loadedSize, files[1].size, 'correct file was uploaded');
    });

    QUnit.test('file upload buttons should become disabled and invisible after upload started', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });
        const files = [fakeFile, fakeFile1];

        simulateFileChoose($element, files);

        let $uploadButtons = $element.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS + ' .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

        $uploadButtons.eq(0).trigger('dxclick');
        assert.strictEqual($uploadButtons.length, 2, 'both buttons are still here');
        assert.ok($uploadButtons.eq(0).hasClass('dx-state-disabled'), 'clicked button is disabled');
        assert.notOk($uploadButtons.eq(0).is(':visible'), 'clicked button is invisible');
        assert.ok($uploadButtons.eq(1).is(':visible'), 'other button is visible');
        assert.notOk($uploadButtons.eq(1).hasClass('dx-state-disabled'), 'other button is enabled');

        const $commonUploadButton = $element.find('.' + FILEUPLOADER_CONTENT_CLASS + ' > .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);
        $commonUploadButton.trigger('dxclick');

        $uploadButtons = $element.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS + ' .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);
        assert.strictEqual($uploadButtons.length, 2, 'both buttons are still here');
        assert.ok($uploadButtons.eq(0).hasClass('dx-state-disabled'), 'first button is still disabled');
        assert.notOk($uploadButtons.eq(0).is(':visible'), 'first button is still invisible');
        assert.notOk($uploadButtons.eq(1).is(':visible'), 'clicked button is invisible');
        assert.ok($uploadButtons.eq(1).hasClass('dx-state-disabled'), 'clicked button is disabled');
    });

    QUnit.test('progressBar should reflect file upload progress', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({ uploadMode: 'instantly' });

        simulateFileChoose($element, fakeFile);

        const request = this.xhrMock.getInstanceAt();
        const progressBar = $('.dx-progressbar').dxProgressBar('instance');

        assert.equal(progressBar.option('value'), request.loadedSize, 'progressBar value is correct on init');

        for(let i = 0, n = this.xhrMock.LOAD_TIMEOUT / this.xhrMock.PROGRESS_INTERVAL; i < n; i++) {
            this.clock.tick(this.xhrMock.PROGRESS_INTERVAL);
            assert.equal(progressBar.option('value'), request.loadedSize, 'progressBar value is correct on step ' + (i + 1));
        }

        assert.equal(request.onProgressCallCount, this.xhrMock.LOAD_TIMEOUT / this.xhrMock.PROGRESS_INTERVAL);
    });

    QUnit.test('request should use url from the \'uploadUrl\' option', function(assert) {
        const uploadUrl = location.href;
        const $element = $('#fileuploader').dxFileUploader({
            uploadUrl: uploadUrl,
            uploadMode: 'instantly'
        });

        simulateFileChoose($element, fakeFile);

        const request = this.xhrMock.getInstanceAt();

        assert.equal(request.url, uploadUrl, 'correct url is used');
    });

    QUnit.test('uploading multiple files', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({ uploadMode: 'instantly' });

        const files = [fakeFile, fakeFile1];
        simulateFileChoose($element, files);

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT * 2);

        $.each(files, (index, file) => {
            const currentRequest = this.xhrMock.getInstanceAt(index);
            assert.equal(currentRequest.loadedSize, file.size, (index + 1) + ' file is loaded');
        });
    });

    QUnit.test('upload process should be aborted by \'cancel\' button click', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({ uploadMode: 'instantly' });

        simulateFileChoose($element, fakeFile);

        const request = this.xhrMock.getInstanceAt();
        const $cancelButton = $element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS);

        $cancelButton.trigger('dxclick');

        assert.ok(request.uploadAborted, 'load is aborted');
    });

    QUnit.test('FormData field name should correspond the \'name\' option value', function(assert) {
        const formFieldElement = 'custom';
        const $element = $('#fileuploader').dxFileUploader({
            name: formFieldElement,
            uploadMode: 'instantly'
        });

        simulateFileChoose($element, fakeFile);

        const formData = this.formDataMock.getInstanceAt();
        const fieldName = formData.getTopElement().fieldName;

        assert.equal(fieldName, formFieldElement, 'field name is correct');
    });

    QUnit.test('uploadMode \'useForm\'', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm'
        });

        simulateFileChoose($element, fakeFile);

        const request = this.xhrMock.getInstanceAt();

        assert.ok(!request, 'request is not created');
    });

    QUnit.test('upload is successful for each 2xx status', function(assert) {
        assert.expect(1);

        this.xhrMock.setStatus(202);

        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploaded: function() {
                assert.ok(true, 'upload is success');
            },
            onUploadError: function() {
                assert.ok(false, 'upload should not be failed');
            }
        });

        simulateFileChoose($element, fakeFile);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
    });

    QUnit.test('the \'method\' option', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'instantly',
            uploadMethod: 'POST'
        });

        simulateFileChoose($element, fakeFile);
        assert.equal(this.xhrMock.getLastInstance()._method, 'POST', 'method is correct');

        $element.dxFileUploader('option', 'uploadMethod', 'PUT');
        simulateFileChoose($element, fakeFile1);
        assert.equal(this.xhrMock.getLastInstance()._method, 'PUT', 'method is correct');
    });

    QUnit.test('request should have correct headers', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadHeaders: {
                'First-header': 'First-header-value',
                'Second-header': 'Second-header-value'
            },
            uploadMode: 'instantly'
        });

        simulateFileChoose($element, fakeFile);
        const headers = this.xhrMock.getLastInstance()._headers;

        assert.equal(headers['First-header'], 'First-header-value', 'first header is correct');
        assert.equal(headers['Second-header'], 'Second-header-value', 'second header is correct');
    });

    QUnit.test('files upload is correct if the \'extendSelection\' option is true', function(assert) {
        let onUploadStartedCount = 0;
        const $fileUploader = $('#fileuploader').dxFileUploader({
            extendSelection: true,
            multiple: true,
            uploadMode: 'instantly',
            onUploadStarted: function() {
                onUploadStartedCount++;
            }
        });

        simulateFileChoose($fileUploader, [fakeFile, fakeFile]);
        simulateFileChoose($fileUploader, [fakeFile, fakeFile, fakeFile]);

        assert.equal(onUploadStartedCount, 5, 'files count is correct');
    });

    QUnit.test('uploaded files\' cancel buttons are hidden if the \'extendSelection\' option is true', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            extendSelection: true,
            multiple: true,
            uploadMode: 'instantly'
        });

        simulateFileChoose($fileUploader, [fakeFile, fakeFile]);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT + FILEUPLOADER_AFTER_LOAD_DELAY);
        assert.equal($fileUploader.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS + ':visible').length, 0, 'cancel buttons are hidden after files upload');

        simulateFileChoose($fileUploader, [fakeFile, fakeFile, fakeFile]);
        assert.equal($fileUploader.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS + ':visible').length, 3, 'uploaded files\' cancel button are hidden');
    });

    QUnit.test('files count should be correct after value reset', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            extendSelection: true,
            multiple: true
        });
        const $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

        simulateFileChoose($fileUploader, [fakeFile, fakeFile, fakeFile]);
        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CLASS).length, 3, 'files count is correct on the first file choose');

        $fileUploader.dxFileUploader('option', 'value', []);
        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CLASS).length, 0, 'files count is correct after reset');
        assert.equal($input.val(), '', 'value was cleared in input');

        simulateFileChoose($fileUploader, fakeFile);
        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CLASS).length, 1, 'files count is correct on the second file choose');
    });

    QUnit.test('input should be cleared after value reset', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            extendSelection: true,
            value: [fakeFile],
            multiple: true
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');
        const $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);
        $input.val('fakefile');
        fileUploader.reset();

        assert.equal($input.val(), '', 'value was cleared in input');
    });

    QUnit.test('input value should not be cleared after the file selection', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            extendSelection: true,
            uploadMode: 'useForm'
        });
        const $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);
        $input.val('fakeFile').trigger('change');

        assert.equal($input.val(), 'fakeFile', 'value was cleared in input');
    });

    QUnit.test('T857021 - widget can be destoyed in \'Uploaded\' event', function(assert) {
        const $fileUploader = $('#fileuploader');

        const onUploadedSpy = sinon.spy(() => {
            $fileUploader.dxFileUploader('dispose');
            $fileUploader.remove();
        });

        $fileUploader.dxFileUploader({
            onUploaded: onUploadedSpy
        });

        simulateFileChoose($fileUploader, fakeFile);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT + 1000);

        assert.strictEqual(onUploadedSpy.callCount, 1, 'onUploaded event raised');
        assert.ok($fileUploader.empty(), 'widget container empty');
    });
});

QUnit.module('uploading progress', moduleConfig, () => {
    QUnit.test('the \'progress\' option should reflect file upload progress', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            extendSelection: false,
            uploadMode: 'instantly'
        });
        const instance = $element.dxFileUploader('instance');

        const files = [fakeFile, fakeFile1];
        simulateFileChoose($element, files);

        const stepsCount = this.xhrMock.LOAD_TIMEOUT / this.xhrMock.PROGRESS_INTERVAL;

        let totalSize;
        let loadedSize;
        let currentProgress;

        for(let i = 0; i < stepsCount; i++) {
            loadedSize = 0;
            totalSize = 0;

            for(let j = 0; j < files.length; j++) {
                totalSize += files[j].size;
                loadedSize += this.xhrMock.getInstanceAt(j).loadedSize;
            }

            currentProgress = Math.floor(loadedSize * 100 / totalSize);

            assert.equal(instance.option('progress'), currentProgress, 'progress is correct on step ' + i);
            this.clock.tick(this.xhrMock.PROGRESS_INTERVAL);
        }

        simulateFileChoose($element, fakeFile);

        loadedSize = this.xhrMock.getInstanceAt(files.length).loadedSize;
        currentProgress = Math.floor(loadedSize * 100 / fakeFile.size);

        assert.equal(instance.option('progress'), currentProgress, 'progress is correct after value change');
    });

    QUnit.test('the \'progress\' option should be reset to 0 when new files are selected after old files has been uploaded', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            extendSelection: false
        });
        const instance = $element.dxFileUploader('instance');

        simulateFileChoose($element, fakeFile);

        $element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + ' .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).trigger('dxclick');
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        assert.equal(instance.option('progress'), 100, 'file is uploaded');

        simulateFileChoose($element, fakeFile1);

        assert.equal(instance.option('progress'), 0, 'file choosing leads to the \'progress\' option reset');
    });

    QUnit.test('T246244 - the \'progress\' option should be recalculated when not uploaded file is removed', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });
        const instance = $element.dxFileUploader('instance');

        simulateFileChoose($element, [fakeFile, fakeFile, fakeFile]);

        const $files = $element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS);
        const $firstFile = $files.eq(0);
        const $secondFile = $files.eq(1);
        const $thirdFile = $files.eq(2);

        $firstFile.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).trigger('dxclick');
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        assert.equal(instance.option('progress'), 33, 'file is uploaded');

        $secondFile.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
        assert.equal(instance.option('progress'), 50, 'file removing leads to progress recalculation');

        $thirdFile.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
        assert.equal(instance.option('progress'), 100, 'removing all not uploaded files leads to setting the \'progress\' option to 100');
    });

    QUnit.test('T246244 - the \'progress\' option should be recalculated when uploaded file is removed', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });
        const instance = $element.dxFileUploader('instance');

        simulateFileChoose($element, [fakeFile, fakeFile, fakeFile]);

        const $files = $element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS);
        const $firstFile = $files.eq(0);
        const $secondFile = $files.eq(1);
        const $thirdFile = $files.eq(2);

        $firstFile.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).trigger('dxclick');
        $secondFile.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).trigger('dxclick');
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        assert.equal(instance.option('progress'), 66, 'two files are uploaded');

        $secondFile.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
        assert.equal(instance.option('progress'), 50, 'uploaded file removing leads to progress recalculation');

        $thirdFile.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
        assert.equal(instance.option('progress'), 100, 'removing all files but one uploaded file leads to setting the \'progress\' option to 100');
    });

    QUnit.test('T246244 - the \'progress\' option should be recalculated when uploading file is removed', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        });
        const instance = $element.dxFileUploader('instance');

        simulateFileChoose($element, [fakeFile, fakeFile, fakeFile]);

        const $files = $element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS);
        const $firstFile = $files.eq(0);
        const $secondFile = $files.eq(1);
        const $thirdFile = $files.eq(2);

        $firstFile.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).trigger('dxclick');
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        $secondFile.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).trigger('dxclick');
        assert.equal(instance.option('progress'), 39, 'one file is uploaded and the other one is uploading');

        $secondFile.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
        assert.equal(instance.option('progress'), 50, 'uploading file removing leads to progress recalculation');

        $thirdFile.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
        assert.equal(instance.option('progress'), 100, 'removing all files but one uploaded file leads to setting the \'progress\' option to 100');
    });

    QUnit.test('T246244 - the \'progress\' option should be reset to 0 when last file is removed', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({ uploadMode: 'instantly' });
        const instance = $element.dxFileUploader('instance');

        simulateFileChoose($element, fakeFile);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        assert.equal(instance.option('progress'), 100, 'file is uploaded');

        $element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + ' .' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
        assert.equal(instance.option('progress'), 0, 'progress is reset');
    });
});

QUnit.module('file status message', moduleConfig, () => {
    QUnit.test('correct status message on init', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            readyToUploadMessage: 'ready'
        });
        const instance = $element.dxFileUploader('instance');

        simulateFileChoose($element, fakeFile);

        const $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS);
        const $progressBar = $element.find('.dx-progressbar');

        assert.equal($fileStatusMessage.text(), instance.option('readyToUploadMessage'), 'status message is correct');
        assert.ok($fileStatusMessage.is(':visible'), 'status message is visible');
        assert.equal($progressBar.length, 0, 'there is no progressbar');
    });

    QUnit.test('correct status message on uploaded', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            uploadedMessage: 'done'
        });
        const instance = $element.dxFileUploader('instance');

        simulateFileChoose($element, fakeFile);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

        const $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS);
        const $progressBar = $element.find('.dx-progressbar');

        assert.equal($fileStatusMessage.text(), instance.option('uploadedMessage'), 'status message is correct');
        assert.ok($fileStatusMessage.is(':visible'), 'status message is visible');
        assert.equal($progressBar.length, 0, 'there is no progressbar');
    });

    QUnit.test('status message is hidden and progressbar is visible on loading', function(assert) {
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            uploadedMessage: 'done'
        });

        simulateFileChoose($element, fakeFile);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);

        const $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS);
        const $progressBar = $element.find('.dx-progressbar');

        assert.ok(!$fileStatusMessage.is(':visible'), 'status message is not visible');
        assert.equal($progressBar.length, 1, 'progressbar is visible');
    });

    QUnit.test('status message should be correct if upload failed', function(assert) {
        this.xhrMock.setStatus(405);

        const $element = $('#fileuploader').dxFileUploader({
            uploadFailedMessage: 'failed',
            uploadMode: 'instantly'
        });
        const instance = $element.dxFileUploader('instance');

        simulateFileChoose($element, fakeFile);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

        const $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS);
        assert.equal($fileStatusMessage.text(), instance.option('uploadFailedMessage'), 'upload failed message is correct');
    });
});

QUnit.module('uploading events', moduleConfig, () => {
    QUnit.test('the \'onUploaded\' option', function(assert) {
        let onUploadedCount = 0;
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploaded: function() {
                onUploadedCount++;
            }
        });

        simulateFileChoose($element, fakeFile);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

        assert.equal(onUploadedCount, 1, 'the \'onUploaded\' callback is called');
    });

    QUnit.test('the \'onUploaded\' option with multiple files', function(assert) {
        let onUploadedCount = 0;
        const files = [fakeFile, fakeFile1];
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploaded: function() {
                onUploadedCount++;
            }
        });

        simulateFileChoose($element, files);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

        assert.equal(onUploadedCount, files.length, 'the \'onUploaded\' callback is called for each file');
    });

    QUnit.test('the \'onProgress\' option', function(assert) {
        let onProgressCount = 0;
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onProgress: function() {
                onProgressCount++;
            }
        });

        simulateFileChoose($element, fakeFile);
        assert.equal(onProgressCount, 1, 'the \'onProgress\' callback is called');

        this.clock.tick(this.xhrMock.PROGRESS_INTERVAL);
        assert.equal(onProgressCount, 2, 'the \'onProgress\' callback is called again after the progress interval');

        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);
        assert.equal(onProgressCount, 5, 'the \'onProgress\' callback is called 6 times after file is uploaded');
    });

    QUnit.test('the \'onProgress\' option with multiple files', function(assert) {
        let onProgressCount = 0;
        const files = [fakeFile, fakeFile1];
        const filesCount = files.length;
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onProgress: function() {
                onProgressCount++;
            }
        });

        simulateFileChoose($element, files);
        assert.equal(onProgressCount, filesCount, 'the \'onProgress\' callback is called for each file');

        this.clock.tick(this.xhrMock.PROGRESS_INTERVAL);
        assert.equal(onProgressCount, 2 * filesCount, 'the \'onProgress\' callback is called after the progress interval twice for each file');
    });

    QUnit.test('the \'onProgress\' option event fields', function(assert) {
        const stepSize = fakeFile.size * this.xhrMock.PROGRESS_INTERVAL / this.xhrMock.LOAD_TIMEOUT;
        const firstSegment = Math.floor(stepSize);
        const twoSegments = Math.floor(2 * stepSize);
        const onProgressHandler = sinon.spy();
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onProgress: onProgressHandler
        });

        simulateFileChoose($element, fakeFile);
        let args = onProgressHandler.getCall(0).args[0];

        assert.equal(args.segmentSize, firstSegment, 'segment size is correct');
        assert.equal(args.bytesLoaded, firstSegment, 'bytes loaded size is correct');
        assert.equal(args.bytesTotal, args.event.total, 'bytes total size is correct');
        assert.ok(args.bytesTotal, 'bytes total is defined');

        this.clock.tick(this.xhrMock.PROGRESS_INTERVAL);
        args = onProgressHandler.getCall(1).args[0];

        assert.equal(args.segmentSize, twoSegments - firstSegment, 'segment size is correct after progress interval');
        assert.equal(args.bytesLoaded, twoSegments, 'bytes loaded size is correct after progress interval');
        assert.equal(args.bytesTotal, args.event.total, 'bytes total size is correct');
        assert.ok(args.bytesTotal, 'bytes total is defined');
    });

    QUnit.test('the \'onUploadError\' option', function(assert) {
        this.xhrMock.setStatus(405);

        let onUploadErrorCount = 0;
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploadError: function() {
                onUploadErrorCount++;
            }
        });

        simulateFileChoose($element, fakeFile);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);
        assert.equal(onUploadErrorCount, 1, 'the \'onUploadError\' callback is called after file upload is failed');
    });

    QUnit.test('the \'onUploadError\' option with multiple files', function(assert) {
        this.xhrMock.setStatus(405);

        let onUploadErrorCount = 0;
        const files = [fakeFile, fakeFile1];
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploadError: function() {
                onUploadErrorCount++;
            }
        });

        simulateFileChoose($element, files);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        assert.equal(onUploadErrorCount, files.length, 'the \'onUploadError\' callback is called for each file after file upload is failed');
    });

    QUnit.test('the \'onUploaded\' option should be called the the \'showFileList\' option is false', function(assert) {
        let onUploadedCount = 0;
        const $element = $('#fileuploader').dxFileUploader({
            showFileList: false,
            uploadMode: 'instantly',
            onUploaded: function() {
                onUploadedCount++;
            }
        });

        simulateFileChoose($element, fakeFile);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        assert.equal(onUploadedCount, 1, 'the \'onUploaded\' callback is called');
    });

    QUnit.test('the \'onUploadError\' option should be called the the \'showFileList\' option is false', function(assert) {
        this.xhrMock.setStatus(405);

        let onUploadErrorCount = 0;
        const $element = $('#fileuploader').dxFileUploader({
            showFileList: false,
            uploadMode: 'instantly',
            onUploadError: function() {
                onUploadErrorCount++;
            }
        });

        simulateFileChoose($element, fakeFile);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        assert.equal(onUploadErrorCount, 1, 'the \'onUploadError\' callback is called');
    });

    QUnit.test('the \'onProgress\' option should be called the the \'showFileList\' option is false', function(assert) {
        let onProgressCount = 0;
        const $element = $('#fileuploader').dxFileUploader({
            showFileList: false,
            uploadMode: 'instantly',
            onProgress: function() {
                onProgressCount++;
            }
        });

        simulateFileChoose($element, fakeFile);
        assert.equal(onProgressCount, 1, 'the \'onUploaded\' callback is called');
    });

    QUnit.test('the \'onUploadError\' callback should be called for 4xx status only', function(assert) {
        this.xhrMock.setStatus(0);

        let onUploadError = 0;
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            allowCanceling: true,
            onUploadError: function() {
                onUploadError++;
            }
        });

        simulateFileChoose($element, fakeFile);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

        assert.strictEqual(onUploadError, 0, 'the \'onUploadError\' callback is not called');
    });

    QUnit.test('T350238 - the \'onUploaded\' action file should be correct', function(assert) {
        let file;
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploaded: function(e) {
                file = e.file;
            }
        });

        simulateFileChoose($element, fakeFile);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

        assert.deepEqual(fakeFile, file, 'file is correct');
    });

    QUnit.test('T350238 - the \'onProgress\' action file should be correct', function(assert) {
        let file;
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onProgress: function(e) {
                file = e.file;
            }
        });

        simulateFileChoose($element, fakeFile);
        assert.deepEqual(fakeFile, file, 'file is correct');
    });

    QUnit.test('T350238 - the \'onUploadError\' action file should be correct', function(assert) {
        this.xhrMock.setStatus(403);

        let file;
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            allowCanceling: true,
            onUploadError: function(e) {
                file = e.file;
            }
        });

        simulateFileChoose($element, fakeFile);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        assert.deepEqual(fakeFile, file, 'file is correct');
    });

    QUnit.test('the \'onUploadStarted\' action', function(assert) {
        let onUploadStartedCount = 0;
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploadStarted: function(e) {
                onUploadStartedCount++;
            }
        });

        simulateFileChoose($element, fakeFile);
        assert.equal(onUploadStartedCount, 1, 'action is fired');
    });

    QUnit.test('the \'onUploadAborted\' action', function(assert) {
        let onUploadAbortedCount = 0;
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            allowCanceling: true,
            onUploadAborted: function(e) {
                onUploadAbortedCount++;
            }
        });

        simulateFileChoose($element, fakeFile);
        $element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
        assert.equal(onUploadAbortedCount, 1, 'action is fired');
    });

    QUnit.test('onUploadStarted event should contain request which is instance of XMLHttpRequest', function(assert) {
        assert.expect(1);

        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploadStarted: function(e) {
                assert.ok(e.request instanceof XMLHttpRequest, 'request is correct');
            }
        });

        simulateFileChoose($element, fakeFile);
    });

    QUnit.test('onUploaded event should contain request which is instance of XMLHttpRequest', function(assert) {
        assert.expect(1);

        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploaded: function(e) {
                assert.ok(e.request instanceof XMLHttpRequest, 'request is correct');
            }
        });

        simulateFileChoose($element, fakeFile);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
    });

    QUnit.test('onProgress event should contain request which is instance of XMLHttpRequest', function(assert) {
        assert.expect(2);

        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onProgress: function(e) {
                assert.ok(e.request instanceof XMLHttpRequest, 'request is correct');
            }
        });

        simulateFileChoose($element, fakeFile);
        this.clock.tick(this.xhrMock.PROGRESS_INTERVAL);
    });

    QUnit.test('onUploadError event should contain request which is instance of XMLHttpRequest', function(assert) {
        assert.expect(1);

        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploadError: function(e) {
                assert.ok(e.request instanceof XMLHttpRequest, 'request is correct');
            }
        });

        simulateFileChoose($element, fakeFile);
        this.xhrMock.setStatus(400);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
    });

    QUnit.test('onUploadAborted event should contain request which is instance of XMLHttpRequest', function(assert) {
        assert.expect(1);

        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploadAborted: function(e) {
                assert.ok(e.request instanceof XMLHttpRequest, 'request is correct');
            }
        });

        simulateFileChoose($element, fakeFile);
        $element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
    });

    QUnit.test('onBeforeSend event should contain request which is instance of XMLHttpRequest', function(assert) {
        assert.expect(1);

        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onBeforeSend: function(e) {
                assert.ok(e.request instanceof XMLHttpRequest, 'request is correct');
            }
        });

        simulateFileChoose($element, fakeFile);
    });

    QUnit.test('onBeforeSend event should be able to set properties of XMLHttpRequest', function(assert) {
        assert.expect(2);

        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onBeforeSend: function(e) {
                e.request.withCredentials = true;
                e.request.customXhrField = 'Some string';
            },
            onUploadStarted: function(e) {
                assert.ok(e.request.withCredentials, 'withCredentials is correct');
                assert.strictEqual(e.request.customXhrField, 'Some string', 'other custom field is correct');
            }
        });

        simulateFileChoose($element, fakeFile);
    });

    QUnit.test('onBeforeSend event should rise before upload started', function(assert) {
        const onUploadStartedSpy = sinon.spy();
        assert.expect(1);

        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onBeforeSend: function(e) {
                assert.ok(onUploadStartedSpy.notCalled, 'upload is not started');
            },
            onUploadStarted: onUploadStartedSpy
        });

        simulateFileChoose($element, fakeFile);
    });

    QUnit.test('onFilesUploaded event should rise when all files are successfully uploaded', function(assert) {
        const chunkSize = 1000;
        const onUploadedSpy = sinon.spy();
        const onUploadCompletedSpy = sinon.spy();

        const $element = $('#fileuploader').dxFileUploader({
            chunkSize,
            uploadMode: 'instantly',
            multiple: true,
            onFilesUploaded: onUploadCompletedSpy,
            onUploaded: onUploadedSpy
        });

        const file1 = createBlobFile('file 1', chunkSize);
        const file2 = createBlobFile('file 2', chunkSize * 2);
        simulateFileChoose($element, [file1, file2]);

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

        assert.ok(onUploadedSpy.calledOnce, 'file 1 uploaded');
        assert.ok(onUploadCompletedSpy.notCalled, 'onUploadCompletedSpy was not called');

        onUploadedSpy.reset();
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);


        assert.ok(onUploadedSpy.calledOnce, 'file 2 uploaded');
        assert.ok(onUploadCompletedSpy.calledOnce, 'onUploadCompletedSpy was called in right time');
    });

    QUnit.test('onFilesUploaded event should rise when files are both successfully uploaded and aborted', function(assert) {
        const chunkSize = 1000;
        const onUploadAbortedSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const onUploadCompletedSpy = sinon.spy();

        const $element = $('#fileuploader').dxFileUploader({
            chunkSize,
            uploadMode: 'instantly',
            multiple: true,
            onFilesUploaded: onUploadCompletedSpy,
            onUploadAborted: onUploadAbortedSpy,
            onUploaded: onUploadedSpy
        });

        const file1 = createBlobFile('file 1', chunkSize);
        const file2 = createBlobFile('file 2', chunkSize * 2);
        simulateFileChoose($element, [file1, file2]);

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

        assert.ok(onUploadedSpy.calledOnce, 'file 1 was uploaded');
        assert.ok(onUploadAbortedSpy.notCalled, 'none files was aborted');
        assert.ok(onUploadCompletedSpy.notCalled, 'onUploadCompletedSpy was not called');

        onUploadedSpy.reset();
        $element.dxFileUploader('instance').abortUpload();
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT * 2);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);


        assert.ok(onUploadedSpy.notCalled, 'none files was uploaded');
        assert.ok(onUploadAbortedSpy.calledOnce, 'file 2 was aborted');
        assert.ok(onUploadCompletedSpy.calledOnce, 'onUploadCompletedSpy was called in right time');
    });

    QUnit.test('onFilesUploaded event should rise when files are both successfully uploaded and has error', function(assert) {
        const chunkSize = 1000;
        const uploadChunkSpy = sinon.spy((file, uploadInfo) => executeAfterDelay(() => {
            if(file.name === 'file 2' && uploadInfo.chunkIndex === 1) {
                throw 'Some error.';
            }
        }, this.xhrMock.LOAD_TIMEOUT));
        const onUploadErrorSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const onUploadCompletedSpy = sinon.spy();

        const $element = $('#fileuploader').dxFileUploader({
            chunkSize,
            uploadMode: 'instantly',
            uploadChunk: uploadChunkSpy,
            multiple: true,
            onFilesUploaded: onUploadCompletedSpy,
            onUploadError: onUploadErrorSpy,
            onUploaded: onUploadedSpy
        });

        const file1 = createBlobFile('file 1', chunkSize);
        const file2 = createBlobFile('file 2', chunkSize * 2);
        simulateFileChoose($element, [file1, file2]);

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

        assert.ok(onUploadedSpy.calledOnce, 'file 1 was uploaded');
        assert.ok(onUploadErrorSpy.notCalled, 'none files has error');
        assert.ok(onUploadCompletedSpy.notCalled, 'onUploadCompletedSpy was not called');

        onUploadedSpy.reset();
        this.clock.tick(1000);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);


        assert.ok(onUploadedSpy.notCalled, 'none files was uploaded');
        assert.ok(onUploadErrorSpy.calledOnce, 'file 2 has error');
        assert.ok(onUploadCompletedSpy.calledOnce, 'onUploadCompletedSpy was called in right time');
    });

    QUnit.test('onFilesUploaded event should rise when files are both successfully uploaded and invalid', function(assert) {
        const chunkSize = 1000;
        const onUploadedSpy = sinon.spy();
        const onUploadCompletedSpy = sinon.spy();

        const $element = $('#fileuploader').dxFileUploader({
            chunkSize,
            uploadMode: 'instantly',
            multiple: true,
            maxFileSize: chunkSize,
            onFilesUploaded: onUploadCompletedSpy,
            onUploaded: onUploadedSpy
        });

        const file1 = createBlobFile('file 1', chunkSize);
        const file2 = createBlobFile('file 2', chunkSize * 2);
        simulateFileChoose($element, [file1, file2]);

        assert.equal($element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS).not('.' + FILEUPLOADER_INVALID_CLASS).length, 1, 'One files is valid');
        assert.equal($element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + '.' + FILEUPLOADER_INVALID_CLASS).length, 1, 'One file is invalid');

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

        assert.ok(onUploadedSpy.calledOnce, 'file 1 was uploaded');
        assert.ok(onUploadCompletedSpy.calledOnce, 'onUploadCompletedSpy was called in right time');

        onUploadedSpy.reset();
        onUploadCompletedSpy.reset();
        this.clock.tick(1000);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);


        assert.ok(onUploadedSpy.notCalled, 'none files was uploaded');
        assert.ok(onUploadCompletedSpy.notCalled, 'onUploadCompletedSpy was not called again');
    });

    QUnit.test('onFilesUploaded event should rise when files are all successfully uploaded, invalid and has error', function(assert) {
        const chunkSize = 1000;
        const uploadChunkSpy = sinon.spy((file, uploadInfo) => executeAfterDelay(() => {
            if(file.name === 'file 2' && uploadInfo.chunkIndex === 1) {
                throw 'Some error.';
            }
        }, this.xhrMock.LOAD_TIMEOUT));
        const onUploadErrorSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const onUploadCompletedSpy = sinon.spy();

        const $element = $('#fileuploader').dxFileUploader({
            chunkSize,
            uploadMode: 'instantly',
            uploadChunk: uploadChunkSpy,
            multiple: true,
            maxFileSize: chunkSize * 2,
            onFilesUploaded: onUploadCompletedSpy,
            onUploadError: onUploadErrorSpy,
            onUploaded: onUploadedSpy
        });

        const file1 = createBlobFile('file 1', chunkSize);
        const file2 = createBlobFile('file 2', chunkSize * 2);
        const file3 = createBlobFile('file 3', chunkSize * 3);
        simulateFileChoose($element, [file1, file2, file3]);

        assert.equal($element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS).not('.' + FILEUPLOADER_INVALID_CLASS).length, 2, 'Two files are valid');
        assert.equal($element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + '.' + FILEUPLOADER_INVALID_CLASS).length, 1, 'One file is invalid');

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

        assert.ok(onUploadedSpy.calledOnce, 'file 1 was uploaded');
        assert.ok(onUploadErrorSpy.notCalled, 'none files has error');
        assert.ok(onUploadCompletedSpy.notCalled, 'onUploadCompletedSpy was not called');

        onUploadedSpy.reset();
        this.clock.tick(1000);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);


        assert.ok(onUploadedSpy.notCalled, 'none files was uploaded');
        assert.ok(onUploadErrorSpy.calledOnce, 'file 2 has error');
        assert.ok(onUploadCompletedSpy.calledOnce, 'onUploadCompletedSpy was called in right time');
    });

    QUnit.test('File message can be changed on onUploaded event', function(assert) {
        const customMessage = 'Custom uploaded message';
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploaded: e => e.message = customMessage
        });

        simulateFileChoose($element, [fakeFile]);

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

        const $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS);
        assert.strictEqual($fileStatusMessage.text(), customMessage, 'message was applied');
    });

    QUnit.test('File message can be changed on onUploadAborted event', function(assert) {
        const customMessage = 'Custom upload aborted message';
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploadAborted: e => e.message = customMessage
        });

        simulateFileChoose($element, [fakeFile]);

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);

        $element.dxFileUploader('instance').abortUpload();

        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

        const $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS);
        assert.strictEqual($fileStatusMessage.text(), customMessage, 'message was applied');
    });

    QUnit.test('File message can be changed on onUploadError event', function(assert) {
        const customMessage = 'Custom upload error message';
        const $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            uploadFile: () => { throw customMessage; },
            onUploadError: e => e.message = e.error
        });

        simulateFileChoose($element, [fakeFile]);

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);

        $element.dxFileUploader('instance').abortUpload();

        this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

        const $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS);
        assert.strictEqual($fileStatusMessage.text(), customMessage, 'message was applied');
    });

});

QUnit.module('keyboard navigation', moduleConfig, () => {
    QUnit.test('upload button should be focus target of fileUploader', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            focusStateEnabled: true
        });
        assert.equal($fileUploader.attr('tabindex'), undefined, 'element has not tabindex');

        const $uploadButton = $fileUploader.find('.' + FILEUPLOADER_BUTTON_CLASS);
        const uploadButton = $uploadButton.dxButton('instance');

        assert.equal(uploadButton.option('focusStateEnabled'), false, 'button has not self keyboard handlers');
        assert.equal($uploadButton.attr('tabindex'), 0, 'button has tabindex');

        const stub = sinon.stub();
        const keyboard = keyboardMock($uploadButton);
        uploadButton.option('onClick', stub);
        keyboard.keyDown('enter');

        assert.ok(stub.calledOnce, 'click is called on select button');
    });

    QUnit.test('T328503 - \'enter\' press on select button should lead to input click', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'keyboard is not supported for not generic devices');
            return;
        }

        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            focusStateEnabled: true,
            useNativeInputClick: false
        });
        const $selectButton = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS + ' .' + FILEUPLOADER_BUTTON_CLASS);
        const keyboard = keyboardMock($selectButton);
        const $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);
        const stub = sinon.stub();

        $input.on('click', stub);
        $selectButton.trigger('focusin');
        keyboard.keyDown('enter');

        this.clock.tick();

        assert.ok(stub.calledOnce, 'press on select button leads to input click');
    });

    QUnit.test('Propagation of the native input click should be stopped (T404422)', function(assert) {
        assert.expect(1);

        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            useNativeInputClick: false
        });
        const $selectButton = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS + ' .' + FILEUPLOADER_BUTTON_CLASS);
        const $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

        $input.on('click', function(e) {
            assert.ok(e.isPropagationStopped(), 'propagation was stopped');
        });

        $selectButton.trigger('click');
    });
});

QUnit.module('Drag and drop', moduleConfig, () => {
    QUnit.test('T328503 - drag and drop events should be prevented if native drop is not supported', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            nativeDropSupported: false,
            uploadMode: 'useButtons'
        });
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);
        const dragAndDropSpy = sinon.spy();
        const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
        const dropEvent = $.Event($.Event('drop', {
            dataTransfer: { files: [fakeFile] }
        }));
        const dragOverEvent = $.Event($.Event('dragover', {
            dataTransfer: { files: [fakeFile] }
        }));
        const eventsCount = events.length;

        assert.expect(eventsCount);

        $inputWrapper.on(events.join(' '), dragAndDropSpy);

        for(let i = 0; i < eventsCount; i++) {
            let event = events[i];

            if(event === 'drop') {
                event = dropEvent;
            } else if(event === 'dragover') {
                event = dragOverEvent;
            }

            $inputWrapper.trigger(event);
            assert.ok(dragAndDropSpy.args[i][0].isDefaultPrevented(), 'default is prevented for ' + events[i]);
        }
    });

    QUnit.test('T328503 - drag and drop events should not be prevented if native drop is supported', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            nativeDropSupported: true,
            uploadMode: 'useForm'
        });
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);
        const dragAndDropSpy = sinon.spy();
        const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
        const eventsCount = events.length;
        const dragOverEvent = $.Event($.Event('dragover', {
            dataTransfer: { files: [fakeFile] }
        }));

        assert.expect(eventsCount);

        $inputWrapper.on(events.join(' '), dragAndDropSpy);

        for(let i = 0; i < eventsCount; i++) {
            let event = events[i];
            if(event === 'dragover') {
                event = dragOverEvent;
            }
            $inputWrapper.trigger(event);
            assert.ok(!dragAndDropSpy.args[i][0].isDefaultPrevented(), 'default is not prevented for ' + events[i]);
        }
    });

    QUnit.test('T328503 - files drag and drop should lead to value change if form is not used', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            multiple: true
        });
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);
        const files = [fakeFile, fakeFile1];
        const event = $.Event($.Event('drop', { dataTransfer: { files: files } }));

        $inputWrapper.trigger(event);
        assert.deepEqual($fileUploader.dxFileUploader('option', 'value'), files, 'files are correct');
    });

    QUnit.test('T328503 - drop field should be visible, but default text is empty if upload mode is useForm and native drop is not supported', function(assert) {
        // behavior changed beacause of T936087
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm',
            nativeDropSupported: false
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');
        const $inputContainer = $fileUploader.find('.' + FILEUPLOADER_INPUT_CONTAINER_CLASS);
        const $inputLabel = $inputContainer.find('.' + FILEUPLOADER_INPUT_LABEL_CLASS);

        assert.ok($inputContainer.is(':visible'), 'input container is visible');
        assert.strictEqual($inputLabel.text(), '', 'label has empty line text');
        assert.strictEqual(fileUploader.option('labelText'), '', 'labelText option has empty line text');
    });

    QUnit.test('T370412 - it is impossible to drop some files if the \'multiple\' option is false', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            useDragOver: true
        });
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);
        const files = [fakeFile, fakeFile1];
        const event = $.Event($.Event('drop', { dataTransfer: { files: files } }));

        $inputWrapper.trigger(event);
        assert.deepEqual($fileUploader.dxFileUploader('option', 'value'), [], 'dragged files count is correct');
    });

    QUnit.test('the \'accept\' option should not be ignored on drag&drop (T384800)', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            accept: 'text/*'
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);
        const files = [fakeFile];
        const event = $.Event($.Event('drop', { dataTransfer: { files: files } }));

        $inputWrapper.trigger(event);
        assert.deepEqual(fileUploader.option('value'), [], 'value is empty');
    });

    QUnit.test('the \'accept\' option is case insensitive (T570224)', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            useDragOver: true,
            accept: '.jpg'
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);
        let files = [{
            name: 'fakefile.JPG',
        }];
        let event = $.Event($.Event('drop', { dataTransfer: { files: files } }));

        $inputWrapper.trigger(event);
        assert.deepEqual(fileUploader.option('value'), files, 'file is chosen');

        files = [{
            name: 'fakefile.JPG',
            type: 'IMAGE/JPEG'
        }],
        fileUploader.option('accept', 'image/*');
        event = $.Event($.Event('drop', { dataTransfer: { files: files } }));
        $inputWrapper.trigger(event);
        assert.deepEqual(fileUploader.option('value'), files, 'file is chosen');
    });

    QUnit.test('the \'accept\' option check an extension only at the end of the file (T570224)', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            useDragOver: true,
            accept: '.jpg'
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);
        const files = [{
            name: 'fakefile.jpg.bak',
            type: 'image/text',
        }];
        const event = $.Event($.Event('drop', { dataTransfer: { files: files } }));

        $inputWrapper.trigger(event);
        assert.deepEqual(fileUploader.option('value'), [], 'value is empty');
    });

    QUnit.test('the \'accept\' option with multiple types should work correctly on drag&drop', function(assert) {
        const fakeFile2 = {
            name: 'fakefile2',
            size: 2048,
            type: 'text/plain',
            lastModifiedDate: $.now()
        };

        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            useDragOver: true,
            accept: 'text/*,image/png'
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);

        const triggerDrop = function(targetFiles) {
            const event = $.Event($.Event('drop', { dataTransfer: { files: targetFiles } }));
            $inputWrapper.trigger(event);
        };

        let files = [fakeFile2];
        triggerDrop(files);
        assert.deepEqual(fileUploader.option('value'), files, 'file of allowed type is chosen');

        files = [fakeFile];
        triggerDrop(files);
        assert.deepEqual(fileUploader.option('value'), files, 'file of another allowed type is chosen');

        files = [fakeFile1];
        triggerDrop(files);
        assert.deepEqual(fileUploader.option('value'), [], 'file of other type is not chosen');
    });

    QUnit.test('error should not be thrown for the \'*\' accept (T386887)', function(assert) {
        assert.expect(0);

        const $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            accept: '*'
        });
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);

        $inputWrapper.trigger($.Event($.Event('drop', {
            dataTransfer: { files: [fakeFile] }
        })));
    });

    QUnit.test('file should be added for the \'.jpg\' accept (T386887)', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            uploadMode: 'instantly',
            accept: '.txt',
            multiple: true
        });
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);

        const firstFile = $.extend({}, fakeFile, {
            name: 'firstFile.txt',
            type: 'text/plain'
        });
        const secondFile = $.extend({}, fakeFile, {
            name: 'secondFile',
            type: 'text/plain'
        });

        $inputWrapper.trigger($.Event($.Event('drop', {
            dataTransfer: { files: [firstFile, secondFile] }
        })));

        assert.equal($fileUploader.dxFileUploader('option', 'value').length, 1, 'files count is correct');
        assert.equal($fileUploader.dxFileUploader('option', 'value[0]').name, firstFile.name, 'added file is correct');
    });

    QUnit.test('dropZoneEnter and dropZoneLeave events should fire once on correspondent interactions in a custom drop zone', function(assert) {
        const customDropZone = $('<div>').addClass('drop').appendTo('#qunit-fixture');
        const dropZoneChild = $('<div>').appendTo(customDropZone);
        const onDropZoneEnterSpy = sinon.spy();
        const onDropZoneLeaveSpy = sinon.spy();
        $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            dropZone: '.drop',
            onDropZoneEnter: onDropZoneEnterSpy,
            onDropZoneLeave: onDropZoneLeaveSpy
        });

        customDropZone.trigger('dragenter');
        assert.ok(onDropZoneEnterSpy.calledOnce, 'dropZoneEnter called once');
        assert.strictEqual(onDropZoneEnterSpy.args[0][0].dropZoneElement, customDropZone[0], 'dropZone argument is correct');

        dropZoneChild.trigger('dragenter');
        assert.ok(onDropZoneEnterSpy.calledOnce, 'dropZoneEnter not called');
        assert.strictEqual(onDropZoneEnterSpy.args[1], undefined, 'dropZoneEnter not called');

        dropZoneChild.trigger('dragleave');
        assert.ok(onDropZoneLeaveSpy.notCalled, 'dropZoneLeave not called');
        assert.strictEqual(onDropZoneLeaveSpy.args[0], undefined, 'dropZoneLeave not called');

        customDropZone.trigger('dragleave');
        assert.ok(onDropZoneLeaveSpy.calledOnce, 'dropZoneLeave called once');
        assert.strictEqual(onDropZoneLeaveSpy.args[0][0].dropZoneElement, customDropZone[0], 'dropZone argument is correct');

        customDropZone.remove();
    });

    QUnit.test('dropZoneEnter and dropZoneLeave events should fire once on correspondent interactions in the deafult drop zone', function(assert) {
        const onDropZoneEnterSpy = sinon.spy();
        const onDropZoneLeaveSpy = sinon.spy();
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            onDropZoneEnter: onDropZoneEnterSpy,
            onDropZoneLeave: onDropZoneLeaveSpy
        });
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);

        $inputWrapper.trigger('dragenter');
        assert.ok(onDropZoneEnterSpy.calledOnce, 'dropZoneEnter called once');
        assert.strictEqual(onDropZoneEnterSpy.args[0][0].dropZoneElement, $inputWrapper[0], 'dropZone argument is correct');

        $inputWrapper.trigger('dragenter');
        assert.ok(onDropZoneEnterSpy.calledOnce, 'dropZoneEnter not called');
        assert.strictEqual(onDropZoneEnterSpy.args[1], undefined, 'dropZoneEnter not called');

        $inputWrapper.trigger('dragleave');
        assert.ok(onDropZoneLeaveSpy.calledOnce, 'dropZoneLeave called once');
        assert.strictEqual(onDropZoneLeaveSpy.args[0][0].dropZoneElement, $inputWrapper[0], 'dropZone argument is correct');

    });

    QUnit.test('Custom label text must be shown anyway, enven if upload mode is useForm and native drop is not supported (T936087)', function(assert) {
        const customLabelText = 'custom label text';
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm',
            nativeDropSupported: false,
            labelText: customLabelText
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');
        const $inputContainer = $fileUploader.find('.' + FILEUPLOADER_INPUT_CONTAINER_CLASS);
        const $inputLabel = $inputContainer.find('.' + FILEUPLOADER_INPUT_LABEL_CLASS);

        assert.ok($inputContainer.is(':visible'), 'input container is visible');
        assert.strictEqual($inputLabel.text(), customLabelText, 'label has custom text');
        assert.strictEqual(fileUploader.option('labelText'), customLabelText, 'labelText option has custom text');
    });

    QUnit.test('Default label text must be shown if upload mode is useForm and native drop is supported (T936087)', function(assert) {
        const defaultLabelText = 'or Drop file here';
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm',
            nativeDropSupported: true
        });
        const fileUploader = $fileUploader.dxFileUploader('instance');
        const $inputContainer = $fileUploader.find('.' + FILEUPLOADER_INPUT_CONTAINER_CLASS);
        const $inputLabel = $inputContainer.find('.' + FILEUPLOADER_INPUT_LABEL_CLASS);

        assert.ok($inputContainer.is(':visible'), 'input container is visible');
        assert.strictEqual($inputLabel.text(), defaultLabelText, 'label has default text');
        assert.strictEqual(fileUploader.option('labelText'), defaultLabelText, 'labelText option has default text');
    });
});

QUnit.module('files selection', moduleConfig, () => {
    QUnit.test('T328503 - input is in input container if you should not use native input click', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            nativeDropSupported: true,
            useNativeInputClick: false
        });
        const $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CONTAINER_CLASS + ' .' + FILEUPLOADER_INPUT_CLASS);

        assert.equal($input.length, 1, 'input is in input container');
    });

    QUnit.test('T328503 - input is in select button if you should use native input click', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm',
            nativeDropSupported: true,
            useNativeInputClick: false
        });
        const $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS + '.' + FILEUPLOADER_BUTTON_CLASS + ' .' + FILEUPLOADER_INPUT_CLASS);

        assert.equal($input.length, 0, 'input is in select button');
    });

    QUnit.test('T323019 - click on the \'Drop\' field should not lead to file choosing', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            useNativeInputClick: false
        });
        const $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);
        let event;

        $input.on('click', function(e) {
            event = e;
        });

        $input.trigger('click');
        assert.ok(event.isDefaultPrevented(), 'input click is prevented');
    });

    QUnit.test('T346021 - upload is not started after file drop if the \'uploadMode\' is \'instantly\'', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            useDragOver: true,
            useNativeInputClick: false
        });
        const event = $.Event('drop', {
            originalEvent: $.Event('drop', { dataTransfer: { files: [fakeFile] } })
        });

        $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS).trigger(event);
        const request = this.xhrMock.getInstanceAt();

        assert.ok(!!request, 'xhr is created');
        assert.ok(request && request.uploadStarted, 'upload is started');
    });

    QUnit.test('file list should not be extended if the \'multiple\' option is false', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false
        });

        simulateFileChoose($fileUploader, fakeFile);
        simulateFileChoose($fileUploader, fakeFile1);

        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CLASS).length, 1, 'only one file is in list');
    });
});

QUnit.module('disabled option', () => {
    QUnit.test('file input should be hidden when widget is disabled', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            disabled: false,
            useNativeInputClick: false,
            useDragOver: true,
            uploadMode: 'useButtons'
        });
        const $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

        assert.equal($fileInput.css('display'), 'inline-block', 'input is visible');

        $fileUploader.dxFileUploader('option', 'disabled', true);
        assert.equal($fileInput.css('display'), 'none', 'input is hidden');
    });
});

QUnit.module('readOnly option', moduleConfig, () => {
    QUnit.test('file input container should be shown but text empty', function(assert) {
        // behavior changed beacause of T936087
        const defaultLabelText = 'or Drop file here';
        const $fileUploader = $('#fileuploader').dxFileUploader({
            readOnly: false,
            useDragOver: true,
            uploadMode: 'useButtons'
        });
        const $inputContainer = $fileUploader.find('.' + FILEUPLOADER_INPUT_CONTAINER_CLASS);
        const $inputLabel = $inputContainer.find('.' + FILEUPLOADER_INPUT_LABEL_CLASS);

        assert.ok($inputContainer.is(':visible'), 'input container is visible');
        assert.strictEqual($inputLabel.text(), defaultLabelText, 'label has default text');

        $fileUploader.dxFileUploader('option', 'readOnly', true);
        assert.ok($inputContainer.is(':visible'), 'input container is visible');
        assert.strictEqual($inputLabel.text(), '', 'label has empty line text');

        $fileUploader.dxFileUploader('option', 'readOnly', false);
        assert.ok($inputContainer.is(':visible'), 'input container is visible');
        assert.strictEqual($inputLabel.text(), defaultLabelText, 'label has default text');
    });

    QUnit.test('select button should be disabled', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            readOnly: true,
            uploadMode: 'useButtons'
        });
        const $selectButton = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS).children('.' + FILEUPLOADER_BUTTON_CLASS);

        assert.ok($selectButton.hasClass('dx-state-disabled'), 'button is disabled');
    });

    QUnit.test('file cancel buttons should be disabled', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            readOnly: true,
            uploadMode: 'useButtons'
        });
        simulateFileChoose($fileUploader, [fakeFile, fakeFile1]);

        const $cancelButtons = $fileUploader.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS);

        assert.strictEqual($cancelButtons.length, 2, 'there are 2 cancel buttons');
        assert.ok($cancelButtons.eq(0).hasClass('dx-state-disabled'), '1st button is disabled');
        assert.ok($cancelButtons.eq(1).hasClass('dx-state-disabled'), '2nd button is disabled');
    });

    QUnit.test('dialogTrigger should be unable to call _selectButtonClickHandler', function(assert) {
        const instance = $('#fileuploader').dxFileUploader({
            readOnly: true,
            uploadMode: 'useButtons'
        }).dxFileUploader('instance');
        sinon.stub(instance, '_selectButtonClickHandler', () => instance._selectFileDialogHandler());

        instance._selectButtonClickHandler();
        assert.strictEqual(instance._selectButtonClickHandler.returnValues[0], false, 'selectFile method not called');

        instance._selectButtonClickHandler.restore();
    });

    QUnit.test('uploading events can be fired (successful upload)', function(assert) {
        const onProgressSpy = sinon.spy();
        const onUploadAbortedSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const onUploadErrorSpy = sinon.spy();
        const onUploadStartedSpy = sinon.spy();
        const onValueChangedSpy = sinon.spy();

        const $fileUploader = $('#fileuploader').dxFileUploader({
            readOnly: true,
            multiple: true,
            uploadMode: 'instantly',
            chunkSize: 200,
            onProgress: onProgressSpy,
            onUploadAborted: onUploadAbortedSpy,
            onUploaded: onUploadedSpy,
            onUploadError: onUploadErrorSpy,
            onUploadStarted: onUploadStartedSpy,
            onValueChanged: onValueChangedSpy
        });

        const file1 = createBlobFile('image1.png', 150);
        simulateFileChoose($fileUploader, [file1]);

        this.clock.tick(1500);
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event called for 1st chunk');
        assert.strictEqual(onUploadAbortedSpy.callCount, 0, 'upload aborted event not raised');
        assert.strictEqual(onUploadedSpy.callCount, 1, 'uploaded event raised');

        assert.strictEqual(onUploadErrorSpy.callCount, 0, 'upload error event not raised');
        assert.strictEqual(onUploadStartedSpy.callCount, 1, 'upload started event raised');
        assert.strictEqual(onValueChangedSpy.callCount, 1, 'value changed event raised');
    });

    QUnit.test('uploading events can be fired (feature - onUploadAborted)', function(assert) {
        const uploadChunkSpy = sinon.spy(() => executeAfterDelay());
        const abortUploadSpy = sinon.spy(() => executeAfterDelay());
        const onProgressSpy = sinon.spy();
        const onUploadAbortedSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const onUploadErrorSpy = sinon.spy();
        const onUploadStartedSpy = sinon.spy();
        const onValueChangedSpy = sinon.spy();

        const $fileUploader = $('#fileuploader').dxFileUploader({
            readOnly: true,
            multiple: true,
            uploadMode: 'instantly',
            chunkSize: 200,
            abortUpload: abortUploadSpy,
            uploadChunk: uploadChunkSpy,
            onProgress: onProgressSpy,
            onUploadAborted: onUploadAbortedSpy,
            onUploaded: onUploadedSpy,
            onUploadError: onUploadErrorSpy,
            onUploadStarted: onUploadStartedSpy,
            onValueChanged: onValueChangedSpy
        });
        const file = createBlobFile('image1.png', 250);
        simulateFileChoose($fileUploader, [file]);

        this.clock.tick(1500);
        assert.strictEqual(onProgressSpy.callCount, 1, 'progress event called for 1st chunk');
        assert.strictEqual(onUploadAbortedSpy.callCount, 0, 'upload aborted event is not raised');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised');

        assert.strictEqual(onUploadErrorSpy.callCount, 0, 'upload error event is not raised');
        assert.strictEqual(onUploadStartedSpy.callCount, 1, 'upload started event raised');
        assert.strictEqual(onValueChangedSpy.callCount, 1, 'value changed event raised');

        $fileUploader.find(`.${FILEUPLOADER_CANCEL_BUTTON_CLASS}`).eq(0).trigger('dxclick');

        this.clock.tick(1500);
        assert.strictEqual(onProgressSpy.callCount, 2, 'progress event is called for 2nd chunk');
        assert.strictEqual(onUploadAbortedSpy.callCount, 0, 'upload aborted event not raised');
        assert.strictEqual(onUploadedSpy.callCount, 1, 'uploaded event raised');

        assert.strictEqual(onUploadErrorSpy.callCount, 0, 'upload error event is not raised');
        assert.strictEqual(onUploadStartedSpy.callCount, 1, 'upload started event raised');
        assert.strictEqual(onValueChangedSpy.callCount, 1, 'value changed event not raised');
    });

    QUnit.test('uploading events can be fired (feature - onUploadError)', function(assert) {
        const uploadFileSpy = sinon.spy(() => executeAfterDelay(() => {
            throw 'Some error.';
        }));
        const onProgressSpy = sinon.spy();
        const onUploadAbortedSpy = sinon.spy();
        const onUploadedSpy = sinon.spy();
        const onUploadErrorSpy = sinon.spy();
        const onUploadStartedSpy = sinon.spy();
        const onValueChangedSpy = sinon.spy();

        const $fileUploader = $('#fileuploader').dxFileUploader({
            readOnly: true,
            multiple: true,
            uploadMode: 'instantly',
            uploadFile: uploadFileSpy,
            onProgress: onProgressSpy,
            onUploadAborted: onUploadAbortedSpy,
            onUploaded: onUploadedSpy,
            onUploadError: onUploadErrorSpy,
            onUploadStarted: onUploadStartedSpy,
            onValueChanged: onValueChangedSpy
        });

        const file1 = createBlobFile('image1.png', 150);
        simulateFileChoose($fileUploader, [file1]);

        this.clock.tick(1500);
        assert.strictEqual(onProgressSpy.callCount, 0, 'progress event not called');
        assert.strictEqual(onUploadAbortedSpy.callCount, 0, 'upload aborted event not raised');
        assert.strictEqual(onUploadedSpy.callCount, 0, 'uploaded event is not raised after error');

        assert.strictEqual(onUploadErrorSpy.callCount, 1, 'upload error event raised');
        assert.strictEqual(onUploadStartedSpy.callCount, 1, 'upload started event raised');
        assert.strictEqual(onValueChangedSpy.callCount, 1, 'value changed event raised');
    });

    QUnit.test('it is impossible to drop files', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            readOnly: true,
            useDragOver: true
        });
        const $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);
        const files = [fakeFile];
        const event = $.Event($.Event('drop', { dataTransfer: { files: files } }));

        $inputWrapper.trigger(event);
        assert.deepEqual($fileUploader.dxFileUploader('option', 'value'), [], 'dragged files count is correct');
    });

    QUnit.test('drag event should not be handled', function(assert) {
        const $fileUploader = $('#fileuploader').dxFileUploader({
            readOnly: true,
            useDragOver: true,
            uploadMode: 'instantly'
        });

        $fileUploader.find('.dx-fileuploader-input-wrapper').trigger('dragenter');
        assert.notOk($fileUploader.hasClass('dx-fileuploader-dragover'), 'drag event was not handled for input wrapper element');
    });

});


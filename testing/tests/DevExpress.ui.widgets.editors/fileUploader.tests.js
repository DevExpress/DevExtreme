var $ = require('jquery'),
    FileUploader = require('ui/file_uploader'),
    devices = require('core/devices'),
    keyboardMock = require('../../helpers/keyboardMock.js'),
    createBlobFile = require('../../helpers/fileHelper.js').createBlobFile;

require('../../helpers/xmlHttpRequestMock.js');

QUnit.testStart(function() {
    var markup =
        '<div id="fileuploader"></div>';

    $('#qunit-fixture').html(markup);
});

require('common.css!');

var internals = FileUploader.__internals;

var FILEUPLOADER_EMPTY_CLASS = 'dx-fileuploader-empty',

    FILEUPLOADER_CONTENT_CLASS = 'dx-fileuploader-content',
    FILEUPLOADER_INPUT_WRAPPER_CLASS = 'dx-fileuploader-input-wrapper',
    FILEUPLOADER_BUTTON_CLASS = 'dx-fileuploader-button',
    FILEUPLOADER_INPUT_CONTAINER_CLASS = 'dx-fileuploader-input-container',
    FILEUPLOADER_INPUT_CLASS = 'dx-fileuploader-input',
    FILEUPLOADER_FILES_CONTAINER_CLASS = 'dx-fileuploader-files-container',
    FILEUPLOADER_FILE_CONTAINER_CLASS = 'dx-fileuploader-file-container',

    FILEUPLOADER_FILE_CLASS = 'dx-fileuploader-file',
    FILEUPLOADER_FILE_NAME_CLASS = 'dx-fileuploader-file-name',
    FILEUPLOADER_FILE_SIZE_CLASS = 'dx-fileuploader-file-size',

    FILEUPLOADER_CANCEL_BUTTON_CLASS = 'dx-fileuploader-cancel-button',
    FILEUPLOADER_UPLOAD_BUTTON_CLASS = 'dx-fileuploader-upload-button',
    FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS = 'dx-fileuploader-file-status-message',

    FILEUPLOADER_INVALID_CLASS = 'dx-fileuploader-invalid',

    FILEUPLOADER_AFTER_LOAD_DELAY = 500;


var simulateFileChoose = function($fileUploader, files) {
    var $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

    files = $.isArray(files) ? files : [files];

    if($.isPlainObject(files[0])) {
        $input.val(files[0].name);
        $input.prop('files', files);
    } else {
        $input.val(files[0]);
    }

    $input.trigger('change');
};

var fakeFile = {
    name: 'fakefile.png',
    size: 100023,
    type: 'image/png',
    lastModifiedDate: $.now()
};
var fakeFile1 = {
    name: 'fakefile1.jpeg',
    size: 1063,
    type: 'image/jpeg',
    lastModifiedDate: $.now()
};
var fakeFile2 = {
    name: 'document.pdf',
    size: 4000,
    type: 'application/pdf',
    lastModifiedDate: $.now()
};

var getNewFile = function() {
    var randomSize = Math.round(Math.random() * 10000),
        randomId = Math.round(Math.random() * 10000);

    return {
        name: 'fakefile' + randomId,
        size: randomSize,
        type: 'image/jpeg',
        lastModifiedDate: $.now()
    };
};


var moduleConfig = {
    beforeEach: function() {
        internals.changeFileInputRenderer(function() {
            return $('<div>');
        });

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

QUnit.module('uploading by chunks', moduleConfig, function() {
    QUnit.test('fileUploader should prevent upload chunks', function(assert) {
        var isPreventedUpload = false;
        var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            chunkSize: 2000,
            onUploadAborted: function() {
                isPreventedUpload = true;
            }
        });
        simulateFileChoose($fileUploader, [createBlobFile('fake.png', 100023)]);

        var instance = $fileUploader.dxFileUploader('instance');

        this.clock.tick(this.xhrMock.LOAD_TIMEOUT_DEFAULT);
        instance.option('value', []);
        this.clock.tick(this.xhrMock.LOAD_TIMEOUT_DEFAULT);

        assert.ok(isPreventedUpload, 'file uploading is prevented');
    });
    QUnit.test('file should correctly cut and sent it', function(assert) {
        this.xhrMock.startSeries();
        var fakeContentFile = createBlobFile('fake.png', 100023);
        var index = 0;
        var loadedBytes = 0;
        var isUploaded = false;
        var $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            chunkSize: 20000,
            onProgress: function(e) {
                var progressBar = $('.dx-progressbar').dxProgressBar('instance');
                var request = this.xhrMock.getLastInstance();

                loadedBytes += request.loadedSize;
                assert.equal(e.bytesLoaded, loadedBytes, 'total loaded bytes size is correct');
                assert.equal(progressBar.option('value'), loadedBytes, 'progressBar value is correct');
                assert.equal(e.segmentSize, request.loadedSize, 'loaded segment bytes size is correct');
                assert.equal(e.component.option('progress'), Math.round(loadedBytes / fakeContentFile.size * 100), 'component progress value is correct');

                assert.ok(this.xhrMock.getInstanceAt(index), 'request ' + index + ' is created');
                index++;
            }.bind(this),
            onUploaded: function() {
                isUploaded = true;
            }
        });
        simulateFileChoose($fileUploader, [fakeContentFile]);

        var expectedCallsCount = Math.ceil(fakeContentFile.size / $($fileUploader).dxFileUploader('instance').option('chunkSize'));
        assert.equal(index, expectedCallsCount, 'count of calls onProgress event is valid');
        assert.ok(isUploaded, 'file is uploaded');
    });
    QUnit.test('onFileAborted event should be raised if canceled uploading', function(assert) {
        var isUploadAborted = false;
        var $fileUploader = $('#fileuploader').dxFileUploader({
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
        var fileUploadedCount = 0;
        var totalBytes = 0;
        var totalLoadedBytes = 0;
        var fileStates = { };

        var files = [createBlobFile('fake1.png', 100023), createBlobFile('fake2.png', 5000)];
        files.forEach(function(item) {
            totalBytes += item.size;
            fileStates[item.name] = {
                bytesLoaded: 0
            };
        });

        var $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            uploadMode: 'instantly',
            chunkSize: 20000,
            onProgress: function(e) {
                var request = this.xhrMock.getLastInstance();
                var state = fileStates[e.file.name];
                state.bytesLoaded += request.loadedSize;
                totalLoadedBytes += request.loadedSize;

                assert.equal(e.bytesLoaded, state.bytesLoaded, 'loaded bytes size is correct');
                assert.equal(e.segmentSize, request.loadedSize, 'current loaded segment bytes size is correct');
                assert.equal(e.component.option('progress'), Math.round(totalLoadedBytes / totalBytes * 100), 'component progress value is correct');
            }.bind(this),
            onUploaded: function() {
                fileUploadedCount++;
            }
        });
        simulateFileChoose($fileUploader, files);

        assert.equal(fileUploadedCount, files.length, 'Count uploaded files is correct');
        for(var i = 0; i < files.length; i++) {
            assert.equal(files[i].size, fileStates[files[i].name].bytesLoaded, 'Uploded file bytes is correct');
        }
    });
    QUnit.test('uploading multiple files should be succesed', function(assert) {
        var uploadedFiles = [];
        this.xhrMock.startSeries();
        var $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'instantly',
            chunkSize: 20000,
            onUploaded: function(e) {
                uploadedFiles.push(e.file.name);
            }
        });

        var files = [createBlobFile('fake1.png', 100023), createBlobFile('fake2.png', 5000)];
        simulateFileChoose($fileUploader, files);

        assert.equal(uploadedFiles.length, files.length, 'count uploaded files is valid');
        for(var i = 0; i < files.length; i++) {
            assert.equal(uploadedFiles[i], files[i].name, 'uploaded files is valid');
        }
    });
});

QUnit.module('validation rendering', moduleConfig, function() {
    QUnit.test('file with .pdf Extension should be rendered as invalid', function(assert) {
        var $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true,
            allowedFileExtensions: ['.jpeg', '.png']
        });
        var $filesContainer = $fileUploader.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS);
        simulateFileChoose($fileUploader, [fakeFile, fakeFile1, fakeFile2]);
        assert.equal($filesContainer.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + '.' + FILEUPLOADER_INVALID_CLASS).length, 1, 'One file is invalid');
        assert.equal($filesContainer.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS).not('.' + FILEUPLOADER_INVALID_CLASS).length, 2, 'Two files is valid');

        var invalidFileName = $filesContainer.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + '.' + FILEUPLOADER_INVALID_CLASS).find('.' + FILEUPLOADER_FILE_NAME_CLASS).text();
        assert.equal(invalidFileName, fakeFile2.name, fakeFile2.name + 'is invalid file name');
    });
    QUnit.test('file with .pdf Extension should be rendered with validation text', function(assert) {
        var $fileUploader = $('#fileuploader').dxFileUploader({
            allowedFileExtensions: ['.jpeg']
        });
        var fileUploader = $fileUploader.dxFileUploader('instance');
        simulateFileChoose($fileUploader, [fakeFile2]);

        var statusMessage = $fileUploader.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).text();
        assert.equal(statusMessage, fileUploader.option('invalidFileExtensionMessage'), 'validation text is correct');
    });
    QUnit.test('File with size more than 100 kb is invalid ', function(assert) {
        var $fileUploader = $('#fileuploader').dxFileUploader({
            maxFileSize: 100000
        });
        simulateFileChoose($fileUploader, [fakeFile]);
        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + '.' + FILEUPLOADER_INVALID_CLASS).length, 1, 'One file is invalid');
        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS).not('.' + FILEUPLOADER_INVALID_CLASS).length, 0, 'No has valid files');
    });
    QUnit.test('File with size more than 100 kb should be rendered with validation text ', function(assert) {
        var $fileUploader = $('#fileuploader').dxFileUploader({
            maxFileSize: 100000
        });
        var fileUploader = $fileUploader.dxFileUploader('instance');
        simulateFileChoose($fileUploader, [fakeFile]);

        var statusMessage = $fileUploader.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).text();
        assert.equal(statusMessage, fileUploader.option('invalidMaxFileSizeMessage'), 'validation text is correct');
    });
    QUnit.test('File with size less than 2 kb is invalid ', function(assert) {
        var $fileUploader = $('#fileuploader').dxFileUploader({
            minFileSize: 2000
        });
        simulateFileChoose($fileUploader, [fakeFile, fakeFile1]);
        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + '.' + FILEUPLOADER_INVALID_CLASS).length, 1, 'Big file is invalid');
        assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS).not('.' + FILEUPLOADER_INVALID_CLASS).length, 1, 'Small file is valid');
    });
    QUnit.test('File with size less than 2 kb should be rendered with validation text ', function(assert) {
        var $fileUploader = $('#fileuploader').dxFileUploader({
            minFileSize: 2000
        });
        var fileUploader = $fileUploader.dxFileUploader('instance');
        simulateFileChoose($fileUploader, [fakeFile1]);

        var statusMessage = $fileUploader.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).text();
        assert.equal(statusMessage, fileUploader.option('invalidMinFileSizeMessage'), 'validation text is correct');
    });
    QUnit.test('Files with size more than 4 kb and file extension not contains in allowedFileExtensions should be invalid', function(assert) {
        var $fileUploader = $('#fileuploader').dxFileUploader({
            allowedFileExtensions: ['.pdf'],
            maxFileSize: 4000
        });
        var fileUploader = $fileUploader.dxFileUploader('instance');
        simulateFileChoose($fileUploader, [fakeFile, fakeFile1, fakeFile2]);

        var bigFileWithInvalidExtStatusMessage = $($fileUploader.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).get(0)).text();
        assert.ok(bigFileWithInvalidExtStatusMessage.indexOf(fileUploader.option('invalidMaxFileSizeMessage')) > -1, 'has invalidMaxFileSizeMessage');
        assert.ok(bigFileWithInvalidExtStatusMessage.indexOf(fileUploader.option('invalidFileExtensionMessage')) > -1, 'has invalidFileExtensionMessage');

        var imageFileStatusMessage = $($fileUploader.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).get(1)).text();
        assert.equal(imageFileStatusMessage, fileUploader.option('invalidFileExtensionMessage'), 'has invalidFileExtensionMessage');

        var pdfFileStatusMessage = $($fileUploader.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).get(2)).text();
        assert.equal(pdfFileStatusMessage, fileUploader.option('readyToUploadMessage'), 'validation passed');
    });
});


QUnit.module('rendering');

QUnit.test('the \'Upload\' button should be hidden if no files are chosen', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        }),
        $uploadButton = $fileUploader.find('.' + FILEUPLOADER_CONTENT_CLASS + ' > .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

    assert.ok($uploadButton.length && !$uploadButton.is(':visible'), 'the upload button is hidden');
});


QUnit.module('files rendering', moduleConfig);

QUnit.test('selected files should be rendered in container', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true
        }),
        $filesContainer = $fileUploader.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS);

    simulateFileChoose($fileUploader, [fakeFile, fakeFile1]);
    assert.equal($filesContainer.find('.' + FILEUPLOADER_FILE_CLASS).length, 2, 'number of files is correct');
});

QUnit.test('selected files should be rendered in container, uploadMethod = useForm', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'useForm'
        }),
        $filesContainer = $fileUploader.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS);

    simulateFileChoose($fileUploader, [fakeFile, fakeFile1]);
    assert.equal($filesContainer.find('.' + FILEUPLOADER_FILE_CLASS).length, 2, 'number of files is correct');
});

QUnit.test('files should contain file name and file size', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader();

    simulateFileChoose($fileUploader, fakeFile);

    var $file = $('.' + FILEUPLOADER_FILE_CLASS);

    assert.equal($file.find('.' + FILEUPLOADER_FILE_NAME_CLASS).length, 1, 'file contains file name');
    assert.equal($file.find('.' + FILEUPLOADER_FILE_SIZE_CLASS).length, 1, 'file contains file size');
});

QUnit.test('files size should be correct', function(assert) {
    var files = [
            { name: 'first.png', size: 1 },
            { name: 'second.png', size: 1024 },
            { name: 'third.png', size: 1048576 },
            { name: 'fourth.png', size: 1073741824 }
        ],
        filesSize = [
            '1 bytes',
            '1 kb',
            '1 Mb',
            '1 Gb'
        ],
        $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true
        });

    simulateFileChoose($fileUploader, files);

    var $filesSize = $('.' + FILEUPLOADER_FILE_SIZE_CLASS);

    $.each(filesSize, function(index, fileSize) {
        assert.equal($filesSize.eq(index).text(), fileSize, 'file ' + (index + 1) + ' size is correct');
    });
});

QUnit.test('progressBar should be rendered for each file', function(assert) {
    var files = [fakeFile, fakeFile1],
        $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'instantly'
        });

    simulateFileChoose($fileUploader, files);

    var $progressBar = $fileUploader.find('.' + FILEUPLOADER_FILE_CLASS + ' .dx-progressbar');

    assert.equal($progressBar.length, files.length, 'separate progressBar is rendered for each file');
});

QUnit.test('cancel button should be rendered for each file', function(assert) {
    var files = [fakeFile, fakeFile1],
        $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'instantly'
        });

    simulateFileChoose($fileUploader, files);

    var $cancelButtons = $fileUploader.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS);

    assert.equal($cancelButtons.length, files.length, 'cancel buttons are rendered');
});

QUnit.test('list of files should be rendered depending on the \'showFileList\' option', function(assert) {
    var files = [fakeFile, fakeFile1],
        $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            showFileList: false,
            extendSelection: false
        }),
        instance = $element.dxFileUploader('instance');

    simulateFileChoose($element, files);

    assert.equal($element.find('.' + FILEUPLOADER_FILE_CLASS).length, 0, 'no files are listed');

    instance.option('showFileList', true);
    assert.equal($element.find('.' + FILEUPLOADER_FILE_CLASS).length, files.length, 'files are listed');

    instance.option('showFileList', false);
    assert.equal($element.find('.' + FILEUPLOADER_FILE_CLASS).length, 0, 'no files are listed again');
});

QUnit.test('file info width should be correct if file has long name', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            allowCanceling: true,
            uploadMode: 'useButtons',
            width: 300
        }),
        file = {
            name: 'very_very_very_very_very_very_very_very_very_long_name.png',
            size: 100023,
            type: 'image/png',
            lastModifiedDate: $.now()
        };

    simulateFileChoose($fileUploader, file);

    var $fileContainer = $fileUploader.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS),
        fileContainerWidth = $fileContainer.width(),
        $fileContainerChildren = $fileContainer.children(),
        fileContainerChildrenWidth = 0;

    for(var i = 0, n = $fileContainerChildren.length; i < n; i++) {
        fileContainerChildrenWidth += $fileContainerChildren.eq(i).width();
    }

    assert.ok(fileContainerChildrenWidth <= fileContainerWidth, 'file info width is correct');
});

QUnit.test('drag event should handle on inputWrapper element if \'useDragOver\' is true', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            uploadMode: 'instantly'
        }),
        $inputWrapper = $fileUploader.find('.dx-fileuploader-input-wrapper');

    $fileUploader.trigger('dragenter');
    assert.ok(!$fileUploader.hasClass('dx-fileuploader-dragover'), 'drag event was not handled for fileuploader element');

    $inputWrapper.trigger('dragenter');
    assert.ok($fileUploader.hasClass('dx-fileuploader-dragover'), 'drag event was handled for input wrapper element');
});

QUnit.test('\'dragover\' class should be removed on \'dragleave\' event after several \'dragenter\' events', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            uploadMode: 'instantly'
        }),
        $inputWrapper = $fileUploader.find('.dx-fileuploader-input-wrapper');

    $inputWrapper
        .trigger('dragenter')
        .trigger('dragenter')
        .trigger('dragleave');

    assert.notOk($fileUploader.hasClass('dx-fileuploader-dragover'), 'FileUploader hasn\'t the dragover class');
});

QUnit.test('T286111 - input click should not be prevented if the \'useNativeInputClick\' option is set to true', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({ uploadMode: 'useButtons', useNativeInputClick: true }),
        $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS),
        clickSpy = sinon.spy();

    $input
        .on('click', clickSpy)
        .click();

    assert.ok(clickSpy.calledOnce, 'input click event handler is called once');
    assert.ok(!clickSpy.args[0][0].isDefaultPrevented(), 'click event is not prevented');
});

QUnit.test('T286111 - input should be rendered in select button if form is used and native click should be', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm',
            useNativeInputClick: true
        }),
        $selectButton = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS).children('.' + FILEUPLOADER_BUTTON_CLASS);

    assert.equal($selectButton.find('.' + FILEUPLOADER_INPUT_CLASS).length, 1, 'input is rendered in select button');
});

QUnit.test('files count in list is correct if the \'extendSelection\' option is false', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
        extendSelection: false,
        multiple: true
    });

    simulateFileChoose($fileUploader, [fakeFile, fakeFile]);
    simulateFileChoose($fileUploader, [fakeFile, fakeFile, fakeFile]);

    assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CLASS).length, 3, 'files count is correct');
});

QUnit.test('files count in list is correct if the \'extendSelection\' option is true', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
        extendSelection: true,
        multiple: true,
        uploadMode: 'instantly'
    });

    simulateFileChoose($fileUploader, [getNewFile(), getNewFile()]);
    simulateFileChoose($fileUploader, [getNewFile(), getNewFile(), getNewFile()]);

    assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CLASS).length, 5, 'files count is correct');
});

QUnit.test('file list should be updated after choosing another file when \'multiple\' option is false (T390178)', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
        multiple: false,
        uploadMode: 'instantly'
    });

    simulateFileChoose($fileUploader, [fakeFile]);
    simulateFileChoose($fileUploader, [fakeFile1]);

    var fileName = $fileUploader.find('.' + FILEUPLOADER_FILE_NAME_CLASS).text();
    assert.equal(fileName, fakeFile1.name, 'the correct file is displayed in the file list');
    assert.notEqual(this.xhrMock.getInstanceAt(1), undefined, 'request is created');
});


QUnit.module('allowCanceling', moduleConfig);

QUnit.test('cancel buttons rendering should depend on the \'allowCanceling\' option', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
            allowCanceling: false,
            uploadMode: 'instantly'
        }),
        instance = $element.dxFileUploader('instance');

    simulateFileChoose($element, fakeFile);
    assert.ok(!$element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).is(':visible'), 'cancel button is not visible when \'allowCanceling\' is false');


    instance.option('allowCanceling', true);
    simulateFileChoose($element, fakeFile);

    assert.equal($element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).length, 1, 'cancel button is rendered when \'allowCanceling\' is true');
});

QUnit.test('the \'cancel\' button should be rendered for each file if the \'allowCanceling\' option is true', function(assert) {
    var files = [fakeFile, fakeFile1],
        $element = $('#fileuploader').dxFileUploader({
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
    var files = [fakeFile, fakeFile1],
        valueChangedCount = 0,
        $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            showFileList: true,
            allowCanceling: true,
            uploadMode: 'instantly'
        }),
        instance = $element.dxFileUploader('instance');

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
    var files = [fakeFile, fakeFile1],
        $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            showFileList: true,
            allowCanceling: true,
            uploadMode: 'useForm'
        });

    simulateFileChoose($element, files);
    assert.equal($element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).length, 0, 'no cancel buttons are rendered');
});

QUnit.test('file list should be cleared when \'useForm\' option is used', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
            multiple: true,
            uploadMode: 'useForm'
        }),
        fileUploader = $element.dxFileUploader('instance'),
        newFile = getNewFile();

    simulateFileChoose($element, [fakeFile, fakeFile1]);
    simulateFileChoose($element, [newFile]);

    assert.deepEqual(fileUploader.option('value'), [newFile], 'file list was cleared');
});


QUnit.module('autoUpload', moduleConfig);

QUnit.test('\'upload\' button should be rendered depending on the \'uploadMode\' option', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        }),
        instance = $fileUploader.dxFileUploader('instance');

    assert.equal($fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 1, '\'upload\' button is rendered');

    instance.option('uploadMode', 'instantly');
    assert.equal($fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 0, '\'upload\' button is not rendered');

    instance.option('uploadMode', 'useButtons');
    assert.equal($fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 1, '\'upload\' button is rendered again');
});

QUnit.test('upload buttons should be rendered if the \'uploadMode\' option is \'useButtons\'', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
        uploadMode: 'useButtons'
    });
    var files = [fakeFile, fakeFile1];
    simulateFileChoose($element, files);

    var $commonUploadButton = $element.find('.' + FILEUPLOADER_CONTENT_CLASS + ' > .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);
    assert.equal($commonUploadButton.length, 1, 'common upload button is rendered');

    var $uploadButtons = $element.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS + ' .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);
    assert.equal($uploadButtons.length, files.length, 'upload button is created for each file');
});

QUnit.test('the \'value\' option should be cleared after the \'uploadMode\' option change', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            multiple: true
        }),
        instance = $fileUploader.dxFileUploader('instance');

    var files = [fakeFile, fakeFile1];
    simulateFileChoose($fileUploader, files);

    assert.equal(instance.option('value').length, files.length, 'files are added after init');

    instance.option('uploadMode', 'instantly');
    assert.equal(instance.option('value').length, 0, 'the \'value\' option is empty');
});

QUnit.test('the \'upload\' button should not be rendered if the \'uploadMode\' option is not \'useButtons\'', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm'
        }),
        instance = $fileUploader.dxFileUploader('instance');

    assert.equal($fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 0, 'there is no \'upload\' button');

    instance.option('uploadMode', 'instantly');
    assert.equal($fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 0, 'there is no \'upload\' button');
});

QUnit.test('no upload buttons should be rendered if the \'uploadMode\' option is \'instantly\'', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
        uploadMode: 'instantly'
    });

    simulateFileChoose($element, fakeFile);

    assert.equal($element.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 0, 'no upload buttons are created');
});

QUnit.test('file should be uploaded only one time', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        }),
        $uploadButton = $fileUploader.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

    simulateFileChoose($fileUploader, fakeFile);

    $uploadButton.trigger('dxclick');
    this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);

    var xhr = this.xhrMock.getLastInstance();
    $uploadButton.trigger('dxclick');
    var newXhr = this.xhrMock.getLastInstance();

    assert.equal(xhr, newXhr, 'new xhr was not created when file is uploading');

    this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);
    this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);
    $uploadButton.trigger('dxclick');
    newXhr = this.xhrMock.getLastInstance();

    assert.equal(xhr, newXhr, 'new xhr was not created when file is uploaded');
});


QUnit.module('value option', moduleConfig);

QUnit.test('selected file should be present in value option', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader(),
        fileUploader = $fileUploader.dxFileUploader('instance');

    simulateFileChoose($fileUploader, fakeFile);

    assert.deepEqual(fileUploader.option('value'), [fakeFile], 'value set correctly');
});

QUnit.test('input value should not be changed inside widget after selecting', function(assert) {
    var originalVal = $.fn.val;

    try {
        var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly'
        });

        var valUsed = 0;

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
    var $fileUploader = $('#fileuploader').dxFileUploader({
        uploadMode: 'instantly',
        onValueChanged: function(e) {
            assert.deepEqual(e.value, [fakeFile], 'value specified correctly');
        }
    });

    simulateFileChoose($fileUploader, fakeFile);
});

QUnit.test('value change should be fired when file selected, uploadMode = useForm', function(assert) {
    var valueChangeHandler = sinon.stub(),
        $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm',
            onValueChanged: valueChangeHandler
        }),
        fileUploader = $fileUploader.dxFileUploader('instance');

    simulateFileChoose($fileUploader, fakeFile);

    assert.equal(valueChangeHandler.callCount, 1, 'onValueChanged was called once');
    assert.deepEqual(valueChangeHandler.getCall(0).args[0].value, [fakeFile], 'value have been correctly passed to the event');
    assert.deepEqual(fileUploader.option('value'), [fakeFile], 'value is correct');
});

QUnit.test('value should support files at initialization', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            value: [fakeFile]
        }),
        fileUploader = $fileUploader.dxFileUploader('instance'),
        $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

    assert.equal($fileInput.val(), '', 'input value was set to empty string');
    assert.deepEqual(fileUploader.option('value'), [fakeFile], 'file value is correct');
});

QUnit.test('value should present in the file name', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader();

    simulateFileChoose($fileUploader, fakeFile);

    var $fileName = $fileUploader.find('.' + FILEUPLOADER_FILE_NAME_CLASS).eq(0);

    assert.equal($fileName.text(), fakeFile.name, 'file name represent value correctly');
});

QUnit.test('empty class should be present when value is empty', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader();

    assert.ok($fileUploader.hasClass(FILEUPLOADER_EMPTY_CLASS), 'empty class added');

    simulateFileChoose($fileUploader, fakeFile);
    assert.ok(!$fileUploader.hasClass(FILEUPLOADER_EMPTY_CLASS), 'empty class not added');
});

QUnit.test('value should contain only file name (ie9 fix)', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
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
    let fileUploader;
    let eventHandled = false;

    const onValueChanged = e => {
        if(eventHandled) {
            return;
        } else {
            eventHandled = true;
        }

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
    fileUploader = $fileUploader.dxFileUploader('instance');

    simulateFileChoose($fileUploader, fakeFile);

    const $file = $fileUploader.find(`.${FILEUPLOADER_FILES_CONTAINER_CLASS} .${FILEUPLOADER_FILE_CLASS}`);
    const $fileName = $file.find(`.${FILEUPLOADER_FILE_NAME_CLASS}`);
    const $fileStatus = $file.find(`.${FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS}`);

    assert.strictEqual($file.length, 1, 'file rendered');
    assert.strictEqual($fileName.text(), 'fakefile.png', 'file name rendered');
    assert.strictEqual($fileStatus.text(), 'Ready to upload', 'file status message rendered');
});

QUnit.module('multiple option', moduleConfig);

QUnit.test('field multiple attr should be set correctly', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: true
        }),
        $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

    assert.equal($fileInput.prop('multiple'), true, 'file input has correct name property');

    $fileUploader.dxFileUploader('option', 'multiple', false);
    assert.equal($fileInput.prop('multiple'), false, 'file input has correct name property');
});

QUnit.test('value should contain several file names', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
        multiple: true,
        extendSelection: false
    });

    simulateFileChoose($fileUploader, fakeFile);
    assert.deepEqual($fileUploader.dxFileUploader('option', 'value'), [fakeFile], 'value contain file name');

    simulateFileChoose($fileUploader, [fakeFile, fakeFile1]);
    assert.deepEqual($fileUploader.dxFileUploader('option', 'value'), [fakeFile, fakeFile1], 'value contain both files');
});

QUnit.module('option change', moduleConfig);

QUnit.test('file input should not be rerendered if widget repainted', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
        uploadMode: 'instantly'
    });

    simulateFileChoose($fileUploader, fakeFile);
    $fileUploader.dxFileUploader('repaint');

    var $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);
    assert.equal($fileInput.val(), fakeFile.name, 'value was not set to empty string');
});


QUnit.module('file uploading', moduleConfig);

QUnit.test('upload should be started after file is selected', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({ uploadMode: 'instantly' });

    simulateFileChoose($element, fakeFile);

    var request = this.xhrMock.getInstanceAt(),
        expectedCallsCount = this.xhrMock.LOAD_TIMEOUT / this.xhrMock.PROGRESS_INTERVAL;

    this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

    assert.equal(request.onProgressCallCount, expectedCallsCount, 'the \'onprogress\' callback fired ' + expectedCallsCount + ' times');
    assert.ok(request.uploaded, 'loading is finished');
});

QUnit.test('upload should not start automatically only if \'uploadMode\' option is not \'instantly\'', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
        uploadMode: 'useButtons'
    });

    simulateFileChoose($element, fakeFile);

    var request = this.xhrMock.getInstanceAt();
    this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

    assert.ok(!request, 'upload did not start');
});

QUnit.test('click on common \'upload\' button should start file uploading', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        }),
        $button = $element.find('.' + FILEUPLOADER_CONTENT_CLASS + ' > .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

    simulateFileChoose($element, fakeFile);
    this.clock.tick(this.xhrMock.LOAD_TIMEOUT);

    var request = this.xhrMock.getInstanceAt();
    assert.ok(!request, 'upload did not start');

    $button.trigger('dxclick');
    this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
    request = this.xhrMock.getInstanceAt();

    assert.ok(request.uploaded, 'upload started');
});

QUnit.test('upload of specific file should start after click on corresponding \'upload\' button', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        }),
        files = [fakeFile, fakeFile1];

    simulateFileChoose($element, files);

    var $uploadButtons = $element.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS + ' .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

    $uploadButtons.eq(1).trigger('dxclick');

    this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
    var request = this.xhrMock.getInstanceAt();

    assert.ok(request.uploaded, 'upload is done');
    assert.ok(request.loadedSize, files[1].size, 'correct file was uploaded');
});

QUnit.test('file upload buttons should be removed after upload started', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        }),
        files = [fakeFile, fakeFile1];

    simulateFileChoose($element, files);

    var $uploadButtons = $element.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS + ' .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);

    $uploadButtons.eq(0).trigger('dxclick');
    assert.equal($element.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS + ' .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 1, 'clicked button is removed');

    var $commonUploadButton = $element.find('.' + FILEUPLOADER_CONTENT_CLASS + ' > .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS);
    $commonUploadButton.trigger('dxclick');

    assert.equal($element.find('.' + FILEUPLOADER_FILES_CONTAINER_CLASS + ' .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).length, 0, 'upload buttons related to files are removed');
});

QUnit.test('progressBar should reflect file upload progress', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({ uploadMode: 'instantly' });

    simulateFileChoose($element, fakeFile);

    var request = this.xhrMock.getInstanceAt(),
        progressBar = $('.dx-progressbar').dxProgressBar('instance');

    assert.equal(progressBar.option('value'), request.loadedSize, 'progressBar value is correct on init');

    for(var i = 0, n = this.xhrMock.LOAD_TIMEOUT / this.xhrMock.PROGRESS_INTERVAL; i < n; i++) {
        this.clock.tick(this.xhrMock.PROGRESS_INTERVAL);
        assert.equal(progressBar.option('value'), request.loadedSize, 'progressBar value is correct on step ' + (i + 1));
    }

    assert.equal(request.onProgressCallCount, this.xhrMock.LOAD_TIMEOUT / this.xhrMock.PROGRESS_INTERVAL);
});

QUnit.test('request should use url from the \'uploadUrl\' option', function(assert) {
    var uploadUrl = location.href,
        $element = $('#fileuploader').dxFileUploader({
            uploadUrl: uploadUrl,
            uploadMode: 'instantly'
        });

    simulateFileChoose($element, fakeFile);

    var request = this.xhrMock.getInstanceAt();

    assert.equal(request.url, uploadUrl, 'correct url is used');
});

QUnit.test('uploading multiple files', function(assert) {
    var that = this,
        $element = $('#fileuploader').dxFileUploader({ uploadMode: 'instantly' });

    var files = [fakeFile, fakeFile1];
    simulateFileChoose($element, files);

    this.clock.tick(this.xhrMock.LOAD_TIMEOUT * 2);

    $.each(files, function(index, file) {
        var currentRequest = that.xhrMock.getInstanceAt(index);
        assert.equal(currentRequest.loadedSize, file.size, (index + 1) + ' file is loaded');
    });
});

QUnit.test('upload process should be aborted by \'cancel\' button click', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({ uploadMode: 'instantly' });

    simulateFileChoose($element, fakeFile);

    var request = this.xhrMock.getInstanceAt(),
        $cancelButton = $element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS);

    $cancelButton.trigger('dxclick');

    assert.ok(request.uploadAborted, 'load is aborted');
});

QUnit.test('FormData field name should correspond the \'name\' option value', function(assert) {
    var formFieldElement = 'custom',
        $element = $('#fileuploader').dxFileUploader({
            name: formFieldElement,
            uploadMode: 'instantly'
        });

    simulateFileChoose($element, fakeFile);

    var formData = this.formDataMock.getInstanceAt(),
        fieldName = formData.getTopElement().fieldName;

    assert.equal(fieldName, formFieldElement, 'field name is correct');
});

QUnit.test('uploadMode \'useForm\'', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
        uploadMode: 'useForm'
    });

    simulateFileChoose($element, fakeFile);

    var request = this.xhrMock.getInstanceAt();

    assert.ok(!request, 'request is not created');
});

QUnit.test('upload is successful for each 2xx status', function(assert) {
    assert.expect(1);

    this.xhrMock.setStatus(202);

    var $element = $('#fileuploader').dxFileUploader({
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
    var $element = $('#fileuploader').dxFileUploader({
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
    var $element = $('#fileuploader').dxFileUploader({
        uploadHeaders: {
            'First-header': 'First-header-value',
            'Second-header': 'Second-header-value'
        },
        uploadMode: 'instantly'
    });

    simulateFileChoose($element, fakeFile);
    var headers = this.xhrMock.getLastInstance()._headers;

    assert.equal(headers['First-header'], 'First-header-value', 'first header is correct');
    assert.equal(headers['Second-header'], 'Second-header-value', 'second header is correct');
});

QUnit.test('files upload is correct if the \'extendSelection\' option is true', function(assert) {
    var onUploadStartedCount = 0,
        $fileUploader = $('#fileuploader').dxFileUploader({
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
    var $fileUploader = $('#fileuploader').dxFileUploader({
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
    var $fileUploader = $('#fileuploader').dxFileUploader({
            extendSelection: true,
            multiple: true
        }),
        $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

    simulateFileChoose($fileUploader, [fakeFile, fakeFile, fakeFile]);
    assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CLASS).length, 3, 'files count is correct on the first file choose');

    $fileUploader.dxFileUploader('option', 'value', []);
    assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CLASS).length, 0, 'files count is correct after reset');
    assert.equal($input.val(), '', 'value was cleared in input');

    simulateFileChoose($fileUploader, fakeFile);
    assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CLASS).length, 1, 'files count is correct on the second file choose');
});

QUnit.test('input should be cleared after value reset', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            extendSelection: true,
            value: [fakeFile],
            multiple: true
        }),
        fileUploader = $fileUploader.dxFileUploader('instance'),
        $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);
    $input.val('fakefile');
    fileUploader.reset();

    assert.equal($input.val(), '', 'value was cleared in input');
});

QUnit.test('input value should not be cleared after the file selection', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            extendSelection: true,
            uploadMode: 'useForm'
        }),
        $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);
    $input.val('fakeFile').trigger('change');

    assert.equal($input.val(), 'fakeFile', 'value was cleared in input');
});


QUnit.module('uploading progress', moduleConfig);

QUnit.test('the \'progress\' option should reflect file upload progress', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
            extendSelection: false,
            uploadMode: 'instantly'
        }),
        instance = $element.dxFileUploader('instance');

    var files = [fakeFile, fakeFile1];
    simulateFileChoose($element, files);

    var stepsCount = this.xhrMock.LOAD_TIMEOUT / this.xhrMock.PROGRESS_INTERVAL;

    var totalSize,
        loadedSize,
        currentProgress;

    for(var i = 0; i < stepsCount; i++) {
        loadedSize = 0;
        totalSize = 0;

        for(var j = 0; j < files.length; j++) {
            totalSize += files[j].size;
            loadedSize += this.xhrMock.getInstanceAt(j).loadedSize;
        }

        currentProgress = loadedSize / totalSize * 100;

        assert.equal(instance.option('progress'), currentProgress, 'progress is correct on step ' + i);
        this.clock.tick(this.xhrMock.PROGRESS_INTERVAL);
    }

    simulateFileChoose($element, fakeFile);

    loadedSize = this.xhrMock.getInstanceAt(files.length).loadedSize;
    currentProgress = loadedSize * 100 / fakeFile.size;

    assert.equal(instance.option('progress'), Math.round(currentProgress), 'progress is correct after value change');
});

QUnit.test('the \'progress\' option should be reset to 0 when new files are selected after old files has been uploaded', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            extendSelection: false
        }),
        instance = $element.dxFileUploader('instance');

    simulateFileChoose($element, fakeFile);

    $element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + ' .' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).trigger('dxclick');
    this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
    assert.equal(instance.option('progress'), 100, 'file is uploaded');

    simulateFileChoose($element, fakeFile1);

    assert.equal(instance.option('progress'), 0, 'file choosing leads to the \'progress\' option reset');
});

QUnit.test('T246244 - the \'progress\' option should be recalculated when not uploaded file is removed', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        }),
        instance = $element.dxFileUploader('instance');

    simulateFileChoose($element, [fakeFile, fakeFile, fakeFile]);

    var $files = $element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS),
        $firstFile = $files.eq(0),
        $secondFile = $files.eq(1),
        $thirdFile = $files.eq(2);

    $firstFile.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).trigger('dxclick');
    this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
    assert.equal(instance.option('progress'), 33, 'file is uploaded');

    $secondFile.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
    assert.equal(instance.option('progress'), 50, 'file removing leads to progress recalculation');

    $thirdFile.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
    assert.equal(instance.option('progress'), 100, 'removing all not uploaded files leads to setting the \'progress\' option to 100');
});

QUnit.test('T246244 - the \'progress\' option should be recalculated when uploaded file is removed', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        }),
        instance = $element.dxFileUploader('instance');

    simulateFileChoose($element, [fakeFile, fakeFile, fakeFile]);

    var $files = $element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS),
        $firstFile = $files.eq(0),
        $secondFile = $files.eq(1),
        $thirdFile = $files.eq(2);

    $firstFile.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).trigger('dxclick');
    $secondFile.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).trigger('dxclick');
    this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
    assert.equal(instance.option('progress'), 67, 'two files are uploaded');

    $secondFile.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
    assert.equal(instance.option('progress'), 50, 'uploaded file removing leads to progress recalculation');

    $thirdFile.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
    assert.equal(instance.option('progress'), 100, 'removing all files but one uploaded file leads to setting the \'progress\' option to 100');
});

QUnit.test('T246244 - the \'progress\' option should be recalculated when uploading file is removed', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons'
        }),
        instance = $element.dxFileUploader('instance');

    simulateFileChoose($element, [fakeFile, fakeFile, fakeFile]);

    var $files = $element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS),
        $firstFile = $files.eq(0),
        $secondFile = $files.eq(1),
        $thirdFile = $files.eq(2);

    $firstFile.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).trigger('dxclick');
    this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
    $secondFile.find('.' + FILEUPLOADER_UPLOAD_BUTTON_CLASS).trigger('dxclick');
    assert.equal(instance.option('progress'), 40, 'one file is uploaded and the other one is uploading');

    $secondFile.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
    assert.equal(instance.option('progress'), 50, 'uploading file removing leads to progress recalculation');

    $thirdFile.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
    assert.equal(instance.option('progress'), 100, 'removing all files but one uploaded file leads to setting the \'progress\' option to 100');
});

QUnit.test('T246244 - the \'progress\' option should be reset to 0 when last file is removed', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({ uploadMode: 'instantly' }),
        instance = $element.dxFileUploader('instance');

    simulateFileChoose($element, fakeFile);
    this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
    assert.equal(instance.option('progress'), 100, 'file is uploaded');

    $element.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS + ' .' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
    assert.equal(instance.option('progress'), 0, 'progress is reset');
});


QUnit.module('file status message', moduleConfig);

QUnit.test('correct status message on init', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            readyToUploadMessage: 'ready'
        }),
        instance = $element.dxFileUploader('instance');

    simulateFileChoose($element, fakeFile);

    var $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS),
        $progressBar = $element.find('.dx-progressbar');

    assert.equal($fileStatusMessage.text(), instance.option('readyToUploadMessage'), 'status message is correct');
    assert.ok($fileStatusMessage.is(':visible'), 'status message is visible');
    assert.equal($progressBar.length, 0, 'there is no progressbar');
});

QUnit.test('correct status message on uploaded', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            uploadedMessage: 'done'
        }),
        instance = $element.dxFileUploader('instance');

    simulateFileChoose($element, fakeFile);
    this.clock.tick(this.xhrMock.LOAD_TIMEOUT);
    this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

    var $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS),
        $progressBar = $element.find('.dx-progressbar');

    assert.equal($fileStatusMessage.text(), instance.option('uploadedMessage'), 'status message is correct');
    assert.ok($fileStatusMessage.is(':visible'), 'status message is visible');
    assert.equal($progressBar.length, 0, 'there is no progressbar');
});

QUnit.test('status message is hidden and progressbar is visible on loading', function(assert) {
    var $element = $('#fileuploader').dxFileUploader({
        uploadMode: 'instantly',
        uploadedMessage: 'done'
    });

    simulateFileChoose($element, fakeFile);
    this.clock.tick(this.xhrMock.LOAD_TIMEOUT / 2);

    var $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS),
        $progressBar = $element.find('.dx-progressbar');

    assert.ok(!$fileStatusMessage.is(':visible'), 'status message is not visible');
    assert.equal($progressBar.length, 1, 'progressbar is visible');
});

QUnit.test('status message should be correct if upload failed', function(assert) {
    this.xhrMock.setStatus(405);

    var $element = $('#fileuploader').dxFileUploader({
            uploadFailedMessage: 'failed',
            uploadMode: 'instantly'
        }),
        instance = $element.dxFileUploader('instance');

    simulateFileChoose($element, fakeFile);
    this.clock.tick(FILEUPLOADER_AFTER_LOAD_DELAY);

    var $fileStatusMessage = $element.find('.' + FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS);
    assert.equal($fileStatusMessage.text(), instance.option('uploadFailedMessage'), 'upload failed message is correct');
});


QUnit.module('uploading events', moduleConfig);

QUnit.test('the \'onUploaded\' option', function(assert) {
    var onUploadedCount = 0,
        $element = $('#fileuploader').dxFileUploader({
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
    var onUploadedCount = 0,
        files = [fakeFile, fakeFile1],
        $element = $('#fileuploader').dxFileUploader({
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
    var onProgressCount = 0,
        $element = $('#fileuploader').dxFileUploader({
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
    var onProgressCount = 0,
        files = [fakeFile, fakeFile1],
        filesCount = files.length,
        $element = $('#fileuploader').dxFileUploader({
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
    var stepSize = fakeFile.size * this.xhrMock.PROGRESS_INTERVAL / this.xhrMock.LOAD_TIMEOUT,
        onProgressHandler = sinon.spy(),
        $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onProgress: onProgressHandler
        });

    simulateFileChoose($element, fakeFile);
    var args = onProgressHandler.getCall(0).args[0];

    assert.equal(args.segmentSize, stepSize, 'segment size is correct');
    assert.equal(args.bytesLoaded, stepSize, 'bytes loaded size is correct');
    assert.equal(args.bytesTotal, args.event.total, 'bytes total size is correct');
    assert.ok(args.bytesTotal, 'bytes total is defined');

    this.clock.tick(this.xhrMock.PROGRESS_INTERVAL);
    args = onProgressHandler.getCall(1).args[0];

    assert.equal(args.segmentSize, stepSize, 'segment size is correct after progress interval');
    assert.equal(args.bytesLoaded, 2 * stepSize, 'bytes loaded size is correct after progress interval');
    assert.equal(args.bytesTotal, args.event.total, 'bytes total size is correct');
    assert.ok(args.bytesTotal, 'bytes total is defined');
});

QUnit.test('the \'onUploadError\' option', function(assert) {
    this.xhrMock.setStatus(405);

    var onUploadErrorCount = 0,
        $element = $('#fileuploader').dxFileUploader({
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

    var onUploadErrorCount = 0,
        files = [fakeFile, fakeFile1],
        $element = $('#fileuploader').dxFileUploader({
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
    var onUploadedCount = 0,
        $element = $('#fileuploader').dxFileUploader({
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

    var onUploadErrorCount = 0,
        $element = $('#fileuploader').dxFileUploader({
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
    var onProgressCount = 0,
        $element = $('#fileuploader').dxFileUploader({
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

    var onUploadError = 0,
        $element = $('#fileuploader').dxFileUploader({
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
    var file,
        $element = $('#fileuploader').dxFileUploader({
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
    var file,
        $element = $('#fileuploader').dxFileUploader({
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

    var file,
        $element = $('#fileuploader').dxFileUploader({
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
    var onUploadStartedCount = 0,
        $element = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            onUploadStarted: function(e) {
                onUploadStartedCount++;
            }
        });

    simulateFileChoose($element, fakeFile);
    assert.equal(onUploadStartedCount, 1, 'action is fired');
});

QUnit.test('the \'onUploadAborted\' action', function(assert) {
    var onUploadAbortedCount = 0,
        $element = $('#fileuploader').dxFileUploader({
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

    var $element = $('#fileuploader').dxFileUploader({
        uploadMode: 'instantly',
        onUploadStarted: function(e) {
            assert.ok(e.request instanceof XMLHttpRequest, 'request is correct');
        }
    });

    simulateFileChoose($element, fakeFile);
});

QUnit.test('onUploaded event should contain request which is instance of XMLHttpRequest', function(assert) {
    assert.expect(1);

    var $element = $('#fileuploader').dxFileUploader({
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

    var $element = $('#fileuploader').dxFileUploader({
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

    var $element = $('#fileuploader').dxFileUploader({
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

    var $element = $('#fileuploader').dxFileUploader({
        uploadMode: 'instantly',
        onUploadAborted: function(e) {
            assert.ok(e.request instanceof XMLHttpRequest, 'request is correct');
        }
    });

    simulateFileChoose($element, fakeFile);
    $element.find('.' + FILEUPLOADER_CANCEL_BUTTON_CLASS).trigger('dxclick');
});


QUnit.module('keyboard navigation', moduleConfig);

QUnit.test('upload button should be focus target of fileUploader', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
        uploadMode: 'instantly',
        focusStateEnabled: true
    });
    assert.equal($fileUploader.attr('tabindex'), undefined, 'element has not tabindex');

    var $uploadButton = $fileUploader.find('.' + FILEUPLOADER_BUTTON_CLASS),
        uploadButton = $uploadButton.dxButton('instance');

    assert.equal(uploadButton.option('focusStateEnabled'), false, 'button has not self keyboard handlers');
    assert.equal($uploadButton.attr('tabindex'), 0, 'button has tabindex');

    var stub = sinon.stub(),
        keyboard = keyboardMock($uploadButton);
    uploadButton.option('onClick', stub);
    keyboard.keyDown('enter');

    assert.ok(stub.calledOnce, 'click is called on select button');
});

QUnit.test('T328503 - \'enter\' press on select button should lead to input click', function(assert) {
    if(devices.real().platform !== 'generic') {
        assert.ok(true, 'keyboard is not supported for not generic devices');
        return;
    }

    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            focusStateEnabled: true,
            useNativeInputClick: false
        }),
        $selectButton = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS + ' .' + FILEUPLOADER_BUTTON_CLASS),
        keyboard = keyboardMock($selectButton),
        $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS),
        stub = sinon.stub();

    $input.on('click', stub);
    $selectButton.trigger('focusin');
    keyboard.keyDown('enter');

    this.clock.tick();

    assert.ok(stub.calledOnce, 'press on select button leads to input click');
});

QUnit.test('Propagation of the native input click should be stopped (T404422)', function(assert) {
    assert.expect(1);

    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            useNativeInputClick: false
        }),
        $selectButton = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS + ' .' + FILEUPLOADER_BUTTON_CLASS),
        $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

    $input.on('click', function(e) {
        assert.ok(e.isPropagationStopped(), 'propagation was stopped');
    });

    $selectButton.trigger('click');
});


QUnit.module('Drag and drop', moduleConfig);

QUnit.test('T328503 - drag and drop events should be prevented if native drop is not supported', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            nativeDropSupported: false,
            uploadMode: 'useButtons'
        }),
        $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS),
        dragAndDropSpy = sinon.spy(),
        events = ['dragenter', 'dragover', 'dragleave', 'drop'],
        dropEvent = $.Event($.Event('drop', {
            dataTransfer: { files: [fakeFile] }
        })),
        eventsCount = events.length;

    assert.expect(eventsCount);

    $inputWrapper.on(events.join(' '), dragAndDropSpy);

    for(var i = 0; i < eventsCount; i++) {
        var event = events[i];

        if(event === 'drop') {
            event = dropEvent;
        }

        $inputWrapper.trigger(event);
        assert.ok(dragAndDropSpy.args[i][0].isDefaultPrevented(), 'default is prevented for ' + events[i]);
    }
});

QUnit.test('T328503 - drag and drop events should not be prevented if native drop is supported', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            nativeDropSupported: true,
            uploadMode: 'useForm'
        }),
        $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS),
        dragAndDropSpy = sinon.spy(),
        events = ['dragenter', 'dragover', 'dragleave', 'drop'],
        eventsCount = events.length;

    assert.expect(eventsCount);

    $inputWrapper.on(events.join(' '), dragAndDropSpy);

    for(var i = 0; i < eventsCount; i++) {
        $inputWrapper.trigger(events[i]);
        assert.ok(!dragAndDropSpy.args[i][0].isDefaultPrevented(), 'default is not prevented for ' + events[i]);
    }
});

QUnit.test('T328503 - files drag and drop should lead to value change if form is not used', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            multiple: true
        }),
        $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS),
        files = [fakeFile, fakeFile1],
        event = $.Event($.Event('drop', { dataTransfer: { files: files } }));

    $inputWrapper.trigger(event);
    assert.deepEqual($fileUploader.dxFileUploader('option', 'value'), files, 'files are correct');
});

QUnit.test('T328503 - drop field should be hidden if upload mode is useForm and native drop is not supported', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm',
            nativeDropSupported: false
        }),
        $inputContainer = $fileUploader.find('.' + FILEUPLOADER_INPUT_CONTAINER_CLASS);

    assert.ok(!$inputContainer.is(':visible'), 'input container is hidden');
});

QUnit.test('T370412 - it is impossible to drop some files if the \'multiple\' option is false', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            multiple: false,
            useDragOver: true
        }),
        $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS),
        files = [fakeFile, fakeFile1],
        event = $.Event($.Event('drop', { dataTransfer: { files: files } }));

    $inputWrapper.trigger(event);
    assert.deepEqual($fileUploader.dxFileUploader('option', 'value'), [], 'dragged files count is correct');
});

QUnit.test('the \'accept\' option should not be ignored on drag&drop (T384800)', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            accept: 'text/*'
        }),
        fileUploader = $fileUploader.dxFileUploader('instance'),
        $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS),
        files = [fakeFile],
        event = $.Event($.Event('drop', { dataTransfer: { files: files } }));

    $inputWrapper.trigger(event);
    assert.deepEqual(fileUploader.option('value'), [], 'value is empty');
});

QUnit.test('the \'accept\' option is case insensitive (T570224)', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            useDragOver: true,
            accept: '.jpg'
        }),
        fileUploader = $fileUploader.dxFileUploader('instance'),
        $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS),
        files = [{
            name: 'fakefile.JPG',
        }],
        event = $.Event($.Event('drop', { dataTransfer: { files: files } }));

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
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            useDragOver: true,
            accept: '.jpg'
        }),
        fileUploader = $fileUploader.dxFileUploader('instance'),
        $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS),
        files = [{
            name: 'fakefile.jpg.bak',
            type: 'image/text',
        }],
        event = $.Event($.Event('drop', { dataTransfer: { files: files } }));

    $inputWrapper.trigger(event);
    assert.deepEqual(fileUploader.option('value'), [], 'value is empty');
});

QUnit.test('the \'accept\' option with multiple types should work correctly on drag&drop', function(assert) {
    var fakeFile2 = {
        name: 'fakefile2',
        size: 2048,
        type: 'text/plain',
        lastModifiedDate: $.now()
    };

    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            useDragOver: true,
            accept: 'text/*,image/png'
        }),
        fileUploader = $fileUploader.dxFileUploader('instance'),
        $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);

    var triggerDrop = function(targetFiles) {
        var event = $.Event($.Event('drop', { dataTransfer: { files: targetFiles } }));
        $inputWrapper.trigger(event);
    };

    var files = [fakeFile2];
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

    var $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            accept: '*'
        }),
        $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);

    $inputWrapper.trigger($.Event($.Event('drop', {
        dataTransfer: { files: [fakeFile] }
    })));
});

QUnit.test('file should be added for the \'.jpg\' accept (T386887)', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            useDragOver: true,
            uploadMode: 'instantly',
            accept: '.txt',
            multiple: true
        }),
        $inputWrapper = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS);

    var firstFile = $.extend({}, fakeFile, {
            name: 'firstFile.txt',
            type: 'text/plain'
        }),
        secondFile = $.extend({}, fakeFile, {
            name: 'secondFile',
            type: 'text/plain'
        });

    $inputWrapper.trigger($.Event($.Event('drop', {
        dataTransfer: { files: [firstFile, secondFile] }
    })));

    assert.equal($fileUploader.dxFileUploader('option', 'value').length, 1, 'files count is correct');
    assert.equal($fileUploader.dxFileUploader('option', 'value[0]').name, firstFile.name, 'added file is correct');
});


QUnit.module('files selection', moduleConfig);

QUnit.test('T328503 - input is in input container if you should not use native input click', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            nativeDropSupported: true,
            useNativeInputClick: false
        }),
        $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CONTAINER_CLASS + ' .' + FILEUPLOADER_INPUT_CLASS);

    assert.equal($input.length, 1, 'input is in input container');
});

QUnit.test('T328503 - input is in select button if you should use native input click', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useForm',
            nativeDropSupported: true,
            useNativeInputClick: false
        }),
        $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS + '.' + FILEUPLOADER_BUTTON_CLASS + ' .' + FILEUPLOADER_INPUT_CLASS);

    assert.equal($input.length, 0, 'input is in select button');
});

QUnit.test('T323019 - click on the \'Drop\' field should not lead to file choosing', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'useButtons',
            useNativeInputClick: false
        }),
        $input = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS),
        event;

    $input.on('click', function(e) {
        event = e;
    });

    $input.trigger('click');
    assert.ok(event.isDefaultPrevented(), 'input click is prevented');
});

QUnit.test('T346021 - upload is not started after file drop if the \'uploadMode\' is \'instantly\'', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            uploadMode: 'instantly',
            useDragOver: true,
            useNativeInputClick: false
        }),
        event = $.Event('drop', {
            originalEvent: $.Event('drop', { dataTransfer: { files: [fakeFile] } })
        });

    $fileUploader.find('.' + FILEUPLOADER_INPUT_WRAPPER_CLASS).trigger(event);
    var request = this.xhrMock.getInstanceAt();

    assert.ok(!!request, 'xhr is created');
    assert.ok(request && request.uploadStarted, 'upload is started');
});

QUnit.test('file list should not be extended if the \'multiple\' option is false', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
        multiple: false
    });

    simulateFileChoose($fileUploader, fakeFile);
    simulateFileChoose($fileUploader, fakeFile1);

    assert.equal($fileUploader.find('.' + FILEUPLOADER_FILE_CLASS).length, 1, 'only one file is in list');
});


QUnit.module('disabled option');

QUnit.test('file input should be hidden when widget is disabled', function(assert) {
    var $fileUploader = $('#fileuploader').dxFileUploader({
            disabled: false,
            useNativeInputClick: false,
            useDragOver: true,
            uploadMode: 'useButtons'
        }),
        $fileInput = $fileUploader.find('.' + FILEUPLOADER_INPUT_CLASS);

    assert.equal($fileInput.css('display'), 'inline-block', 'input is visible');

    $fileUploader.dxFileUploader('option', 'disabled', true);
    assert.equal($fileInput.css('display'), 'none', 'input is hidden');
});

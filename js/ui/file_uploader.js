import $ from "../core/renderer";
import Guid from "../core/guid";
import { getWindow } from "../core/utils/window";
import eventsEngine from "../events/core/events_engine";
import registerComponent from "../core/component_registrator";
import Callbacks from "../core/utils/callbacks";
import { isDefined, isFunction } from "../core/utils/type";
import { each } from "../core/utils/iterator";
import { extend } from "../core/utils/extend";
import { inArray } from "../core/utils/array";
import { Deferred, when } from "../core/utils/deferred";
import ajax from "../core/utils/ajax";
import Editor from "./editor/editor";
import Button from "./button";
import ProgressBar from "./progress_bar";
import browser from "../core/utils/browser";
import devices from "../core/devices";
import eventUtils from "../events/utils";
import clickEvent from "../events/click";
import messageLocalization from "../localization/message";
import themes from "./themes";

const window = getWindow();

const FILEUPLOADER_CLASS = "dx-fileuploader",
    FILEUPLOADER_EMPTY_CLASS = "dx-fileuploader-empty",
    FILEUPLOADER_SHOW_FILE_LIST_CLASS = "dx-fileuploader-show-file-list",
    FILEUPLOADER_DRAGOVER_CLASS = "dx-fileuploader-dragover",

    FILEUPLOADER_WRAPPER_CLASS = "dx-fileuploader-wrapper",
    FILEUPLOADER_CONTAINER_CLASS = "dx-fileuploader-container",
    FILEUPLOADER_CONTENT_CLASS = "dx-fileuploader-content",
    FILEUPLOADER_INPUT_WRAPPER_CLASS = "dx-fileuploader-input-wrapper",
    FILEUPLOADER_INPUT_CONTAINER_CLASS = "dx-fileuploader-input-container",
    FILEUPLOADER_INPUT_LABEL_CLASS = "dx-fileuploader-input-label",
    FILEUPLOADER_INPUT_CLASS = "dx-fileuploader-input",
    FILEUPLOADER_FILES_CONTAINER_CLASS = "dx-fileuploader-files-container",
    FILEUPLOADER_FILE_CONTAINER_CLASS = "dx-fileuploader-file-container",
    FILEUPLOADER_FILE_INFO_CLASS = "dx-fileuploader-file-info",
    FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS = "dx-fileuploader-file-status-message",

    FILEUPLOADER_FILE_CLASS = "dx-fileuploader-file",
    FILEUPLOADER_FILE_NAME_CLASS = "dx-fileuploader-file-name",
    FILEUPLOADER_FILE_SIZE_CLASS = "dx-fileuploader-file-size",

    FILEUPLOADER_BUTTON_CLASS = "dx-fileuploader-button",
    FILEUPLOADER_BUTTON_CONTAINER_CLASS = "dx-fileuploader-button-container",
    FILEUPLOADER_CANCEL_BUTTON_CLASS = "dx-fileuploader-cancel-button",
    FILEUPLOADER_UPLOAD_BUTTON_CLASS = "dx-fileuploader-upload-button",

    FILEUPLOADER_INVALID_CLASS = "dx-fileuploader-invalid",

    FILEUPLOADER_AFTER_LOAD_DELAY = 400,
    FILEUPLOADER_CHUNK_META_DATA_NAME = "chunkMetadata";

let renderFileUploaderInput = () => $("<input>").attr("type", "file");

const isFormDataSupported = () => !!window.FormData;

/**
* @name dxFileUploader
* @inherits Editor
* @module ui/file_uploader
* @export default
*/
class FileUploader extends Editor {

    _supportedKeys() {
        const click = e => {
            e.preventDefault();
            const $selectButton = this._selectButton.$element();
            eventsEngine.trigger($selectButton, clickEvent.name);
        };

        return extend(super._supportedKeys(), {
            space: click,
            enter: click
        });
    }

    _setOptionsByReference() {
        super._setOptionsByReference();

        extend(this._optionsByReference, {
            value: true
        });
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            /**
            * @name dxFileUploaderOptions.chunkSize
            * @type number
            * @default 0
            */
            chunkSize: 0,
            /**
            * @name dxFileUploaderOptions.value
            * @type Array<File>
            * @default []
            */
            value: [],

            /**
            * @name dxFileUploaderOptions.selectButtonText
            * @type string
            * @default "Select File"
            */
            selectButtonText: messageLocalization.format("dxFileUploader-selectFile"),

            /**
            * @name dxFileUploaderOptions.uploadButtonText
            * @type string
            * @default "Upload"
            */
            uploadButtonText: messageLocalization.format("dxFileUploader-upload"),

            /**
            * @name dxFileUploaderOptions.labelText
            * @type string
            * @default "or Drop file here"
            */
            labelText: messageLocalization.format("dxFileUploader-dropFile"),

            /**
            * @name dxFileUploaderOptions.name
            * @type string
            * @default "files[]"
            */
            name: "files[]",

            /**
            * @name dxFileUploaderOptions.multiple
            * @type boolean
            * @default false
            */
            multiple: false,

            /**
            * @name dxFileUploaderOptions.accept
            * @type string
            * @default ""
            */
            accept: "",

            /**
            * @name dxFileUploaderOptions.uploadUrl
            * @type string
            * @default "/"
            */
            uploadUrl: "/",

            /**
            * @name dxFileUploaderOptions.allowCanceling
            * @type boolean
            * @default true
            */
            allowCanceling: true,

            /**
            * @name dxFileUploaderOptions.showFileList
            * @type boolean
            * @default true
            */
            showFileList: true,

            /**
            * @name dxFileUploaderOptions.progress
            * @type number
            * @default 0
            */
            progress: 0,

            /**
            * @name dxFileUploaderOptions.readyToUploadMessage
            * @type string
            * @default "Ready to upload"
            */
            readyToUploadMessage: messageLocalization.format("dxFileUploader-readyToUpload"),

            /**
            * @name dxFileUploaderOptions.uploadedMessage
            * @type string
            * @default "Uploaded"
            */
            uploadedMessage: messageLocalization.format("dxFileUploader-uploaded"),

            /**
            * @name dxFileUploaderOptions.uploadFailedMessage
            * @type string
            * @default "Upload failed"
            */
            uploadFailedMessage: messageLocalization.format("dxFileUploader-uploadFailedMessage"),

            /**
            * @name dxFileUploaderOptions.uploadMode
            * @type Enums.FileUploadMode
            * @default "instantly"
            */
            uploadMode: "instantly",

            /**
            * @name dxFileUploaderOptions.uploadMethod
            * @type Enums.UploadHttpMethod
            * @default "POST"
            */
            uploadMethod: "POST",

            /**
            * @name dxFileUploaderOptions.uploadHeaders
            * @type object
            * @default {}
            */
            uploadHeaders: {},

            /**
            * @name dxFileUploaderOptions.onUploadStarted
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 file:File
            * @type_function_param1_field5 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field6 event:event
            * @type_function_param1_field7 request:XMLHttpRequest
            * @action
            */
            onUploadStarted: null,

            /**
            * @name dxFileUploaderOptions.onUploaded
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 file:File
            * @type_function_param1_field5 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field6 event:event
            * @type_function_param1_field7 request:XMLHttpRequest
            * @action
            */
            onUploaded: null,

            /**
            * @name dxFileUploaderOptions.onProgress
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 file:File
            * @type_function_param1_field5 segmentSize:Number
            * @type_function_param1_field6 bytesLoaded:Number
            * @type_function_param1_field7 bytesTotal:Number
            * @type_function_param1_field8 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field9 event:event
            * @type_function_param1_field10 request:XMLHttpRequest
            * @action
            */
            onProgress: null,

            /**
            * @name dxFileUploaderOptions.onUploadError
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 file:File
            * @type_function_param1_field5 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field6 event:event
            * @type_function_param1_field7 request:XMLHttpRequest
            * @type_function_param1_field8 error:any
            * @action
            */
            onUploadError: null,

            /**
            * @name dxFileUploaderOptions.onUploadAborted
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 file:File
            * @type_function_param1_field5 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field6 event:event
            * @type_function_param1_field7 request:XMLHttpRequest
            * @action
            */
            onUploadAborted: null,

            /**
            * @name dxFileUploaderOptions.allowedFileExtensions
            * @type Array<string>
            * @default []
            */
            allowedFileExtensions: [],

            /**
            * @name dxFileUploaderOptions.maxFileSize
            * @type number
            * @default 0
            */
            maxFileSize: 0,

            /**
            * @name dxFileUploaderOptions.minFileSize
            * @type number
            * @default 0
            */
            minFileSize: 0,

            /**
            * @name dxFileUploaderOptions.invalidFileExtensionMessage
            * @type string
            * @default "File type is not allowed"
            */
            invalidFileExtensionMessage: messageLocalization.format("dxFileUploader-invalidFileExtension"),

            /**
            * @name dxFileUploaderOptions.invalidMaxFileSizeMessage
            * @type string
            * @default "File is too large"
            */
            invalidMaxFileSizeMessage: messageLocalization.format("dxFileUploader-invalidMaxFileSize"),

            /**
            * @name dxFileUploaderOptions.invalidMinFileSizeMessage
            * @type string
            * @default "File is too small"
            */
            invalidMinFileSizeMessage: messageLocalization.format("dxFileUploader-invalidMinFileSize"),


            /**
            * @name dxFileUploaderOptions.extendSelection
            * @type boolean
            * @default true
            * @hidden
            */
            extendSelection: true,

            /**
            * @name dxFileUploaderOptions.validationMessageMode
            * @hidden
            */
            validationMessageMode: "always",

            /**
            * @name dxFileUploaderOptions.onValueChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 value:Array<File>
            * @type_function_param1_field5 previousValue:Array<File>
            * @type_function_param1_field6 jQueryEvent:jQuery.Event:deprecated(event)
            * @type_function_param1_field7 event:event
            * @action
            */

            /**
            * @name dxFileUploaderOptions.uploadFile
            * @type function
            * @type_function_param1 file:File
            * @type_function_param2 progressCallback(loadedBytes):any
            * @type_function_return Promise<any>|any
            */
            uploadFile: null,

            /**
            * @name dxFileUploaderOptions.uploadChunk
            * @type function
            * @type_function_param1 file:File
            * @type_function_param2 chunksInfo:object
            * @type_function_param2_field1 bytesLoaded:Number
            * @type_function_param2_field2 chunkCount:Number
            * @type_function_param2_field3 customData:object
            * @type_function_param2_field4 chunkBlob:Blob
            * @type_function_param2_field5 chunkIndex:Number
            * @type_function_return Promise<any>|any
            */
            uploadChunk: null,

            /**
            * @name dxFileUploaderOptions.abortUpload
            * @type function
            * @type_function_param1 file:File
            * @type_function_param2 chunksInfo:object
            * @type_function_param2_field1 bytesLoaded:Number
            * @type_function_param2_field2 chunkCount:Number
            * @type_function_param2_field3 customData:object
            * @type_function_param2_field4 chunkBlob:Blob
            * @type_function_param2_field5 chunkIndex:Number
            * @type_function_return Promise<any>|any
            */
            abortUpload: null,

            validationMessageOffset: { h: 0, v: 0 },

            useNativeInputClick: false,
            useDragOver: true,
            nativeDropSupported: true,
            _uploadButtonType: "normal"
        });
    }

    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([
            {
                device: () => devices.real().deviceType === "desktop" && !devices.isSimulator(),
                options: {
                    /**
                    * @name dxFileUploaderOptions.focusStateEnabled
                    * @type boolean
                    * @default true @for desktop
                    */
                    focusStateEnabled: true
                }
            },
            {
                device: [
                    {
                        platform: "android"
                    }
                ],
                options: {
                    validationMessageOffset: { v: 0 }
                }
            },
            {
                device: () => devices.real().deviceType !== "desktop",
                options: {
                    useDragOver: false
                }
            },
            {
                device: () => !isFormDataSupported(),
                options: {
                    uploadMode: "useForm"
                }
            },
            {
                device: () => browser.msie || devices.real().deviceType !== "desktop",
                options: {
                    nativeDropSupported: false
                }
            },
            {
                device: () => themes.isMaterial(),
                options: {
                    _uploadButtonType: "default"
                }
            }
        ]);
    }

    _init() {
        super._init();

        this._initFileInput();
        this._initLabel();

        this._setUploadStrategy();
        this._createFiles();
        this._createUploadStartedAction();
        this._createUploadedAction();
        this._createProgressAction();
        this._createUploadErrorAction();
        this._createUploadAbortedAction();
    }

    _setUploadStrategy() {
        let strategy = null;

        if(this.option("chunkSize") > 0) {
            const uploadChunk = this.option("uploadChunk");
            strategy = uploadChunk && isFunction(uploadChunk) ? new CustomChunksFileUploadStrategy(this) : new DefaultChunksFileUploadStrategy(this);
        } else {
            const uploadFile = this.option("uploadFile");
            strategy = uploadFile && isFunction(uploadFile) ? new CustomWholeFileUploadStrategy(this) : new DefaultWholeFileUploadStrategy(this);
        }

        this._uploadStrategy = strategy;
    }

    _initFileInput() {
        this._isCustomClickEvent = false;

        if(!this._$fileInput) {
            this._$fileInput = renderFileUploaderInput();

            eventsEngine.on(this._$fileInput, "change", this._inputChangeHandler.bind(this));
            eventsEngine.on(this._$fileInput, "click", e => {
                e.stopPropagation();
                return this.option("useNativeInputClick") || this._isCustomClickEvent;
            });
        }

        this._$fileInput.prop({
            multiple: this.option("multiple"),
            accept: this.option("accept"),
            tabIndex: -1
        });
    }

    _inputChangeHandler() {
        if(this._doPreventInputChange) {
            return;
        }

        const fileName = this._$fileInput.val().replace(/^.*\\/, ''),
            files = this._$fileInput.prop("files");

        if(files && !files.length) {
            return;
        }

        const value = files ? this._getFiles(files) : [{ name: fileName }];
        this._changeValue(value);

        if(this.option("uploadMode") === "instantly") {
            this._uploadFiles();
        }
    }

    _shouldFileListBeExtended() {
        return this.option("uploadMode") !== "useForm" && this.option("extendSelection") && this.option("multiple");
    }

    _removeDuplicates(files, value) {
        const result = [];

        for(let i = 0; i < value.length; i++) {
            if(!this._isFileInArray(files, value[i])) {
                result.push(value[i]);
            }
        }

        return result;
    }

    _isFileInArray(files, file) {
        for(let i = 0; i < files.length; i++) {
            const item = files[i];
            if(item.size === file.size && item.name === file.name) {
                return true;
            }
        }

        return false;
    }

    _changeValue(value) {
        const files = this._shouldFileListBeExtended() ? this.option("value").slice() : [];

        if(this.option("uploadMode") !== "instantly") {
            value = this._removeDuplicates(files, value);
        }

        this.option("value", files.concat(value));
    }

    _getFiles(fileList) {
        const values = [];

        each(fileList, (_, value) => values.push(value));

        return values;
    }

    _initLabel() {
        if(!this._$inputLabel) {
            this._$inputLabel = $("<div>");
        }

        this._$inputLabel.text(this.option("labelText"));
    }

    _focusTarget() {
        return this.$element().find("." + FILEUPLOADER_BUTTON_CLASS);
    }

    _getSubmitElement() {
        return this._$fileInput;
    }

    _initMarkup() {
        super._initMarkup();

        this.$element().addClass(FILEUPLOADER_CLASS);

        this._renderWrapper();
        this._renderInputWrapper();
        this._renderSelectButton();
        this._renderInputContainer();
        this._renderUploadButton();

        this._preventRecreatingFiles = true;
    }

    _render() {
        this._preventRecreatingFiles = false;
        this._renderDragEvents();

        this._renderFiles();

        super._render();
    }

    _createFileProgressBar(file) {
        file.progressBar = this._createProgressBar(file.value.size);
        file.progressBar.$element().appendTo(file.$file);
        this._initStatusMessage(file);
        this._initCancelButton(file);
    }

    _setStatusMessage(file, key) {
        setTimeout(() => {
            if(this.option("showFileList")) {
                file.$statusMessage.text(this.option(key));
                file.$statusMessage.css("display", "");
                file.progressBar.$element().remove();
            }
        }, FILEUPLOADER_AFTER_LOAD_DELAY);
    }

    _createFiles() {
        const value = this.option("value");

        if(this._files && (value.length === 0 || !this._shouldFileListBeExtended())) {
            this._preventFilesUploading(this._files);
            this._files = null;
        }

        if(!this._files) {
            this._files = [];
        }

        each(value.slice(this._files.length), (_, value) => {
            const file = this._createFile(value);
            this._validateFile(file);
            this._files.push(file);
        });
    }

    _preventFilesUploading(files) {
        files.forEach(file => this._uploadStrategy.abortUpload(file));
    }

    _validateFile(file) {
        file.isValidFileExtension = this._validateFileExtension(file);
        file.isValidMinSize = this._validateMinFileSize(file);
        file.isValidMaxSize = this._validateMaxFileSize(file);
    }

    _validateFileExtension(file) {
        const allowedExtensions = this.option("allowedFileExtensions"),
            fileExtension = file.value.name.substring(file.value.name.lastIndexOf('.')).toLowerCase();
        if(allowedExtensions.length === 0) {
            return true;
        }
        for(let i = 0; i < allowedExtensions.length; i++) {
            if(fileExtension === allowedExtensions[i].toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    _validateMaxFileSize(file) {
        const fileSize = file.value.size,
            maxFileSize = this.option("maxFileSize");
        return maxFileSize > 0 ? fileSize <= maxFileSize : true;
    }

    _validateMinFileSize(file) {
        const fileSize = file.value.size,
            minFileSize = this.option("minFileSize");
        return minFileSize > 0 ? fileSize >= minFileSize : true;
    }

    _createUploadStartedAction() {
        this._uploadStartedAction = this._createActionByOption("onUploadStarted");
    }

    _createUploadedAction() {
        this._uploadedAction = this._createActionByOption("onUploaded");
    }

    _createProgressAction() {
        this._progressAction = this._createActionByOption("onProgress");
    }

    _createUploadAbortedAction() {
        this._uploadAbortedAction = this._createActionByOption("onUploadAborted");
    }

    _createUploadErrorAction() {
        this._uploadErrorAction = this._createActionByOption("onUploadError");
    }

    _createFile(value) {
        return {
            value: value,
            loadedSize: 0,
            onProgress: Callbacks(),
            onAbort: Callbacks(),
            onLoad: Callbacks(),
            onError: Callbacks(),
            onLoadStart: Callbacks(),
            isValidFileExtension: true,
            isValidMaxSize: true,
            isValidMinSize: true,
            isValid() {
                return this.isValidFileExtension && this.isValidMaxSize && this.isValidMinSize;
            }
        };
    }

    _renderFiles() {
        const value = this.option("value");

        if(!this._$filesContainer) {
            this._$filesContainer = $("<div>")
                .addClass(FILEUPLOADER_FILES_CONTAINER_CLASS)
                .appendTo(this._$content);
        } else if(!this._shouldFileListBeExtended() || value.length === 0) {
            this._$filesContainer.empty();
        }

        const showFileList = this.option("showFileList");
        if(showFileList) {
            each(this._files, (_, file) => {
                if(!file.$file) {
                    this._renderFile(file);
                }
            });
        }

        this.$element().toggleClass(FILEUPLOADER_SHOW_FILE_LIST_CLASS, showFileList);
        this._toggleFileUploaderEmptyClassName();
        this._updateFileNameMaxWidth();

        this._$validationMessage && this._$validationMessage.dxOverlay("instance").repaint();
    }

    _renderFile(file) {
        const value = file.value;

        const $fileContainer = $("<div>")
            .addClass(FILEUPLOADER_FILE_CONTAINER_CLASS)
            .appendTo(this._$filesContainer);

        this._renderFileButtons(file, $fileContainer);

        file.$file = $("<div>")
            .addClass(FILEUPLOADER_FILE_CLASS)
            .appendTo($fileContainer);

        const $fileInfo = $("<div>")
            .addClass(FILEUPLOADER_FILE_INFO_CLASS)
            .appendTo(file.$file);

        file.$statusMessage = $("<div>")
            .addClass(FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS)
            .appendTo(file.$file);

        $("<div>")
            .addClass(FILEUPLOADER_FILE_NAME_CLASS)
            .text(value.name)
            .appendTo($fileInfo);

        if(isDefined(value.size)) {
            $("<div>")
                .addClass(FILEUPLOADER_FILE_SIZE_CLASS)
                .text(this._getFileSize(value.size))
                .appendTo($fileInfo);
        }

        if(file.isValid()) {
            file.$statusMessage.text(this.option("readyToUploadMessage"));
        } else {
            if(!file.isValidFileExtension) {
                file.$statusMessage.append(this._createValidationElement("invalidFileExtensionMessage"));
            }
            if(!file.isValidMaxSize) {
                file.$statusMessage.append(this._createValidationElement("invalidMaxFileSizeMessage"));
            }
            if(!file.isValidMinSize) {
                file.$statusMessage.append(this._createValidationElement("invalidMinFileSizeMessage"));
            }
            $fileContainer.addClass(FILEUPLOADER_INVALID_CLASS);
        }
    }
    _createValidationElement(key) {
        return $("<span>").text(this.option(key));
    }

    _updateFileNameMaxWidth() {
        const cancelButtonsCount = this.option("allowCanceling") && this.option("uploadMode") !== "useForm" ? 1 : 0,
            uploadButtonsCount = this.option("uploadMode") === "useButtons" ? 1 : 0,
            filesContainerWidth = this._$filesContainer.find("." + FILEUPLOADER_FILE_CONTAINER_CLASS).first().width() || this._$filesContainer.width(),
            $buttonContainer = this._$filesContainer.find("." + FILEUPLOADER_BUTTON_CONTAINER_CLASS).eq(0),
            buttonsWidth = $buttonContainer.width() * (cancelButtonsCount + uploadButtonsCount),
            $fileSize = this._$filesContainer.find("." + FILEUPLOADER_FILE_SIZE_CLASS).eq(0);

        const prevFileSize = $fileSize.text();
        $fileSize.text("1000 Mb");
        const fileSizeWidth = $fileSize.width();
        $fileSize.text(prevFileSize);

        this._$filesContainer.find("." + FILEUPLOADER_FILE_NAME_CLASS).css("maxWidth", filesContainerWidth - buttonsWidth - fileSizeWidth);
    }

    _renderFileButtons(file, $container) {
        const $cancelButton = this._getCancelButton(file);
        $cancelButton && $container.append($cancelButton);

        const $uploadButton = this._getUploadButton(file);
        $uploadButton && $container.append($uploadButton);
    }

    _getCancelButton(file) {
        if(this.option("uploadMode") === "useForm") {
            return null;
        }

        file.cancelButton = this._createComponent(
            $("<div>").addClass(FILEUPLOADER_BUTTON_CLASS + " " + FILEUPLOADER_CANCEL_BUTTON_CLASS),
            Button, {
                onClick: () => this._removeFile(file),
                icon: "close",
                visible: this.option("allowCanceling"),
                integrationOptions: {}
            }
        );

        return $("<div>")
            .addClass(FILEUPLOADER_BUTTON_CONTAINER_CLASS)
            .append(file.cancelButton.$element());
    }

    _getUploadButton(file) {
        if(!file.isValid() || this.option("uploadMode") !== "useButtons") {
            return null;
        }

        file.uploadButton = this._createComponent(
            $("<div>").addClass(FILEUPLOADER_BUTTON_CLASS + " " + FILEUPLOADER_UPLOAD_BUTTON_CLASS),
            Button,
            {
                onClick: () => this._uploadFile(file),
                icon: "upload"
            }
        );

        file.onLoadStart.add(() => file.uploadButton.$element().remove());

        return $("<div>")
            .addClass(FILEUPLOADER_BUTTON_CONTAINER_CLASS)
            .append(file.uploadButton.$element());
    }

    _removeFile(file) {
        file.$file.parent().remove();

        this._files.splice(inArray(file, this._files), 1);

        const value = this.option("value").slice();
        value.splice(inArray(file.value, value), 1);

        this._preventRecreatingFiles = true;
        this.option("value", value);
        this._preventRecreatingFiles = false;

        this._toggleFileUploaderEmptyClassName();

        this._doPreventInputChange = true;
        this._$fileInput.val("");
        this._doPreventInputChange = false;
    }

    _toggleFileUploaderEmptyClassName() {
        this.$element().toggleClass(FILEUPLOADER_EMPTY_CLASS, !this._files.length || this._hasInvalidFile(this._files));
    }
    _hasInvalidFile(files) {
        for(let i = 0; i < files.length; i++) {
            if(!files[i].isValid()) {
                return true;
            }
        }
        return false;
    }

    _getFileSize(size) {
        let i = 0;
        const labels = [
                messageLocalization.format("dxFileUploader-bytes"),
                messageLocalization.format("dxFileUploader-kb"),
                messageLocalization.format("dxFileUploader-Mb"),
                messageLocalization.format("dxFileUploader-Gb")
            ],
            count = labels.length - 1;

        while(i < count && size >= 1024) {
            size /= 1024;
            i++;
        }

        return Math.round(size) + " " + labels[i];
    }

    _renderSelectButton() {
        const $button = $("<div>")
            .addClass(FILEUPLOADER_BUTTON_CLASS)
            .appendTo(this._$inputWrapper);

        this._selectButton = this._createComponent($button, Button, {
            text: this.option("selectButtonText"),
            focusStateEnabled: false,
            integrationOptions: {}
        });

        // NOTE: click triggering on input 'file' works correctly only in native click handler when device is used
        if(devices.real().deviceType === "desktop") {
            this._selectButton.option("onClick", this._selectButtonClickHandler.bind(this));
        } else {
            eventsEngine.off($button, "click");
            eventsEngine.on($button, "click", this._selectButtonClickHandler.bind(this));
        }
    }

    _selectButtonClickHandler() {
        if(this.option("useNativeInputClick")) {
            return;
        }

        if(this.option("disabled")) {
            return false;
        }

        this._isCustomClickEvent = true;
        eventsEngine.trigger(this._$fileInput, "click");
        this._isCustomClickEvent = false;
    }

    _renderUploadButton() {
        if(this.option("uploadMode") !== "useButtons") {
            return;
        }

        const $uploadButton = $("<div>")
            .addClass(FILEUPLOADER_BUTTON_CLASS)
            .addClass(FILEUPLOADER_UPLOAD_BUTTON_CLASS)
            .appendTo(this._$content);

        this._uploadButton = this._createComponent($uploadButton, Button, {
            text: this.option("uploadButtonText"),
            onClick: this._uploadButtonClickHandler.bind(this),
            type: this.option("_uploadButtonType"),
            integrationOptions: {}
        });
    }

    _uploadButtonClickHandler() {
        this._uploadFiles();
    }

    _shouldDragOverBeRendered() {
        return this.option("uploadMode") !== "useForm" || this.option("nativeDropSupported");
    }

    _renderInputContainer() {
        this._$inputContainer = $("<div>")
            .addClass(FILEUPLOADER_INPUT_CONTAINER_CLASS)
            .appendTo(this._$inputWrapper);

        if(!this._shouldDragOverBeRendered()) {
            this._$inputContainer.css("display", "none");
        }

        this._$fileInput
            .addClass(FILEUPLOADER_INPUT_CLASS);

        this._renderInput();

        this._$inputLabel
            .addClass(FILEUPLOADER_INPUT_LABEL_CLASS)
            .appendTo(this._$inputContainer);
    }

    _renderInput() {
        if(this.option("useNativeInputClick")) {
            this._selectButton.option("template", this._selectButtonInputTemplate.bind(this));
        } else {
            this._$fileInput.appendTo(this._$inputContainer);
            this._selectButton.option("template", "content");
        }
    }

    _selectButtonInputTemplate(data, content) {
        const $content = $(content);
        const $text = $("<span>")
            .addClass("dx-button-text")
            .text(data.text);

        $content
            .append($text)
            .append(this._$fileInput);

        return $content;
    }

    _renderInputWrapper() {
        this._$inputWrapper = $("<div>")
            .addClass(FILEUPLOADER_INPUT_WRAPPER_CLASS)
            .appendTo(this._$content);
    }

    _renderDragEvents() {
        eventsEngine.off(this._$inputWrapper, "." + this.NAME);

        if(!this._shouldDragOverBeRendered()) {
            return;
        }

        this._dragEventsTargets = [];

        eventsEngine.on(this._$inputWrapper, eventUtils.addNamespace("dragenter", this.NAME), this._dragEnterHandler.bind(this));
        eventsEngine.on(this._$inputWrapper, eventUtils.addNamespace("dragover", this.NAME), this._dragOverHandler.bind(this));
        eventsEngine.on(this._$inputWrapper, eventUtils.addNamespace("dragleave", this.NAME), this._dragLeaveHandler.bind(this));
        eventsEngine.on(this._$inputWrapper, eventUtils.addNamespace("drop", this.NAME), this._dropHandler.bind(this));
    }

    _useInputForDrop() {
        return this.option("nativeDropSupported") && this.option("uploadMode") === "useForm";
    }

    _dragEnterHandler(e) {
        if(this.option("disabled")) {
            return false;
        }

        if(!this._useInputForDrop()) {
            e.preventDefault();
        }

        this._updateEventTargets(e);

        this.$element().addClass(FILEUPLOADER_DRAGOVER_CLASS);
    }

    _dragOverHandler(e) {
        if(!this._useInputForDrop()) {
            e.preventDefault();
        }
    }

    _dragLeaveHandler(e) {
        if(!this._useInputForDrop()) {
            e.preventDefault();
        }

        this._updateEventTargets(e);

        if(!this._dragEventsTargets.length) {
            this.$element().removeClass(FILEUPLOADER_DRAGOVER_CLASS);
        }
    }

    _updateEventTargets(e) {
        const targetIndex = this._dragEventsTargets.indexOf(e.target),
            isTargetExists = targetIndex !== -1;

        if(e.type === "dragenter") {
            !isTargetExists && this._dragEventsTargets.push(e.target);
        } else {
            isTargetExists && this._dragEventsTargets.splice(targetIndex, 1);
        }
    }

    _dropHandler(e) {
        this._dragEventsTargets = [];
        this.$element().removeClass(FILEUPLOADER_DRAGOVER_CLASS);

        if(this._useInputForDrop()) {
            return;
        }

        e.preventDefault();

        const fileList = e.originalEvent.dataTransfer.files,
            files = this._getFiles(fileList);

        if(!this.option("multiple") && files.length > 1) {
            return;
        }

        this._changeValue(this._filterFiles(files));

        if(this.option("uploadMode") === "instantly") {
            this._uploadFiles();
        }
    }

    _filterFiles(files) {
        if(!files.length) {
            return files;
        }

        const accept = this.option("accept");

        if(!accept.length) {
            return files;
        }

        const result = [],
            allowedTypes = this._getAllowedFileTypes(accept);

        for(let i = 0, n = files.length; i < n; i++) {
            if(this._isFileTypeAllowed(files[i], allowedTypes)) {
                result.push(files[i]);
            }
        }

        return result;
    }

    _getAllowedFileTypes(acceptSting) {
        if(!acceptSting.length) {
            return [];
        }

        return acceptSting.split(',').map(item => item.trim());
    }

    _isFileTypeAllowed(file, allowedTypes) {
        for(let i = 0, n = allowedTypes.length; i < n; i++) {
            let allowedType = allowedTypes[i];

            if(allowedType[0] === ".") {
                allowedType = allowedType.replace(".", "\\.");

                if(file.name.match(new RegExp(allowedType + "$", "i"))) {
                    return true;
                }
            } else {
                allowedType = allowedType.replace("*", "");

                if(file.type.match(new RegExp(allowedType, "i"))) {
                    return true;
                }
            }
        }
        return false;
    }

    _renderWrapper() {
        const $wrapper = $("<div>")
            .addClass(FILEUPLOADER_WRAPPER_CLASS)
            .appendTo(this.$element());

        const $container = $("<div>")
            .addClass(FILEUPLOADER_CONTAINER_CLASS)
            .appendTo($wrapper);

        this._$content = $("<div>")
            .addClass(FILEUPLOADER_CONTENT_CLASS)
            .appendTo($container);
    }

    _clean() {
        this._$fileInput.detach();
        delete this._$filesContainer;
        super._clean();
    }

    _uploadFiles() {
        if(isFormDataSupported()) {
            each(this._files, (_, file) => this._uploadFile(file));
        }
    }
    _uploadFile(file) {
        this._uploadStrategy.upload(file);
    }
    _updateProgressBar(file, loadedFileData) {
        file.progressBar && file.progressBar.option({
            value: loadedFileData.loaded,
            showStatus: true
        });

        this._progressAction({
            file: file.value,
            segmentSize: loadedFileData.currentSegmentSize,
            bytesLoaded: loadedFileData.loaded,
            bytesTotal: loadedFileData.total,
            event: loadedFileData.event,
            request: file.request
        });
    }
    _updateTotalProgress(totalFilesSize, totalLoadedFilesSize) {
        const progress = totalFilesSize ? Math.round(totalLoadedFilesSize / totalFilesSize * 100) : 0;
        this.option("progress", progress);
        this._setLoadedSize(totalLoadedFilesSize);
    }

    _initStatusMessage(file) {
        file.$statusMessage.css("display", "none");
    }

    _initCancelButton(file) {
        file.cancelButton.option("onClick", () => {
            this._preventFilesUploading([file]);
            this._removeFile(file);
        });

        const hideCancelButton = () => {
            setTimeout(() => {
                file.cancelButton.option({
                    visible: false
                });
            }, FILEUPLOADER_AFTER_LOAD_DELAY);
        };

        file.onLoad.add(hideCancelButton);
        file.onError.add(hideCancelButton);
    }

    _createProgressBar(fileSize) {
        return this._createComponent($("<div>"), ProgressBar, {
            value: undefined,
            min: 0,
            max: fileSize,
            statusFormat(ratio) {
                return Math.round(ratio * 100) + "%";
            },
            showStatus: false,
            statusPosition: "right"
        });
    }

    _getTotalFilesSize() {
        if(!this._totalFilesSize) {
            this._totalFilesSize = 0;
            each(this._files, (_, file) => {
                this._totalFilesSize += file.value.size;
            });
        }
        return this._totalFilesSize;
    }

    _getTotalLoadedFilesSize() {
        if(!this._totalLoadedFilesSize) {
            this._totalLoadedFilesSize = 0;
            each(this._files, (_, file) => {
                this._totalLoadedFilesSize += file.loadedSize;
            });
        }
        return this._totalLoadedFilesSize;
    }

    _setLoadedSize(value) {
        this._totalLoadedFilesSize = value;
    }

    _recalculateProgress() {
        this._totalFilesSize = 0;
        this._totalLoadedFilesSize = 0;
        this._updateTotalProgress(this._getTotalFilesSize(), this._getTotalLoadedFilesSize());
    }

    _getValidationMessageTarget() {
        return this._$inputWrapper;
    }

    _optionChanged(args) {
        const value = args.value;

        switch(args.name) {
            case "height":
            case "width":
                this._updateFileNameMaxWidth();
                super._optionChanged(args);
                break;
            case "value":
                !value.length && this._$fileInput.val("");

                if(!this._preventRecreatingFiles) {
                    this._createFiles();
                    this._renderFiles();
                }

                this._recalculateProgress();

                super._optionChanged(args);
                break;
            case "name":
                this._initFileInput();
                super._optionChanged(args);
                break;
            case "accept":
                this._initFileInput();
                break;
            case "multiple":
                this._initFileInput();
                if(!args.value) {
                    this.reset();
                }
                break;
            case "selectButtonText":
                this._selectButton.option("text", value);
                break;
            case "uploadButtonText":
                this._uploadButton && this._uploadButton.option("text", value);
                break;
            case "_uploadButtonType":
                this._uploadButton && this._uploadButton.option("type", value);
                break;
            case "maxFileSize":
            case "minFileSize":
            case "allowedFileExtensions":
            case "invalidFileExtensionMessage":
            case "invalidMaxFileSizeMessage":
            case "invalidMinFileSizeMessage":
            case "readyToUploadMessage":
            case "uploadedMessage":
            case "uploadFailedMessage":
                this._invalidate();
                break;
            case "labelText":
                this._$inputLabel.text(value);
                break;
            case "showFileList":
                if(!this._preventRecreatingFiles) {
                    this._renderFiles();
                }
                break;
            case "uploadFile":
            case "uploadChunk":
            case "chunkSize":
                this._setUploadStrategy();
                break;
            case "abortUpload":
            case "uploadUrl":
            case "progress":
            case "uploadMethod":
            case "uploadHeaders":
            case "extendSelection":
                break;
            case "allowCanceling":
            case "uploadMode":
                this.reset();
                this._invalidate();
                break;
            case "onUploadStarted":
                this._createUploadStartedAction();
                break;
            case "onUploaded":
                this._createUploadedAction();
                break;
            case "onProgress":
                this._createProgressAction();
                break;
            case "onUploadError":
                this._createUploadErrorAction();
                break;
            case "onUploadAborted":
                this._createUploadAbortedAction();
                break;
            case "useNativeInputClick":
                this._renderInput();
                break;
            case "useDragOver":
                this._renderDragEvents();
                break;
            case "nativeDropSupported":
                this._invalidate();
                break;
            default:
                super._optionChanged(args);
        }
    }

    reset() {
        this.option("value", []);
    }
}

///#DEBUG
FileUploader.__internals = {
    changeFileInputRenderer(renderer) {
        renderFileUploaderInput = renderer;
    },
    resetFileInputTag() {
        renderFileUploaderInput = () => $("<input>").attr("type", "file");
    }
};
///#ENDDEBUG

class FileBlobReader {
    constructor(file, chunkSize) {
        this.file = file;
        this.chunkSize = chunkSize;
        this.index = 0;
    }

    read() {
        if(!this.file) {
            return null;
        }
        const result = this.createBlobResult(this.file, this.index, this.chunkSize);
        if(result.isCompleted) {
            this.file = null;
        }
        this.index++;
        return result;
    }

    createBlobResult(file, index, chunkSize) {
        const currentPosition = index * chunkSize;
        return {
            blob: this.sliceFile(file, currentPosition, chunkSize),
            index: index,
            isCompleted: currentPosition + chunkSize >= file.size
        };
    }

    sliceFile(file, startPos, length) {
        if(file.slice) {
            return file.slice(startPos, startPos + length);
        }
        if(file.webkitSlice) {
            return file.webkitSlice(startPos, startPos + length);
        }
        return null;
    }
}

class FileUploadStrategyBase {
    constructor(fileUploader) {
        this.fileUploader = fileUploader;
    }

    upload(file) {
        if(file.isValid() && !file.uploadStarted) {
            this._prepareFileBeforeUpload(file);
            this._uploadCore(file);
        }
    }

    abortUpload(file) {
        if(file._isError || file._isLoaded || file.isAborted) {
            return;
        }

        file.request && file.request.abort();
        file.isAborted = true;

        if(this._isCustomAbortUpload()) {
            const abortUpload = this.fileUploader.option("abortUpload");
            const arg = this._createAbortUploadArgument(file);

            let deferred = null;
            try {
                const result = abortUpload(file.value, arg);
                deferred = when(result);
            } catch(error) {
                deferred = new Deferred().reject(error).promise();
            }

            deferred
                .done(() => file.onAbort.fire())
                .fail(error => this._handleFileError(file, error));
        }
    }

    _createAbortUploadArgument(file) {
    }

    _uploadCore(file) {
    }

    _isCustomAbortUpload() {
        const callback = this.fileUploader.option("abortUpload");
        return callback && isFunction(callback);
    }

    _handleFileError(file, error) {
        file._isError = true;
        file.onError.fire(error);
    }

    _prepareFileBeforeUpload(file) {
        if(file.$file) {
            this.fileUploader._createFileProgressBar(file);
        }

        file.onLoadStart.add(this._onUploadStarted.bind(this, file));
        file.onLoad.add(this._onLoadedHandler.bind(this, file));
        file.onError.add(this._onErrorHandler.bind(this, file));
        file.onAbort.add(this._onAbortHandler.bind(this, file));
        file.onProgress.add(this._onProgressHandler.bind(this, file));
    }

    _isStatusError(status) {
        return 400 <= status && status < 500 || 500 <= status && status < 600;
    }

    _onUploadStarted(file, e) {
        file.uploadStarted = true;

        this.fileUploader._uploadStartedAction({
            file: file.value,
            event: e,
            request: file.request
        });
    }

    _onAbortHandler(file, e) {
        this.fileUploader._uploadAbortedAction({
            file: file.value,
            event: e,
            request: file.request
        });
    }

    _onErrorHandler(file, error) {
        this.fileUploader._setStatusMessage(file, "uploadFailedMessage");
        this.fileUploader._uploadErrorAction({
            file: file.value,
            event: undefined,
            request: file.request,
            error
        });
    }

    _onLoadedHandler(file, e) {
        file._isLoaded = true;
        this.fileUploader._setStatusMessage(file, "uploadedMessage");
        this.fileUploader._uploadedAction({
            file: file.value,
            event: e,
            request: file.request
        });
    }

    _onProgressHandler(file, e) {
        if(file) {
            const totalFilesSize = this.fileUploader._getTotalFilesSize();
            const totalLoadedFilesSize = this.fileUploader._getTotalLoadedFilesSize();

            const loadedSize = Math.min(e.loaded, file.value.size);
            const segmentSize = loadedSize - file.loadedSize;
            file.loadedSize = loadedSize;

            this.fileUploader._updateTotalProgress(totalFilesSize, totalLoadedFilesSize + segmentSize);
            this.fileUploader._updateProgressBar(file, this._getLoadedData(loadedSize, e.total, segmentSize, e));
        }
    }

    _getLoadedData(loaded, total, currentSegmentSize, event) {
        return {
            loaded: loaded,
            total: total,
            currentSegmentSize: currentSegmentSize
        };
    }
}

class ChunksFileUploadStrategyBase extends FileUploadStrategyBase {
    constructor(fileUploader) {
        super(fileUploader);
        this.chunkSize = this.fileUploader.option("chunkSize");
    }

    _uploadCore(file) {
        const realFile = file.value;
        const chunksData = {
            name: realFile.name,
            loadedBytes: 0,
            type: realFile.type,
            blobReader: new FileBlobReader(realFile, this.chunkSize),
            guid: new Guid(),
            fileSize: realFile.size,
            count: Math.ceil(realFile.size / this.chunkSize),
            customData: {}
        };
        file.chunksData = chunksData;
        this._sendChunk(file, chunksData);
    }

    _sendChunk(file, chunksData) {
        const chunk = chunksData.blobReader.read();
        chunksData.currentChunk = chunk;
        if(chunk) {
            this._sendChunkCore(file, chunksData, chunk)
                .done(() => {
                    if(file.isAborted) {
                        return;
                    }

                    chunksData.loadedBytes += chunk.blob.size;

                    file.onProgress.fire({
                        loaded: chunksData.loadedBytes,
                        total: file.value.size
                    });

                    if(chunk.isCompleted) {
                        file.onLoad.fire();
                    }

                    this._sendChunk(file, chunksData);
                })
                .fail(error => {
                    if(this._shouldHandleError(error)) {
                        this._handleFileError(file, error);
                    }
                });
        }
    }

    _sendChunkCore(file, chunksData, chunk) {
    }

    _shouldHandleError(error) {
    }

    _tryRaiseStartLoad(file) {
        if(!file.isStartLoad) {
            file.isStartLoad = true;
            file.onLoadStart.fire();
        }
    }

    _getEvent(e) {
        return null;
    }
}

class DefaultChunksFileUploadStrategy extends ChunksFileUploadStrategyBase {

    _sendChunkCore(file, chunksData, chunk) {
        return ajax.sendRequest({
            url: this.fileUploader.option("uploadUrl"),
            method: this.fileUploader.option("uploadMethod"),
            headers: this.fileUploader.option("uploadHeaders"),
            beforeSend: xhr => {
                file.request = xhr;
            },
            upload: {
                "onloadstart": () => this._tryRaiseStartLoad(file),
                "onabort": () => file.onAbort.fire()
            },
            data: this._createFormData({
                fileName: chunksData.name,
                blobName: this.fileUploader.option("name"),
                blob: chunk.blob,
                index: chunk.index,
                count: chunksData.count,
                type: chunksData.type,
                guid: chunksData.guid,
                size: chunksData.fileSize
            })
        });
    }

    _shouldHandleError(e) {
        return this._isStatusError(e.status);
    }

    _createFormData(options) {
        const formData = new window.FormData();
        formData.append(options.blobName, options.blob);
        formData.append(FILEUPLOADER_CHUNK_META_DATA_NAME, JSON.stringify({
            FileName: options.fileName,
            Index: options.index,
            TotalCount: options.count,
            FileSize: options.size,
            FileType: options.type,
            FileGuid: options.guid
        }));
        return formData;
    }

}

class CustomChunksFileUploadStrategy extends ChunksFileUploadStrategyBase {

    _sendChunkCore(file, chunksData) {
        this._tryRaiseStartLoad(file);

        const chunksInfo = this._createChunksInfo(chunksData);
        const uploadChunk = this.fileUploader.option("uploadChunk");
        try {
            const result = uploadChunk(file.value, chunksInfo);
            return when(result);
        } catch(error) {
            return new Deferred().reject(error).promise();
        }
    }

    _createAbortUploadArgument(file) {
        return this._createChunksInfo(file.chunksData);
    }

    _shouldHandleError(e) {
        return true;
    }

    _createChunksInfo(chunksData) {
        return {
            bytesLoaded: chunksData.loadedBytes,
            chunkCount: chunksData.count,
            customData: chunksData.customData,
            chunkBlob: chunksData.currentChunk.blob,
            chunkIndex: chunksData.currentChunk.index
        };
    }

}

class WholeFileUploadStrategyBase extends FileUploadStrategyBase {

    _uploadCore(file) {
        file.loadedSize = 0;
        this._uploadFile(file)
            .done(() => {
                if(!file.isAborted) {
                    file.onLoad.fire();
                }
            })
            .fail(error => {
                if(this._shouldHandleError(file, error)) {
                    this._handleFileError(file, error);
                }
            });
    }

    _uploadFile(file) {
    }

    _shouldHandleError(file, e) {
    }

    _handleProgress(file, e) {
        if(file._isError) {
            return;
        }

        file._isProgressStarted = true;
        file.onProgress.fire(e);
    }

    _getLoadedData(loaded, total, segmentSize, event) {
        const result = super._getLoadedData(loaded, total, segmentSize, event);
        result.event = event;
        return result;
    }
}

class DefaultWholeFileUploadStrategy extends WholeFileUploadStrategyBase {

    _uploadFile(file) {
        return ajax.sendRequest({
            url: this.fileUploader.option("uploadUrl"),
            method: this.fileUploader.option("uploadMethod"),
            headers: this.fileUploader.option("uploadHeaders"),
            beforeSend: xhr => {
                file.request = xhr;
            },
            upload: {
                "onprogress": e => this._handleProgress(file, e),
                "onloadstart": () => file.onLoadStart.fire(),
                "onabort": () => file.onAbort.fire()
            },
            data: this._createFormData(this.fileUploader.option("name"), file.value)
        });
    }

    _shouldHandleError(file, e) {
        return this._isStatusError(e.status) || !file._isProgressStarted;
    }

    _createFormData(fieldName, fieldValue) {
        const formData = new window.FormData();
        formData.append(fieldName, fieldValue);
        return formData;
    }

}

class CustomWholeFileUploadStrategy extends WholeFileUploadStrategyBase {

    _uploadFile(file) {
        file.onLoadStart.fire();

        const progressCallback = loadedBytes => {
            const arg = {
                loaded: loadedBytes,
                total: file.size
            };
            this._handleProgress(file, arg);
        };

        const uploadFile = this.fileUploader.option("uploadFile");
        try {
            const result = uploadFile(file, progressCallback);
            return when(result);
        } catch(error) {
            return new Deferred().reject(error).promise();
        }
    }

    _shouldHandleError(file, e) {
        return true;
    }

}

registerComponent("dxFileUploader", FileUploader);

module.exports = FileUploader;

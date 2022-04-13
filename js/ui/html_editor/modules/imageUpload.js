import Quill from 'devextreme-quill';
import BaseModule from './base';
import eventsEngine from '../../../events/core/events_engine';
import $ from '../../../core/renderer';
import { isDefined } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';
import { urlUpload, correctSlashesInUrl } from '../utils/image_uploader_helper';
import { addNamespace } from '../../../events/utils/index';
import FileUploader from '../../file_uploader';

const MODULE_NAMESPACE = 'dxHtmlEditorImageUpload';

const HIDDEN_FILE_UPLOADER_CLASS = 'dx-htmleditor-hidden-content';
const FILE_UPLOADER_NAME = 'dx-htmleditor-image';

let ImageUploadModule = BaseModule;

if(Quill) {
    ImageUploadModule = class ImageUploadModule extends BaseModule {
        constructor(quill, options) {
            super(quill, options);

            this.options = options;
            this.quill = quill;
            this._quillContainer = this.editorInstance._getQuillContainer();

            this.addCleanCallback(this.prepareCleanCallback());
            this._handleServerUpload();
        }

        _handleServerUpload() {
            const useServerUpload = isDefined(this.options.fileUploadMode) && this.options.fileUploadMode !== 'base64';

            useServerUpload
                ? this._enableDragAndDropUploading()
                : this._disableDragAndDropUploading();
        }

        _getUploaderModule() {
            if(!this._uploaderModule) {
                this._uploaderModule = this.quill.getModule('uploader');
            }

            return this._uploaderModule;
        }

        _disableDragAndDropUploading() {
            this._getUploaderModule().preventImageUploading(false);
            this._detachEvents();
            this._fileUploader?.dispose();
        }

        _enableDragAndDropUploading() {
            this._initFileUploader();
            this._getUploaderModule().preventImageUploading(true);
            this._attachEvents();
        }

        _initFileUploader() {
            const $container = $('<div>')
                .addClass(HIDDEN_FILE_UPLOADER_CLASS)
                .appendTo(this._quillContainer);

            const fileUploaderOptions = extend({}, {
                accept: 'image/*',
                uploadUrl: this.options.uploadUrl,
                uploadMode: 'instantly',
                name: FILE_UPLOADER_NAME,
                onUploaded: this._onUploaded.bind(this),
            }, this.options.fileUploaderOptions);

            this._fileUploader = this.editorInstance._createComponent($container, FileUploader, fileUploaderOptions);

            return $container;
        }

        _onUploaded(data) {
            const selection = this.quill.getSelection();
            const pasteIndex = selection ? selection.index : this.quill.getLength();

            const imageUrl = correctSlashesInUrl(this.options.uploadDirectory) + data.file.name;
            urlUpload(this.quill, pasteIndex, { src: imageUrl });

            this.quill.setSelection(pasteIndex + 1, 0);
        }

        _attachEvents() {
            eventsEngine.on(this.quill.root, addNamespace('drop', MODULE_NAMESPACE), this._dropHandler.bind(this));
            eventsEngine.on(this.quill.root, addNamespace('paste', MODULE_NAMESPACE), this._pasteHandler.bind(this));
        }

        _detachEvents() {
            eventsEngine.off(this.quill.root, MODULE_NAMESPACE);
        }

        _dropHandler(e) {
            this._handleInsertImages(e, 'dataTransfer');
        }

        _pasteHandler(e) {
            this._handleInsertImages(e, 'clipboardData');
        }

        _handleInsertImages(e, filesField) {
            this.saveValueChangeEvent(e);
            const files = Array.from(e.originalEvent[filesField].files || []);

            const uploads = files;

            if(uploads.length > 0) {
                e.preventDefault();
                e.stopPropagation();
                this._fileUploader.option('value', uploads);
                this._fileUploader.upload();
            }
        }

        clean() {
            this._disableDragAndDropUploading();
        }

        prepareCleanCallback() {
            return () => {
                this.clean();
            };
        }

        option(option, value) {
            if(option === 'imageUpload') {
                this.handleOptionChangeValue(value);
                return;
            }

            if(option === 'fileUploadMode') {
                this.options.fileUploadMode = value;
                this._handleServerUpload();
            } else if(option === 'fileUploaderOptions') {
                this._fileUploader.option(value);
            }
        }
    };
}

export default ImageUploadModule;

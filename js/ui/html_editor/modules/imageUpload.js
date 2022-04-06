import Quill from 'devextreme-quill';
import BaseModule from './base';
import eventsEngine from '../../../events/core/events_engine';
import $ from '../../../core/renderer';
import { isDefined } from '../../../core/utils/type';
// import { getFormatHandlers, getDefaultClickHandler, ICON_MAP } from '../utils/toolbar_helper'
import { urlUpload } from '../utils/image_uploader_helper';
import { addNamespace } from '../../../events/utils/index';
import FileUploader from '../../file_uploader';

const MODULE_NAMESPACE = 'dxHtmlEditorImageUpload';

const IMAGE_UPLOAD_EVENT = addNamespace('dxcontextmenu', MODULE_NAMESPACE);

const HIDDEN_FILE_UPLOADER_CLASS = 'dx-htmleditor-hidden-content';

let ImageUploadModule = BaseModule;

if(Quill) {
    ImageUploadModule = class ImageUploadModule extends BaseModule {
        constructor(quill, options) {

            super(quill, options);

            this.options = options;
            this.quill = quill;

            this._quillContainer = this.editorInstance._getQuillContainer();

            this.addCleanCallback(this.prepareCleanCallback());
            // this._formatHandlers = getFormatHandlers(this);
            // this._tableFormats = getTableFormats(quill);
            this._handleServerUpload();

        }

        _handleServerUpload() {
            const useServerUpload = isDefined(this.options.fileUploadMode) && this.options.fileUploadMode !== 'base64';

            if(useServerUpload) {
                this._enableDragAndDropUploading();
            } else {
                this._disableDragAndDropUploading();
            }
        }


        _getUploaderModule() {
            if(!this._uploaderModule) {
                this._uploaderModule = this.quill.getModule('uploader');
            }

            return this._uploaderModule;
        }

        _disableDragAndDropUploading() {
            this._getUploaderModule().preventImageUpload = false;
            this._detachEvents();
        }

        _enableDragAndDropUploading() {
            this._initFileUploader();

            // quill.getModule('uploader').removeDropHandler();
            this._getUploaderModule().preventImageUpload = true;
            this._attachEvents();
        }

        _initFileUploader() {
            const $container = $('<div>')
                .addClass(HIDDEN_FILE_UPLOADER_CLASS)
                .appendTo(this._quillContainer);

            const fileUploaderOptions = {
                accept: 'image/*',
                uploadUrl: this.options.uploadUrl,
                uploadMode: 'instantly',
            };

            this.editorInstance._createComponent($container, FileUploader, fileUploaderOptions);

            this._fileUploader = $container.dxFileUploader('instance');


            return $container;
        }

        _attachEvents() {
            eventsEngine.on(this.quill.root, 'drop', this._dropHandler.bind(this));
            eventsEngine.on(this.quill.root, addNamespace('paste', MODULE_NAMESPACE), this._pasteHandler.bind(this));
        }

        _detachEvents() {
            eventsEngine.off(this.editorInstance._getContent(), IMAGE_UPLOAD_EVENT);
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
            const selection = this.quill.getSelection();
            let pasteIndex = selection ? selection.index : this.quill.getLength();

            const uploads = files.filter((file) => this._isImage(file));

            uploads.forEach((file) => {
                const imageUrl = this.options.uploadDirectory + file.name;
                urlUpload(this.quill, pasteIndex, { src: imageUrl });
                pasteIndex++;
            });

            if(uploads.length > 0) {
                e.preventDefault();
                e.stopPropagation();
                this._fileUploader.option('value', uploads);
                this._fileUploader.upload();
            }
        }

        _isImage(file) {
            return !!file.type.match(/^image\/(a?png|bmp|gif|p?jpe?g|svg|vnd\.microsoft\.icon|webp)/i);
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
            }
        }
    };
}

export default ImageUploadModule;

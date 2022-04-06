import Quill from 'devextreme-quill';
import BaseModule from './base';
import eventsEngine from '../../../events/core/events_engine';
import $ from '../../../core/renderer';
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

            this._quillContainer = this.editorInstance._getQuillContainer();

            this.addCleanCallback(this.prepareCleanCallback());
            // this._formatHandlers = getFormatHandlers(this);
            // this._tableFormats = getTableFormats(quill);

            const useServerUpload = this.options.fileUploadMode !== 'base64';

            if(useServerUpload) {
                this._enableDragAndDropUploading(quill);
            }
        }

        _enableDragAndDropUploading(quill) {
            this._initFileUploader();

            // quill.getModule('uploader').removeDropHandler();
            quill.getModule('uploader').preventImageUpload = true;
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
            this.saveValueChangeEvent(e);

            const dataTransfer = e.originalEvent.dataTransfer;
            // const hasFiles = dataTransfer?.files?.length;
            const file = dataTransfer.files[0];

            const imageUrl = this.options.uploadDirectory + file.name;

            const selection = this.quill.getSelection();
            const pasteIndex = selection ? selection.index : this.quill.getLength();

            // const uploads = [];
            if(this._isImage(file)) {
                // e.preventDefault();
                // e.stopPropagation();
                this._fileUploader.upload(file);
                urlUpload(this.quill, pasteIndex, { src: imageUrl });
            // this._fileUploader.option('value', [file]);
            }

            // if(uploads.length >= 0) {
            //     this._fileUploader.upload(file);
            // }
        }

        _pasteHandler(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        _isImage(file) {
            return !!file.type.match(/^image\/(a?png|bmp|gif|p?jpe?g|svg|vnd\.microsoft\.icon|webp)/i);
        }

        clean() {
            this._detachEvents();
        }

        prepareCleanCallback() {
            return () => {
                this.clean();
            };
        }
    };
}

export default ImageUploadModule;

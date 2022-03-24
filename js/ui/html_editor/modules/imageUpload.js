import Quill from 'devextreme-quill';
import BaseModule from './base';
import eventsEngine from '../../../events/core/events_engine';
import $ from '../../../core/renderer';
// import { getFormatHandlers, getDefaultClickHandler, ICON_MAP } from '../utils/toolbar_helper';
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
            this.enabled = !!options.enabled;
            this._quillContainer = this.editorInstance._getQuillContainer();

            this.addCleanCallback(this.prepareCleanCallback());
            // this._formatHandlers = getFormatHandlers(this);
            // this._tableFormats = getTableFormats(quill);

            const useServerUpload = options.mode === 'both';

            if(useServerUpload) {
                this._enableDragAndDropUploading(quill);
            }
        }

        _enableDragAndDropUploading(quill) {
            this._fileUploader = this._initFileUploader();

            quill.getModule('uploader').removeDropHandler();
            this._attachEvents();
        }

        _initFileUploader() {
            const $container = $('<div>')
                .addClass(HIDDEN_FILE_UPLOADER_CLASS)
                .appendTo(this._quillContainer);

            const fileUploaderOptions = {};

            // $element.
            this.editorInstance._createComponent($container, FileUploader, fileUploaderOptions);


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
            // debugger;
            e.preventDefault();
            e.stopPropagation();


            // e.originalEvent.preventDefault();
            // e.originalEvent.stopPropagation();
        }

        _pasteHandler(e) {

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

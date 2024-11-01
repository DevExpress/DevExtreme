import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import FileUploader from '@js/ui/file_uploader';
import Quill from 'devextreme-quill';

import { getFileUploaderBaseOptions, serverUpload } from '../utils/m_image_uploader_helper';
import BaseModule from './m_base';

const MODULE_NAMESPACE = 'dxHtmlEditorImageUpload';

const HIDDEN_FILE_UPLOADER_CLASS = 'dx-htmleditor-hidden-content';
// eslint-disable-next-line import/no-mutable-exports
let ImageUploadModule = BaseModule;

if (Quill) {
  // @ts-expect-error
  ImageUploadModule = class ImageUploadModule extends BaseModule {
    quill: any;

    options: any;

    _quillContainer: any;

    editorInstance: any;

    _uploaderModule: any;

    _fileUploader!: FileUploader;

    constructor(quill, options) {
      // @ts-expect-error
      super(quill, options);

      this.options = options;
      this._quillContainer = this.editorInstance._getQuillContainer();
      // @ts-expect-error
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
      if (!this._uploaderModule) {
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

      const fileUploaderOptions = extend({}, getFileUploaderBaseOptions(), {
        uploadUrl: this.options.uploadUrl,
        onUploaded: this._onUploaded.bind(this),
      }, this.options.fileUploaderOptions);

      this._fileUploader = this.editorInstance._createComponent($container, FileUploader, fileUploaderOptions);

      return $container;
    }

    _onUploaded(data) {
      const { index: pasteIndex } = this.quill.getSelection() ?? { index: this.quill.getLength() };
      serverUpload(this.options.uploadDirectory, data.file.name, this.quill, pasteIndex);
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
      // @ts-expect-error
      this.saveValueChangeEvent(e);
      const files = Array.from(e.originalEvent[filesField].files || []);

      const uploads = files;

      if (uploads.length) {
        e.preventDefault();
        e.stopPropagation();
        // @ts-expect-error
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
      // eslint-disable-next-line default-case
      switch (option) {
        case 'imageUpload':
          // @ts-expect-error
          this.handleOptionChangeValue(value);
          break;
        case 'fileUploadMode':
          this.options.fileUploadMode = value;
          this._handleServerUpload();
          break;
        case 'fileUploaderOptions':
          this._fileUploader.option(value);
      }
    }
  };
}

export default ImageUploadModule;

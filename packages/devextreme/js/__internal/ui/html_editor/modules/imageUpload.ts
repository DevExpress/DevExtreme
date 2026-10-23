import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { UploadedEvent } from '@js/ui/file_uploader';
import FileUploader from '@js/ui/file_uploader';
import type { dxHtmlEditorImageUpload } from '@js/ui/html_editor';
import Quill from 'devextreme-quill';

import type { QuillInstance, UploaderModule } from '../types/quill';
import { getFileUploaderBaseOptions, serverUpload } from '../utils/image_uploader_helper';
import type { BaseModuleOptions } from './base';
import BaseModule from './base';

const MODULE_NAMESPACE = 'dxHtmlEditorImageUpload';

const HIDDEN_FILE_UPLOADER_CLASS = 'dx-htmleditor-hidden-content';

type ImageUploadModuleOptions = BaseModuleOptions & dxHtmlEditorImageUpload;

type FilesField = 'dataTransfer' | 'clipboardData';

// eslint-disable-next-line import/no-mutable-exports
let ImageUploadModule = BaseModule;

if (Quill) {
  ImageUploadModule = class extends BaseModule {
    declare options: ImageUploadModuleOptions;

    _quillContainer: dxElementWrapper;

    _uploaderModule?: UploaderModule;

    _fileUploader?: FileUploader;

    constructor(quill: QuillInstance, options: ImageUploadModuleOptions) {
      super(quill, options);

      this.options = options;
      this._quillContainer = this.editorInstance._getQuillContainer();
      this.addCleanCallback(this.prepareCleanCallback());
      this._handleServerUpload();
    }

    _handleServerUpload(): void {
      const useServerUpload = isDefined(this.options.fileUploadMode)
        && this.options.fileUploadMode !== 'base64';

      if (useServerUpload) {
        this._enableDragAndDropUploading();
      } else {
        this._disableDragAndDropUploading();
      }
    }

    _getUploaderModule(): UploaderModule {
      this._uploaderModule ??= this.quill.getModule('uploader');

      return this._uploaderModule;
    }

    _disableDragAndDropUploading(): void {
      this._getUploaderModule().preventImageUploading(false);
      this._detachEvents();
      this.removeFileUploader();
    }

    _enableDragAndDropUploading(): void {
      this.removeFileUploader();
      this._initFileUploader();
      this._getUploaderModule().preventImageUploading(true);
      this._attachEvents();
    }

    _initFileUploader(): dxElementWrapper {
      const $container = $('<div>')
        .addClass(HIDDEN_FILE_UPLOADER_CLASS)
        .appendTo(this._quillContainer);

      const fileUploaderOptions = extend({}, getFileUploaderBaseOptions(), {
        uploadUrl: this.options.uploadUrl,
        onUploaded: this._onUploaded.bind(this),
      }, this.options.fileUploaderOptions);

      this._fileUploader = this.editorInstance._createComponent(
        $container,
        FileUploader,
        fileUploaderOptions,
      );

      return $container;
    }

    removeFileUploader(): void {
      this._fileUploader?.$element().remove();
      this._fileUploader = undefined;
    }

    _onUploaded(data: UploadedEvent): void {
      const { index: pasteIndex } = this.quill.getSelection() ?? { index: this.quill.getLength() };
      serverUpload(this.options.uploadDirectory, data.file.name, this.quill, pasteIndex);
    }

    _attachEvents(): void {
      eventsEngine.off(this.quill.root, `.${MODULE_NAMESPACE}`);
      eventsEngine.on(this.quill.root, addNamespace('drop', MODULE_NAMESPACE), this._dropHandler.bind(this));
      eventsEngine.on(this.quill.root, addNamespace('paste', MODULE_NAMESPACE), this._pasteHandler.bind(this));
    }

    _detachEvents(): void {
      eventsEngine.off(this.quill.root, `.${MODULE_NAMESPACE}`);
    }

    _dropHandler(e: DxEvent<DragEvent>): void {
      this._handleInsertImages(e, 'dataTransfer');
    }

    _pasteHandler(e: DxEvent<ClipboardEvent>): void {
      this._handleInsertImages(e, 'clipboardData');
    }

    _handleInsertImages<TField extends FilesField>(
      e: DxEvent<Record<TField, DataTransfer | null>>,
      filesField: TField,
    ): void {
      this.saveValueChangeEvent(e);
      // @ts-expect-error dataTransfer and clipboardData are typed as nullable
      const files = Array.from(e.originalEvent[filesField].files || []);

      const uploads = files;

      if (uploads.length) {
        e.preventDefault();
        e.stopPropagation();
        // @ts-expect-error the file uploader exists while server upload is on
        this._fileUploader.option('value', uploads);
        // @ts-expect-error the file uploader exists while server upload is on
        this._fileUploader.upload();
      }
    }

    clean(): void {
      this._disableDragAndDropUploading();
    }

    prepareCleanCallback(): () => void {
      return () => {
        this.clean();
      };
    }

    option(option: string, value: unknown): void {
      // eslint-disable-next-line default-case
      switch (option) {
        case 'imageUpload':
          this.handleOptionChangeValue(value);
          break;
        case 'fileUploadMode':
          // @ts-expect-error the option value is untyped (HtmlEditor._moduleOptionChanged)
          this.options.fileUploadMode = value;
          this._handleServerUpload();
          break;
        case 'uploadDirectory':
          // @ts-expect-error the option value is untyped (HtmlEditor._moduleOptionChanged)
          this.options.uploadDirectory = value;
          break;
        case 'fileUploaderOptions':
          this.options.fileUploaderOptions = extend(
            true,
            {},
            this.options.fileUploaderOptions,
            value,
          );
          // @ts-expect-error the option value is untyped (HtmlEditor._moduleOptionChanged)
          this._fileUploader?.option(value);
      }
    }
  };
}

export default ImageUploadModule;

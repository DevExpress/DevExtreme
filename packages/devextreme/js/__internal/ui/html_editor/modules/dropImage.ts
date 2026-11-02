import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import browser from '@js/core/utils/browser';
import { each } from '@js/core/utils/iterator';
import { getWindow } from '@js/core/utils/window';
import type { DxEvent } from '@js/events';
import Quill from 'devextreme-quill';

import type { QuillInstance } from '../types/quill';
import type { BaseModuleOptions } from './base';
import BaseModule from './base';

// eslint-disable-next-line import/no-mutable-exports
let DropImageModule = BaseModule;

if (Quill) {
  DropImageModule = class extends BaseModule {
    constructor(quill: QuillInstance, options: BaseModuleOptions) {
      super(quill, options);

      // @ts-expect-error NAME is typed as optional; the Component constructor always sets it
      const widgetName: string = this.editorInstance.NAME;

      eventsEngine.on(this.quill.root, addNamespace('drop', widgetName), this._dropHandler.bind(this));
      eventsEngine.on(this.quill.root, addNamespace('paste', widgetName), this._pasteHandler.bind(this));
    }

    _dropHandler(e: DxEvent<DragEvent>): void {
      const { dataTransfer } = e.originalEvent;
      const hasFiles = dataTransfer?.files?.length;
      this.saveValueChangeEvent(e);
      e.preventDefault();
      if (hasFiles) {
        this._getImage(dataTransfer.files, this._addImage.bind(this));
      }
    }

    _pasteHandler(e: DxEvent<ClipboardEvent>): void {
      const { clipboardData } = e.originalEvent;
      this.saveValueChangeEvent(e);

      if (!clipboardData) {
        return;
      }

      const hasDataItems = clipboardData.items?.length;
      const isHtmlData = clipboardData.getData('text/html');

      if (!isHtmlData && hasDataItems) {
        this._getImage(clipboardData.items, (imageData) => {
          if (browser.mozilla) {
            return;
          }

          this._addImage(imageData);
        });
      }
    }

    _isImage(file: File | DataTransferItem): boolean {
      return !!/^image\/(a?png|bmp|gif|p?jpe?g|svg|vnd\.microsoft\.icon|webp)/i.exec(file.type);
    }

    _getImage(
      files: FileList | DataTransferItemList,
      callback: (imageData: string) => void,
    ): void {
      const window = getWindow();
      each(files, (index, file) => {
        if (!this._isImage(file)) {
          return;
        }
        // @ts-expect-error FileReader is a global, not a Window member
        const reader: FileReader = new window.FileReader();
        reader.onload = ({ target }): void => {
          // @ts-expect-error target is the reader; result is its data URL after readAsDataURL()
          callback(target.result);
        };

        // @ts-expect-error getAsFile() tells a DataTransferItem from a File
        const readableFile = file.getAsFile ? file.getAsFile() : file;
        // @ts-expect-error Blob is a global, not a Window member
        if (readableFile instanceof window.Blob) {
          reader.readAsDataURL(readableFile);
        }
      });
    }

    _addImage(data: string): void {
      const selection = this.quill.getSelection();
      const pasteIndex = selection ? selection.index : this.quill.getLength();

      this.quill.insertEmbed(pasteIndex, 'extendedImage', data, 'user');
    }
  };
}

export default DropImageModule;

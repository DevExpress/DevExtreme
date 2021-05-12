import Quill from 'devextreme-quill';

import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils/index';
import { each } from '../../../core/utils/iterator';
import browser from '../../../core/utils/browser';
import { getWindow } from '../../../core/utils/window';

import BaseModule from './base';

let DropImageModule = BaseModule;

if(Quill) {
    DropImageModule = class DropImageModule extends BaseModule {
        constructor(quill, options) {
            super(quill, options);

            const widgetName = this.editorInstance.NAME;

            eventsEngine.on(this.quill.root, addNamespace('dragover', widgetName), this._dragOverHandler.bind(this));
            eventsEngine.on(this.quill.root, addNamespace('drop', widgetName), this._dropHandler.bind(this));
            eventsEngine.on(this.quill.root, addNamespace('paste', widgetName), this._pasteHandler.bind(this));
        }

        _dragOverHandler() {}

        _dropHandler(e) {
            const dataTransfer = e.originalEvent.dataTransfer;
            const hasFiles = dataTransfer?.files?.length;

            this.saveValueChangeEvent(e);
            e.preventDefault();
            if(hasFiles) {
                this._getImage(dataTransfer.files, this._addImage.bind(this));
            }
        }

        _pasteHandler(e) {
            const { clipboardData } = e.originalEvent;

            this.saveValueChangeEvent(e);

            if(!clipboardData) {
                return;
            }

            const hasDataItems = clipboardData.items?.length;
            const isHtmlData = clipboardData.getData('text/html');

            if(!isHtmlData && hasDataItems) {
                this._getImage(clipboardData.items, (imageData) => {
                    if(this._isBrowserSupportImagePaste(browser)) {
                        return;
                    }

                    this._addImage(imageData);
                });
            }
        }

        _isBrowserSupportImagePaste({ mozilla, chrome, version }) {
            return mozilla ||
                chrome && version > 82; // T894297
        }

        _isImage(file) {
            return !!file.type.match(/^image\/(a?png|bmp|gif|p?jpe?g|svg|vnd\.microsoft\.icon|webp)/i);
        }

        _getImage(files, callback) {
            const window = getWindow();
            each(files, (index, file) => {
                if(!this._isImage(file)) {
                    return;
                }

                const reader = new window.FileReader();
                reader.onload = ({ target }) => {
                    callback(target.result);
                };

                const readableFile = file.getAsFile ? file.getAsFile() : file;
                if(readableFile instanceof window.Blob) {
                    reader.readAsDataURL(readableFile);
                }
            });
        }

        _addImage(data) {
            const selection = this.quill.getSelection();
            const pasteIndex = selection ? selection.index : this.quill.getLength();

            this.quill.insertEmbed(pasteIndex, 'extendedImage', data, 'user');
        }
    };
}

export default DropImageModule;

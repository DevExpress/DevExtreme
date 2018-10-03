import { getQuill } from "../quill_importer";

import eventsEngine from "../../../events/core/events_engine";
import eventUtils from "../../../events/utils";
import { each } from "../../../core/utils/iterator";
import browser from "../../../core/utils/browser";

const BaseModule = getQuill().import("core/module");

class DropImageModule extends BaseModule {
    constructor(quill, options) {
        super(quill, options);

        this.editorInstance = options.editorInstance;
        const widgetName = this.editorInstance.NAME;

        eventsEngine.on(this.quill.root, eventUtils.addNamespace("dragover", widgetName), this._dragOverHandler.bind(this));
        eventsEngine.on(this.quill.root, eventUtils.addNamespace("drop", widgetName), this._dropHandler.bind(this));
        eventsEngine.on(this.quill.root, eventUtils.addNamespace("paste", widgetName), this._pasteHandler.bind(this));
    }

    _dragOverHandler(e) {
        if(browser.msie) {
            e.preventDefault();
        }
    }

    _dropHandler(e) {
        const dataTransfer = e.originalEvent.dataTransfer;
        const hasFiles = dataTransfer && dataTransfer.files && dataTransfer.files.length;

        e.preventDefault();
        if(hasFiles) {
            this._getImage(dataTransfer.files, this._addImage.bind(this));
        }
    }

    _pasteHandler(e) {
        const data = e.originalEvent.clipboardData;
        const hasDataItems = data && data.items && data.items.length;
        if(hasDataItems) {
            this._getImage(data.items, (imageData) => {
                if(browser.mozilla) {
                    return;
                }

                if(browser.msie) {
                    setTimeout(() => { this._addImage(imageData); });
                } else {
                    this._addImage(imageData);
                }
            });
        }
    }

    _isImage(file) {
        return !!file.type.match(/^image\/(a?png|bmp|gif|p?jpe?g|svg|vnd\.microsoft\.icon|webp)/i);
    }

    _getImage(files, callback) {
        each(files, (index, file) => {
            if(!this._isImage(file)) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                callback(e.target.result);
            };

            const readableFile = file.getAsFile ? file.getAsFile() : file;
            if(readableFile instanceof Blob) {
                reader.readAsDataURL(readableFile);
            }
        });
    }

    _addImage(data) {
        const selection = this.quill.getSelection();
        const pasteIndex = selection ? selection.index : this.quill.getLength();

        this.quill.insertEmbed(pasteIndex, "image", data, "user");
    }
}

module.exports = DropImageModule;

import Quill from 'devextreme-quill';
import BaseModule from './base';
import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils/index';

const MODULE_NAMESPACE = 'dxHtmlEditorImageCursor';
const clickEvent = addNamespace('dxclick', MODULE_NAMESPACE);

let ImageCursorModule = BaseModule;

if(Quill) {
    ImageCursorModule = class ImageCursorModule extends BaseModule {
        constructor(quill, options) {
            super(quill, options);

            this.addCleanCallback(this.clean.bind(this));
            this._attachEvents();
        }

        _attachEvents() {
            eventsEngine.on(this.quill.root, clickEvent, this._clickHandler.bind(this));
        }

        _detachEvents() {
            eventsEngine.off(this.quill.root, clickEvent);
        }

        _clickHandler(e) {
            if(this._isAllowedTarget(e.target)) {
                this._adjustSelection(e);
            }
        }

        _isAllowedTarget(targetElement) {
            return this._isImage(targetElement);
        }

        _isImage(targetElement) {
            return targetElement.tagName.toUpperCase() === 'IMG';
        }

        _adjustSelection(e) {
            const blot = this.quill.scroll.find(e.target);
            if(blot) {
                const index = blot.offset(this.quill.scroll);
                this.quill.setSelection(index + 1, 0);
            } else {
                this.quill.setSelection(0, 0);
            }
        }

        clean() {
            this._detachEvents();
        }
    };
}

export default ImageCursorModule;

import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import Quill from 'devextreme-quill';

import BaseModule from './m_base';

const MODULE_NAMESPACE = 'dxHtmlEditorImageCursor';
const clickEvent = addNamespace('dxclick', MODULE_NAMESPACE);
// eslint-disable-next-line import/no-mutable-exports
let ImageCursorModule = BaseModule;

if (Quill) {
  // @ts-expect-error
  ImageCursorModule = class ImageCursorModule extends BaseModule {
    quill: any;

    constructor(quill, options) {
      // @ts-expect-error
      super(quill, options);
      // @ts-expect-error
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
      if (this._isAllowedTarget(e.target)) {
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
      if (blot) {
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

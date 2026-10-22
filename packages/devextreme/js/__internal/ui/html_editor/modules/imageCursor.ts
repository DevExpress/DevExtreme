import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import type { DxEvent } from '@js/events';
import Quill from 'devextreme-quill';

import type { QuillInstance } from '../types/quill';
import type { BaseModuleOptions } from './base';
import BaseModule from './base';

const MODULE_NAMESPACE = 'dxHtmlEditorImageCursor';
const clickEvent = addNamespace('dxclick', MODULE_NAMESPACE);
// eslint-disable-next-line import/no-mutable-exports
let ImageCursorModule = BaseModule;

if (Quill) {
  ImageCursorModule = class extends BaseModule {
    constructor(quill: QuillInstance, options: BaseModuleOptions) {
      super(quill, options);
      this.addCleanCallback(this.clean.bind(this));
      this._attachEvents();
    }

    _attachEvents(): void {
      eventsEngine.on(this.quill.root, clickEvent, this._clickHandler.bind(this));
    }

    _detachEvents(): void {
      eventsEngine.off(this.quill.root, clickEvent);
    }

    _clickHandler(e: DxEvent): void {
      if (this._isAllowedTarget(e.target)) {
        this._adjustSelection(e);
      }
    }

    _isAllowedTarget(targetElement: Element): boolean {
      return this._isImage(targetElement);
    }

    _isImage(targetElement: Element): boolean {
      return targetElement.tagName.toUpperCase() === 'IMG';
    }

    _adjustSelection(e: DxEvent): void {
      const blot = this.quill.scroll.find(e.target);
      if (blot) {
        const index = blot.offset(this.quill.scroll);
        this.quill.setSelection(index + 1, 0);
      } else {
        this.quill.setSelection(0, 0);
      }
    }

    clean(): void {
      this._detachEvents();
    }
  };
}

export default ImageCursorModule;

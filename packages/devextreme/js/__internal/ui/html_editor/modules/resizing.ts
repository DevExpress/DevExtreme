import { move } from '@js/common/core/animation/translator';
import { name as ClickEvent } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, normalizeKeyName } from '@js/common/core/events/utils/index';
import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import {
  getHeight, getOuterHeight, getOuterWidth, getWidth,
} from '@js/core/utils/size';
import type { DxEvent } from '@js/events';
import type { dxHtmlEditorMediaResizing } from '@js/ui/html_editor';
import Resizable from '@js/ui/resizable';
import Quill from 'devextreme-quill';

import type { QuillInstance } from '../types/quill';
import type { BaseModuleOptions } from './base';
import BaseModule from './base';

const DX_RESIZE_FRAME_CLASS = 'dx-resize-frame';
const DX_TOUCH_DEVICE_CLASS = 'dx-touch-device';
const MODULE_NAMESPACE = 'dxHtmlResizingModule';

const KEYDOWN_EVENT = addNamespace('keydown', MODULE_NAMESPACE);
const SCROLL_EVENT = addNamespace('scroll', MODULE_NAMESPACE);
const MOUSEDOWN_EVENT = addNamespace('mousedown', MODULE_NAMESPACE);

const FRAME_PADDING = 1;

type ResizingModuleOptions = BaseModuleOptions & dxHtmlEditorMediaResizing;

export default class ResizingModule extends BaseModule {
  allowedTargets: string[];

  enabled: boolean;

  _hideFrameWithContext: () => void;

  _framePositionChangedHandler: () => void;

  _$target?: Element | null;

  resizable?: Resizable;

  _$resizeFrame?: dxElementWrapper;

  constructor(quill: QuillInstance, options: ResizingModuleOptions) {
    super(quill, options);
    this.allowedTargets = options.allowedTargets || ['image'];
    this.enabled = !!options.enabled;
    this._hideFrameWithContext = this.hideFrame.bind(this);
    this._framePositionChangedHandler = this._prepareFramePositionChangedHandler();
    this.addCleanCallback(this.clean.bind(this));

    if (this.enabled) {
      this._attachEvents();
      this._createResizeFrame();
    }
  }

  _attachEvents(): void {
    eventsEngine.on(
      this.quill.root,
      addNamespace(ClickEvent, MODULE_NAMESPACE),
      this._clickHandler.bind(this),
    );
    eventsEngine.on(this.quill.root, SCROLL_EVENT, this._framePositionChangedHandler);
    this.editorInstance.on('focusOut', this._hideFrameWithContext);
    this.quill.on('text-change', this._framePositionChangedHandler);
  }

  _detachEvents(): void {
    eventsEngine.off(this.quill.root, `.${MODULE_NAMESPACE}`);
    this.editorInstance.off('focusOut', this._hideFrameWithContext);
    this.quill.off('text-change', this._framePositionChangedHandler);
  }

  _clickHandler(e: DxEvent): void {
    if (this._isAllowedTarget(e.target)) {
      if (this._$target === e.target) {
        return;
      }

      this._$target = e.target;
      const $target = $(this._$target);
      const minWidth = Math.max(
        getOuterWidth($target) - getWidth($target),
        // @ts-expect-error resizable exists while enabled; minWidth is typed as optional
        this.resizable.option('minWidth'),
      );
      const minHeight = Math.max(
        getOuterHeight($target) - getHeight($target),
        // @ts-expect-error resizable exists while enabled; minHeight is typed as optional
        this.resizable.option('minHeight'),
      );

      // @ts-expect-error resizable exists while enabled
      this.resizable.option({ minWidth, minHeight });

      this.updateFramePosition();
      this.showFrame();
      this._adjustSelection();
    } else if (this._$target) {
      this.hideFrame();
    }
  }

  _prepareFramePositionChangedHandler(): () => void {
    return () => {
      if (this._$target) {
        this.updateFramePosition();
      }
    };
  }

  _adjustSelection(): void {
    if (!this.quill.getSelection()) {
      this.quill.setSelection(0, 0);
    }
  }

  _isAllowedTarget(targetElement: Element): boolean {
    return this._isImage(targetElement);
  }

  _isImage(targetElement: Element): boolean {
    return this.allowedTargets.includes('image') && targetElement.tagName.toUpperCase() === 'IMG';
  }

  showFrame(): void {
    // @ts-expect-error the resize frame exists while enabled
    this._$resizeFrame.show();
    eventsEngine.on(this.quill.root, KEYDOWN_EVENT, this._handleFrameKeyDown.bind(this));
  }

  _handleFrameKeyDown(e: DxEvent<KeyboardEvent>): void {
    const keyName = normalizeKeyName(e);
    if (keyName === 'del' || keyName === 'backspace') {
      this._deleteImage();
    }
    this.hideFrame();
  }

  hideFrame(): void {
    this._$target = null;
    // @ts-expect-error the resize frame exists while enabled
    this._$resizeFrame.hide();
    eventsEngine.off(this.quill.root, KEYDOWN_EVENT);
  }

  updateFramePosition(): void {
    const {
      height, width, top: targetTop, left: targetLeft,
    } = getBoundingRect(this._$target);
    const { top: containerTop, left: containerLeft } = getBoundingRect(this.quill.root);
    const borderWidth = this._getBorderWidth();

    // @ts-expect-error the resize frame exists while enabled
    this._$resizeFrame
      .css({
        height,
        width,
        padding: FRAME_PADDING,
        top: targetTop - containerTop - borderWidth - FRAME_PADDING,
        left: targetLeft - containerLeft - borderWidth - FRAME_PADDING,
      });
    move(this._$resizeFrame, { left: 0, top: 0 });
  }

  _getBorderWidth(): number {
    // @ts-expect-error the resize frame exists while enabled
    // eslint-disable-next-line radix
    return parseInt(this._$resizeFrame.css('borderTopWidth') ?? '');
  }

  _createResizeFrame(): void {
    if (this._$resizeFrame) {
      return;
    }

    const { deviceType } = devices.current();

    this._$resizeFrame = $('<div>')
      .addClass(DX_RESIZE_FRAME_CLASS)
      .toggleClass(DX_TOUCH_DEVICE_CLASS, deviceType !== 'desktop')
      .appendTo(this.editorInstance._getQuillContainer())
      .hide();

    eventsEngine.on(this._$resizeFrame, MOUSEDOWN_EVENT, (e: DxEvent) => {
      e.preventDefault();
    });

    this.resizable = this.editorInstance._createComponent(this._$resizeFrame, Resizable, {
      onResize: (e) => {
        if (!this._$target) {
          return;
        }
        $(this._$target).attr({
          height: e.height,
          width: e.width,
        });
        this.updateFramePosition();
      },
    });
  }

  _deleteImage(): void {
    // @ts-expect-error _$target is set while the frame is shown
    if (this._isAllowedTarget(this._$target)) {
      Quill.find(this._$target)?.deleteAt(0);
    }
  }

  option(option: string, value: unknown): void {
    if (option === 'mediaResizing') {
      this.handleOptionChangeValue(value);
      return;
    }

    if (option === 'enabled') {
      if (this.enabled === value) {
        return;
      }
      // @ts-expect-error the option value is untyped (HtmlEditor._moduleOptionChanged)
      this.enabled = value;
      if (value) {
        this._attachEvents();
        this._createResizeFrame();
      } else {
        this.clean();
      }
    } else if (option === 'allowedTargets' && Array.isArray(value)) {
      this.allowedTargets = value;
    }
  }

  clean(): void {
    this._detachEvents();
    this._$resizeFrame?.remove();
    this._$resizeFrame = undefined;
    this._$target = null;
    this.enabled = false;
  }
}

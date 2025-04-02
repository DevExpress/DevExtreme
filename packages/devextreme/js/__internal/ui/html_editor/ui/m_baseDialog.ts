import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import {
  // @ts-expect-error
  getCurrentScreenFactor,
  hasWindow,
} from '@js/core/utils/window';
import Popup from '@js/ui/popup';

const DIALOG_CLASS = 'dx-formdialog';

abstract class BaseDialog {
  _editorInstance?: any;

  _popupUserConfig?: any;

  _popup!: Popup;

  deferred?: DeferredObj<unknown>;

  constructor(editorInstance, popupConfig) {
    this._editorInstance = editorInstance;
    this._popupUserConfig = popupConfig;

    this._renderPopup();
    this._attachOptionChangedHandler();
  }

  protected _attachOptionChangedHandler() {
    this._popup?.on('optionChanged', ({ name, value }) => {
      if (name === 'title') {
        this._onTitleChanged(value);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onTitleChanged(_value?: unknown): void {}

  _renderPopup() {
    const editorInstance = this._editorInstance;
    const $container = $('<div>')
      .addClass(DIALOG_CLASS)
      .appendTo(editorInstance.$element());
    const popupConfig = this._getPopupConfig();

    return editorInstance._createComponent($container, Popup, popupConfig);
  }

  _escKeyHandler() {
    this._popup.hide();
  }

  _addEscapeHandler(e) {
    e.component.registerKeyHandler('escape', this._escKeyHandler.bind(this));
  }

  _isSmallScreen() {
    const screenFactor = hasWindow() ? getCurrentScreenFactor() : null;
    return devices.real().deviceType === 'phone' || screenFactor === 'xs';
  }

  protected _getPopupConfig(): object {
    return extend({
      onInitialized: (e) => {
        this._popup = e.component;
        this._popup.on('hiding', () => this.onHiding());
      },
      deferRendering: false,
      focusStateEnabled: false,
      fullScreen: this._isSmallScreen(),
      _wrapperClassExternal: DIALOG_CLASS,
      contentTemplate: (contentElem) => {
        this._renderContent($(contentElem));
      },
    }, this._popupUserConfig);
  }

  protected abstract _renderContent($container): void;

  onHiding() {
    // @ts-expect-error
    this.deferred.reject();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  show(_options?: unknown) {
    if (this._popup.option('visible')) {
      return;
    }

    this.deferred = Deferred();

    this._popup.show();

    return this.deferred.promise();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hide(_event?: unknown, options?: unknown) {
    this._popup.hide();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  popupOption(optionName, optionValue) {
    // @ts-expect-error
    return this._popup.option.apply(this._popup, arguments);
  }
}

export default BaseDialog;

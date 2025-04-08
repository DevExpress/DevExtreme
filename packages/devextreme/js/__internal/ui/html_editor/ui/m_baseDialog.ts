import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import {
  // @ts-expect-error
  getCurrentScreenFactor,
  hasWindow,
} from '@js/core/utils/window';
import type HtmlEditor from '@js/ui/html_editor';
import type { Properties as PopupProperties } from '@js/ui/popup';
import Popup from '@js/ui/popup';

const DIALOG_CLASS = 'dx-formdialog';
const DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';

const isSmallScreen = (): boolean => {
  const screenFactor = hasWindow() ? getCurrentScreenFactor() : null;
  return devices.real().deviceType === 'phone' || screenFactor === 'xs';
};
abstract class BaseDialog {
  _editorInstance: any;

  _popupUserConfig?: PopupProperties;

  _popup!: Popup;

  deferred?: DeferredObj<unknown>;

  constructor(editorInstance: HtmlEditor, popupConfig?: PopupProperties) {
    this._editorInstance = editorInstance;
    this._popupUserConfig = popupConfig;

    this._renderPopup();
  }

  protected _renderPopup() {
    const editorInstance = this._editorInstance;
    const $container = $('<div>')
      .addClass(DIALOG_CLASS)
      .appendTo(editorInstance.$element());
    const popupConfig = this._getPopupConfig();

    return editorInstance._createComponent($container, Popup, popupConfig);
  }

  protected _escKeyHandler(): void {
    this._popup.hide();
  }

  protected _addEscapeHandler(e): void {
    e.component.registerKeyHandler('escape', this._escKeyHandler.bind(this));
  }

  protected _getPopupConfig(): PopupProperties {
    return extend({
      onInitialized: (e) => {
        this._popup = e.component;
        this._popup.on('hiding', () => this.onHiding());
      },
      deferRendering: false,
      focusStateEnabled: false,
      fullScreen: isSmallScreen(),
      _wrapperClassExternal: `${DIALOG_CLASS} ${DROPDOWN_EDITOR_OVERLAY_CLASS}`,
      contentTemplate: (contentElem) => {
        this._renderContent($(contentElem));
      },
    }, this._popupUserConfig) as PopupProperties;
  }

  protected abstract _renderContent($contentElem: dxElementWrapper): void;

  onHiding(): void {
    this.deferred?.reject();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  show(_options?: unknown): Promise<unknown> | undefined {
    if (this._popup.option('visible')) {
      return;
    }

    this.deferred = Deferred();

    this._popup.show();

    return this.deferred.promise();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hide(_options?: unknown, _event?: unknown): void {
    this._popup.hide();
  }

  popupOption(...args) {
    // @ts-expect-error
    return this._popup.option.apply(this._popup, args);
  }
}

export default BaseDialog;
